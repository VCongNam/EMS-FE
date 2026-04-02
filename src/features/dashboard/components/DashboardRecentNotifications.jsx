import React from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

const DashboardRecentNotifications = ({ notifications }) => {
    const MOCK_NOTIFS = notifications || [
        { id: 1, type: 'Teacher', content: 'Thầy Hùng vừa chấm bài kiểm tra 15p Giải tích', time: '14:30', icon: 'solar:user-speak-bold-duotone', color: 'text-blue-500' },
        { id: 2, type: 'System', content: 'Cảnh báo: Bạn sắp trễ hạn nộp bài tập Hóa học', time: '12:00', icon: 'solar:danger-bold-duotone', color: 'text-orange-500' },
        { id: 3, type: 'Announcement', content: 'Thông báo nghỉ lễ Giỗ tổ Hùng Vương (10/3)', time: '09:00', icon: 'solar:fire-bold-duotone', color: 'text-red-500' },
    ];

    return (
        <div className="!bg-white !p-8 !rounded-[2.5rem] !border !border-border !shadow-sm !space-y-6">
            <div className="!flex !items-center !justify-between">
                <div className="!flex !items-center !gap-3">
                    <div className="!w-10 !h-10 !rounded-xl !bg-primary/10 !text-primary !flex !items-center !justify-center">
                        <Icon icon="solar:notification-lines-bold-duotone" className="!text-2xl" />
                    </div>
                    <h3 className="!text-lg !font-black !text-text-main !tracking-tight">Thông báo gần đây</h3>
                </div>
                <Link to="/notifications" className="!text-xs !font-black !text-primary hover:!underline">Tất cả</Link>
            </div>

            <div className="!space-y-4">
                {MOCK_NOTIFS.map((notif) => (
                    <div key={notif.id} className="!flex !gap-4 !group cursor-pointer">
                        <div className={`!w-10 !h-10 !rounded-xl !bg-background !flex !items-center !justify-center !shrink-0 !group-hover:!scale-105 !transition-transform ${notif.color}`}>
                            <Icon icon={notif.icon} className="!text-xl" />
                        </div>
                        <div className="!flex-1 !min-w-0">
                            <p className="!text-xs !font-bold !text-text-main !line-clamp-2 !group-hover:!text-primary !transition-colors">
                                {notif.content}
                            </p>
                            <span className="!text-[10px] !font-medium !text-text-muted mt-1 !block">{notif.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardRecentNotifications;
