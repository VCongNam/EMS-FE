import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import FeeCard from '../components/FeeCard';
import TransactionHistory from '../components/TransactionHistory';
import PaymentModal from '../components/PaymentModal';
import InvoiceModal from '../components/InvoiceModal';

const MOCK_FEES = [
    { id: 1, code: 'FEE-2026-001', title: 'Học phí Học kỳ 1 - Toán Cao Cấp', amount: 3500000, dueDate: '15/10/2026', status: 'Pending' },
    { id: 2, code: 'FEE-2026-002', title: 'Học phí Học kỳ 1 - Vật Lý Đại Cương', amount: 2800000, dueDate: '20/10/2026', status: 'Pending' },
    { id: 3, code: 'FEE-2026-003', title: 'Lệ phí Giáo trình', amount: 450000, dueDate: '30/09/2026', status: 'Paid' },
    { id: 4, code: 'FEE-2026-004', title: 'Học phí Học kỳ 1 - Hóa Học Cơ Bản', amount: 3100000, dueDate: '05/10/2026', status: 'Overdue' },
];

const MOCK_TRANSACTIONS = [
    { id: 101, amount: 450000, date: '25/09/2026 14:30', method: 'Chuyển khoản Ngân hàng' },
    { id: 102, amount: 1200000, date: '10/08/2026 09:15', method: 'Ví điện tử MoMo' },
];

const StudentTuitionPage = () => {
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
    const [selectedFee, setSelectedFee] = useState(null);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [activeTab, setActiveTab] = useState('fees'); // 'fees' or 'history'

    const handlePay = (fee) => {
        setSelectedFee(fee);
        setIsPaymentOpen(true);
    };

    const handleViewInvoice = (data) => {
        setSelectedInvoice(data);
        setIsInvoiceOpen(true);
    };

    const totalDue = MOCK_FEES.reduce((acc, f) => f.status !== 'Paid' ? acc + f.amount : acc, 0);
    const totalPaid = MOCK_FEES.reduce((acc, f) => f.status === 'Paid' ? acc + f.amount : acc, 0);

    return (
        <div className="!max-w-7xl !mx-auto !space-y-8 !animate-fade-in custom-scrollbar">
            {/* Header / Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                {/* Tổng nợ hiện tại */}
                <div className="!bg-white !border !border-border rounded-2xl !p-6">
                    <p className="text-xs text-text-muted uppercase tracking-widest font-semibold  !mb-3">Tổng nợ hiện tại</p>
                    <p className="text-3xl font-semibold text-text-main !mb-4">
                        {totalDue.toLocaleString('vi-VN')} <span className="text-base text-text-muted">₫</span>
                    </p>
                    <div className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 !border !border-orange-100 rounded-lg px-2.5 py-1.5 text-xs font-semibold">
                        <Icon icon="solar:danger-bold-duotone" className="text-sm" />
                        Trước 15/10/2026
                    </div>
                </div>

                {/* Đã thanh toán */}
                <div className="bg-white !border !border-border rounded-2xl !p-6">
                    <p className="text-xs text-text-muted uppercase tracking-widest font-semibold !mb-3">Đã thanh toán</p>
                    <p className="text-3xl font-semibold text-text-main !mb-4">
                        {totalPaid.toLocaleString('vi-VN')} <span className="text-base text-text-muted">₫</span>
                    </p>
                    <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg px-2.5 py-1.5 text-xs font-semibold">
                        <Icon icon="solar:check-circle-bold-duotone" className="text-sm" />
                        Dựa trên {MOCK_TRANSACTIONS.length} giao dịch
                    </div>
                </div>

                {/* Hóa đơn quá hạn */}
                <div className="bg-white border border-border rounded-2xl !p-6 flex flex-col justify-between gap-4">
                    <div>
                        <p className="text-xs text-text-muted uppercase tracking-widest font-semibold !mb-1.5">Hóa đơn quá hạn</p>
                        <p className="text-sm text-text-muted">Bạn có 1 khoản phí cần xử lý gấp</p>
                    </div>
                    <button className="w-full !px-4 !py-2.5 text-sm font-semibold rounded-xl bg-red-50 text-red-600 !border !border-red-100 hover:!bg-red-100 transition-colors">
                        Xem chi tiết nợ
                    </button>
                </div>

            </div>

            {/* Tab Navigation */}
            <div className="!flex !items-center !gap-1 !p-1.5 !bg-background !rounded-[2rem] !border !border-border !w-fit">
                <button
                    onClick={() => setActiveTab('fees')}
                    className={`!px-8 !py-3.5 !rounded-2xl !text-sm !font-black !flex !items-center !gap-2 !transition-all ${activeTab === 'fees' ? '!bg-white !text-primary !shadow-sm' : '!text-text-muted hover:!text-text-main'
                        }`}
                >
                    <Icon icon="solar:bill-list-bold-duotone" className="!text-lg" />
                    Khoản phí hiện tại
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`!px-8 !py-3.5 !rounded-2xl !text-sm !font-black !flex !items-center !gap-2 !transition-all ${activeTab === 'history' ? '!bg-white !text-primary !shadow-sm' : '!text-text-muted hover:!text-text-main'
                        }`}
                >
                    <Icon icon="solar:history-bold-duotone" className="!text-lg" />
                    Lịch sử giao dịch
                </button>
            </div>

            {/* Content Area */}
            <div className="!space-y-6">
                {activeTab === 'fees' ? (
                    <div className="!grid !grid-cols-1 lg:!grid-cols-2 !gap-6">
                        {MOCK_FEES.filter(f => f.status !== 'Paid').map(fee => (
                            <FeeCard key={fee.id} fee={fee} onPay={handlePay} onViewInvoice={handleViewInvoice} />
                        ))}
                    </div>
                ) : (
                    <TransactionHistory transactions={MOCK_TRANSACTIONS} onViewInvoice={handleViewInvoice} />
                )}

                {/* Secondary Section for Fees tab (Paid items) */}
                {activeTab === 'fees' && (
                    <div className="!pt-8 !space-y-6">
                        <div className="!flex !items-center !gap-4 !px-2">
                            <h3 className="!text-xl !font-black !text-text-main !tracking-tight">Các khoản đã hoàn thành</h3>
                            <div className="!flex-1 !h-px !bg-border !dashed !border-t-2 !border-dashed !border-primary/10" />
                        </div>
                        <div className="!grid !grid-cols-1 lg:!grid-cols-2 !gap-6">
                            {MOCK_FEES.filter(f => f.status === 'Paid').map(fee => (
                                <FeeCard key={fee.id} fee={fee} onViewInvoice={handleViewInvoice} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <PaymentModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                fee={selectedFee}
            />

            <InvoiceModal 
                isOpen={isInvoiceOpen}
                onClose={() => setIsInvoiceOpen(false)}
                data={selectedInvoice}
            />
        </div>
    );
};

export default StudentTuitionPage;
