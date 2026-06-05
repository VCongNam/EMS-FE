import React from 'react';
import { Icon } from '@iconify/react';

const TransactionHistory = ({ transactions, onViewInvoice, onResubmit }) => {
    const getStatusConfig = (status) => {
        const s = status?.toLowerCase();
        if (s === 'pending' || s === 'checking') {
            return { 
                label: 'Đang chờ', 
                color: 'text-amber-700', 
                bg: 'bg-amber-100/50', 
                dot: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
                border: 'border-amber-200'
            };
        }
        if (s === 'approved' || s === 'success' || s === 'paid' || s === 'successful') {
            return { 
                label: 'Đã hoàn thành', 
                color: 'text-emerald-700', 
                bg: 'bg-emerald-100/50', 
                dot: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
                border: 'border-emerald-200'
            };
        }
        if (s === 'failed' || s === 'rejected' || s === 'cancelled') {
            return { 
                label: 'Thất bại', 
                color: 'text-red-700', 
                bg: 'bg-red-100/50', 
                dot: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]',
                border: 'border-red-200'
            };
        }
        return { 
            label: status || 'N/A', 
            color: 'text-gray-700', 
            bg: 'bg-gray-100/50', 
            dot: 'bg-gray-400',
            border: 'border-gray-200'
        };
    };

    return (
        <div className="!space-y-4 !animate-fade-in">
            {/* ── Mobile View (Cards) ─────────────────────────── */}
            <div className="md:!hidden !space-y-4">
                {transactions.map((tx, idx) => {
                    const statusConfig = getStatusConfig(tx.status);
                    const isFailed = ['failed', 'rejected', 'cancelled'].includes(tx.status?.toLowerCase());
                    return (
                        <div key={idx} className="!bg-white !p-6 !rounded-[2rem] !border !border-border !shadow-sm !relative">
                            <div className="!flex !items-center !justify-between !mb-4">
                                <div className="!flex !items-center !gap-3">
                                    <div className="!w-10 !h-10 !rounded-xl !bg-primary/5 !text-primary !flex !items-center !justify-center">
                                        <Icon icon="solar:history-bold-duotone" className="!text-xl" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="!text-xs !font-black !text-text-main line-clamp-1">{tx.content || 'Thanh toán học phí'}</p>
                                        <p className="!text-[10px] !font-bold !text-text-muted">{tx.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="!text-sm !font-black !text-emerald-600 block">+{tx.amount?.toLocaleString('vi-VN')} ₫</span>
                                    <span className={`!text-[10px] !font-bold ${statusConfig.color}`}>{statusConfig.label}</span>
                                </div>
                            </div>
                            
                            <div className="!p-3 !bg-background !rounded-xl !border !border-border !border-dashed !text-[11px] !font-bold !text-text-muted !flex !items-center !justify-between !gap-2">
                                <span className="truncate flex-1 mr-2">Nội dung: {tx.content || 'N/A'}</span>
                                <div className="!flex !items-center !gap-2 flex-shrink-0">
                                    {isFailed && onResubmit && (
                                        <button 
                                            onClick={() => onResubmit(tx)}
                                            className="!text-orange-600 hover:!underline !flex !items-center !gap-1 !font-black"
                                        >
                                            <Icon icon="solar:upload-bold-duotone" />
                                            Nộp lại
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => onViewInvoice && onViewInvoice(tx)}
                                        className="!text-primary hover:!underline !flex !items-center !gap-1"
                                    >
                                        <Icon icon="solar:import-bold-duotone" />
                                        Hóa đơn
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Desktop View (Table) ────────────────────────── */}
            <div className="!hidden md:!block !bg-white !rounded-[2.5rem] !border !border-border !shadow-sm !overflow-hidden">
                <table className="!w-full !text-left">
                    <thead>
                        <tr className="!bg-background/50 !border-b !border-border">
                            <th className="!p-6 !text-[10px] !font-black !text-text-muted !uppercase !tracking-widest">Thời gian</th>
                            <th className="!p-6 !text-[10px] !font-black !text-text-muted !uppercase !tracking-widest">Số tiền</th>
                            <th className="!p-6 !text-[10px] !font-black !text-text-muted !uppercase !tracking-widest">Nội dung</th>
                            <th className="!p-6 !text-[10px] !font-black !text-text-muted !uppercase !tracking-widest">Trạng thái</th>
                            <th className="!p-6 !text-[10px] !font-black !text-text-muted !uppercase !tracking-widest !text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="!divide-y !divide-border">
                        {transactions.map((tx, idx) => {
                            const statusConfig = getStatusConfig(tx.status);
                            const isFailed = ['failed', 'rejected', 'cancelled'].includes(tx.status?.toLowerCase());
                            return (
                                <tr key={idx} className="hover:!bg-background/30 !transition-colors">
                                    <td className="!p-6">
                                        <span className="!text-sm !font-medium !text-text-muted">{tx.date}</span>
                                    </td>
                                    <td className="!p-6">
                                        <span className="!text-sm !font-black !text-emerald-600">+{tx.amount?.toLocaleString('vi-VN')} ₫</span>
                                    </td>
                                    <td className="!p-6">
                                        <span className="!text-sm !font-medium !text-text-muted truncate max-w-[200px] block">{tx.content || 'N/A'}</span>
                                    </td>
                                    <td className="!p-6">
                                        <span className={`!inline-flex !items-center !gap-2 !px-3 !py-1.5 !rounded-xl !text-[11px] !font-black !border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border} !shadow-sm`}>
                                            <div className={`!w-2 !h-2 !rounded-full ${statusConfig.dot}`} />
                                            {statusConfig.label}
                                        </span>
                                    </td>
                                    <td className="!p-6 !text-right">
                                        <div className="!flex !items-center !justify-end !gap-3">
                                            {isFailed && onResubmit && (
                                                <button 
                                                    onClick={() => onResubmit(tx)}
                                                    className="!px-4 !py-2 !bg-orange-50 !text-orange-600 !text-[11px] !font-black !rounded-xl hover:!bg-orange-500 hover:!text-white !transition-all !flex !items-center !justify-center !gap-1.5 !border !border-orange-200 !whitespace-nowrap"
                                                >
                                                    <Icon icon="solar:upload-bold-duotone" />
                                                    Nộp lại
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => onViewInvoice && onViewInvoice(tx)}
                                                className="!px-4 !py-2 !bg-primary/5 !text-primary !text-[11px] !font-black !rounded-xl hover:!bg-primary hover:!text-white !transition-all !flex !items-center !justify-center !gap-1.5 !whitespace-nowrap"
                                            >
                                                <Icon icon="solar:document-text-bold-duotone" />
                                                Chi tiết
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionHistory;
