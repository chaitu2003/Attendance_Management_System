import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './AttendanceReport.css';

const AttendanceReport = ({ authData }) => {
    const navigate = useNavigate();
    
    const generateAttendanceReport = async () => {
        try {
            // Fetch attendance report from backend
            const response = await axios.get(
                `http://localhost:5000/api/faculty/${authData.facultyId}/attendance-report`,
                {
                    headers: { Authorization: `Bearer ${authData.token}` },
                }
            );

            const attendanceData = response.data;

            // Create PDF
            const doc = new jsPDF();
            doc.text('Attendance Report', 14, 16);

            // Define table columns and rows
            const columns = ['Student Name', 'Subject Name', 'Attendance'];
            const rows = attendanceData.map((data) => [
                data.studentName,
                data.subjectName,
                data.attendance,
            ]);

            // Add table to the PDF
            doc.autoTable({
                head: [columns],
                body: rows,
                startY: 20,
            });

            // Save the PDF
            doc.save('attendance_report.pdf');
        } catch (error) {
            console.error('Error generating attendance report:', error);
            alert('Failed to generate attendance report. Please try again.');
        }
    };

    return (
        <div className="attendance-report-container">
            <h1 className="welcome-message">Welcome, {authData.name}</h1>
            <div className="report-actions">
                <button className="generate-report-btn" onClick={generateAttendanceReport}>
                    View Attendance Report
                </button>
                <button className="back-btn" onClick={() => navigate('/dashboard')}>
                    Back
                </button>
            </div>
        </div>
    );
};

export default AttendanceReport;
