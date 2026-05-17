import React, { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

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
            await login(username, password);
            // The AuthContext will automatically update the 'user' state, 
            // triggering the redirect logic above on the next render.
        } catch (err) {
            setError('Invalid credentials. Please try again.');
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
                </form>
            </div>
        </div>
    );
};

export default Login;