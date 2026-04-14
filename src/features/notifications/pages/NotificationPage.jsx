import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import useAuthStore from '../../../store/authStore';
import { notificationService } from '../api/notificationService';
import NotificationFilters from '../components/NotificationFilters';
import NotificationItem from '../components/NotificationItem';
import { showNotification } from '../utils/toastUtils';
import { toast } from 'react-toastify';

const NotificationPage = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const token = user?.token;

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchNotifications = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const response = await notificationService.getNotifications(token);
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            } else {
                toast.error('Không thể tải thông báo');
            }
        } catch (error) {
            console.error('Fetch notifications error:', error);
            toast.error('Lỗi kết nối máy chủ');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [token]);

    const filteredNotifications = notifications.filter(notif => {
        const title = notif.title || '';
        const message = notif.message || notif.content || '';
        
        const matchesFilter = filter === 'all' || 
            (filter === 'teacher' && notif.type === 'teacher') || 
            (filter === 'system' && (notif.type === 'system' || notif.type === 'promo'));
            
        const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            message.toLowerCase().includes(searchQuery.toLowerCase());
            
        return matchesFilter && matchesSearch;
    });

    const handleMarkAsRead = async (notif) => {
        // Optimistic UI update
        if (!notif.isRead) {
            setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
            try {
                await notificationService.markAsRead(notif.id, token);
            } catch (error) {
                console.error('Mark as read error:', error);
            }
        }

        // Navigate if actionUrl exists
        if (notif.actionUrl) {
            navigate(notif.actionUrl);
        }
    };

    const handleMarkAllRead = async () => {
        // Optimistic UI update
        const hasUnread = notifications.some(n => !n.isRead);
        if (!hasUnread) return;

        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        try {
            const response = await notificationService.markAllAsRead(token);
            if (response.ok) {
                toast.success('Đã đánh dấu tất cả là đã đọc');
            }
        } catch (error) {
            console.error('Mark all read error:', error);
            toast.error('Không thể cập nhật trạng thái');
        }
    };

    return (
        <div className="!max-w-7xl !mx-auto !space-y-8 !animate-fade-in custom-scrollbar">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center !gap-6 !bg-[#F8FAFC]/50 !p-8 !rounded-[2.5rem] !border !border-dashed !border-border">
                <div className="!flex !items-center !gap-6">
                    <div className="!w-20 !h-20 !bg-primary/20 !rounded-3xl !shadow-sm !flex !items-center !justify-center !text-primary !animate-pulse">
                        <Icon icon="material-symbols:notifications-active-rounded" className="!text-3xl" />
                    </div>
                    <div>
                        <h1 className="!text-3xl sm:!text-4xl !font-black !text-text-main !tracking-tight">Trung tâm Thông báo</h1>
                        <p className="!text-sm !font-medium !text-text-muted !mt-2 !ml-1">
                            Chào {(user?.fullName || '').split(' ').pop()}! Bạn đang có <span className="!text-primary !font-black">{notifications.filter(n => !n.isRead).length} thông báo chưa đọc.</span>
                        </p>
                    </div>
                </div>

                <div className="!flex !flex-col sm:!flex-row !items-start md:!items-center !gap-4 !w-full md:!w-auto">
                    <button 
                        onClick={fetchNotifications}
                        disabled={loading}
                        className="!w-full sm:!w-auto !px-6 !py-3 !bg-white !text-primary !border !border-primary/20 !rounded-2xl !text-sm !font-black hover:!bg-primary/5 !transition-all !flex !items-center !justify-center !gap-2"
                    >
                        <Icon icon="solar:refresh-bold-duotone" className={loading ? 'animate-spin' : ''} />
                        Làm mới
                    </button>
                </div>
            </div>

            {/* Navigation & Filters */}
            <NotificationFilters 
                activeFilter={filter} 
                onFilterChange={setFilter} 
                onMarkAllRead={handleMarkAllRead}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            {/* Notifications List */}
            <div className="!space-y-4">
                {loading ? (
                    <div className="!py-32 !text-center !bg-white !rounded-[40px] !border !border-border !shadow-sm">
                        <div className="!flex !justify-center !mb-6">
                            <Icon icon="solar:loading-bold-duotone" className="!text-5xl !text-primary !animate-spin" />
                        </div>
                        <h3 className="!text-xl !font-black !text-text-main !mb-2">Đang tải thông báo...</h3>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="!py-32 !text-center !bg-white !rounded-[40px] !border !border-border !shadow-sm">
                        <div className="!w-24 !h-24 !bg-background !rounded-full !flex !items-center !justify-center !mx-auto !mb-6">
                            <Icon icon="solar:ghost-bold-duotone" className="!text-5xl !text-text-muted" />
                        </div>
                        <h3 className="!text-xl !font-black !text-text-main !mb-2">Ố ô! Không tìm thấy gì nhỉ?</h3>
                        <p className="!text-sm !font-medium !text-text-muted !max-w-xs !mx-auto">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm xem sao bạn nhé.</p>
                    </div>
                ) : (
                    <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-6">
                        {filteredNotifications.map(notif => (
                            <NotificationItem 
                                key={notif.id} 
                                notification={notif} 
                                onClick={handleMarkAsRead} 
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Tips */}
            <div className="!p-8 !bg-primary/5 !rounded-[2.5rem] !border !border-primary/10 !flex !items-center !gap-6">
                <div className="!w-12 !h-12 !bg-white !rounded-2xl !flex !items-center !justify-center !text-primary !shadow-sm">
                    <Icon icon="solar:lightbulb-bold-duotone" className="!text-2xl" />
                </div>
                <div>
                    <h4 className="!text-sm !font-black !text-text-main">Mẹo nhỏ cho bạn</h4>
                    <p className="!text-xs !font-bold !text-text-muted">Bấm vào bất kỳ thông báo nào để xem chi tiết và đánh dấu là "Đã đọc" nhé!</p>
                </div>
            </div>
        </div>
    );
};

export default NotificationPage;
