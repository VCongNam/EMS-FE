import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';
import FeeCard from '../components/FeeCard';
import TransactionHistory from '../components/TransactionHistory';
import PaymentModal from '../components/PaymentModal';
import InvoiceModal from '../components/InvoiceModal';
import TransactionDetailModal from '../components/TransactionDetailModal';
import { tuitionService } from '../api/tuitionServiceStudent';
import useAuthStore from '../../../store/authStore';
import { toast } from 'react-toastify';

const StudentTuitionPage = () => {
    const { classId } = useParams();
    const { user } = useAuthStore();
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
    const [isTransactionOpen, setIsTransactionOpen] = useState(false);
    const [selectedFee, setSelectedFee] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [selectedTransactionId, setSelectedTransactionId] = useState(null);
    const [activeTab, setActiveTab] = useState('fees'); // 'fees' or 'history'

    // API State
    const [fees, setFees] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);

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
                status: statusFilter || undefined,
                period: periodFilter || undefined
            });
            if (res.ok) {
                const json = await res.json();
                const items = json.data?.items || [];

                let mappedFees = items.map((item, index) => ({
                    id: item.invoiceId || index,
                    invoiceId: item.invoiceId,
                    code: item.invoiceId ? item.invoiceId.substring(0, 8).toUpperCase() : `FEE-${index}`,
                    title: `Học phí ${item.className} - ${item.period}`,
                    amount: item.amount,
                    dueDate: item.dueDate, // Keep raw ISO string for modal processing
                    status: item.displayStatus === 'Đã nộp' ? 'Paid' : (item.displayStatus === 'Chờ xác nhận' ? 'Checking' : (item.displayStatus === 'Quá hạn' ? 'Overdue' : 'Pending')),
                    displayStatus: item.displayStatus,
                    canPay: item.canPay
                }));

                if (statusFilter) {
                    mappedFees = mappedFees.filter(f => f.displayStatus === statusFilter);
                }
                if (periodFilter) {
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

    const fetchTransactions = async () => {
        if (!user?.token) return;
        try {
            setIsHistoryLoading(true);
            const res = await tuitionService.getMyTransactions(user.token, classId);
            if (res.ok) {
                const data = await res.json();
                // Map Backend to Frontend format
                const mappedTransactions = data.map(tx => {
                    const dateObj = new Date(tx.paidDate);
                    const formattedDate = dateObj.toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    }) + ' ' + dateObj.toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                    });

                    return {
                        id: tx.transactionId,
                        transactionId: tx.transactionId,
                        amount: tx.amountPaid,
                        date: formattedDate,
                        method: tx.paymentMethod || 'Chuyển khoản',
                        status: tx.status,
                        content: tx.invoiceContent
                    };
                });
                setTransactions(mappedTransactions);
            } else {
                toast.error('Không thể tải lịch sử giao dịch');
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
            toast.error('Lỗi khi tải lịch sử giao dịch');
        } finally {
            setIsHistoryLoading(false);
        }
    };

    useEffect(() => {
        fetchFees();
    }, [user?.token, statusFilter, periodFilter, classId]);

    useEffect(() => {
        if (activeTab === 'history') {
            fetchTransactions();
        }
    }, [activeTab, user?.token, classId]);

    const handlePay = (fee) => {
        setSelectedFee(fee);
        setIsPaymentOpen(true);
    };

    const handleViewInvoice = (data) => {
        // If data has transactionId, it's from history, open transaction modal
        if (data.transactionId) {
            setSelectedTransactionId(data.transactionId);
            setIsTransactionOpen(true);
        } else {
            setSelectedInvoice(data);
            setIsInvoiceOpen(true);
        }
    };

    return (
        <div className="!max-w-7xl !mx-auto !space-y-8 !animate-fade-in custom-scrollbar">
            {/* Header Section */}
            <div className="!flex !flex-col sm:!flex-row sm:!items-end !justify-between !gap-6 !mb-8 !mt-4">
                <div className="!space-y-2">
                    <h1 className="!text-3xl sm:!text-4xl !font-extrabold !text-text-main !font-['Outfit'] !tracking-tight !flex !items-center !gap-3">
                        <Icon icon="solar:wallet-money-bold-duotone" className="!text-primary" />
                        Học phí của tôi
                    </h1>
                    <p className="!text-text-muted !font-medium !ml-1">
                        Quản lý và thanh toán các khoản học phí trong các lớp học bạn đang tham gia.
                    </p>
                </div>
            </div>

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
                    isHistoryLoading ? (
                        <div className="!flex !justify-center !items-center !py-20 text-text-muted">
                            <Icon icon="solar:spinner-linear" className="!animate-spin !text-4xl" />
                        </div>
                    ) : (
                        <TransactionHistory transactions={transactions} onViewInvoice={handleViewInvoice} />
                    )
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

            <TransactionDetailModal
                isOpen={isTransactionOpen}
                onClose={() => setIsTransactionOpen(false)}
                transactionId={selectedTransactionId}
            />
        </div>
    );
};

export default StudentTuitionPage;
