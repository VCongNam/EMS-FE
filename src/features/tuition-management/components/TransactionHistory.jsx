import React from 'react';
import { Icon } from '@iconify/react';

const TransactionHistory = ({ transactions, onViewInvoice }) => {
    return (
        <div className="!space-y-4 !animate-fade-in">
            {/* ── Mobile View (Cards) ─────────────────────────── */}
            <div className="md:!hidden !space-y-4">
                {transactions.map((tx, idx) => (
                    <div key={idx} className="!bg-white !p-6 !rounded-[2rem] !border !border-border !shadow-sm !relative">
                        <div className="!flex !items-center !justify-between !mb-4">
                            <div className="!flex !items-center !gap-3">
                                <div className="!w-10 !h-10 !rounded-xl !bg-emerald-50 !text-emerald-600 !flex !items-center !justify-center">
                                    <Icon icon="solar:bank-bold-duotone" />
                                </div>
                                <div>
                                    <h4 className="!text-sm !font-black !text-text-main">Thanh toán #TXN-{tx.id}</h4>
                                    <p className="!text-[10px] !font-bold !text-text-muted">{tx.date}</p>
                                </div>
                            </div>
                            <span className="!text-sm !font-black !text-emerald-600">+{tx.amount.toLocaleString('vi-VN')} ₫</span>
                        </div>
                        
                        <div className="!p-3 !bg-background !rounded-xl !border !border-border !border-dashed !text-[11px] !font-bold !text-text-muted !flex !items-center !justify-between">
                            <span>Phương thức: {tx.method}</span>
                            <button 
                                onClick={() => onViewInvoice && onViewInvoice(tx)}
                                className="!text-primary hover:!underline !flex !items-center !gap-1"
                            >
                                <Icon icon="solar:import-bold-duotone" />
                                Hóa đơn
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Desktop View (Table) ────────────────────────── */}
            <div className="!hidden md:!block !bg-white !rounded-[2.5rem] !border !border-border !shadow-sm !overflow-hidden">
                <table className="!w-full !text-left">
                    <thead>
                        <tr className="!bg-background/50 !border-b !border-border">
                            <th className="!p-6 !text-[10px] !font-black !text-text-muted !uppercase !tracking-widest">Mã Giao dịch</th>
                            <th className="!p-6 !text-[10px] !font-black !text-text-muted !uppercase !tracking-widest">Thời gian</th>
                            <th className="!p-6 !text-[10px] !font-black !text-text-muted !uppercase !tracking-widest">Số tiền</th>
                            <th className="!p-6 !text-[10px] !font-black !text-text-muted !uppercase !tracking-widest">PT Thanh toán</th>
                            <th className="!p-6 !text-[10px] !font-black !text-text-muted !uppercase !tracking-widest !text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="!divide-y !divide-border">
                        {transactions.map((tx, idx) => (
                            <tr key={idx} className="hover:!bg-background/30 !transition-colors">
                                <td className="!p-6">
                                    <span className="!text-sm !font-black !text-text-main">#TXN-{tx.id}</span>
                                </td>
                                <td className="!p-6">
                                    <span className="!text-sm !font-medium !text-text-muted">{tx.date}</span>
                                </td>
                                <td className="!p-6">
                                    <span className="!text-sm !font-black !text-emerald-600">+{tx.amount.toLocaleString('vi-VN')} ₫</span>
                                </td>
                                <td className="!p-6">
                                    <div className="!flex !items-center !gap-2 !text-sm !font-bold !text-text-main">
                                        <Icon icon="solar:card-2-bold-duotone" className="!text-primary" />
                                        {tx.method}
                                    </div>
                                </td>
                                <td className="!p-6 !text-right">
                                    <button 
                                        onClick={() => onViewInvoice && onViewInvoice(tx)}
                                        className="!px-4 !py-2 !bg-primary/5 !text-primary !text-[11px] !font-black !rounded-xl hover:!bg-primary hover:!text-white !transition-all !flex !items-center !justify-center !gap-2 !ml-auto"
                                    >
                                        <Icon icon="solar:document-text-bold-duotone" />
                                        Hóa đơn (PDF)
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionHistory;
