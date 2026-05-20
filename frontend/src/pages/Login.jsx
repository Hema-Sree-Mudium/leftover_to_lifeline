import { Link, Navigate } from 'react-router-dom';
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    // We only need 'user' here to check if they are already logged in.
    const { user } = useContext(AuthContext); 

    // --- FIX 1: STANDARDIZED ROUTES ---
    // These must exactly match the URLs defined in your App.jsx Router
    if (user && user.role) {
        const roleRoutes = {
            'ADMIN': '/admin',
            'DONOR': '/donor',
            'NGO': '/ngo',
            'VOLUNTEER': '/volunteer'
        };
        const targetRoute = roleRoutes[user.role] || '/login';
        
        if (targetRoute !== '/login') {
            return <Navigate to={targetRoute} replace />;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const formData = {
            username: username,
            password: password
        };

        try {
            // 1. Destroy lingering sessions
            localStorage.clear(); 
        
            // 2. Request new tokens
            const response = await api.post('/auth/login/', formData);
        
            // 3. Save new credentials to the browser's hard drive
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
        
            const userRole = response.data.role || 'UNKNOWN';
            localStorage.setItem('role', userRole); 
        
            alert("Login successful!");
        
            // --- FIX 2: THE HARD REDIRECT ---
            // This forces the browser to refresh, wiping the outdated AuthContext
            // and forcing it to read the new localStorage data on boot.
            if (userRole === 'DONOR') {
                window.location.href = '/donor';
            } else if (userRole === 'NGO') {
                window.location.href = '/ngo';
            } else if (userRole === 'VOLUNTEER') {
                window.location.href = '/volunteer';
            } else {
                window.location.href = '/admin';
            }

        } catch (err) {
            console.error("ACTUAL BACKEND ERROR:", err.response || err.message || err);
            const errorMessage = err.response?.data?.detail || err.message || "Server connection failed. Check your internet or server status.";
            setError(errorMessage);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <h2 className="mb-4 text-center">LeftOver ToLifeLine</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="card p-4 shadow-sm">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                    <div className="text-center mt-3">
                        <Link to="/signup">Don't have an account? Sign up here.</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;