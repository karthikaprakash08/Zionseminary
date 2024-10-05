import { db, storage } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs } from 'firebase/firestore';
import { uploadToVimeo } from './externalServices';
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addNewTest, updateTest } from './testApi';

// Upload file to storage
export const uploadFile = async (file, type) => {
  let fileURL = '';
  try {
    if (type === 'video') {
      fileURL = await uploadToVimeo(file);
    } else if (['image', 'document', 'pdf', 'ppt'].includes(type)) {
      const fileRef = ref(storage, `${type}s/${uuidv4()}_${file.name}`);
      await uploadBytes(fileRef, file);
      fileURL = await getDownloadURL(fileRef);
      console.log('File uploaded to Firebase Storage, URL:', fileURL);
    }
    return fileURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('File upload failed');
  }
};

// Add Degree with courses
export const addDegree = async (degreeData) => {
  try {
    const degreeId = uuidv4();
    const courses = await Promise.all(degreeData.courses.map(async (course) => {
      let thumbnailUrl = '';
      if (course.thumbnail) {
        thumbnailUrl = await uploadFile(course.thumbnail, 'image');
      }

      return {
        course_id: uuidv4(),
        title: course.title,
        overviewPoints: course.overviewPoints,
        description: course.description,
        image: course.image || '',
        lessons: await Promise.all(course.lessons.map(async (lesson) => {
          return {
            lesson_id: uuidv4(),
            title: lesson.title,
            description: lesson.description,
            chapters: await Promise.all(lesson.chapters.map(async (chapter) => {
              return {
                title: chapter.title,
                type: chapter.type,
                link: chapter.link,
                duration: chapter.duration,
              };
            })),
            test: lesson.test ? {
              test_id: lesson.test.test_id,
              title: lesson.test.title,
              timeLimit: lesson.test.timeLimit,
              questions: lesson.test.questions.map((question) => ({
                question: question.question,
                options: question.options,
                correctAnswer: question.correctAnswer,
              })),
            } : null,
          };
        })),
        header: course.header || '',
        videoUrl: course.videoUrl || '',
      };
    }));

    await addDoc(collection(db, 'degrees'), {
      id: degreeId,
      degree_title: degreeData.degree_title,
      description: degreeData.description,
      price: degreeData.price,
      thumbnail: degreeData.thumbnail || null,
      courses,
      createdAt: Date.now(),
    });

    console.log('Degree with courses successfully saved to Firestore!');
    return degreeId;
  } catch (error) {
    console.error('Error saving degree:', error);
    return null;
  }
};

// Edit Degree
export const editDegree = async (degreeId, degreeData) => {
  try {
    const degreeRef = doc(db, 'degrees', degreeId);
    await updateDoc(degreeRef, { ...degreeData, updatedAt: Date.now() });
    console.log('Degree updated successfully!');
    return true;
  } catch (error) {
    console.error('Error updating degree:', error);
    return false;
  }
};

// Delete Degree
export const deleteDegree = async (degreeId) => {
  try {
    await deleteDoc(doc(db, 'degrees', degreeId));
    console.log('Degree deleted successfully!');
    return true;
  } catch (error) {
    console.error('Error deleting degree:', error);
    return false;
  }
};

// Add Course under a Degree
export const addCourseToDegree = async (degreeId, courseData) => {
  try {
    const degreeRef = doc(db, 'degrees', degreeId);
    const newCourse = {
      course_id: uuidv4(),
      title: courseData.title,
      description: courseData.description,
      createdAt: Date.now(),
    };

    await updateDoc(degreeRef, {
      courses: firebase.firestore.FieldValue.arrayUnion(newCourse),
    });

    console.log('Course successfully added to degree!');
    return newCourse.course_id;
  } catch (error) {
    console.error('Error adding course:', error);
    return null;
  }
};

// Edit Course
export const editCourse = async (degreeId, courseId, updatedCourseData) => {
  try {
    const degreeRef = doc(db, 'degrees', degreeId);
    const degreeSnapshot = await getDoc(degreeRef);
    const degreeData = degreeSnapshot.data();

    const updatedCourses = degreeData.courses.map(course =>
      course.course_id === courseId
        ? { ...course, ...updatedCourseData, updatedAt: Date.now() }
        : course
    );

    await updateDoc(degreeRef, { courses: updatedCourses });
    console.log('Course updated successfully!');
    return true;
  } catch (error) {
    console.error('Error updating course:', error);
    return false;
  }
};

// Delete Course
export const deleteCourse = async (degreeId, courseId) => {
  try {
    const degreeRef = doc(db, 'degrees', degreeId);
    const degreeSnapshot = await getDoc(degreeRef);
    const degreeData = degreeSnapshot.data();

    const updatedCourses = degreeData.courses.filter(course => course.course_id !== courseId);

    await updateDoc(degreeRef, { courses: updatedCourses });
    console.log('Course deleted successfully!');
    return true;
  } catch (error) {
    console.error('Error deleting course:', error);
    return false;
  }
};

