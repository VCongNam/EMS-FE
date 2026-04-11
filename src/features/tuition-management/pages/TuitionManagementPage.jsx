import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import TuitionFeeModal from '../components/TuitionFeeModal';
import GenerateInvoiceModal from '../components/GenerateInvoiceModal';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import DashboardStatCards from '../../dashboard/components/DashboardStatCards';
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
    const [stats, setStats] = useState({
        totalActualRevenue: 0,
        paidInvoicesCount: 0,
        pendingInvoicesCount: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    // Modal state
    const [feeModal, setFeeModal] = useState({ isOpen: false, editData: null });
    const [invoiceModal, setInvoiceModal] = useState({ isOpen: false, classData: null });

    // Fetch Data
    const fetchData = async () => {
        if (!user?.token) return;
        try {
            setIsLoading(true);
            
            // Lấy danh sách cấu hình
            const configsRes = await tuitionService.getTuitionConfigs(user.token);
            if (configsRes.ok) {
                const data = await configsRes.json();
                setConfigs(data || []);
            }

            // Lấy thống kê
            const statsRes = await tuitionService.getDashboardAnalytics(user.token);
            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats({
                    totalActualRevenue: statsData.totalActualRevenue || 0,
                    paidInvoicesCount: statsData.paidInvoicesCount || 0,
                    pendingInvoicesCount: statsData.pendingInvoicesCount || 0,
                });
            }
        } catch (error) {
            console.error('Error fetching tuition data:', error);
            // toast.error('Không thể tải dữ liệu học phí.');
            // Dùng mock data dự phòng nếu Backend chưa hoàn thiện endpoint
             setConfigs([
                { classId: 'c1', className: 'Toán 10', studentCount: 20, billingMethod: 'Prepaid', tuitionFee: 150000, paymentDeadlineDays: 5, monthlyStatus: 'Đã chốt' },
                { classId: 'c2', className: 'Lý 11', studentCount: 15, billingMethod: 'Postpaid', tuitionFee: 120000, paymentDeadlineDays: 7, monthlyStatus: 'Chưa đến kỳ' },
             ]);
             setStats({ totalActualRevenue: 15000000, paidInvoicesCount: 45, pendingInvoicesCount: 12 });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user?.token]);

    // ── Handlers ───────────────────────────────────────────────────────────
    const extractApiError = (errorData, defaultMessage) => {
        if (errorData?.errors && typeof errorData.errors === 'object') {
            // Extract the first error message from the field errors array
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
            
            // Gọi API thực tế
            const response = await tuitionService.updateTuitionFee(data.classId, payload, user.token);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw errorData || new Error("Failed to update");
            }
            
            setConfigs(prev => prev.map(c => c.classId === data.classId ? { ...c, ...payload } : c));
            toast.success('Cập nhật luật học phí thành công!');
            setFeeModal({ isOpen: false, editData: null });
        } catch (error) {
            const errorMessage = extractApiError(error, 'Lỗi khi cập nhật học phí');
            toast.error(errorMessage);
            console.error(error);
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
            fetchData(); // reload
        } catch (error) {
            const errorMessage = extractApiError(error, 'Đã xảy ra lỗi khi tạo hóa đơn.');
            toast.error(errorMessage);
            console.error(error);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up pb-10">

            {/* ── Settings Header ─────────────────────────────────────────────── */}
            <div className="!bg-white !mb-2 rounded-[2.5rem] border border-dashed border-border !p-6 sm:!p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl !bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                        <Icon icon="solar:wallet-money-bold-duotone" className="text-3xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-text-main tracking-tight !mb-1">Cấu hình Thiết lập Học phí</h1>
                        <p className="text-sm text-text-muted font-medium">Theo dõi doanh thu tổng quát và định hình luật lệ thu phí</p>
                    </div>
                </div>
            </div>

            {/* ── Dashboard Stats ── */}
            <DashboardStatCards 
                card1={{
                    title: 'Doanh thu thực tế',
                    subject: `${formatVND(stats.totalActualRevenue)}`,
                    time: 'Đã nhận vào hệ thống',
                    room: '',
                    icon: 'solar:cash-out-bold-duotone'
                }}
                card2={{
                    title: 'Tỷ lệ hoàn thành',
                    value: Math.round((stats.paidInvoicesCount / (stats.paidInvoicesCount + stats.pendingInvoicesCount || 1)) * 100) || 0,
                    trendText: `${stats.paidInvoicesCount} HĐ đã đóng`,
                    icon: 'solar:check-circle-bold-duotone',
                    trendColor: '!text-emerald-500'
                }}
                card3={{
                    bgClass: '!bg-orange-50 !border-orange-100',
                    iconBgClass: '!bg-orange-500 !shadow-orange-500/20',
                    titleClass: '!text-orange-900',
                    valueClass: '!text-orange-600',
                    title: 'Tồn đọng / Nợ',
                    value: stats.pendingInvoicesCount,
                    unit: 'Hóa đơn',
                    icon: 'solar:bill-cross-bold-duotone',
                    button: { label: 'Xem chi tiết báo cáo', className: '!text-orange-600 !border-orange-200 hover:!bg-orange-100', path: '/tuition/reports' }
                }}
            />

            {/* ── Section: Current Fees Table ──────────────────────────────── */}
            <div className="!bg-white !mt-2 rounded-3xl border border-border shadow-sm overflow-hidden">
                <div className="!px-6 !py-5 border-b border-border flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl !bg-primary/10 text-primary flex items-center justify-center">
                        <Icon icon="solar:round-alt-arrow-right-bold" className="text-xl" />
                    </div>
                    <div>
                        <h2 className="text-base font-black text-text-main">Luật học phí & Lên Bill</h2>
                        <p className="text-xs text-text-muted font-medium">{configs.length} lớp học đang quản lý</p>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="!bg-[#F8FAFC] border-b border-border">
                                <th className="!px-6 !py-4 text-[11px] font-black text-text-muted uppercase tracking-widest">Lớp học</th>
                                <th className="!px-6 !py-4 text-[11px] font-black text-text-muted uppercase tracking-widest">Loại thu</th>
                                <th className="!px-6 !py-4 text-[11px] font-black text-text-muted uppercase tracking-widest">Đơn giá/Buổi</th>
                                <th className="!px-6 !py-4 text-[11px] font-black text-text-muted uppercase tracking-widest hidden md:table-cell">Luật Hạn Nộp</th>
                                <th className="!px-6 !py-4 text-[11px] font-black text-text-muted uppercase tracking-widest text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                 <tr>
                                    <td colSpan={5} className="!py-10 text-center text-text-muted">Đang tải dữ liệu...</td>
                                 </tr>
                            ) : configs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="!py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 opacity-40">
                                            <Icon icon="solar:wallet-money-bold-duotone" className="text-6xl" />
                                            <p className="font-bold">Chưa có danh sách lớp</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : configs.map(c => (
                                <tr key={c.classId} className="group hover:!bg-[#F8FAFC] transition-all">
                                    <td className="!px-6 !py-4">
                                        <p className="font-bold text-text-main text-sm">{c.className}</p>
                                        <p className="text-xs text-text-muted">{c.studentCount} Học sinh</p>
                                    </td>
                                    <td className="!px-6 !py-4">
                                        {c.billingMethod === 'Prepaid' ? (
                                            <span className="!px-3 !py-1 rounded-full text-xs font-black !bg-emerald-100 text-emerald-700 border border-emerald-200">
                                                Trả trước
                                            </span>
                                        ) : (
                                            <span className="!px-3 !py-1 rounded-full text-xs font-black !bg-purple-100 text-purple-700 border border-purple-200">
                                                Trả sau
                                            </span>
                                        )}
                                    </td>
                                    <td className="!px-6 !py-4">
                                        {c.tuitionFee ? (
                                            <span className="font-black text-primary text-base">{formatVND(c.tuitionFee)}</span>
                                        ) : (
                                            <span className="text-xs text-orange-500 font-black px-2 py-1 bg-orange-50 rounded-md">Chưa thiết lập</span>
                                        )}
                                    </td>
                                    <td className="!px-6 !py-4 hidden md:table-cell">
                                        <span className="text-sm font-medium text-text-main">
                                            {c.paymentDeadlineDays} ngày <span className="text-text-muted text-xs">sau chốt bill</span>
                                        </span>
                                    </td>
                                    <td className="!px-6 !py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setFeeModal({ isOpen: true, editData: c })}
                                                className="w-9 h-9 flex items-center justify-center rounded-xl !bg-background text-text-muted hover:text-primary hover:!bg-primary/10 transition-all border border-border"
                                                title="Chỉnh sửa luật học phí"
                                            >
                                                <Icon icon="solar:settings-bold-duotone" className="text-base" />
                                            </button>
                                            <button
                                                onClick={() => setInvoiceModal({ isOpen: true, classData: c })}
                                                className="!px-3 !py-1.5 flex items-center justify-center rounded-xl font-bold text-xs gap-1.5 !bg-text-main text-white hover:!bg-text-main/90 transition-all shadow-md"
                                            >
                                                <Icon icon="solar:bill-check-bold" className="text-sm" />
                                                Lên Bill
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Modals ─────────────────────────────────────────────────────── */}
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
