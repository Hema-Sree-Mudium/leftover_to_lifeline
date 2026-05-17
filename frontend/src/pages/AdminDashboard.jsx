import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [allDonations, setAllDonations] = useState([]);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            // Because the user is an ADMIN, the backend automatically returns all donations
            const donationRes = await api.get('/donations/');
            setAllDonations(donationRes.data);

            const statsRes = await api.get('/admin-stats/');
            setStats(statsRes.data);
        } catch (error) {
            console.error("Failed to fetch admin oversight data", error);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <h2>Admin Oversight Panel</h2>
                <div>
                    <span className="me-3 fw-bold">System Administrator: {user.username}</span>
                    <button onClick={logout} className="btn btn-sm btn-danger">Logout</button>
                </div>
            </div>

            {/* Analytics Row */}
            {stats && (
                <div className="row mb-5">
                    <div className="col-md-3">
                        <div className="card text-white bg-primary shadow-sm">
                            <div className="card-body text-center">
                                <h3>{stats.total_users}</h3>
                                <span>Active Users</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card text-white bg-success shadow-sm">
                            <div className="card-body text-center">
                                <h3>{stats.total_donations}</h3>
                                <span>Total Donations</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card text-white bg-info shadow-sm">
                            <div className="card-body text-center">
                                <h3>{stats.in_transit}</h3>
                                <span>In Transit / Pending</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card text-white bg-secondary shadow-sm">
                            <div className="card-body text-center">
                                <h3>{stats.delivered_donations}</h3>
                                <span>Successfully Delivered</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Global Data Table */}
            <h4>Global Donation Ledger</h4>
            <div className="table-responsive shadow-sm">
                <table className="table table-hover table-bordered align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Donor</th>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Status</th>
                            <th>Assigned NGO</th>
                            <th>Volunteer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allDonations.map(d => (
                            <tr key={d.id}>
                                <td>#{d.id}</td>
                                <td>{d.donor_details?.username}</td>
                                <td>{d.food_description}</td>
                                <td>{d.quantity}</td>
                                <td><span className={`badge bg-${d.status === 'DELIVERED' ? 'success' : 'warning text-dark'}`}>{d.status}</span></td>
                                <td>{d.ngo ? `User ID: ${d.ngo}` : 'Unassigned'}</td>
                                <td>{d.volunteer ? `User ID: ${d.volunteer}` : 'Unassigned'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;