import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Import the CSS file

const Dashboard = ({ authData }) => {
    const navigate = useNavigate();
    const handleViewAttendance = () => {
        navigate('/attendance');
    };

    return (
        <div className="dashboard-background">
            <div className="dashboard-container">
                <h1 className="dashboard-heading">Welcome, {authData.name}</h1>
                <button className="view-attendance-btn" onClick={handleViewAttendance}>
                    View My Attendance
                </button>
            </div>
        </div>
    );
}; 

export default Dashboard;