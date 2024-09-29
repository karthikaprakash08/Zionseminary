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


const initialState = {
  name: "",
  description: "",
  packages: [],
  updateIndex: null,
  testId: null,
}

const NewLesson = ({ addLesson, cancel, editData, removeThisLesson }) => {
  const [currentCourse, setCurrentCourse] = useState(initialState)
  const [openTest, setOpenTest] = useState({ open: false, data: null })
  const [isfold, setFold] = useState(null)
  const [openLessonPopUP, setOPenLessonPopUP] = useState({ open: false, data: null })

  const addLessonToCourse = (lesson) => {
    setCurrentCourse({ ...currentCourse, packages: [...currentCourse.packages, lesson] })
  }

  const getFiletypeImg = (filetype) => {
    if (filetype === 'video') return Video
    if (filetype === 'test') return Test
    return Doc
  }

  console.log(currentCourse)

  return (
    <div className="lesson-popup-cnt">
      <div className="lesson-new-cnt">
        {
          openLessonPopUP.open && (
            <LessonPopUp
              addLesson={(lesson) => addLessonToCourse(lesson)}
              // removeThisLesson={}
              cancel={() => setOPenLessonPopUP({ open: false, data: null })}
            />
          )
        }
        {openTest.open && (
          <AddTest
            testId={currentCourse?.testId}
            addTest={(data) => {
              setCurrentLesson({ ...currentCourse, testId: data });
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
              onClick={() => validateAndUpdateLesson()}
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
              name=""
              id=""
              value={currentCourse.name}
              className="lesson-title-input"
              onChange={(e) =>
                setCurrentLesson({
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
                style={{height:'4.5rem'}}
                // value={currentSublesson.name}
                className="sublesson-title-input"
              // onChange={(e) => setCurrentSublesson({ ...currentSublesson, name: e.target.value })}
              />
            </div>
            <div className="add-newLesson-btn" onClick={() => setOPenLessonPopUP({ open: true, data: null })}>
              <p>Add New Lesson </p>
            </div>
          </div>
        </div>
        <div className="content-list">
          {
            currentCourse?.packages?.length > 0 &&
            currentCourse?.packages?.map((lesson, index) => (
              <div
                className="lesson-list-item-cnt"
                key={index}
                onClick={() => setFold(isfold !== index ? index : null)}
              >
                <div className="lesson-list-name-cnt">
                  <div className="lesson-edit-delete-cnt">
                    <img src={ArrowRight} alt="arrow" style={{rotate:isfold === index ? '90deg': '0deg'}} className="edit-img"/>
                  <p>{lesson.name}</p>
                  </div>
                  <div className="lesson-edit-delete-cnt">
                    <img src={Edit} alt="edit" className="edit-img" onClick={() => setOPenLessonPopUP({ open: true, data: lesson })} />
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
                    lesson.features?.map((sublesson, subIndex) => (
                      <div className="features-cnt">
                        <div className="lesson-edit-delete-cnt">
                          <img src={getFiletypeImg(sublesson.type)} alt="fileType" className="icon-image-small" />
                          <p>{sublesson.name}</p>
                        </div>
                        <p>{sublesson.duration}</p>
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
