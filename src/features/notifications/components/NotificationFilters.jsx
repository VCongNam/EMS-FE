import React from 'react';
import { Icon } from '@iconify/react';

const NotificationFilters = ({ isStudent, activeFilter, onFilterChange, onMarkAllRead, searchQuery, onSearchChange }) => {
    const filters = [
        { id: 'all', label: 'Tất cả', icon: 'solar:library-bold-duotone' },
        { id: 'teacher', label: 'Giáo viên', icon: 'solar:user-speak-bold-duotone' },
        { id: 'system', label: 'Hệ thống & Ưu đãi', icon: 'solar:fire-bold-duotone' },
    ];

    if (isStudent) {
        return (
            <div className="!flex !items-center !gap-4 !bg-white !p-4 !px-6 !rounded-[2rem] !border !border-border !shadow-sm !w-full">
                <div className="!relative !flex-1">
                    <Icon icon="solar:magnifer-linear" className="!absolute !left-4 !top-1/2 !-translate-y-1/2 !text-text-muted !text-xl" />
                    <input 
                        type="text" 
                        placeholder="Tìm thông báo..." 
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="!w-full !pl-12 !pr-4 !py-3.5 !bg-background !border !border-border !rounded-2xl !text-base !font-semibold focus:!outline-none focus:!border-primary !transition-all"
                    />
                </div>
                
                <button 
                    onClick={onMarkAllRead}
                    className="!flex !items-center !gap-2.5 !px-6 !py-3.5 !bg-primary/5 !text-primary !rounded-2xl !border !border-primary/20 hover:!bg-primary hover:!text-white !transition-all !font-black !text-sm !group"
                    title="Đánh dấu tất cả đã đọc"
                >
                    <Icon icon="solar:checklist-minimalistic-bold-duotone" className="!text-xl" />
                    <span className="!hidden sm:!inline">Đánh dấu đã đọc</span>
                </button>
            </div>
        );
    }

    return (
        <div className="!flex !flex-col md:!flex-row !items-start md:!items-center !justify-between !gap-6 !bg-white !p-8 !rounded-[2.5rem] !border !border-border !shadow-sm !w-full">
            {!isStudent && (
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
            )}

            <div className={`!flex !items-center !gap-3 !w-full ${isStudent ? '' : 'md:!w-auto'}`}>
                <div className={`!relative !flex-1 ${isStudent ? '' : 'md:!w-64'}`}>
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
