import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';

const DAYS = [
    { key: 'T2', label: 'T2' },
    { key: 'T3', label: 'T3' },
    { key: 'T4', label: 'T4' },
    { key: 'T5', label: 'T5' },
    { key: 'T6', label: 'T6' },
    { key: 'T7', label: 'T7' },
    { key: 'CN', label: 'CN' },
];

const initialForm = {
    className: '',
    subject: '',
    gradeLevel: '',
    startDate: '',
    endDate: '',
    room: '',
    tuitionFee: '',
    maxCapacity: '',
    schedules: [
        { day: 'T2', startTime: '08:00', endTime: '10:00' }
    ],
};

const InputField = ({ label, required, children, error }) => (
    <div className="flex flex-col !gap-2">
        <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest leading-none">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        {children}
        {error && (
            <p className="flex items-center !gap-1 text-xs text-red-500">
                <Icon icon="material-symbols:error-outline-rounded" className="text-sm shrink-0" />
                {error}
            </p>
        )}
    </div>
);

/* Section header */
const SectionHeader = ({ icon, title, step }) => (
    <div className="flex items-center !gap-3 !pb-4 border-b border-border/60">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary shrink-0">
            <span className="text-xs font-bold">{step}</span>
        </div>
        <div className="flex items-center !gap-2">
            <Icon icon={icon} className="text-primary text-base" />
            <h3 className="text-xs font-extrabold text-text-main uppercase tracking-widest">{title}</h3>
        </div>
    </div>
);

const inputBase =
    'w-full !px-4 !py-3 bg-background border rounded-xl outline-none transition-all duration-200 text-sm text-text-main font-medium placeholder:font-normal placeholder:text-text-muted/40 focus:border-primary focus:ring-4 focus:ring-primary/8';

