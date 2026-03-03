import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * ProtectedRoute component handles access to private routes.
 * It checks if the user is authenticated (using a placeholder for now).
 */
const ProtectedRoute = ({ isAuthenticated, redirectPath = '/login' }) => {
    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
