import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FacultyLogin from './components/FacultyLogin';
import FacultyDashboard from './pages/FacultyDashboard';
import MarkAttendance from './pages/MarkAttendance';
import AttendanceReport from './pages/AttendanceReport';
import PostAttendance from './pages/PostAttendance';

function App() {
    const [authData, setAuthData] = useState(null);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<FacultyLogin setAuthData={setAuthData} />} />
                {authData && (
                    <Route path="/dashboard" element={<FacultyDashboard authData={authData} setAuthData={setAuthData} />} />
                )}
                {authData && (
                    <Route path="/post-attendance" element={<PostAttendance authData={authData} setAuthData={setAuthData} />} />
                )}
                {authData && (
                    <Route path="/attendance-report" element={<AttendanceReport authData={authData}  />} />
                )}
                {authData && (
                    <Route
                        path="/mark-attendance/:subjectId" element={<MarkAttendance authData={authData} />} />
                )}
            </Routes>
        </Router>
    );
}

export default App;
