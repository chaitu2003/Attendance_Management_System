import React from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentManagementPage.css';  // Import the CSS file

const StudentManagementPage = () => {
    const navigate = useNavigate();

    return (
        <div className="student-container">
            <h1 className="student-title">Student Management Page</h1>
            <div className="student-buttons">
                <button className="student-button" onClick={() => navigate('/add-student')}>
                    Create Student
                </button>
                <button className="student-button" onClick={() => navigate('/update-students')}>
                    Update Student
                </button>
                {/* <button className="student-button" onClick={() => navigate('/delete-student')}>
                    Delete Student
                </button> */}
                <button className="student-back-button" onClick={() => navigate('/admin-homepage')}>Back</button>
            </div>
        </div>
    );
};

export default StudentManagementPage;
