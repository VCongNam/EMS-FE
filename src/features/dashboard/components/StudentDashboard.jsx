import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import DashboardStatCards from './DashboardStatCards';
import DashboardActionHub from './DashboardActionHub';
import DashboardDeadlines from './DashboardDeadlines';
import DashboardRecentNotifications from './DashboardRecentNotifications';
import useAuthStore from '../../../store/authStore';
import { notificationService } from '../../notifications/api/notificationService';

const StudentDashboard = () => {
    const { user } = useAuthStore();
    const token = user?.token;
    const userName = (user?.fullName || 'Học sinh').split(' ').pop();
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchRecentNotifications = async () => {
            if (!token) return;
            try {
                const response = await notificationService.getNotifications(token);
                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data.slice(0, 3)); // Only show top 3
                }
            } catch (error) {
                console.error('Failed to fetch dashboard notifications:', error);
            }
        };
        fetchRecentNotifications();
    }, [token]);

    const handleNotificationClick = async (notif) => {
        // Mark as read in UI
        if (notif.isRead === false) {
            setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
            try {
                await notificationService.markAsRead(notif.id, token);
            } catch (error) {
                console.error('Error marking as read:', error);
            }
        }
        
        // Navigate
        if (notif.actionUrl) {
            navigate(notif.actionUrl);
        } else {
            navigate('/notifications');
        }
    };

    // Mock Data for Dashboard integration
    const MOCK_NEXT_CLASS = { subject: 'Giải tích 1', time: '14:00 - 15:30', room: 'P.302' };
    const MOCK_ATTENDANCE = 92;
    const MOCK_BALANCE = 1250000;

    return (
        <div className="!max-w-7xl !mx-auto !space-y-10 !animate-fade-in custom-scrollbar !pb-10">
            {/* Header Section */}
            <div className="!flex !flex-col md:!flex-row !justify-between !items-start md:!items-center !gap-6">
                <div className="!space-y-1">
                    <h1 className="!text-3xl !font-black !text-text-main !tracking-tight">Chào quay lại, {userName}!</h1>
                    <p className="!text-sm !font-bold !text-text-muted">Hôm nay bạn có 3 tiết học và 2 bài tập cần hoàn thành.</p>
                </div>
                <div className="!flex !items-center !gap-3 !bg-white !p-2 !rounded-2xl !border !border-border !shadow-sm">
                    <div className="!w-10 !h-10 !rounded-xl !bg-primary/10 !text-primary !flex !items-center !justify-center">
                        <Icon icon="solar:calendar-bold-duotone" className="!text-xl" />
                    </div>
                    <div className="!pr-4">
                        <p className="!text-[10px] !font-black !text-text-muted !uppercase !tracking-widest">Ngày hôm nay</p>
                        <p className="!text-sm !font-black !text-text-main">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    </div>
                </div>
            </div>

            {/* Horizontal Stats */}
            <DashboardStatCards 
                card1={{
                    title: 'Tiết học tiếp theo',
                    subject: MOCK_NEXT_CLASS?.subject,
                    time: MOCK_NEXT_CLASS?.time,
                    room: MOCK_NEXT_CLASS?.room,
                    icon: 'solar:calendar-date-bold-duotone'
                }}
                card2={{
                    title: 'Chuyên cần',
                    value: MOCK_ATTENDANCE,
                    trendText: 'Tốt hơn tháng trước',
                    trendColor: '!text-emerald-500',
                    trendIcon: 'solar:arrow-up-bold-duotone',
                    icon: 'solar:user-rounded-bold-duotone'
                }}
                card3={{
                    title: 'Dư nợ Học phí',
                    value: MOCK_BALANCE,
                    unit: '₫',
                    bgClass: '!bg-orange-50 !border-orange-100',
                    iconBgClass: '!bg-orange-500 !shadow-orange-500/20',
                    titleClass: '!text-orange-900',
                    valueClass: '!text-orange-600',
                    icon: 'solar:wallet-money-bold-duotone',
                    button: {
                        label: 'Thanh toán nợ',
                        path: '/tuition-payment',
                        className: '!text-orange-600 !border-orange-200 hover:!bg-orange-100'
                    }
                }}
            />

            {/* Action Hub - Priority Actions */}
            <DashboardActionHub />

            {/* Content Grid */}
            <div className="!grid !grid-cols-1 lg:!grid-cols-2 !gap-8">
                {/* Upcoming Deadlines */}
                <DashboardDeadlines />

                {/* Recent Notifications Feed */}
                <DashboardRecentNotifications 
                    notifications={notifications}
                    onNotificationClick={handleNotificationClick}
                    viewAllLink="/notifications"
                />
            </div>

            {/* Decorative Footer Quote / Tip */}
            <div className="!bg-primary/5 !p-8 !rounded-[2.5rem] !border !border-primary/10 !flex !flex-col md:!flex-row !items-center !gap-6 !text-center md:!text-left">
                <div className="!w-16 !h-16 !rounded-3xl !bg-white !text-primary !flex !items-center !justify-center !shadow-lg !shadow-primary/10 !shrink-0">
                    <Icon icon="solar:lightbulb-bold-duotone" className="!text-3xl" />
                </div>
                <div>
                    <h5 className="!text-sm !font-black !text-primary !uppercase !tracking-widest !mb-1">Mẹo học tập nhỏ</h5>
                    <p className="!text-lg !font-black !text-text-main !tracking-tight">"Hãy hoàn thành bài tập sớm hơn 1 ngày để có thời gian ôn tập kỹ hơn nhé!"</p>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
