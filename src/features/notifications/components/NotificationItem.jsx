import React from 'react';
import { Icon } from '@iconify/react';
import { formatViDateTimeShort } from '../../../utils/dateUtils';

const TYPE_CONFIG = {
    teacher: {
        icon: 'solar:user-speak-bold-duotone',
        color: 'text-primary',
        bg: 'bg-primary/10',
        label: 'Giáo viên'
    },
    system: {
        icon: 'solar:fire-bold-duotone',
        color: 'text-orange-500',
        bg: 'bg-orange-50',
        label: 'Hệ thống'
    },
    promo: {
        icon: 'solar:gift-bold-duotone',
        color: 'text-emerald-500',
        bg: 'bg-emerald-50',
        label: 'Ưu đãi'
    }
};

const NotificationItem = ({ notification, onClick }) => {
    const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG.system;
    
    // Support both API fields and mock/fallback fields
    const displayTitle = notification.title || 'Thông báo';
    const displayMessage = notification.message || notification.content || '';
    const displayTime = notification.createdAt 
        ? formatViDateTimeShort(notification.createdAt)
        : notification.timestamp;

    return (
        <div 
            onClick={() => onClick(notification)}
            className={`!p-6 !rounded-[2rem] !border !transition-all !cursor-pointer !group !relative !flex !gap-5 ${
                notification.isRead 
                ? '!bg-white !border-border hover:!border-primary/30' 
                : '!bg-primary/5 !border-primary/20 hover:!shadow-lg'
            }`}
        >
            {/* Type Icon */}
            <div className={`!w-14 !h-14 !rounded-2xl !flex-shrink-0 !flex !items-center !justify-center ${config.bg} ${config.color}`}>
                <Icon icon={notification.icon || config.icon} className="!text-2xl" />
            </div>

            {/* Content */}
            <div className="!flex-1 !min-w-0">
                <div className="!flex !items-center !justify-between !mb-1">
                    <span className={`!text-[10px] !font-black !uppercase !tracking-widest ${config.color}`}>
                        {notification.typeLabel || config.label}
                    </span>
                    <span className="!text-[11px] !font-bold !text-text-muted">
                        {displayTime}
                    </span>
                </div>
                
                <h3 className={`!text-base !font-black !mb-1 !truncate ${notification.isRead ? '!text-text-main' : '!text-primary'}`}>
                    {displayTitle}
                </h3>
                
                <p className="!text-sm !font-medium !text-text-muted !line-clamp-2">
                    {displayMessage}
                </p>

                {(notification.teacherName || notification.senderName) && (
                    <div className="!mt-4 !flex !items-center !gap-2">
                        <div className="!w-6 !h-6 !rounded-full !bg-primary/20 !flex !items-center !justify-center !text-[10px] !font-black !text-primary">
                            {(notification.teacherName || notification.senderName).charAt(0)}
                        </div>
                        <span className="!text-xs !font-bold !text-text-main">
                            {notification.teacherName ? `Thầy ${notification.teacherName}` : notification.senderName}
                        </span>
                    </div>
                )}

                {notification.actionUrl && (
                    <div className="!mt-3 !flex !items-center !gap-1 !text-[10px] !font-black !text-primary !uppercase !tracking-wider">
                        <span>Chi tiết</span>
                        <Icon icon="solar:alt-arrow-right-bold-duotone" />
                    </div>
                )}
            </div>

            {/* Unread Indicator */}
            {!notification.isRead && (
                <div className="!absolute !top-6 !right-6 !w-2.5 !h-2.5 !bg-primary !rounded-full !animate-pulse" />
            )}

            {/* Promo Badge */}
            {notification.type === 'promo' && (
                <div className="!absolute !right-6 !bottom-6 !px-2 !py-0.5 !bg-emerald-500 !text-white !text-[9px] !font-black !rounded-md !uppercase">
                    Hot
                </div>
            )}
        </div>
    );
};

export default NotificationItem;
