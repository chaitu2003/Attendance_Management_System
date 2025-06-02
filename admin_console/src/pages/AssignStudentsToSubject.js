import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AssignStudentsToSubject.css";
const AssignStudentsToSubject = () => {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [message, setMessage] = useState("");

    // Fetch subjects
    const fetchSubjects = async () => {
        try {
            const response = await axios.get(
                "http://attendance-management-system-s3xb.onrender.com/api/subjects/getAllSubjectDetails"
            );
            setSubjects(response.data);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        }
    };

    // Fetch students
    const fetchStudents = async () => {
        try {
            const response = await axios.get("http://attendance-management-system-s3xb.onrender.com/api/students");
            setStudents(response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    // Assign students to the selected subject
    const handleAssignStudents = async () => {
        if (!selectedSubject || selectedStudents.length === 0) {
            setMessage("Please select a subject and at least one student.");
            return;
        }

        try {
            const payload = { students: selectedStudents };
            const response = await axios.put(
                `http://attendance-management-system-s3xb.onrender.com/api/subjects/assignSubjectToStudents/${selectedSubject}`,
                payload
            );

            // Correct response handling
            if (response.status === 200) {
                setMessage("Students assigned successfully!");
            } else {
                setMessage("Failed to assign students. Please try again.");
            }
        } catch (error) {
            console.error("Error assigning students:", error);
            setMessage("Failed to assign students. Please try again.");
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchSubjects();
        fetchStudents();
    }, []);

    return (
        <div className="assign-container">
        <h1 className="assign-title">Assign Students to Subject</h1>
        <div className="assign-table-container">
            <table className="assign-table">
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Students</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <select
                                className="assign-select"
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value)}
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
                                className="assign-multi-select"
                                multiple
                                value={selectedStudents}
                                onChange={(e) =>
                                    setSelectedStudents(
                                        Array.from(e.target.selectedOptions, (option) => option.value)
                                    )
                                }
                            >
                                {students.map((student) => (
                                    <option key={student._id} value={student._id}>
                                        {student.name}
                                    </option>
                                ))}
                            </select>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div className="assign-buttons-container">
            <button className="assign-btn" onClick={handleAssignStudents}>Assign</button>
            <button className="assign-btn back-btn" onClick={() => navigate("/subject-management")}>Back</button>
        </div>
        {message && <p className="assign-message">{message}</p>}
    </div>


    );
};

export default AssignStudentsToSubject;
