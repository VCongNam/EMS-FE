import React from 'react';
import { Icon } from '@iconify/react';
import { formatViFullDate } from '../../../utils/dateUtils';

const FinalBillModal = ({
    isOpen,
    onClose,
    previewData,
    dueDate,
    setDueDate,
    isSubmitting,
    onConfirm,
    month
}) => {
    if (!isOpen || !previewData) return null;

    const formatVND = (amount) => amount?.toLocaleString('vi-VN') + ' ₫';

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center !p-4">
            <div className="absolute inset-0 !bg-black/40 backdrop-blur-sm" onClick={!isSubmitting ? onClose : undefined} />
            <div className="relative !bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-zoom-in">
                {/* Header */}
                <div className="!p-6 border-b border-border flex items-center justify-between !bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 !bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Icon icon="solar:bill-check-bold-duotone" className="text-white text-xl" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-text-main tracking-tight leading-tight">
                                Tất toán học phí tháng {month}
                            </h2>
                            <p className="text-xs text-text-muted !mt-0.5 font-bold">
                                Học sinh: {previewData.studentName}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Body - Read Only */}
                <div className="!p-6 !space-y-4">
                    <div className="!flex !items-center !justify-between !pb-3 !border-b !border-slate-50">
                        <span className="!text-xs !font-black !text-text-muted !uppercase">Trạng thái</span>
                        <div className="!flex !items-center !gap-2">
                             <span className={`!px-3 !py-1 !rounded-full !text-[11px] !font-black ${previewData.studentStatus === 'Dropped' ? '!bg-red-50 !text-red-500' : '!bg-emerald-50 !text-emerald-600'}`}>
                                {previewData.studentStatus === 'Dropped' ? 'Đã nghỉ học' : (previewData.studentStatus === 'Active' ? 'Đang học' : previewData.studentStatus)}
                            </span>
                        </div>
                    </div>

                    <div className="!flex !items-center !justify-between !pb-3 !border-b !border-slate-50">
                        <span className="!text-xs !font-black !text-text-muted !uppercase">Ngày nhập học</span>
                        <span className="!text-sm !font-bold !text-text-main">{formatViFullDate(previewData.enrollmentDate) || '--'}</span>
                    </div>

                    <div className="!flex !items-center !justify-between !pb-3 !border-b !border-slate-50">
                        <span className="!text-xs !font-black !text-text-muted !uppercase">Điểm danh</span>
                        <div className="!flex !items-center !gap-1 cursor-help" title={`Vắng có phép: ${previewData.excusedAbsences} | Vắng không phép: ${previewData.unexcusedAbsences}`}>
                            <span className="!text-sm !font-black !text-primary">{previewData.attendedSessions} buổi</span>
                        </div>
                    </div>

                    <div className="!flex !items-center !justify-between !pb-3 !border-b !border-slate-50">
                        <span className="!text-xs !font-black !text-text-muted !uppercase">Đơn giá</span>
                        <span className="!text-sm !font-bold !text-text-main">{formatVND(previewData.unitPrice)}/buổi</span>
                    </div>

                    <div className="!pt-4 !text-center">
                        <p className="!text-[10px] !font-black !text-text-muted !uppercase !tracking-widest !mb-1">Tổng tiền cần nộp</p>
                        <h3 className="!text-3xl !font-black !text-emerald-600 !tracking-tight">
                            {formatVND(previewData.amount)}
                        </h3>
                    </div>
                </div>

                {/* Footer */}
                <div className="!p-6 border-t border-border !bg-slate-50 !space-y-4">
                    <div className="!flex !items-center !gap-3">
                        <label className="!text-xs !font-black !text-text-muted !uppercase !whitespace-nowrap">Hạn nộp:</label>
                        <input 
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="!flex-1 !px-4 !py-2.5 !bg-white !border !border-border !rounded-xl !text-sm !font-bold focus:!outline-none focus:!border-emerald-500"
                        />
                    </div>

                    <div className="!flex !items-center !gap-3">
                        <button 
                            disabled={isSubmitting}
                            onClick={onClose}
                            className="!flex-1 !py-3 !rounded-xl !text-sm !font-black !text-text-muted hover:!bg-slate-200 !transition-colors"
                        >
                            Hủy
                        </button>
                        <button 
                            disabled={isSubmitting || !dueDate}
                            onClick={onConfirm}
                            className="!flex-[1.5] !bg-emerald-600 !text-white !py-3 !rounded-xl !text-sm !font-black !shadow-lg !shadow-emerald-600/20 hover:!bg-emerald-700 hover:!scale-[1.02] active:!scale-[0.98] !transition-all !flex !items-center !justify-center !gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Icon icon="line-md:loading-loop" />
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <Icon icon="solar:check-circle-bold" />
                                    Xác nhận tất toán
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinalBillModal;
