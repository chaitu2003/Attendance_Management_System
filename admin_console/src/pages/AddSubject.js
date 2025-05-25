import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddSubject.css'; // Ensure to import the new CSS file

const AddSubject = () => {
    const [subjectCode, setSubjectCode] = useState('');
    const [subjectName, setSubjectName] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleCreateSubject = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                name: subjectName,
                code: subjectCode,
            };

            const response = await axios.post('http://localhost:5000/api/subjects', payload);

            if (response.status === 201) {
                setSuccessMessage('Subject created successfully');
            }
        } catch (error) {
            setErrorMessage('Failed to create subject. Please try again.');
        }
    };

    return (
        <div className="add-subject-container">
            <h1 className="add-subject-title">Add Subject</h1>
            <form className="add-subject-form" onSubmit={handleCreateSubject}>
                <div className="input-group">
                    <label>Subject Code:</label>
                    <input
                        type="text"
                        value={subjectCode}
                        onChange={(e) => setSubjectCode(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label>Subject Name:</label>
                    <input
                        type="text"
                        value={subjectName}
                        onChange={(e) => setSubjectName(e.target.value)}
                        required
                    />
                </div>
                <button className="add-subject-button" type="submit">Create</button>
            </form>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button className="back-button" onClick={() => navigate('/subject-management')}>Back</button>
        </div>
    );
};

export default AddSubject;
