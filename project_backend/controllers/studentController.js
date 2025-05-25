const Student = require('../models/Student');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Create a new student
exports.createStudent = async (req, res) => {
    try {
        const student = new Student(req.body);
        const { name , email , password} = req.body;
        const role="Student";
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });
        await student.save();
        const studentsaved= await Student.findOne({ email });
        const studentId= studentsaved._id;
        const hashedPassword = await bcrypt.hash(password, 10);
                
                        const newUser = new User({ name, email, password: hashedPassword, role,studentId});
                        await newUser.save();
        res.status(201).json({ message: 'Student created successfully', student });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update a student
exports.updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedStudent = await Student.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ message: 'Student updated successfully', updatedStudent });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

//Update student name and student email , password
exports.updateStudentDetails = async (req, res) => {
    try {
        const updates = req.body; // Array of updates [{ id, name, email , password }, ...]

        const updatePromises = updates.map(async (student) => {
            const { id, name, email, password } = student;

            // Find by ID and update
            let hashedPassword =null;
            if (password) {
                hashedPassword = await bcrypt.hash(password, 10);
            }

            const updatedStudent = await Student.findByIdAndUpdate(id, { name, email, password }, { new: true });

            if (!updatedStudent) {
                throw new Error(`Student with ID ${id} not found`);
            }

            // Update Users collection
            const userUpdate = await User.findOneAndUpdate(
                { studentId: id }, // Match the studentId in the Users table
                { 
                    name, 
                    email, 
                    ...(password && { password: hashedPassword }) // Only update password if provided
                },
                { new: true }
            );

            if (!userUpdate) {
                throw new Error(`User entry for Student ID ${id} not found`);
            }
 
        });

        // Wait for all updates to complete
        await Promise.all(updatePromises);

        res.status(200).json({ message: 'Student updated successfully' });
    } catch (error) {
        console.error('Error updating students:', error);
        res.status(500).json({ message: 'Failed to update student', error });
    }
};


// Delete a student
exports.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        await Student.findByIdAndDelete(id);
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
