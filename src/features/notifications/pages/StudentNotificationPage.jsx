import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import NotificationFilters from '../components/NotificationFilters';
import NotificationItem from '../components/NotificationItem';
import { showNotification } from '../utils/toastUtils';

const MOCK_NOTIFICATIONS = [
    { 
        id: 1, type: 'teacher', title: 'Bài tập mới: Giải tích 1', content: 'Thầy Hùng vừa đăng bài tập chương 2. Hạn chót nộp bài là thứ 6 tuần này.', 
        timestamp: '2 phút trước', isRead: false, teacherName: 'Hùng', classId: 'MATH101' 
    },
    { 
        id: 2, type: 'promo', title: 'Ưu đãi hè rực rỡ!', content: 'Giảm ngay 20% học phí cho các khóa học Tiếng Anh cấp tốc khi đăng ký trước ngày 15/10.', 
        timestamp: '1 giờ trước', isRead: false 
    },
    { 
        id: 3, type: 'system', title: 'Bảo trì hệ thống', content: 'Hệ thống sẽ tạm ngưng hoạt động từ 00:00 đến 02:00 ngày mai để nâng cấp tính năng mới.', 
        timestamp: '5 giờ trước', isRead: true 
    },
    { 
        id: 4, type: 'teacher', title: 'Kết quả kiểm tra 15p', content: 'Thầy Minh đã cập nhật điểm kiểm tra miệng lớp Vật lý 101. Các em vào xem lại kết quả nhé.', 
        timestamp: 'Hôm qua', isRead: true, teacherName: 'Minh', classId: 'PHYS101' 
    },
    { 
        id: 5, type: 'promo', title: 'Tặng Voucher 500k', content: 'Chúc mừng bạn đã hoàn thành xuất sắc kỳ thi thử! Nhận ngay voucher mua tài liệu học tập.', 
        timestamp: '2 ngày trước', isRead: true 
    },
];

const StudentNotificationPage = () => {
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredNotifications = notifications.filter(notif => {
        const matchesFilter = filter === 'all' || 
            (filter === 'teacher' && notif.type === 'teacher') || 
            (filter === 'system' && (notif.type === 'system' || notif.type === 'promo'));
            
        const matchesSearch = notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            notif.content.toLowerCase().includes(searchQuery.toLowerCase());
            
        return matchesFilter && matchesSearch;
    });

    const handleMarkAsRead = (notifId) => {
        setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isRead: true } : n));
    };

    const handleMarkAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
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
                            Chào bạn! Bạn đang có <span className="!text-primary !font-black">{notifications.filter(n => !n.isRead).length} thông báo chưa đọc.</span>
                        </p>
                    </div>
                </div>

                <div className="!flex !flex-col sm:!flex-row !items-start md:!items-center !gap-4 !w-full md:!w-auto">
                    <button 
                        onClick={() => showNotification({
                            title: 'Thầy Hùng (Toán 101)',
                            message: 'Vừa đăng một bài tập mới về Giải tích 1. Hạn chót là thứ 6!',
                            type: 'teacher',
                            onAction: () => console.log('Navigating to homework...')
                        })}
                        className="!w-full sm:!w-auto !px-6 !py-3 !bg-white !text-primary !border !border-primary/20 !rounded-2xl !text-sm !font-black hover:!bg-primary/5 !transition-all !flex !items-center !justify-center !gap-2"
                    >
                        <Icon icon="solar:user-speak-bold-duotone" />
                        Test Toast (GV)
                    </button>
                    <button 
                        onClick={() => showNotification({
                            title: 'Khuyến mãi Hệ thống',
                            message: 'Giảm 20% học phí khi đăng ký khóa học Tiếng Anh ngay hôm nay!',
                            type: 'promo',
                            icon: 'solar:fire-bold-duotone',
                            onAction: () => console.log('Opening promo page...')
                        })}
                        className="!w-full sm:!w-auto !px-6 !py-3 !bg-orange-500 !text-white !rounded-2xl !text-sm !font-black hover:!bg-orange-600 !transition-all !flex !items-center !justify-center !gap-2 !shadow-lg !shadow-orange-500/20"
                    >
                        <Icon icon="solar:fire-bold-duotone" />
                        Test Toast (Ads)
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
                {filteredNotifications.length === 0 ? (
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
                                onClick={(n) => handleMarkAsRead(n.id)} 
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
                    <p className="!text-xs !font-bold !text-text-muted">Bấm vào bất kỳ thông báo nào để đánh dấu là "Đã đọc" và xem chi tiết nội dung nhé!</p>
                </div>
            </div>
        </div>
    );
};

export default StudentNotificationPage;
