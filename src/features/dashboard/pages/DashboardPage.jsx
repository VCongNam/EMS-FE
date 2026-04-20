import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/authStore';
import StudentDashboard from '../components/StudentDashboard';
import TeacherDashboard from '../components/TeacherDashboard';
import TADashboard from '../components/TADashboard';

const DashboardPage = () => {
    const { user } = useAuthStore();
    const role = user?.role || 'student';
    const navigate = useNavigate();

    useEffect(() => {
        if (role === 'student') {
            navigate('/student/classes', { replace: true });
        }
    }, [role, navigate]);

    switch (role) {
        case 'teacher':
            return <TeacherDashboard />;
        case 'TA':
        case 'assistant':
            return <TADashboard />;
        case 'student':
            return null; // Redirecting...
        default:
            return <StudentDashboard />;
    }
};

export default DashboardPage;
