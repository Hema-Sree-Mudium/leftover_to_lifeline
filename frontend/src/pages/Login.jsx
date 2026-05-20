import { Link } from 'react-router-dom';
import React, { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    // If already logged in, do not show login page
    if (user) {
        const roleRoutes = {
            'ADMIN': '/admin',
            'DONOR': '/donor',
            'NGO': '/ngo',
            'VOLUNTEER': '/volunteer'
        };
        return <Navigate to={roleRoutes[user.role]} replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. THE PURGE: Destroy any lingering session data before doing anything
            localStorage.clear(); 
        
            // 2. The standard login request
            const response = await api.post('/auth/login/', formData);
        
            // 3. Save the brand new credentials
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
        
            // NOTE: Make sure your backend actually returns the user's role here!
            // If it doesn't, you need to fetch the user profile, or decode the JWT.
            localStorage.setItem('role', response.data.role); 
        
            alert("Login successful!");
        
            // Route based on the NEW role
            if (response.data.role === 'DONOR') navigate('/donor-dashboard');
            else if (response.data.role === 'NGO') navigate('/ngo-dashboard');
            else if (response.data.role === 'VOLUNTEER') navigate('/volunteer-dashboard');
            else navigate('/admin');

        } catch (err) {
            // 1. Log the full error to the console safely
            console.error("ACTUAL BACKEND ERROR:", err.response || err.message || err);
    
            // 2. Extract the message safely
            const errorMessage = err.response?.data?.detail || err.message || "Server connection failed. Check your internet or server status.";
    
            // 3. Update the UI using your ACTUAL state function
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