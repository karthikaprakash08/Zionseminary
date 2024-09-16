import React from "react";
import Edit from "./Edit";
import { useLocation } from "react-router-dom";
import LeftBar from "../../../components/global/sidebar/LeftBar";

const EditCourse = () => {
  const data = useLocation().state;
  console.log(data)
  return (
    <div className="courses-page">
      <LeftBar />
      <Edit courseDetails={data} />
    </div>
  );
};

export default EditCourse;
