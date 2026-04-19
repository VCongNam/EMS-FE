import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import useAuthStore from '../../../store/authStore';
import { growthReportService } from '../api/growthReportService';
import StatCard from '../components/StatCard';
import { GradingDonutChart, GrowthTrendsChart } from '../components/PerformanceCharts';

const ClassReportDetailPage = () => {
    const { classId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const token = user?.token;

    const [isLoading, setIsLoading] = useState(true);
    const [classData, setClassData] = useState(null);
    const [activeTab, setActiveTab] = useState('grades');
    const today = new Date();
    const firstDayOfMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const lastDayOfMonth = `${lastDay.getFullYear()}-${String(lastDay.getMonth() + 1).padStart(2, '0')}-${String(lastDay.getDate()).padStart(2, '0')}`;

    // Filters state - initialized from navigation state or defaults
    const [startDate, setStartDate] = useState(location.state?.filters?.startDate || firstDayOfMonth);
    const [endDate, setEndDate] = useState(location.state?.filters?.endDate || lastDayOfMonth);

    const fetchClassReport = async () => {
        try {
            setIsLoading(true);
            const response = await growthReportService.getClassGrowthReport(classId, startDate, endDate, token);
            const result = await response.json();
            if (response.ok) {
                const rawData = result.data || result;
                const g = rawData.academicPerformance?.grading || {};
                const total = (g.excellentCount || 0) + (g.goodCount || 0) + (g.averageCount || 0) + (g.weakCount || 0);

                const processedData = {
                    ...rawData,
                    studentGrowth: {
                        ...rawData.studentGrowth,
                        netGrowth: (rawData.studentGrowth?.newEnrollments || 0) - (rawData.studentGrowth?.dropouts || 0)
                    },
                    academicPerformance: {
                        ...rawData.academicPerformance,
                        grading: {
                            ...g,
                            totalGraded: total,
                            aboveAveragePercent: total > 0 ? Math.round(((g.excellentCount || 0) + (g.goodCount || 0) + (g.averageCount || 0)) / total * 100) : 0
                        }
                    }
                };
                setClassData(processedData);
            }
        } catch (error) {
            console.error('Lỗi lấy báo cáo chi tiết:', error);
            toast.error('Không thể lấy dữ liệu chi tiết lớp học');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token && classId) fetchClassReport();
    }, [classId, token, startDate, endDate]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-40 w-full animate-fade-in">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!classData) {
        return (
            <div className="p-20 text-center">
                <Icon icon="material-symbols:error-outline" className="text-6xl text-slate-300 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-slate-600">Không tìm thấy dữ liệu cho lớp học này</h2>
                <button onClick={() => navigate('/teacher/academic-report')} className="mt-4 text-blue-600 font-bold flex items-center gap-2 mx-auto uppercase text-xs tracking-widest">
                    <Icon icon="material-symbols:arrow-back-rounded" /> Quay lại báo cáo tổng
                </button>
            </div>
        );
    }

    const { overview, studentGrowth, academicPerformance } = classData;

    return (
        <div className="w-full !mx-auto animate-fade-in space-y-6 !pb-12 h-screen overflow-y-auto !px-6 !pt-4 !pr-2 custom-scrollbar">
            {/* 1. Sticky Header with Back Button & Title */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border border-slate-200 rounded-[var(--radius-xl)] p-6 shadow-sm mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/teacher/academic-report')}
                            className="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-slate-100 active:scale-95 group"
                            title="Quay lại"
                        >
                            <Icon icon="material-symbols:arrow-back-rounded" className="text-xl group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight truncate max-w-[300px] md:max-w-md lg:max-w-lg" title={classData.className}>
                                    {classData.className}
                                </h1>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${classData.status === 'Archived' ? 'bg-slate-100 text-slate-600' : 'bg-green-100 text-green-700'}`}>
                                    {classData.status === 'Archived' ? 'Lưu trữ' : 'Đang dạy'}
                                </span>
                            </div>
                            <p className="text-slate-500 mt-1 text-sm font-medium flex items-center gap-4">
                                <span className="flex items-center gap-1.5"><Icon icon="material-symbols:book-outline" className="text-blue-600" /> {classData.subjectName}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span className="flex items-center gap-1.5"><Icon icon="material-symbols:calendar-month-rounded" className="text-indigo-600" /> Báo cáo chi tiết lớp</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 bg-slate-50 !p-3 rounded-2xl border border-slate-100">
                        <div className="flex flex-wrap items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                            <Icon icon="material-symbols:date-range-rounded" className="text-slate-400" />
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="text-xs font-bold outline-none border-none p-0 w-28 bg-transparent"
                            />
                            <span className="text-slate-300">|</span>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="text-xs font-bold outline-none border-none p-0 w-28 bg-transparent"
                            />
                        </div>
                        <button
                            onClick={fetchClassReport}
                            className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95"
                        >
                            Lọc
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. KPI Cards (Scoped for 1 class) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Sĩ số Hiện tại"
                    icon="material-symbols:group-rounded"
                    value={overview?.totalActiveStudents}
                    subValue="Tỷ lệ lấp đầy"
                    progress={overview?.capacityUtilizationPercent}
                />
                <StatCard
                    title="Biến động lớp"
                    icon="material-symbols:trending-up-rounded"
                    iconColor="text-green-600"
                    iconBg="bg-green-50"
                    value={`${studentGrowth?.netGrowth > 0 ? '+' : ''}${studentGrowth?.netGrowth}`}
                    subValue={
                        <div className="flex gap-3 text-[10px] font-black uppercase tracking-widest text-[#64748B]">
                            <span className="text-green-600">{studentGrowth?.newEnrollments} mới</span>
                            <span>/</span>
                            <span className="text-red-600">{studentGrowth?.dropouts} nghỉ</span>
                        </div>
                    }
                />
                <StatCard
                    title="Chuyên cần lớp"
                    icon="material-symbols:calendar-check-rounded"
                    iconColor="text-purple-600"
                    iconBg="bg-purple-50"
                    value={`${academicPerformance?.attendanceRatePercent}%`}
                    warning={academicPerformance?.attendanceRatePercent < 80}
                    subValue="Tỷ lệ đi học lớp"
                />
                <StatCard
                    title="Học lực lớp"
                    icon="material-symbols:school-rounded"
                    iconColor="text-indigo-600"
                    iconBg="bg-indigo-50"
                    value={`${academicPerformance?.grading?.aboveAveragePercent}%`}
                    subValue="Trên trung bình (>=5.0)"
                />
            </div>

            {/* 3. Deep Dive charts (Giống màn 1) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-[var(--radius-xl)] p-6 border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                        <Icon icon="material-symbols:pie-chart-rounded" className="text-indigo-600" />
                        Phân bổ học lực riêng
                    </h3>
                    <GradingDonutChart
                        data={academicPerformance?.grading}
                        totalGraded={academicPerformance?.grading?.totalGraded}
                    />
                </div>
                <div className="bg-white rounded-[var(--radius-xl)] p-6 border border-slate-200 shadow-sm">
                    <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                        <Icon icon="material-symbols:bar-chart-rounded" className="text-green-600" />
                        Xu hướng sĩ số lớp
                    </h3>
                    <GrowthTrendsChart data={classData.enrollmentTrend} isTrendArray={true} />
                </div>
            </div>

            {/* 4. Lists & Tables Footer */}
            <div className="bg-white rounded-[var(--radius-xl)] border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex border-b border-slate-100">
                    <button
                        onClick={() => setActiveTab('grades')}
                        className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'grades' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Bảng điểm (GPA)
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Lịch sử biến động
                    </button>
                </div>

                <div className="p-0">
                    {activeTab === 'grades' ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="!bg-gray-50 border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-500 font-bold">
                                        <th className="!px-6 !py-4 whitespace-nowrap">Học sinh</th>
                                        <th className="!px-6 !py-4 text-center whitespace-nowrap">GPA / Điểm số</th>
                                        <th className="!px-6 !py-4 text-center whitespace-nowrap">Xếp loại học lực</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {(classData.studentGrades || []).length > 0 ? (
                                        classData.studentGrades.map((student) => (
                                            <tr key={student.studentId} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="!px-6 !py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-200">
                                                            {student.studentName?.charAt(0)}
                                                        </div>
                                                        <span className="text-sm font-bold text-[#1E293B] truncate max-w-[150px] md:max-w-xs" title={student.studentName}>
                                                            {student.studentName}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="!px-6 !py-5 text-center">
                                                    <span className={`text-sm font-black ${student.gpa >= 8 ? 'text-green-600' : student.gpa >= 5 ? 'text-blue-600' : 'text-red-500'}`}>
                                                        {student.gpa?.toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="!px-6 !py-5 text-center">
                                                    <span className={`!px-3 !py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${student.rank === 'Giỏi' || student.rank === 'Xuất sắc' ? 'bg-green-100 text-green-700' :
                                                            student.rank === 'Trung bình' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                                                        }`}>
                                                        {student.rank}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="p-20 text-center">
                                                <Icon icon="material-symbols:person-search-rounded" className="text-4xl text-slate-200 mx-auto mb-4" />
                                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Không có dữ liệu điểm số</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            {/* Simple Pagination Footer */}
                            {(classData.studentGrades || []).length > 0 && (
                                <div className="p-6 border-t border-slate-50 flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">Hiển thị {(classData.studentGrades || []).length} kết quả</span>
                                    <div className="flex items-center gap-2">
                                        <button className="w-8 h-8 rounded-lg border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all opacity-50 cursor-not-allowed">
                                            <Icon icon="material-symbols:chevron-left" />
                                        </button>
                                        <button className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xs">1</button>
                                        <button className="w-8 h-8 rounded-lg border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all opacity-50 cursor-not-allowed">
                                            <Icon icon="material-symbols:chevron-right" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-20 text-center flex flex-col items-center justify-center">
                            <Icon icon="material-symbols:history-rounded" className="text-4xl text-slate-200 mb-4" />
                            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Lịch sử biến động lớp</p>
                            <p className="text-slate-300 text-xs mt-2 max-w-xs italic">Tính năng này ghi lại lịch sử học sinh nhập mới hoặc thôi học trong kỳ.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClassReportDetailPage;
