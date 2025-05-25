import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './MarkAttendance.css';

const MarkAttendance = ({ authData }) => {
    const { subjectId } = useParams();
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [date, setDate] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubjectDetails = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/subjects/${subjectId}/students`,
                    { headers: { Authorization: `Bearer ${authData.token}` } }
                );
                setStudents(response.data.students);
            } catch (error) {
                console.error('Error fetching subject details:', error);
            }
        };

        fetchSubjectDetails();
    }, [subjectId, authData]);

    const handleAttendanceChange = (studentId, status) => {
        setAttendance((prev) => ({
            ...prev,
            [studentId]: status,
        }));
    };

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const handleSubmit = async () => {
        if (!date) {
            alert('Please select a date!');
            return;
        }

        try {
            const attendanceRecords = students.map((student) => ({
                studentId: student._id,
                subjectId,
                date,
                status: attendance[student._id] || 'Absent',
            }));

            for (const record of attendanceRecords) {
                await axios.post(
                    `http://localhost:5000/api/attendance`,
                    record,
                    { headers: { Authorization: `Bearer ${authData.token}` } }
                );
            }

            alert('Attendance marked successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error marking attendance:', error);
            alert('Error marking attendance. Please try again.');
        }
    };

    return (
        <div className="mark-attendance-container">
            <h1 className="attendance-heading">Mark Attendance</h1>
            
            <div className="date-container">
                <label className="date-label">Select Date:</label>
                <input
                    type="date"
                    className="date-input"
                    value={date}
                    max={getTodayDate()}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            <ul className="student-list">
                {students.map((student) => (
                    <li key={student._id} className="student-item">
                        <span className="student-name">{student.name}</span>
                        <div className="radio-buttons">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name={`attendance-${student._id}`}
                                    className="radio-input"
                                    value="Present"
                                    checked={attendance[student._id] === 'Present'}
                                    onChange={() => handleAttendanceChange(student._id, 'Present')}
                                />
                                Present
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    name={`attendance-${student._id}`}
                                    className="radio-input"
                                    value="Absent"
                                    checked={attendance[student._id] === 'Absent' || !attendance[student._id]}
                                    onChange={() => handleAttendanceChange(student._id, 'Absent')}
                                />
                                Absent
                            </label>
                        </div>
                    </li>
                ))}
            </ul>

            <button className="submit-btn" onClick={handleSubmit}>
                Submit Attendance
            </button>

            <button className="bacck-btn" onClick={() => navigate('/post-attendance')}>
                Back
            </button>
        </div>
    );
};

export default MarkAttendance;
