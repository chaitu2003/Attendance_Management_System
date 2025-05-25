const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Subject = require('../models/Subject');
const sendEmail = require('../utils/email');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');



// Mark attendance for a student
exports.markAttendance = async (req, res) => {
    try {
        const { studentId, subjectId, date, status } = req.body;

        const attendance = new Attendance({ student: studentId, subject: subjectId, date, status });
        await attendance.save();

        res.status(201).json({ message: 'Attendance marked successfully', attendance });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get attendance for a specific subject (Faculty)
exports.getAttendanceBySubject = async (req, res) => {
    try {
        const { subjectId } = req.params;

        const attendance = await Attendance.find({ subject: subjectId })
            .populate('student', 'name email')
            .populate('subject', 'name');

        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get attendance for a specific student (Student)
exports.getAttendanceByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;

        const attendance = await Attendance.find({ student: studentId })
            .populate('subject', 'name')
            .sort({ date: -1 });

        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get students below 75% attendance (Admin)
exports.getLowAttendanceStudents = async (req, res) => {
    try {
        const threshold = 75; // Attendance percentage threshold

        const attendanceData = await Attendance.aggregate([
            {
                $group: {
                    _id: { student: '$student', subject: '$subject' },
                    totalClasses: { $sum: 1 },
                    presentClasses: {
                        $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] },
                    },
                },
            },
            {
                $project: {
                    student: '$_id.student',
                    subject: '$_id.subject',
                    attendancePercentage: {
                        $multiply: [
                            { $divide: ['$presentClasses', '$totalClasses'] },
                            100,
                        ],
                    },
                },
            },
            { $match: { attendancePercentage: { $lt: threshold } } },
        ]);

        for (const record of attendanceData) {
            const student = await Student.findById(record.student);
            const subject = await Subject.findById(record.subject);

            if (student && subject) {
                const emailContent = `
                    Dear ${student.name},
                    Your attendance in ${subject.name} is ${record.attendancePercentage.toFixed(
                        2
                    )}%, which is below the required 75%. Please ensure to attend classes regularly.
                `;
                await sendEmail(student.email, 'Low Attendance Alert', emailContent);
            }
        }

        res.status(200).json(attendanceData);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getMonthlyAttendance = async (req, res) => {
    try {
        const { studentId } = req.query;

        const trends = await Attendance.aggregate([
            { $match: { student: new mongoose.Types.ObjectId(studentId) } },
            {
                $group: {
                    _id: { month: { $month: '$date' }, year: { $year: '$date' } },
                    total: { $sum: 1 },
                    present: { $sum: { $cond: [{ $eq: ['$status', 'Present'] }, 1, 0] } },
                },
            },
        ]);

        res.status(200).json(trends);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getAttendanceByStudentPerSubject = async (req, res) => {
    try {
        const { studentId } = req.params;

        const attendance = await Attendance.aggregate([
            // Match attendance records for the given student
            { $match: { student: new mongoose.Types.ObjectId(studentId) } },

            // Group by subject and calculate total and present counts
            {
                $group: {
                    _id: '$subject',
                    totalClasses: { $sum: 1 },
                    presentClasses: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'Present'] }, 1, 0],
                        },
                    },
                    student: { $first: '$student' }, // Include the student ID for lookup
                },
            },

            // Lookup subject details for each group
            {
                $lookup: {
                    from: 'subjects',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'subject',
                },
            },

            // Lookup student details for the name
            {
                $lookup: {
                    from: 'students',
                    localField: 'student',
                    foreignField: '_id',
                    as: 'student',
                },
            },

            // Format the result
            {
                $project: {
                    subject: { $arrayElemAt: ['$subject.name', 0] }, // Subject name
                    studentName: { $arrayElemAt: ['$student.name', 0] }, // Student name
                    totalClasses: 1,
                    presentClasses: 1,
                    attendancePercentage: {
                        $multiply: [
                            { $divide: ['$presentClasses', '$totalClasses'] },
                            100,
                        ],
                    },
                },
            },
        ]);

        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const transporter = nodemailer.createTransport({
    secure:true,
    host:'smtp.gmail.com',
    port:465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    debug: true,
});

exports.getAttendanceByStudentPerSubjectWithMail = async (req, res) => {
    try {
        const { studentId } = req.params;

        console.log("Looking up attendance for studentId:", studentId);
        const attendance = await Attendance.aggregate([
            // Match attendance records for the given student
            { $match: { student: new mongoose.Types.ObjectId(studentId) } },

            // Group by subject and calculate total and present counts
            {
                $group: {
                    _id: '$subject',
                    totalClasses: { $sum: 1 },
                    presentClasses: {
                        $sum: {
                            $cond: [{ $eq: ['$status', 'Present'] }, 1, 0],
                        },
                    },
                    student: { $first: '$student' }, // Include the student ID for lookup
                },
            },

            // Lookup subject details for each group
            {
                $lookup: {
                    from: 'subjects',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'subject',
                },
            },

            // Lookup student details for the name and email
            {
                $lookup: {
                    from: 'students',
                    localField: 'student',
                    foreignField: '_id',
                    as: 'student',
                },
            },

            // Format the result
            {
                $project: {
                    subject: { $arrayElemAt: ['$subject.name', 0] }, // Subject name
                    studentName: { $arrayElemAt: ['$student.name', 0] }, // Student name
                    studentEmail: { $arrayElemAt: ['$student.email', 0] }, // Student email
                    totalClasses: 1,
                    presentClasses: 1,
                    attendancePercentage: {
                        $multiply: [
                            { $divide: ['$presentClasses', '$totalClasses'] },
                            100,
                        ],
                    },
                },
            },
        ]);

        // Filter subjects with attendance below 75%
        const lowAttendanceSubjects = attendance.filter(
            (record) => record.attendancePercentage < 75
        );

        // Send email for each low attendance subject
        for (const subject of lowAttendanceSubjects) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: subject.studentEmail,
                subject: `Low Attendance Alert for ${subject.subject}`,
                text: `Dear ${subject.studentName},\n\nYour attendance in ${subject.subject} is ${subject.attendancePercentage.toFixed(
                    2
                )}%, which is below the required threshold of 75%. Please ensure to attend upcoming classes to improve your attendance.\n\nRegards,\nCollege Administration`,
            };

            // Send the email
            await transporter.sendMail(mailOptions);
        }

        res.status(200).json(attendance);
    } catch (error) {
        console.error('Error in getAttendanceByStudent:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



// exports.getAttendanceByStudentPerSubject = async (req, res) => {
//     try {
//         const { studentId } = req.params;

//         const attendance = await Attendance.aggregate([
//             // Match attendance records for the given student
//             { $match: { student: new mongoose.Types.ObjectId(studentId) } },

//             // Group by subject and calculate total and present counts
//             {
//                 $group: {
//                     _id: '$subject',
//                     totalClasses: { $sum: 1 },
//                     presentClasses: {
//                         $sum: {
//                             $cond: [{ $eq: ['$status', 'Present'] }, 1, 0],
//                         },
//                     },
//                 },
//             },

//             // Lookup subject details for each group
//             {
//                 $lookup: {
//                     from: 'subjects',
//                     localField: '_id',
//                     foreignField: '_id',
//                     as: 'subject',
//                 },
//             },

//             // Format the result
//             {
//                 $project: {
//                     subject: { $arrayElemAt: ['$subject.name', 0] }, // Subject name
//                     totalClasses: 1,
//                     presentClasses: 1,
//                     attendancePercentage: {
//                         $multiply: [
//                             { $divide: ['$presentClasses', '$totalClasses'] },
//                             100,
//                         ],
//                     },
//                 },
//             },
//         ]);

//         res.status(200).json(attendance);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };
