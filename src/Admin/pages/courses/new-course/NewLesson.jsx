import React, { useEffect, useState } from "react";
import Trash from "../../../assets/Images/trash.png";
import Edit from "../../../assets/Images/edit.png";
import Test from "../../../assets/Images/exam.png";
// import { uploadDocument, uploadVedio } from "../../../api/baseApi";
import BackIcon from "../../../assets/Images/left-arrow.png";
import { findFileType } from "../../../hooks/newCourseFunctions";
import { uploadFile } from "../../../firebase/lessonApi";

const initialState = {
  name: "",
  duration: "",
  link: "#",
  updateIndex: null,
  type: null,
}

const NewLesson = ({ addLesson, cancel, editData, removeThisLesson }) => {

  const [currentLesson, setCurrentLesson] = useState({
    name: null,
    features: [],
    updateIndex: null,
  });
  const [currentSublesson, setCurrentSublesson] = useState(initialState);
  const [currentUpdateIndex, setCurrentUpdateIndex] = useState(null)
  const [uploadingFile, setUploadingFile] = useState(false)

  const handleAddFile = async (file) => {
    const filetype = findFileType(file);
    console.log("filetype", filetype);
    const link = await uploadFile(file, filetype)
    console.log("link", link);
    setCurrentSublesson({ ...currentSublesson, link: link });
  };

  const handleSubLessonsInput = (type, value) => {
    setCurrentSublesson({ ...currentSublesson, [type]: value });
  };

  const addSublessons = async () => {
    const newLessons = [...currentLesson.features];
    if (currentSublesson) {
      if (
        currentUpdateIndex === null ||
        currentUpdateIndex === undefined
      ) {
        newLessons.push(currentSublesson);
        setCurrentLesson({ ...currentLesson, features: newLessons });
        setCurrentSublesson(initialState)
      } else {
        newLessons[currentUpdateIndex] = currentSublesson;
        setCurrentLesson({ ...currentLesson, features: newLessons });
        setCurrentSublesson(initialState)
      }
    } else if (
      currentSublesson
    ) {
      newLessons[currentSublesson.updateIndex] = currentSublesson;
      setCurrentLesson({ ...currentLesson, features: newLessons });
      setCurrentSublesson(initialState)
    } else {
      newLessons[currentUpdateIndex] = currentSublesson
      setCurrentLesson({ ...currentLesson, features: newLessons });
      setCurrentSublesson(initialState)
      setCurrentUpdateIndex(null)
    }
  };

  const validateAndUpdateLesson = () => {
    if (currentLesson.name && currentLesson.features.length > 0) {
      addLesson(currentLesson);
    }
  };

  const setEditSublesson = (features, index) => {
    setCurrentSublesson(features);
    setCurrentUpdateIndex(index)
  }

  const handleRemoveSublesson = (index) => {
    const newsubLessons = [...currentLesson.features];
    newsubLessons.splice(index, 1);
    setCurrentLesson({ ...currentLesson, features: newsubLessons });
  };

  console.log(currentSublesson, currentUpdateIndex);

  useEffect(() => {
    if (editData) setCurrentLesson(editData);
  }, [editData]);

  const handleDelete = () => {
    const confirm = window.confirm(
      "Confirm to delete this lesson, all subLessons will be deleted"
    );
    console.log(editData?.title);
    if (confirm) {
      removeThisLesson(editData?.name);
      cancel();
    }
  };

  return (
    <div className="lesson-popup-cnt">
      <div className="lesson-new-cnt">
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
              value={currentLesson.name}
              className="lesson-title-input"
              onChange={(e) =>
                setCurrentLesson({
                  ...currentLesson,
                  name: e.target.value,
                })
              }
            />
          </div>
          <div className="lesson-content-input-cnt">
            <div className="sublesson-name-cnt">
              <p>Lesson Title</p>
              <input
                type="text"
                name=""
                id=""
                value={currentSublesson.name}
                className="sublesson-title-input"
                onChange={(e) => setCurrentSublesson({ ...currentSublesson, name: e.target.value })}
              />
            </div>
            <div className="sublesson-content-cover">
              <div className="input-cnt">
                <p>Duration</p>
                <input
                  type="text"
                  name=""
                  id=""
                  className="sublesson-duration-input sublesson-title-input "
                  value={currentSublesson.duration}
                  onChange={(e) =>
                    handleSubLessonsInput("duration", e.target.value)
                  }
                />
              </div>
              <div className="input-cnt add-sublesson-btn">
                <div className="sublesson-title-input center-media">
                  <p>{currentSublesson.link ? 'new media' : 'upload media'}</p>
                  <input
                    type="file"
                    name="video-upload"
                    accept="video/*,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                    style={{ position: "absolute" }}
                    id=""
                    className="file-title-input"
                    onChange={(e) => handleAddFile(e.target.files[0])}
                  />
                </div>
              </div>
              <div
                className="add-new-lesson-btn add-sublesson-btn"
                onClick={() => addSublessons()}
              >
                {currentUpdateIndex !== null ? 'Update' : 'Add'}
              </div>
            </div>
          </div>
        </div>
        <div className="content-list">
          {currentLesson?.features?.map((sublesson, index) => (
            <div
              className="lesson-content-input-cnt sublesson"
              key={index}
              style={{
                background:
                  currentSublesson.updateIndex === index ? "#eaeaea" : null,
              }}
            >
              <div className="sublesson-name-cnt">
                <p className="sublesson-title-txt">Sub lesson Title</p>
                <input
                  type="text"
                  name=""
                  id=""
                  value={sublesson?.name}
                  className="sublesson-title-input sublesson-card-input"
                />
              </div>
              <div className="sublesson-content-cover">
                <div className="input-cnt sublesson-title-txt">
                  <p>Duration</p>
                  <input
                    type="text"
                    name=""
                    id=""
                    value={sublesson?.duration}
                    className="sublesson-duration-input sublesson-title-input sublesson-card-input"
                  />
                </div>
                <div className="input-cnt add-sublesson-btn">
                  <div
                    className="sublesson-title-input center-media sublesson-card-input"
                    onClick={() => window.open(sublesson?.link)}
                  >
                    <p className="sublesson-title-txt">open media</p>
                  </div>
                </div>
                <div
                  className="add-new-lesson-btn add-sublesson-btn edit-sublesson-btn"
                //   onClick={() => setPopupOpen(false)}
                >
                  <div className="delete-btn">
                    <img
                      src={Trash}
                      alt="delete"
                      className="action-btn-img"
                      onClick={() => handleRemoveSublesson(index)}
                    />
                  </div>
                  <div className="delete-btn">
                    <img
                      src={Edit}
                      alt="edit"
                      className="action-btn-img"
                      onClick={() => setEditSublesson(sublesson, index)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewLesson;
