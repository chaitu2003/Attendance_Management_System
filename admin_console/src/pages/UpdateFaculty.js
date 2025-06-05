import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UpdateFaculty.css';

const UpdateFaculty = () => {
    const navigate = useNavigate();
    const [faculty, setFaculty] = useState([]);
    const [editableRows, setEditableRows] = useState(new Set());
    const [updatedFaculty, setUpdatedFaculty] = useState([]);

    // Fetch Faculty on component load
    useEffect(() => {
        const fetchFaculty = async () => {
            try {
                const response = await axios.get('https://attendance-management-system1.onrender.com/api/faculty');
                setFaculty(response.data);
            } catch (error) {
                console.error('Error fetching Faculty:', error);
            }
        };

        fetchFaculty();
    }, []);

    // Handle checkbox toggle to enable editing
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

    // Handle input changes
    const handleInputChange = (id, field, value) => {
        setFaculty((prev) =>
            prev.map((faculty) =>
                faculty._id === id ? { ...faculty, [field]: value } : faculty
            )
        );

        setUpdatedFaculty((prev) => {
            const existing = prev.find((item) => item.id === id);
            if (existing) {
                return prev.map((item) =>
                    item.id === id ? { ...item, [field]: value } : item
                );
            }
            return [...prev, { id, [field]: value }];
        });
    };

    // Submit updated records via PUT API
    const handleApplyChanges = async () => {
        try {
            const payload = updatedFaculty.map((faculty) => ({
                id: faculty.id,
                name: faculty.name,
                email: faculty.email,
                password: faculty.password,
            }));

            const response = await axios.put('https://attendance-management-system1.onrender.com/api/faculty', payload);

            if (response.status === 200) {
                alert('Faculty updated successfully!');
            }
        } catch (error) {
            console.error('Error updating Faculty:', error);
            alert('Failed to update Faculty.');
        }
    };

    return (
        <div className="update-faculty-container">
            <h1 className="update-faculty-title">Update Faculty</h1>
            <div className="faculty-table-container">
                <table className="faculty-table">
                    <thead>
                        <tr>
                            <th>Faculty Name</th>
                            <th>Faculty Email</th>
                            <th>Faculty Password</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {faculty.map((faculty) => (
                            <tr key={faculty._id}>
                                <td>
                                    {editableRows.has(faculty._id) ? (
                                        <input
                                            type="text"
                                            value={faculty.name}
                                            onChange={(e) =>
                                                handleInputChange(faculty._id, 'name', e.target.value)
                                            }
                                        />
                                    ) : (
                                        faculty.name
                                    )}
                                </td>
                                <td>
                                    {editableRows.has(faculty._id) ? (
                                        <input
                                            type="text"
                                            value={faculty.email}
                                            onChange={(e) =>
                                                handleInputChange(faculty._id, 'email', e.target.value)
                                            }
                                        />
                                    ) : (
                                        faculty.email
                                    )}
                                </td>
                                <td>
                                    <input
                                        type="password"
                                        value={editableRows.has(faculty._id) ? faculty.password : '******'}
                                        readOnly={!editableRows.has(faculty._id)}
                                        onChange={(e) => {
                                            if (editableRows.has(faculty._id)) {
                                                handleInputChange(faculty._id, 'password', e.target.value);
                                            }
                                        }}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={editableRows.has(faculty._id)}
                                        onChange={() => handleCheckboxChange(faculty._id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="faculty-buttons-container">
                <button className="apply-faculty-changes-btn" onClick={handleApplyChanges}>
                    Apply Changes
                </button>
                <button className="faculty-back-btn" onClick={() => navigate('/faculty-management')}>
                    Back
                </button>
            </div>
        </div>
    );
};

export default UpdateFaculty;
