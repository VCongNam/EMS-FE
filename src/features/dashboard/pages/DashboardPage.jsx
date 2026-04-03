import React from 'react';
import useAuthStore from '../../../store/authStore';
import StudentDashboard from '../components/StudentDashboard';

const DashboardPage = () => {
    const { user } = useAuthStore();
    const role = user?.role || 'student';

    if (role === 'student') {
        return <StudentDashboard />;
    }

    return (
        <div className="container">
            <h1 className="text-3xl font-bold mb-2">Bảng điều khiển (Dashboard)</h1>
            <p className="text-text-muted">Chào mừng bạn quay trở lại! Dưới đây là tóm tắt hoạt động của bạn.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
                    <h3 className="text-primary font-bold mb-2">Tổng số lớp</h3>
                    <p className="text-4xl font-bold">12</p>
                </div>
                <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
                    <h3 className="text-secondary font-bold mb-2">Học sinh đang học</h3>
                    <p className="text-4xl font-bold">156</p>
                </div>
                <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
                    <h3 className="text-accent font-bold mb-2">Công việc hôm nay</h3>
                    <p className="text-4xl font-bold">4</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;

