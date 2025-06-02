import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './PostAttendance.css';

const PostAttendance = ({ authData, setAuthData }) => {
    const [subjects, setSubjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubjectsAndStudents = async () => {
            try {
                const response = await axios.get(
                    `http://attendance-management-system1.onrender.com/api/subjects/faculty/${authData.facultyId}/subjects-students`,
                    { headers: { Authorization: `Bearer ${authData.token}` } }
                );
                setSubjects(response.data);
            } catch (error) {
                console.error('Error fetching subjects and students:', error);
            }
        };

        fetchSubjectsAndStudents();
    }, [authData]);

    const handleMarkAttendance = (subjectId) => {
        navigate(`/mark-attendance/${subjectId}`);
    };

    // Handle logout functionality
    const handleLogout = () => {
        setAuthData(null); // Clear authentication data (reset state)
        navigate('/'); // Navigate back to Faculty Login page
    };

    // const generateAttendanceReport = async () => {
    //     try {
    //         // Fetch attendance report from backend
    //         const response = await axios.get(
    //             `http://attendance-management-system-s3xb.onrender.com/api/faculty/${authData.facultyId}/attendance-report`,
    //             {
    //                 headers: { Authorization: `Bearer ${authData.token}` },
    //             }
    //         );

    //         const attendanceData = response.data;

    //         // Create PDF
    //         const doc = new jsPDF();
    //         doc.text('Attendance Report', 14, 16);

    //         // Define table columns and rows
    //         const columns = ['Student Name', 'Subject Name', 'Attendance'];
    //         const rows = attendanceData.map((data) => [
    //             data.studentName,
    //             data.subjectName,
    //             data.attendance,
    //         ]);

    //         // Add table to the PDF
    //         doc.autoTable({
    //             head: [columns],
    //             body: rows,
    //             startY: 20,
    //         });

    //         // Save the PDF
    //         doc.save('attendance_report.pdf');
    //     } catch (error) {
    //         console.error('Error generating attendance report:', error);
    //         // console.log('error:',error);
    //         alert('Failed to generate attendance report. Please try again.');
    //     }
    // };

    return (
        <div className="dashboard-container">
            <h1 className="welcome-message">Welcome, {authData.name}</h1>
            <h2 className="dashboard-heading">Your Subjects</h2>
            {subjects.map((subject) => (
                <div className="subject-card" key={subject._id}>
                    <h3 className="subject-name">{subject.name} ({subject.code})</h3>
                    <ul className="student-list">
                        {subject.students.map((student) => (
                            <li key={student._id} className="student-item">
                                {student.name} ({student.email})
                            </li>
                        ))}
                    </ul>
                    <button
                        className="mark-attendance-btn"
                        onClick={() => handleMarkAttendance(subject._id)}
                    >
                        Mark Attendance
                    </button>
                </div>
            ))}
            <div className="logout-btn">
                <button onClick={handleLogout}>Logout</button>
            </div>
            <div className='attendance-report'>
            {/* <h1>Welcome, {authData.name}</h1> */}
            {/* <button  className="mark-attendance-btn" onClick={generateAttendanceReport}>View Attendance Report</button> */}
            <div>
                <button className="mark-attendance-btn" onClick={() => navigate('/dashboard')}>Back</button>
            </div>
        </div>
        </div>
        
        
    );
};

export default PostAttendance;
