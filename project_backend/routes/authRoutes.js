const express = require('express');
const { register, login, loginStudentUser , loginFacultyUser } = require('../controllers/authController');
const router = express.Router();

// Routes for authentication
router.post('/register', register);
router.post('/login', login);
router.post('/loginStudentUser',loginStudentUser);
router.post('/loginFacultyUser',loginFacultyUser);

module.exports = router;
