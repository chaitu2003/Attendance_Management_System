const express = require('express');
const {
    createStudent,
    getAllStudents,
    updateStudent,
    deleteStudent,
    updateStudentDetails,
} = require('../controllers/studentController');

const router = express.Router();

// Define routes for student CRUD
router.post('/', createStudent);
router.get('/', getAllStudents);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);
router.put('/',updateStudentDetails);

module.exports = router;
