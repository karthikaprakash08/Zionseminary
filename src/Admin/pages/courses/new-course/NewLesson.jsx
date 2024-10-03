import React, { useEffect, useState } from "react";
import Trash from "../../../assets/Images/trash.png";
import Edit from "../../../assets/Images/edit.png";
import Test from "../../../assets/Images/exam.png";
import Video from "../../../assets/Images/video-files.png";
import Doc from "../../../assets/Images/papers.png";
import ArrowRight from "../../../assets/Images/arrow-right.png";

// import { uploadDocument, uploadVedio } from "../../../api/baseApi";
import BackIcon from "../../../assets/Images/left-arrow.png";
import AddTest from "./AddTest";
import LessonPopUp from "../../../components/courses/LessonPopUp";
import { addCourseToDegree } from "../../../firebase/lessonApi";


const initialState = {
  name: "",
  description: "",
  lessons: [],
  updateIndex: null,
  testId: null,
}

const NewLesson = ({ addCourse, cancel, editData, removeThisCourse, degreeId }) => {
  const [currentCourse, setCurrentCourse] = useState(initialState)
  const [openTest, setOpenTest] = useState({ open: false, data: null })
  const [isfold, setFold] = useState(null)
  const [openLessonPopUP, setOPenLessonPopUP] = useState({ open: false, data: null })

  const addLessonToCourse = (lesson) => {
    let updatedLesson = currentCourse?.lessons ? [...currentCourse.lessons] : [];
    console.log(lesson, "here", updatedLesson);

    if (lesson?.updateIndex !== undefined && lesson.updateIndex !== null) {
      if (lesson.updateIndex >= 0 && lesson.updateIndex < updatedLesson.length) {
        console.log(lesson.updateIndex);
        updatedLesson[lesson.updateIndex] = { ...lesson };
      } else {
        console.error("Invalid update index");
      }
    } else {
      console.log("updated");
      updatedLesson.push({ ...lesson });
    }
    setCurrentCourse({ ...currentCourse, lessons: updatedLesson });
    // cancel();
  };


  const getFiletypeImg = (filetype) => {
    if (filetype === 'video') return Video
    if (filetype === 'test') return Test
    return Doc
  }

  const validateAndUpdateCourse = () => {
    if (currentCourse.description.length > 5 && currentCourse.name && currentCourse.lessons.length > 0) {
      addCourse(currentCourse)
      if (degreeId) addCourseToDegree(degreeId, currentCourse)
      cancel()
    }
  }

  useEffect(() => {
    if (editData) setCurrentCourse(editData)
  }, [editData])

  const handleRemoveLessonFromCourse = (lessonIndex) => {
    const newLessons = [...currentCourse.lessons];
    newLessons.splice(lessonIndex, 1);
    setCurrentCourse({ ...currentCourse, lessons: newLessons });
  }

  const handleDelete = () => {
    const confirm = window.confirm(
      "Confirm to delete this course, all lessons will be deleted"
    );
    console.log(editData?.title);
    if (confirm) {
      removeThisCourse(editData?.updateIndex);
      cancel();
    }
  };

  console.log(currentCourse)

  return (
    <div className="lesson-popup-cnt">
      <div className="lesson-new-cnt">
        {
          openLessonPopUP.open && (
            <LessonPopUp
              addLesson={(lesson) => addLessonToCourse(lesson)}
              editData={openLessonPopUP.data}
              removeThisLesson={(lessonIndex) => handleRemoveLessonFromCourse(lessonIndex)}
              cancel={() => setOPenLessonPopUP({ open: false, data: null })}
              degreeId={degreeId}
            />
          )
        }
        {openTest.open && (
          <AddTest
            testId={currentCourse?.testId}
            addTest={(data) => {
              setCurrentCourse({ ...currentCourse, testId: data });
            }}
            closeTest={() => setOpenTest({ open: false })}
          />
        )}
        <div className="form-right-header">
          <div className="back-btn" onClick={() => cancel()}>
            <img src={BackIcon} alt="back" className="back-icon-img" />
          </div>
          <div className="top-btn-cnt">
            {editData && (
              <div
                className="add-new-lesson-btn cancel-btn"
                onClick={() => handleDelete()}
              >
                Delete Course
              </div>
            )}
            <div
              className="add-new-lesson-btn"
              onClick={() => validateAndUpdateCourse()}
            >
              Add to Degree
            </div>
          </div>
        </div>
        <h3 className="course-new-title form-right-heading">
          Create New Course
        </h3>
        <div className="new-lesson-top">
          <div className="lesson-name-cnt">
            <p >Course Title</p>
            <input
              type="text"
              value={currentCourse?.name}
              className="lesson-title-input"
              onChange={(e) =>
                setCurrentCourse({
                  ...currentCourse,
                  name: e.target.value,
                })
              }
            />
            <div
              className="lesson-test-overview-cnt"
              onClick={() =>
                setOpenTest({ open: true, data: currentCourse.testId })
              }
            >
              <img src={Test} alt="test" className="test" />
              <p>
                {!currentCourse?.testId?.length > 3
                  ? "No Tests has been created for this lesson"
                  : `Test click to update`}
              </p>
              {/* <div className="lesson-test-overview-btn"></div> */}
            </div>
          </div>
          <div className="lesson-content-input-cnt">
            <div className="sublesson-name-cnt">
              <p>Course description</p>
              <textarea
                type="text"
                name=""
                id=""
                style={{ height: '4.5rem' }}
                value={currentCourse.description}
                className="sublesson-title-input"
                onChange={(e) => setCurrentCourse({ ...currentCourse, description: e.target.value })}
              />
            </div>
            <div className="add-newLesson-btn" onClick={() => setOPenLessonPopUP({ open: true, data: null })}>
              <p>Add New Lesson </p>
            </div>
          </div>
        </div>
        <div className="content-list">
          {
            currentCourse?.lessons?.length > 0 &&
            currentCourse?.lessons?.map((lesson, index) => (
              <div
                className="lesson-list-item-cnt"
                key={index}
                onClick={() => setFold(isfold !== index ? index : null)}
              >
                <div className="lesson-list-name-cnt">
                  <div className="lesson-edit-delete-cnt">
                    <img src={ArrowRight} alt="arrow" style={{ rotate: isfold === index ? '90deg' : '0deg' }} className="edit-img" />
                    <p>{lesson.name}</p>
                  </div>
                  <div className="lesson-edit-delete-cnt">
                    <img src={Edit} alt="edit" className="edit-img" onClick={() => setOPenLessonPopUP({ open: true, data: { ...lesson, updateIndex: index } })} />
                    <img
                      src={Trash}
                      alt="trash"
                      className="trash-img"
                      onClick={() => removeThisLesson(index)}
                    />
                  </div>
                </div>
                <div className="lesson-features-list" style={{ maxHeight: isfold === index ? '5rem' : 0 }}>
                  {
                    lesson.chapters?.map((chapter, subIndex) => (
                      <div className="features-cnt">
                        <div className="lesson-edit-delete-cnt">
                          <img src={getFiletypeImg(chapter.type)} alt="fileType" className="icon-image-small" />
                          <p>{chapter.name}</p>
                        </div>
                        <p>{chapter.duration}</p>
                      </div>
                    ))
                  }
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default NewLesson;
