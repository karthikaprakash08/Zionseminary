import React, { useEffect, useState } from "react";
import Trash from "../../../assets/Images/trash.png";
import Edit from "../../../assets/Images/edit.png";
import Test from "../../../assets/Images/exam.png";
// import { uploadDocument, uploadVedio } from "../../../api/baseApi";
import BackIcon from "../../../assets/Images/left-arrow.png";
import { findFileType } from "../../../hooks/newCourseFunctions";

const NewLesson = ({ addLesson, cancel, editData, removeThisLesson }) => {

  const [currentLesson, setCurrentLesson] = useState({
    name: null,
    features: [],
    updateIndex: null,
  });
  // const [currentSublesson, setCurrentSublesson] = useState({
  //   title: "",
  //   duration: "",
  //   link: "#",
  //   updateIndex: null,
  //   type: null,
  // });
  const [currentSublesson, setCurrentSublesson] = useState("")
  const [currentUpdateIndex, setCurrentUpdateIndex] = useState(null)
  const [sublessonFile, setSublessonFile] = useState(null);

  const handleAddFile = (file) => {
    const filetype = findFileType(file);
    console.log("filetype", filetype);
    setSublessonFile(file);
    setCurrentSublesson({ ...currentSublesson, type: filetype });
  };

  const handleSubLessonsInput = (type, value) => {
    setCurrentSublesson({ ...currentSublesson, [type]: value });
  };

  const getVideoURL = async () => {
    try {
      const vedioFormData = new FormData();
      vedioFormData.append("video", sublessonFile);
      const { data } = await uploadVedio(vedioFormData);
      console.log(data);
      // setCurrentSublesson({...currentSublesson,url:data?.videoUrl})
      return data?.videoUrl;
    } catch (error) {
      console.log(error);
    }
  };

  const getDocumentUrl = async () => {
    try {
      const vedioFormData = new FormData();
      vedioFormData.append("document", sublessonFile);
      const { data } = await uploadDocument(vedioFormData);
      console.log(" doc response -> data", data);
      return data?.url;
    } catch (error) {
      console.log(error);
    }
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
        setCurrentSublesson("")
      } else {
        newLessons[currentUpdateIndex] = currentSublesson;
        setCurrentLesson({ ...currentLesson, features: newLessons });
        setCurrentSublesson('')
      }
    } else if (
      currentSublesson
    ) {
      newLessons[currentSublesson.updateIndex] = currentSublesson;
      setCurrentLesson({ ...currentLesson, features: newLessons });
      setCurrentSublesson("")
    } else {
      newLessons[currentUpdateIndex] = currentSublesson
      setCurrentLesson({ ...currentLesson, features: newLessons });
      setCurrentSublesson('')
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

  console.log(currentLesson, currentUpdateIndex);

  useEffect(() => {
    if (editData) setCurrentLesson(editData);
  }, [editData]);

  const handleDelete = () => {
    const confirm = window.confirm(
      "Confirm to delete this lesson, all subLessons will be deleted"
    );
    console.log(editData?.title);
    if (confirm) {
      removeThisLesson(editData.name);
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
                value={currentSublesson}
                className="sublesson-title-input"
                onChange={(e) => setCurrentSublesson(e.target.value)}
              />
            </div>
            <div className="sublesson-content-cover">
              <div
                className="add-new-lesson-btn add-sublesson-btn"
                onClick={() => addSublessons()}
              >
                {currentUpdateIndex !== null ? "Update" : "Add"}
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
                <div className="sublesson-content-cover">

                  <p className="sublesson-title-txt">Sub lesson Title</p>
                  <div
                    className="add-new-lesson-btn add-sublesson-btn edit-sublesson-btn"
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
                <input
                  type="text"
                  name=""
                  id=""
                  value={sublesson}
                  className="sublesson-title-input sublesson-card-input"
                />
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewLesson;
