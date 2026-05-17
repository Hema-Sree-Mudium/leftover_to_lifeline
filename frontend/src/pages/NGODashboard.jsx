import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const NGODashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [donations, setDonations] = useState([]);

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        const response = await api.get('/donations/');
        setDonations(response.data);
    };

    const handleAction = async (id, actionType) => {
        await api.post(`/donations/${id}/update_status/`, { action: actionType });
        fetchDonations();
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <h2>NGO Dashboard</h2>
                <div>
                    <span className="me-3 fw-bold">Logged in as: {user.username}</span>
                    <button onClick={logout} className="btn btn-sm btn-danger">Logout</button>
                </div>
            </div>

            <h4>Food Available for Acceptance</h4>
            <div className="row">
                {donations.map(d => (
                    <div key={d.id} className="col-md-4 mb-3">
                        <div className="card shadow-sm h-100">
                            {d.image && <img src={d.image} className="card-img-top" alt="Food" style={{height: '200px', objectFit: 'cover'}}/>}
                            <div className="card-body">
                                <h5 className="card-title">Status: <span className="badge bg-warning text-dark">{d.status}</span></h5>
                                <p className="card-text">{d.food_description}</p>
                                <p className="card-text"><small className="text-muted">Qty: {d.quantity}</small></p>
                                {d.status === 'AVAILABLE' && (
                                    <button onClick={() => handleAction(d.id, 'ACCEPT')} className="btn btn-primary w-100">Accept Donation</button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NGODashboard;    