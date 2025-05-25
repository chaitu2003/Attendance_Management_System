import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        if (username === 'admin' && password === 'admin') {
            navigate('/admin-homepage'); // Redirect to Admin Homepage
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="admin-login-background">
            <div className="admin-login-container">
                <h1 className="admin-login-header">Admin Login</h1>
                <form className="admin-login-form" onSubmit={handleLogin}>
                    <input
                        type="text"
                        className="admin-login-input"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="admin-login-input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="admin-login-button">Login</button>
                </form>
                {error && <p className="admin-login-error">{error}</p>}
            </div>
        </div>
    );
};

export default AdminLogin;
