const Subject = require('../models/Subject');
const Faculty = require('../models/Faculty');
const Student = require('../models/Student');


// Create a new subject
exports.createSubject = async (req, res) => {
    try {
        const subject = new Subject(req.body);
        await subject.save();
        res.status(201).json({ message: 'Subject created successfully', subject });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all subjects
exports.getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find().populate('faculty students'); // Populate faculty and students
        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Update a subject
//Update subject is nothing but assigning faculty to the subject and linking subject to faculty
exports.updateSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedSubject = await Subject.findByIdAndUpdate(id, req.body, { new: true });
        const facultyId = updatedSubject.faculty;
        const facultyRecord = await Faculty.findById(facultyId);
        if (!facultyRecord.subjects.includes(id)) {
        facultyRecord.subjects.push(updatedSubject._id);
        await facultyRecord.save();
        }
        res.status(200).json({ message: 'Subject Assigned successfully', updatedSubject });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

//Update Subject name and subject code
exports.updateSubjects = async (req, res) => {
    try {
        const updates = req.body; // Array of updates [{ id, name, code }, ...]

        const updatePromises = updates.map(async (subject) => {
            const { id, name, code } = subject;

            // Find by ID and update
            await Subject.findByIdAndUpdate(id, { name, code }, { new: true });
        });

        // Wait for all updates to complete
        await Promise.all(updatePromises);

        res.status(200).json({ message: 'Subjects updated successfully' });
    } catch (error) {
        console.error('Error updating subjects:', error);
        res.status(500).json({ message: 'Failed to update subjects', error });
    }
};


exports.assignSubjectToStudents = async (req, res) => {
    try {
        const { id } = req.params; // Subject ID
        const { students } = req.body; // Array of student IDs to be assigned to the subject

        // Update the subject to include the students
        const updatedSubject = await Subject.findByIdAndUpdate(
            id,
            { $addToSet: { students: { $each: students } } }, // Avoid duplicates in the subject's students array
            { new: true }
        );

        if (!updatedSubject) {
            return res.status(404).json({ message: 'Subject not found' });
        }

        // Update each student's subjects array to include this subject
        const updateStudentsPromises = students.map(async (studentId) => {
            const student = await Student.findById(studentId);
            if (!student) {
                return res.status(404).json({ message: 'Student not found' });
            }

            // Add the subject to the student's subjects array (if not already present)
            if (!student.subjects.includes(id)) {
                student.subjects.push(id);
                await student.save();
            }
        });

        // Wait for all student updates to complete
        await Promise.all(updateStudentsPromises);

        res.status(200).json({
            message: 'Subject assigned to students successfully',
            updatedSubject,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Delete a subject
exports.deleteSubject = async (req, res) => {
    try {
        const { id } = req.params;
        await Subject.findByIdAndDelete(id);
        res.status(200).json({ message: 'Subject deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getSubjectsAndStudentsByFaculty = async (req, res) => {
    try {
        const { facultyId } = req.params;
        console.log('printing facultyid',facultyId);

        // Fetch all subjects assigned to the faculty and populate students
        const subjects = await Subject.find({ faculty: facultyId })
            .populate('students', 'name email') // Populate student details (name and email)
            .select('name code students'); // Only return relevant fields

        if (!subjects.length) {
            return res.status(404).json({ message: 'No subjects found for this faculty.' });
        }

        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getSubjectWithStudents = async (req, res) => {
    try {
        const { subjectId } = req.params;
console.log('subject id is',subjectId);
        const subject = await Subject.findById(subjectId)
            .populate('faculty', 'name email') // Populate faculty details
            .populate('students', 'name email'); // Populate student details

        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.getAllUnAssignedSubjects = async(req , res) => {
    try{
        const unAssignedSubjects = await Subject.find({ 
            $or: [
                { faculty: null },         // Explicitly null
                { faculty: { $exists: false } } // Field doesn't exist
            ] 
        });

        res.status(200).json(unAssignedSubjects);
    }
    catch(error){
        res.status(500).json({ message: "Server error" });
    }
}

//getAllSubjectDetails

exports.getAllSubjectDetails = async (req, res) => {
    try {
        const subjects = await Subject.find({}, '_id name code');
        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
