import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminHomepage.css"; // Import the CSS file

const AdminHomepage = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-container">
      <h1 className="admin-title1">Attendance Management System</h1>
      <h1 className="admin-title">Admin Homepage</h1>
      <div className="admin-buttons">
        <button className="admin-button" onClick={() => navigate("/student-management")}>
          Student Management
        </button>
        <button className="admin-button" onClick={() => navigate("/subject-management")}>
          Subject Management
        </button>
        <button className="admin-button" onClick={() => navigate("/faculty-management")}>
          Faculty Management
        </button>
        <button className="admin-button back-button" onClick={() => navigate("/")}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminHomepage;
