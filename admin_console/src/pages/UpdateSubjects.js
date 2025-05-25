import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UpdateSubjects.css'; // Importing the new CSS file

const UpdateSubjects = () => {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [editableRows, setEditableRows] = useState(new Set());
    const [updatedSubjects, setUpdatedSubjects] = useState([]);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/subjects');
                setSubjects(response.data);
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        };

        fetchSubjects();
    }, []);

    const handleCheckboxChange = (id) => {
        setEditableRows((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleInputChange = (id, field, value) => {
        setSubjects((prev) =>
            prev.map((subject) =>
                subject._id === id ? { ...subject, [field]: value } : subject
            )
        );

        setUpdatedSubjects((prev) => {
            const existing = prev.find((item) => item.id === id);
            if (existing) {
                return prev.map((item) =>
                    item.id === id ? { ...item, [field]: value } : item
                );
            }
            return [...prev, { id, [field]: value }];
        });
    };

    const handleApplyChanges = async () => {
        try {
            const payload = updatedSubjects.map((subject) => ({
                id: subject.id,
                name: subject.name,
                code: subject.code,
            }));

            const response = await axios.put('http://localhost:5000/api/subjects', payload);

            if (response.status === 200) {
                alert('Subjects updated successfully!');
            }
        } catch (error) {
            console.error('Error updating subjects:', error);
            alert('Failed to update subjects.');
        }
    };

    return (
        <div className="update-subjects-container">
            <h1 className="update-subjects-title">Update Subjects</h1>
            <div className="subjects-table-container">
                <table className="subjects-table">
                    <thead>
                        <tr>
                            <th>Subject Code</th>
                            <th>Subject Name</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.map((subject) => (
                            <tr key={subject._id}>
                                <td>
                                    {editableRows.has(subject._id) ? (
                                        <input
                                            type="text"
                                            value={subject.code}
                                            onChange={(e) =>
                                                handleInputChange(subject._id, 'code', e.target.value)
                                            }
                                        />
                                    ) : (
                                        subject.code
                                    )}
                                </td>
                                <td>
                                    {editableRows.has(subject._id) ? (
                                        <input
                                            type="text"
                                            value={subject.name}
                                            onChange={(e) =>
                                                handleInputChange(subject._id, 'name', e.target.value)
                                            }
                                        />
                                    ) : (
                                        subject.name
                                    )}
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={editableRows.has(subject._id)}
                                        onChange={() => handleCheckboxChange(subject._id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="buttons-container">
                <button className="apply-changes-btn" onClick={handleApplyChanges}>Apply Changes</button>
                <button className="backk-btn" onClick={() => navigate('/subject-management')}>Back</button>
            </div>
        </div>
    );
};

export default UpdateSubjects;
