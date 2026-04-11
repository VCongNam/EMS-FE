import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';
import FeeCard from '../components/FeeCard';
import TransactionHistory from '../components/TransactionHistory';
import PaymentModal from '../components/PaymentModal';
import InvoiceModal from '../components/InvoiceModal';
import { tuitionService } from '../api/tuitionService';
import useAuthStore from '../../../store/authStore';
import { toast } from 'react-toastify';

const MOCK_TRANSACTIONS = [
    { id: 101, amount: 450000, date: '25/09/2026 14:30', method: 'Chuyển khoản Ngân hàng' },
    { id: 102, amount: 1200000, date: '10/08/2026 09:15', method: 'Ví điện tử MoMo' },
];

const StudentTuitionPage = () => {
    const { classId } = useParams();
    const { user } = useAuthStore();
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
    const [selectedFee, setSelectedFee] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [activeTab, setActiveTab] = useState('fees'); // 'fees' or 'history'
    
    // API State
    const [fees, setFees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Filters
    const [statusFilter, setStatusFilter] = useState(''); // '' means all, 'Chưa nộp', 'Đã nộp'
    const [periodFilter, setPeriodFilter] = useState(''); // e.g. "Tháng 3/2026"

    const fetchFees = async () => {
        if (!user?.token) return;
        try {
            setIsLoading(true);
            const res = await tuitionService.getStudentTuitions(user.token, {
                page: 1,
                size: 50,
                classId: classId || undefined,
                // Pass filters to backend if it supports it, or we filter on frontend below
                // We'll pass them in case backend supports it
                status: statusFilter || undefined,
                period: periodFilter || undefined
            });
            if (res.ok) {
                const json = await res.json();
                const items = json.data?.items || [];
                
                // Map backend data to frontend card format
                let mappedFees = items.map((item, index) => ({
                    id: item.invoiceId || index,
                    invoiceId: item.invoiceId, // Keep original GUID
                    code: item.invoiceId ? item.invoiceId.substring(0,8).toUpperCase() : `FEE-${index}`,
                    title: `Học phí ${item.className} - ${item.period}`,
                    amount: item.amount,
                    dueDate: new Date(item.dueDate).toLocaleDateString('vi-VN'),
                    status: item.displayStatus === 'Đã nộp' ? 'Paid' : (item.displayStatus === 'Chờ xác nhận' ? 'Checking' : (item.displayStatus === 'Quá hạn' ? 'Overdue' : 'Pending')),
                    displayStatus: item.displayStatus,
                    canPay: item.canPay
                }));

                // Frontend fallback filter in case backend ignores query params
                if (statusFilter) {
                    mappedFees = mappedFees.filter(f => f.displayStatus === statusFilter);
                }
                if (periodFilter) {
                    // Simple text match
                    mappedFees = mappedFees.filter(f => f.title.toLowerCase().includes(periodFilter.toLowerCase()));
                }

                setFees(mappedFees);
            } else {
                toast.error('Không thể tải danh sách học phí');
            }
        } catch (error) {
            console.error('Error fetching fees:', error);
            toast.error('Lỗi khi tải dữ liệu');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFees();
    }, [user?.token, statusFilter, periodFilter, classId]);

    const handlePay = (fee) => {
        setSelectedFee(fee);
        setIsPaymentOpen(true);
    };

    const handleViewInvoice = (data) => {
        setSelectedInvoice(data);
        setIsInvoiceOpen(true);
    };

    const totalDue = fees.reduce((acc, f) => f.status !== 'Paid' ? acc + f.amount : acc, 0);
    const totalPaid = fees.reduce((acc, f) => f.status === 'Paid' ? acc + f.amount : acc, 0);

    return (
        <div className="!max-w-7xl !mx-auto !space-y-8 !animate-fade-in custom-scrollbar">
            {/* Header / Summary Section */}
            {!classId && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                    {/* Tổng nợ hiện tại */}
                    <div className="!bg-white !border !border-border rounded-2xl !p-6">
                        <p className="text-xs text-text-muted uppercase tracking-widest font-semibold  !mb-3">Tổng nợ hiện tại</p>
                        <p className="text-3xl font-semibold text-text-main !mb-4">
                            {totalDue.toLocaleString('vi-VN')} <span className="text-base text-text-muted">₫</span>
                        </p>
                        <div className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 !border !border-orange-100 rounded-lg px-2.5 py-1.5 text-xs font-semibold">
                            <Icon icon="solar:danger-bold-duotone" className="text-sm" />
                            Khoản phí cần giải quyết
                        </div>
                    </div>

                    {/* Đã thanh toán */}
                    <div className="bg-white !border !border-border rounded-2xl !p-6">
                        <p className="text-xs text-text-muted uppercase tracking-widest font-semibold !mb-3">Đã thanh toán (Ước tính)</p>
                        <p className="text-3xl font-semibold text-text-main !mb-4">
                            {totalPaid.toLocaleString('vi-VN')} <span className="text-base text-text-muted">₫</span>
                        </p>
                        <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg px-2.5 py-1.5 text-xs font-semibold">
                            <Icon icon="solar:check-circle-bold-duotone" className="text-sm" />
                            Đã cập nhật hệ thống
                        </div>
                    </div>

                    {/* Hóa đơn quá hạn */}
                    <div className="bg-white border border-border rounded-2xl !p-6 flex flex-col justify-between gap-4">
                        <div>
                            <p className="text-xs text-text-muted uppercase tracking-widest font-semibold !mb-1.5">Hóa đơn quá hạn</p>
                            <p className="text-sm text-text-muted">Thanh toán các khoản tồn đọng</p>
                        </div>
                        <button className="w-full !px-4 !py-2.5 text-sm font-semibold rounded-xl bg-red-50 text-red-600 !border !border-red-100 hover:!bg-red-100 transition-colors">
                            Xem chi tiết nợ
                        </button>
                    </div>

                </div>
            )}

            {/* Filters */}
            <div className="!flex !flex-col md:!flex-row !gap-4 !items-center !justify-between !bg-white !p-4 !rounded-2xl !border !border-border">
                <div className="!flex !items-center !gap-1 !p-1.5 !bg-background !rounded-xl !border !border-border !w-full md:!w-fit">
                    <button
                        onClick={() => setActiveTab('fees')}
                        className={`!px-6 !py-2.5 !rounded-lg !text-sm !font-black !flex !items-center !gap-2 !transition-all !flex-1 md:!flex-none ${activeTab === 'fees' ? '!bg-white !text-primary !shadow-sm' : '!text-text-muted hover:!text-text-main'}`}
                    >
                        <Icon icon="solar:bill-list-bold-duotone" className="!text-lg" />
                        Khoản phí
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`!px-6 !py-2.5 !rounded-lg !text-sm !font-black !flex !items-center !gap-2 !transition-all !flex-1 md:!flex-none ${activeTab === 'history' ? '!bg-white !text-primary !shadow-sm' : '!text-text-muted hover:!text-text-main'}`}
                    >
                        <Icon icon="solar:history-bold-duotone" className="!text-lg" />
                        Lịch sử & Giao dịch
                    </button>
                </div>

                {activeTab === 'fees' && (
                    <div className="!flex !items-center !gap-3 !w-full md:!w-auto">
                        <div className="!relative !flex-1 md:!flex-none">
                            <Icon icon="solar:filter-bold-duotone" className="!absolute !left-3 !top-1/2 !-translate-y-1/2 !text-text-muted" />
                            <select 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="!w-full md:!w-auto !pl-9 !pr-8 !py-2.5 !bg-background !border !border-border !rounded-xl !text-sm !font-medium focus:!outline-none focus:!border-primary/50"
                            >
                                <option value="">Tất cả trạng thái</option>
                                <option value="Chưa nộp">Chưa nộp</option>
                                <option value="Đã nộp">Đã nộp</option>
                            </select>
                        </div>
                        <div className="!relative !flex-1 md:!flex-none">
                            <Icon icon="solar:calendar-bold-duotone" className="!absolute !left-3 !top-1/2 !-translate-y-1/2 !text-text-muted" />
                            <input 
                                type="text"
                                placeholder="Thời gian (VD: Tháng 3)"
                                value={periodFilter}
                                onChange={(e) => setPeriodFilter(e.target.value)}
                                className="!w-full md:!w-auto !pl-9 !pr-4 !py-2.5 !bg-background !border !border-border !rounded-xl !text-sm !font-medium focus:!outline-none focus:!border-primary/50"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="!space-y-6">
                {activeTab === 'fees' ? (
                    isLoading ? (
                        <div className="!flex !justify-center !items-center !py-20 text-text-muted">
                            <Icon icon="solar:spinner-linear" className="!animate-spin !text-4xl" />
                        </div>
                    ) : (
                        <>
                            <div className="!grid !grid-cols-1 lg:!grid-cols-2 !gap-6">
                                {fees.filter(f => f.status !== 'Paid').map((fee, idx) => (
                                    <FeeCard key={fee.id || idx} fee={fee} onPay={handlePay} onViewInvoice={handleViewInvoice} />
                                ))}
                                {fees.filter(f => f.status !== 'Paid').length === 0 && (
                                    <div className="!col-span-full !text-center !py-10 text-text-muted">
                                        Không có khoản phí chưa nộp nào.
                                    </div>
                                )}
                            </div>

                            {/* Secondary Section for Fees tab (Paid items) */}
                            <div className="!pt-8 !space-y-6">
                                <div className="!flex !items-center !gap-4 !px-2">
                                    <h3 className="!text-xl !font-black !text-text-main !tracking-tight">Các khoản đã hoàn thành</h3>
                                    <div className="!flex-1 !h-px !bg-border !dashed !border-t-2 !border-dashed !border-primary/10" />
                                </div>
                                <div className="!grid !grid-cols-1 lg:!grid-cols-2 !gap-6">
                                    {fees.filter(f => f.status === 'Paid').map((fee, idx) => (
                                        <FeeCard key={fee.id || idx} fee={fee} onViewInvoice={handleViewInvoice} />
                                    ))}
                                    {fees.filter(f => f.status === 'Paid').length === 0 && (
                                        <div className="!col-span-full !text-center !py-6 text-text-muted">
                                            Không có lịch sử nộp phí.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )
                ) : (
                    <TransactionHistory transactions={MOCK_TRANSACTIONS} onViewInvoice={handleViewInvoice} />
                )}
            </div>

            <PaymentModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                fee={selectedFee}
                onSuccess={fetchFees}
            />

            <InvoiceModal 
                isOpen={isInvoiceOpen}
                onClose={() => setIsInvoiceOpen(false)}
                data={selectedInvoice}
                onPay={handlePay}
            />
        </div>
    );
};

export default StudentTuitionPage;
