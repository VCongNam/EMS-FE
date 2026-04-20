import React from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { formatViTime } from '../../../utils/dateUtils';

const DashboardRecentNotifications = ({ title, icon, iconBgBase, iconColor, notifications, onNotificationClick, viewAllLink, viewAllLabel }) => {
    // Default fallback
    const MOCK_NOTIFS = notifications || [
        { id: 1, type: 'Teacher', content: 'Thầy Hùng vừa chấm bài kiểm tra 15p Giải tích', time: '14:30', icon: 'solar:user-speak-bold-duotone', color: '!text-blue-500' },
        { id: 2, type: 'System', content: 'Cảnh báo: Bạn sắp trễ hạn nộp bài tập Hóa học', time: '12:00', icon: 'solar:danger-bold-duotone', color: '!text-orange-500' },
        { id: 3, type: 'Announcement', content: 'Thông báo nghỉ lễ Giỗ tổ Hùng Vương (10/3)', time: '09:00', icon: 'solar:fire-bold-duotone', color: '!text-red-500' },
    ];

    const displayNotifications = notifications || MOCK_NOTIFS;

    return (
        <div className="!bg-white !p-8 !rounded-[2.5rem] !border !border-border !shadow-sm !space-y-6">
            <div className="!flex !items-center !justify-between">
                <div className="!flex !items-center !gap-3">
                    <div className={`!w-10 !h-10 !rounded-xl !flex !items-center !justify-center ${iconBgBase || '!bg-primary/10'} ${iconColor || '!text-primary'}`}>
                        <Icon icon={icon || "solar:notification-lines-bold-duotone"} className="!text-2xl" />
                    </div>
                    <h3 className="!text-lg !font-black !text-text-main !tracking-tight">{title || 'Thông báo gần đây'}</h3>
                </div>
                {viewAllLink && (
                    <Link to={viewAllLink} className="!text-xs !font-black !text-primary hover:!underline">
                        {viewAllLabel || 'Tất cả'}
                    </Link>
                )}
            </div>

            <div className="!space-y-4">
                {displayNotifications.map((notif) => {
                    const displayMessage = notif.message || notif.content;
                    const displayTime = notif.createdAt 
                        ? formatViTime(notif.createdAt) 
                        : notif.time;
                    
                    return (
                        <div 
                            key={notif.id} 
                            onClick={() => onNotificationClick && onNotificationClick(notif)}
                            className={`!flex !gap-4 !group ${onNotificationClick ? 'cursor-pointer' : ''}`}
                        >
                            <div className={`!w-10 !h-10 !rounded-xl !bg-background !flex !items-center !justify-center !shrink-0 !group-hover:!scale-105 !transition-transform ${notif.color || '!text-primary'}`}>
                                <Icon icon={notif.icon || 'solar:bell-bing-bold-duotone'} className="!text-xl" />
                            </div>
                            <div className="!flex-1 !min-w-0">
                                <p className={`!text-xs !font-bold !line-clamp-2 !transition-colors ${notif.isRead === false ? '!text-primary' : '!text-text-main'} !group-hover:!text-primary`}>
                                    {displayMessage}
                                </p>
                                <span className="!text-[10px] !font-medium !text-text-muted mt-1 !block">{displayTime}</span>
                            </div>
                            {notif.isRead === false && (
                                <div className="!w-2 !h-2 !bg-primary !rounded-full !mt-2" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DashboardRecentNotifications;
