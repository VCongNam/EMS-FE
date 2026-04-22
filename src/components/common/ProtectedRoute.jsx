import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { jwtDecode } from 'jwt-decode';

/**
 * ProtectedRoute component handles access to private routes.
 * Cập nhật: Tự động kiểm tra thời hạn của JWT Token để Force Logout nếu hết hạn.
 */
const ProtectedRoute = ({ redirectPath = '/login', allowedRoles = [] }) => {
    const { isAuthenticated, user, logout, getHomePath } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated && user?.token) {
            try {
                const decodedToken = jwtDecode(user.token);
                const currentTime = Date.now() / 1000;
                
                // Nếu token đã hết hợp lệ
                if (decodedToken.exp < currentTime) {
                    console.warn("Token expired. Forcing logout...");
                    logout();
                }
            } catch (error) {
                console.error("Invalid token format. Forcing logout...");
                logout();
            }
        }
    }, [isAuthenticated, user, logout]);

    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    // Role-based authorization
    if (allowedRoles.length > 0 && user?.role) {
        const userRole = user.role.toLowerCase();
        const isAuthorized = allowedRoles.some(role => role.toLowerCase() === userRole);
        
        if (!isAuthorized) {
            console.warn(`User role '${userRole}' not authorized for this route.`);
            return <Navigate to={getHomePath()} replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
