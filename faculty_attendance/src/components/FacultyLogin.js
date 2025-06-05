import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FacultyLogin.css';
const FacultyLogin = ({ setAuthData }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://attendance-management-system1.onrender.com/api/auth/loginFacultyUser', {
                email,
                password,
            });

            setAuthData({
                token: response.data.token,
                facultyId: response.data.facultyId,
                name: response.data.name,
            });

            navigate('/dashboard');
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="login-background">
            <div className="login-container">
                <h1 className="login-header">Faculty Login</h1>
                <form className="login-form" onSubmit={handleLogin}>
                    <input
                        className="login-input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="login-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button className="login-button" type="submit">Login</button>
                </form>
                {error && <p className="login-error">{error}</p>}
            </div>
        </div>
    );
};

export default FacultyLogin;
