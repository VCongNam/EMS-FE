import React, { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import useAuthStore from '../../../store/authStore';
import NextClassCard from '../components/NextClassCard';
import DaySelector from '../components/DaySelector';
import ScheduleTimelineView from '../components/ScheduleTimelineView';
import ScheduleGridView from '../components/ScheduleGridView';

const MOCK_WEEKLY_SCHEDULE = {
    'Thứ 2': [
        { id: 1, startTime: '08:00', endTime: '10:00', subject: 'Toán Cao Cấp', code: 'MATH101', room: 'P.301', teacher: 'Thầy Hùng', type: 'Math', status: 'Present' },
        { id: 2, startTime: '10:15', endTime: '12:15', subject: 'Vật Lý Đại Cương', code: 'PHYS101', room: 'P.405', teacher: 'Cô Lan', type: 'Physics', status: 'Present', homework: 'Làm bài tập chương 2' },
    ],
    'Thứ 3': [
        { id: 3, startTime: '13:30', endTime: '15:30', subject: 'Hóa Học Cơ Bản', code: 'CHEM101', room: 'LAB-2', teacher: 'Thầy Minh', type: 'Chemistry', status: 'Scheduled' },
    ],
    'Thứ 4': [
        { id: 4, startTime: '08:00', endTime: '10:00', subject: 'Tiếng Anh Giao Tiếp', code: 'ENG201', room: 'P.202', teacher: 'Cô Rose', type: 'English', status: 'Scheduled', homework: 'Prepare for presentation' },
        { id: 5, startTime: '13:30', endTime: '15:30', subject: 'Vật Lý Đại Cương', code: 'PHYS101', room: 'P.405', teacher: 'Cô Lan', type: 'Physics', status: 'Scheduled' },
    ],
    'Thứ 5': [
        { id: 6, startTime: '10:15', endTime: '12:15', subject: 'Toán Cao Cấp', code: 'MATH101', room: 'P.301', teacher: 'Thầy Hùng', type: 'Math', status: 'Scheduled' },
    ],
    'Thứ 6': [
        { id: 7, startTime: '08:00', endTime: '10:00', subject: 'Hóa Học Cơ Bản', code: 'CHEM101', room: 'LAB-2', teacher: 'Thầy Minh', type: 'Chemistry', status: 'Scheduled' },
        { id: 8, startTime: '15:45', endTime: '17:45', subject: 'Tiếng Anh Giao Tiếp', code: 'ENG201', room: 'P.202', teacher: 'Cô Rose', type: 'English', status: 'Scheduled' },
    ],
    'Thứ 7': [],
    'CN': [],
};

const DAY_NAME_MAP = {
    '02': 'Thứ 2', '03': 'Thứ 3', '04': 'Thứ 4', '05': 'Thứ 5', '06': 'Thứ 6', '07': 'Thứ 7', '08': 'CN'
};

const ViewSchedulePage = () => {
    const { user } = useAuthStore();
    const isStudent = user?.role === 'student';

    const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'grid'
    const [selectedDate, setSelectedDate] = useState('02'); // Linked to 'Thứ 2' in DAYS

    // Derived Data
    const dayName = DAY_NAME_MAP[selectedDate];
    const dayLessons = MOCK_WEEKLY_SCHEDULE[dayName] || [];
    const nextClass = MOCK_WEEKLY_SCHEDULE['Thứ 2'][0]; // Hardcoded for demo

    // ─── Render Student Layout (Premium) ───────────────────────────────────
    if (isStudent) {
        return (
            <div className="!max-w-7xl !mx-auto !space-y-8 !animate-fade-in custom-scrollbar">
                {/* Header & View Switcher */}
                <div className="!flex !flex-col md:!flex-row !justify-between !items-start md:!items-center !gap-6 !bg-white !p-8 !rounded-[2.5rem] !border !border-border !shadow-sm">
                    <div>
                        <h1 className="!text-3xl sm:!text-4xl !font-black !text-text-main !tracking-tight !flex !items-center !gap-3 font-['Outfit']">
                            Lịch học của tôi
                            <div className="!w-2.5 !h-2.5 !rounded-full !bg-primary !animate-pulse"></div>
                        </h1>
                        <p className="!text-sm !font-medium !text-text-muted !mt-2 !ml-1">
                            Chào buổi sáng! Bạn có {MOCK_WEEKLY_SCHEDULE['Thứ 2'].length} tiết học trong hôm nay.
                        </p>
                    </div>

                    <div className="!flex !items-center !gap-1 !p-1.5 !bg-background !rounded-2xl !border !border-border">
                        <button 
                            onClick={() => setViewMode('timeline')}
                            className={`!px-5 !py-2.5 !rounded-xl !text-sm !font-black !flex !items-center !gap-2 !transition-all ${
                                viewMode === 'timeline' ? '!bg-white !text-primary !shadow-sm' : '!text-text-muted hover:!text-text-main'
                            }`}
                        >
                            <Icon icon="solar:list-bold-duotone" className="!text-lg" />
                            Ngày
                        </button>
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`!px-5 !py-2.5 !rounded-xl !text-sm !font-black !flex !items-center !gap-2 !transition-all ${
                                viewMode === 'grid' ? '!bg-white !text-primary !shadow-sm' : '!text-text-muted hover:!text-text-main'
                            }`}
                        >
                            <Icon icon="solar:grid-bold-duotone" className="!text-lg" />
                            Tuần
                        </button>
                    </div>
                </div>

                {/* Highlights (Only in Timeline) */}
                {viewMode === 'timeline' && (
                    <NextClassCard nextClass={nextClass} />
                )}

                {/* Main Content Area */}
                <div className="!space-y-8">
                    {viewMode === 'timeline' ? (
                        <>
                            <div className="!space-y-4">
                                <h3 className="!text-xl !font-black !text-text-main !tracking-tight !px-1">Chọn ngày học</h3>
                                <DaySelector selectedDate={selectedDate} onSelect={setSelectedDate} />
                            </div>

                            <div className="!space-y-6">
                                <div className="!flex !items-center !justify-between !px-1">
                                    <h3 className="!text-xl !font-black !text-text-main !tracking-tight">Chi tiết lịch học - {dayName}</h3>
                                    <button className="!text-primary !text-sm !font-black hover:!underline">Xem tất cả</button>
                                </div>
                                <ScheduleTimelineView scheduleData={dayLessons} />
                            </div>
                        </>
                    ) : (
                        <div className="!space-y-6">
                            <h3 className="!text-xl !font-black !text-text-main !tracking-tight !px-1">Tổng quan tuần này</h3>
                            <ScheduleGridView weeklyData={MOCK_WEEKLY_SCHEDULE} />
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ─── Render Fallback Layout (Standard) ───────────────────────────────
    return (
        <div className="w-full mx-auto space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface p-6 rounded-[2rem] border border-border shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-text-main flex items-center gap-3">
                        <Icon icon="material-symbols:calendar-month-rounded" className="text-primary text-3xl" />
                        Lịch học tuần
                    </h1>
                    <p className="text-text-muted mt-1">Hệ thống quản lý lịch học</p>
                </div>
            </div>
            
            <div className="bg-surface p-6 rounded-[2rem] border border-border shadow-sm text-center py-20">
                 <Icon icon="solar:ghost-bold-duotone" className="text-5xl mx-auto mb-4 opacity-40 text-primary" />
                 <h3 className="text-xl font-black text-text-main">Vùng dành riêng</h3>
                 <p className="text-text-muted mt-2">Vui lòng truy cập trang quản lý tương ứng với vai trò của bạn.</p>
            </div>
        </div>
    );
};

export default ViewSchedulePage;