// Add Lesson to a Course
export const addLessonToCourse = async (degreeId, courseId, lessonData) => {
  try {
    const degreeRef = doc(db, 'degrees', degreeId);
    const degreeSnapshot = await getDoc(degreeRef);
    const degreeData = degreeSnapshot.data();

    const updatedCourses = await Promise.all(degreeData.courses.map(async (course) => {
      if (course.course_id === courseId) {
        const newLesson = {
          lesson_id: uuidv4(),
          title: lessonData.title,
          description: lessonData.description,
          chapters: await Promise.all(lessonData.chapters.map(async (chapter) => {
            return {
              title: chapter.title,
              type: chapter.type,
              link: chapter.file ? await uploadFile(chapter.file, chapter.type) : '',
              duration: chapter.duration,
            };
          })),
        };

        // Create a new test using the testApi
        if (lessonData.test) {
          const testId = await addNewTest(lessonData.test);
          newLesson.test_id = testId;
        }

        return {
          ...course,
          lessons: [...(course.lessons || []), newLesson],
        };
      }
      return course;
    }));

    await updateDoc(degreeRef, { courses: updatedCourses });
    console.log('Lesson successfully added to course!');
    return true;
  } catch (error) {
    console.error('Error adding lesson:', error);
    return false;
  }
};

// Edit Lesson
export const editLesson = async (degreeId, courseId, lessonId, updatedLessonData) => {
  try {
    const degreeRef = doc(db, 'degrees', degreeId);
    const degreeSnapshot = await getDoc(degreeRef);
    const degreeData = degreeSnapshot.data();

    const updatedCourses = await Promise.all(degreeData.courses.map(async (course) => {
      if (course.course_id === courseId) {
        const updatedLessons = await Promise.all(course.lessons.map(async (lesson) => {
          if (lesson.lesson_id === lessonId) {
            const updatedLesson = { ...lesson, ...updatedLessonData, updatedAt: Date.now() };

            
            if (updatedLessonData.test) {
              const updatedTestId = await updateTest(lesson.test_id, updatedLessonData.test);
              updatedLesson.test_id = updatedTestId;
            }

            return updatedLesson;
          }
          return lesson;
        }));

        return { ...course, lessons: updatedLessons };
      }
      return course;
    }));

    await updateDoc(degreeRef, { courses: updatedCourses });
    console.log('Lesson updated successfully!');
    return true;
  } catch (error) {
    console.error('Error updating lesson:', error);
    return false;
  }
};

// Add Chapter to a Lesson
export const addChapterToLesson = async (degreeId, courseId, lessonId, chapterData) => {
  try {
    const degreeRef = doc(db, 'degrees', degreeId);
    const degreeSnapshot = await getDoc(degreeRef);
    const degreeData = degreeSnapshot.data();

    const updatedCourses = await Promise.all(degreeData.courses.map(async (course) => {
      if (course.course_id === courseId) {
        const updatedLessons = await Promise.all(course.lessons.map(async (lesson) => {
          if (lesson.lesson_id === lessonId) {
            const newChapter = {
              title: chapterData.title,
              type: chapterData.type,
              link: chapterData.file ? await uploadFile(chapterData.file, chapterData.type) : '',
              duration: chapterData.duration,
            };

            return {
              ...lesson,
              chapters: [...(lesson.chapters || []), newChapter],
            };
          }
          return lesson;
        }));

        return { ...course, lessons: updatedLessons };
      }
      return course;
    }));

    await updateDoc(degreeRef, { courses: updatedCourses });
    console.log('Chapter added successfully!');
    return true;
  } catch (error) {
    console.error('Error adding chapter:', error);
    return false;
  }
};

// Edit Chapter
export const editChapter = async (degreeId, courseId, lessonId, chapterId, updatedChapterData) => {
  try {
    const degreeRef = doc(db, 'degrees', degreeId);
    const degreeSnapshot = await getDoc(degreeRef);
    const degreeData = degreeSnapshot.data();

    const updatedCourses = await Promise.all(degreeData.courses.map(async (course) => {
      if (course.course_id === courseId) {
        const updatedLessons = await Promise.all(course.lessons.map(async (lesson) => {
          if (lesson.lesson_id === lessonId) {
            const updatedChapters = lesson.chapters.map((chapter) =>
              chapter.title === chapterId ? { ...chapter, ...updatedChapterData, updatedAt: Date.now() } : chapter
            );

            return { ...lesson, chapters: updatedChapters };
          }
          return lesson;
        }));

        return { ...course, lessons: updatedLessons };
      }
      return course;
    }));

    await updateDoc(degreeRef, { courses: updatedCourses });
    console.log('Chapter updated successfully!');
    return true;
  } catch (error) {
    console.error('Error updating chapter:', error);
    return false;
  }
};

// Delete Chapter
export const deleteChapter = async (degreeId, courseId, lessonId, chapterId) => {
  try {
    const degreeRef = doc(db, 'degrees', degreeId);
    const degreeSnapshot = await getDoc(degreeRef);
    const degreeData = degreeSnapshot.data();

    const updatedCourses = await Promise.all(degreeData.courses.map(async (course) => {
      if (course.course_id === courseId) {
        const updatedLessons = await Promise.all(course.lessons.map(async (lesson) => {
          if (lesson.lesson_id === lessonId) {
            const updatedChapters = lesson.chapters.filter(chapter => chapter.title !== chapterId);
            return { ...lesson, chapters: updatedChapters };
          }
          return lesson;
        }));

        return { ...course, lessons: updatedLessons };
      }
      return course;
    }));

    await updateDoc(degreeRef, { courses: updatedCourses });
    console.log('Chapter deleted successfully!');
    return true;
  } catch (error) {
    console.error('Error deleting chapter:', error);
    return false;
  }
};