const CreateClassModal = ({ isOpen, onClose, initialData, onSubmit }) => {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setForm({
                    className: initialData.name || '',
                    subject: initialData.subject || '',
                    gradeLevel: initialData.gradeLevel?.toString() || '',
                    startDate: initialData.startDate || '',
                    endDate: initialData.endDate || '',
                    room: initialData.room || '',
                    tuitionFee: initialData.tuitionFee || '',
                    maxCapacity: initialData.students?.max || '',
                    schedules: initialData.schedules && initialData.schedules.length > 0
                        ? initialData.schedules.map(s => ({
                            day: DAYS.find(d => mapDayToNumber(d.key) === s.dayOfWeek)?.key || 'T2',
                            startTime: s.startTime?.substring(0, 5) || '08:00',
                            endTime: s.endTime?.substring(0, 5) || '10:00'
                        }))
                        : [{ day: 'T2', startTime: '08:00', endTime: '10:00' }],
                });
            } else {
                setForm(initialForm);
            }
            setErrors({});
        }
    }, [isOpen, initialData]);

    const mapDayToNumber = (dayKey) => {
        // Mapping: Sunday=1, Monday=2, ..., Saturday=7 (Vietnamese convention)
        const map = { 'CN': 1, 'T2': 2, 'T3': 3, 'T4': 4, 'T5': 5, 'T6': 6, 'T7': 7 };
        return map[dayKey];
    };

    if (!isOpen) return null;

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    const addSchedule = () => {
        setForm(prev => ({
            ...prev,
            schedules: [...prev.schedules, { day: 'T2', startTime: '08:00', endTime: '10:00' }]
        }));
    };

    const removeSchedule = (index) => {
        if (form.schedules.length <= 1) return;
        setForm(prev => ({
            ...prev,
            schedules: prev.schedules.filter((_, i) => i !== index)
        }));
    };

    const handleScheduleChange = (index, field, value) => {
        setForm(prev => {
            const newSchedules = [...prev.schedules];
            newSchedules[index] = { ...newSchedules[index], [field]: value };
            return { ...prev, schedules: newSchedules };
        });
    };

    const validate = () => {
        const newErrors = {};
        if (!form.className.trim()) newErrors.className = 'Tên lớp học không được để trống.';
        if (!form.subject.trim()) newErrors.subject = 'Môn học không được để trống.';
        if (!form.gradeLevel.trim()) newErrors.gradeLevel = 'Khối lớp không được để trống.';
        if (!form.startDate) newErrors.startDate = 'Vui lòng chọn ngày bắt đầu.';
        if (!form.endDate) newErrors.endDate = 'Vui lòng chọn ngày kết thúc.';
        if (form.startDate && form.endDate && form.endDate <= form.startDate)
            newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu.';
        form.schedules.forEach((s, index) => {
            if (!s.startTime) newErrors[`schedule_${index}`] = 'Vui lòng chọn giờ bắt đầu.';
            else if (!s.endTime) newErrors[`schedule_${index}`] = 'Vui lòng chọn giờ kết thúc.';
            else if (s.startTime && s.endTime && s.endTime <= s.startTime)
                newErrors[`schedule_${index}`] = 'Giờ kết thúc phải sau giờ bắt đầu.';
        });
        if (form.maxCapacity && parseInt(form.maxCapacity) < 1)
            newErrors.maxCapacity = 'Sĩ số phải là số nguyên dương.';
        if (form.tuitionFee && parseInt(form.tuitionFee) < 0)
            newErrors.tuitionFee = 'Học phí không hợp lệ.';
        return newErrors;
    };

    const handleSubmit = () => {
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
        if (onSubmit) onSubmit(form);
        else console.log('Create Class:', form);
        onClose();
    };

    return createPortal(
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] animate-fade-in"
                onClick={onClose}
            />

            {/* Modal wrapper */}
            <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center !p-0 sm:!p-4 pointer-events-none">
                <div
                    className="
                        bg-surface pointer-events-auto
                        w-full max-w-2xl
                        max-h-[92dvh] sm:max-h-[88vh]
                        flex flex-col
                        rounded-t-3xl sm:rounded-3xl
                        shadow-2xl shadow-black/20
                        animate-fade-in-up
                        overflow-hidden
                    "
                    onClick={e => e.stopPropagation()}
                >
                    {/* ── Header ── */}
                    <div className="flex items-center justify-between !px-6 !py-5 border-b border-border bg-surface/95 backdrop-blur-md shrink-0">
                        <div className="flex items-center !gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                                <Icon
                                    icon={initialData ? 'material-symbols:edit-rounded' : 'material-symbols:add-circle-rounded'}
                                    className="text-primary text-xl"
                                />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-text-main leading-snug">
                                    {initialData ? 'Cập nhật lớp học' : 'Tạo lớp học mới'}
                                </h2>
                                <p className="text-[11px] text-text-muted !mt-0.5">
                                    {initialData ? 'Chỉnh sửa thông tin lớp học' : 'Điền đầy đủ thông tin để khởi tạo lớp học'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-9 h-9 rounded-xl bg-background border border-border flex items-center justify-center text-text-muted hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all shrink-0 !ml-3"
                        >
                            <Icon icon="material-symbols:close-rounded" className="text-lg" />
                        </button>
                    </div>

                    {/* ── Scrollable Body ── */}
                    <div className="flex-1 overflow-y-auto overscroll-contain">
                        <div className="!px-6 !py-7 flex flex-col !gap-8 sm:!px-8">

                            {/* ─ Section 1: Thông tin cơ bản ─ */}
                            <section className="flex flex-col !gap-5">
                                <SectionHeader icon="material-symbols:edit-note-rounded" title="Thông tin cơ bản" step="1" />

                                <InputField label="Tên lớp học" required error={errors.className}>
                                    <input
                                        type="text"
                                        maxLength={100}
                                        placeholder="Ví dụ: Toán học - Lớp 10A"
                                        value={form.className}
                                        onChange={e => handleChange('className', e.target.value)}
                                        className={`${inputBase} ${errors.className ? 'border-red-400 ring-4 ring-red-100' : 'border-border'}`}
                                    />
                                </InputField>

                                <div className="grid grid-cols-1 sm:grid-cols-2 !gap-5">
                                    <InputField label="Môn học" required error={errors.subject}>
                                        <input
                                            type="text"
                                            placeholder="Toán học"
                                            value={form.subject}
                                            onChange={e => handleChange('subject', e.target.value)}
                                            className={`${inputBase} ${errors.subject ? 'border-red-400 ring-4 ring-red-100' : 'border-border'}`}
                                        />
                                    </InputField>
                                    <InputField label="Khối lớp" required error={errors.gradeLevel}>
                                        <input
                                            type="number"
                                            min="1"
                                            max="12"
                                            placeholder="Ghi số (Vd: 10)"
                                            value={form.gradeLevel}
                                            onChange={e => handleChange('gradeLevel', e.target.value)}
                                            className={`${inputBase} ${errors.gradeLevel ? 'border-red-400 ring-4 ring-red-100' : 'border-border'}`}
                                        />
                                    </InputField>
                                </div>
                            </section>

                            {/* ─ Section 2: Thời gian khóa học ─ */}
                            <section className="flex flex-col !gap-5">
                                <SectionHeader icon="material-symbols:calendar-today-rounded" title="Thời gian khóa học" step="2" />

                                <div className="grid grid-cols-1 sm:grid-cols-2 !gap-5">
                                    <InputField label="Ngày bắt đầu" required error={errors.startDate}>
                                        <input
                                            type="date"
                                            value={form.startDate}
                                            onChange={e => handleChange('startDate', e.target.value)}
                                            className={`${inputBase} ${errors.startDate ? 'border-red-400 ring-4 ring-red-100' : 'border-border'}`}
                                        />
                                    </InputField>
                                    <InputField label="Ngày kết thúc" required error={errors.endDate}>
                                        <input
                                            type="date"
                                            value={form.endDate}
                                            onChange={e => handleChange('endDate', e.target.value)}
                                            className={`${inputBase} ${errors.endDate ? 'border-red-400 ring-4 ring-red-100' : 'border-border'}`}
                                        />
                                    </InputField>
                                </div>
                            </section>

                            {/* ─ Section 3: Lịch học chi tiết ─ */}
                            <section className="flex flex-col !gap-5">
                                <div className="flex items-center justify-between !pb-4 border-b border-border/60">
                                    <div className="flex items-center !gap-3">
                                        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary shrink-0">
                                            <span className="text-xs font-bold">3</span>
                                        </div>
                                        <div className="flex items-center !gap-2">
                                            <Icon icon="material-symbols:schedule-rounded" className="text-primary text-base" />
                                            <h3 className="text-xs font-extrabold text-text-main uppercase tracking-widest">Lịch học chi tiết</h3>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addSchedule}
                                        className="flex items-center !gap-1.5 text-xs font-bold text-primary hover:text-primary-hover !px-3 !py-2 rounded-lg bg-primary/8 border border-primary/20 hover:bg-primary/15 transition-all"
                                    >
                                        <Icon icon="material-symbols:add-rounded" className="text-sm" />
                                        Thêm lịch
                                    </button>
                                </div>

                                <div className="flex flex-col !gap-4">
                                    {form.schedules.map((s, index) => (
                                        <div
                                            key={index}
                                            className="group relative !p-5 bg-background border border-border rounded-2xl hover:border-primary/40 hover:shadow-sm transition-all duration-200"
                                        >
                                            {/* Delete btn */}
                                            {form.schedules.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeSchedule(index)}
                                                    className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-surface text-red-400 border border-red-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white hover:border-red-500 shadow-sm z-10"
                                                >
                                                    <Icon icon="material-symbols:close-rounded" className="text-xs" />
                                                </button>
                                            )}

                                            <div className="flex flex-col !gap-4">
                                                {/* Day selector */}
                                                <div className="flex flex-col !gap-2">
                                                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Thứ trong tuần</label>
                                                    <div className="flex flex-wrap !gap-2">
                                                        {DAYS.map(day => (
                                                            <button
                                                                key={day.key}
                                                                type="button"
                                                                onClick={() => handleScheduleChange(index, 'day', day.key)}
                                                                className={`w-9 h-9 rounded-xl text-[11px] font-bold transition-all border ${
                                                                    s.day === day.key
                                                                        ? '!bg-primary text-white border-primary shadow-md shadow-primary/20 scale-105'
                                                                        : '!bg-surface border-border text-text-muted hover:border-primary/50 hover:text-primary'
                                                                }`}
                                                            >
                                                                {day.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Time pickers */}
                                                <div className="grid grid-cols-2 !gap-4">
                                                    <div className="flex flex-col !gap-2">
                                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Giờ bắt đầu</label>
                                                        <input
                                                            type="time"
                                                            value={s.startTime}
                                                            onChange={e => handleScheduleChange(index, 'startTime', e.target.value)}
                                                            className="w-full !px-3 !py-2.5 bg-surface border border-border rounded-xl outline-none text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/8 transition-all"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col !gap-2">
                                                        <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Giờ kết thúc</label>
                                                        <input
                                                            type="time"
                                                            value={s.endTime}
                                                            onChange={e => handleScheduleChange(index, 'endTime', e.target.value)}
                                                            className="w-full !px-3 !py-2.5 bg-surface border border-border rounded-xl outline-none text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/8 transition-all"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {errors[`schedule_${index}`] && (
                                                <p className="flex items-center !gap-1 text-xs text-red-500 !mt-3">
                                                    <Icon icon="material-symbols:error-outline-rounded" className="text-sm shrink-0" />
                                                    {errors[`schedule_${index}`]}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* ─ Section 4: Thông tin bổ sung ─ */}
                            <section className="flex flex-col !gap-5">
                                <SectionHeader icon="material-symbols:settings-suggest-rounded" title="Thông tin bổ sung" step="4" />

                                <div className="grid grid-cols-1 sm:grid-cols-2 !gap-5">
                                    <InputField label="Phòng học (Không bắt buộc)" error={errors.room}>
                                        <input
                                            type="text"
                                            placeholder="Ví dụ: P.201"
                                            value={form.room}
                                            onChange={e => handleChange('room', e.target.value)}
                                            className={`${inputBase} ${errors.room ? 'border-red-400 ring-4 ring-red-100' : 'border-border'}`}
                                        />
                                    </InputField>
                                    <InputField label="Sĩ số tối đa (Không bắt buộc)" error={errors.maxCapacity}>
                                        <input
                                            type="number"
                                            min={1}
                                            placeholder="Ví dụ: 30"
                                            value={form.maxCapacity}
                                            onChange={e => handleChange('maxCapacity', e.target.value)}
                                            className={`${inputBase} ${errors.maxCapacity ? 'border-red-400 ring-4 ring-red-100' : 'border-border'}`}
                                        />
                                    </InputField>
                                </div>

                                <InputField label="Học phí (VNĐ) (Không bắt buộc)" error={errors.tuitionFee}>
                                    <input
                                        type="number"
                                        min={0}
                                        placeholder="Ví dụ: 1500000"
                                        value={form.tuitionFee}
                                        onChange={e => handleChange('tuitionFee', e.target.value)}
                                        className={`${inputBase} ${errors.tuitionFee ? 'border-red-400 ring-4 ring-red-100' : 'border-border'}`}
                                    />
                                </InputField>
                            </section>

                            {/* Bottom padding for mobile scroll comfort */}
                            <div className="!h-2 sm:!h-0" />
                        </div>
                    </div>

                    {/* ── Footer ── */}
                    <div className="shrink-0 flex items-center !gap-3 !px-6 !py-5 sm:!px-8 border-t border-border bg-surface/95 backdrop-blur-md">
                        <button
                            onClick={onClose}
                            className="flex-1 !px-4 !py-3 rounded-xl border border-border bg-background text-text-muted text-sm font-semibold hover:bg-surface hover:text-text-main transition-all"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex-1 !px-4 !py-3 rounded-xl !bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-all shadow-lg shadow-primary/25 flex items-center justify-center !gap-2"
                        >
                            <Icon
                                icon={initialData ? 'material-symbols:save-rounded' : 'material-symbols:add-circle-rounded'}
                                className="text-lg"
                            />
                            {initialData ? 'Lưu thay đổi' : 'Tạo lớp học'}
                        </button>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
};

export default CreateClassModal;