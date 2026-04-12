import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import DashboardStatCards from './DashboardStatCards';
import DashboardActionHub from './DashboardActionHub';
import DashboardDeadlines from './DashboardDeadlines'; // It's actually the List view now
import DashboardRecentNotifications from './DashboardRecentNotifications';
import useAuthStore from '../../../store/authStore';
import { notificationService } from '../../notifications/api/notificationService';

const TeacherDashboard = () => {
    const { user } = useAuthStore();
    const token = user?.token;
    const userName = (user?.fullName || 'Giáo viên').split(' ').pop();
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

    // Mock Data for Teacher
    const MOCK_TEACHER_NEXT_CLASS = { subject: 'Giải tích 1 (SE1701)', time: '14:00 - 15:30', room: 'P.302' };
    const MOCK_ATTENDANCE_OVERALL = 92;
    const MOCK_PENDING_GRADING = 15;

    const TEACHER_ACTIONS = [
        { 
            id: 'attendance', 
            label: 'Điểm danh nhanh', 
            icon: 'solar:user-check-bold-duotone', 
            path: '/teacher/classes', 
            color: '!text-orange-600', 
            bg: '!bg-orange-50', 
            shadow: '!shadow-orange-500/10' 
        },
        { 
            id: 'upload', 
            label: 'Đăng tài liệu', 
            icon: 'solar:cloud-upload-bold-duotone', 
            path: '/teacher/classes', 
            color: '!text-blue-600', 
            bg: '!bg-blue-50', 
            shadow: '!shadow-blue-500/10' 
        },
        { 
            id: 'assignment', 
            label: 'Giao bài tập', 
            icon: 'solar:document-add-bold-duotone', 
            path: '/teacher/classes', 
            color: '!text-emerald-600', 
            bg: '!bg-emerald-50', 
            shadow: '!shadow-emerald-500/10' 
        },
    ];

    const TEACHER_SCHEDULE = [
        { id: 1, title: 'Giải tích 1 (SE1701)', subtitle: 'P.302', rightText: 'Hôm nay, 14:00', statusColor: '!bg-red-500', actionIcon: 'solar:users-group-two-rounded-bold-duotone' },
        { id: 2, title: 'Vật lý Đại cương (SE1702)', subtitle: 'P.105', rightText: 'Ngày mai, 08:00', statusColor: '!bg-orange-500', actionIcon: 'solar:users-group-two-rounded-bold-duotone' },
        { id: 3, title: 'Triết học Mác-Lênin (SE1703)', subtitle: 'Hội trường A', rightText: 'Thứ 4, 13:00', statusColor: '!bg-emerald-500', actionIcon: 'solar:users-group-two-rounded-bold-duotone' },
    ];

    return (
        <div className="!max-w-7xl !mx-auto !space-y-10 !animate-fade-in custom-scrollbar !pb-10">
            {/* Header Section */}
            <div className="!flex !flex-col md:!flex-row !justify-between !items-start md:!items-center !gap-6">
                <div className="!space-y-1">
                    <h1 className="!text-3xl !font-black !text-text-main !tracking-tight">Chào thầy/cô, {userName}!</h1>
                    <p className="!text-sm !font-bold !text-text-muted">Hôm nay có 2 lớp cần dạy và 15 bài tập cần chấm.</p>
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
                    title: 'Ca dạy tiếp theo',
                    subject: MOCK_TEACHER_NEXT_CLASS.subject,
                    time: MOCK_TEACHER_NEXT_CLASS.time,
                    room: MOCK_TEACHER_NEXT_CLASS.room,
                    icon: 'solar:presentation-bold-duotone'
                }}
                card2={{
                    title: 'Tỷ lệ đi học (TB)',
                    value: MOCK_ATTENDANCE_OVERALL,
                    trendText: 'Ổn định',
                    trendColor: '!text-blue-500',
                    trendIcon: 'solar:graph-up-bold-duotone',
                    icon: 'solar:users-group-two-rounded-bold-duotone'
                }}
                card3={{
                    title: 'Bài tập chờ chấm',
                    value: MOCK_PENDING_GRADING,
                    unit: 'Bài',
                    bgClass: '!bg-amber-50 !border-amber-100',
                    iconBgClass: '!bg-amber-500 !shadow-amber-500/20',
                    titleClass: '!text-amber-900',
                    valueClass: '!text-amber-600',
                    icon: 'solar:document-bold-duotone',
                    button: {
                        label: 'Chấm ngay',
                        path: '/teacher/classes',
                        className: '!text-amber-600 !border-amber-200 hover:!bg-amber-100'
                    }
                }}
            />

            {/* Action Hub - Priority Actions */}
            <DashboardActionHub actions={TEACHER_ACTIONS} />

            {/* Content Grid */}
            <div className="!grid !grid-cols-1 lg:!grid-cols-2 !gap-8">
                {/* Upcoming Schedule */}
                <DashboardDeadlines 
                    title="Lịch giảng dạy"
                    icon="solar:calendar-mark-bold-duotone"
                    iconBgBase="!bg-blue-50"
                    iconColor="!text-blue-500"
                    items={TEACHER_SCHEDULE}
                    viewAllLink="/schedule-management"
                />

                {/* Recent Notifications Feed / Attention */}
                <DashboardRecentNotifications 
                    title="Thông báo sinh viên"
                    icon="solar:bell-bing-bold-duotone"
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
                    <h5 className="!text-sm !font-black !text-primary !uppercase !tracking-widest !mb-1">Góc chia sẻ</h5>
                    <p className="!text-lg !font-black !text-text-main !tracking-tight">"Người thầy vĩ đại là người biết truyền cảm hứng."</p>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
