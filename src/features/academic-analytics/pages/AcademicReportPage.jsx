import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import useAuthStore from '../../../store/authStore';
import { growthReportService } from '../api/growthReportService';
import StatCard from '../components/StatCard';
import ClassBreakdownTable from '../components/ClassBreakdownTable';
import { GradingDonutChart, GrowthTrendsChart } from '../components/PerformanceCharts';

const AcademicReportPage = () => {
    const { user } = useAuthStore();
    const token = user?.token;
    const [isLoading, setIsLoading] = useState(true);
    const [reportData, setReportData] = useState(null);

    // Filters state
    const today = new Date();
    const firstDayOfMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
    
    // Calculate last day of current month
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const lastDayOfMonth = `${lastDay.getFullYear()}-${String(lastDay.getMonth() + 1).padStart(2, '0')}-${String(lastDay.getDate()).padStart(2, '0')}`;
    
    const [startDate, setStartDate] = useState(firstDayOfMonth);
    const [endDate, setEndDate] = useState(lastDayOfMonth);
    const [subject, setSubject] = useState('All');
    const [status, setStatus] = useState('All');

    const fetchReport = async () => {
        if (startDate > endDate) {
            toast.warning('Ngày bắt đầu không thể lớn hơn ngày kết thúc!');
            return;
        }
        try {
            setIsLoading(true);
            const response = await growthReportService.getTeacherGrowthReport(startDate, endDate, token);
            const result = await response.json();
            if (response.ok) {
                const rawData = result.data || result;

                // Xử lý dữ liệu để tính toán các field còn thiếu (netGrowth, aboveAveragePercent)
                const processedData = {
                    ...rawData,
                    totalStudentGrowth: {
                        ...rawData.totalStudentGrowth,
                        netGrowth: (rawData.totalStudentGrowth?.newEnrollments || 0) - (rawData.totalStudentGrowth?.dropouts || 0)
                    },
                    totalAcademicPerformance: {
                        ...rawData.totalAcademicPerformance,
                        grading: {
                            ...rawData.totalAcademicPerformance?.grading,
                            totalGraded: (() => {
                                const g = rawData.totalAcademicPerformance?.grading || {};
                                return (g.excellentCount || 0) + (g.goodCount || 0) + (g.averageCount || 0) + (g.weakCount || 0);
                            })(),
                            aboveAveragePercent: (() => {
                                const g = rawData.totalAcademicPerformance?.grading || {};
                                const total = (g.excellentCount || 0) + (g.goodCount || 0) + (g.averageCount || 0) + (g.weakCount || 0);
                                return total > 0 ? Math.round(((g.excellentCount || 0) + (g.goodCount || 0) + (g.averageCount || 0)) / total * 100) : 0;
                            })()
                        }
                    },
                    classBreakdowns: (rawData.classBreakdowns || []).map(cls => {
                        const g = cls.academicPerformance?.grading || {};
                        const total = (g.excellentCount || 0) + (g.goodCount || 0) + (g.averageCount || 0) + (g.weakCount || 0);
                        return {
                            ...cls,
                            studentGrowth: {
                                ...cls.studentGrowth,
                                netGrowth: (cls.studentGrowth?.newEnrollments || 0) - (cls.studentGrowth?.dropouts || 0)
                            },
                            academicPerformance: {
                                ...cls.academicPerformance,
                                grading: {
                                    ...g,
                                    aboveAveragePercent: total > 0 ? Math.round(((g.excellentCount || 0) + (g.goodCount || 0) + (g.averageCount || 0)) / total * 100) : 0
                                }
                            }
                        };
                    })
                };

                setReportData(processedData);
            }
        } catch (error) {
            console.error('Lỗi lấy báo cáo:', error);
            toast.error('Không thể lấy dữ liệu báo cáo');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchReport();
    }, [startDate, endDate, token]);

    // Filtered data for table
    const filteredClasses = (reportData?.classBreakdowns || []).filter(cls => {
        const matchSubject = subject === 'All' || cls.subjectName.toLowerCase().includes(subject.toLowerCase());

        // Cụ thể: "Đang dạy" sẽ lấy tất cả lớp có trạng thái KHÁC "Archived"
        let matchStatus = true;
        if (status === 'Active') {
            matchStatus = cls.status !== 'Archived';
        } else if (status === 'Archived') {
            matchStatus = cls.status === 'Archived';
        }

        return matchSubject && matchStatus;
    });

    return (
        <div className="w-full !mx-auto animate-fade-in space-y-6 !pb-12 h-screen overflow-y-auto !pr-2 custom-scrollbar">
            {/* 1. Header & Filters (Sticky Top) */}
            <div className="sticky top-0 z-20 !bg-white/80 backdrop-blur-md border border-slate-200 rounded-[var(--radius-xl)] !p-6 shadow-sm !mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                            Báo cáo Hiệu suất Giảng dạy
                        </h1>
                        <p className="text-slate-500 !mt-1 text-sm font-medium">
                            Kỳ báo cáo: {reportData?.period || 'Đang tải...'}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-end gap-3 !bg-slate-50 !p-3 rounded-2xl border border-slate-100">
                        {/* Date Range */}
                        <div className="flex items-center gap-2 !bg-white !px-3 !py-2 rounded-xl border border-slate-200 shadow-sm">
                            <Icon icon="material-symbols:date-range-rounded" className="text-slate-400" />
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="text-xs font-bold outline-none border-none !p-0 w-28 !bg-transparent" />
                            <span className="text-slate-300">|</span>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="text-xs font-bold outline-none border-none !p-0 w-28 !bg-transparent" />
                        </div>

                        {/* Subject Filter */}
                        <div className="flex items-center gap-2 !bg-white !px-3 !py-2 rounded-xl border border-slate-200 shadow-sm">
                            <Icon icon="material-symbols:book-outline" className="text-slate-400" />
                            <select value={subject} onChange={(e) => setSubject(e.target.value)} className="text-xs font-bold outline-none border-none !p-0 !pr-6 !bg-transparent">
                                <option value="All">Tất cả môn học</option>
                                <option value="Toán">Toán</option>
                                <option value="Văn">Ngữ Văn</option>
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div className="flex items-center gap-2 !bg-white !px-3 !py-2 rounded-xl border border-slate-200 shadow-sm">
                            <Icon icon="material-symbols:filter-list-rounded" className="text-slate-400" />
                            <select value={status} onChange={(e) => setStatus(e.target.value)} className="text-xs font-bold outline-none border-none !p-0 !pr-6 !bg-transparent">
                                <option value="All">Tất cả trạng thái</option>
                                <option value="Active">Đang dạy</option>
                                <option value="Archived">Lưu trữ</option>
                            </select>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button onClick={fetchReport} className="!bg-blue-600 text-white !px-4 !py-2 rounded-xl font-bold text-xs hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95">
                                Áp dụng
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center !py-20 w-full min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <>
                    {/* 2. KPI Cards (Grid 4 cột) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Sĩ số (Active)"
                            icon="material-symbols:group-rounded"
                            value={reportData?.totalOverview?.totalActiveStudents}
                            subValue="Lấp đầy phòng"
                            progress={reportData?.totalOverview?.capacityUtilizationPercent}
                        />
                        <StatCard
                            title="Tăng trưởng"
                            icon="material-symbols:trending-up-rounded"
                            iconColor="text-green-600"
                            iconBg="!bg-green-50"
                            value={`${reportData?.totalStudentGrowth?.netGrowth > 0 ? '+' : ''}${reportData?.totalStudentGrowth?.netGrowth}`}
                            subValue={
                                <div className="flex gap-3 text-[10px] font-black uppercase tracking-widest text-[#64748B]">
                                    <span className="text-green-600">{reportData?.totalStudentGrowth?.newEnrollments} mới</span>
                                    <span>/</span>
                                    <span className="text-red-600">{reportData?.totalStudentGrowth?.dropouts} nghỉ</span>
                                </div>
                            }
                        />
                        <StatCard
                            title="Chuyên cần"
                            icon="material-symbols:calendar-check-rounded"
                            iconColor="text-purple-600"
                            iconBg="!bg-purple-50"
                            value={`${reportData?.totalAcademicPerformance?.attendanceRatePercent}%`}
                            warning={reportData?.totalAcademicPerformance?.attendanceRatePercent < 80}
                            subValue="Tỉ lệ đi học trung bình"
                        />
                        <StatCard
                            title="Chất lượng học lực"
                            icon="material-symbols:school-rounded"
                            iconColor="text-indigo-600"
                            iconBg="!bg-indigo-50"
                            value={`${reportData?.totalAcademicPerformance?.grading?.aboveAveragePercent}%`}
                            subValue="Tỉ lệ trên trung bình (>=5.0)"
                        />
                    </div>

                    {/* 3. Phân tích & Biểu đồ */}
                    <div className="grid grid-cols-1 !mt-2 lg:grid-cols-2 gap-6">
                        <div className="!bg-white rounded-[var(--radius-xl)] !p-6 border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-black text-slate-900 !mb-6 flex items-center gap-2">
                                <Icon icon="material-symbols:pie-chart-rounded" className="text-blue-600" />
                                Phân bổ học lực
                            </h3>
                            <GradingDonutChart
                                data={reportData?.totalAcademicPerformance?.grading}
                                totalGraded={reportData?.totalAcademicPerformance?.grading?.totalGraded}
                            />
                        </div>
                        <div className="!bg-white rounded-[var(--radius-xl)] !p-6 border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-black text-slate-900 !mb-6 flex items-center gap-2">
                                <Icon icon="material-symbols:bar-chart-rounded" className="text-green-600" />
                                Biến động sĩ số
                            </h3>
                            <GrowthTrendsChart data={reportData?.globalEnrollmentTrend || []} isTrendArray={true} />
                        </div>
                    </div>

                    {/* 4. Table */}
                    <ClassBreakdownTable classes={filteredClasses} startDate={startDate} endDate={endDate} />
                </>
            )}
        </div>
    );
};

export default AcademicReportPage;
