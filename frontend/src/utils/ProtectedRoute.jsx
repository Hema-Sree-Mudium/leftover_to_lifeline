import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    // Bring in 'loading' from the context
    const { user, loading } = useContext(AuthContext);

    // --- THE FIX: THE WAITING ROOM ---
    // Do not make any routing decisions while the API is still fetching the user
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        ); 
    }

    // --- THE BOUNCER ---
    // Now that loading is false, if there is still no user, they are truly not logged in.
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // --- THE VIP LIST ---
    // Check if the logged-in user has the correct role for this specific dashboard
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // If a DONOR tries to access /admin, kick them back to their own dashboard
        // (Assuming you have logic to handle where they should go, otherwise send to login)
        return <Navigate to="/login" replace />; 
    }

    return children;
};

export default ProtectedRoute;