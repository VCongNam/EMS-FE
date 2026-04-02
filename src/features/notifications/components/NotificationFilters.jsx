import React from 'react';
import { Icon } from '@iconify/react';

const NotificationFilters = ({ activeFilter, onFilterChange, onMarkAllRead, searchQuery, onSearchChange }) => {
    const filters = [
        { id: 'all', label: 'Tất cả', icon: 'solar:library-bold-duotone' },
        { id: 'teacher', label: 'Giáo viên', icon: 'solar:user-speak-bold-duotone' },
        { id: 'system', label: 'Hệ thống & Ưu đãi', icon: 'solar:fire-bold-duotone' },
    ];

    return (
        <div className="!flex !flex-col md:!flex-row !justify-between !items-start md:!items-center !gap-6 !bg-white !p-8 !rounded-[2.5rem] !border !border-border !shadow-sm">
            <div className="!flex !items-center !gap-2 !p-1.5 !bg-background !rounded-2xl !border !border-border !w-full md:!w-auto">
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => onFilterChange(filter.id)}
                        className={`!flex-1 md:!flex-none !px-5 !py-2.5 !rounded-xl !text-sm !font-black !flex !items-center !gap-2 !transition-all ${
                            activeFilter === filter.id ? '!bg-white !text-primary !shadow-sm' : '!text-text-muted hover:!text-text-main'
                        }`}
                    >
                        <Icon icon={filter.icon} className="!text-lg" />
                        {filter.label}
                    </button>
                ))}
            </div>

            <div className="!flex !items-center !gap-3 !w-full md:!w-auto">
                <div className="!relative !flex-1 md:!w-64">
                    <Icon icon="solar:magnifer-linear" className="!absolute !left-3.5 !top-1/2 !-translate-y-1/2 !text-text-muted !text-lg" />
                    <input 
                        type="text" 
                        placeholder="Tìm thông báo..." 
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="!w-full !pl-11 !pr-4 !py-3 !bg-background !border !border-border !rounded-2xl !text-sm !font-medium focus:!outline-none focus:!border-primary !transition-all"
                    />
                </div>
                
                <button 
                    onClick={onMarkAllRead}
                    className="!p-3.5 !bg-primary/5 !text-primary !rounded-2xl !border !border-primary/20 hover:!bg-primary hover:!text-white !transition-all !group"
                    title="Đánh dấu tất cả đã đọc"
                >
                    <Icon icon="solar:checklist-minimalistic-bold-duotone" className="!text-xl" />
                </button>
            </div>
        </div>
    );
};

export default NotificationFilters;
