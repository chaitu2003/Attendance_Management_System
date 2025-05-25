const express = require('express');
const {
    markAttendance,
    getAttendanceBySubject,
    getAttendanceByStudent,
    getLowAttendanceStudents,
    getMonthlyAttendance,
    getAttendanceByStudentPerSubjectWithMail,
} = require('../controllers/attendanceController');

const router = express.Router();

// Define routes for attendance
router.post('/', markAttendance); // Faculty marks attendance
router.get('/subject/:subjectId', getAttendanceBySubject); // Faculty views attendance for a subject
router.get('/student/:studentId', getAttendanceByStudent); // Student views their attendance
router.get('/studentAttendancePerSubject/:studentId', getAttendanceByStudentPerSubjectWithMail); // Student views their attendance
router.get('/low-attendance', getLowAttendanceStudents); // Admin views students with low attendance
//Our own route
router.get('/month-attendance', getMonthlyAttendance);  //get month attendance by student




module.exports = router;
