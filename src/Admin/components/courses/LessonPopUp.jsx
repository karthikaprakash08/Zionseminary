import React, { useEffect, useState } from 'react'
import BackIcon from "../../assets/Images/left-arrow.png";
import { findFileType } from '../../hooks/newCourseFunctions';
import Test from "../../assets/Images/exam.png";
import Trash from "../../assets/Images/trash.png";
import Edit from "../../assets/Images/edit.png";
import Upload from "../../assets/Images/upload.png";
import { uploadFile } from '../../firebase/lessonApi';


const initialState = {
  name: "",
  duration: "",
  link: "",
  updateIndex: null,
  type: null,
}


const LessonPopUp = ({ addLesson, cancel, editData, removeThisLesson }) => {
  const [currentLesson, setCurrentLesson] = useState({
    name: null,
    features: [],
    updateIndex: null,
    testId: null
  });
  const [currentSublesson, setCurrentSublesson] = useState(initialState);
  const [currentUpdateIndex, setCurrentUpdateIndex] = useState(null)
  const [uploadingFile, setUploadingFile] = useState(false)

  const handleAddFile = async (file) => {
    setUploadingFile(true)
    const filetype = findFileType(file);
    console.log("filetype", filetype);
    const link = await uploadFile(file, filetype)
    console.log("link", link);
    setCurrentSublesson({ ...currentSublesson, link: link,type: filetype });
    setUploadingFile(false)
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
    } else if (currentSublesson) {
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

  console.log(currentSublesson, currentUpdateIndex);

  useEffect(() => {
    if (editData) setCurrentLesson(editData);
  }, [editData]);

  return (
    <div className='lesson-popup-page'>
      <div className='lesson-popup'>
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
              Add to Course
            </div>
          </div>
        </div>
        <div className='lesson-data-inputs-cnt'>
          <div className="lesson-name-cnt">
            <p>Lesson Title</p>
            <input
              type="text"
              name=""
              id=""
              value={currentLesson.name}
              className="sublesson-title-input"
            onChange={(e) => setCurrentLesson({ ...currentLesson, name: e.target.value })}
            />
          </div>
          <div className="lesson-content-input-cnt">
            <div className="sublesson-name-cnt">
              <p>Sub lesson Title</p>
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
              <div className="input-cnt add-sublesson-btn flex-input">
                <div className="sublesson-title-input center-media">
                  <img src={Upload} alt="imag" className='test-icon' />
                  {/* {currentSublesson.link.length > 5 && !uploadingFile && (<p>media uploaded</p>)}
                  {currentSublesson.link.length < 5 && !uploadingFile && (<p> upload media</p>)}
                  {uploadingFile && (<p>uploading..</p>)} */}
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
                <div className="sublesson-title-input center-media">
                  <img src={Test} alt="imag" className='test-icon' />
                  {/* {currentSublesson.link.length > 5 && !uploadingFile && (<p>media uploaded</p>)}
                  {currentSublesson.link.length < 5 && !uploadingFile && (<p> upload media</p>)}
                  {uploadingFile && (<p>uploading..</p>)} */}
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
  )
}

export default LessonPopUp