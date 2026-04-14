import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import RevenueTrendChart from '../components/charts/RevenueTrendChart';
import RevenueDistributionChart from '../components/charts/RevenueDistributionChart';
import RevenueComparisonChart from '../components/charts/RevenueComparisonChart';
import { tuitionService } from '../api/tuitionService';
import useAuthStore from '../../../store/authStore';

const formatVND = (amount) => amount?.toLocaleString('vi-VN') + ' ₫';

const TotalRevenuePage = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [timeframe, setTimeframe] = useState('Current Semester');
    const [data, setData] = useState({
        totalRevenue: 0,
        totalStudents: 0,
        averageRevenuePerClass: 0,
        quarterlyTarget: 0,
        revenueByClasses: [],
        revenueTrends: []
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!user?.token) return;
            try {
                setIsLoading(true);
                const res = await tuitionService.getDashboardAnalytics(user.token);
                if (res.ok) {
                    const result = await res.json();
                    setData(result);
                } else {
                    toast.error("Không thể tải báo cáo doanh thu");
                }
            } catch (error) {
                console.error("Lỗi lấy báo cáo:", error);
                toast.error("Vui lòng kiểm tra lại kết nối");
            } finally {
                setIsLoading(false);
            }
        };
        fetchAnalytics();
    }, [user?.token, timeframe]);

    // Data Mapping for Cards
    const statsCards = useMemo(() => {
        const rate = data.quarterlyTarget ? Math.round((data.totalRevenue / data.quarterlyTarget) * 100) : 0;
        return [
            { label: 'Tổng doanh thu', value: formatVND(data.totalRevenue), grow: '', icon: 'solar:dollar-bold-duotone', color: 'text-primary' },
            { label: 'Mục tiêu quý', value: formatVND(data.quarterlyTarget), rate: `${rate}%`, icon: 'solar:target-bold-duotone', color: 'text-amber-500' },
            { label: 'Trung bình/Lớp', value: formatVND(data.averageRevenuePerClass), icon: 'solar:square-academic-cap-bold-duotone', color: 'text-emerald-500' },
            { label: 'Tổng học sinh', value: data.totalStudents.toLocaleString('vi-VN'), grow: '', icon: 'solar:users-group-rounded-bold-duotone', color: 'text-blue-500' },
        ];
    }, [data]);

    // Data Mapping for Charts
    const trendData = data.revenueTrends?.map(item => ({
        name: item.monthLabel,
        total: item.revenue
    })) || [];

    const distributionData = data.revenueByClasses?.map(item => ({
        name: item.className,
        value: item.revenue
    })) || [];

    const comparisonData = data.revenueByClasses?.map(item => ({
        name: item.className,
        revenue: item.revenue
    })) || [];

    return (
        <div className="!min-h-full sm:!p-8 !space-y-8 !animate-fade-in custom-scrollbar">
            {/* Breadcrumbs & Navigation */}
            <div className="!flex !items-center !gap-2 !mb-4">
                <button 
                    onClick={() => navigate('/tuition')}
                    className="!flex !items-center !gap-2 !text-sm !font-bold !text-text-muted hover:!text-primary !transition-colors"
                >
                    <Icon icon="solar:round-arrow-left-bold" className="!text-xl" />
                    Quay lại
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
                {statsCards.map((stat, idx) => (
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
                        {isLoading ? (
                            <div className="!h-8 !w-32 !bg-border !animate-pulse !rounded-md"></div>
                        ) : (
                            <h3 className="!text-2xl !font-black !text-text-main !tracking-tight">{stat.value}</h3>
                        )}
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
                {isLoading ? <div className="!h-[350px] !flex !items-center !justify-center text-text-muted">Đang tải biểu đồ...</div> : <RevenueTrendChart data={trendData} />}
            </div>

            {/* Distribution & Comparison Grid */}
            <div className="!grid !grid-cols-1 lg:!grid-cols-2 !gap-8">
                {/* Pie Chart */}
                <div className="!bg-white !p-8 !rounded-[2.5rem] !border !border-border !shadow-sm">
                    <h2 className="!text-xl !font-black !text-text-main !tracking-tight !mb-6">Phân bổ theo lớp</h2>
                    {isLoading ? <div className="!h-[350px] !flex !items-center !justify-center text-text-muted">Đang tải biểu đồ...</div> : <RevenueDistributionChart data={distributionData} />}
                </div>
                {/* Bar Chart */}
                <div className="!bg-white !p-8 !rounded-[2.5rem] !border !border-border !shadow-sm">
                    <h2 className="!text-xl !font-black !text-text-main !tracking-tight !mb-6">So sánh doanh thu lớp học</h2>
                    {isLoading ? <div className="!h-[350px] !flex !items-center !justify-center text-text-muted">Đang tải biểu đồ...</div> : <RevenueComparisonChart data={comparisonData} />}
                </div>
            </div>

            {/* Detailed Class List - Responsive */}
            <div className="!bg-white !rounded-[2.5rem] !border !border-border !shadow-sm !overflow-hidden">
                <div className="!px-8 !py-6 !border-b !border-border !bg-background/20 !flex !items-center !justify-between">
                    <h2 className="!text-xl !font-black !text-text-main !tracking-tight">Chi tiết doanh thu từng lớp</h2>
                    <div className="!px-4 !py-1 !bg-primary/10 !text-primary !text-xs !font-black !rounded-full !uppercase">
                        Lớp đang hoạt động
                    </div>
                </div>

                {/* ── Desktop Table (md+) ─────────────────────────── */}
                <div className="!hidden md:!block !overflow-x-auto custom-scrollbar">
                    <table className="!w-full !text-left !border-collapse">
                        <thead>
                            <tr className="!bg-[#F8FAFC] !border-b !border-border">
                                <th className="!px-8 !py-5 !text-[11px] !font-black !text-text-muted !uppercase !tracking-widest">Lớp học / Ghi chú</th>
                                <th className="!px-8 !py-5 !text-[11px] !font-black !text-text-muted !uppercase !tracking-widest text-right">Thực thu (VND)</th>
                            </tr>
                        </thead>
                        <tbody className="!divide-y !divide-border">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={2} className="!py-16 !text-center text-text-muted">Đang tải dữ liệu...</td>
                                </tr>
                            ) : data.revenueByClasses?.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="!py-16 !text-center text-text-muted">Chưa có dữ liệu thanh toán</td>
                                </tr>
                            ) : (
                                data.revenueByClasses?.map((cls, idx) => (
                                    <tr key={idx} className="hover:!bg-[#F8FAFC] !transition-all">
                                        <td className="!px-8 !py-5">
                                            <div>
                                                <p className="!text-sm !font-black !text-text-main">{cls.className}</p>
                                                <p className="!text-[10px] !font-bold !text-text-muted">Phân tích theo báo cáo doanh thu tuần.</p>
                                            </div>
                                        </td>
                                        <td className="!px-8 !py-5 !text-right">
                                            <span className="!text-base !font-black !text-text-main">{cls.revenue?.toLocaleString('vi-VN')} ₫</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ── Mobile Card List (below md) ─────────────────── */}
                <div className="md:!hidden !divide-y !divide-border">
                    {data.revenueByClasses?.map((cls, idx) => (
                        <div key={idx} className="!p-6 !space-y-4">
                            <div className="!flex !items-center !justify-between">
                                <div className="!flex !items-center !gap-3">
                                    <div className="!w-10 !h-10 !bg-primary/10 !rounded-xl !flex !items-center !justify-center !text-primary">
                                        <Icon icon="solar:square-academic-cap-bold-duotone" className="!text-xl" />
                                    </div>
                                    <div>
                                        <p className="!text-sm !font-black !text-text-main">{cls.className}</p>
                                        <p className="!text-[10px] !font-bold !text-text-muted">Thu trong kỳ</p>
                                    </div>
                                </div>
                                <span className="!text-base !font-black !text-primary">{cls.revenue?.toLocaleString('vi-VN')} ₫</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TotalRevenuePage;
