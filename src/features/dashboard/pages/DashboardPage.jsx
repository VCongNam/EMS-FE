import React from 'react';
import useAuthStore from '../../../store/authStore';
import StudentDashboard from '../components/StudentDashboard';
import TeacherDashboard from '../components/TeacherDashboard';
import TADashboard from '../components/TADashboard';

const DashboardPage = () => {
    const { user } = useAuthStore();
    const role = user?.role || 'student';

    switch (role) {
        case 'teacher':
            return <TeacherDashboard />;
        case 'TA':
        case 'assistant':
            return <TADashboard />;
        case 'student':
        default:
            return <StudentDashboard />;
    }
};

export default DashboardPage;

