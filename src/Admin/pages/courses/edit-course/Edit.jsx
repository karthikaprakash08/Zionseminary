import React, { useEffect, useState } from "react";
// import Nolesson from "../../Assets/Images/no-lesson-illustration.svg";
import Trash from "../../../assets/Images/trash.png";
import EditImg from "../../../assets/Images/edit.png";
// import TestData from "../../Assets/Data/courseContent.json";
import Nolesson from "../../../assets/Images/no-lesson-illustration.svg";
import BackIcon from "../../../assets/Images/left-arrow.png";
import { useNavigate } from "react-router-dom";
import NewLesson from "../new-course/NewLesson";
import { deleteDegree, updateDegree } from "../../../firebase/degreeApi";

const Edit = ({ courseDetails }) => {
  const [popupOpen, setPopupOpen] = useState({ open: false, data: null });
  const [editCourse, setEditCourse] = useState(false);
  const [currentOverview, setCurrentOverview] = useState({
    heading: "",
    content: "",
    updateIndex: null,
  });

  const navigate = useNavigate();
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: null,
    thumbnail: null,
    overviewPoints: [],
    lessons: [],
  });

  useEffect(() => {
    if (popupOpen) window.scrollTo(0, 0);
  }, [popupOpen]);

  useEffect(() => {
    setCourseData(courseDetails);
  }, [courseDetails]);

  const handledirectInput = (type, value) => {
    setCourseData({ ...courseData, [type]: value });
  };

  const handleOverviewInput = (type, value) => {
    setCurrentOverview({ ...currentOverview, [type]: value });
  };

  const addNewOverview = () => {
    if (currentOverview.heading && currentOverview.content) {
      const newOverview = courseData.overviewPoints;
      if (
        currentOverview.updateIndex === null ||
        currentOverview.updateIndex === undefined
      ) {
        newOverview.push({
          ...currentOverview,
          updateIndex: newOverview.length > 0 ? newOverview?.length : 0,
        });
        setCourseData({ ...courseData, overviewPoints: newOverview });
      } else {
        newOverview[currentOverview?.updateIndex] = currentOverview;
        setCourseData({ ...courseData, overviewPoints: newOverview });
      }
      setCurrentOverview({
        heading: "",
        content: "",
        updateIndex: null,
      });
    }
  };

  const addLessontoCourse = (lesson) => {
    console.log("lesson", lesson);
    const newLessons = [...courseData.packages];
    if (lesson?.updateIndex === null || lesson?.updateIndex === undefined) {
      newLessons.push({
        ...lesson,
        updateIndex: newLessons?.length > 0 ? newLessons?.length : 0,
      });
      setCourseData({ ...courseData, packages: newLessons });
    } else {
      newLessons[lesson.updateIndex] = lesson;
      setCourseData({ ...courseData, packages: newLessons });
    }
    setPopupOpen({ open: false });
  };

  const uploadCourse = async () => {
    if (
      courseData.domain &&
      // courseData.description &&
      courseData.packages.length > 0
      // courseData.price
    ) {
      try {
        console.log(courseDetails)
        const res = await updateDegree(courseData, courseDetails.id);
        if (res) navigate("/admin");
      } catch (error) {
        console.log(error);
      }
    } else {
      window.alert(
        "This course is not valid add at least on lesson and fill other details"
      );
    }
  };

  const deleteThisCourse = async () => {
    const confirm = window.confirm(
      "Confirm to delete this course all lessons associated will be lost"
    );
    if (confirm) {
      try {
        const res = await deleteDegree(courseDetails.id);
        if (res) navigate("/admin");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleRemoveOverview = (index) => {
    const newOverviews = [...courseData?.overviewPoints];
    newOverviews.splice(index, 1);
    setCourseData({ ...courseData, overviewPoints: newOverviews });
  };

  const handleRemoveLesson = (title) => {
    const newLessonList = courseDetails.lessons?.filter(
      (lesson) => lesson.title !== title
    );
    setCourseData({ ...courseData, lessons: newLessonList });
  };

  const openEditLesson = (lesson, index) => {
    lesson.updateIndex = index;
    setPopupOpen({ open: true, data: lesson });
  };

  const setEditValues = (overview, index) => {
    overview.updateIndex = index;
    setCurrentOverview(overview);
  };

  console.log(courseData);
  return (
    <div
      className="course-list-cnt new-course"
      style={{
        // height:  popupOpen ? "100vh" :"auto",
        overflow: popupOpen ? "hidden" : "scroll",
      }}
    >
      <div className="top-header-cnt">
        <div className="back-btn" onClick={() => navigate("/")}>
          <img src={BackIcon} alt="back" className="back-icon-img" />
        </div>
        {editCourse ? (
          <div className="top-btn-cnt">
            <div
              className=" course-delete-btn "
              onClick={() => setEditCourse(false)}
            >
              Cancel Edit
            </div>
            <div className="add-new-lesson-btn" onClick={() => uploadCourse()}>
              Update Course
            </div>
          </div>
        ) : (
          <div className="top-btn-cnt">
            <div
              className=" course-delete-btn "
              onClick={() => deleteThisCourse()}
            >
              Delete Course
            </div>
            <div
              className="add-new-lesson-btn"
              onClick={() => setEditCourse(true)}
            >
              Edit Course
            </div>
          </div>
        )}
      </div>
      <div className="top-header-cnt">
        <div>
          <h3 className="course-new-title">Course Details</h3>
          <p className="course-new-discription">Edit course and publish</p>
        </div>
        {/* <div className="top-btn-cnt">
          <div className=" course-delete-btn " onClick={() => navigate("/")}>
            Cancel
          </div>
          <div className="add-new-lesson-btn" onClick={() => uploadCourse()}>
            Save Course
          </div>
        </div> */}
      </div>
      <div className="input-split-cover">
        <form className="left-form">
          <div className="course-name-cnt">
            <p>Enter course Name</p>
            <input
              type="text"
              name=""
              id=""
              className="name-input"
              value={courseData.domain}
              readOnly={editCourse ? false : true}
              onChange={(e) => handledirectInput("domain", e.target.value)}
            />
          </div>

          <div className="course-description-cnt">
            <p>Describe course</p>
            <textarea
              type="text"
              name=""
              id=""
              className="description-input"
              readOnly={editCourse ? false : true}
              value={courseData.description}
              onChange={(e) => handledirectInput("description", e.target.value)}
            />
          </div>
          <div className="flex-input">
            <div className="course-name-cnt responsive-input">
              <p>Enter course price</p>
              <input
                type="number"
                name=""
                id=""
                readOnly={editCourse ? false : true}
                value={courseData.price !== null ? courseData.price : ""}
                className="name-input price-input"
                placeholder="₹"
                onChange={(e) => handledirectInput("price", e.target.value)}
              />
            </div>
            <div className="course-name-cnt">
              <p>Upload course thumnale</p>
              <input
                type="file"
                name=""
                id=""
                className="styled-input"
                placeholder=""
              />
            </div>
          </div>
        </form>
        <form className="form-right">
          <div className="form-right-header">
            <h3 className="course-new-title form-right-heading">
              List The Lessons
            </h3>
            {editCourse && (
              <div
                className="add-new-lesson-btn"
                onClick={() => setPopupOpen({ open: true, data: null })}
              >
                Add new lesson{" "}
              </div>
            )}
          </div>
          <div className="lesson-list-cnt">
            {courseData.packages?.length > 0 ? (
              courseData?.packages?.map((lesson, index) => (
                <div
                  className="lesson"
                  style={{ pointerEvents: editCourse ? "all" : "none" }}
                  onClick={() => openEditLesson(lesson, index)}
                >
                  <h1 className="lesson-number">{index + 1}</h1>
                  <div className="lesson-title-cnt">
                    <h3 className="lesson-title">{lesson?.name}</h3>
                  </div>
                  <ul className="lesson-subtitle-cnt">
                    {lesson?.features?.map((feature) => (
                      <li>
                        <p className="lesson-subtitle">{feature}</p>
                        <p className="lesson-duration-txt">
                          duration : {feature?.duration}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <div className="no-lesson-cnt">
                <img
                  src={Nolesson}
                  alt="no-lesson"
                  className="empty-lesson-img"
                />
              </div>
            )}
          </div>
        </form>
      </div>
      {popupOpen.open && (
        <NewLesson
          addLesson={(lesson) => addLessontoCourse(lesson)}
          editData={popupOpen?.data}
          cancel={() => setPopupOpen({ open: false, data: null })}
          removeThisLesson={(Id) => handleRemoveLesson(Id)}
        />
      )}
    </div>
  );
};

export default Edit;
