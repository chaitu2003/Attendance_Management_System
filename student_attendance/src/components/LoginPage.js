import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';
const LoginPage = ({ setAuthData }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        document.body.className = 'login-background'; // Add background class on mount
        return () => {
            document.body.className = ''; // Cleanup on unmount
        };
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://attendance-management-system1.onrender.com/api/auth/loginStudentUser', { email, password });
            setAuthData({
                token: response.data.token,
                studentId: response.data.studentId,
                name: response.data.name,
            });
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-header">Student Login</h1>
            <form className="login-form" onSubmit={handleLogin}>
                <input
                    type="email"
                    className="login-input"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    className="login-input"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="login-button">Login</button>
            </form>
            {error && <p className="login-error">{error}</p>}
        </div>
    );
};

export default LoginPage;
