import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';

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
    subjectName: '',
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
                    className: initialData.className || initialData.name || '',
                    subjectName: initialData.subjectName || initialData.subject || '', 
                    gradeLevel: initialData.gradeLevel || '', 
                    startDate: initialData.startDate ? initialData.startDate.split('T')[0] : '',
                    endDate: initialData.endDate ? initialData.endDate.split('T')[0] : '',
                    room: initialData.room || '',
                    tuitionFee: initialData.tuitionFee || '',
                    maxCapacity: initialData.maxStudents || '',
                    schedules: initialData.schedules ? initialData.schedules.map(s => ({
                        day: mapNumberToDay(s.dayOfWeek),
                        startTime: s.startTime?.substring(0, 5) || '',
                        endTime: s.endTime?.substring(0, 5) || ''
                    })) : [],
                });
            } else {
                setForm(initialForm);
            }
            setErrors({});
        }
    }, [isOpen, initialData]);

    const mapDayToNumber = (dayKey) => {
        // Mapping: Sunday=0, Monday=1, ..., Saturday=6 (Standard JS/ISO convention)
        const map = { 'CN': 0, 'T2': 1, 'T3': 2, 'T4': 3, 'T5': 4, 'T6': 5, 'T7': 6 };
        return map[dayKey];
    };

    const mapNumberToDay = (num) => {
        const map = { 0: 'CN', 1: 'T2', 2: 'T3', 3: 'T4', 4: 'T5', 5: 'T6', 6: 'T7' };
        return map[num];
    };

    if (!isOpen) return null;

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    const toggleDay = (day) => {
        setForm(prev => {
            const exists = prev.schedules.some(s => s.day === day);
            if (exists) {
                return { ...prev, schedules: prev.schedules.filter(s => s.day !== day) };
            } else {
                return { ...prev, schedules: [...prev.schedules, { day, startTime: '', endTime: '' }] };
            }
        });
        if (errors.days) {
            setErrors(prev => ({ ...prev, days: undefined }));
        }
    };

    const handleScheduleTimeChange = (day, field, value) => {
        setForm(prev => ({
            ...prev,
            schedules: prev.schedules.map(s => s.day === day ? { ...s, [field]: value } : s)
        }));
        if (errors[`${field}_${day}`]) {
            setErrors(prev => ({ ...prev, [`${field}_${day}`]: undefined }));
        }
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
        if (!form.subjectName.trim()) newErrors.subjectName = 'Môn học không được để trống.';
        if (!form.gradeLevel.toString().trim()) newErrors.gradeLevel = 'Khối lớp không được để trống.';
        if (!form.startDate) newErrors.startDate = 'Vui lòng chọn ngày bắt đầu.';
        if (!form.endDate) newErrors.endDate = 'Vui lòng chọn ngày kết thúc.';
        
        if (form.startDate && form.endDate && form.endDate <= form.startDate) {
            newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu.';
        }
        
        if (form.schedules.length === 0) {
            newErrors.days = 'Vui lòng chọn ít nhất một ngày học.';
        } else {
            form.schedules.forEach(s => {
                if (!s.startTime) newErrors[`startTime_${s.day}`] = 'Giờ BĐ';
                if (!s.endTime) newErrors[`endTime_${s.day}`] = 'Giờ KT';
                if (s.startTime && s.endTime && s.endTime <= s.startTime) {
                    newErrors[`endTime_${s.day}`] = 'Không hợp lệ';
                }
            });
        }

        if (form.maxCapacity && parseInt(form.maxCapacity) < 1) {
            newErrors.maxCapacity = 'Sĩ số phải là số nguyên dương.';
        }
        if (form.tuitionFee && parseInt(form.tuitionFee) < 0) {
            newErrors.tuitionFee = 'Học phí không hợp lệ.';
        }
        return newErrors;
    };

    const handleSubmit = () => {
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error('Vui lòng kiểm tra lại thông tin nhập liệu.');
            return;
        }

        // Transform form data to match API requirements
        const payload = {
            className: form.className.trim(),
            room: form.room.trim() || undefined,
            startDate: form.startDate,
            endDate: form.endDate,
            tuitionFee: form.tuitionFee ? parseInt(form.tuitionFee) : 0,
            maxStudents: form.maxCapacity ? parseInt(form.maxCapacity) : null,
            subjectName: form.subjectName.trim(),
            gradeLevel: parseInt(form.gradeLevel),
            schedules: form.schedules.map(s => ({
                dayOfWeek: mapDayToNumber(s.day),
                startTime: s.startTime.length === 5 ? `${s.startTime}:00` : s.startTime,
                endTime: s.endTime.length === 5 ? `${s.endTime}:00` : s.endTime
            }))
        };

        if (onSubmit) onSubmit(payload);
        else console.log('Create Class Payload:', payload);
        onClose();
    };

    return createPortal(
        <div className="create-class-modal-portal">
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
                            {/* Class Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="Tên lớp học" required error={errors.className}>
                                    <input
                                        type="text"
                                        placeholder="Ví dụ: Toán nâng cao 12"
                                        value={form.className}
                                        onChange={e => handleChange('className', e.target.value)}
                                        className={`${inputBase} !my-1 ${errors.className ? 'border-red-400 ring-2 ring-red-100' : 'border-border'}`}
                                    />
                                </InputField>
                                <InputField label="Môn học" required error={errors.subjectName}>
                                    <input
                                        type="text"
                                        placeholder="Ví dụ: Toán"
                                        value={form.subjectName}
                                        onChange={e => handleChange('subjectName', e.target.value)}
                                        className={`${inputBase} !my-1 ${errors.subjectName ? 'border-red-400 ring-2 ring-red-100' : 'border-border'}`}
                                    />
                                </InputField>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="Khối lớp" required error={errors.gradeLevel}>
                                    <input
                                        type="number"
                                        placeholder="Ví dụ: 12"
                                        value={form.gradeLevel}
                                        onChange={e => handleChange('gradeLevel', e.target.value)}
                                        className={`${inputBase} !my-1 ${errors.gradeLevel ? 'border-red-400 ring-2 ring-red-100' : 'border-border'}`}
                                    />
                                </InputField>
                            </div>

                        {/* Start Date & End Date */}
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Ngày bắt đầu" required error={errors.startDate}>
                                <input
                                    type="date"
                                    value={form.startDate}
                                    onChange={e => handleChange('startDate', e.target.value)}
                                    className={`w-full !my-1 !px-4 !py-3 bg-background border rounded-xl outline-none transition-all text-text-main font-medium focus:border-primary focus:ring-4 focus:ring-primary/5 ${errors.startDate ? 'border-red-400 ring-2 ring-red-100' : 'border-border'}`}
                                />
                            </InputField>
                            <InputField label="Ngày kết thúc" required error={errors.endDate}>
                                <input
                                    type="date"
                                    value={form.endDate}
                                    onChange={e => handleChange('endDate', e.target.value)}
                                    className={`w-full !my-1 !px-4 !py-3 bg-background border rounded-xl outline-none transition-all text-text-main font-medium focus:border-primary focus:ring-4 focus:ring-primary/5 ${errors.endDate ? 'border-red-400 ring-2 ring-red-100' : 'border-border'}`}
                                />
                            </InputField>
                        </div>

                        {/* Room & Max Capacity */}
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Phòng học (Không bắt buộc)" error={errors.room}>
                                <input
                                    type="text"
                                    placeholder="Ví dụ: P.201"
                                    value={form.room}
                                    onChange={e => handleChange('room', e.target.value)}
                                    className={`w-full !my-1 !px-4 !py-3 bg-background border rounded-xl outline-none transition-all text-text-main font-medium placeholder:font-normal placeholder:text-text-muted/50 focus:border-primary focus:ring-4 focus:ring-primary/5 ${errors.room ? 'border-red-400 ring-2 ring-red-100' : 'border-border'}`}
                                />
                            </InputField>
                            <InputField label="Sĩ số tối đa (Không bắt buộc)" error={errors.maxCapacity}>
                                <input
                                    type="number"
                                    min={1}
                                    placeholder="Ví dụ: 30"
                                    value={form.maxCapacity}
                                    onChange={e => handleChange('maxCapacity', e.target.value)}
                                    className={`w-full !my-1 !px-4 !py-3 bg-background border rounded-xl outline-none transition-all text-text-main font-medium placeholder:font-normal placeholder:text-text-muted/50 focus:border-primary focus:ring-4 focus:ring-primary/5 ${errors.maxCapacity ? 'border-red-400 ring-2 ring-red-100' : 'border-border'}`}
                                />
                            </InputField>
                        </div>

                        {/* Tuition Fee */}
                        <InputField label="Học phí (VNĐ) (Không bắt buộc)" error={errors.tuitionFee}>
                            <input
                                type="number"
                                min={0}
                                placeholder="Ví dụ: 1500000"
                                value={form.tuitionFee}
                                onChange={e => handleChange('tuitionFee', e.target.value)}
                                className={`w-full !my-1 !px-4 !py-3 bg-background border rounded-xl outline-none transition-all text-text-main font-medium placeholder:font-normal placeholder:text-text-muted/50 focus:border-primary focus:ring-4 focus:ring-primary/5 ${errors.tuitionFee ? 'border-red-400 ring-2 ring-red-100' : 'border-border'}`}
                            />
                        </InputField>

                        {/* Days of the Week */}
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-widest">
                                    Các ngày học trong tuần <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-wrap gap-2 !pt-1">
                                    {DAYS.map(day => {
                                        const isSelected = form.schedules.some(s => s.day === day.key);
                                        return (
                                            <button
                                                key={day.key}
                                                type="button"
                                                onClick={() => toggleDay(day.key)}
                                                className={`w-10 h-10 !my-1 rounded-xl text-sm font-bold transition-all border ${
                                                    isSelected
                                                        ? ' text-primary border-primary shadow-md shadow-primary/20'
                                                        : '!bg-background border-border text-text-muted hover:border-primary hover:text-primary'
                                                }`}
                                            >
                                                {day.label}
                                            </button>
                                        );
                                    })}
                                </div>
                                {errors.days && <p className="text-xs text-red-500 !mt-1">{errors.days}</p>}
                            </div>

                            {/* Dynamic Time Inputs for Selected Days */}
                            {form.schedules.length > 0 && (
                                <div className="bg-background rounded-2xl border border-border !p-4 space-y-3">
                                    <h3 className="text-sm font-bold text-text-main">Thiết lập khung giờ học</h3>
                                    <div className="space-y-3">
                                        {form.schedules.map(schedule => (
                                            <div key={schedule.day} className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center text-sm shrink-0">
                                                    {schedule.day}
                                                </div>
                                                <div className="flex-1 grid grid-cols-2 gap-3">
                                                    <InputField error={errors[`startTime_${schedule.day}`]}>
                                                        <input
                                                            type="time"
                                                            value={schedule.startTime}
                                                            onChange={e => handleScheduleTimeChange(schedule.day, 'startTime', e.target.value)}
                                                            className={`w-full !px-3 !py-2 bg-white border rounded-xl outline-none text-sm transition-all text-text-main font-medium focus:border-primary focus:ring-4 focus:ring-primary/5 ${errors[`startTime_${schedule.day}`] ? 'border-red-400 ring-2 ring-red-100' : 'border-border'}`}
                                                        />
                                                    </InputField>
                                                    <InputField error={errors[`endTime_${schedule.day}`]}>
                                                        <input
                                                            type="time"
                                                            value={schedule.endTime}
                                                            onChange={e => handleScheduleTimeChange(schedule.day, 'endTime', e.target.value)}
                                                            className={`w-full !px-3 !py-2 bg-white border rounded-xl outline-none text-sm transition-all text-text-main font-medium focus:border-primary focus:ring-4 focus:ring-primary/5 ${errors[`endTime_${schedule.day}`] ? 'border-red-400 ring-2 ring-red-100' : 'border-border'}`}
                                                        />
                                                    </InputField>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
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
        </div>,
        document.body
    );
};

export default CreateClassModal;