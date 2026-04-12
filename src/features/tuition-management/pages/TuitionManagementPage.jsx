import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import TuitionFeeModal from '../components/TuitionFeeModal';
import GenerateInvoiceModal from '../components/GenerateInvoiceModal';
import DashboardStatCards from '../../dashboard/components/DashboardStatCards';
import RevenueTrendChart from '../components/charts/RevenueTrendChart';
import RevenueDistributionChart from '../components/charts/RevenueDistributionChart';
import { tuitionService } from '../api/tuitionService';
import useAuthStore from '../../../store/authStore';

// ─── Helper ───────────────────────────────────────────────────────────────────
const formatVND = (amount) => amount?.toLocaleString('vi-VN') + ' ₫';

// ─── Main Page ────────────────────────────────────────────────────────────────
const TuitionManagementPage = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    
    // API State
    const [configs, setConfigs] = useState([]);
    const [analytics, setAnalytics] = useState({ totalRevenue: 0, revenueTrends: [], revenueByClasses: [] });
    const [summaries, setSummaries] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Modal state
    const [feeModal, setFeeModal] = useState({ isOpen: false, editData: null });
    const [invoiceModal, setInvoiceModal] = useState({ isOpen: false, classData: null });

    // Fetch Data
    const fetchData = async () => {
        if (!user?.token) return;
        try {
            setIsLoading(true);
            const [configsRes, analyticsRes, summariesRes, pendingRes] = await Promise.all([
                tuitionService.getTuitionConfigs(user.token),
                tuitionService.getDashboardAnalytics(user.token),
                tuitionService.getClassFinancialSummaries(user.token),
                tuitionService.getPendingTransactions(user.token) // API might not exist depending on backend but handling gracefully
            ]);

            if (configsRes.ok) setConfigs(await configsRes.json() || []);
            if (analyticsRes.ok) setAnalytics(await analyticsRes.json() || { totalRevenue: 0, revenueTrends: [], revenueByClasses: [] });
            if (summariesRes.ok) setSummaries(await summariesRes.json() || []);
            if (pendingRes.ok) setPendingCount((await pendingRes.json() || []).length);

        } catch (error) {
            console.error('Error fetching tuition data:', error);
            toast.error('Không thể tải dữ liệu học phí. Vui lòng kiểm tra lại kết nối!');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user?.token]);

    // Derived Statistics
    const totalDebt = useMemo(() => {
        return summaries.reduce((sum, cls) => sum + (cls.debtAmount || 0), 0);
    }, [summaries]);

    const trendData = analytics.revenueTrends?.map(item => ({
        name: item.monthLabel,
        total: item.revenue
    })) || [];

    const distributionData = analytics.revenueByClasses?.map(item => ({
        name: item.className,
        value: item.revenue
    })) || [];

    // Combine configs with summaries for the table
    const tableData = useMemo(() => {
        return configs.map(config => {
            const summary = summaries.find(s => s.classId === config.classId) || {};
            return {
                ...config,
                studentCount: summary.studentCount || summary.studentsCount || config.studentCount || 0,
                collectionRate: Math.round(summary.collectionRate || 0)
            };
        });
    }, [configs, summaries]);

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

    const handleSaveFeeConfig = async (data) => {
        try {
            const payload = {
                tuitionFee: data.tuitionFee,
                billingMethod: data.billingMethod,
                paymentDeadlineDays: data.paymentDeadlineDays
            };
            
            const response = await tuitionService.updateTuitionFee(data.classId, payload, user.token);
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw errorData || new Error("Failed to update");
            }
            
            toast.success('Cập nhật luật học phí thành công!');
            setFeeModal({ isOpen: false, editData: null });
            fetchData();
        } catch (error) {
            const errorMessage = extractApiError(error, 'Lỗi khi cập nhật học phí');
            toast.error(errorMessage);
        }
    };

    const handleGenerateInvoice = async (classId, payload, actionType) => {
        try {
            let response;
            if (actionType === 'reconcile') {
                response = await tuitionService.reconcilePrepaidClass(classId, payload.periodMonth, payload.periodYear, user.token);
            } else {
                response = await tuitionService.generateClassInvoices(classId, payload, user.token);
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw errorData || new Error("Failed to generate invoices");
            }

            toast.success(`Khởi tạo yêu cầu thu học phí thành công!`);
            setInvoiceModal({ isOpen: false, classData: null });
            fetchData();
        } catch (error) {
            const errorMessage = extractApiError(error, 'Đã xảy ra lỗi khi tạo hóa đơn.');
            toast.error(errorMessage);
        }
    };

    return (
        <div className="!space-y-8 !animate-fade-in-up !pb-10 !px-4 sm:!px-8">
            {/* Header */}
            <div>
                <h1 className="!text-3xl sm:!text-4xl !font-black !text-text-main !tracking-tight font-['Outfit']">
                    Bảng điều khiển Tài chính
                </h1>
                <p className="!text-sm !font-medium !text-text-muted !mt-2">
                    Cái nhìn tổng quan về sức khỏe dòng tiền trên toàn hệ thống.
                </p>
            </div>

            {/* Dashboard Stats */}
            <div className="!grid !grid-cols-1 md:!grid-cols-3 !gap-6">
                 <div className="!bg-emerald-50 !border !border-emerald-100 !p-6 !rounded-[2rem] !shadow-sm !hover:shadow-md !transition-all">
                    <div className="!flex !items-center !justify-between !mb-4">
                        <div className="!w-12 !h-12 !rounded-2xl !bg-emerald-500 !shadow-emerald-500/20 !flex !items-center !justify-center !text-white">
                            <Icon icon="solar:cash-out-bold-duotone" className="!text-2xl" />
                        </div>
                    </div>
                    <p className="!text-xs !font-black !text-emerald-900 !uppercase !tracking-widest !mb-1">Tổng doanh thu (Thực thu)</p>
                    {isLoading ? <div className="!h-8 !w-32 !bg-emerald-200 !animate-pulse !rounded-md"></div> : 
                        <h3 className="!text-3xl !font-black !text-emerald-600 !tracking-tight">{formatVND(analytics.totalRevenue)}</h3>
                    }
                </div>

                <div className="!bg-red-50 !border !border-red-100 !p-6 !rounded-[2rem] !shadow-sm !hover:shadow-md !transition-all">
                    <div className="!flex !items-center !justify-between !mb-4">
                        <div className="!w-12 !h-12 !rounded-2xl !bg-red-500 !shadow-red-500/20 !flex !items-center !justify-center !text-white">
                            <Icon icon="solar:danger-triangle-bold-duotone" className="!text-2xl" />
                        </div>
                    </div>
                    <p className="!text-xs !font-black !text-red-900 !uppercase !tracking-widest !mb-1">Tổng công nợ (Chưa thu)</p>
                    {isLoading ? <div className="!h-8 !w-32 !bg-red-200 !animate-pulse !rounded-md"></div> : 
                        <h3 className="!text-3xl !font-black !text-red-600 !tracking-tight">{formatVND(totalDebt)}</h3>
                    }
                </div>

                <div 
                    onClick={() => navigate('/tuition/transactions')}
                    className="!bg-amber-50 !border !border-amber-100 !p-6 !rounded-[2rem] !shadow-sm hover:!shadow-md hover:!-translate-y-1 !transition-all !cursor-pointer"
                >
                    <div className="!flex !items-center !justify-between !mb-4">
                        <div className={`!w-12 !h-12 !rounded-2xl !bg-amber-500 !shadow-amber-500/20 !flex !items-center !justify-center !text-white ${pendingCount > 0 ? '!animate-bounce' : ''}`}>
                            <Icon icon={pendingCount > 0 ? "solar:bell-bing-bold-duotone" : "solar:bell-bold-duotone"} className="!text-2xl" />
                        </div>
                        <span className="!px-3 !py-1 !bg-amber-200 !text-amber-700 !text-[10px] !font-black !rounded-lg !uppercase border border-amber-300">
                            Xử lý ngay
                        </span>
                    </div>
                    <p className="!text-xs !font-black !text-amber-900 !uppercase !tracking-widest !mb-1">Biên lai chờ duyệt</p>
                    {isLoading ? <div className="!h-8 !w-32 !bg-amber-200 !animate-pulse !rounded-md"></div> : 
                        <div className="!flex !items-baseline !gap-2">
                             <h3 className="!text-3xl !font-black !text-amber-600 !tracking-tight">{pendingCount}</h3>
                             <span className="!text-sm !font-bold !text-amber-700">Yêu cầu</span>
                        </div>
                    }
                </div>
            </div>

            {/* Charts Section */}
            <div className="!grid !grid-cols-1 lg:!grid-cols-2 !gap-8">
                <div className="!bg-white !p-8 !rounded-[2.5rem] !border !border-border !shadow-sm">
                    <div className="!mb-6">
                        <h2 className="!text-xl !font-black !text-text-main !tracking-tight">Xu hướng doanh thu (6 tháng)</h2>
                        <p className="!text-sm !font-bold !text-text-muted !mt-1">Dựa trên biểu đồ cột so sánh theo từng kỳ</p>
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

            {/* Class Table Section */}
            <div className="!bg-white !rounded-[2.5rem] !border !border-border !shadow-sm !overflow-hidden">
                <div className="!px-8 !py-6 !border-b !border-border !bg-background/20 !flex !flex-col sm:!flex-row sm:!items-center !justify-between !gap-4">
                    <div>
                        <h2 className="!text-xl !font-black !text-text-main !tracking-tight">Bảng tóm tắt theo lớp</h2>
                        <p className="!text-sm !font-bold !text-text-muted !mt-1">Danh sách lớp và tiến độ thu phí</p>
                    </div>
                    <button 
                        onClick={() => navigate('/tuition/reports')}
                        className="!flex !items-center !gap-2 !px-4 !py-2 !bg-white !border !border-border !rounded-xl !text-sm !font-black !text-text-main hover:!bg-background !transition-colors"
                    >
                        Quản lý Công nợ chi tiết
                        <Icon icon="solar:arrow-right-line-duotone" />
                    </button>
                </div>

                <div className="!overflow-x-auto custom-scrollbar">
                    <table className="!w-full !text-left !border-collapse">
                        <thead>
                            <tr className="!bg-[#F8FAFC] !border-b !border-border">
                                <th className="!px-6 !py-4 text-[11px] font-black text-text-muted uppercase tracking-widest">Lớp học</th>
                                <th className="!px-6 !py-4 text-[11px] font-black text-text-muted uppercase tracking-widest text-center">Sĩ số</th>
                                <th className="!px-6 !py-4 text-[11px] font-black text-text-muted uppercase tracking-widest">Tỉ lệ thu học phí</th>
                                <th className="!px-6 !py-4 text-[11px] font-black text-text-muted uppercase tracking-widest">Loại thu / Đơn giá</th>
                                <th className="!px-6 !py-4 text-[11px] font-black text-text-muted uppercase tracking-widest text-right">Cấu hình</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                 <tr>
                                    <td colSpan={5} className="!py-10 text-center text-text-muted font-bold">Đang tải dữ liệu...</td>
                                 </tr>
                            ) : tableData.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="!py-16 text-center text-text-muted font-bold">Chưa có danh sách lớp</td>
                                </tr>
                            ) : tableData.map(c => (
                                <tr key={c.classId} className="group hover:!bg-[#F8FAFC] transition-all">
                                    <td className="!px-6 !py-4">
                                        <p className="font-black text-text-main text-sm">{c.className}</p>
                                    </td>
                                    <td className="!px-6 !py-4 text-center">
                                         <span className="font-bold text-text-main text-sm bg-background px-3 py-1 rounded-lg border border-border">
                                            {c.studentCount}
                                         </span>
                                    </td>
                                    <td className="!px-6 !py-4">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex justify-between items-center text-xs font-bold text-text-main">
                                                 <span>Đã thu {c.collectionRate}%</span>
                                            </div>
                                            <div className="w-full sm:w-32 h-1.5 rounded-full bg-border overflow-hidden">
                                                <div 
                                                    className={`h-full ${c.collectionRate >= 80 ? 'bg-emerald-500' : c.collectionRate >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                    style={{ width: `${c.collectionRate}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="!px-6 !py-4">
                                        <div className="flex items-center gap-2">
                                            {c.billingMethod === 'Prepaid' ? (
                                                <span className="!px-2 !py-0.5 rounded text-[10px] font-black !bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                    Trả trước
                                                </span>
                                            ) : (
                                                <span className="!px-2 !py-0.5 rounded text-[10px] font-black !bg-purple-100 text-purple-700 border border-purple-200">
                                                    Trả sau
                                                </span>
                                            )}
                                            {(c.tuitionFee || c.pricePerSession) ? (
                                                <span className="font-black text-text-main text-xs">{formatVND(c.tuitionFee || c.pricePerSession)} <span className="text-text-muted font-medium">/buổi</span></span>
                                            ) : (
                                                <span className="text-xs text-orange-500 font-bold">--</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="!px-6 !py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            
                                            <button
                                                onClick={() => setFeeModal({ isOpen: true, editData: c })}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg !bg-background text-text-muted hover:text-primary hover:!bg-primary/10 transition-all border border-border"
                                                title="Cấu hình học phí"
                                            >
                                                <Icon icon="solar:settings-bold-duotone" className="text-lg" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            <TuitionFeeModal
                isOpen={feeModal.isOpen}
                onClose={() => setFeeModal({ isOpen: false, editData: null })}
                onSave={handleSaveFeeConfig}
                editData={feeModal.editData}
                classes={configs}
            />

            <GenerateInvoiceModal
                isOpen={invoiceModal.isOpen}
                onClose={() => setInvoiceModal({ isOpen: false, classData: null })}
                onSave={handleGenerateInvoice}
                classData={invoiceModal.classData}
            />

        </div>
    );
};

export default TuitionManagementPage;
