import React from 'react';
import { Icon } from '@iconify/react';

const ClassListFilter = ({
    searchQuery,
    onSearchChange,
    filterStatus,
    onFilterChange,
    showUpcoming = false,
    showArchived = true
}) => {
    return (
        <div className="bg-surface !p-4 rounded-2xl border border-border shadow-sm flex flex-col gap-4 z-20 relative w-full">
            {/* Search Input */}
            <div className="w-full relative group">
                <div className="absolute inset-y-0 left-0 !pl-4 flex items-center pointer-events-none">
                    <Icon icon="material-symbols:search-rounded" className="text-text-muted text-xl group-focus-within:text-primary transition-colors" />
                </div>
                <input
                    type="text"
                    placeholder="Tìm kiếm bằng tên lớp học..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl !py-3 !pl-11 !pr-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-text-main font-medium placeholder:font-normal"
                />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => onFilterChange('all')}
                    className={`!px-4 !py-2 rounded-xl font-medium text-sm transition-all border ${filterStatus === 'all' ? 'bg-primary text-outline border-primary shadow-md shadow-primary/20' : 'bg-background hover:bg-surface border-border text-text-muted hover:text-text-main'}`}
                >
                    Tất cả
                </button>
                
                {showUpcoming && (
                    <button
                        onClick={() => onFilterChange('upcoming')}
                        className={`!px-4 !py-2 rounded-xl font-medium text-sm transition-all border flex items-center gap-2 ${filterStatus === 'upcoming' ? 'bg-primary text-outline border-primary shadow-md shadow-primary/20' : 'bg-background hover:bg-surface border-border text-text-muted hover:text-text-main'}`}
                    >
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${filterStatus === 'upcoming' ? 'bg-white' : 'bg-blue-500'}`}></div>
                        Sắp khai giảng
                    </button>
                )}

                <button
                    onClick={() => onFilterChange('ongoing')}
                    className={`!px-4 !py-2 rounded-xl font-medium text-sm transition-all border flex items-center gap-2 ${filterStatus === 'ongoing' ? 'bg-green-600 text-outline border-green-600 shadow-md shadow-green-600/20' : 'bg-background hover:bg-surface border-border text-text-muted hover:text-text-main'}`}
                >
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${filterStatus === 'ongoing' ? 'bg-white' : 'bg-green-500'}`}></div>
                    Đang diễn ra
                </button>
                <button
                    onClick={() => onFilterChange('completed')}
                    className={`!px-4 !py-2 rounded-xl font-medium text-sm transition-all border flex items-center gap-2 ${filterStatus === 'completed' ? 'bg-gray-600 text-outline border-gray-600 shadow-md shadow-gray-600/20' : 'bg-background hover:bg-surface border-border text-text-muted hover:text-text-main'}`}
                >
                    Đã kết thúc
                </button>

                {showArchived && (
                    <button
                        onClick={() => onFilterChange('archived')}
                        className={`!px-4 !py-2 rounded-xl font-medium text-sm transition-all border flex items-center gap-2 ${filterStatus === 'archived' ? 'bg-slate-700 text-outline border-slate-700 shadow-md shadow-slate-700/20' : 'bg-background hover:bg-surface border-border text-text-muted hover:text-text-main'}`}
                    >
                        <Icon icon="material-symbols:archive-outline-rounded" className={filterStatus === 'archived' ? 'text-white' : 'text-slate-500'} />
                        Lưu trữ
                    </button>
                )}
            </div>
        </div>
    );
};

export default ClassListFilter;