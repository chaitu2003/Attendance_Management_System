import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AssignFacultyToSubject.css';

const AssignFacultyToSubject = () => {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedFaculty, setSelectedFaculty] = useState('');
    const [message, setMessage] = useState('');

    // Fetch unassigned subjects
    const fetchSubjects = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/subjects/getAllUnAssignedSubjects');
            setSubjects(response.data);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    // Fetch all faculties
    const fetchFaculties = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/faculty/');
            setFaculties(response.data);
        } catch (error) {
            console.error('Error fetching faculties:', error);
        }
    };

    // Assign faculty to a subject
    const handleAssignFaculty = async () => {
        if (!selectedSubject || !selectedFaculty) {
            setMessage('Please select both subject and faculty.');
            alert('Please select both subject and faculty.');
            return;
        }

        try {
            const payload = { faculty: selectedFaculty };
            const response = await axios.put(`http://localhost:5000/api/subjects/${selectedSubject}`, payload);
            setMessage('Faculty assigned successfully!');
            if (response.status === 200) {
                alert('Faculty assigned successfully!');
            }
            // Refresh subjects dropdown
            fetchSubjects();
        } catch (error) {
            console.error('Error assigning faculty:', error);
            setMessage('Failed to assign faculty. Please try again.');
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchSubjects();
        fetchFaculties();
    }, []);

    return (
        <div className="assign-faculty-container">
            <h1 className="assign-faculty-title">Assign Faculty to Subject</h1>
            <div className="assign-faculty-table-container">
                <table className="assign-faculty-table">
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Faculty</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <select
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    className="assign-faculty-select"
                                >
                                    <option value="">Select Subject</option>
                                    {subjects.map((subject) => (
                                        <option key={subject._id} value={subject._id}>
                                            {subject.name}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <select
                                    value={selectedFaculty}
                                    onChange={(e) => setSelectedFaculty(e.target.value)}
                                    className="assign-faculty-select"
                                >
                                    <option value="">Select Faculty</option>
                                    {faculties.map((faculty) => (
                                        <option key={faculty._id} value={faculty._id}>
                                            {faculty.name}
                                        </option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="assign-faculty-buttons-container">
                <button onClick={handleAssignFaculty} className="assign-faculty-btn">Assign</button>
                <button onClick={() => navigate('/subject-management')} className="as-back-btn">Back</button>
            </div>
            {message && <p className="assign-faculty-message">{message}</p>}
        </div>
    );
};

export default AssignFacultyToSubject;
