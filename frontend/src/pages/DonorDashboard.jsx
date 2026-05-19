import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const DonorDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [donations, setDonations] = useState([]);
    const [formData, setFormData] = useState({ food_description: '', quantity: '', image: null });

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        const response = await api.get('/donations/');
        setDonations(response.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('food_description', formData.food_description);
        data.append('quantity', formData.quantity);
        if (formData.image) data.append('image', formData.image);

        try {
            await api.post('/donations/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData({ food_description: '', quantity: '', image: null });
            fetchDonations();
        } catch (error) {
            console.error("Failed to post donation", error);
        }
    };

    const handleNuclearLogout = () => {
        // 1. Destroy all tokens and roles in the browser memory
        localStorage.clear();
    
        // 2. Force the browser to redirect and dump React's internal memory state
        window.location.href = '/login'; 
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <h2>Donor Dashboard</h2>
                <div>
                    <span className="me-3 fw-bold">Logged in as: {user.username}</span>
                    <button onClick={handleNuclearLogout} className="btn btn-danger">Log Out</button>
                </div>
            </div>

            <div className="row">
                <div className="col-md-5">
                    <div className="card p-3 shadow-sm mb-4">
                        <h4>Donate Food</h4>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Food Description</label>
                                <textarea className="form-control" required rows="3" value={formData.food_description} onChange={(e) => setFormData({ ...formData, food_description: e.target.value })}></textarea>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Quantity (e.g., Serves 50)</label>
                                <input type="text" className="form-control" required value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Food Image</label>
                                <input type="file" className="form-control" accept="image/*" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} />
                            </div>
                            <button type="submit" className="btn btn-success w-100">Submit Donation</button>
                        </form>
                    </div>
                </div>
                
                <div className="col-md-7">
                    <h4>My Past Donations</h4>
                    {donations.map(d => (
                        <div key={d.id} className="card mb-3 shadow-sm">
                            <div className="card-body row">
                                {d.image && <div className="col-4"><img src={d.image} alt="Food" className="img-fluid rounded" /></div>}
                                <div className="col-8">
                                    <h5 className="card-title">Status: <span className="badge bg-primary">{d.status}</span></h5>
                                    <p className="card-text">{d.food_description}</p>
                                    <p className="card-text"><small className="text-muted">Qty: {d.quantity}</small></p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DonorDashboard;