import React from 'react';
import { Icon } from '@iconify/react';

const MOCK_HISTORY = [
    { id: 'TRX001', date: '2026-03-25 10:30', amount: 500000, method: 'Chuyển khoản', status: 'Success', staff: 'Nguyễn Admin' },
    { id: 'TRX002', date: '2026-03-10 14:15', amount: 1000000, method: 'Tiền mặt', status: 'Success', staff: 'Trần Thu Ngân' },
    { id: 'TRX003', date: '2026-03-05 09:00', amount: 500000, method: 'Ví điện tử', status: 'Success', staff: 'Hệ thống' },
];

const TransactionHistoryModal = ({ isOpen, onClose, student }) => {
    if (!isOpen || !student) return null;

    return (
        <div className="!fixed !inset-0 !z-[100] !flex !items-center !justify-center !p-4 !sm:!p-6 !animate-fade-in">
            {/* Backdrop */}
            <div 
                className="!absolute !inset-0 !bg-text-main/40 !backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="!relative !bg-white !w-full !max-w-2xl !rounded-[2.5rem] !shadow-2xl !border !border-white/20 !overflow-hidden !animate-scale-up">
                {/* Header */}
                <div className="!px-8 !py-6 !bg-background/50 !border-b !border-border !flex !items-center !justify-between">
                    <div className="!flex !items-center !gap-4">
                        <div className="!w-12 !h-12 !bg-primary/10 !rounded-2xl !flex !items-center !justify-center !text-primary">
                            <Icon icon="solar:history-bold-duotone" className="!text-2xl" />
                        </div>
                        <div>
                            <h2 className="!text-xl !font-black !text-text-main !tracking-tight">Lịch sử giao dịch</h2>
                            <p className="!text-sm !font-medium !text-text-muted">Học sinh: {student.name} ({student.id})</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="!p-3 !bg-white !border !border-border !rounded-xl hover:!bg-red-50 hover:!text-red-500 !transition-all !group"
                    >
                        <Icon icon="solar:close-circle-bold-duotone" className="!text-xl" />
                    </button>
                </div>

                {/* Body */}
                <div className="!p-8 !max-h-[60vh] !overflow-y-auto custom-scrollbar">
                    <div className="!space-y-4">
                        {MOCK_HISTORY.map((item, idx) => (
                            <div key={item.id} className="!relative !pl-8 !pb-6 !last:!pb-0 !group">
                                {/* Timeline Line */}
                                {idx !== MOCK_HISTORY.length - 1 && (
                                    <div className="!absolute !left-[11px] !top-6 !bottom-0 !w-0.5 !bg-border group-hover:!bg-primary/20 !transition-all" />
                                )}
                                
                                {/* Timeline Dot */}
                                <div className="!absolute !left-0 !top-1 !w-6 !h-6 !rounded-full !bg-white !border-2 !border-primary !flex !items-center !justify-center !z-10">
                                    <div className="!w-1.5 !h-1.5 !rounded-full !bg-primary" />
                                </div>

                                <div className="!bg-white !rounded-3xl !border !border-border !p-5 !shadow-sm hover:!shadow-md hover:!border-primary/20 !transition-all">
                                    <div className="!flex !flex-col sm:!flex-row !justify-between !gap-4">
                                        <div>
                                            <div className="!flex !items-center !gap-2 !mb-1">
                                                <span className="!text-xs !font-black !text-text-muted">{item.date}</span>
                                                <span className="!inline-flex !px-2 !py-0.5 !bg-emerald-50 !text-emerald-600 !rounded-lg !text-[10px] !font-black !uppercase">Thành công</span>
                                            </div>
                                            <h4 className="!text-base !font-black !text-text-main">
                                                +{item.amount.toLocaleString('vi-VN')} ₫
                                            </h4>
                                            <div className="!flex !items-center !gap-4 !mt-2">
                                                <div className="!flex !items-center !gap-1.5 !text-xs !font-bold !text-text-muted">
                                                    <Icon icon="solar:card-2-bold" className="!text-primary" />
                                                    {item.method}
                                                </div>
                                                <div className="!flex !items-center !gap-1.5 !text-xs !font-bold !text-text-muted">
                                                    <Icon icon="solar:user-bold" className="!text-primary" />
                                                    {item.staff}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="!text-right !flex !items-start !justify-end sm:!block">
                                            <div className="!px-3 !py-1 !bg-background !border !border-border !rounded-lg !text-[10px] !font-black !text-text-muted !uppercase !tracking-wider">
                                                #{item.id}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {MOCK_HISTORY.length === 0 && (
                        <div className="!py-10 !text-center !opacity-40">
                            <Icon icon="solar:ghost-bold" className="!text-4xl !mx-auto !mb-2" />
                            <p className="!font-bold">Chưa có lịch sử giao dịch</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="!px-8 !py-6 !bg-background/30 !border-t !border-border !flex !justify-end">
                    <button
                        onClick={onClose}
                        className="!px-8 !py-3 !bg-white !border !border-border !rounded-2xl !text-sm !font-black hover:!bg-background !transition-all"
                    >
                        Đóng lại
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionHistoryModal;
