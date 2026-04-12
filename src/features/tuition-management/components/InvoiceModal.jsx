import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../components/common/Modal';
import { tuitionService } from '../api/tuitionServiceStudent';
import useAuthStore from '../../../store/authStore';

const InvoiceModal = ({ isOpen, onClose, data, onPay }) => {
    const { user } = useAuthStore();
    const [invoiceDetail, setInvoiceDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!isOpen || !data?.invoiceId || !user?.token) return;
            setIsLoading(true);
            try {
                const res = await tuitionService.getInvoiceDetail(data.invoiceId, user.token);
                if (res.ok) {
                    const result = await res.json();
                    setInvoiceDetail(result.data || result);
                }
            } catch (error) {
                console.error("Error fetching invoice detail:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen) {
            fetchDetail();
        } else {
            setInvoiceDetail(null);
        }
    }, [isOpen, data, user?.token]);

    if (!data) return null;

    const printInvoice = () => {
        window.print();
    };

    // Use fetched data, fallback to basic passed data
    const displayData = invoiceDetail || data;
    const isPaid = displayData.statusDisplay === 'Đã nộp';
    const amount = displayData.totalAmount || displayData.amount || 0;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Chi tiết Học phí" maxWidth="md">
            <div className="!p-6 !space-y-6 !bg-white">
                {isLoading ? (
                    <div className="!flex !justify-center !items-center !py-20 text-text-muted">
                        <Icon icon="solar:spinner-linear" className="!animate-spin !text-4xl" />
                    </div>
                ) : (
                    <>
                        {/* Header Section */}
                        <div className="!flex !justify-between !items-start !border-b !border-border !pb-6">
                            <div className="!flex !items-center !gap-4">
                                <div className="!w-14 !h-14 !bg-primary/10 !text-primary !rounded-2xl !flex !items-center !justify-center">
                                    <Icon icon="solar:bill-list-bold-duotone" className="!text-3xl" />
                                </div>
                                <div>
                                    <h2 className="!text-lg !font-black !text-text-main">Hóa đơn Học phí</h2>
                                    <p className="!text-xs !font-bold !text-text-muted">Số: INV-{displayData.invoiceID || displayData.invoiceId || data.id}</p>
                                </div>
                            </div>
                            <div className="!text-right">
                                <span className={`!inline-flex !items-center !gap-1.5 !px-3 !py-1.5 !rounded-lg !text-[10px] !font-black !uppercase !tracking-wider ${isPaid ? '!bg-emerald-50 !text-emerald-600' : '!bg-amber-50 !text-amber-600'}`}>
                                    <div className={`!w-1.5 !h-1.5 !rounded-full ${isPaid ? '!bg-emerald-500' : '!bg-amber-500'}`} />
                                    {displayData.statusDisplay || (isPaid ? 'Đã thanh toán' : 'Chưa thanh toán')}
                                </span>
                                <p className="!text-[10px] !text-text-muted !mt-2 !font-bold">Ngày {new Date().toLocaleDateString('vi-VN')}</p>
                            </div>
                        </div>

                        {/* Summary Info */}
                        <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-6 !p-5 !bg-background !rounded-2xl !border !border-border !border-dashed">
                            <div className="!space-y-3">
                                <p className="!text-[10px] !font-black !text-text-muted !uppercase !tracking-widest">Nội dung học phí</p>
                                <div>
                                    <h4 className="!text-sm !font-black !text-text-main !leading-snug">{displayData.title || data.title}</h4>
                                    <p className="!text-xs !font-bold !text-text-muted !mt-1">Kỳ học: {displayData.period || data.period || 'Chưa xác định'}</p>
                                </div>
                            </div>
                            <div className="!space-y-3 md:!text-right">
                                <p className="!text-[10px] !font-black !text-text-muted !uppercase !tracking-widest">Hạn thanh toán</p>
                                <p className="!text-sm !font-black !text-red-500">
                                    {displayData.dueDate ? new Date(displayData.dueDate).toLocaleDateString('vi-VN') : 'N/A'}
                                </p>
                            </div>
                        </div>

                        {/* Details Table */}
                        <div className="!bg-white !rounded-2xl !border !border-border !overflow-hidden">
                            <table className="!w-full !text-left !border-collapse">
                                <thead>
                                    <tr className="!bg-background !border-b !border-border">
                                        <th className="!px-4 !py-3 !text-[10px] !font-black !text-text-muted !uppercase !tracking-widest">Chi tiết khoản phí</th>
                                        <th className="!px-4 !py-3 !text-[10px] !font-black !text-text-muted !uppercase !tracking-widest !text-right">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody className="!divide-y !divide-border">
                                    <tr>
                                        <td className="!px-4 !py-4">
                                            <p className="!text-sm !font-bold !text-text-main">Số buổi học</p>
                                            <p className="!text-[11px] !text-text-muted">Tổng số buổi trong kỳ</p>
                                        </td>
                                        <td className="!px-4 !py-4 !text-right !text-sm !font-black !text-text-main">
                                            {displayData.totalSessions || 0} buổi
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="!px-4 !py-4">
                                            <p className="!text-sm !font-bold !text-text-main">Đơn giá</p>
                                            <p className="!text-[11px] !text-text-muted">Tính theo 01 buổi học</p>
                                        </td>
                                        <td className="!px-4 !py-4 !text-right !text-sm !font-black !text-text-main">
                                            {(displayData.unitPrice || 0).toLocaleString('vi-VN')} ₫
                                        </td>
                                    </tr>
                                    <tr className="!bg-primary/5">
                                        <td className="!px-4 !py-5">
                                            <p className="!text-sm !font-black !text-primary">Tổng cộng</p>
                                        </td>
                                        <td className="!px-4 !py-5 !text-right !text-lg !font-black !text-primary">
                                            {amount.toLocaleString('vi-VN')} ₫
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Action Buttons */}
                        <div className="!flex !items-center !gap-3 !pt-2 no-print">
                            <button
                                onClick={onClose}
                                className="!flex-1 !px-6 !py-3 !bg-background !text-text-main !border !border-border !rounded-xl !text-sm !font-black hover:!bg-border !transition-all"
                            >
                                Đóng
                            </button>
                            {displayData.canPay && onPay && (
                                <button
                                    onClick={() => {
                                        onClose();
                                        onPay(displayData);
                                    }}
                                    className="!flex-2 !px-8 !py-3 !bg-primary !text-white !rounded-xl !text-sm !font-black !shadow-lg !shadow-primary/20 hover:!bg-primary/90 !transition-all !flex !items-center !justify-center !gap-2"
                                >
                                    <Icon icon="solar:card-send-bold-duotone" className="!text-lg" />
                                    Thanh toán ngay
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default InvoiceModal;
