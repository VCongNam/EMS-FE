import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../components/common/Modal';
import { tuitionService } from '../api/tuitionServiceStudent';
import useAuthStore from '../../../store/authStore';

const TransactionDetailModal = ({ isOpen, onClose, transactionId }) => {
    const { user } = useAuthStore();
    const [detail, setDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!isOpen || !transactionId || !user?.token) return;
            setIsLoading(true);
            try {
                const res = await tuitionService.getTransactionDetail(transactionId, user.token);
                if (res.ok) {
                    const result = await res.json();
                    setDetail(result);
                }
            } catch (error) {
                console.error("Error fetching transaction detail:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen) {
            fetchDetail();
        } else {
            setDetail(null);
        }
    }, [isOpen, transactionId, user?.token]);

    const getStatusConfig = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return { label: 'Đang chờ xác nhận', color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-500' };
            case 'approved':
            case 'success':
                return { label: 'Thanh toán thành công', color: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-500' };
            case 'failed':
            case 'rejected':
                return { label: 'Thanh toán thất bại', color: 'text-red-600', bg: 'bg-red-50', dot: 'bg-red-500' };
            default:
                return { label: status || 'N/A', color: 'text-text-muted', bg: 'bg-background', dot: 'bg-gray-400' };
        }
    };

    const statusConfig = getStatusConfig(detail?.status);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Chi tiết Giao dịch" maxWidth="md">
            <div className="!p-6 !space-y-6">
                {isLoading ? (
                    <div className="!flex !justify-center !items-center !py-20 text-text-muted">
                        <Icon icon="solar:spinner-linear" className="!animate-spin !text-4xl" />
                    </div>
                ) : detail ? (
                    <>
                        {/* Status Summary */}
                        <div className="!flex !items-center !justify-center !py-4 !bg-background !rounded-2xl !border !border-border">
                            <div className="!text-center">
                                <span className={`!inline-flex !items-center !gap-1.5 !px-3 !py-1.5 !rounded-lg !text-[11px] !font-black ${statusConfig.bg} ${statusConfig.color} !mb-2`}>
                                    <div className={`!w-1.5 !h-1.5 !rounded-full ${statusConfig.dot}`} />
                                    {statusConfig.label}
                                </span>
                                <p className="!text-[10px] !font-black !text-text-muted !uppercase !tracking-widest !mb-1">Số tiền thanh toán</p>
                                <p className="!text-2xl !font-black !text-emerald-600">+{detail.amountPaid?.toLocaleString('vi-VN')} ₫</p>
                            </div>
                        </div>

                        {/* Transaction Details */}
                        <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-6">
                            <div className="!space-y-4">
                                <div>
                                    <p className="!text-[10px] !font-black !text-text-muted !uppercase !tracking-widest !mb-1">Nội dung</p>
                                    <p className="!text-sm !font-bold !text-text-main !leading-relaxed">
                                        {detail.invoiceContent || detail.title || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="!text-[10px] !font-black !text-text-muted !uppercase !tracking-widest !mb-1">Phương thức</p>
                                    <p className="!text-sm !font-bold !text-text-main !flex !items-center !gap-2">
                                        <Icon icon="solar:card-bold-duotone" className="!text-primary" />
                                        {detail.paymentMethod === 'Bank Transfer' ? 'Chuyển khoản ngân hàng' : (detail.paymentMethod || 'N/A')}
                                    </p>
                                </div>
                                <div>
                                    <p className="!text-[10px] !font-black !text-text-muted !uppercase !tracking-widest !mb-1">Thời gian thanh toán</p>
                                    <p className="!text-sm !font-bold !text-text-main">
                                        {detail.paidDate ? new Date(detail.paidDate).toLocaleString('vi-VN') : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* Proof Image */}
                            <div className="!space-y-2">
                                <p className="!text-[10px] !font-black !text-text-muted !uppercase !tracking-widest !mb-1">Minh chứng thanh toán</p>
                                {detail.proofImageURL ? (
                                    <div className="!relative !group !cursor-pointer" onClick={() => window.open(detail.proofImageURL, '_blank')}>
                                        <img
                                            src={detail.proofImageURL}
                                            alt="Proof of payment"
                                            className="!w-full !aspect-[4/3] !object-cover !rounded-2xl !border-2 !border-border group-hover:!border-primary !transition-all"
                                        />
                                        <div className="!absolute !inset-0 !bg-black/40 !opacity-0 group-hover:!opacity-100 !transition-opacity !rounded-2xl !flex !items-center !justify-center">
                                            <Icon icon="solar:magnifer-zoom-in-bold-duotone" className="!text-white !text-3xl" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="!w-full !aspect-[4/3] !bg-background !border-2 !border-dashed !border-border !rounded-2xl !flex !flex-col !items-center !justify-center !text-text-muted">
                                        <Icon icon="solar:camera-add-bold-duotone" className="!text-3xl !mb-2" />
                                        <p className="!text-[10px] !font-bold">Không có ảnh minh chứng</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="!pt-4 !border-t !border-border !flex !justify-center">
                            <button
                                onClick={onClose}
                                className="!w-full !px-6 !py-3 !bg-background !text-text-main !border !border-border !rounded-xl !text-sm !font-black hover:!bg-border !transition-all"
                            >
                                Đóng
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="!text-center !py-10 !text-text-muted">Không tìm thấy dữ liệu giao dịch</div>
                )}
            </div>
        </Modal>
    );
};

export default TransactionDetailModal;
