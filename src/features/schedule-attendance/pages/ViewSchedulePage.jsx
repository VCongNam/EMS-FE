import { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import useAuthStore from '../../../store/authStore';
import NextClassCard from '../components/NextClassCard';
import DaySelector from '../components/DaySelector';
import ScheduleTimelineView from '../components/ScheduleTimelineView';
import ScheduleGridView from '../components/ScheduleGridView';
import studentScheduleService from '../../dashboard/api/studentScheduleService';
import { toast } from 'react-toastify';

const DAY_NAME_MAP = {
    '02': 'Thứ 2', '03': 'Thứ 3', '04': 'Thứ 4', '05': 'Thứ 5', '06': 'Thứ 6', '07': 'Thứ 7', '08': 'CN'
};

const ViewSchedulePage = () => {
    const { user } = useAuthStore();
    const token = user?.token;
    const isStudent = user?.role === 'student';

    const [viewMode, setViewMode] = useState('timeline'); // 'timeline' or 'grid'
    
    // Set initial selected date to today's week day (02-08)
    const getInitialSelectedDate = () => {
        const day = new Date().getDay(); // 0-6 (Sun-Sat)
        if (day === 0) return '08'; // CN
        return `0${day + 1}`; // 02-07
    };
    
    const [selectedDate, setSelectedDate] = useState(getInitialSelectedDate());
    const [scheduleData, setScheduleData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSchedule = async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            // Fetch a broad range to fill context (e.g. current year)
            const params = {
                FromDate: '2025-01-01',
                ToDate: '2027-12-31'
            };
            const response = await studentScheduleService.getSchedule(params, token);
            if (response.ok) {
                const result = await response.json();
                setScheduleData(result.data || []);
            } else {
                toast.error("Không thể tải lịch học");
            }
        } catch (error) {
            console.error("Fetch schedule failed:", error);
            toast.error("Lỗi khi kết nối máy chủ");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isStudent) {
            fetchSchedule();
        }
    }, [token, isStudent]);

    // Grouping logic for the weekly grid and timeline views
    const processedSchedule = useMemo(() => {
        const weekly = { 'Thứ 2': [], 'Thứ 3': [], 'Thứ 4': [], 'Thứ 5': [], 'Thứ 6': [], 'Thứ 7': [], 'CN': [] };
        
        // Helper to get Vietnamese day name from Date
        const getVNDayName = (dateStr) => {
            const date = new Date(dateStr);
            const day = date.getDay(); // 0 (Sun) to 6 (Sat)
            if (day === 0) return 'CN';
            return `Thứ ${day + 1}`;
        };

        scheduleData.forEach(item => {
            const dayName = getVNDayName(item.date);
            const mappedItem = {
                id: item.sessionID,
                startTime: item.startTime ? item.startTime.substring(0, 5) : 'TBA',
                endTime: item.endTime ? item.endTime.substring(0, 5) : 'TBA',
                subject: item.className,
                code: item.classID?.substring(0, 8).toUpperCase() || 'N/A',
                room: item.meetingLink ? 'Online (Meet/Zoom)' : 'TBA',
                teacher: 'Giáo viên lớp',
                type: 'Subject', // Generic
                status: item.attendanceStatus === 'Có mặt' ? 'Present' : 
                        (item.attendanceStatus === 'Vắng mặt' ? 'Absent' : 
                         (item.status === 'Đã kết thúc' ? 'Absent' : 'Scheduled')),
                homework: item.meetingLink ? `Link: ${item.meetingLink}` : null
            };
            if (weekly[dayName]) {
                weekly[dayName].push(mappedItem);
            }
        });

        // Sort each day by start time
        Object.keys(weekly).forEach(day => {
            weekly[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
        });

        return weekly;
    }, [scheduleData]);

    const dayName = DAY_NAME_MAP[selectedDate];
    const dayLessons = processedSchedule[dayName] || [];
    
    // Find next upcoming class
    const nextClass = useMemo(() => {
        const now = new Date();
        const upcoming = scheduleData
            .filter(i => new Date(i.date) >= now && i.status === 'Sắp diễn ra')
            .sort((a, b) => new Date(a.date + 'T' + a.startTime) - new Date(b.date + 'T' + b.startTime))[0];
        
        if (!upcoming) return null;

        return {
            subject: upcoming.className,
            startTime: upcoming.startTime?.substring(0, 5),
            endTime: upcoming.endTime?.substring(0, 5),
            room: upcoming.meetingLink ? 'Online' : 'Phòng học',
            teacher: 'Giáo viên bộ môn'
        };
    }, [scheduleData]);

    if (!isStudent) {
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
    }

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
                        {isLoading ? 'Đang cập nhật lịch học...' : `Chào buổi sáng! Bạn có ${dayLessons.length} tiết học trong ${dayName.toLowerCase()}.`}
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
            {viewMode === 'timeline' && nextClass && (
                <NextClassCard nextClass={nextClass} />
            )}

            {/* Main Content Area */}
            <div className="!space-y-8">
                {isLoading ? (
                    <div className="!py-20 !text-center">
                        <Icon icon="line-md:loading-loop" className="!text-5xl !text-primary !mx-auto !mb-4" />
                        <p className="!font-bold !text-text-muted">Đang tải dữ liệu lịch học...</p>
                    </div>
                ) : (
                    viewMode === 'timeline' ? (
                        <>
                            <div className="!space-y-4">
                                <h3 className="!text-xl !font-black !text-text-main !tracking-tight !px-1">Chọn ngày học</h3>
                                <DaySelector selectedDate={selectedDate} onSelect={setSelectedDate} />
                            </div>

                            <div className="!space-y-6">
                                <div className="!flex !items-center !justify-between !px-1">
                                    <h3 className="!text-xl !font-black !text-text-main !tracking-tight">Chi tiết lịch học - {dayName}</h3>
                                    <button className="!text-primary !text-sm !font-black hover:!underline" onClick={fetchSchedule}>Tải lại</button>
                                </div>
                                <ScheduleTimelineView scheduleData={dayLessons} />
                            </div>
                        </>
                    ) : (
                        <div className="!space-y-6">
                            <h3 className="!text-xl !font-black !text-text-main !tracking-tight !px-1">Tổng quan tuần này</h3>
                            <ScheduleGridView weeklyData={processedSchedule} />
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default ViewSchedulePage;
