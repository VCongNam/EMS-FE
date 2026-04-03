import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

const PERIOD_OPTIONS = [
    'Tháng 03/2026', 'Tháng 04/2026', 'Tháng 05/2026',
    'Tháng 06/2026', 'Tháng 07/2026', 'Tháng 08/2026',
    'Trọn bộ khóa học 2026',
];

const TuitionDeadlineModal = ({ isOpen, onClose, onSave, editData = null, classes = [] }) => {
    const isEdit = !!editData;

    const [form, setForm] = useState({
        classId: '',
        period: PERIOD_OPTIONS[0],
        deadline: '',
        gracePeriod: '3',
        latePolicyEnabled: true,
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            if (isEdit && editData) {
                setForm({
                    classId: editData.classId || '',
                    period: editData.period || PERIOD_OPTIONS[0],
                    deadline: editData.deadline || '',
                    gracePeriod: editData.gracePeriod?.toString() || '3',
                    latePolicyEnabled: editData.latePolicyEnabled ?? true,
                });
            } else {
                setForm({
                    classId: classes[0]?.id || '',
                    period: PERIOD_OPTIONS[0],
                    deadline: '',
                    gracePeriod: '3',
                    latePolicyEnabled: true,
                });
            }
            setErrors({});
        }
    }, [isOpen, editData, isEdit, classes]);

    if (!isOpen) return null;

    const validate = () => {
        const newErrors = {};
        if (!form.classId) newErrors.classId = 'Vui lòng chọn lớp học.';
        if (!form.deadline) newErrors.deadline = 'Vui lòng chọn ngày hạn nộp.';
        if (form.gracePeriod && (isNaN(Number(form.gracePeriod)) || Number(form.gracePeriod) < 0))
            newErrors.gracePeriod = 'Số ngày gia hạn không hợp lệ.';
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
            period: form.period,
            deadline: form.deadline,
            gracePeriod: Number(form.gracePeriod),
            latePolicyEnabled: form.latePolicyEnabled,
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center !p-4">
            <div className="absolute inset-0 !bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative !bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-zoom-in">
                {/* Header */}
                <div className="!p-6 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 !bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <Icon icon="solar:calendar-date-bold-duotone" className="text-white text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-text-main tracking-tight">
                                {isEdit ? 'Chỉnh sửa Hạn Nộp' : 'Thiết lập Hạn Nộp'}
                            </h2>
                            <p className="text-xs text-text-muted !mt-0.5 font-medium">
                                {isEdit ? `Lớp: ${editData.className}` : 'Thiết lập hạn nộp học phí cho kỳ thu'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="!p-2 rounded-xl hover:!bg-background transition-all text-text-muted">
                        <Icon icon="material-symbols:close-rounded" className="text-2xl" />
                    </button>
                </div>

                {/* Body */}
                <div className="!p-6 space-y-5 overflow-y-auto max-h-[65vh] custom-scrollbar">
                    {/* Class */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-black text-text-muted uppercase tracking-widest !ml-0.5">Lớp học</label>
                        <div className="relative">
                            <select
                                value={form.classId}
                                onChange={e => setForm(p => ({ ...p, classId: e.target.value }))}
                                className={`w-full !px-4 !py-3 !bg-background border rounded-xl font-bold text-text-main outline-none transition-all appearance-none ${errors.classId ? 'border-red-400' : 'border-border focus:border-primary'}`}
                            >
                                <option value="">-- Chọn lớp --</option>
                                {classes.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            <Icon icon="material-symbols:keyboard-arrow-down-rounded" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-xl pointer-events-none" />
                        </div>
                        {errors.classId && <p className="text-xs text-red-500 !mt-1 font-medium">{errors.classId}</p>}
                    </div>

                    {/* Period */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-black text-text-muted uppercase tracking-widest !ml-0.5">Kỳ thu phí</label>
                        <div className="relative">
                            <select
                                value={form.period}
                                onChange={e => setForm(p => ({ ...p, period: e.target.value }))}
                                className="w-full !px-4 !py-3 !bg-background border border-border rounded-xl font-bold text-text-main outline-none transition-all appearance-none focus:border-primary"
                            >
                                {PERIOD_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                            <Icon icon="material-symbols:keyboard-arrow-down-rounded" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-xl pointer-events-none" />
                        </div>
                    </div>

                    {/* Deadline Date */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-black text-text-muted uppercase tracking-widest !ml-0.5">Ngày hạn nộp</label>
                        <div className="relative">
                            <Icon icon="solar:calendar-date-bold-duotone" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
                            <input
                                type="date"
                                value={form.deadline}
                                onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))}
                                className={`w-full !pl-10 !pr-4 !py-3 !bg-background border rounded-xl font-bold text-text-main outline-none transition-all ${errors.deadline ? 'border-red-400' : 'border-border focus:border-primary'}`}
                            />
                        </div>
                        {errors.deadline && <p className="text-xs text-red-500 !mt-1 font-medium">{errors.deadline}</p>}
                    </div>

                    {/* Grace Period */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-black text-text-muted uppercase tracking-widest !ml-0.5">Thời gian gia hạn <span className="normal-case">(ngày)</span></label>
                        <div className="relative">
                            <input
                                type="number"
                                min="0"
                                value={form.gracePeriod}
                                onChange={e => setForm(p => ({ ...p, gracePeriod: e.target.value }))}
                                placeholder="VD: 3"
                                className={`w-full !px-4 !py-3 !bg-background border rounded-xl font-bold text-text-main outline-none transition-all ${errors.gracePeriod ? 'border-red-400' : 'border-border focus:border-primary'}`}
                            />
                        </div>
                        {errors.gracePeriod && <p className="text-xs text-red-500 !mt-1 font-medium">{errors.gracePeriod}</p>}
                        <p className="text-[11px] text-text-muted font-medium !mt-1">Số ngày cho phép nộp muộn sau hạn chót mà không bị phạt.</p>
                    </div>

                    {/* Late Payment Policy Toggle */}
                    <div className="flex items-center justify-between !p-4 !bg-background rounded-2xl border border-border">
                        <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${form.latePolicyEnabled ? '!bg-orange-500/10 text-orange-500' : '!bg-border/50 text-text-muted'}`}>
                                <Icon icon="solar:bill-list-bold-duotone" className="text-lg" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-text-main">Chính sách nộp muộn</p>
                                <p className="text-[11px] text-text-muted font-medium">Tính thêm phí khi nộp sau thời gian gia hạn</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setForm(p => ({ ...p, latePolicyEnabled: !p.latePolicyEnabled }))}
                            className={`relative w-12 h-6 rounded-full transition-all duration-300 ${form.latePolicyEnabled ? '!bg-orange-500' : '!bg-border'}`}
                        >
                            <span className={`absolute top-1 w-4 h-4 !bg-white rounded-full shadow-md transition-all duration-300 ${form.latePolicyEnabled ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="!p-6 border-t border-border !bg-background/30 flex items-center justify-end gap-3">
                    <button onClick={onClose} className="!px-6 !py-2.5 rounded-xl text-sm font-black text-text-muted hover:!bg-background transition-all">
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleSave}
                        className="!bg-orange-500 text-white !px-8 !py-2.5 rounded-xl font-black shadow-lg shadow-orange-500/20 hover:!bg-orange-600 transition-all flex items-center gap-2 active:scale-95"
                    >
                        <Icon icon="solar:calendar-add-bold-duotone" className="text-lg" />
                        {isEdit ? 'Lưu thay đổi' : 'Lưu hạn nộp'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TuitionDeadlineModal;
