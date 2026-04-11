import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../components/common/Modal';
import { tuitionService } from '../api/tuitionService';
import useAuthStore from '../../../store/authStore';

const InvoiceModal = ({ isOpen, onClose, data, onPay }) => {
    const { user } = useAuthStore();
    const [invoiceDetail, setInvoiceDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!isOpen || !data?.id || !user?.token) return;
            setIsLoading(true);
            try {
                const res = await tuitionService.getInvoiceDetail(data.id, user.token);
                if (res.ok) {
                    const result = await res.json();
                    setInvoiceDetail(result.data);
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
    const isPaid = displayData.statusDisplay === 'Đã nộp' || displayData.status === 'Paid';
    const amount = displayData.totalAmount || displayData.amount || 0;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Hóa đơn Điện tử" maxWidth="lg">
            <div className="!p-8 !space-y-8 !bg-white !relative !overflow-hidden">
                {/* Watermark */}
                <div className="!absolute !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !opacity-[0.03] !pointer-events-none !rotate-12">
                    <Icon icon="material-symbols:school" className="!text-[400px]" />
                </div>

                {isLoading ? (
                    <div className="!flex !justify-center !items-center !py-20 text-text-muted">
                        <Icon icon="solar:spinner-linear" className="!animate-spin !text-4xl" />
                    </div>
                ) : (
                    <>
                        {/* Invoice Header */}
                        <div className="!flex !justify-between !items-start !border-b-2 !border-primary/10 !pb-6 !relative !z-10">
                            <div className="!flex !items-center !gap-4">
                                <div className="!w-16 !h-16 !bg-primary !rounded-2xl !flex !items-center !justify-center !shadow-lg !shadow-primary/20">
                                    <Icon icon="material-symbols:school" className="!text-3xl !text-white" />
                                </div>
                                <div>
                                    <h2 className="!text-2xl !font-black !text-text-main !tracking-tighter">EMS Education</h2>
                                    <p className="!text-xs !font-bold !text-text-muted">Hệ thống Quản lý Giáo dục Thông minh</p>
                                    <p className="!text-[10px] !text-text-muted !mt-1">MST: 0101234567 | Hotline: 1900 1234</p>
                                </div>
                            </div>
                            <div className="!text-right">
                                {isPaid ? (
                                    <div className="!px-4 !py-1 !bg-emerald-50 !text-emerald-600 !border !border-emerald-100 !rounded-full !text-[10px] !font-black !uppercase !tracking-widest !inline-block !mb-2">
                                        Đã thanh toán
                                    </div>
                                ) : (
                                    <div className="!px-4 !py-1 !bg-orange-50 !text-orange-600 !border !border-orange-100 !rounded-full !text-[10px] !font-black !uppercase !tracking-widest !inline-block !mb-2">
                                        Chưa thanh toán
                                    </div>
                                )}
                                <p className="!text-xs !font-bold !text-text-main">Mẫu số: 01GTKT0/001</p>
                                <p className="!text-xs !text-text-muted">Ký hiệu: EMS/26E</p>
                            </div>
                        </div>

                        {/* Invoice Title */}
                        <div className="!text-center !space-y-1 !relative !z-10">
                            <h1 className="!text-2xl !font-black !text-text-main !uppercase !tracking-[0.2em]">Hóa đơn học phí</h1>
                            <p className="!text-sm !font-bold !text-text-muted">Số: INV-{displayData.invoiceId || data.id || data.code}</p>
                            <p className="!text-xs !text-text-muted italic">Ngày {new Date().toLocaleDateString('vi-VN')}</p>
                        </div>

                        {/* Customer Info */}
                        <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-8 !p-6 !bg-background !rounded-3xl !border !border-border !border-dashed !relative !z-10">
                            <div className="!space-y-3">
                                <p className="!text-[10px] !font-black !text-text-muted !uppercase !tracking-widest">Thông tin hóa đơn</p>
                                <div>
                                    <h4 className="!text-sm !font-black !text-text-main">Nội dung: {displayData.title || data.title}</h4>
                                    <p className="!text-xs !font-medium !text-text-muted !mt-1">Kỳ: {displayData.period || 'Chưa xác định'}</p>
                                    <p className="!text-[10px] !font-medium !text-red-500 !mt-1">Hạn nộp: {displayData.dueDate ? new Date(displayData.dueDate).toLocaleDateString('vi-VN') : 'N/A'}</p>
                                </div>
                            </div>
                            <div className="!space-y-3 md:!text-right">
                                <p className="!text-[10px] !font-black !text-text-muted !uppercase !tracking-widest">Trạng thái</p>
                                <div>
                                    <h4 className={`!text-sm !font-black ${isPaid ? '!text-emerald-600' : '!text-orange-600'}`}>{displayData.statusDisplay || data.statusDisplay || 'N/A'}</h4>
                                </div>
                            </div>
                        </div>

                        {/* Invoice Table */}
                        <div className="!relative !z-10">
                            <table className="!w-full">
                                <thead>
                                    <tr className="!border-b-2 !border-primary/10">
                                        <th className="!text-left !py-4 !text-xs !font-black !text-text-muted !uppercase !tracking-widest">Chi tiết</th>
                                        <th className="!text-right !py-4 !text-xs !font-black !text-text-muted !uppercase !tracking-widest">Giá trị</th>
                                    </tr>
                                </thead>
                                <tbody className="!divide-y !divide-border">
                                    <tr>
                                        <td className="!py-4">
                                            <h5 className="!text-sm !font-bold !text-text-main">Số buổi học</h5>
                                        </td>
                                        <td className="!text-right !py-4 !font-medium !text-text-main">
                                            {displayData.totalSessions || 0} buổi
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="!py-4">
                                            <h5 className="!text-sm !font-bold !text-text-main">Đơn giá 1 buổi</h5>
                                        </td>
                                        <td className="!text-right !py-4 !font-medium !text-text-main">
                                            {(displayData.unitPrice || 0).toLocaleString('vi-VN')} ₫
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="!py-4">
                                            <h5 className="!text-sm !font-bold !text-text-main">Tổng học phí</h5>
                                        </td>
                                        <td className="!text-right !py-4 !font-black !text-primary">
                                            {amount.toLocaleString('vi-VN')} ₫
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Action Buttons */}
                        <div className="!flex !items-center !gap-3 !pt-6 !border-t !border-border !relative !z-10 no-print">
                            <button 
                                onClick={printInvoice}
                                className="!flex-1 !px-6 !py-3 !bg-background !text-text-main !border !border-border !rounded-xl !text-sm !font-black hover:!bg-border !transition-all !flex !items-center !justify-center !gap-2"
                            >
                                <Icon icon="solar:printer-bold-duotone" className="!text-lg" />
                                In hóa đơn
                            </button>
                            {displayData.canPay && onPay && (
                                <button 
                                    onClick={() => {
                                        onClose();
                                        onPay(displayData);
                                    }}
                                    className="!flex-1 !px-6 !py-3 !bg-primary !text-white !rounded-xl !text-sm !font-black !shadow-lg !shadow-primary/20 hover:!bg-primary/90 !transition-all !flex !items-center !justify-center !gap-2"
                                >
                                    <Icon icon="solar:wallet-bold-duotone" className="!text-lg" />
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
