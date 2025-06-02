import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddStudent.css'; // Import the CSS file

const AddStudent = () => {
    const [studentName, setStudentName] = useState('');
    const [studentEmail, setStudentEmail] = useState('');
    const [studentPassword, setStudentPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleCreateStudent = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                name: studentName,
                email: studentEmail,
                password: studentPassword
            };

            const response = await axios.post('http://attendance-management-system-s3xb.onrender.com/api/students', payload);

            if (response.status === 201) {
                setSuccessMessage('Student created successfully.');
                setErrorMessage('');
            }
        } catch (error) {
            setErrorMessage('Failed to create student. Please try again.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="add-student-container">
            <h1 className="add-student-title">Add Student</h1>
            <form className="add-student-form" onSubmit={handleCreateStudent}>
                <div className="input-group">
                    <label>Student Name:</label>
                    <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Student Email:</label>
                    <input
                        type="email"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Student Password:</label>
                    <input
                        type="password"
                        value={studentPassword}
                        onChange={(e) => setStudentPassword(e.target.value)}
                        required
                    />
                </div>
                <button className="add-student-button" type="submit">
                    Create
                </button>
            </form>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            
            <button className="return-button" onClick={() => navigate('/student-management')}>
                Back
            </button>
        </div>
    );
};

export default AddStudent;
