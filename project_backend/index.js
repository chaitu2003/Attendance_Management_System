const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes'); // Import authentication routes
const studentRoutes = require('./routes/studentRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

// app.use('/api/subjects', subjectRoutes);


// app.use('/api/faculty', facultyRoutes);


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const cron = require('node-cron');
const { getLowAttendanceStudents } = require('./controllers/attendanceController');

cron.schedule('0 9 * * *', async () => {
    console.log('Running low attendance notification task...');
    await getLowAttendanceStudents();
});


const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.error(err));

app.use('/api/auth', authRoutes); // Use auth routes

// const studentRoutes = require('./routes/studentRoutes');

app.use('/api/students', studentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/attendance', attendanceRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
