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
    maxCapacity: '',
    days: [],
};

const InputField = ({ label, required, children, error }) => (
    <div className="space-y-1.5">
        <label className="block text-xs font-bold text-text-muted uppercase tracking-widest">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {children}
        {error && <p className="text-xs text-red-500 !mt-1">{error}</p>}
    </div>
);

const CreateClassModal = ({ isOpen, onClose, initialData, onSubmit }) => {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setForm({
                    className: initialData.name || '',
                    subject: initialData.subject || '', // Tạm thời để trống nếu mock chưa có
                    gradeLevel: initialData.gradeLevel || '', 
                    startDate: '', // Cần parse từ mock nếu có
                    endDate: '',
                    maxCapacity: initialData.students?.max || '',
                    days: initialData.days || [],
                });
            } else {
                setForm(initialForm);
            }
            setErrors({});
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const toggleDay = (day) => {
        setForm(prev => ({
            ...prev,
            days: prev.days.includes(day)
                ? prev.days.filter(d => d !== day)
                : [...prev.days, day],
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.className.trim()) newErrors.className = 'Tên lớp học không được để trống.';
        if (!form.subject.trim()) newErrors.subject = 'Môn học không được để trống.';
        if (!form.gradeLevel.trim()) newErrors.gradeLevel = 'Khối lớp không được để trống.';
        if (!form.startDate) newErrors.startDate = 'Vui lòng chọn ngày bắt đầu.';
        if (!form.endDate) newErrors.endDate = 'Vui lòng chọn ngày kết thúc.';
        if (form.startDate && form.endDate && form.endDate <= form.startDate) {
            newErrors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu.';
        }
        if (!form.maxCapacity || parseInt(form.maxCapacity) < 1) {
            newErrors.maxCapacity = 'Sĩ số phải là số nguyên dương.';
        }
        return newErrors;
    };

    const handleSubmit = () => {
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        if (onSubmit) {
            onSubmit(form);
        } else {
            console.log('Create Class:', form);
        }
        handleClose();
    };

    const handleClose = () => {
        onClose();
    };

    return createPortal(
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] animate-fade-in"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center !p-4 pointer-events-none">
                <div
                    className="bg-surface rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in-up pointer-events-auto"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <div className="flex items-center justify-between !p-6 border-b border-border sticky top-0 bg-surface/95 backdrop-blur-md z-10 rounded-t-3xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                <Icon icon={initialData ? "material-symbols:edit-rounded" : "material-symbols:add-circle-rounded"} className="text-primary text-xl" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-text-main font-['Outfit']">
                                    {initialData ? 'Cập nhật thông tin lớp học' : 'Tạo lớp học mới'}
                                </h2>
                                <p className="text-xs text-text-muted">
                                    {initialData ? 'Chỉnh sửa các thông tin của lớp học' : 'Điền thông tin để khởi tạo lớp học'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="w-9 h-9 rounded-xl bg-background border border-border flex items-center justify-center text-text-muted hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
                        >
                            <Icon icon="material-symbols:close-rounded" className="text-lg" />
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="!p-6 space-y-5">
                        {/* Class Name */}
                        <InputField label="Tên lớp học" required error={errors.className}>
                            <input
                                type="text"
                                maxLength={100}
                                placeholder="Ví dụ: Toán học - Lớp 10A"
                                value={form.className}
                                onChange={e => handleChange('className', e.target.value)}
                                className={`w-full !my-1 !px-4 !py-3 bg-background border rounded-xl outline-none transition-all text-text-main font-medium placeholder:font-normal placeholder:text-text-muted/50 focus:border-primary focus:ring-4 focus:ring-primary/5 ${errors.className ? 'border-red-400 ring-2 ring-red-100' : 'border-border'}`}
                            />
                        </InputField>

                        {/* Subject & Grade Level */}
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Môn học" required error={errors.subject}>
                                <input
                                    type="text"
                                    placeholder="Toán học"
                                    value={form.subject}
                                    onChange={e => handleChange('subject', e.target.value)}
                                    className={`w-full !my-1 !px-4 !py-3 bg-background border rounded-xl outline-none transition-all text-text-main font-medium placeholder:font-normal placeholder:text-text-muted/50 focus:border-primary focus:ring-4 focus:ring-primary/5 ${errors.subject ? 'border-red-400 ring-2 ring-red-100' : 'border-border'}`}
                                />
                            </InputField>
                            <InputField label="Khối lớp" required error={errors.gradeLevel}>
                                <input
                                    type="text"
                                    placeholder="Lớp 10"
                                    value={form.gradeLevel}
                                    onChange={e => handleChange('gradeLevel', e.target.value)}
                                    className={`w-full !my-1 !px-4 !py-3 bg-background border rounded-xl outline-none transition-all text-text-main font-medium placeholder:font-normal placeholder:text-text-muted/50 focus:border-primary focus:ring-4 focus:ring-primary/5 ${errors.gradeLevel ? 'border-red-400 ring-2 ring-red-100' : 'border-border'}`}
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

                        {/* Max Capacity */}
                        <InputField label="Sĩ số tối đa" required error={errors.maxCapacity}>
                            <input
                                type="number"
                                min={1}
                                placeholder="Ví dụ: 30"
                                value={form.maxCapacity}
                                onChange={e => handleChange('maxCapacity', e.target.value)}
                                className={`w-full !my-1 !px-4 !py-3 bg-background border rounded-xl outline-none transition-all text-text-main font-medium placeholder:font-normal placeholder:text-text-muted/50 focus:border-primary focus:ring-4 focus:ring-primary/5 ${errors.maxCapacity ? 'border-red-400 ring-2 ring-red-100' : 'border-border'}`}
                            />
                        </InputField>

                        {/* Days of the Week */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-text-muted uppercase tracking-widest">
                                Các ngày học trong tuần
                            </label>
                            <div className="flex flex-wrap gap-2 !pt-1">
                                {DAYS.map(day => {
                                    const isSelected = form.days.includes(day.key);
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
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex gap-3 !px-6 !pb-6 !pt-2">
                        <button
                            onClick={handleClose}
                            className="flex-1 !px-4 !py-3 rounded-xl border border-border bg-background text-text-muted font-semibold hover:bg-surface hover:text-text-main transition-all"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex-1 !px-4 !py-3 rounded-xl bg-primary text-outline font-semibold hover:bg-primary-hover transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2"
                        >
                            <Icon icon={initialData ? "material-symbols:save-rounded" : "material-symbols:add-circle-rounded"} className="text-lg" />
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
