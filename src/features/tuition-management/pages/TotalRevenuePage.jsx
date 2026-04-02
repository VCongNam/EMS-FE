import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import RevenueTrendChart from '../components/charts/RevenueTrendChart';
import RevenueDistributionChart from '../components/charts/RevenueDistributionChart';
import RevenueComparisonChart from '../components/charts/RevenueComparisonChart';

const MOCK_TOTAL_STATS = [
    { label: 'Tổng doanh thu', value: '720.000.000 ₫', grow: '+12.5%', icon: 'solar:dollar-bold-duotone', color: 'text-primary' },
    { label: 'Mục tiêu quý', value: '1.000.000.000 ₫', rate: '72%', icon: 'solar:target-bold-duotone', color: 'text-amber-500' },
    { label: 'Trung bình/Lớp', value: '45.000.000 ₫', icon: 'solar:square-academic-cap-bold-duotone', color: 'text-emerald-500' },
    { label: 'Tổng học sinh', value: '1,240', grow: '+4%', icon: 'solar:users-group-rounded-bold-duotone', color: 'text-blue-500' },
];

const MOCK_CLASS_REVENUE = [
    { id: 'TC101', name: 'Toán Nâng Cao', students: 32, rate: '95%', revenue: 42000000 },
    { id: 'TC102', name: 'Lý Thuyết Vật Lý', students: 25, rate: '88%', revenue: 38500000 },
    { id: 'TC103', name: 'Hóa Học Cơ Bản', students: 18, rate: '100%', revenue: 21000000 },
    { id: 'TC104', name: 'Luyện đề IELTS', students: 12, rate: '75%', revenue: 15600000 },
];

