import React, { useEffect, useState } from "react";
import Nolesson from "../../../assets/Images/no-lesson-illustration.svg";
import { useNavigate } from "react-router-dom";
import NewLesson from "./NewLesson";
import { addDegree } from "../../../firebase/lessonApi";
// import { addnewCourse } from "../../../api/baseApi";
// import { convertToCourseFormData } from "../../../hooks/newCourseFunctions";

const NewCourse = () => {
  const [popupOpen, setPopupOpen] = useState({ open: false, data: null });
  const [currentOverview, setCurrentOverview] = useState({
    heading: "",
    content: "",
    updateIndex: null,
  });

  const navigate = useNavigate();
  const [courseData, setCourseData] = useState({
    name: "",
    description: "",
    price: null,
    thumbnail: null,
    overviewPoints: [],
    courses: [],
  });

  useEffect(() => {
    if (popupOpen) window.scrollTo(0, 0);
  }, [popupOpen]);

  const handledirectInput = (type, value) => {
    setCourseData({ ...courseData, [type]: value });
  };
  
  const handleDeleteCourse = (courseIndex) => {
    const newCourseData = [ ...courseData.courses]
    newCourseData.splice(courseIndex, 1);
    setCourseData({...courseData, courses: newCourseData });
  }

  const addLessontoCourse = (lesson) => {
    console.log(lesson)
    const newCourse = [...courseData.courses];
    if (lesson.updateIndex === null) {
      newCourse.push({
        ...lesson,
        updateIndex: newCourse?.length > 0 ? newCourse?.length : 0,
      });
      setCourseData({ ...courseData, courses: newCourse });
    } else {
      newCourse[lesson.updateIndex] = lesson;
      setCourseData({ ...courseData, courses: newCourse });
    }
    setPopupOpen({ open: false });
  };

  const uploadCourse = async () => {
    if (
      courseData.name &&
      // courseData.description &&
      courseData.courses.length > 0 &&
      courseData.price
    ) {
      // const courseFormData = convertToCourseFormData(courseData)
      const response = await addDegree(courseData);
      console.log(response);
      if (response) navigate('/admin')
    }
  };

  console.log(courseData)

  return (
    <div
      className="course-list-cnt new-course"
      style={{
        // height: popupOpen.open ? "100vh" : "auto",
        overflow: popupOpen.open ? "hidden" : "scroll",
      }}
    >
      <div className="top-header-cnt">
        <div>
          <h3 className="course-new-title">Create New Degree</h3>
          <p className="course-new-discription">
            Create new degree and lets publish
          </p>
        </div>
        <div className="top-btn-cnt">
          <div className=" course-delete-btn " onClick={() => navigate("/")}>
            Cancel
          </div>
          <div className="add-new-lesson-btn" onClick={() => uploadCourse()}>
            Save Degree
          </div>
        </div>
      </div>
      <div className="input-split-cover">
        <form className="left-form">
          <div className="course-name-cnt">
            <p>Enter degree Name</p>
            <input
              type="text"
              name=""
              id=""
              value={courseData?.name}
              className="name-input"
              onChange={(e) => handledirectInput("name", e.target.value)}
            />
          </div>

          {/* <div className="course-description-cnt">
            <p>Describe degree</p>
            <textarea
              type="text"
              name=""
              id=""
              value={courseData?.description}
              className="description-input"
              onChange={(e) => handledirectInput("description", e.target.value)}
            />
          </div> */}
          <div className="flex-input">
            <div className="course-name-cnt">
              <p>Enter degree price</p>
              <input
                type="number"
                name=""
                id=""
                value={courseData.price !== null ? courseData.price : ""}
                className="name-input price-input"
                placeholder="₹"
                onChange={(e) => handledirectInput("price", e.target.value)}
              />
            </div>
          </div>
          <div className="course-name-cnt">
            <p>Upload degree thumbnail</p>
            <input
              type="file"
              accept="png,svg"
              onChange={(e) => setCourseData({ ...courseData, thumbnail: e.target.files[0] })}
              className="styled-input"
            />
          </div>
        </form>
        <form className="form-right">
          <div className="form-right-header">
            <h3 className="course-new-title form-right-heading">
              Course List
            </h3>
            <div
              className="add-new-lesson-btn"
              onClick={() => setPopupOpen({ open: true, data: null })}
            >
              Add new course
            </div>
          </div>

          <div className="lesson-list-cnt">
            {courseData.courses?.length > 0 ? (
              courseData?.courses?.map((lesson, index) => (
                <div
                  className="lesson"
                  onClick={() => setPopupOpen({ open: true, data: lesson })}
                >
                  <h1 className="lesson-number">{index + 1}</h1>
                  <div className="lesson-title-cnt">
                    <h3 className="lesson-title">{lesson?.name}</h3>
                  </div>
                  <ul className="lesson-subtitle-cnt">
                    {lesson?.lessons?.map((sublesson) => (
                      <li>
                        <p className="lesson-subtitle">{sublesson?.name}</p>
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
            {/*  */}
          </div>
        </form>
      </div>
      {popupOpen.open && (
        <NewLesson
          addCourse={(course) => addLessontoCourse(course)}
          editData={popupOpen?.data}
          cancel={() => setPopupOpen({ open: false, data: null })}
          removeThisCourse={(index) => handleDeleteCourse(index)}
        />
      )}
    </div>
  );
};

export default NewCourse;
