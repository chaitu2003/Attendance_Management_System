const Faculty = require('../models/Faculty');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Subject = require('../models/Subject');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');


// Create a new faculty
exports.createFaculty = async (req, res) => {
    try {
        const faculty = new Faculty(req.body);
        const { name, email, password } = req.body;
        const role='Faculty';
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });
        await faculty.save();
        const facultySaved = await Faculty.findOne({ email });
        const facultyId = facultySaved._id;
        
                const hashedPassword = await bcrypt.hash(password, 10);
        
                const newUser = new User({ name, email, password: hashedPassword, role,facultyId});
                await newUser.save();
        
        res.status(201).json({ message: 'Faculty created successfully', faculty });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all faculty members
exports.getAllFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.find();
        res.status(200).json(faculty);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update a faculty member
exports.updateFaculty = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedFaculty = await Faculty.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ message: 'Faculty updated successfully', updatedFaculty });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

//Update faculty name and faculty code
exports.updateFacultyDetails = async (req, res) => {
    try {
        const updates = req.body; // Array of updates [{ id, name, email, password }, ...]

        const updatePromises = updates.map(async (faculty) => {
            const { id, name, email, password } = faculty;

            let hashedPassword =null;
            if (password) {
                hashedPassword = await bcrypt.hash(password, 10);
            }

            // Update Faculty collection
            const updatedFaculty = await Faculty.findByIdAndUpdate(
                id,
                { name, email, password },
                { new: true }
            );

            if (!updatedFaculty) {
                throw new Error(`Faculty with ID ${id} not found`);
            }

            // Update Users collection
            const userUpdate = await User.findOneAndUpdate(
                { facultyId: id }, // Match the facultyId in the Users table
                { 
                    name, 
                    email, 
                    ...(password && { password: hashedPassword }) // Only update password if provided
                },
                { new: true }
            );

            if (!userUpdate) {
                throw new Error(`User entry for Faculty ID ${id} not found`);
            }
        });

        // Wait for all updates to complete
        await Promise.all(updatePromises);

        res.status(200).json({ message: 'Faculty and Users updated successfully' });
    } catch (error) {
        console.error('Error updating Faculty and Users:', error);
        res.status(500).json({ message: 'Failed to update Faculty and Users', error });
    }
};


// Delete a faculty member
exports.deleteFaculty = async (req, res) => {
    try {
        const { id } = req.params;
        await Faculty.findByIdAndDelete(id);
        res.status(200).json({ message: 'Faculty deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


exports.getAttendanceReportForFaculty = async (req, res) => {
    try {
        const { facultyId } = req.params;

        // Fetch subjects assigned to the faculty
        const subjects = await Subject.find({ faculty: facultyId });

        // if (!subjects || subjects.length === 0) {
        //     return res.status(404).json({ message: 'No subjects found for this faculty.' });
        // }

        // Initialize attendance data array
        const attendanceData = [];

        // Loop through each subject to compute attendance
        for (const subject of subjects) {
            const attendances = await Attendance.find({ subject: subject._id }).populate('student');

            // Group attendance by student
            const studentAttendanceMap = {};

            attendances.forEach((record) => {
                const studentId = record.student._id.toString();

                if (!studentAttendanceMap[studentId]) {
                    studentAttendanceMap[studentId] = { present: 0, total: 0, student: record.student };
                }

                studentAttendanceMap[studentId].total += 1; // Increment total classes
                if (record.status === 'Present') {
                    studentAttendanceMap[studentId].present += 1; // Increment present classes
                }
            });

            // Calculate attendance percentage for each student
            Object.values(studentAttendanceMap).forEach(({ present, total, student }) => {
                const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

                attendanceData.push({
                    studentName: student.name,
                    subjectName: subject.name,
                    attendance: `${percentage}%`,
                });
            });
        }

        res.status(200).json(attendanceData);
    } catch (error) {
        console.error('Error fetching attendance report:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

