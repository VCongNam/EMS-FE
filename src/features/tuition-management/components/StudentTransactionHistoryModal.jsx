import React from 'react';
import { Icon } from '@iconify/react';
import { formatViFullDate } from '../../../utils/dateUtils';

const StudentTransactionHistoryModal = ({
    isOpen,
    onClose,
    studentName,
    historyData = [],
    isLoading
}) => {
    if (!isOpen) return null;

    const formatVND = (amount) => amount?.toLocaleString('vi-VN') + ' ₫';

    const getStatusStyle = (status) => {
        const s = status?.toLowerCase();
        if (s === 'successful' || s === 'completed') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        if (s === 'pending') return 'bg-amber-50 text-amber-600 border-amber-100';
        if (s === 'failed' || s === 'rejected') return 'bg-red-50 text-red-600 border-red-100';
        return 'bg-slate-50 text-slate-600 border-slate-100';
    };

    const getStatusLabel = (status) => {
        const s = status?.toLowerCase();
        if (s === 'successful' || s === 'completed') return 'Thành công';
        if (s === 'pending') return 'Chờ duyệt';
        if (s === 'failed' || s === 'rejected') return 'Thất bại';
        return status;
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center !p-4">
            <div className="absolute inset-0 !bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative !bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden animate-zoom-in flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="!p-6 border-b border-border flex items-center justify-between !bg-slate-50 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 !bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Icon icon="solar:history-bold-duotone" className="text-white text-xl" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-text-main tracking-tight leading-tight">
                                Lịch sử giao dịch
                            </h2>
                            <p className="text-xs text-text-muted !mt-0.5 font-bold">
                                Học sinh: {studentName}
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="!p-2 hover:!bg-slate-200 rounded-full transition-colors"
                    >
                        <Icon icon="solar:close-circle-bold" className="text-2xl text-text-muted" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar !p-6">
                    {isLoading ? (
                        <div className="!py-20 text-center flex flex-col items-center gap-3">
                            <Icon icon="line-md:loading-loop" className="text-4xl text-primary" />
                            <p className="text-sm font-bold text-text-muted">Đang tải lịch sử...</p>
                        </div>
                    ) : historyData.length === 0 ? (
                        <div className="!py-20 text-center flex flex-col items-center gap-3 opacity-40">
                            <Icon icon="solar:document-text-bold-duotone" className="text-6xl" />
                            <p className="text-lg font-bold">Chưa có giao dịch nào</p>
                        </div>
                    ) : (
                        <div className="!space-y-4">
                            {historyData.map((tx, index) => (
                                <div key={tx.transactionId || index} className="!p-5 rounded-2xl border border-border !bg-background hover:border-primary/30 transition-all group">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl !bg-slate-100 flex items-center justify-center shrink-0">
                                                <Icon 
                                                    icon={tx.paymentMethod === 'Bank Transfer' ? 'solar:card-transfer-bold-duotone' : 'solar:wallet-money-bold-duotone'} 
                                                    className="text-2xl text-slate-500" 
                                                />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 !mb-1">
                                                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black border uppercase ${getStatusStyle(tx.status)}`}>
                                                        {getStatusLabel(tx.status)}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-text-muted">
                                                        {formatViFullDate(tx.paidDate)}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-black text-text-main group-hover:text-primary transition-colors">
                                                    {tx.invoiceDescription || `Thanh toán học phí tháng ${tx.periodMonth}/${tx.periodYear}`}
                                                </p>
                                                <p className="text-xs text-text-muted font-medium">
                                                    Phương thức: {tx.paymentMethod}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Số tiền</p>
                                                <p className="text-lg font-black text-text-main">
                                                    {formatVND(tx.amountPaid)}
                                                </p>
                                            </div>
                                            
                                            {tx.proofImageUrl && (
                                                <a 
                                                    href={tx.proofImageUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1.5 !px-3 !py-1.5 rounded-xl !bg-blue-50 text-blue-600 text-[11px] font-black hover:!bg-blue-600 hover:text-white transition-all shadow-sm"
                                                >
                                                    <Icon icon="solar:image-bold-duotone" />
                                                    Xem minh chứng
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="!p-6 border-t border-border !bg-slate-50 shrink-0">
                    <button 
                        onClick={onClose}
                        className="w-full !py-3 !bg-white border border-border rounded-xl text-sm font-black text-text-muted hover:!bg-slate-100 transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentTransactionHistoryModal;
