import React, { useEffect, useState } from "react";
import Trash from "../../../assets/Images/trash.png";
import Edit from "../../../assets/Images/edit.png";
import Test from "../../../assets/Images/exam.png";

// import { uploadDocument, uploadVedio } from "../../../api/baseApi";
import BackIcon from "../../../assets/Images/left-arrow.png";
import AddTest from "./AddTest";
import LessonPopUp from "../../../components/courses/LessonPopUp";

const initialState = {
  name: "",
  description: "",
  packages:[],
  updateIndex: null,
  testId: null,
}

const NewLesson = ({ addLesson, cancel, editData, removeThisLesson }) => {
  const [currentCourse,setCurrentCourse] = useState(initialState)
  const [openTest, setOpenTest] = useState({ open: false, data: null })
  const [openLessonPopUP, setOPenLessonPopUP] = useState({ open: false, data: null })

  return (
    <div className="lesson-popup-cnt">
      <div className="lesson-new-cnt">
        {
          openLessonPopUP.open && (
            <LessonPopUp 
            cancel={()=>setOPenLessonPopUP({open:false, data: null})}
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
          
        </div>
      </div>
    </div>
  );
};

export default NewLesson;
