import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../../../components/common/Modal'; // Assuming there's a common Modal component

const PaymentModal = ({ isOpen, onClose, fee }) => {
    const [step, setStep] = useState(1); // 1: Method, 2: QR/Info, 3: Success
    const [method, setMethod] = useState(null);

    const METHODS = [
        { id: 'bank', name: 'Chuyển khoản Ngân hàng', icon: 'solar:qr-code-line-duotone', color: 'text-blue-600', bg: 'bg-blue-50' },
        { id: 'momo', name: 'Ví điện tử MoMo', icon: 'solar:wallet-2-bold-duotone', color: 'text-pink-600', bg: 'bg-pink-50' },
        { id: 'card', name: 'Thẻ Quốc tế (Visa/Master)', icon: 'solar:card-2-bold-duotone', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];

    const handleNext = () => {
        if (step === 1 && method) setStep(2);
        else if (step === 2) setStep(3);
    };

    if (!fee) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Thanh toán học phí" maxWidth="md">
            <div className="!p-8 !space-y-8 !animate-fade-in">
                {/* Stepper */}
                <div className="!flex !items-center !justify-center !gap-4">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="!flex !items-center !gap-2">
                            <div className={`!w-8 !h-8 !rounded-full !flex !items-center !justify-center !text-sm !font-black !transition-all ${
                                step >= s ? '!bg-primary !text-white' : '!bg-background !text-text-muted !border !border-border'
                            }`}>
                                {s}
                            </div>
                            {s < 3 && <div className={`!w-12 !h-1 !rounded-full ${step > s ? '!bg-primary' : '!bg-background'}`} />}
                        </div>
                    ))}
                </div>

                {/* Step 1: Select Method */}
                {step === 1 && (
                    <div className="!space-y-6">
                        <div className="!text-center">
                            <h3 className="!text-xl !font-black !text-text-main">Chọn phương thức thanh toán</h3>
                            <p className="!text-sm !font-medium !text-text-muted !mt-2">Vui lòng chọn cách thức bạn muốn nộp học phí</p>
                        </div>
                        <div className="!space-y-3">
                            {METHODS.map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => setMethod(m.id)}
                                    className={`!w-full !p-5 !rounded-2xl !border !flex !items-center !gap-4 !transition-all ${
                                        method === m.id ? '!border-primary !bg-primary/5 !ring-2 !ring-primary/20' : '!border-border hover:!border-primary/30'
                                    }`}
                                >
                                    <div className={`!w-12 !h-12 !rounded-xl !flex !items-center !justify-center ${m.bg} ${m.color}`}>
                                        <Icon icon={m.icon} className="!text-2xl" />
                                    </div>
                                    <span className="!flex-1 !text-left !font-black !text-text-main">{m.name}</span>
                                    {method === m.id && <Icon icon="solar:check-circle-bold" className="!text-primary !text-xl" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: QR & Info */}
                {step === 2 && (
                    <div className="!space-y-6 !text-center">
                        <div>
                            <h3 className="!text-xl !font-black !text-text-main">Thanh toán qua {method === 'bank' ? 'Ngân hàng' : 'Ví điện tử'}</h3>
                            <p className="!text-sm !font-medium !text-text-muted !mt-2">Quét mã QR để hoàn tất thanh toán</p>
                        </div>
                        
                        <div className="!relative !mx-auto !w-64 !h-64 !p-4 !bg-white !border-2 !border-primary !rounded-3xl !shadow-xl !flex !items-center !justify-center">
                            {/* Mock QR Code */}
                            <Icon icon="solar:qr-code-bold-duotone" className="!text-[200px] !text-primary/95" />
                            <div className="!absolute !inset-0 !bg-white/10 !backdrop-blur-[1px] !rounded-3xl !flex !items-center !justify-center !opacity-0 hover:!opacity-100 !transition-opacity">
                                <button className="!bg-primary !text-white !px-4 !py-2 !rounded-xl !text-xs !font-black">Tải mã QR</button>
                            </div>
                        </div>

                        <div className="!p-6 !bg-background !rounded-[2.5rem] !border !border-border !border-dashed !space-y-4">
                            <div className="!flex !justify-between !items-center">
                                <span className="!text-xs !font-bold !text-text-muted">Số tiền cần đóng</span>
                                <span className="!text-xl !font-black !text-primary">{fee.amount.toLocaleString('vi-VN')} ₫</span>
                            </div>
                            <div className="!flex !justify-between !items-center">
                                <span className="!text-xs !font-bold !text-text-muted">Nội dung chuyển khoản</span>
                                <span className="!text-sm !font-black !text-text-main">EMS_{fee.code}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Success */}
                {step === 3 && (
                    <div className="!text-center !py-12 !space-y-6 !animate-fade-in">
                        <div className="!w-24 !h-24 !bg-emerald-50 !text-emerald-500 !rounded-full !flex !items-center !justify-center !mx-auto !ring-8 !ring-emerald-50/50">
                            <Icon icon="solar:check-circle-bold" className="!text-6xl" />
                        </div>
                        <div>
                            <h3 className="!text-2xl !font-black !text-text-main">Thanh toán Thành công!</h3>
                            <p className="!text-sm !font-medium !text-text-muted !mt-2">Hệ thống đang ghi nhận giao dịch của bạn.</p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="!px-10 !py-3.5 !bg-primary !text-white !rounded-xl !text-sm !font-black !shadow-lg !shadow-primary/20 hover:!bg-primary/90 !transition-all"
                        >
                            Quay lại trang chính
                        </button>
                    </div>
                )}

                {/* Footer Controls */}
                {step < 3 && (
                    <div className="!flex !items-center !gap-3 !pt-2">
                        {step > 1 && (
                            <button 
                                onClick={() => setStep(step - 1)}
                                className="!flex-1 !px-6 !py-4 !bg-background !text-text-muted !rounded-xl !text-sm !font-black hover:!bg-border !transition-all"
                            >
                                Quay lại
                            </button>
                        )}
                        <button 
                            onClick={handleNext}
                            disabled={step === 1 && !method}
                            className="!flex-[2] !px-6 !py-4 !bg-primary !text-white !rounded-xl !text-sm !font-black !shadow-lg !shadow-primary/20 hover:!bg-primary/90 !transition-all disabled:!opacity-50"
                        >
                            {step === 1 ? 'Tiếp tục' : 'Xác nhận đã chuyển'}
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default PaymentModal;
