const express = require('express');
const {
    createSubject,
    getAllSubjects,
    updateSubject,
    deleteSubject,
    assignSubjectToStudents,
    getSubjectsAndStudentsByFaculty,
    getSubjectWithStudents,
    getAllUnAssignedSubjects,
    updateSubjects,
    getAllSubjectDetails,
} = require('../controllers/subjectController');

const router = express.Router();

// Define routes for subject CRUD
router.post('/', createSubject);
router.get('/', getAllSubjects);
router.put('/:id', updateSubject);
router.delete('/:id', deleteSubject);
router.put('/assignSubjectToStudents/:id',assignSubjectToStudents);
router.get('/faculty/:facultyId/subjects-students', getSubjectsAndStudentsByFaculty);
router.get('/:subjectId/students',getSubjectWithStudents);
router.get('/getAllUnAssignedSubjects',getAllUnAssignedSubjects);
router.put('/',updateSubjects);
router.get('/getAllSubjectDetails', getAllSubjectDetails);

module.exports = router;
