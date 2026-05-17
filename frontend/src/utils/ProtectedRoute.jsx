import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="container mt-5">Loading secure environment...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // If logged in but wrong role, send them back to their respective dashboard
        const roleRoutes = {
            'ADMIN': '/admin',
            'DONOR': '/donor',
            'NGO': '/ngo',
            'VOLUNTEER': '/volunteer'
        };
        return <Navigate to={roleRoutes[user.role] || '/login'} replace />;
    }

    return children;
};

export default ProtectedRoute;