const TotalRevenuePage = () => {
    const navigate = useNavigate();
    const [timeframe, setTimeframe] = useState('Current Semester');

    return (
        <div className="!min-h-full sm:!p-8 !space-y-8 !animate-fade-in custom-scrollbar">
            {/* Breadcrumbs & Navigation */}
            <div className="!flex !items-center !gap-2">
                <button 
                    onClick={() => navigate('/tuition')}
                    className="!flex !items-center !gap-2 !text-sm !font-bold !text-text-muted hover:!text-primary !transition-colors"
                >
                    <Icon icon="solar:round-arrow-left-bold" className="!text-xl" />
                    Quay lại Quản lý Học phí
                </button>
            </div>

            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center !gap-6 bg-surface !p-8 rounded-[2.5rem] border border-border shadow-sm">
                <div>
                    <h1 className="!text-3xl sm:!text-4xl !font-black !text-text-main !tracking-tight !flex !items-center !gap-3 font-['Outfit']">
                        Tổng hợp Doanh thu
                        <div className="!w-2.5 !h-2.5 !rounded-full !bg-primary !animate-pulse"></div>
                    </h1>
                    <p className="!text-sm !font-medium !text-text-muted !mt-2 !ml-1">
                        Báo cáo tài chính tổng quan dựa trên dữ liệu thanh toán học phí.
                    </p>
                </div>
                
                <div className="!flex !items-center !gap-3 !w-full sm:!w-auto !bg-background !p-2 !rounded-2xl !border !border-border">
                    <Icon icon="solar:calendar-bold-duotone" className="!text-xl !text-primary !ml-2" />
                    <select 
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                        className="!bg-transparent !border-none !text-sm !font-black !text-text-main focus:!outline-none !pr-8 !py-2 !cursor-pointer"
                    >
                        <option value="Current Semester">Học kỳ hiện tại</option>
                        <option value="Last 6 Months">6 tháng qua</option>
                        <option value="Last Year">Năm vừa qua</option>
                        <option value="All Time">Tất cả thời gian</option>
                    </select>
                </div>
            </div>

            {/* Executive Summary Cards */}
            <div className="!grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-4 !gap-6">
                {MOCK_TOTAL_STATS.map((stat, idx) => (
                    <div key={idx} className="!bg-white !p-6 !rounded-[2rem] !border !border-border !shadow-sm hover:!shadow-md !transition-all">
                        <div className="!flex !items-center !justify-between !mb-4">
                            <div className={`!w-12 !h-12 !rounded-2xl !bg-background !flex !items-center !justify-center ${stat.color}`}>
                                <Icon icon={stat.icon} className="!text-2xl" />
                            </div>
                            {stat.grow && (
                                <span className="!px-2 !py-1 !bg-emerald-50 !text-emerald-600 !text-[10px] !font-black !rounded-lg !uppercase">
                                    {stat.grow}
                                </span>
                            )}
                            {stat.rate && (
                                <span className="!px-2 !py-1 !bg-amber-50 !text-amber-500 !text-[10px] !font-black !rounded-lg !uppercase">
                                    {stat.rate} Done
                                </span>
                            )}
                        </div>
                        <p className="!text-xs !font-black !text-text-muted !uppercase !tracking-widest !mb-1">{stat.label}</p>
                        <h3 className="!text-2xl !font-black !text-text-main !tracking-tight">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Main Trend Chart */}
            <div className="!bg-white !p-8 !rounded-[2.5rem] !border !border-border !shadow-sm">
                <div className="!flex !items-center !justify-between !mb-8">
                    <div>
                        <h2 className="!text-xl !font-black !text-text-main !tracking-tight">Phân tích xu hướng doanh thu</h2>
                        <p className="!text-sm !font-bold !text-text-muted">Biểu thị hiệu suất thu nhập qua các tháng</p>
                    </div>
                    <div className="!flex !items-center !gap-2">
                        <div className="!w-3 !h-3 !rounded-full !bg-primary" />
                        <span className="!text-xs !font-black !text-text-muted !uppercase">Số thực thu</span>
                    </div>
                </div>
                <RevenueTrendChart />
            </div>

            {/* Distribution & Comparison Grid */}
            <div className="!grid !grid-cols-1 lg:!grid-cols-2 !gap-8">
                {/* Pie Chart */}
                <div className="!bg-white !p-8 !rounded-[2.5rem] !border !border-border !shadow-sm">
                    <h2 className="!text-xl !font-black !text-text-main !tracking-tight !mb-6">Phân bổ theo lớp</h2>
                    <RevenueDistributionChart />
                </div>
                {/* Bar Chart */}
                <div className="!bg-white !p-8 !rounded-[2.5rem] !border !border-border !shadow-sm">
                    <h2 className="!text-xl !font-black !text-text-main !tracking-tight !mb-6">So sánh doanh thu lớp học</h2>
                    <RevenueComparisonChart />
                </div>
            </div>

            {/* Detailed Class List - Responsive */}
            <div className="!bg-white !rounded-[2.5rem] !border !border-border !shadow-sm !overflow-hidden">
                <div className="!px-8 !py-6 !border-b !border-border !bg-background/20 !flex !items-center !justify-between">
                    <h2 className="!text-xl !font-black !text-text-main !tracking-tight">Chi tiết doanh thu từng lớp</h2>
                    <div className="!px-4 !py-1 !bg-primary/10 !text-primary !text-xs !font-black !rounded-full !uppercase">
                        {MOCK_CLASS_REVENUE.length} Lớp đang hoạt động
                    </div>
                </div>

                {/* ── Desktop Table (md+) ─────────────────────────── */}
                <div className="!hidden md:!block !overflow-x-auto custom-scrollbar">
                    <table className="!w-full !text-left !border-collapse">
                        <thead>
                            <tr className="!bg-[#F8FAFC] !border-b !border-border">
                                <th className="!px-8 !py-5 !text-[11px] !font-black !text-text-muted !uppercase !tracking-widest">ID / Lớp học</th>
                                <th className="!px-8 !py-5 !text-[11px] !font-black !text-text-muted !uppercase !tracking-widest">Sĩ số</th>
                                <th className="!px-8 !py-5 !text-[11px] !font-black !text-text-muted !uppercase !tracking-widest">Tỷ lệ hoàn thành</th>
                                <th className="!px-8 !py-5 !text-[11px] !font-black !text-text-muted !uppercase !tracking-widest">Thực thu (VND)</th>
                            </tr>
                        </thead>
                        <tbody className="!divide-y !divide-border">
                            {MOCK_CLASS_REVENUE.map((cls) => (
                                <tr key={cls.id} className="hover:!bg-[#F8FAFC] !transition-all">
                                    <td className="!px-8 !py-5">
                                        <div>
                                            <p className="!text-sm !font-black !text-text-main">{cls.name}</p>
                                            <p className="!text-[10px] !font-black !text-text-muted !uppercase">{cls.id}</p>
                                        </div>
                                    </td>
                                    <td className="!px-8 !py-5">
                                        <div className="!flex !items-center !gap-2">
                                            <Icon icon="solar:users-group-rounded-bold" className="!text-primary" />
                                            <span className="!text-sm !font-bold !text-text-main">{cls.students} học sinh</span>
                                        </div>
                                    </td>
                                    <td className="!px-8 !py-5">
                                        <div className="!flex !items-center !gap-3">
                                            <div className="!flex-1 !h-1.5 !bg-background !rounded-full !overflow-hidden">
                                                <div className="!h-full !bg-primary" style={{ width: cls.rate }}></div>
                                            </div>
                                            <span className="!text-xs !font-black !text-primary">{cls.rate}</span>
                                        </div>
                                    </td>
                                    <td className="!px-8 !py-5">
                                        <span className="!text-base !font-black !text-text-main">{cls.revenue.toLocaleString('vi-VN')} ₫</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ── Mobile Card List (below md) ─────────────────── */}
                <div className="md:!hidden !divide-y !divide-border">
                    {MOCK_CLASS_REVENUE.map((cls) => (
                        <div key={cls.id} className="!p-6 !space-y-4">
                            <div className="!flex !items-center !justify-between">
                                <div className="!flex !items-center !gap-3">
                                    <div className="!w-10 !h-10 !bg-primary/10 !rounded-xl !flex !items-center !justify-center !text-primary">
                                        <Icon icon="solar:square-academic-cap-bold-duotone" className="!text-xl" />
                                    </div>
                                    <div>
                                        <p className="!text-sm !font-black !text-text-main">{cls.name}</p>
                                        <p className="!text-[10px] !font-black !text-text-muted">{cls.id}</p>
                                    </div>
                                </div>
                                <span className="!text-base !font-black !text-primary">{cls.revenue.toLocaleString('vi-VN')} ₫</span>
                            </div>

                            <div className="!grid !grid-cols-2 !gap-4 !p-4 !bg-background !rounded-2xl !border !border-border">
                                <div className="!space-y-1">
                                    <p className="!text-[9px] !font-black !text-text-muted !uppercase !tracking-wider">Sĩ số</p>
                                    <p className="!text-xs !font-bold !text-text-main">{cls.students} học sinh</p>
                                </div>
                                <div className="!space-y-1">
                                    <p className="!text-[9px] !font-black !text-text-muted !uppercase !tracking-wider">Tỷ lệ thu</p>
                                    <div className="!flex !items-center !gap-2">
                                        <div className="!flex-1 !h-1 !bg-border !rounded-full !overflow-hidden">
                                            <div className="!h-full !bg-primary" style={{ width: cls.rate }}></div>
                                        </div>
                                        <span className="!text-[10px] !font-black !text-primary">{cls.rate}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TotalRevenuePage;
