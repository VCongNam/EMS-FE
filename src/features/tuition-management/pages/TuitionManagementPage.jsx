import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import RevenueTrendChart from '../components/charts/RevenueTrendChart';
import RevenueDistributionChart from '../components/charts/RevenueDistributionChart';
import { tuitionService } from '../api/tuitionService';
import useAuthStore from '../../../store/authStore';
import TuitionFeeModal from '../components/TuitionFeeModal';

// ─── Constants ────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 10;

// ─── Helper ───────────────────────────────────────────────────────────────────
const formatVND = (amount) => amount?.toLocaleString('vi-VN') + ' ₫';

const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const TuitionManagementPage = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    // Navigation state
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'operations', 'transactions', 'settings'
    const [activeTransactionSubTab, setActiveTransactionSubTab] = useState('pending'); // 'pending', 'history'

    // Filter state
    const currentDate = new Date();
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
    const [selectedBillingMethod, setSelectedBillingMethod] = useState('All');
    const [opStatusFilter, setOpStatusFilter] = useState('All'); // 'All', 'NeedToHandle', 'Completed'
    const [settingsMethodFilter, setSettingsMethodFilter] = useState('All');
    const [settingsStatusFilter, setSettingsStatusFilter] = useState('All');

    // API Data
    const [overviewData, setOverviewData] = useState([]);
    const [dashboardStats, setDashboardStats] = useState({
        totalExpected: 0,
        totalPaid: 0,
        totalDebt: 0,
        dailyTrend: [],
        proportionByClass: []
    });
    const [transactions, setTransactions] = useState([]);
    const [configData, setConfigData] = useState([]);
    const [reminders, setReminders] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    
    // UI State for Transactions Review
    const [selectedTx, setSelectedTx] = useState(null);
    const [reviewNote, setReviewNote] = useState('');
    const [isReviewing, setIsReviewing] = useState(false);

    // UI State for Settings
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [selectedConfig, setSelectedConfig] = useState(null);
    
    // Pagination state per tab
    const [opPage, setOpPage] = useState(1);
    const [txPage, setTxPage] = useState(1);
    const [configPage, setConfigPage] = useState(1);
    
    // Total counts state (returned by API)
    const [totalOps, setTotalOps] = useState(0);
    const [totalTx, setTotalTx] = useState(0);
    const [totalConfigs, setTotalConfigs] = useState(0);

    const fetchData = async () => {
        if (!user?.token) return;
        setIsLoading(true);
        try {
            if (activeTab === 'dashboard') {
                const [resKpi, resReminders] = await Promise.all([
                    tuitionService.getDashboardOverview(selectedMonth, selectedYear, user.token),
                    tuitionService.getReminders(selectedMonth, selectedYear, user.token)
                ]);
                if (resKpi.ok) {
                    const d = await resKpi.json();
                    setDashboardStats({
                        totalExpected: d.totalExpected || 0,
                        totalPaid: d.totalPaid || 0,
                        totalDebt: d.totalDebt || 0,
                        dailyTrend: d.dailyTrend || [],
                        proportionByClass: d.proportionByClass || []
                    });
                }
                if (resReminders.ok) setReminders(await resReminders.json() || []);
            } else if (activeTab === 'operations') {
                const res = await tuitionService.getClassesOverview(selectedMonth, selectedYear, opPage, ITEMS_PER_PAGE, user.token);
                if (res.ok) {
                    const data = await res.json();
                    if (data.items) {
                        setOverviewData(data.items);
                        setTotalOps(data.totalCount || data.total || data.items.length);
                    } else {
                        setOverviewData(data || []);
                        setTotalOps(data.length || 0);
                    }
                }
            } else if (activeTab === 'transactions') {
                const res = await tuitionService.getFullTransactionHistory(txPage, ITEMS_PER_PAGE, user.token);
                if (res.ok) {
                    const data = await res.json();
                    if (data.items) {
                        setTransactions(data.items);
                        setTotalTx(data.totalCount || data.total || data.items.length);
                    } else {
                        setTransactions(data || []);
                        setTotalTx(data.length || 0);
                    }
                }
            } else if (activeTab === 'settings') {
                const res = await tuitionService.getTuitionConfigs(configPage, ITEMS_PER_PAGE, user.token);
                if (res.ok) {
                    const data = await res.json();
                    if (data.items) {
                        setConfigData(data.items);
                        setTotalConfigs(data.totalCount || data.total || data.items.length);
                    } else {
                        setConfigData(data || []);
                        setTotalConfigs(data.length || 0);
                    }
                }
            }
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Không thể tải dữ liệu. Vui lòng kiểm tra kết nối!');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // Reset local states when tab changes
        if (activeTab !== 'transactions') {
            setSelectedTx(null);
            setReviewNote('');
        }
    }, [activeTab, selectedMonth, selectedYear, user?.token, opPage, txPage, configPage]);

    // Reset pages when filters change
    useEffect(() => { setOpPage(1); }, [selectedMonth, selectedYear, selectedBillingMethod, opStatusFilter]);
    useEffect(() => { setTxPage(1); }, [activeTransactionSubTab]);
    useEffect(() => { setConfigPage(1); }, [settingsMethodFilter, settingsStatusFilter]);
    useEffect(() => {
        setOpPage(1);
        setTxPage(1);
        setConfigPage(1);
    }, [activeTab]);

    // Handle Config Update
    const handleSaveConfig = async (data) => {
        if (!user?.token) return;
        try {
            const res = await tuitionService.updateTuitionFee(data.classId, {
                tuitionFee: Number(data.tuitionFee),
                billingMethod: data.billingMethod,
                paymentDeadlineDays: Number(data.paymentDeadlineDays)
            }, user.token);

            if (res.ok) {
                toast.success(`Cập nhật cấu hình lớp ${data.className || ''} thành công!`);
                setIsConfigModalOpen(false);
                fetchData();
            } else {
                toast.error('Lỗi khi cập nhật cấu hình!');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại!');
        }
    };

    // Handle Transaction Review
    const handleReviewAction = async (isApproved) => {
        if (!selectedTx || !user?.token) return;
        if (!isApproved && !reviewNote.trim()) {
            toast.warning("Vui lòng nhập ghi chú lý do từ chối!");
            return;
        }
        
        setIsReviewing(true);
        try {
            const payload = { isApproved, note: reviewNote.trim() || null };
            const res = await tuitionService.reviewTransaction(selectedTx.transactionId, payload, user.token);
            if (res.ok) {
                toast.success(isApproved ? "Đã duyệt giao dịch thành công!" : "Đã từ chối giao dịch!");
                setSelectedTx(null);
                setReviewNote('');
                fetchData(); // Reload list
            } else {
                toast.error("Xử lý thất bại, vui lòng thử lại.");
            }
        } catch (error) {
            toast.error("Đã xảy ra lỗi.");
        } finally {
            setIsReviewing(false);
        }
    };

    // Handle Invoice Generation (Operations)
    const handleGenerateInvoices = async (cls) => {
        if (!user?.token) return;
        // Check if class is Postpaid
        if (cls.billingMethod === 'Prepaid') {
            // Reconcile Prepaid
            try {
                const res = await tuitionService.reconcilePrepaidClass(cls.classId, selectedMonth, selectedYear, user.token);
                if (res.ok) {
                    toast.success(`Đã chốt sổ và tạo bill đối soát lớp ${cls.className}`);
                    fetchData();
                } else {
                    toast.error("Không thể chốt sổ lớp Trả trước.");
                }
            } catch (error) {
                toast.error("Lỗi khi chốt sổ.");
            }
            return;
        }

        // For Postpaid, we navigate to the detail page to select students or generate all
        navigate(`/tuition/reports/${cls.classId}`);
    };

    // Derived Logic
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const years = [currentDate.getFullYear() - 1, currentDate.getFullYear(), currentDate.getFullYear() + 1];

    const filteredOperations = useMemo(() => {
        return overviewData.filter(cls => {
            const matchesMethod = selectedBillingMethod === 'All' || cls.billingMethod === selectedBillingMethod;
            if (opStatusFilter === 'All') return matchesMethod;
            
            // logic: ISSUED means completed for this period
            if (opStatusFilter === 'Completed') {
                return matchesMethod && cls.conditionCode === 'ISSUED';
            } else {
                return matchesMethod && cls.conditionCode !== 'ISSUED';
            }
        });
    }, [overviewData, selectedBillingMethod, opStatusFilter]);

    const filteredTransactions = useMemo(() => {
        return transactions.filter(tx => {
            const s = tx.status?.toLowerCase();
            if (activeTransactionSubTab === 'pending') return s === 'pending';
            if (activeTransactionSubTab === 'completed') return s === 'completed' || s === 'successful';
            if (activeTransactionSubTab === 'rejected') return s === 'rejected' || s === 'failed';
            return false;
        });
    }, [transactions, activeTransactionSubTab]);

    const filteredSettings = useMemo(() => {
        return configData.filter(cls => {
            const matchesMethod = settingsMethodFilter === 'All' || cls.billingMethod === settingsMethodFilter;
            const isConfigured = (cls.tuitionFee > 0 || cls.pricePerSession > 0);
            const matchesStatus = settingsStatusFilter === 'All' 
                ? true 
                : settingsStatusFilter === 'Configured' ? isConfigured : !isConfigured;
            return matchesMethod && matchesStatus;
        });
    }, [configData, settingsMethodFilter, settingsStatusFilter]);

    const totalOpsPages = Math.ceil(totalOps / ITEMS_PER_PAGE);
    const paginatedOperations = filteredOperations;

    const totalTxPages = Math.ceil(totalTx / ITEMS_PER_PAGE);
    const paginatedTransactions = filteredTransactions;

    const totalConfigPages = Math.ceil(totalConfigs / ITEMS_PER_PAGE);
    const paginatedSettings = filteredSettings;

    // ─── Renderers ────────────────────────────────────────────────────────────

    const renderDashboard = () => (
        <div className="!space-y-8 !animate-fade-in-up">
            {/* KPI Cards */}
            <div className="!grid !grid-cols-1 md:!grid-cols-3 !gap-6">
                <div className="!bg-white !p-8 !rounded-[2.5rem] !shadow-sm !border !border-border !flex !items-start !gap-6">
                    <div className="!w-16 !h-16 !rounded-3xl !bg-blue-50 !flex !items-center !justify-center !text-blue-500 !shrink-0">
                        <Icon icon="solar:cash-out-bold-duotone" className="!text-4xl" />
                    </div>
                    <div>
                        <p className="!text-sm !font-black !text-text-muted !uppercase !tracking-widest !mb-1">Tổng dự kiến thu</p>
                        <h3 className="!text-3xl !font-black !text-text-main !tracking-tight">{formatVND(dashboardStats.totalExpected)}</h3>
                        <p className="!text-xs !font-bold !text-text-muted !mt-2">Kỳ học tháng {selectedMonth}/{selectedYear}</p>
                    </div>
                </div>

                <div className="!bg-white !p-8 !rounded-[2.5rem] !shadow-sm !border !border-border !flex !items-start !gap-6">
                    <div className="!w-16 !h-16 !rounded-3xl !bg-emerald-50 !flex !items-center !justify-center !text-emerald-500 !shrink-0">
                        <Icon icon="solar:wallet-money-bold-duotone" className="!text-4xl" />
                    </div>
                    <div>
                        <p className="!text-sm !font-black !text-text-muted !uppercase !tracking-widest !mb-1">Đã thanh toán</p>
                        <h3 className="!text-3xl !font-black !text-emerald-500 !tracking-tight">{formatVND(dashboardStats.totalPaid)}</h3>
                        <div className="!mt-2 !flex !items-center !gap-2">
                             <div className="!flex-1 !h-1.5 !bg-emerald-50 !rounded-full !overflow-hidden">
                                <div className="!h-full !bg-emerald-500" style={{ width: `${dashboardStats.totalExpected ? Math.round((dashboardStats.totalPaid/dashboardStats.totalExpected)*100) : 0}%` }}></div>
                            </div>
                            <span className="!text-xs !font-black !text-emerald-600">{dashboardStats.totalExpected ? Math.round((dashboardStats.totalPaid/dashboardStats.totalExpected)*100) : 0}%</span>
                        </div>
                    </div>
                </div>

                <div className="!bg-white !p-8 !rounded-[2.5rem] !shadow-sm !border !border-border !flex !items-start !gap-6">
                    <div className="!w-16 !h-16 !rounded-3xl !bg-red-50 !flex !items-center !justify-center !text-red-500 !shrink-0">
                        <Icon icon="solar:danger-triangle-bold-duotone" className="!text-4xl" />
                    </div>
                    <div>
                        <p className="!text-sm !font-black !text-text-muted !uppercase !tracking-widest !mb-1">Đang còn nợ</p>
                        <h3 className="!text-3xl !font-black !text-red-500 !tracking-tight">{formatVND(dashboardStats.totalDebt)}</h3>
                        <p className="!text-xs !font-bold !text-text-muted !mt-2">Cần gửi nhắc nợ cho phụ huynh</p>
                    </div>
                </div>
            </div>

            {/* Task Reminders - New Section */}
            {reminders.length > 0 && (
                <div className="!bg-[#FFF8F8] !border !border-red-100 !rounded-[2.5rem] !p-8 !flex !flex-col !gap-6">
                    <div className="!flex !items-center !justify-between">
                        <div className="!flex !items-center !gap-3">
                            <div className="!w-10 !h-10 !rounded-2xl !bg-red-500 !flex !items-center !justify-center !text-white !animate-pulse">
                                <Icon icon="solar:bell-bing-bold" className="!text-xl" />
                            </div>
                            <div>
                                <h3 className="!text-lg !font-black !text-red-600">Nhiệm vụ trọng tâm</h3>
                                <p className="!text-xs !font-bold !text-red-400">Bạn có {reminders.length} lớp cần xử lý ngay</p>
                            </div>
                        </div>
                        <button onClick={() => setActiveTab('operations')} className="!text-xs !font-black !text-red-500 hover:!underline">Xử lý ngay &rarr;</button>
                    </div>

                    <div className="!grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 !gap-4">
                        {reminders.map((rem, idx) => (
                            <div key={idx} className="!bg-white !p-4 !rounded-2xl !border !border-red-50 !shadow-sm !flex !gap-4 !items-start hover:!border-red-200 !transition-all">
                                <div className={`!w-8 !h-8 !rounded-xl !shrink-0 !flex !items-center !justify-center ${rem.priority === 'High' ? '!bg-red-50 !text-red-500' : '!bg-amber-50 !text-amber-500'}`}>
                                    <Icon icon={rem.priority === 'High' ? "solar:danger-bold" : "solar:info-circle-bold"} />
                                </div>
                                <div className="!flex-1">
                                    <div className="!flex !justify-between !items-start">
                                        <p className="!text-xs !font-black !text-text-main !line-clamp-1">{rem.className}</p>
                                        <span className="!text-[9px] !font-black !bg-slate-100 !text-slate-500 !px-1.5 !rounded-md">{rem.targetPeriod}</span>
                                    </div>
                                    <p className="!text-[11px] !font-bold !text-text-muted !mt-1 !line-clamp-2">{rem.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Charts Section */}
            <div className="!grid !grid-cols-1 lg:!grid-cols-2 !gap-8">
                <div className="!bg-white !p-8 !rounded-[2.5rem] !border !border-border !shadow-sm">
                    <div className="!mb-6">
                        <h2 className="!text-xl !font-black !text-text-main !tracking-tight">Biểu đồ xu hướng doanh thu</h2>
                        <p className="!text-sm !font-bold !text-text-muted !mt-1">So sánh tăng trưởng doanh thu thực tế giữa các tháng</p>
                    </div>
                    <RevenueTrendChart data={dashboardStats.dailyTrend.map(item => ({ name: `Ng ${item.day}`, total: item.receivedAmount }))} />
                </div>

                <div className="!bg-white !p-8 !rounded-[2.5rem] !border !border-border !shadow-sm">
                    <div className="!mb-6">
                        <h2 className="!text-xl !font-black !text-text-main !tracking-tight">Tỷ trọng doanh thu</h2>
                        <p className="!text-sm !font-bold !text-text-muted !mt-1">Phân bổ nguồn thu theo từng lớp học</p>
                    </div>
                    <RevenueDistributionChart data={dashboardStats.proportionByClass.map(item => ({ name: item.className || item.name, value: item.proportion ?? item.revenue ?? 0 }))} />
                </div>
            </div>
        </div>
    );

    const renderOperations = () => (
        <div className="!space-y-6 !animate-fade-in-up">
            {/* Context Filter Bar */}
            <div className="!flex !flex-col md:!flex-row !items-center !justify-between !gap-4 !bg-white !p-5 !rounded-[2rem] !border !border-border !shadow-sm">
                <div className="!flex !items-center !gap-6">
                    <div className="!flex !items-center !gap-1.5 !bg-slate-100 !p-1 !rounded-xl">
                        <button onClick={() => {setOpStatusFilter('All'); setCurrentPage(1);}} className={`!px-4 !py-1.5 !rounded-lg !text-xs !font-black !transition-colors ${opStatusFilter === 'All' ? '!bg-white !text-blue-500 !shadow-sm' : '!text-text-muted hover:!text-text-main'}`}>
                            Tất cả
                        </button>
                        <button onClick={() => {setOpStatusFilter('NeedToHandle'); setCurrentPage(1);}} className={`!px-4 !py-1.5 !rounded-lg !text-xs !font-black !transition-colors ${opStatusFilter === 'NeedToHandle' ? '!bg-white !text-primary !shadow-sm' : '!text-text-muted hover:!text-text-main'}`}>
                            Cần xử lý
                        </button>
                        <button onClick={() => {setOpStatusFilter('Completed'); setCurrentPage(1);}} className={`!px-4 !py-1.5 !rounded-lg !text-xs !font-black !transition-colors ${opStatusFilter === 'Completed' ? '!bg-white !text-emerald-500 !shadow-sm' : '!text-text-muted hover:!text-text-main'}`}>
                            Đã hoàn tất
                        </button>
                    </div>
                </div>

                <div className="!flex !items-center !gap-2">
                    <span className="!text-xs !font-black !text-text-muted !uppercase !mr-1">Loại hình:</span>
                    <div className="!flex !items-center !gap-1.5">
                        {['All', 'Prepaid', 'Postpaid'].map(m => (
                            <button key={m} onClick={() => setSelectedBillingMethod(m)} className={`!px-4 !py-2 !rounded-xl !text-xs !font-black !border !transition-all ${selectedBillingMethod === m ? '!bg-primary !text-white !border-primary' : '!bg-white !text-text-muted !border-border hover:!border-primary/30'}`}>
                                {m === 'All' ? 'Tất cả' : m === 'Prepaid' ? 'Thu trước' : 'Thu sau'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Operations Table */}
            <div className="!bg-white !rounded-[2.5rem] !border !border-border !shadow-sm !overflow-hidden">
                <div className="!overflow-x-auto custom-scrollbar">
                    <table className="!w-full !text-left !border-collapse">
                        {/* Table headers and body... */}
                        <thead>
                            <tr className="!bg-[#F8FAFC] !border-b !border-border">
                                <th className="!px-6 !py-5 text-[11px] font-black text-text-muted uppercase tracking-widest">Tên Lớp & Hình thức</th>
                                <th className="!px-6 !py-5 text-[11px] font-black text-text-muted uppercase tracking-widest text-center">Sĩ số & Đơn giá</th>
                                <th className="!px-6 !py-5 text-[11px] font-black text-text-muted uppercase tracking-widest text-center">Điều kiện phát hành</th>
                                <th className="!px-6 !py-5 text-[11px] font-black text-text-muted uppercase tracking-widest">Tiến độ thu</th>
                                <th className="!px-6 !py-5 text-[11px] font-black text-text-muted uppercase tracking-widest text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                <tr><td colSpan={5} className="!py-20 text-center text-text-muted font-bold">Đang tải danh sách nhiệm vụ...</td></tr>
                            ) : filteredOperations.length === 0 ? (
                                <tr><td colSpan={5} className="!py-24 text-center">
                                    <Icon icon="solar:clipboard-check-bold-duotone" className="!text-6xl !text-slate-200 !mx-auto !mb-3" />
                                    <p className="!text-text-muted !font-black">Tuyệt vời! Không còn lớp nào cần xử lý trong mục này.</p>
                                </td></tr>
                            ) : paginatedOperations.map(c => {
                                const isPrepaid = c.billingMethod === 'Prepaid';
                                const conditionMet = isPrepaid ? (c.collectionRate > 0) : true;
                                const conditionText = isPrepaid 
                                    ? (conditionMet ? "Đã chốt sổ vắng tháng trước" : "Chưa chốt sổ vắng")
                                    : (c.studentCount > 0 ? "Đã điểm danh đầy đủ" : "Chưa đủ buổi điểm danh");

                                return (
                                    <tr key={c.classId} className="group hover:!bg-blue-50/30 transition-colors">
                                        <td className="!px-6 !py-4">
                                            <p className="font-black text-text-main text-sm !mb-1">{c.className}</p>
                                            <div className="!flex !items-center !gap-2">
                                                <span className={`!px-2 !py-0.5 rounded text-[9px] font-black uppercase ${isPrepaid ? '!bg-blue-100 !text-blue-700 !border !border-blue-200' : '!bg-purple-100 !text-purple-700 !border !border-purple-200'}`}>
                                                    {isPrepaid ? 'Thu trước' : 'Thu sau'}
                                                </span>
                                                <span className="!text-[10px] !font-bold !text-text-muted">
                                                    Dự kiến: {isPrepaid 
                                                        ? `Tháng ${selectedMonth === 12 ? 1 : selectedMonth + 1}/${selectedMonth === 12 ? selectedYear + 1 : selectedYear}`
                                                        : `Tháng ${selectedMonth === 1 ? 12 : selectedMonth - 1}/${selectedMonth === 1 ? selectedYear - 1 : selectedYear}`}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="!px-6 !py-4 text-center">
                                            <div className="!flex !flex-col !items-center">
                                                <span className="!text-xs !font-bold !text-text-main">{c.studentCount} học sinh</span>
                                                <span className="!text-[10px] !font-black !text-emerald-600">{formatVND(c.tuitionFee || c.pricePerSession)}</span>
                                            </div>
                                        </td>
                                        <td className="!px-6 !py-4 text-center">
                                            <div className="!flex !flex-col !items-center !gap-1">
                                                <div className={`!flex !items-center !gap-1.5 !px-3 !py-1 !rounded-full !text-[10px] !font-black 
                                                    ${c.conditionCode === 'READY' ? '!bg-emerald-50 !text-emerald-600 !border !border-emerald-100' : 
                                                      c.conditionCode === 'ISSUED' ? '!bg-blue-50 !text-blue-600 !border !border-blue-100' :
                                                      '!bg-amber-50 !text-amber-600 !border !border-amber-100'}`}>
                                                    <Icon icon={c.conditionCode === 'READY' ? "solar:check-circle-bold" : 
                                                               c.conditionCode === 'ISSUED' ? "solar:document-bold" : "solar:danger-triangle-bold"} />
                                                    {c.statusMessage}
                                                </div>
                                                {!c.isIssuable && c.conditionCode !== 'ISSUED' && <p className="!text-[9px] !text-red-400 !font-bold">Khóa phát hành</p>}
                                            </div>
                                        </td>
                                        <td className="!px-6 !py-4">
                                            <div className="!w-32 !space-y-1.5">
                                                <div className="!flex !justify-between !items-center !text-[10px] !font-black">
                                                    <span className="!text-text-muted">Đã thu {Math.round(c.collectionRate || 0)}%</span>
                                                </div>
                                                <div className="!w-full !h-1.5 !bg-slate-100 !rounded-full !overflow-hidden">
                                                    <div className={`!h-full !transition-all !duration-1000 ${c.collectionRate >= 80 ? 'bg-emerald-500' : c.collectionRate >= 50 ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${Math.round(c.collectionRate || 0)}%` }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="!px-6 !py-4 text-center">
                                            <div className="!flex !items-center !justify-center !gap-2">
                                                <button onClick={() => handleGenerateInvoices(c)} 
                                                    disabled={!c.isIssuable}
                                                    className={`!px-4 !py-2 !rounded-xl !text-xs !font-black !transition-all !flex !items-center !gap-2 
                                                        ${c.isIssuable ? '!bg-primary !text-white hover:!shadow-lg hover:!shadow-primary/20' : '!bg-slate-100 !text-slate-400 !cursor-not-allowed'}`}>
                                                    <Icon icon={isPrepaid ? "solar:reorder-bold" : "solar:document-add-bold"} />
                                                    {isPrepaid ? 'Chốt sổ' : 'Tạo hóa đơn'}
                                                </button>
                                                <button onClick={() => navigate(`/tuition/reports/${c.classId}`)} className="!p-2 !rounded-xl !bg-slate-100 !text-slate-500 hover:!bg-primary hover:!text-white transition-all">
                                                    <Icon icon="solar:eye-bold-duotone" className="!text-lg" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalOpsPages > 1 && (
                    <div className="!flex !items-center !justify-between !p-6 !border-t !border-border !bg-[#F8FAFC]">
                        <span className="!text-sm !font-bold !text-text-muted">Trang {opPage} / {totalOpsPages}</span>
                        <div className="!flex !items-center !gap-2">
                            <button onClick={() => setOpPage(p => Math.max(1, p - 1))} disabled={opPage === 1} className="!w-9 !h-9 !rounded-xl !bg-white !border !border-border !flex !items-center !justify-center hover:!border-primary disabled:!opacity-30 !transition-all"><Icon icon="solar:round-alt-arrow-left-bold" /></button>
                            <button onClick={() => setOpPage(p => Math.min(totalOpsPages, p + 1))} disabled={opPage === totalOpsPages} className="!w-9 !h-9 !rounded-xl !bg-white !border !border-border !flex !items-center !justify-center hover:!border-primary disabled:!opacity-30 !transition-all"><Icon icon="solar:round-alt-arrow-right-bold" /></button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderTransactions = () => (
        <div className="!flex !flex-col lg:!flex-row !gap-6 !animate-fade-in-up !min-h-[600px]">
            {/* Selection List Side */}
            <div className="!w-full lg:!w-1/3 !bg-white !rounded-[2.5rem] !border !border-border !shadow-sm !flex !flex-col !overflow-hidden">
                <div className="!p-5 !bg-slate-50 !border-b !border-border">
                    <div className="!flex !items-center !gap-1.5 !bg-slate-100 !p-1 !rounded-xl">
                        <button onClick={() => setActiveTransactionSubTab('pending')} className={`!flex-1 !py-2 !rounded-lg !text-[11px] !font-black !transition-all ${activeTransactionSubTab === 'pending' ? '!bg-white !text-amber-500 !shadow-sm' : '!text-text-muted hover:!text-text-main'}`}>
                            Chờ duyệt ({transactions.filter(t => t.status?.toLowerCase() === 'pending').length})
                        </button>
                        <button onClick={() => setActiveTransactionSubTab('completed')} className={`!flex-1 !py-2 !rounded-lg !text-[11px] !font-black !transition-all ${activeTransactionSubTab === 'completed' ? '!bg-white !text-emerald-500 !shadow-sm' : '!text-text-muted hover:!text-text-main'}`}>
                            Thành công
                        </button>
                        <button onClick={() => setActiveTransactionSubTab('rejected')} className={`!flex-1 !py-2 !rounded-lg !text-[11px] !font-black !transition-all ${activeTransactionSubTab === 'rejected' ? '!bg-white !text-red-500 !shadow-sm' : '!text-text-muted hover:!text-text-main'}`}>
                            Bị hủy
                        </button>
                    </div>
                </div>

                <div className="!flex-1 !overflow-y-auto custom-scrollbar !divide-y !divide-border">
                    {filteredTransactions.length === 0 ? (
                        <div className="!py-20 !text-center !opacity-40">
                             <Icon icon="solar:mailbox-bold-duotone" className="!text-5xl !mx-auto !mb-2" />
                             <p className="!font-bold !text-xs">Không có giao dịch</p>
                        </div>
                    ) : (
                        paginatedTransactions.map(tx => {
                            const isSelected = selectedTx?.transactionId === tx.transactionId;
                            return (
                                <div 
                                    key={tx.transactionId} 
                                    onClick={() => { setSelectedTx(tx); setReviewNote(''); }}
                                    className={`!p-4 !cursor-pointer !transition-all hover:!bg-slate-50 ${isSelected ? '!bg-blue-50 !border-l-4 !border-l-blue-500' : '!border-l-4 !border-l-transparent'}`}
                                >
                                    <div className="!flex !justify-between !mb-1">
                                        <p className="!text-sm !font-black !text-text-main">{tx.studentName}</p>
                                        <span className="!text-[10px] !font-bold !text-text-muted">{formatDate(tx.paidDate)}</span>
                                    </div>
                                    <div className="!flex !justify-between !items-end">
                                        <span className="!text-[10px] !font-bold !text-text-muted !uppercase">{tx.className}</span>
                                        <span className="!text-sm !font-black !text-emerald-600">{formatVND(tx.amountPaid)}</span>
                                    </div>
                                    <div className={`!mt-1 !text-[9px] !font-black !px-2 !py-0.5 !rounded !inline-block ${tx.status?.toLowerCase() === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                                        {tx.status}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Pagination Controls */}
                {totalTxPages > 1 && (
                    <div className="!p-4 !border-t !border-border !bg-slate-50 !flex !items-center !justify-between !shrink-0">
                        <span className="!text-[10px] !font-bold !text-text-muted">Trang {txPage} / {totalTxPages}</span>
                        <div className="!flex !items-center !gap-1">
                            <button onClick={() => setTxPage(p => Math.max(1, p - 1))} disabled={txPage === 1} className="!w-7 !h-7 !rounded-lg !bg-white !border !border-border !flex !items-center !justify-center disabled:!opacity-30"><Icon icon="solar:alt-arrow-left-bold" className="!text-xs" /></button>
                            <button onClick={() => setTxPage(p => Math.min(totalTxPages, p + 1))} disabled={txPage === totalTxPages} className="!w-7 !h-7 !rounded-lg !bg-white !border !border-border !flex !items-center !justify-center disabled:!opacity-30"><Icon icon="solar:alt-arrow-right-bold" className="!text-xs" /></button>
                        </div>
                    </div>
                )}
            </div>

            {/* Verification Detail Side */}
            <div className="!w-full lg:!w-2/3 !bg-white !rounded-[2.5rem] !border !border-border !shadow-sm !overflow-hidden !flex !flex-col">
                {!selectedTx ? (
                    <div className="!flex-1 !flex !flex-col !items-center !justify-center !bg-slate-50/50 !text-text-muted">
                        <Icon icon="solar:mouse-circle-bold-duotone" className="!text-6xl !opacity-20 !mb-4" />
                        <p className="!font-black !text-sm">Chọn một giao dịch để bắt đầu đối soát</p>
                    </div>
                ) : (
                    <div className="!flex-1 !flex !flex-col md:!flex-row">
                        {/* Evidence */}
                        <div className="!w-full md:!w-1/2 !bg-zinc-100 !flex !flex-col !border-r !border-border">
                             <div className="!p-3 !bg-zinc-200/50 !text-[10px] !font-black !text-zinc-600 !uppercase">Ảnh minh chứng</div>
                             <div className="!flex-1 !flex !items-center !justify-center !p-4">
                                {selectedTx.proofImageUrl ? (
                                    <img src={selectedTx.proofImageUrl} alt="UNC" className="!max-w-full !max-h-[400px] !object-contain !rounded-lg !shadow-lg" />
                                ) : (
                                    <div className="!text-center !text-zinc-400">
                                        <Icon icon="solar:image-broken-bold-duotone" className="!text-5xl !mb-2" />
                                        <p className="!text-xs !font-bold">Không có ảnh</p>
                                    </div>
                                )}
                             </div>
                        </div>

                        {/* Review Form */}
                        <div className="!w-full md:!w-1/2 !flex !flex-col !bg-white !p-6 !space-y-6">
                            <div className="!space-y-4">
                                <h3 className="!text-lg !font-black !text-text-main">Thông tin xác minh</h3>
                                <div className="!space-y-2">
                                    <div className="!flex !justify-between !text-xs">
                                        <span className="!text-text-muted">Nội dung:</span>
                                        <span className="!text-text-main !font-bold">{selectedTx.invoiceDescription || 'Học phí'}</span>
                                    </div>
                                    <div className="!flex !justify-between !text-xs">
                                        <span className="!text-text-muted">Phương thức:</span>
                                        <span className="!text-text-main !font-bold">{selectedTx.paymentMethod}</span>
                                    </div>
                                    <div className={`!p-4 !rounded-xl !border !text-center ${selectedTx.status?.toLowerCase() === 'pending' ? '!bg-amber-50 !border-amber-100' : '!bg-emerald-50 !border-emerald-100'}`}>
                                        <p className="!text-[10px] !font-black !text-text-muted !uppercase !mb-1">Số tiền thực nộp</p>
                                        <p className="!text-2xl !font-black !text-text-main">{formatVND(selectedTx.amountPaid)}</p>
                                    </div>
                                </div>
                            </div>

                            {selectedTx.status?.toLowerCase() === 'pending' && (
                                <>
                                    <div className="!space-y-2">
                                        <label className="!text-[10px] !font-black !text-text-muted !uppercase">Ghi chú (Bắt buộc nếu hủy)</label>
                                        <textarea 
                                            value={reviewNote}
                                            onChange={(e) => setReviewNote(e.target.value)}
                                            className="!w-full !p-3 !bg-slate-50 !border !border-border !rounded-xl !text-sm focus:!bg-white focus:!outline-none !h-20 !resize-none"
                                            placeholder="Nội dung ghi chú..."
                                        />
                                    </div>

                                    <div className="!flex !gap-3">
                                        <button 
                                            disabled={isReviewing}
                                            onClick={() => handleReviewAction(false)}
                                            className="!flex-1 !py-3 !rounded-xl !bg-red-50 !text-red-600 !text-xs !font-black hover:!bg-red-500 hover:!text-white !transition-all border !border-red-100"
                                        >
                                            Hủy bỏ
                                        </button>
                                        <button 
                                            disabled={isReviewing}
                                            onClick={() => handleReviewAction(true)}
                                            className="!flex-1 !py-3 !rounded-xl !bg-emerald-500 !text-white !text-xs !font-black hover:!bg-emerald-600 !transition-all !shadow-lg !shadow-emerald-500/20"
                                        >
                                            Duyệt phí
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="!space-y-6 !animate-fade-in-up">
            <div className="!bg-white !p-8 !rounded-[2.5rem] !border !border-border !shadow-sm !flex !flex-col md:!flex-row !items-start md:!items-center !justify-between !gap-6">
                <div>
                     <h2 className="!text-xl !font-black !text-text-main !tracking-tight">Cấu hình học phí</h2>
                </div>
                
                <div className="!flex !flex-wrap !items-center !gap-4">
                    <div className="!flex !items-center !gap-2 !bg-background !p-1 !rounded-xl !border !border-border">
                        <button 
                            onClick={() => setSettingsMethodFilter('All')} 
                            className={`!px-4 !py-1.5 !rounded-lg !text-[11px] !font-black !transition-all ${settingsMethodFilter === 'All' ? '!bg-white !text-primary !shadow-sm' : '!text-text-muted hover:!text-text-main'}`}
                        >
                            Tất cả loại
                        </button>
                        <button 
                            onClick={() => setSettingsMethodFilter('Prepaid')} 
                            className={`!px-4 !py-1.5 !rounded-lg !text-[11px] !font-black !transition-all ${settingsMethodFilter === 'Prepaid' ? '!bg-white !text-emerald-500 !shadow-sm' : '!text-text-muted hover:!text-text-main'}`}
                        >
                            Thu trước
                        </button>
                        <button 
                            onClick={() => setSettingsMethodFilter('Postpaid')} 
                            className={`!px-4 !py-1.5 !rounded-lg !text-[11px] !font-black !transition-all ${settingsMethodFilter === 'Postpaid' ? '!bg-white !text-purple-500 !shadow-sm' : '!text-text-muted hover:!text-text-main'}`}
                        >
                            Thu sau
                        </button>
                    </div>

                    <div className="!flex !items-center !gap-2 !bg-background !p-1 !rounded-xl !border !border-border">
                        <button 
                            onClick={() => setSettingsStatusFilter('All')} 
                            className={`!px-4 !py-1.5 !rounded-lg !text-[11px] !font-black !transition-all ${settingsStatusFilter === 'All' ? '!bg-white !text-primary !shadow-sm' : '!text-text-muted hover:!text-text-main'}`}
                        >
                            Tất cả trạng thái
                        </button>
                        <button 
                            onClick={() => setSettingsStatusFilter('Configured')} 
                            className={`!px-4 !py-1.5 !rounded-lg !text-[11px] !font-black !transition-all ${settingsStatusFilter === 'Configured' ? '!bg-white !text-blue-500 !shadow-sm' : '!text-text-muted hover:!text-text-main'}`}
                        >
                            Đã cấu hình
                        </button>
                        <button 
                            onClick={() => setSettingsStatusFilter('NotConfigured')} 
                            className={`!px-4 !py-1.5 !rounded-lg !text-[11px] !font-black !transition-all ${settingsStatusFilter === 'NotConfigured' ? '!bg-white !text-amber-500 !shadow-sm' : '!text-text-muted hover:!text-text-main'}`}
                        >
                            Chưa cấu hình
                        </button>
                    </div>
                </div>
            </div>

            <div className="!bg-white !rounded-[2.5rem] !border !border-border !shadow-sm !overflow-hidden">
                <table className="!w-full !text-left !border-collapse">
                    <thead>
                        <tr className="!bg-[#F8FAFC] !border-b !border-border">
                            <th className="!px-6 !py-5 text-[11px] font-black text-text-muted uppercase tracking-widest">Lớp học</th>
                            <th className="!px-6 !py-5 text-[11px] font-black text-text-muted uppercase tracking-widest text-center">Hình thức thu</th>
                            <th className="!px-6 !py-5 text-[11px] font-black text-text-muted uppercase tracking-widest text-center">Đơn giá học phí</th>
                            <th className="!px-6 !py-5 text-[11px] font-black text-text-muted uppercase tracking-widest text-center">Hạn nộp (Ngày)</th>
                            <th className="!px-6 !py-5 text-[11px] font-black text-text-muted uppercase tracking-widest text-center">Cập nhật</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {isLoading ? (
                            <tr><td colSpan={5} className="!py-20 text-center text-text-muted font-bold">Đang tải cấu hình...</td></tr>
                        ) : filteredSettings.length === 0 ? (
                            <tr><td colSpan={5} className="!py-24 text-center text-text-muted font-bold">Không tìm thấy cấu hình lớp phù hợp</td></tr>
                        ) : paginatedSettings.map(c => {
                            const isConfigured = (c.tuitionFee > 0 || c.pricePerSession > 0);
                            return (
                                <tr key={c.classId} className="hover:!bg-slate-50 transition-colors">
                                    <td className="!px-6 !py-4">
                                        <p className="font-black text-sm text-text-main">{c.className}</p>
                                        {!isConfigured && <span className="!text-[9px] !font-black !text-amber-500 !uppercase">Thiếu cấu hình</span>}
                                    </td>
                                    <td className="!px-6 !py-4 text-center">
                                        <span className={`!px-2.5 !py-1 rounded-lg text-[10px] font-black ${c.billingMethod === 'Prepaid' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'}`}>
                                            {c.billingMethod === 'Prepaid' ? 'Trả trước' : 'Trả sau'}
                                        </span>
                                    </td>
                                    <td className="!px-6 !py-4 text-center font-black text-sm text-text-main">
                                        {isConfigured ? formatVND(c.tuitionFee || c.pricePerSession) : '--'}
                                    </td>
                                    <td className="!px-6 !py-4 text-center font-bold text-sm text-text-main">{c.paymentDeadlineDays || 5} ngày</td>
                                    <td className="!px-6 !py-4 text-center">
                                        <button onClick={() => { setSelectedConfig(c); setIsConfigModalOpen(true); }} className={`!p-2 !rounded-xl !transition-all ${!isConfigured ? '!bg-amber-500 !text-white' : '!bg-slate-100 !text-slate-500 hover:!bg-primary hover:!text-white'}`}>
                                            <Icon icon={!isConfigured ? "solar:add-circle-bold" : "solar:pen-new-square-bold-duotone"} className="!text-xl" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                {totalConfigPages > 1 && (
                    <div className="!flex !items-center !justify-between !p-6 !border-t !border-border !bg-[#F8FAFC]">
                        <span className="!text-sm !font-bold !text-text-muted">Trang {configPage} / {totalConfigPages}</span>
                        <div className="!flex !items-center !gap-2">
                            <button onClick={() => setConfigPage(p => Math.max(1, p - 1))} disabled={configPage === 1} className="!w-9 !h-9 !rounded-xl !bg-white !border !border-border !flex !items-center !justify-center hover:!border-primary disabled:!opacity-30 !transition-all"><Icon icon="solar:round-alt-arrow-left-bold" /></button>
                            <button onClick={() => setConfigPage(p => Math.min(totalConfigPages, p + 1))} disabled={configPage === totalConfigPages} className="!w-9 !h-9 !rounded-xl !bg-white !border !border-border !flex !items-center !justify-center hover:!border-primary disabled:!opacity-30 !transition-all"><Icon icon="solar:round-alt-arrow-right-bold" /></button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="!min-h-screen !bg-[#fbfcfd] !pb-20 !px-4 sm:!px-10">
            {/* Main Header */}
            <header className="!pt-12 !pb-8 !flex !flex-col sm:!flex-row sm:!items-end !justify-between !gap-6">
                <div>
                    <h1 className="!text-4xl !font-black !text-text-main !tracking-tight font-['Outfit']">Quản lý Học phí</h1>
                </div>
                
                {/* Global Tab Switcher */}
                <div className="!flex !items-center !gap-2 !bg-white !p-2 !rounded-[2rem] !shadow-xl !shadow-slate-200/50 !border !border-slate-100">
                    {[
                        { id: 'dashboard', label: 'Tổng quan', icon: 'solar:chart-2-bold-duotone' },
                        { id: 'operations', label: 'Lớp & Công nợ', icon: 'solar:bill-list-bold-duotone' },
                        { id: 'transactions', label: 'Duyệt giao dịch thanh toán', icon: 'solar:shield-check-bold-duotone', badge: pendingCount },
                        { id: 'settings', label: 'Cấu hình học phí', icon: 'solar:settings-bold-duotone' }
                    ].map(tab => (
                         <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`!px-6 !py-3 !rounded-[1.5rem] !text-sm !font-black !transition-all !flex !items-center !gap-2.5 !relative ${activeTab === tab.id ? '!bg-[#355872] !text-white !shadow-lg' : '!text-text-muted hover:!bg-slate-50 hover:!text-text-main'}`}
                        >
                            <Icon icon={tab.icon} className="!text-xl" />
                            {tab.label}
                            {tab.badge > 0 && <span className="!absolute !-top-1 !-right-1 !bg-red-500 !text-white !text-[9px] !w-5 !h-5 !rounded-full !flex !items-center !justify-center !border-2 !border-white">{tab.badge}</span>}
                        </button>
                    ))}
                </div>
            </header>

            {/* Global Period Filter - Synchronized between Dashboard & Operations */}
            {(activeTab === 'dashboard' || activeTab === 'operations') && (
                <div className="!mb-8 !flex !flex-col sm:!flex-row !items-start sm:!items-center !gap-4 !bg-white !w-full sm:!w-fit !px-6 !py-4 !rounded-[2rem] !border !border-border !shadow-sm">
                    <div className="!flex !items-center !gap-3">
                        <div className="!p-2 !bg-blue-50 !rounded-xl">
                            <Icon icon="solar:calendar-bold-duotone" className="!text-primary !text-xl" />
                        </div>
                        <span className="!text-sm !font-black !text-text-main !uppercase !tracking-wider">Kỳ báo cáo & Xử lý:</span>
                    </div>
                    <div className="!flex !items-center !gap-4 !bg-slate-50 !px-4 !py-2 !rounded-xl !border !border-slate-200">
                        <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))} className="!bg-transparent !border-none !text-sm !font-black !text-[#355872] focus:!outline-none">
                            {months.map(m => <option key={m} value={m}>Tháng {m}</option>)}
                        </select>
                        <span className="!text-slate-300 font-bold">/</span>
                        <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} className="!bg-transparent !border-none !text-sm !font-black !text-[#355872] focus:!outline-none">
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                    {(activeTab === 'operations' || activeTab === 'dashboard') && (
                        <div className="!text-xs !font-bold !text-text-muted !italic sm:!ml-4">
                            * Dữ liệu và nhiệm vụ sẽ tự động thay đổi theo kỳ được chọn
                        </div>
                    )}
                </div>
            )}

            {/* Tab Content Rendering */}
            <main className="!min-h-[500px]">
                {isLoading && activeTab !== 'transactions' ? (
                     <div className="!py-28 !text-center !text-text-muted !font-black">Đang tải dữ liệu...</div>
                ) : (
                    <>
                        {activeTab === 'dashboard' && renderDashboard()}
                        {activeTab === 'operations' && renderOperations()}
                        {activeTab === 'transactions' && renderTransactions()}
                        {activeTab === 'settings' && renderSettings()}
                    </>
                )}
            </main>

            {/* Modals */}
            <TuitionFeeModal
                isOpen={isConfigModalOpen}
                onClose={() => setIsConfigModalOpen(false)}
                onSave={handleSaveConfig}
                editData={selectedConfig}
                classes={configData}
            />
        </div>
    );
};

export default TuitionManagementPage;
