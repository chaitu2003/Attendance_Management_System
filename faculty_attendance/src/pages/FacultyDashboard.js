import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FacultyDashboard.css';

const FacultyDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-heading">Faculty Dashboard</h1>
            <div className="button-container">
                <button className="dashboard-btn" onClick={() => navigate('/post-attendance')}>
                    Post Attendance
                </button>
                <button className="dashboard-btn" onClick={() => navigate('/attendance-report')}>
                    View Attendance Report
                </button>
                <button className="back-btn" onClick={() => navigate('/')}>Back</button>
            </div>
        </div>
    );
};

export default FacultyDashboard;