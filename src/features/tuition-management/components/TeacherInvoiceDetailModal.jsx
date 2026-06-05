import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../components/common/Modal';
import { tuitionService } from '../api/tuitionService';
import useAuthStore from '../../../store/authStore';

const TeacherInvoiceDetailModal = ({ isOpen, onClose, data, onExtend }) => {
    const { user } = useAuthStore();
    const [invoiceDetail, setInvoiceDetail] = useState(null);
    const [qrData, setQrData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingQr, setIsLoadingQr] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!isOpen || !data?.invoiceId || !user?.token) return;
            
            setIsLoading(true);
            setIsLoadingQr(true);
            try {
                // Fetch details
                const resDetail = await tuitionService.getInvoiceDetail(data.invoiceId, user.token);
                if (resDetail.ok) {
                    const result = await resDetail.json();
                    setInvoiceDetail(result.data || result);
                }

                // Fetch QR
                const studentId = data.studentId || data.id;
                const resQr = await tuitionService.getPaymentQr(data.invoiceId, studentId, user.token);
                if (resQr.ok) {
                    const qrResult = await resQr.json();
                    setQrData(qrResult.data || qrResult);
                }
            } catch (error) {
                console.error("Error fetching invoice details:", error);
            } finally {
                setIsLoading(false);
                setIsLoadingQr(false);
            }
        };

        if (isOpen) {
            fetchData();
        } else {
            setInvoiceDetail(null);
            setQrData(null);
        }
    }, [isOpen, data, user?.token]);

    if (!data) return null;

    const displayData = invoiceDetail || data;
    const isPaid = displayData.statusDisplay === 'Đã nộp' || displayData.status === 'Paid';
    const amount = displayData.totalAmount || displayData.amount || data.totalAmount || 0;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Chi tiết Hóa đơn (Giáo viên)" maxWidth="md">
            <div className="!p-6 !space-y-6 !bg-white">
                {isLoading ? (
                    <div className="!flex !flex-col !justify-center !items-center !py-20 text-text-muted">
                        <Icon icon="solar:spinner-linear" className="!animate-spin !text-4xl" />
                        <p className="mt-2">Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    <>
                        {/* Header Section */}
                        <div className="!flex !justify-between !items-start !border-b !border-border !pb-6">
                            <div className="!flex !items-center !gap-4">
                                <div className="!w-14 !h-14 !bg-blue-50 !text-blue-500 !rounded-2xl !flex !items-center !justify-center">
                                    <Icon icon="solar:bill-check-bold-duotone" className="!text-3xl" />
                                </div>
                                <div>
                                    <h2 className="!text-lg !font-black !text-text-main">Hóa đơn Học phí</h2>
                                    <p className="!text-xs !font-bold !text-text-muted">Học sinh: {data.studentName || data.name}</p>
                                </div>
                            </div>
                            <div className="!text-right">
                                <span className={`!inline-flex !items-center !gap-1.5 !px-3 !py-1.5 !rounded-lg !text-[10px] !font-black !uppercase !tracking-wider ${isPaid ? '!bg-emerald-50 !text-emerald-600' : '!bg-amber-50 !text-amber-600'}`}>
                                    <div className={`!w-1.5 !h-1.5 !rounded-full ${isPaid ? '!bg-emerald-500' : '!bg-amber-500'}`} />
                                    {displayData.statusDisplay || (isPaid ? 'Đã thanh toán' : 'Chưa thanh toán')}
                                </span>
                            </div>
                        </div>

                        {/* Summary Info */}
                        <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-4 !p-5 !bg-background !rounded-2xl !border !border-border !border-dashed">
                            <div className="!space-y-3">
                                <p className="!text-[10px] !font-black !text-text-muted !uppercase !tracking-widest">Nội dung</p>
                                <div>
                                    <h4 className="!text-sm !font-black !text-text-main !leading-snug">{displayData.title || data.description || 'Học phí'}</h4>
                                </div>
                            </div>
                            <div className="!space-y-3 md:!text-right">
                                <p className="!text-[10px] !font-black !text-text-muted !uppercase !tracking-widest">Hạn thanh toán</p>
                                <p className="!text-sm !font-black !text-red-500">
                                    {displayData.dueDate || data.dueDate ? new Date(displayData.dueDate || data.dueDate).toLocaleDateString('vi-VN') : 'N/A'}
                                </p>
                            </div>
                        </div>

                        {/* Details Table */}
                        <div className="!bg-white !rounded-2xl !border !border-border !overflow-hidden">
                            <table className="!w-full !text-left !border-collapse">
                                <tbody className="!divide-y !divide-border">
                                    <tr>
                                        <td className="!px-4 !py-4">
                                            <p className="!text-sm !font-bold !text-text-main">Số buổi học</p>
                                        </td>
                                        <td className="!px-4 !py-4 !text-right !text-sm !font-black !text-text-main">
                                            {displayData.totalSessions || data.sessionCount || 0} buổi
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="!px-4 !py-4">
                                            <p className="!text-sm !font-bold !text-text-main">Đơn giá</p>
                                        </td>
                                        <td className="!px-4 !py-4 !text-right !text-sm !font-black !text-text-main">
                                            {(displayData.unitPrice || data.unitPrice || 0).toLocaleString('vi-VN')} ₫
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

                        {/* QR Section */}
                        {!isPaid && (
                            <div className="!mt-6 !pt-6 !border-t !border-border">
                                <div className="!text-center !mb-4">
                                    <h3 className="!text-sm !font-black !text-text-main">Mã QR Thanh Toán</h3>
                                    <p className="!text-xs !font-medium !text-text-muted !mt-1">Dùng để phụ huynh quét mã thanh toán</p>
                                </div>
                                
                                <div className="!relative !mx-auto !w-56 !h-56 !p-3 !bg-white !border-2 !border-primary/20 !rounded-3xl !shadow-lg !flex !items-center !justify-center !overflow-hidden">
                                    {isLoadingQr ? (
                                        <Icon icon="solar:spinner-bold-duotone" className="!animate-spin !text-3xl !text-primary" />
                                    ) : qrData?.qrCodeBase64 ? (
                                        <img src={qrData.qrCodeBase64} alt="VietQR" className="!w-full !h-full !object-contain" />
                                    ) : (
                                        <div className="!flex !flex-col !items-center !text-text-muted">
                                            <Icon icon="solar:qr-code-bold-duotone" className="!text-4xl !opacity-20" />
                                            <span className="!text-[10px] !font-medium !mt-2">Không hiển thị được QR</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="!flex !items-center !gap-3 !pt-4">
                            <button
                                onClick={onClose}
                                className="!flex-1 !px-6 !py-3 !bg-background !text-text-main !border !border-border !rounded-xl !text-sm !font-black hover:!bg-border !transition-all"
                            >
                                Đóng
                            </button>
                            
                            {!isPaid && onExtend && (
                                <button
                                    onClick={() => onExtend(data)}
                                    className="!flex-1 !px-6 !py-3 !bg-amber-500 !text-white !rounded-xl !text-sm !font-black !shadow-lg !shadow-amber-500/20 hover:!bg-amber-600 !transition-all !flex !items-center !justify-center !gap-2"
                                >
                                    <Icon icon="solar:calendar-add-bold-duotone" />
                                    Gia hạn
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default TeacherInvoiceDetailModal;
