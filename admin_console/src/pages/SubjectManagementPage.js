import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SubjectManagementPage.css'; // Import the CSS file

const SubjectManagementPage = () => {
    const navigate = useNavigate();

    return (
        <div className="subject-container">
            <h1 className="subject-title">Subject Management Page</h1>
            <div className="subject-buttons">
                <button className="subject-button" onClick={() => navigate('/add-subject')}>
                    Create Subject
                </button>
                <button className="subject-button" onClick={() => navigate('/update-subjects')}>
                    Update Subject 
                </button>
                <button className="subject-button" onClick={() => navigate('/assign-subject-to-faculty')}>
                    Assign Subject To Faculty 
                </button>
                <button className="subject-button" onClick={() => navigate('/assign-students-to-subject')}>
                    Assign Student To Subject 
                </button>
                <button className="subject-back-button" onClick={() => navigate('/admin-homepage')}>
                    Back
                </button>
            </div>
        </div>
    );
};

export default SubjectManagementPage;
