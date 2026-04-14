import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

const GenerateInvoiceModal = ({ isOpen, onClose, onSave, classData }) => {
    const [form, setForm] = useState({
        periodMonth: new Date().getMonth() + 1,
        periodYear: new Date().getFullYear(),
        dueDate: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            setForm({
                periodMonth: new Date().getMonth() + 1,
                periodYear: new Date().getFullYear(),
                dueDate: '',
            });
            setErrors({});
        }
    }, [isOpen]);

    if (!isOpen || !classData) return null;

    // Helper functions
    const validate = () => {
        const newErrors = {};
        if (!form.periodMonth || form.periodMonth < 1 || form.periodMonth > 12)
            newErrors.periodMonth = 'Tháng không hợp lệ.';
        if (!form.periodYear || form.periodYear < 2000)
            newErrors.periodYear = 'Năm không hợp lệ.';
        if (classData.billingMethod !== 'Prepaid' && !form.dueDate)
            newErrors.dueDate = 'Vui lòng chọn ngày đến hạn.';
        return newErrors;
    };

    const handleSave = () => {
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const payload = {
            periodMonth: Number(form.periodMonth),
            periodYear: Number(form.periodYear),
        };

        if (classData.billingMethod === 'Prepaid') {
           // For prepaid: reconcile
           onSave(classData.classId || classData.id, payload, 'reconcile');
        } else {
           // For postpaid: generate-invoices requires dueDate
           payload.dueDate = new Date(form.dueDate).toISOString();
           onSave(classData.classId || classData.id, payload, 'generate');
        }
    };

    const isPrepaid = classData.billingMethod === 'Prepaid';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center !p-4">
            <div className="absolute inset-0 !bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative !bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-zoom-in">
                {/* Header */}
                <div className="!p-6 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${isPrepaid ? '!bg-emerald-500 shadow-emerald-500/20' : '!bg-purple-500 shadow-purple-500/20'}`}>
                            <Icon icon="solar:bill-check-bold-duotone" className="text-white text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-text-main tracking-tight">
                                {isPrepaid ? 'Chốt Học Phí (Trả Trước)' : 'Tạo Hóa Đơn (Trả Sau)'}
                            </h2>
                            <p className="text-xs text-text-muted !mt-0.5 font-medium">
                                Lớp: <span className="font-bold text-text-main">{classData.className || classData.name}</span>
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="!p-2 rounded-xl hover:!bg-background transition-all text-text-muted">
                        <Icon icon="material-symbols:close-rounded" className="text-2xl" />
                    </button>
                </div>

                {/* Body */}
                <div className="!p-6 space-y-5 overflow-y-auto max-h-[65vh] custom-scrollbar">
                    
                    <div className="!flex !gap-4">
                        {/* Period Month */}
                        <div className="space-y-1.5 flex-1">
                            <label className="text-xs font-black text-text-muted uppercase tracking-widest !ml-0.5">Tháng</label>
                            <input
                                type="number"
                                min="1" max="12"
                                value={form.periodMonth}
                                onChange={e => setForm(p => ({ ...p, periodMonth: e.target.value }))}
                                className={`w-full !px-4 !py-3 !bg-background border rounded-xl font-bold text-text-main outline-none transition-all ${errors.periodMonth ? 'border-red-400' : 'border-border focus:border-primary'}`}
                            />
                            {errors.periodMonth && <p className="text-xs text-red-500 !mt-1 font-medium">{errors.periodMonth}</p>}
                        </div>

                        {/* Period Year */}
                        <div className="space-y-1.5 flex-1">
                            <label className="text-xs font-black text-text-muted uppercase tracking-widest !ml-0.5">Năm</label>
                            <input
                                type="number"
                                min="2000"
                                value={form.periodYear}
                                onChange={e => setForm(p => ({ ...p, periodYear: e.target.value }))}
                                className={`w-full !px-4 !py-3 !bg-background border rounded-xl font-bold text-text-main outline-none transition-all ${errors.periodYear ? 'border-red-400' : 'border-border focus:border-primary'}`}
                            />
                            {errors.periodYear && <p className="text-xs text-red-500 !mt-1 font-medium">{errors.periodYear}</p>}
                        </div>
                    </div>

                    {/* Due Date (Only for Postpaid) */}
                    {!isPrepaid && (
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-text-muted uppercase tracking-widest !ml-0.5">Hạn nộp hóa đơn</label>
                            <input
                                type="datetime-local"
                                value={form.dueDate}
                                onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))}
                                className={`w-full !px-4 !py-3 !bg-background border rounded-xl font-bold text-text-main outline-none transition-all ${errors.dueDate ? 'border-red-400' : 'border-border focus:border-primary'}`}
                            />
                             {errors.dueDate && <p className="text-xs text-red-500 !mt-1 font-medium">{errors.dueDate}</p>}
                             {classData.paymentDeadlineDays > 0 && (
                                <p className="text-xs text-primary font-bold !mt-1">
                                    Gợi ý: {classData.paymentDeadlineDays} ngày tính từ thời điểm tạo bill.
                                </p>
                             )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="!p-6 border-t border-border !bg-background/30 flex items-center justify-end gap-3">
                    <button onClick={onClose} className="!px-6 !py-2.5 rounded-xl text-sm font-black text-text-muted hover:!bg-background transition-all">
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleSave}
                        className={`!text-white !px-8 !py-2.5 rounded-xl font-black shadow-lg hover:opacity-90 transition-all flex items-center gap-2 active:scale-95 ${isPrepaid ? '!bg-emerald-500 shadow-emerald-500/20' : '!bg-purple-500 shadow-purple-500/20'}`}
                    >
                        <Icon icon="solar:round-alt-arrow-right-bold" className="text-lg" />
                        Tiến hành {isPrepaid ? 'Chốt' : 'Tạo'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GenerateInvoiceModal;
