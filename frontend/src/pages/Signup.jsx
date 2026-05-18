import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'DONOR' // Default role
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/auth/register/', formData);
            alert("Account created successfully! Please log in.");
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create account. Try again.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-body p-5">
                            <h2 className="text-center mb-4">Join LifeLine</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Username</label>
                                    <input type="text" name="username" className="form-control" required onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input type="password" name="password" className="form-control" required onChange={handleChange} />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">I want to register as a:</label>
                                    <select name="role" className="form-select" onChange={handleChange}>
                                        <option value="DONOR">Food Donor (Individual/Restaurant)</option>
                                        <option value="NGO">NGO (Receive Food)</option>
                                        <option value="VOLUNTEER">Delivery Volunteer</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Create Account</button>
                            </form>
                            <div className="text-center mt-3">
                                <Link to="/login">Already have an account? Log in here.</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;