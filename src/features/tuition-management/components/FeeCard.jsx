import React from 'react';
import { Icon } from '@iconify/react';

const STATUS_CONFIG = {
    Paid: { label: 'Đã thanh toán', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: 'solar:check-read-bold' },
    Pending: { label: 'Chưa thanh toán', color: 'text-amber-600', bg: 'bg-amber-50', icon: 'solar:clock-circle-bold' },
    Overdue: { label: 'Quá hạn', color: 'text-red-500', bg: 'bg-red-50', icon: 'solar:danger-bold' },
};

const FeeCard = ({ fee, onPay, onViewInvoice }) => {
    const status = STATUS_CONFIG[fee.status] || STATUS_CONFIG.Pending;

    return (
        <div className="!bg-white !p-6 !rounded-[2rem] !border !border-border !shadow-sm hover:!shadow-md hover:!border-primary/20 !transition-all !group">
            <div className="!flex !flex-col sm:!flex-row !justify-between !items-start sm:!items-center !gap-4">
                <div className="!flex !items-center !gap-4">
                    <div className="!w-12 !h-12 !rounded-2xl !bg-primary/10 !text-primary !flex !items-center !justify-center">
                        <Icon icon="solar:bill-list-bold-duotone" className="!text-2xl" />
                    </div>
                    <div>
                        <h4 className="!text-lg !font-black !text-text-main !tracking-tight">{fee.title}</h4>
                        <p className="!text-xs !font-bold !text-text-muted mt-0.5">Mã đơn: {fee.code}</p>
                    </div>
                </div>

                <div className={`!px-3 !py-1.5 !rounded-full !text-[10px] !font-black !uppercase !tracking-wider !flex !items-center !gap-1.5 ${status.bg} ${status.color}`}>
                    <Icon icon={status.icon} />
                    {status.label}
                </div>
            </div>

            <div className="!grid !grid-cols-2 !gap-6 !mt-6 !p-4 !bg-background !rounded-2xl !border !border-border !border-dashed">
                <div>
                    <span className="!text-[10px] !font-black !text-text-muted !uppercase !tracking-wider">Số tiền</span>
                    <p className="!text-lg !font-black !text-primary !mt-1">
                        {fee.amount.toLocaleString('vi-VN')} ₫
                    </p>
                </div>
                <div>
                    <span className="!text-[10px] !font-black !text-text-muted !uppercase !tracking-wider">Hạn thanh toán</span>
                    <p className="!text-sm !font-black !text-text-main !mt-1">{fee.dueDate}</p>
                </div>
            </div>

            <div className="!mt-6 !flex !items-center !gap-3">
                {fee.status !== 'Paid' ? (
                    <button 
                        onClick={() => onPay(fee)}
                        className="!flex-1 !px-6 !py-3.5 !bg-primary !text-white !rounded-xl !text-sm !font-black !shadow-lg !shadow-primary/20 hover:!bg-primary/90 !transition-all !flex !items-center !justify-center !gap-2"
                    >
                        <Icon icon="solar:card-2-bold" className="!text-lg" />
                        Thanh toán ngay
                    </button>
                ) : (
                    <button 
                        onClick={() => onViewInvoice && onViewInvoice(fee)}
                        className="!flex-1 !px-6 !py-3.5 !bg-emerald-50 !text-emerald-600 !border !border-emerald-100 !rounded-xl !text-sm !font-black hover:!bg-emerald-100 !transition-all !flex !items-center !justify-center !gap-2"
                    >
                        <Icon icon="solar:document-text-bold-duotone" className="!text-lg" />
                        Xem hóa đơn
                    </button>
                )}
                
                <button 
                    onClick={() => onViewInvoice && onViewInvoice(fee)}
                    className="!p-3.5 !bg-white !border !border-border !rounded-xl !text-text-muted hover:!text-primary hover:!border-primary/30 !transition-all"
                >
                    <Icon icon="solar:magnifer-zoom-in-bold-duotone" className="!text-xl" />
                </button>
            </div>
        </div>
    );
};

export default FeeCard;
