// AddFaculty.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddFaculty.css';

const AddFaculty = () => {
    const [facultyName, setFacultyName] = useState('');
    const [facultyEmail, setFacultyEmail] = useState('');
    const [facultyPassword, setFacultyPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleCreateFaculty = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                name: facultyName,
                email: facultyEmail,
                password: facultyPassword
            };

            const response = await axios.post(REACT_APP_API_URL, payload);

            if (response.status === 201) {
                setSuccessMessage('Faculty created successfully');
                setFacultyName('');
                setFacultyEmail('');
                setFacultyPassword('');
            }
        } catch (error) {
            setErrorMessage('Failed to create Faculty. Please try again.');
        }
    };

    return (
        <div className="add-faculty-container">
            <h1 className="add-faculty-title">Add Faculty</h1>
            <form className="add-faculty-form" onSubmit={handleCreateFaculty}>
                <div className="input-group">
                    <label>Faculty Name:</label>
                    <input
                        type="text"
                        value={facultyName}
                        onChange={(e) => setFacultyName(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Faculty Email:</label>
                    <input
                        type="text"
                        value={facultyEmail}
                        onChange={(e) => setFacultyEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Faculty Password:</label>
                    <input
                        type="password"
                        value={facultyPassword}
                        onChange={(e) => setFacultyPassword(e.target.value)}
                        required
                    />
                </div>
                <button className="add-faculty-button" type="submit">Create</button>
            </form>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button className="return-button" onClick={() => navigate('/faculty-management')}>Back</button>
        </div>
    );
};

export default AddFaculty;
