import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UpdateStudents.css'; // Assuming the CSS file is named UpdateStudents.css

const UpdateStudents = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [editableRows, setEditableRows] = useState(new Set());
    const [updatedStudents, setUpdatedStudents] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/students');
                setStudents(response.data);
            } catch (error) {
                console.error('Error fetching Students:', error);
            }
        };

        fetchStudents();
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
        setStudents((prev) =>
            prev.map((student) =>
                student._id === id ? { ...student, [field]: value } : student
            )
        );

        setUpdatedStudents((prev) => {
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
            const payload = updatedStudents.map((student) => ({
                id: student.id,
                name: student.name,
                email: student.email,
                password: student.password,
            }));

            const response = await axios.put('http://localhost:5000/api/students', payload);

            if (response.status === 200) {
                alert('Students updated successfully!');
            }
        } catch (error) {
            console.error('Error updating Students:', error);
            alert('Failed to update Students.');
        }
    };

    return (
        <div className="update-students-container">
            <h1 className="update-students-title">Update Students</h1>
            <div className="students-table-container">
                <table className="students-table">
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            <th>Student Email</th>
                            <th>Student Password</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr key={student._id}>
                                <td>
                                    {editableRows.has(student._id) ? (
                                        <input
                                            type="text"
                                            value={student.name}
                                            onChange={(e) =>
                                                handleInputChange(student._id, 'name', e.target.value)
                                            }
                                        />
                                    ) : (
                                        student.name
                                    )}
                                </td>
                                <td>
                                    {editableRows.has(student._id) ? (
                                        <input
                                            type="text"
                                            value={student.email}
                                            onChange={(e) =>
                                                handleInputChange(student._id, 'email', e.target.value)
                                            }
                                        />
                                    ) : (
                                        student.email
                                    )}
                                </td>
                                <td>
                                    <input
                                        type="password"
                                        value={editableRows.has(student._id) ? student.password : '******'}
                                        readOnly={!editableRows.has(student._id)}
                                        onChange={(e) => {
                                            if (editableRows.has(student._id)) {
                                                handleInputChange(student._id, 'password', e.target.value);
                                            }
                                        }}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={editableRows.has(student._id)}
                                        onChange={() => handleCheckboxChange(student._id)}
                                    />
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan="4">
                                <div className="buttons-container">
                                    <button className="apply-changes-btn" onClick={handleApplyChanges}>
                                        Apply Changes
                                    </button>
                                    <button className="back-btn" onClick={() => navigate('/student-management')}>
                                        Back
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UpdateStudents;
