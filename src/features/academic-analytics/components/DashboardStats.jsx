import React from 'react';
import { Icon } from '@iconify/react';

const DashboardStats = ({ data }) => {
    if (!data) return null;

    const { totalOverview, totalStudentGrowth, totalAcademicPerformance } = data;

    // Attendance Rules
    const attendanceRate = totalAcademicPerformance?.attendanceRatePercent || 0;
    let attendanceColor = 'text-red-500';
    let attendanceRing = 'text-red-500';
    if (attendanceRate > 90) {
        attendanceColor = 'text-green-500';
        attendanceRing = 'text-green-500';
    } else if (attendanceRate >= 75) {
        attendanceColor = 'text-yellow-500';
        attendanceRing = 'text-yellow-500';
    }

    const capacityPercent = totalOverview?.capacityUtilizationPercent || 0;
    const netGrowth = totalStudentGrowth?.netGrowth || 0;
    const isPositiveGrowth = netGrowth >= 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Card 1: Tổng quan sĩ số */}
            <div className="bg-white rounded-[var(--radius-xl)] p-6 shadow-[var(--shadow-premium)] border border-[var(--color-border)] flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Icon icon="material-symbols:school-rounded" className="text-2xl text-blue-600" />
                        </div>
                        <h3 className="text-gray-500 font-medium">Tổng quan sĩ số</h3>
                    </div>
                    <div className="mt-4">
                        <span className="text-3xl font-bold text-gray-800">
                            {totalOverview?.totalActiveStudents || 0}
                        </span>
                        <span className="text-gray-500 ml-2">Học viên</span>
                    </div>
                </div>
                <div className="mt-6">
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">Tỉ lệ lấp đầy</span>
                        <span className="font-semibold text-gray-700">{capacityPercent.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${Math.min(capacityPercent, 100)}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Card 2: Biến động học viên */}
            <div className="bg-white rounded-[var(--radius-xl)] p-6 shadow-[var(--shadow-premium)] border border-[var(--color-border)] flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isPositiveGrowth ? 'bg-green-50' : 'bg-red-50'}`}>
                            <Icon icon="material-symbols:trending-up-rounded" className={`text-2xl ${isPositiveGrowth ? 'text-green-600' : 'text-red-600'}`} />
                        </div>
                        <h3 className="text-gray-500 font-medium">Biến động học viên</h3>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className={`text-3xl font-bold ${isPositiveGrowth ? 'text-green-600' : 'text-red-600'}`}>
                            {netGrowth > 0 ? '+' : ''}{netGrowth}
                        </span>
                        <span className="text-gray-500 font-medium">Tăng trưởng</span>
                    </div>
                </div>
                <div className="mt-6 flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded text-green-700 font-semibold">
                        <Icon icon="material-symbols:arrow-upward-rounded" />
                        {totalStudentGrowth?.newEnrollments || 0} mới
                    </div>
                    <div className="flex items-center gap-1 bg-red-50 px-2 py-1 rounded text-red-700 font-semibold">
                        <Icon icon="material-symbols:arrow-downward-rounded" />
                        {totalStudentGrowth?.dropouts || 0} nghỉ
                    </div>
                </div>
            </div>

            {/* Card 3: Chất lượng điểm danh */}
            <div className="bg-white rounded-[var(--radius-xl)] p-6 shadow-[var(--shadow-premium)] border border-[var(--color-border)] flex flex-col justify-between items-center relative overflow-hidden transition-transform duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="w-full flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gray-50`}>
                        <Icon icon="material-symbols:how-to-reg-rounded" className={`text-2xl ${attendanceColor}`} />
                    </div>
                    <h3 className="text-gray-500 font-medium">Chất lượng chuyên cần</h3>
                </div>
                
                <div className="mt-4 flex justify-center items-center flex-1 w-full">
                    <div className="relative w-32 h-32 flex justify-center items-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path
                                className="text-gray-100"
                                strokeDasharray="100, 100"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                            />
                            <path
                                className={`${attendanceRing} transition-all duration-1000 ease-out`}
                                strokeDasharray={`${attendanceRate}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold text-gray-800">{attendanceRate.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;
