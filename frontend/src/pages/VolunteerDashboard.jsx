import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const VolunteerDashboard = () => {
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
                <h2>Volunteer Dashboard</h2>
                <div>
                    <span className="me-3 fw-bold">Logged in as: {user.username}</span>
                    <button onClick={logout} className="btn btn-sm btn-danger">Logout</button>
                </div>
            </div>

            <h4>Delivery Assignments</h4>
            <div className="row">
                {donations.map(d => (
                    <div key={d.id} className="col-md-6 mb-3">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5>Status: <span className="badge bg-info">{d.status}</span></h5>
                                <p><strong>Food:</strong> {d.food_description}</p>
                                <p><strong>Donor Info:</strong> {d.donor_details?.username} ({d.donor_details?.phone_number || 'No phone provided'})</p>
                                
                                {d.status === 'ACCEPTED' && (
                                    <button onClick={() => handleAction(d.id, 'PICKUP')} className="btn btn-warning w-100">Confirm Pick Up</button>
                                )}
                                {d.status === 'PICKED_UP' && (
                                    <button onClick={() => handleAction(d.id, 'DELIVER')} className="btn btn-success w-100">Mark as Delivered</button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VolunteerDashboard;