import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../components/common/Modal';
import useAuthStore from '../../../store/authStore';
import { tuitionService } from '../api/tuitionService';
import { toast } from 'react-toastify';

const PaymentModal = ({ isOpen, onClose, fee, onSuccess }) => {
    // step 1: QR & Upload, step 2: Success
    const [step, setStep] = useState(1);
    
    const { user } = useAuthStore();
    const [qrData, setQrData] = useState(null);
    const [isLoadingQr, setIsLoadingQr] = useState(false);
    
    const [proofFile, setProofFile] = useState(null);
    const [proofPreview, setProofPreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    
    const fileInputRef = useRef(null);

    // Reset and fetch QR when modal opens
    useEffect(() => {
        if (isOpen && fee) {
            setStep(1);
            setProofFile(null);
            setProofPreview(null);
            fetchQrCode();
        }
    }, [isOpen, fee]);

    const fetchQrCode = async () => {
        const targetInvoiceId = fee.invoiceId || fee.id;
        
        if (!targetInvoiceId || targetInvoiceId === 'undefined') {
            console.error("Missing invoiceId for payment:", fee);
            toast.error("Không tìm thấy mã hóa đơn hợp lệ");
            return;
        }

        try {
            setIsLoadingQr(true);
            const res = await tuitionService.getPaymentQr(targetInvoiceId, user?.token);
            const result = await res.json();
            if (res.ok && result.data) {
                setQrData(result.data);
            } else {
                toast.error("Không thể lấy mã QR thanh toán");
            }
        } catch (err) {
            console.error("Error fetching QR Code:", err);
            toast.error("Đã xảy ra lỗi khi tải QR Code");
        } finally {
            setIsLoadingQr(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Only accept images for proof
            if (!file.type.startsWith('image/')) {
                toast.error("Vui lòng tải lên file hình ảnh");
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB Limit
                toast.error("Kích thước file quá lớn (tối đa 5MB)");
                return;
            }
            setProofFile(file);
            setProofPreview(URL.createObjectURL(file));
        }
    };

    const handleComplete = async () => {
        if (!proofFile) {
            toast.error("Vui lòng tải lên ảnh minh chứng giao dịch");
            return;
        }
        
        try {
            setIsUploading(true);
            const targetInvoiceId = fee.invoiceId || fee.id;
            const res = await tuitionService.uploadTransactionProof(targetInvoiceId, proofFile, user?.token);
            const result = await res.json();

            if (res.ok) {
                setStep(2);
                if (onSuccess) onSuccess(); // Trigger refresh
            } else {
                // Hiển thị lỗi từ BE (VD: Bạn đã nộp minh chứng rồi...)
                toast.error(result.error || result.message || "Đã xảy ra lỗi khi tải lên. Vui lòng thử lại.");
            }
        } catch (err) {
            console.error("Upload proof error:", err);
            toast.error("Không thể kết nối đến máy chủ.");
        } finally {
            setIsUploading(false);
        }
    };

    if (!fee) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Thanh toán học phí" maxWidth="md">
            <div className="!p-8 !animate-fade-in">
                {/* Step 1: QR & Upload */}
                {step === 1 && (
                    <div className="!space-y-6">
                        <div className="!text-center">
                            <h3 className="!text-xl !font-black !text-text-main">Thanh toán với VietQR</h3>
                            <p className="!text-sm !font-medium !text-text-muted !mt-1">Sử dụng Ứng dụng Ngân hàng để quét mã</p>
                        </div>
                        
                        {/* QR Display */}
                        <div className="!relative !mx-auto !w-64 !h-64 !p-4 !bg-white !border-2 !border-primary/20 !rounded-3xl !shadow-xl !flex !items-center !justify-center !overflow-hidden">
                            {isLoadingQr ? (
                                <div className="!flex !flex-col !items-center !gap-3">
                                    <Icon icon="solar:spinner-bold-duotone" className="!animate-spin !text-4xl !text-primary" />
                                    <span className="!text-sm !font-medium !text-primary">Đang tải mã QR...</span>
                                </div>
                            ) : qrData?.qrCodeBase64 ? (
                                <img src={qrData.qrCodeBase64} alt="VietQR" className="!w-full !h-full !object-contain" />
                            ) : (
                                <div className="!flex !flex-col !items-center !text-text-muted">
                                    <Icon icon="solar:qr-code-bold-duotone" className="!text-5xl !opacity-20" />
                                    <span className="!text-xs !font-medium !mt-2">Không hiển thị được QR</span>
                                </div>
                            )}
                        </div>

                        {/* Payment Info */}
                        <div className="!p-5 !bg-background !rounded-2xl !border !border-border !border-dashed !space-y-3">
                            <div className="!flex !justify-between !items-center">
                                <span className="!text-xs !font-bold !text-text-muted">Tên tài khoản</span>
                                <span className="!text-sm !font-bold !text-text-main">{qrData?.accountName || '-'}</span>
                            </div>
                            <div className="!flex !justify-between !items-center">
                                <span className="!text-xs !font-bold !text-text-muted">Số tiền cần đóng</span>
                                <span className="!text-lg !font-black !text-primary">{(qrData?.amount || fee.amount).toLocaleString('vi-VN')} ₫</span>
                            </div>
                            <div className="!flex !justify-between !items-center">
                                <span className="!text-xs !font-bold !text-text-muted">Nội dung CK</span>
                                <span className="!text-sm !font-black !text-text-main">{qrData?.transferContent || `EMS_${(fee.invoiceId || fee.id || '').substring(0, 8).toUpperCase()}`}</span>
                            </div>
                        </div>

                        {/* Upload Proof Area */}
                        <div>
                            <p className="!text-sm !font-black !text-text-main !mb-2">Ảnh minh chứng giao dịch</p>
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="!hidden" 
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                            
                            {!proofPreview ? (
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="!w-full !p-6 !border-2 !border-dashed !border-border !rounded-2xl !flex !flex-col !items-center !justify-center hover:!border-primary/50 hover:!bg-primary/5 !transition-all !group"
                                >
                                    <div className="!w-12 !h-12 !rounded-full !bg-background group-hover:!bg-primary/10 !flex !items-center !justify-center !mb-3 !transition-colors">
                                        <Icon icon="solar:gallery-add-bold-duotone" className="!text-2xl !text-text-muted group-hover:!text-primary !transition-colors" />
                                    </div>
                                    <span className="!text-sm !font-bold !text-text-main">Tải ảnh minh chứng</span>
                                    <span className="!text-xs !font-medium !text-text-muted !mt-1">Hỗ trợ JPG, PNG (Tối đa 5MB)</span>
                                </button>
                            ) : (
                                <div className="!relative !w-full !h-32 !border !border-border !rounded-2xl !overflow-hidden !group">
                                    <img src={proofPreview} alt="Proof preview" className="!w-full !h-full !object-cover" />
                                    <div className="!absolute !inset-0 !bg-black/40 !opacity-0 group-hover:!opacity-100 !transition-opacity !flex !items-center !justify-center !gap-3">
                                        <button 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="!w-10 !h-10 !rounded-full !bg-white/90 !text-primary !flex !items-center !justify-center hover:!bg-white"
                                            title="Tải ảnh khác"
                                        >
                                            <Icon icon="solar:camera-add-bold-duotone" className="!text-xl" />
                                        </button>
                                        <button 
                                            onClick={() => { setProofPreview(null); setProofFile(null); }}
                                            className="!w-10 !h-10 !rounded-full !bg-danger/90 !text-white !flex !items-center !justify-center hover:!bg-danger"
                                            title="Xóa ảnh"
                                        >
                                            <Icon icon="solar:trash-bin-trash-bold" className="!text-xl" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Controls */}
                        <div className="!flex !items-center !gap-3 !pt-2">
                            <button 
                                onClick={onClose}
                                className="!flex-1 !px-6 !py-3.5 !bg-background !text-text-muted !rounded-xl !text-sm !font-black hover:!bg-border !transition-all"
                            >
                                Hủy bỏ
                            </button>
                            <button 
                                onClick={handleComplete}
                                disabled={isUploading || !proofFile}
                                className="!flex-[2] !px-6 !py-3.5 !bg-primary !text-white !rounded-xl !text-sm !font-black !shadow-lg !shadow-primary/20 hover:!bg-primary/90 !transition-all disabled:!opacity-50 !flex !items-center !justify-center !gap-2"
                            >
                                {isUploading ? (
                                    <>
                                        <Icon icon="solar:spinner-bold-duotone" className="!animate-spin" />
                                        <span>Đang ghi nhận...</span>
                                    </>
                                ) : (
                                    'Hoàn thành'
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Success */}
                {step === 2 && (
                    <div className="!text-center !py-8 !space-y-6 !animate-fade-in">
                        <div className="!w-24 !h-24 !bg-emerald-50 !text-emerald-500 !rounded-full !flex !items-center !justify-center !mx-auto !ring-8 !ring-emerald-50/50">
                            <Icon icon="solar:check-circle-bold" className="!text-6xl" />
                        </div>
                        <div>
                            <h3 className="!text-2xl !font-black !text-text-main">Thanh toán Thành công!</h3>
                            <p className="!text-sm !font-medium !text-text-muted !mt-2">Ảnh minh chứng đã được gửi thành công.<br/>Chúng tôi sẽ xác nhận trong thời gian sớm nhất.</p>
                        </div>
                        <button 
                            onClick={onClose} // Về cơ bản khi close có thể call reload data ở page ngoài cũng đc
                            className="!px-10 !py-3.5 !bg-primary !text-white !rounded-xl !text-sm !font-black !shadow-lg !shadow-primary/20 hover:!bg-primary/90 !transition-all"
                        >
                            Đóng cửa sổ
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default PaymentModal;
