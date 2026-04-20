import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

const ClassBreakdownTable = ({ classes, startDate, endDate }) => {
    const navigate = useNavigate();
    const [sortConfig, setSortConfig] = useState({ key: 'academicPerformance.attendanceRatePercent', direction: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const sortedClasses = useMemo(() => {
        let sortableItems = [...(classes || [])];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                // Tiện ích lấy giá trị theo chuỗi key (vd: "overview.totalActiveStudents")
                const getVal = (obj, path) => path.split('.').reduce((acc, part) => acc && acc[part], obj);
                
                const aValue = getVal(a, sortConfig.key);
                const bValue = getVal(b, sortConfig.key);

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [classes, sortConfig]);

    // Pagination logic
    const totalPages = Math.ceil(sortedClasses.length / itemsPerPage);
    const paginatedClasses = sortedClasses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset to page 1 when data changes
    useEffect(() => {
        setCurrentPage(1);
    }, [classes]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const renderSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) {
            return <Icon icon="material-symbols:unfold-more-rounded" className="text-gray-400 opacity-50" />;
        }
        if (sortConfig.direction === 'asc') {
            return <Icon icon="material-symbols:keyboard-arrow-up-rounded" className="text-blue-600" />;
        }
        return <Icon icon="material-symbols:keyboard-arrow-down-rounded" className="text-blue-600" />;
    };

    if (!classes || classes.length === 0) {
        return (
            <div className="!bg-white rounded-[var(--radius-xl)] shadow-[var(--shadow-premium)] border border-[var(--color-border)] !p-12 text-center !mt-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <Icon icon="material-symbols:analytics-outline-rounded" className="text-6xl text-[#64748B] opacity-50 !mx-auto !mb-4" />
                <h3 className="text-xl font-medium text-[#1E293B]">Chưa có dữ liệu lớp học</h3>
                <p className="text-[#64748B] !mt-2">Hãy thay đổi bộ lọc thời gian để xem kết quả.</p>
            </div>
        );
    }

    return (
        <div className="!bg-white rounded-[var(--radius-xl)] shadow-[var(--shadow-premium)] border border-[var(--color-border)] !mt-6 overflow-hidden animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="!p-5 border-b border-[var(--color-border)] flex justify-between items-center !bg-[#F7F8F0]">
                <h2 className="text-lg font-bold text-[var(--color-primary)] flex items-center gap-2">
                    <Icon icon="material-symbols:table-chart-view-rounded" className="text-[var(--color-secondary)] text-xl" />
                    Phân tích chi tiết từng lớp
                </h2>
                <span className="text-sm font-medium text-[var(--color-primary)] !bg-white !px-3 !py-1 rounded-full border border-[var(--color-border)] shadow-sm">
                    {classes.length} Lớp học
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="!bg-gray-50 border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-500 font-bold">
                            <th className="!px-6 !py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => requestSort('className')}>
                                <div className="flex items-center gap-1.5">Tên lớp {renderSortIcon('className')}</div>
                            </th>
                            <th className="!px-6 !py-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => requestSort('subjectName')}>
                                <div className="flex items-center gap-1.5">Môn {renderSortIcon('subjectName')}</div>
                            </th>
                            <th className="!px-6 !py-4 text-center">Trạng thái</th>
                            <th className="!px-6 !py-4 cursor-pointer hover:bg-gray-100 transition-colors text-center" onClick={() => requestSort('overview.totalActiveStudents')}>
                                <div className="flex items-center gap-1.5 justify-center">Sĩ số {renderSortIcon('overview.totalActiveStudents')}</div>
                            </th>
                            <th className="!px-6 !py-4 cursor-pointer hover:bg-gray-100 transition-colors text-center" onClick={() => requestSort('studentGrowth.netGrowth')}>
                                <div className="flex items-center gap-1.5 justify-center">Tăng trưởng {renderSortIcon('studentGrowth.netGrowth')}</div>
                            </th>
                            <th className="!px-6 !py-4 cursor-pointer hover:bg-gray-100 transition-colors text-center" onClick={() => requestSort('academicPerformance.attendanceRatePercent')}>
                                <div className="flex items-center gap-1.5 justify-center">Chuyên cần {renderSortIcon('academicPerformance.attendanceRatePercent')}</div>
                            </th>
                            <th className="!px-6 !py-4 text-center">Học lực (% Giỏi)</th>
                            <th className="!px-6 !py-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                        {paginatedClasses.map((cls) => {
                            const attendanceRate = cls.academicPerformance?.attendanceRatePercent || 0;
                            const grading = cls.academicPerformance?.grading || {};
                            const aboveAveragePercent = grading.aboveAveragePercent || 0;
                            
                            const statusColor = cls.status === 'Archived' ? '!bg-slate-100 text-slate-600' : '!bg-green-100 text-green-700';
                            const statusText = cls.status === 'Archived' ? 'Lưu trữ' : 'Đang dạy';

                            const netGrowth = cls.studentGrowth?.netGrowth || 0;
                            const totalStudents = cls.overview?.totalActiveStudents || 0;

                            return (
                                <tr key={cls.classId} className="hover:bg-[#F8FAFC] transition-colors group">
                                    <td className="!px-6 !py-4">
                                        <div className="font-bold text-[#1E293B] group-hover:text-[var(--color-primary)] transition-colors">{cls.className}</div>
                                    </td>
                                    <td className="!px-6 !py-4">
                                        <span className="!px-2.5 !py-1 rounded-md text-[10px] font-black !bg-blue-50 text-blue-700 uppercase tracking-widest border border-blue-100">
                                            {cls.subjectName}
                                        </span>
                                    </td>
                                    <td className="!px-6 !py-4 text-center">
                                        <span className={`!px-2.5 !py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusColor}`}>
                                            {statusText}
                                        </span>
                                    </td>
                                    <td className="!px-6 !py-4 text-center">
                                        <div className="font-black text-[#1E293B]">{totalStudents}</div>
                                    </td>
                                    <td className="!px-6 !py-4 text-center">
                                        <div className={`font-bold ${netGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {netGrowth > 0 ? '+' : ''}{netGrowth}
                                        </div>
                                    </td>
                                    <td className="!px-6 !py-4 text-center">
                                        <div className={`font-bold ${attendanceRate < 80 ? 'text-orange-500' : 'text-[#1E293B]'}`}>
                                            {attendanceRate}%
                                        </div>
                                    </td>
                                    <td className="!px-6 !py-4 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="font-black text-indigo-600">{aboveAveragePercent}%</span>
                                            <div className="w-12 !bg-gray-100 h-1 rounded-full !mt-1 overflow-hidden">
                                                <div className="!bg-indigo-500 h-full" style={{ width: `${aboveAveragePercent}%` }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="!px-6 !py-4 text-center">
                                        <Link 
                                            to={`/teacher/academic-report/${cls.classId}`}
                                            state={{ filters: { startDate, endDate } }}
                                            className="inline-flex items-center gap-2 !px-4 !py-2 rounded-xl !bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all font-bold text-xs border border-blue-100 shadow-sm active:scale-95 no-underline"
                                        >
                                            <Icon icon="material-symbols:visibility-outline-rounded" className="text-lg" />
                                            Chi tiết
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="!p-6 border-t border-slate-50 flex items-center justify-between !bg-white border-b rounded-b-[var(--radius-xl)]">
                    <span className="text-xs font-bold text-slate-400 tracking-widest uppercase">
                        Trang {currentPage} / {totalPages}
                    </span>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`w-8 h-8 rounded-lg border border-slate-100 flex items-center justify-center transition-all ${currentPage === 1 ? 'text-slate-300 opacity-50 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-50 hover:border-blue-200 hover:text-blue-600'}`}
                        >
                            <Icon icon="material-symbols:chevron-left" />
                        </button>
                        
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-8 h-8 rounded-lg font-black text-xs transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'}`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`w-8 h-8 rounded-lg border border-slate-100 flex items-center justify-center transition-all ${currentPage === totalPages ? 'text-slate-300 opacity-50 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-50 hover:border-blue-200 hover:text-blue-600'}`}
                        >
                            <Icon icon="material-symbols:chevron-right" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassBreakdownTable;
