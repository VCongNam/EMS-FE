import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import ClassReportCard from '../components/ClassReportCard';
import { progressReportService } from '../../dashboard/api/progressReportService';
import useAuthStore from '../../../store/authStore';

// Comprehensive mock data for classes the teacher manages
const MOCK_CLASSES = [
    { 
        id: 'TC101', 
        name: 'Toán Nâng Cao - TC101', 
        code: 'ROOM 101', 
        subjectName: 'Môn Toán', 
        students: { count: 32, max: 32 }, 
        reportProgress: { generated: 28, total: 32 } 
    },
    { 
        id: 'TC102', 
        name: 'Lý Thuyết Vật Lý - TC102', 
        code: 'LAB 2', 
        subjectName: 'Vật Lý', 
        students: { count: 25, max: 30 }, 
        reportProgress: { generated: 10, total: 30 } 
    },
    { 
        id: 'TC103', 
        name: 'Hóa Học Cơ Bản - TC103', 
        code: 'ROOM 305', 
        subjectName: 'Hóa Học', 
        students: { count: 18, max: 25 }, 
        reportProgress: { generated: 18, total: 25 } 
    },
    { 
        id: 'TC104', 
        name: 'Luyện đề IELTS - TC104', 
        code: 'ZOOM 02', 
        subjectName: 'Tiếng Anh', 
        students: { count: 12, max: 15 }, 
        reportProgress: { generated: 5, total: 15 } 
    },
];

