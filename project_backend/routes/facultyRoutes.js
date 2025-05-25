const express = require('express');
const {
    createFaculty,
    getAllFaculty,
    updateFaculty,
    deleteFaculty,
    updateFacultyDetails,
    getAttendanceReportForFaculty,
} = require('../controllers/facultyController');

const router = express.Router();

// Define routes for faculty CRUD
router.post('/', createFaculty);
router.get('/', getAllFaculty);
router.put('/:id', updateFaculty);
router.delete('/:id', deleteFaculty);
router.put('/', updateFacultyDetails);
router.get('/:facultyId/attendance-report', getAttendanceReportForFaculty);


module.exports = router;
