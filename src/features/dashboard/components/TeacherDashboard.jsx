import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import DashboardStatCards from './DashboardStatCards';
import DashboardActionHub from './DashboardActionHub';
import DashboardDeadlines from './DashboardDeadlines'; // It's actually the List view now
import DashboardRecentNotifications from './DashboardRecentNotifications';
import useAuthStore from '../../../store/authStore';
import { notificationService } from '../../notifications/api/notificationService';
import { sessionService } from '../api/sessionService';
import { classService } from '../api/classService';

const TeacherDashboard = () => {
    const { user } = useAuthStore();
    const token = user?.token;
    const userName = (user?.fullName || 'Giáo viên').split(' ').pop();
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [stats, setStats] = useState(null);
    const [isLoadingSchedule, setIsLoadingSchedule] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!token) return;
            
            try {
                // 1. Fetch Notifications
                const notifRes = await notificationService.getNotifications(token);
                if (notifRes.ok) {
                    const data = await notifRes.json();
                    setNotifications(data.slice(0, 3));
                }

                // 2. Fetch Dashboard Stats
                const statsRes = await classService.getTeacherDashboard(token);
                if (statsRes.ok) {
                    const data = await statsRes.json();
                    setStats(data.data || data);
                }

                // 3. Fetch Schedule
                setIsLoadingSchedule(true);
                const today = new Date();
                // Get Monday of current week
                const current = new Date();
                const Monday = new Date(current.setDate(current.getDate() - current.getDay() + (current.getDay() === 0 ? -6 : 1)));
                const Sunday = new Date(new Date(Monday).setDate(Monday.getDate() + 6));
                
                const startDate = Monday.toISOString().split('T')[0];
                const endDate = Sunday.toISOString().split('T')[0];
                
                const scheduleRes = await sessionService.getTeacherSchedule(token, startDate, endDate);
                if (scheduleRes.ok) {
                    const data = await scheduleRes.json();
                    const sessions = data.data || data || [];
                    
                    const mappedSchedule = sessions.map(s => {
                        const sessionDate = new Date(s.date);
                        const isToday = sessionDate.toDateString() === new Date().toDateString();
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        const isTomorrow = sessionDate.toDateString() === tomorrow.toDateString();
                        
                        let dateLabel = sessionDate.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' });
                        if (isToday) dateLabel = 'Hôm nay';
                        else if (isTomorrow) dateLabel = 'Ngày mai';
                        
                        let statusColor = '!bg-emerald-500';
                        if (isToday) statusColor = '!bg-red-500';
                        else if (isTomorrow) statusColor = '!bg-orange-500';

                        return {
                            id: s.sessionId || s.id,
                            title: s.className || s.subjectName || 'Lớp học',
                            subtitle: `${s.roomName || 'Phòng học'} • ${s.startTime?.slice(0, 5)} - ${s.endTime?.slice(0, 5)}`,
                            rightText: `${dateLabel}, ${s.startTime?.slice(0, 5)}`,
                            statusColor: statusColor,
                            dateObject: sessionDate, // Helper for sorting
                            actionIcon: 'solar:users-group-two-rounded-bold-duotone',
                            path: `/teacher/classes/${s.classId}/attendance`
                        };
                    });

                    // Sort by date/time
                    setSchedule(mappedSchedule.sort((a, b) => a.dateObject - b.dateObject).slice(0, 4));
                }
            } catch (error) {
                console.error('Failed to fetch teacher dashboard data:', error);
            } finally {
                setIsLoadingSchedule(false);
            }
        };
        
        fetchDashboardData();
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

    return (
        <div className="!max-w-7xl !mx-auto !space-y-10 !animate-fade-in custom-scrollbar !pb-10">
            {/* Header Section */}
            <div className="!flex !flex-col md:!flex-row !justify-between !items-start md:!items-center !gap-6">
                <div className="!space-y-1">
                    <h1 className="!text-3xl !font-black !text-text-main !tracking-tight">Chào thầy/cô, {userName}!</h1>
                    <p className="!text-sm !font-bold !text-text-muted">
                        Hôm nay có {schedule.filter(s => s.rightText.includes('Hôm nay')).length} lớp cần dạy và {stats?.totalStudents || 0} sinh viên đang theo dõi.
                    </p>
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
                    title: 'Lớp học đang dạy',
                    value: stats?.totalClasses || 0,
                    unit: 'Lớp',
                    icon: 'solar:presentation-bold-duotone'
                }}
                card2={{
                    title: 'Tổng số sinh viên',
                    value: stats?.totalStudents || 0,
                    unit: 'Bạn',
                    icon: 'solar:users-group-two-rounded-bold-duotone'
                }}
                card3={{
                    title: 'Chuyên cần trung bình',
                    value: stats?.averageAttendance || 0,
                    unit: '%',
                    bgClass: '!bg-amber-50 !border-amber-100',
                    iconBgClass: '!bg-amber-500 !shadow-amber-500/20',
                    titleClass: '!text-amber-900',
                    valueClass: '!text-amber-600',
                    icon: 'solar:user-check-bold-duotone',
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
                    items={schedule}
                    isLoading={isLoadingSchedule}
                    viewAllLink="/teacher/classes"
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
