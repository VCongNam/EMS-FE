import React from 'react';
import { Icon } from '@iconify/react';
import { formatViFullDate } from '../../../utils/dateUtils';


const STATUS_CONFIG = {
    Paid: { label: 'Đã thanh toán', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: 'solar:check-read-bold' },
    Pending: { label: 'Chưa thanh toán', color: 'text-amber-600', bg: 'bg-amber-50', icon: 'solar:clock-circle-bold' },
    Overdue: { label: 'Quá hạn', color: 'text-red-500', bg: 'bg-red-50', icon: 'solar:danger-bold' },
    Checking: { label: 'Đang chờ xác nhận', color: 'text-blue-600', bg: 'bg-blue-50', icon: 'solar:refresh-square-bold-duotone' },
};

const FeeCard = ({ fee, onPay, onViewInvoice }) => {
    const status = STATUS_CONFIG[fee.status] || STATUS_CONFIG.Pending;

    return (
        <div className="!bg-white !p-4 sm:!p-5 !rounded-2xl !border !border-border !shadow-sm hover:!shadow-md hover:!border-primary/20 !transition-all !group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Icon and Name */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-2xl !bg-primary/5 text-primary flex items-center justify-center shrink-0">
                        <Icon icon="solar:bill-list-bold-duotone" className="text-2xl" />
                    </div>
                    <div className="min-w-0">
                        <h4 className="text-base font-bold text-text-main tracking-tight truncate group-hover:text-primary transition-colors" title={fee.title}>
                            {fee.title}
                        </h4>
                        <div className="flex items-center gap-2 !mt-1">
                            <span className="w-1 h-1 rounded-full !bg-border" />
                            <span className={`!px-2.5 !py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${status.bg} ${status.color} border ${status.border}`}>
                                <Icon icon={status.icon} className="text-xs" />
                                {status.label}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Middle: Amount and Due Date */}
                <div className="flex items-center gap-6 md:gap-10 !px-4 md:!px-0 !py-3 md:!py-0 !bg-background/50 md:!bg-transparent rounded-xl border border-dashed border-border md:border-none">
                    <div className="flex-1 md:flex-none">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Số tiền</span>
                        <p className="text-base font-bold text-primary !mt-0.5">
                            {fee.amount.toLocaleString('vi-VN')} ₫
                        </p>
                    </div>
                    <div className="flex-1 md:flex-none">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                            {fee.status === 'Paid' ? 'Hạn thanh toán' : 'Hạn thanh toán'}
                        </span>
                        <p className="text-sm font-bold text-text-main !mt-0.5">{fee.dueDate ? formatViFullDate(fee.dueDate) : 'N/A'}</p>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 shrink-0">
                    {fee.canPay ? (
                        <button 
                            onClick={() => onPay(fee)}
                            className="!px-5 !py-2.5 !bg-primary !text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/10 hover:!bg-primary-hover !transition-all flex items-center justify-center gap-1.5"
                        >
                            <Icon icon="solar:card-2-bold" className="text-base" />
                            Thanh toán ngay
                        </button>
                    ) : fee.status === 'Paid' ? (
                        <button 
                            onClick={() => onViewInvoice && onViewInvoice(fee)}
                            className="!px-5 !py-2.5 !bg-emerald-50 !text-emerald-600 border border-emerald-100 rounded-xl text-xs font-bold hover:!bg-emerald-100 !transition-all flex items-center justify-center gap-1.5"
                        >
                            <Icon icon="solar:document-text-bold-duotone" className="text-base" />
                            Xem phiếu thu
                        </button>
                    ) : fee.status === 'Checking' ? (
                        <div className="!px-5 !py-2.5 !bg-blue-50 !text-blue-600 border border-blue-100 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
                            <Icon icon="solar:refresh-square-bold-duotone" className="text-base animate-pulse" />
                            Đang chờ duyệt
                        </div>
                    ) : null}
                    
                    <button 
                        onClick={() => onViewInvoice && onViewInvoice(fee)}
                        className="!p-2.5 !bg-white border border-border rounded-xl text-text-muted hover:!text-primary hover:!border-primary/30 !transition-all shadow-sm"
                        title="Xem chi tiết"
                    >
                        <Icon icon="solar:magnifer-zoom-in-bold-duotone" className="text-lg" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeeCard;
