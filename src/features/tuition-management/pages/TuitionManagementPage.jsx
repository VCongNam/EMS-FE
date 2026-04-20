import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import DashboardStatCards from '../../dashboard/components/DashboardStatCards';
import RevenueTrendChart from '../components/charts/RevenueTrendChart';
import RevenueDistributionChart from '../components/charts/RevenueDistributionChart';
import CollectionRateGauge from '../components/charts/CollectionRateGauge';
import { tuitionService } from '../api/tuitionService';
import useAuthStore from '../../../store/authStore';
import TuitionFeeModal from '../components/TuitionFeeModal';

// ─── Constants ────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 5;

// ─── Helper ───────────────────────────────────────────────────────────────────
const formatVND = (amount) => amount?.toLocaleString('vi-VN') + ' ₫';

// ─── Row Components ───────────────────────────────────────────────────────────
const ConfigRow = ({ config, onEdit }) => {
    return (
        <tr className="hover:!bg-slate-50/80 transition-colors">
            <td className="!px-6 !py-4">
                <p className="font-black text-text-main text-sm">{config.className}</p>
            </td>
            <td className="!px-6 !py-4 text-center">
                <span className={`!px-2 !py-0.5 rounded text-[10px] font-black ${config.billingMethod === 'Prepaid' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-purple-100 text-purple-700 border border-purple-200'}`}>
                    {config.billingMethod === 'Prepaid' ? 'Trả trước' : 'Trả sau'}
                </span>
            </td>
            <td className="!px-6 !py-4 text-center">
                <span className="font-black text-text-main text-xs">{formatVND(config.tuitionFee || config.pricePerSession)}</span>
            </td>
            <td className="!px-6 !py-4 text-center font-bold text-text-main text-xs">
                {config.paymentDeadlineDays || 5} ngày
            </td>
            <td className="!px-6 !py-4 text-center">
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => onEdit(config)}
                        className="!p-2 !rounded-lg !bg-slate-100 !text-slate-600 hover:!bg-primary hover:!text-white transition-all shadow-sm group relative"
                        title="Sửa cấu hình"
                    >
                        <Icon icon="solar:pen-new-square-bold-duotone" className="!text-lg" />
                        <div className="!absolute !bottom-full !left-1/2 !-translate-x-1/2 !mb-2 !px-3 !py-1 !bg-slate-900 !text-white !text-[10px] !font-bold !rounded-lg !opacity-0 group-hover:!opacity-100 !pointer-events-none !transition-all !whitespace-nowrap !shadow-xl">
                            Sửa cấu hình
                            <div className="!absolute !top-full !left-1/2 !-translate-x-1/2 !border-4 !border-transparent !border-t-slate-900"></div>
                        </div>
                    </button>
                </div>
            </td>
        </tr>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const TuitionManagementPage = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    // Filter state
    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
    const [selectedBillingMethod, setSelectedBillingMethod] = useState('All');

    // API State
    const [overviewData, setOverviewData] = useState([]);
    const [dashboardStats, setDashboardStats] = useState({
        totalExpected: 0,
        totalPaid: 0,
        totalDebt: 0,
        dailyTrend: [],
        proportionByClass: []
    });
    const [pendingCount, setPendingCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [activeSubTab, setActiveSubTab] = useState('report'); // 'report' | 'config'
    const [configData, setConfigData] = useState([]); // Data for the second tab
    const [isConfigLoading, setIsConfigLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedConfig, setSelectedConfig] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);

    const fetchData = async () => {
        if (!user?.token) return;
        try {
            setIsLoading(true);
            const [overviewRes, dashboardRes, pendingRes] = await Promise.all([
                tuitionService.getClassesOverview(selectedMonth, selectedYear, user.token),
                tuitionService.getDashboardOverview(selectedMonth, selectedYear, user.token),
                tuitionService.getPendingTransactions(user.token)
            ]);

            if (overviewRes.ok) setOverviewData(await overviewRes.json() || []);
            if (dashboardRes.ok) {
                const d = await dashboardRes.json();
                setDashboardStats({
                    totalExpected: d.totalExpected || 0,
                    totalPaid: d.totalPaid || 0,
                    totalDebt: d.totalDebt || 0,
                    dailyTrend: d.dailyTrend || [],
                    proportionByClass: d.proportionByClass || []
                });
            }
            if (pendingRes.ok) setPendingCount((await pendingRes.json() || []).length);

        } catch (error) {
            console.error('Error fetching tuition data:', error);
            toast.error('Không thể tải dữ liệu học phí. Vui lòng kiểm tra lại kết nối!');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (activeSubTab === 'report') {
            fetchData();
        } else {
            fetchConfigData();
        }
    }, [selectedMonth, selectedYear, user?.token, activeSubTab]);

    const fetchConfigData = async () => {
        if (!user?.token) return;
        try {
            setIsConfigLoading(true);
            const res = await tuitionService.getTuitionConfigs(user.token);
            if (res.ok) setConfigData(await res.json() || []);
        } catch (error) {
            console.error('Error fetching tuition configs:', error);
            toast.error('Không thể tải cấu hình học phí!');
        } finally {
            setIsConfigLoading(false);
        }
    };

    const handleSaveConfig = async (data) => {
        if (!user?.token) return;
        try {
            const res = await tuitionService.updateTuitionFee(data.classId, {
                tuitionFee: Number(data.tuitionFee),
                billingMethod: data.billingMethod,
                paymentDeadlineDays: Number(data.paymentDeadlineDays)
            }, user.token);

            if (res.ok) {
                toast.success(`Cập nhật cấu hình lớp ${data.className || data.name || ''} thành công!`);
                setIsModalOpen(false);
                fetchConfigData();
            } else {
                const err = await res.json();
                toast.error(extractApiError(err, 'Lỗi khi cập nhật cấu hình!'));
            }
        } catch (error) {
            console.error('Error updating tuition config:', error);
            toast.error('Có lỗi xảy ra, vui lòng thử lại!');
        }
    };

    // Derived Statistics
    const trendData = dashboardStats.dailyTrend.map(item => ({
        name: `Ng ${item.day}`,
        total: item.receivedAmount
    }));

    const distributionData = dashboardStats.proportionByClass.map(item => ({
        name: item.className || item.name,
        value: item.proportion ?? item.value ?? item.revenue ?? 0
    }));

    // Filter & Pagination Logic
    const filteredTableData = useMemo(() => {
        return overviewData.filter(cls => {
            if (selectedBillingMethod === 'All') return true;
            return cls.billingMethod === selectedBillingMethod;
        });
    }, [overviewData, selectedBillingMethod]);

    const filteredConfigData = useMemo(() => {
        return configData.filter(cls => {
            if (selectedBillingMethod === 'All') return true;
            return cls.billingMethod === selectedBillingMethod;
        });
    }, [configData, selectedBillingMethod]);

    const paginatedTableData = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredTableData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredTableData, currentPage]);

    const totalPages = Math.ceil(filteredTableData.length / ITEMS_PER_PAGE);

    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = [currentDate.getFullYear() - 1, currentDate.getFullYear(), currentDate.getFullYear() + 1];

    // ── Handlers ───────────────────────────────────────────────────────────
    const extractApiError = (errorData, defaultMessage) => {
        if (errorData?.errors && typeof errorData.errors === 'object') {
            const firstErrorField = Object.keys(errorData.errors)[0];
            if (firstErrorField && errorData.errors[firstErrorField].length > 0) {
                return errorData.errors[firstErrorField][0];
            }
        }
        return errorData?.title || errorData?.message || defaultMessage;
    };

    return (
        <div className="!space-y-6 !animate-fade-in-up !pb-10 !px-4 sm:!px-8">

            {/* Page Header */}
            <div className="!mt-8 !flex !flex-col sm:!flex-row sm:!items-center sm:!justify-between !gap-4">
                <div>
                    <h1 className="!text-3xl !font-black !text-text-main !tracking-tight">Báo cáo tài chính</h1>
                    <div className="!flex !items-center !gap-6 !mt-4 !border-b !border-border">
                        <button
                            onClick={() => setActiveSubTab('report')}
                            className={`!pb-3 !text-sm !font-black !transition-all !relative ${activeSubTab === 'report' ? '!text-primary' : '!text-text-muted hover:!text-text-main'}`}
                        >
                            Tổng quan
                            {activeSubTab === 'report' && <div className="!absolute !bottom-0 !left-0 !right-0 !h-0.5 !bg-primary !rounded-full"></div>}
                        </button>
                        <button
                            onClick={() => setActiveSubTab('config')}
                            className={`!pb-3 !text-sm !font-black !transition-all !relative ${activeSubTab === 'config' ? '!text-primary' : '!text-text-muted hover:!text-text-main'}`}
                        >
                            Cấu hình học phí
                            {activeSubTab === 'config' && <div className="!absolute !bottom-0 !left-0 !right-0 !h-0.5 !bg-primary !rounded-full"></div>}
                        </button>
                    </div>
                </div>

                {/* Transactions Alert Badge */}
                <button
                    onClick={() => navigate('/tuition/transactions')}
                    className={`!flex !items-center !gap-3 !px-5 !py-3.5 !rounded-2xl !shadow-sm !border !transition-all !group !relative !overflow-hidden ${pendingCount > 0
                            ? '!bg-amber-50 !border-amber-200 !text-amber-800 hover:!bg-amber-100'
                            : '!bg-blue-50 !border-blue-200 !text-blue-800 hover:!bg-blue-100'
                        }`}
                >
                    {/* Icon container */}
                    <div className="!relative !shrink-0">
                        {pendingCount > 0 && (
                            <div className="!absolute !inset-0 !rounded-full !bg-amber-400 !animate-ping !opacity-30"></div>
                        )}
                        <div className={`!w-9 !h-9 !rounded-full !border !flex !items-center !justify-center !relative ${pendingCount > 0
                                ? '!bg-amber-100 !border-amber-300'
                                : '!bg-blue-100 !border-blue-300'
                            }`}>
                            <Icon
                                icon={pendingCount > 0 ? "solar:bell-bing-bold-duotone" : "solar:history-bold-duotone"}
                                className={pendingCount > 0 ? "!text-amber-600 !text-xl" : "!text-blue-600 !text-xl"}
                            />
                        </div>
                    </div>
                    <div className="!text-left">
                        <p className={`!text-xs !font-black !uppercase !tracking-wider ${pendingCount > 0 ? '!text-amber-600' : '!text-blue-600'}`}>
                            {pendingCount > 0 ? 'Chờ duyệt' : 'Giao dịch'}
                        </p>
                        <p className={`!text-base !font-black !leading-tight ${pendingCount > 0 ? '!text-amber-900' : '!text-blue-900'}`}>
                            {pendingCount > 0
                                ? `${pendingCount} giao dịch đang chờ xác nhận`
                                : 'Lịch sử các giao dịch'
                            }
                        </p>
                    </div>
                    <Icon
                        icon="solar:alt-arrow-right-bold"
                        className={`${pendingCount > 0 ? '!text-amber-500' : '!text-blue-500'} !text-lg !ml-1 group-hover:!translate-x-1 !transition-transform`}
                    />
                </button>
            </div>

            {/* Analytics Context (Only visible when activeSubTab === 'report') */}
            {activeSubTab === 'report' && (
                <>
                    {/* Filter Bar */}
                    <div className="!flex !flex-col sm:!flex-row !items-center !justify-between !gap-4 !mb-2">
                        <div className="!flex !items-center !gap-2 !bg-white !px-4 !py-3 !rounded-2xl !border !border-border !shadow-sm">
                            <Icon icon="solar:calendar-bold-duotone" className="!text-primary !text-lg" />
                            <span className="!text-sm !font-bold !text-text-muted">Kỳ thu:</span>
                            <select
                                value={selectedMonth}
                                onChange={e => setSelectedMonth(Number(e.target.value))}
                                className="!bg-transparent !border-none !text-sm !font-black !text-text-main focus:!outline-none"
                            >
                                {months.map(m => <option key={m} value={m}>Tháng {m}</option>)}
                            </select>
                            <span className="!text-text-muted font-black">/</span>
                            <select
                                value={selectedYear}
                                onChange={e => setSelectedYear(Number(e.target.value))}
                                className="!bg-transparent !border-none !text-sm !font-black !text-text-main focus:!outline-none"
                            >
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Top KPIs */}
                    <div className="!grid !grid-cols-1 md:!grid-cols-3 !gap-6">
                        <div className="!bg-white !p-6 !rounded-[1rem] !shadow-[0_2px_10px_rgba(0,0,0,0.04)] !border !border-border !flex !items-start !gap-4">
                            <div className="!w-12 !h-12 !rounded-2xl !bg-emerald-50 !flex !items-center !justify-center !text-emerald-500 !shrink-0">
                                <Icon icon="solar:cash-out-bold-duotone" className="!text-3xl" />
                            </div>
                            <div>
                                <p className="!text-sm !font-black !text-text-main !mb-1">Tổng tiền</p>
                                {isLoading ? <div className="!h-8 !width-32 !bg-emerald-100 !animate-pulse !rounded-md"></div> :
                                    <h3 className="!text-2xl !font-black !text-emerald-500 !tracking-tight">{formatVND(dashboardStats.totalExpected)}</h3>
                                }
                            </div>
                        </div>

                        <div className="!bg-white !p-6 !rounded-[1rem] !shadow-[0_2px_10px_rgba(0,0,0,0.04)] !border !border-border !flex !items-start !gap-4">
                            <div className="!w-12 !h-12 !rounded-2xl !bg-blue-50 !flex !items-center !justify-center !text-blue-500 !shrink-0">
                                <Icon icon="solar:wallet-money-bold-duotone" className="!text-3xl" />
                            </div>
                            <div>
                                <p className="!text-sm !font-black !text-text-main !mb-1">Đã thanh toán</p>
                                {isLoading ? <div className="!h-8 !width-32 !bg-blue-100 !animate-pulse !rounded-md"></div> :
                                    <h3 className="!text-2xl !font-black !text-blue-500 !tracking-tight">{formatVND(dashboardStats.totalPaid)}</h3>
                                }
                            </div>
                        </div>

                        <div className="!bg-white !p-6 !rounded-[1rem] !shadow-[0_2px_10px_rgba(0,0,0,0.04)] !border !border-border !flex !items-start !gap-4">
                            <div className="!w-12 !h-12 !rounded-2xl !bg-red-50 !flex !items-center !justify-center !text-red-500 !shrink-0">
                                <Icon icon="solar:danger-triangle-bold-duotone" className="!text-3xl" />
                            </div>
                            <div>
                                <p className="!text-sm !font-black !text-text-main !mb-1">Tổng nợ</p>
                                {isLoading ? <div className="!h-8 !width-32 !bg-red-100 !animate-pulse !rounded-md"></div> :
                                    <h3 className="!text-2xl !font-black !text-red-500 !tracking-tight">{formatVND(dashboardStats.totalDebt)}</h3>
                                }
                            </div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="!grid !grid-cols-1 lg:!grid-cols-2 !gap-8">
                        <div className="!bg-white !p-8 !rounded-[2.5rem] !border !border-border !shadow-sm">
                            <div className="!mb-6">
                                <h2 className="!text-xl !font-black !text-text-main !tracking-tight">Biểu đồ xu hướng doanh thu</h2>
                                <p className="!text-sm !font-bold !text-text-muted !mt-1">So sánh tăng trưởng doanh thu thực tế giữa các tháng</p>
                            </div>
                            {isLoading ? <div className="!h-[350px] !flex !items-center !justify-center text-text-muted">Đang tải biểu đồ...</div> : <RevenueTrendChart data={trendData} />}
                        </div>

                        <div className="!bg-white !p-8 !rounded-[2.5rem] !border !border-border !shadow-sm">
                            <div className="!mb-6">
                                <h2 className="!text-xl !font-black !text-text-main !tracking-tight">Tỷ trọng doanh thu</h2>
                                <p className="!text-sm !font-bold !text-text-muted !mt-1">Phân bổ nguồn thu theo từng lớp học</p>
                            </div>
                            {isLoading ? <div className="!h-[350px] !flex !items-center !justify-center text-text-muted">Đang tải biểu đồ...</div> : <RevenueDistributionChart data={distributionData} />}
                        </div>
                    </div>
                </>
            )}

            {/* Tab 1 Content: Class Table List */}
            {activeSubTab === 'report' && (
                <div className="!bg-white !rounded-[2.5rem] !border !border-border !shadow-sm !overflow-hidden">
                    <div className="!px-8 !py-6 !border-b !border-border !bg-background/20 !flex !flex-col sm:!flex-row sm:!items-center !justify-between !gap-4">
                        <div>
                            <h2 className="!text-xl !font-black !text-text-main !tracking-tight">Tỉ lệ thu học phí từng lớp</h2>
                            <p className="!text-sm !font-bold !text-text-muted !mt-1">Nhấn "Xem chi tiết" để xem danh sách học sinh và quản lý hóa đơn</p>
                        </div>

                        <div className="!flex !items-center !gap-2 !bg-white !px-4 !py-2 !rounded-xl !border !border-border !shadow-sm">
                            <Icon icon="solar:bill-list-bold-duotone" className="!text-primary" />
                            <span className="!text-xs !font-bold !text-text-muted">Hình thức:</span>
                            <select
                                value={selectedBillingMethod}
                                onChange={e => {
                                    setSelectedBillingMethod(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="!bg-transparent !border-none !text-xs !font-black !text-text-main focus:!outline-none cursor-pointer"
                            >
                                <option value="All">Tất cả</option>
                                <option value="Prepaid">Trả trước</option>
                                <option value="Postpaid">Trả sau</option>
                            </select>
                        </div>
                    </div>

                    <div className="!overflow-x-auto custom-scrollbar">
                        <table className="!w-full !text-left !border-collapse">
                            <thead>
                                <tr className="!bg-[#F8FAFC] !border-b !border-border">
                                    <th className="!px-6 !py-4 text-[11px] font-black text-text-muted uppercase tracking-widest">Lớp học</th>
                                    <th className="!px-6 !py-4 text-[11px] font-black text-text-muted uppercase tracking-widest text-center">Sĩ số</th>
                                    <th className="!px-6 !py-4 text-[11px] font-black text-text-muted uppercase tracking-widest text-center">Loại thu phí</th>
                                    <th className="!px-6 !py-4 text-[11px] font-black text-text-muted uppercase tracking-widest text-center">Đơn giá</th>
                                    <th className="!px-6 !py-4 text-[11px] font-black text-text-muted uppercase tracking-widest">Tỉ lệ thu học phí</th>
                                    <th className="!px-6 !py-4 text-[11px] font-black text-text-muted uppercase tracking-widest text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="!py-10 text-center text-text-muted font-bold">Đang tải dữ liệu...</td>
                                    </tr>
                                ) : overviewData.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="!py-16 text-center text-text-muted font-bold">Chưa có danh sách lớp</td>
                                    </tr>
                                ) : paginatedTableData.map(c => (
                                    <tr
                                        key={c.classId}
                                        className="group hover:!bg-blue-50/50 transition-colors"
                                    >
                                        <td className="!px-6 !py-4">
                                            <p className="font-black text-text-main text-sm">{c.className}</p>
                                        </td>
                                        <td className="!px-6 !py-4 text-center">
                                            <span className="font-bold text-text-main text-sm bg-background px-3 py-1 rounded-lg border border-border">
                                                {c.studentCount || 0}
                                            </span>
                                        </td>
                                        <td className="!px-6 !py-4 text-center">
                                            {c.billingMethod === 'Prepaid' ? (
                                                <span className="!px-2 !py-0.5 rounded text-[10px] font-black !bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                    Trả trước
                                                </span>
                                            ) : (
                                                <span className="!px-2 !py-0.5 rounded text-[10px] font-black !bg-purple-100 text-purple-700 border border-purple-200">
                                                    Trả sau
                                                </span>
                                            )}
                                        </td>
                                        <td className="!px-6 !py-4 text-center">
                                            {(c.tuitionFee || c.pricePerSession) ? (
                                                <span className="font-black text-text-main text-xs">{formatVND(c.tuitionFee || c.pricePerSession)} <span className="text-text-muted font-medium">/buổi</span></span>
                                            ) : (
                                                <span className="text-xs text-orange-500 font-bold">--</span>
                                            )}
                                        </td>
                                        <td className="!px-6 !py-4">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex justify-between items-center text-xs font-bold text-text-main">
                                                    <span>Đã thu {Math.round(c.collectionRate || 0)}%</span>
                                                </div>
                                                <div className="w-full sm:w-32 h-1.5 rounded-full bg-border overflow-hidden">
                                                    <div
                                                        className={`h-full ${(c.collectionRate || 0) >= 80 ? 'bg-emerald-500' : (c.collectionRate || 0) >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                        style={{ width: `${Math.round(c.collectionRate || 0)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="!px-6 !py-4 text-center">
                                            <button
                                                onClick={() => navigate(`/tuition/reports/${c.classId || c.id}`)}
                                                className="!p-2 !rounded-xl !bg-blue-50 !text-blue-600 hover:!bg-blue-600 hover:!text-white transition-all group relative border border-blue-200 hover:shadow-md active:scale-95"
                                            >
                                                <Icon icon="solar:eye-bold-duotone" className="!text-xl" />
                                                {/* Tooltip */}
                                                <div className="!absolute !bottom-full !left-1/2 !-translate-x-1/2 !mb-2 !px-3 !py-1 !bg-slate-900 !text-white !text-[10px] !font-bold !rounded-lg !opacity-0 group-hover:!opacity-100 !pointer-events-none !transition-all !whitespace-nowrap !shadow-xl !z-50">
                                                    Xem chi tiết lớp
                                                    <div className="!absolute !top-full !left-1/2 !-translate-x-1/2 !border-4 !border-transparent !border-t-slate-900"></div>
                                                </div>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="!px-8 !py-4 !border-t !border-border !bg-background/20 !flex !items-center !justify-between">
                            <span className="!text-sm !font-medium !text-text-muted">
                                Trang {currentPage} / {totalPages}
                            </span>
                            <div className="!flex !items-center !gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="!p-2 !rounded-lg !border !border-border !bg-white !text-text-main hover:!bg-background disabled:!opacity-50 disabled:!cursor-not-allowed !transition-colors"
                                >
                                    <Icon icon="solar:alt-arrow-left-line-duotone" />
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="!p-2 !rounded-lg !border !border-border !bg-white !text-text-main hover:!bg-background disabled:!opacity-50 disabled:!cursor-not-allowed !transition-colors"
                                >
                                    <Icon icon="solar:alt-arrow-right-line-duotone" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Tab 2 Content: Tuition Config List */}
            {activeSubTab === 'config' && (
                <div className="!bg-white !rounded-[2.5rem] !border !border-border !shadow-sm !overflow-hidden !animate-fade-in-up">
                    <div className="!px-8 !py-6 !border-b !border-border !bg-background/20 !flex !flex-col sm:!flex-row sm:!items-center !justify-between !gap-4">
                        <div>
                            <h2 className="!text-xl !font-black !text-text-main !tracking-tight">Cấu hình học phí</h2>
                            <p className="!text-sm !font-bold !text-text-muted !mt-1">Thiết lập đơn giá và hình thức thu phí áp dụng cho kỳ thu tới</p>
                        </div>

                        <div className="!flex !items-center !gap-2 !bg-white !px-4 !py-2 !rounded-xl !border !border-border !shadow-sm">
                            <Icon icon="solar:bill-list-bold-duotone" className="!text-primary" />
                            <span className="!text-xs !font-bold !text-text-muted">Hình thức:</span>
                            <select
                                value={selectedBillingMethod}
                                onChange={e => setSelectedBillingMethod(e.target.value)}
                                className="!bg-transparent !border-none !text-xs !font-black !text-text-main focus:!outline-none cursor-pointer"
                            >
                                <option value="All">Tất cả</option>
                                <option value="Prepaid">Trả trước</option>
                                <option value="Postpaid">Trả sau</option>
                            </select>
                        </div>
                    </div>

                    <div className="!overflow-x-auto custom-scrollbar">
                        <table className="!w-full !text-left !border-collapse">
                            <thead>
                                <tr className="!bg-[#F8FAFC] !border-b !border-border">
                                    <th className="!px-6 !py-4 text-[11px] font-black text-text-muted uppercase tracking-widest">Lớp học</th>
                                    <th className="!px-6 !py-4 text-[11px] font-black text-text-muted uppercase tracking-widest text-center">Hình thức thu</th>
                                    <th className="!px-6 !py-4 text-[11px] font-black text-text-muted uppercase tracking-widest text-center">Đơn giá học phí (VNĐ)</th>
                                    <th className="!px-6 !py-4 text-[11px] font-black text-text-muted uppercase tracking-widest text-center">Hạn nộp</th>
                                    <th className="!px-6 !py-4 text-[11px] font-black text-text-muted uppercase tracking-widest text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {isConfigLoading ? (
                                    <tr>
                                        <td colSpan={5} className="!py-10 text-center text-text-muted font-bold">Đang tải dữ liệu cấu hình...</td>
                                    </tr>
                                ) : filteredConfigData.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="!py-16 text-center text-text-muted font-bold">Không có dữ liệu lớp học phù hợp</td>
                                    </tr>
                                ) : filteredConfigData.map(c => (
                                    <ConfigRow
                                        key={c.classId}
                                        config={c}
                                        onEdit={(cfg) => {
                                            setSelectedConfig(cfg);
                                            setIsModalOpen(true);
                                        }}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <TuitionFeeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveConfig}
                editData={selectedConfig}
                classes={configData}
            />
        </div>
    );
};

export default TuitionManagementPage;
