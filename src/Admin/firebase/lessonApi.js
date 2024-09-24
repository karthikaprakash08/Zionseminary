import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db, storage } from './firebase'; 
import { uploadToVimeo } from './externalServices'; 
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'; // Firebase Storage


export const uploadFile = async (file, type) => {
  let fileURL = '';
  try {
    if (type === 'video') {
      fileURL = await uploadToVimeo(file);
    } else if (type === 'document' || type === 'pdf' || type === 'ppt') {
     
      const fileRef = ref(storage, `documents/${uuidv4()}_${file.name}`);
      await uploadBytes(fileRef, file);  // Upload file to Firebase
      fileURL = await getDownloadURL(fileRef); 
      console.log('File uploaded to Firebase Storage, URL:', fileURL);
    }
    return fileURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('File upload failed');
  }
};


export const addCourse = async (courseData) => {
  try {
    const courseId = uuidv4(); 
    await addDoc(collection(db, 'courses'), {
      courseId,  
      name: courseData.name,
      description: courseData.description,
      createdAt: Date.now(),
    });

    console.log('Course successfully saved to Firestore!');
    return courseId;  
  } catch (error) {
    console.error('Error saving course:', error);
    return null;
  }
};


export const addLesson = async (lessonData, courseId) => {
  try {
    const lessonId = uuidv4();  
    const features = await Promise.all(
      lessonData.features.map(async (sublesson) => {
        let fileURL = '';

        if (sublesson.file) {
          fileURL = await uploadFile(sublesson.file, sublesson.type);  
        }

        return { ...sublesson, link: fileURL };  
      })
    );

    await addDoc(collection(db, 'lessons'), {
      lessonId,  
      courseId,  
      name: lessonData.name,
      features, 
      createdAt: Date.now(),
    });

    console.log('Lesson successfully saved to Firestore!');
    return lessonId; 
  } catch (error) {
    console.error('Error saving lesson:', error);
    return null;
  }
};


export const getLessonsByCourse = async (courseId) => {
  try {
    const data = await getDocs(collection(db, 'lessons'));
    const lessons = data.docs
      .filter((doc) => doc.data().courseId === courseId)  
      .map((doc) => ({ id: doc.id, ...doc.data() }));
    return lessons;
  } catch (error) {
    console.error('Error getting lessons:', error);
  }
};


export const editLesson = async (lessonId, lessonData, courseId) => {
  try {
    const features = await Promise.all(
      lessonData.features.map(async (sublesson) => {
        let fileURL = '';

        if (sublesson.file) {
          fileURL = await uploadFile(sublesson.file, sublesson.type);  
        }

        return { ...sublesson, link: fileURL };  
      })
    );

    await updateDoc(doc(db, 'lessons', lessonId), {
      name: lessonData.name,
      features,
      courseId,  
      updatedAt: Date.now(),
    });

    console.log('Lesson successfully updated in Firestore!');
    return true;
  } catch (error) {
    console.error('Error updating lesson:', error);
  }
};


export const deleteLesson = async (lessonId) => {
  try {
    await deleteDoc(doc(db, 'lessons', lessonId));
    console.log('Lesson successfully deleted!');
    return true;
  } catch (error) {
    console.error('Error deleting lesson:', error);
  }
};
