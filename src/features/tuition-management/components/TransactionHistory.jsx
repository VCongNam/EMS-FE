import React from 'react';
import { Icon } from '@iconify/react';

const TransactionHistory = ({ transactions, onViewInvoice }) => {
    const getStatusConfig = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return { label: 'Đang chờ', color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-500' };
            case 'approved':
            case 'success':
                return { label: 'Thành công', color: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-500' };
            case 'failed':
            case 'rejected':
                return { label: 'Thất bại', color: 'text-red-600', bg: 'bg-red-50', dot: 'bg-red-500' };
            default:
                return { label: status || 'N/A', color: 'text-text-muted', bg: 'bg-background', dot: 'bg-gray-400' };
        }
    };

    return (
        <div className="!space-y-4 !animate-fade-in">
            {/* ── Mobile View (Cards) ─────────────────────────── */}
            <div className="md:!hidden !space-y-4">
                {transactions.map((tx, idx) => {
                    const statusConfig = getStatusConfig(tx.status);
                    return (
                        <div key={idx} className="!bg-white !p-6 !rounded-[2rem] !border !border-border !shadow-sm !relative">
                            <div className="!flex !items-center !justify-between !mb-4">
                                <div className="!flex !items-center !gap-3">
                                    <div className="!w-10 !h-10 !rounded-xl !bg-emerald-50 !text-emerald-600 !flex !items-center !justify-center">
                                        <Icon icon="solar:bank-bold-duotone" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="!text-sm !font-black !text-text-main truncate">#{tx.transactionId?.substring(0, 8)}</h4>
                                        <p className="!text-[10px] !font-bold !text-text-muted">{tx.date}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="!text-sm !font-black !text-emerald-600 block">+{tx.amount?.toLocaleString('vi-VN')} ₫</span>
                                    <span className={`!text-[10px] !font-bold ${statusConfig.color}`}>{statusConfig.label}</span>
                                </div>
                            </div>
                            
                            <div className="!p-3 !bg-background !rounded-xl !border !border-border !border-dashed !text-[11px] !font-bold !text-text-muted !flex !items-center !justify-between">
                                <span className="truncate flex-1 mr-2">Nội dung: {tx.content || 'N/A'}</span>
                                <button 
                                    onClick={() => onViewInvoice && onViewInvoice(tx)}
                                    className="!text-primary hover:!underline !flex !items-center !gap-1 flex-shrink-0"
                                >
                                    <Icon icon="solar:import-bold-duotone" />
                                    Hóa đơn
                                </button>
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
                            <th className="!p-6 !text-[10px] !font-black !text-text-muted !uppercase !tracking-widest">Mã Giao dịch</th>
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
                            return (
                                <tr key={idx} className="hover:!bg-background/30 !transition-colors">
                                    <td className="!p-6">
                                        <span className="!text-sm !font-black !text-text-main">#{tx.transactionId?.substring(0, 8)}</span>
                                    </td>
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
                                        <span className={`!inline-flex !items-center !gap-1.5 !px-2.5 !py-1 !rounded-lg !text-[11px] !font-bold ${statusConfig.bg} ${statusConfig.color}`}>
                                            <div className={`!w-1.5 !h-1.5 !rounded-full ${statusConfig.dot}`} />
                                            {statusConfig.label}
                                        </span>
                                    </td>
                                    <td className="!p-6 !text-right">
                                        <button 
                                            onClick={() => onViewInvoice && onViewInvoice(tx)}
                                            className="!px-4 !py-2 !bg-primary/5 !text-primary !text-[11px] !font-black !rounded-xl hover:!bg-primary hover:!text-white !transition-all !flex !items-center !justify-center !gap-2 !ml-auto"
                                        >
                                            <Icon icon="solar:document-text-bold-duotone" />
                                            Chi tiết
                                        </button>
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
