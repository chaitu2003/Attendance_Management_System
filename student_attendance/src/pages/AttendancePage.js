import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook for routing
import './AttendancePage.css';

const AttendancePage = ({ authData, setAuthData }) => {
    const [attendance, setAttendance] = useState([]);
    const navigate = useNavigate();  // Initialize navigate hook

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const response = await axios.get(
                    `http://attendance-management-system-s3xb.onrender.com/api/attendance/studentAttendancePerSubject/${authData.studentId}`,
                    {
                        headers: { Authorization: `Bearer ${authData.token}` },
                    }
                );
                setAttendance(response.data);
            } catch (error) {
                console.error('Error fetching attendance:', error);
            }
        };

        fetchAttendance();
    }, [authData]);

    // Handle logout functionality
    const handleLogout = () => {
        setAuthData(null); // Clear authentication data (reset state)
        navigate('/'); // Navigate to login page
    };

    return (
        <div className="attendance-page">
            <h1>My Attendance</h1>
            <table className="attendance-table" border="0">
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Subject Name</th>
                        <th>Attendance Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    {attendance.map((record, index) => (
                        <tr key={index}>
                            <td>{record.studentName}</td>
                            <td>{record.subject}</td>
                            <td>{record.attendancePercentage.toFixed(2)}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="logout-btn">
                <button onClick={handleLogout}>Logout</button>
            </div>

        </div>
    );
};

export default AttendancePage;
