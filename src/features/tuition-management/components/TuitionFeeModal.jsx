import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

const BILLING_METHOD_OPTIONS = [
    { value: 'Prepaid', label: 'Trả trước' },
    { value: 'Postpaid', label: 'Trả sau' },
];

const TuitionFeeModal = ({ isOpen, onClose, onSave, editData = null, classes = [] }) => {
    const isEdit = !!editData;

    const [form, setForm] = useState({
        classId: '',
        pricePerSession: '',
        billingMethod: 'Postpaid',
        paymentDeadlineDays: '5',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            if (isEdit && editData) {
                setForm({
                    classId: editData.classId || editData.id || '',
                    pricePerSession: editData.pricePerSession?.toString() || '',
                    billingMethod: editData.billingMethod || 'Postpaid',
                    paymentDeadlineDays: editData.paymentDeadlineDays?.toString() || '5',
                });
            } else {
                setForm({ classId: classes[0]?.classId || classes[0]?.id || '', pricePerSession: '', billingMethod: 'Postpaid', paymentDeadlineDays: '5' });
            }
            setErrors({});
        }
    }, [isOpen, editData, isEdit, classes]);

    if (!isOpen) return null;

    const validate = () => {
        const newErrors = {};
        if (!form.classId) newErrors.classId = 'Vui lòng chọn lớp học.';
        if (!form.pricePerSession || isNaN(Number(form.pricePerSession)) || Number(form.pricePerSession) <= 0)
            newErrors.pricePerSession = 'Đơn giá phải là số dương hợp lệ.';
        if (!form.paymentDeadlineDays || isNaN(Number(form.paymentDeadlineDays)) || Number(form.paymentDeadlineDays) < 0)
            newErrors.paymentDeadlineDays = 'Số ngày hạn nộp không hợp lệ.';
        return newErrors;
    };

    const handleSave = () => {
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        onSave({
            ...(editData || {}),
            classId: form.classId,
            pricePerSession: Number(form.pricePerSession),
            billingMethod: form.billingMethod,
            paymentDeadlineDays: Number(form.paymentDeadlineDays),
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center !p-4">
            <div className="absolute inset-0 !bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative !bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-zoom-in">
                {/* Header */}
                <div className="!p-6 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 !bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <Icon icon="solar:settings-bold-duotone" className="text-white text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-text-main tracking-tight">
                                {isEdit ? 'Cài đặt Học phí' : 'Thiết lập Học phí'}
                            </h2>
                            <p className="text-xs text-text-muted !mt-0.5 font-medium">
                                {isEdit ? `Lớp: ${editData.className || editData.name}` : 'Thiết lập luật thu học phí cho lớp'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="!p-2 rounded-xl hover:!bg-background transition-all text-text-muted">
                        <Icon icon="material-symbols:close-rounded" className="text-2xl" />
                    </button>
                </div>

                {/* Body */}
                <div className="!p-6 space-y-5 overflow-y-auto max-h-[65vh] custom-scrollbar">
                    {/* Class Select */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-black text-text-muted uppercase tracking-widest !ml-0.5">Lớp học</label>
                        <div className="relative">
                            <select
                                value={form.classId}
                                onChange={e => setForm(p => ({ ...p, classId: e.target.value }))}
                                disabled={isEdit}
                                className={`w-full !px-4 !py-3 !bg-background border rounded-xl font-bold text-text-main outline-none transition-all appearance-none disabled:opacity-60 ${errors.classId ? 'border-red-400' : 'border-border focus:border-primary'}`}
                            >
                                <option value="">-- Chọn lớp --</option>
                                {classes.map(c => (
                                    <option key={c.classId || c.id} value={c.classId || c.id}>{c.className || c.name}</option>
                                ))}
                            </select>
                            <Icon icon="material-symbols:keyboard-arrow-down-rounded" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-xl pointer-events-none" />
                        </div>
                        {errors.classId && <p className="text-xs text-red-500 !mt-1 font-medium">{errors.classId}</p>}
                    </div>

                    {/* Billing Method */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-black text-text-muted uppercase tracking-widest !ml-0.5">Hình thức thu phí</label>
                        <div className="relative">
                            <select
                                value={form.billingMethod}
                                onChange={e => setForm(p => ({ ...p, billingMethod: e.target.value }))}
                                className="w-full !px-4 !py-3 !bg-background border border-border rounded-xl font-bold text-text-main outline-none transition-all appearance-none focus:border-primary"
                            >
                                {BILLING_METHOD_OPTIONS.map(o => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                            <Icon icon="material-symbols:keyboard-arrow-down-rounded" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-xl pointer-events-none" />
                        </div>
                    </div>

                    {/* Amount */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-black text-text-muted uppercase tracking-widest !ml-0.5">Đơn giá / Buổi (₫)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-black text-sm">₫</span>
                            <input
                                type="number"
                                min="0"
                                value={form.pricePerSession}
                                onChange={e => setForm(p => ({ ...p, pricePerSession: e.target.value }))}
                                placeholder="VD: 150000"
                                className={`w-full !pl-8 !pr-4 !py-3 !bg-background border rounded-xl font-bold text-text-main outline-none transition-all ${errors.pricePerSession ? 'border-red-400' : 'border-border focus:border-primary'}`}
                            />
                        </div>
                        {form.pricePerSession && !isNaN(Number(form.pricePerSession)) && Number(form.pricePerSession) > 0 && (
                            <p className="text-xs text-primary font-bold !mt-1">
                                ≈ {Number(form.pricePerSession).toLocaleString('vi-VN')} ₫
                            </p>
                        )}
                        {errors.pricePerSession && <p className="text-xs text-red-500 !mt-1 font-medium">{errors.pricePerSession}</p>}
                    </div>

                    {/* Deadline Days */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-black text-text-muted uppercase tracking-widest !ml-0.5">Số ngày hạn nộp (Sau khi chốt)</label>
                        <div className="relative">
                            <input
                                type="number"
                                min="0"
                                value={form.paymentDeadlineDays}
                                onChange={e => setForm(p => ({ ...p, paymentDeadlineDays: e.target.value }))}
                                placeholder="VD: 5"
                                className={`w-full !px-4 !py-3 !bg-background border rounded-xl font-bold text-text-main outline-none transition-all ${errors.paymentDeadlineDays ? 'border-red-400' : 'border-border focus:border-primary'}`}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted font-black text-xs uppercase tracking-widest">Ngày</span>
                        </div>
                        {errors.paymentDeadlineDays && <p className="text-xs text-red-500 !mt-1 font-medium">{errors.paymentDeadlineDays}</p>}
                    </div>

                </div>

                {/* Footer */}
                <div className="!p-6 border-t border-border !bg-background/30 flex items-center justify-end gap-3">
                    <button onClick={onClose} className="!px-6 !py-2.5 rounded-xl text-sm font-black text-text-muted hover:!bg-background transition-all">
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleSave}
                        className="!bg-primary text-white !px-8 !py-2.5 rounded-xl font-black shadow-lg shadow-primary/20 hover:!bg-primary/90 transition-all flex items-center gap-2 active:scale-95"
                    >
                        <Icon icon="material-symbols:save-rounded" className="text-lg" />
                        Lưu cấu hình
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TuitionFeeModal;
