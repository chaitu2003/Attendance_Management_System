import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminHomepage from './pages/AdminHomepage';
import AddSubject from './pages/AddSubject';
import AddStudent from './pages/AddStudent';
import AddFaculty from './pages/AddFaculty';
import StudentManagementPage from './pages/StudentManagementPage';
import SubjectManagementPage from './pages/SubjectManagementPage';
import FacultyManagementPage from './pages/FacultyManagementPage';
import UpdateSubjects from './pages/UpdateSubjects';
import UpdateStudents from './pages/UpdateStudents';
import UpdateFaculty from './pages/UpdateFaculty';
import AssignFacultyToSubject from './pages/AssignFacultyToSubject'
import AssignStudentsToSubject from './pages/AssignStudentsToSubject';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<AdminLogin />} />
                <Route path="/admin-homepage" element={<AdminHomepage />} />
                <Route path="/student-management" element={<StudentManagementPage />} />
                <Route path="/subject-management" element={<SubjectManagementPage />} />
                <Route path="/faculty-management" element={<FacultyManagementPage />} />
                <Route path="/add-subject" element={<AddSubject />} />
                <Route path="/add-student" element={<AddStudent />}/>
                <Route path="/add-faculty" element={<AddFaculty />}/>
                <Route path="/update-subjects" element={<UpdateSubjects />}/>
                <Route path="/update-students" element={<UpdateStudents />}/>
                <Route path="/update-faculty" element={<UpdateFaculty />}/>
                <Route path="/assign-subject-to-faculty" element={<AssignFacultyToSubject />}/>
                <Route path="/assign-students-to-subject" element={<AssignStudentsToSubject />}/>
            </Routes>
        </Router>
    );
}

export default App;
