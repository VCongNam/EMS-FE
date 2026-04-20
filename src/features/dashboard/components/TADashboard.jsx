import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import DashboardStatCards from './DashboardStatCards';
import DashboardActionHub from './DashboardActionHub';
import DashboardDeadlines from './DashboardDeadlines'; // It's actually the List view now
import DashboardRecentNotifications from './DashboardRecentNotifications';
import useAuthStore from '../../../store/authStore';
import { notificationService } from '../../notifications/api/notificationService';
import { formatViDate } from '../../../utils/dateUtils';

const TADashboard = () => {
    const { user } = useAuthStore();
    const token = user?.token;
    const userName = (user?.fullName || 'Trợ giảng').split(' ').pop();
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

    // Mock Data for TA
    const MOCK_TA_NEXT_CLASS = { subject: 'Giải tích 1 (SE1701)', time: '14:00 - 15:30', room: 'P.302' };
    const MOCK_TASK_COMPLETION = 85; 
    const MOCK_NEW_REQUESTS = 8;

    const TA_ACTIONS = [
        { 
            id: 'board', 
            label: 'Bảng Nhiệm Vụ', 
            icon: 'solar:clipboard-list-bold-duotone', 
            path: '/ta/tasks', 
            color: '!text-purple-600', 
            bg: '!bg-purple-50', 
            shadow: '!shadow-purple-500/10' 
        },
        { 
            id: 'report', 
            label: 'Báo cáo Tiến độ', 
            icon: 'solar:chart-square-bold-duotone', 
            path: '/reports', 
            color: '!text-emerald-600', 
            bg: '!bg-emerald-50', 
            shadow: '!shadow-emerald-500/10' 
        },
    ];

    const TA_TASKS = [
        { id: 1, title: 'Hỗ trợ SV làm bài lab 3', subtitle: 'Lớp SE1701', rightText: 'Hạn: Hôm nay 17:00', statusColor: '!bg-red-500', actionIcon: 'solar:check-circle-bold-duotone' },
        { id: 2, title: 'Tổng hợp danh sách cấm thi', subtitle: 'Theo yêu cầu Thầy Hùng', rightText: 'Hạn: Ngày mai 10:00', statusColor: '!bg-orange-500', actionIcon: 'solar:check-circle-bold-duotone' },
    ];

    return (
        <div className="!max-w-7xl !mx-auto !space-y-10 !animate-fade-in custom-scrollbar !pb-10">
            {/* Header Section */}
            <div className="!flex !flex-col md:!flex-row !justify-between !items-start md:!items-center !gap-6">
                <div className="!space-y-1">
                    <h1 className="!text-3xl !font-black !text-text-main !tracking-tight">Chào bạn, {userName}!</h1>
                    <p className="!text-sm !font-bold !text-text-muted">Bạn có 5 nhiệm vụ đang xử lý trong tuần này.</p>
                </div>
                <div className="!flex !items-center !gap-3 !bg-white !p-2 !rounded-2xl !border !border-border !shadow-sm">
                    <div className="!w-10 !h-10 !rounded-xl !bg-primary/10 !text-primary !flex !items-center !justify-center">
                        <Icon icon="solar:calendar-bold-duotone" className="!text-xl" />
                    </div>
                    <div className="!pr-4">
                        <p className="!text-[10px] !font-black !text-text-muted !uppercase !tracking-widest">Ngày hôm nay</p>
                        <p className="!text-sm !font-black !text-text-main">{formatViDate(new Date(), { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    </div>
                </div>
            </div>

            {/* Horizontal Stats */}
            <DashboardStatCards 
                card1={{
                    title: 'Lớp hỗ trợ kế tiếp',
                    subject: MOCK_TA_NEXT_CLASS.subject,
                    time: MOCK_TA_NEXT_CLASS.time,
                    room: MOCK_TA_NEXT_CLASS.room,
                    icon: 'solar:users-group-rounded-bold-duotone'
                }}
                card2={{
                    title: 'Tiến độ Nhiệm vụ',
                    value: MOCK_TASK_COMPLETION,
                    trendText: 'Đạt chỉ tiêu tuần',
                    trendColor: '!text-emerald-500',
                    trendIcon: 'solar:check-circle-bold-duotone',
                    icon: 'solar:clipboard-check-bold-duotone'
                }}
                card3={{
                    title: 'Yêu cầu hỗ trợ mới',
                    value: MOCK_NEW_REQUESTS,
                    unit: 'Tin nhắn',
                    bgClass: '!bg-blue-50 !border-blue-100',
                    iconBgClass: '!bg-blue-500 !shadow-blue-500/20',
                    titleClass: '!text-blue-900',
                    valueClass: '!text-blue-600',
                    icon: 'solar:letter-opened-bold-duotone',
                    button: {
                        label: 'Xử lý ngay',
                        path: '/students', // Assume routing logic handles TA tasks based on role
                        className: '!text-blue-600 !border-blue-200 hover:!bg-blue-100'
                    }
                }}
            />

            {/* Action Hub - Priority Actions */}
            <DashboardActionHub actions={TA_ACTIONS} />

            {/* Content Grid */}
            <div className="!grid !grid-cols-1 lg:!grid-cols-2 !gap-8">
                {/* Upcoming Schedule/Tasks */}
                <DashboardDeadlines 
                    title="Việc cần làm sắp hạn"
                    icon="solar:check-read-bold-duotone"
                    iconBgBase="!bg-purple-50"
                    iconColor="!text-purple-500"
                    items={TA_TASKS}
                    viewAllLink="/ta/tasks"
                />

                {/* Updates */}
                <DashboardRecentNotifications 
                    title="Cập nhật gần đây"
                    icon="solar:history-bold-duotone"
                    iconBgBase="!bg-emerald-50"
                    iconColor="!text-emerald-500"
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
                    <h5 className="!text-sm !font-black !text-primary !uppercase !tracking-widest !mb-1">Góc Trợ giảng</h5>
                    <p className="!text-lg !font-black !text-text-main !tracking-tight">"Bạn đang làm rất tốt, hãy giữ vững phong độ hỗ trợ các bạn sinh viên nhé!"</p>
                </div>
            </div>
        </div>
    );
};

export default TADashboard;
