import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Icon } from '@iconify/react';
import Button from '../../../../../../components/ui/Button';

const inputClasses = "w-full !px-4 !py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-text-main hover:border-text-muted/30 placeholder:text-text-muted/50 text-sm";
const labelClasses = "block text-sm font-semibold text-text-main !mb-1.5";

const SessionModal = ({ isOpen, onClose, onSave, initialData = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        meetingLink: '',
        topic: '',
        note: ''
    });

    useEffect(() => {
        if (initialData) {
            const getGMT7Value = (iso, fallbackDate) => {
                if (!iso && !fallbackDate) return { date: '', time: '' };
                
                let d = new Date(iso);
                
                // If invalid and we have a fallback date, try combining them
                if (isNaN(d.getTime()) && fallbackDate) {
                    const datePart = fallbackDate.split('T')[0];
                    const timePart = (iso && iso.length >= 5 && !iso.includes('-')) ? iso : '00:00:00';
                    d = new Date(`${datePart}T${timePart.substring(0, 8)}`);
                }

                // If still invalid, try fallback date directly
                if (isNaN(d.getTime()) && fallbackDate) {
                    d = new Date(fallbackDate);
                }

                if (isNaN(d.getTime())) return { date: '', time: '' };

                return {
                    date: d.toLocaleDateString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }),
                    time: d.toLocaleTimeString('en-GB', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false })
                };
            };

            const startInfo = getGMT7Value(initialData.startTime, initialData.date);
            const endInfo = getGMT7Value(initialData.endTime, initialData.date);

            setFormData({
                title: initialData.title || '',
                date: startInfo.date,
                startTime: startInfo.time,
                endTime: endInfo.time,
                meetingLink: initialData.meetingLink || '',
                topic: initialData.topic || '',
                note: initialData.note || ''
            });
        } else {
            setFormData({
                title: '',
                date: '',
                startTime: '',
                endTime: '',
                meetingLink: '',
                topic: '',
                note: ''
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const isFormValid = () => {
        return formData.title && formData.date && formData.startTime && formData.endTime;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return ReactDOM.createPortal(
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] animate-fade-in" onClick={onClose} />
            <div className="fixed inset-0 z-[9999] flex items-center justify-center !p-4 pointer-events-none">
                <div className="bg-surface rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-fade-in-up pointer-events-auto flex flex-col relative" onClick={e => e.stopPropagation()}>
                    {/* Header */}
                    <div className="flex items-center justify-between !p-6 border-b border-border rounded-t-3xl shrink-0">
                        <div className="flex items-center !gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <Icon icon={initialData ? "solar:pen-bold-duotone" : "solar:calendar-add-bold-duotone"} className="text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold font-['Outfit'] text-primary">
                                    {initialData ? 'Chỉnh sửa buổi học' : 'Thêm buổi học mới'}
                                </h2>
                                <p className="text-xs sm:text-sm text-text-muted mt-1">
                                    {initialData ? 'Cập nhật lại thông tin của buổi học này' : 'Lên lịch thủ công cho một buổi học đột xuất'}
                                </p>
                            </div>
                        </div>
                        <button type="button" onClick={onClose} className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-text-muted hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all shrink-0">
                            <Icon icon="material-symbols:close-rounded" className="text-xl" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto !px-6 md:!px-8 !py-6 !space-y-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>

                            {/* Title */}
                            <div className="!space-y-1">
                                <label className={labelClasses}>Tiêu đề buổi học <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Icon icon="solar:text-field-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/70 text-lg pointer-events-none" />
                                    <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="Vd: Buổi 1: Giới thiệu môn học" className={`${inputClasses} !pl-11`} />
                                </div>
                            </div>

                            {/* Date & Time */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 !gap-4">
                                <div className="!space-y-1 group">
                                    <label className={labelClasses}>Ngày học <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <Icon icon="solar:calendar-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/70 text-lg group-focus-within:text-primary transition-colors pointer-events-none" />
                                        <input type="date" name="date" required value={formData.date} onChange={handleChange} className={`${inputClasses} !pl-11`} />
                                    </div>
                                </div>
                                <div className="!space-y-1 group">
                                    <label className={labelClasses}>Giờ bắt đầu <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <Icon icon="solar:clock-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/70 text-lg group-focus-within:text-primary transition-colors pointer-events-none" />
                                        <input type="time" name="startTime" step="1" required value={formData.startTime} onChange={handleChange} className={`${inputClasses} !pl-11`} />
                                    </div>
                                </div>
                                <div className="!space-y-1 group">
                                    <label className={labelClasses}>Giờ kết thúc <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <Icon icon="solar:clock-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/70 text-lg group-focus-within:text-primary transition-colors pointer-events-none" />
                                        <input type="time" name="endTime" step="1" required value={formData.endTime} onChange={handleChange} className={`${inputClasses} !pl-11`} />
                                    </div>
                                </div>
                            </div>

                            {/* Meeting Link */}
                            <div className="!space-y-1">
                                <label className={labelClasses}>Link Meeting / Phòng học online</label>
                                <div className="relative">
                                    <Icon icon="solar:link-minimalistic-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/70 text-lg pointer-events-none" />
                                    <input type="url" name="meetingLink" value={formData.meetingLink} onChange={handleChange} placeholder="https://meet.google.com/..." className={`${inputClasses} !pl-11`} />
                                </div>
                            </div>

                            {/* Topic */}
                            <div className="!space-y-1">
                                <label className={labelClasses}>Chủ đề (Topic)</label>
                                <div className="relative">
                                    <Icon icon="solar:tag-horizontal-linear" className="absolute left-4 top-4 text-text-muted/70 text-lg pointer-events-none" />
                                    <textarea name="topic" rows={2} value={formData.topic} onChange={handleChange} placeholder="Nội dung chính của buổi học..." className={`${inputClasses} !pl-11 resize-none`} />
                                </div>
                            </div>

                            {/* Note */}
                            <div className="!space-y-1">
                                <label className={labelClasses}>Ghi chú (Note)</label>
                                <div className="relative">
                                    <Icon icon="solar:document-text-linear" className="absolute left-4 top-4 text-text-muted/70 text-lg pointer-events-none" />
                                    <textarea name="note" rows={2} value={formData.note} onChange={handleChange} placeholder="Nhắc nhở học viên chuẩn bị trước..." className={`${inputClasses} !pl-11 resize-none`} />
                                </div>
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="!px-6 md:!px-8 !pb-6 !pt-5 border-t border-border flex flex-col-reverse sm:flex-row justify-end !gap-3 sm:!gap-4 shrink-0 bg-surface/50">
                            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto justify-center">Hủy bỏ</Button>
                            <Button type="submit" variant="primary" disabled={!isFormValid()} className="w-full sm:w-auto justify-center shadow-lg group">
                                <Icon icon="solar:diskette-bold-duotone" className="text-xl text-white group-hover:scale-110 transition-transform" />
                                <span className="text-white font-bold">{initialData ? 'Lưu thay đổi' : 'Tạo buổi học'}</span>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>,
        document.body
    );
};

export default SessionModal;
