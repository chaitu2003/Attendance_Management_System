import React from "react";
import { useNavigate } from "react-router-dom";
import "./FacultyManagementPage.css"; // Import CSS file

const FacultyManagementPage = () => {
  const navigate = useNavigate();

  return (
    <div className="faculty-container">
      <h1 className="faculty-title">Faculty Management</h1>
      <div className="faculty-buttons">
        <button className="faculty-button" onClick={() => navigate("/add-faculty")}>
          Create Faculty
        </button>
        <button className="faculty-button" onClick={() => navigate("/update-faculty")}>
          Update Faculty
        </button>
        <button className="faculty-back-button" onClick={() => navigate("/admin-homepage")}>
          Back
        </button>
      </div>
    </div>
  );
};

export default FacultyManagementPage;