const AcademicAnalyticsPage = () => {
    const { user } = useAuthStore();
    const token = user?.token;

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSummary = async () => {
        try {
            setIsLoading(true);
            const res = await progressReportService.getSummary(selectedMonth, selectedYear, searchQuery, token);
            if (res.ok) {
                const data = await res.json();
                setSummary(data);
            }
        } catch (error) {
            console.error('Error fetching summary:', error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        const timer = setTimeout(() => {
            fetchSummary();
        }, 500); // Debounce search
        return () => clearTimeout(timer);
    }, [selectedMonth, selectedYear, searchQuery, token]);

    const classSummaries = summary?.classSummaries || [];
    const overallRate = summary?.overallCompletionRate || 0;
    const totalClasses = summary?.totalClasses || 0;

    // Generate periods for the last 6 months and next 6 months
    const periods = React.useMemo(() => {
        const result = [];
        const now = new Date();
        for (let i = -6; i <= 6; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
            result.push({
                month: d.getMonth() + 1,
                year: d.getFullYear(),
                label: `Tháng ${d.getMonth() + 1}/${d.getFullYear()}`
            });
        }
        return result;
    }, []);

    const currentPeriodLabel = `Tháng ${selectedMonth}/${selectedYear}`;

    return (
        <div className="!min-h-full sm:p-8 !animate-fade-in custom-scrollbar">
            {/* Header Section with Premium Styling */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center !gap-6 bg-surface !p-6 rounded-[2rem] border border-border shadow-sm">
                <div>
                    <h1 className="!text-3xl sm:!text-4xl !font-black !text-text-main !tracking-tight !flex !items-center !gap-3 font-['Outfit']">
                        Báo cáo & Thống kê
                        <div className="!w-2.5 !h-2.5 !rounded-full !bg-primary !animate-pulse"></div>
                    </h1>
                    <p className="!text-sm !font-medium !text-text-muted !mt-2 !ml-1">
                        Tháng {selectedMonth}/{selectedYear} - Tỷ lệ hoàn thành: {overallRate}%
                    </p>
                </div>
                
                <div className="!flex !flex-wrap !items-center !gap-3 !w-full sm:!w-auto">
                    {/* Combined Period Picker */}
                    <div className="!relative !w-full sm:!w-48">
                        <select 
                            value={`${selectedMonth}-${selectedYear}`}
                            onChange={(e) => {
                                const [m, y] = e.target.value.split('-').map(Number);
                                setSelectedMonth(m);
                                setSelectedYear(y);
                            }}
                            className="!w-full !px-4 !py-3.5 !bg-white !border !border-border !rounded-2xl !text-sm !font-black focus:!outline-none focus:!border-primary !transition-all !shadow-sm cursor-pointer !appearance-none"
                        >
                            {periods.map(p => (
                                <option key={`${p.month}-${p.year}`} value={`${p.month}-${p.year}`}>
                                    {p.label}
                                </option>
                            ))}
                        </select>
                        <Icon icon="material-symbols:keyboard-arrow-down-rounded" className="!absolute !right-3 !top-1/2 !-translate-y-1/2 !text-text-muted !text-xl !pointer-events-none" />
                    </div>
                    <div className="!relative !flex-1 sm:!w-72">
                        <Icon icon="material-symbols:search-rounded" className="!absolute !left-3 !top-1/2 !-translate-y-1/2 !text-text-muted !text-xl" />
                        <input 
                            type="text" 
                            placeholder="Tìm tên lớp hoặc phòng..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="!w-full !pl-10 !pr-4 !py-3.5 !bg-white !border !border-border !rounded-2xl !text-sm !font-medium focus:!outline-none focus:!border-primary focus:!ring-4 focus:!ring-primary/10 !transition-all !shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Quick Stats Banner */}
            <div className="!grid !grid-cols-2 !mt-2 lg:!grid-cols-4 !gap-4 sm:!gap-6 !mb-10">
                <div className="!p-5 !bg-white !rounded-3xl !border !border-border !shadow-sm">
                    <p className="!text-[10px] !font-black !text-text-muted !uppercase !tracking-widest !mb-2">Tổng số lớp</p>
                    <div className="!flex !items-end !gap-2">
                        <h3 className="!text-2xl !font-black !text-text-main">{totalClasses}</h3>
                        <span className="!text-xs !font-bold !text-primary !mb-1">Lớp học</span>
                    </div>
                </div>
                <div className="!p-5 !bg-white !rounded-3xl !border !border-border !shadow-sm">
                    <p className="!text-[10px] !font-black !text-text-muted !uppercase !tracking-widest !mb-2">
                        TỶ LỆ HOÀN THÀNH ({currentPeriodLabel.toUpperCase()})
                    </p>
                    <div className="!flex !items-end !gap-2">
                        <h3 className={`!text-2xl !font-black ${overallRate === 100 ? 'text-emerald-600' : 'text-primary'}`}>{overallRate}%</h3>
                        <span className="!text-xs !font-bold !text-emerald-500 !mb-1">Tiến độ kỳ này</span>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="!py-40 !flex !flex-col !items-center !justify-center">
                    <Icon icon="line-md:loading-loop" className="!text-5xl !text-primary !mb-4" />
                    <p className="!text-text-muted !font-bold">Đang tải dữ liệu báo cáo...</p>
                </div>
            ) : classSummaries.length > 0 ? (
                <div className="!grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 xl:!grid-cols-4 !gap-6 sm:!gap-8">
                    {classSummaries.map((cls) => (
                        <ClassReportCard 
                            key={cls.classId} 
                            classData={cls} 
                            month={selectedMonth}
                            year={selectedYear}
                        />
                    ))}
                </div>
            ) : (
                <div className="!py-28 !flex !flex-col !items-center !justify-center !text-center !bg-white !rounded-[40px] !border !border-border !shadow-sm">
                    <div className="!w-24 !h-24 !bg-background !rounded-full !flex !items-center !justify-center !mb-6 !border !border-border/50">
                        <Icon icon="material-symbols:search-off-rounded" className="!text-5xl !text-text-muted" />
                    </div>
                    <h3 className="!text-xl !font-black !text-text-main !mb-2">Không tìm thấy kết quả</h3>
                    <p className="!text-sm !font-medium !text-text-muted !max-w-xs">
                        Thử thay đổi từ khóa tìm kiếm để tìm thấy lớp học bạn đang phụ trách.
                    </p>
                </div>
            )}
        </div>
    );
};

export default AcademicAnalyticsPage;
