import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './pages/Dashboard';
import AttendancePage from './pages/AttendancePage';

function App() {
    const [authData, setAuthData] = useState(null);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage setAuthData={setAuthData} />} />
                {authData && <Route path="/dashboard" element={<Dashboard authData={authData} />} />}
                {authData && <Route path="/attendance" element={<AttendancePage authData={authData} setAuthData={setAuthData} />} />}
            </Routes>
        </Router>
    );
}

export default App;
