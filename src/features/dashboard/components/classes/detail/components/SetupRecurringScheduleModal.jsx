import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Icon } from '@iconify/react';
import Button from '../../../../../../components/ui/Button';

// --- Mock Data ---
const TRANSCRIPT_TEMPLATES = [
    { id: 'T1', name: 'Cấu trúc 3 kỳ (Đầu - Giữa - Cuối)', description: 'Điểm danh kỳ đầu, giữa kỳ và cuối kỳ' },
    { id: 'T2', name: 'Cấu trúc 2 kỳ (Giữa - Cuối)', description: 'Điểm danh giữa kỳ và cuối kỳ' },
    { id: 'T3', name: 'Điểm danh mỗi buổi', description: 'Ghi nhận điểm danh từng buổi học' },
    { id: 'T4', name: 'Không điểm danh', description: 'Lớp học không yêu cầu điểm danh' },
];

const DAYS_OF_WEEK = [
    { id: 'MON', label: 'T2' },
    { id: 'TUE', label: 'T3' },
    { id: 'WED', label: 'T4' },
    { id: 'THU', label: 'T5' },
    { id: 'FRI', label: 'T6' },
    { id: 'SAT', label: 'T7' },
    { id: 'SUN', label: 'CN' },
];

const PAYMENT_METHODS = [
    { id: 'bank_transfer', label: 'Chuyển khoản ngân hàng', icon: 'solar:card-transfer-bold-duotone' },
    { id: 'cash', label: 'Tiền mặt', icon: 'solar:wallet-money-bold-duotone' },
    { id: 'e_wallet', label: 'Ví điện tử', icon: 'solar:smartphone-2-bold-duotone' },
];

const SectionHeader = ({ icon, color, title }) => (
    <div className="flex items-center !gap-3 border-b border-border !pb-3 !mb-5">
        <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center shrink-0`}>
            <Icon icon={icon} className="text-xl" />
        </div>
        <h3 className="text-base font-bold text-text-main">{title}</h3>
    </div>
);

const SetupRecurringScheduleModal = ({ isOpen, onClose, onSave, initialData = null }) => {
    const [formData, setFormData] = useState(initialData || {
        openingDate: '',
        transcriptTemplateId: '',
        selectedDays: [],
        startTime: '',
        endTime: '',
        pricePerLesson: '',
        paymentMethod: '',
    });

    const [step, setStep] = useState('form'); // 'form' | 'conflict_check' | 'success'

    if (!isOpen) return null;

    const handleDayToggle = (dayId) => {
        setFormData(prev => ({
            ...prev,
            selectedDays: prev.selectedDays.includes(dayId)
                ? prev.selectedDays.filter(d => d !== dayId)
                : [...prev.selectedDays, dayId],
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentSelect = (methodId) => {
        setFormData(prev => ({ ...prev, paymentMethod: methodId }));
    };

    const handleTranscriptSelect = (id) => {
        setFormData(prev => ({ ...prev, transcriptTemplateId: id }));
    };

    const isFormValid = () =>
        formData.openingDate &&
        formData.transcriptTemplateId &&
        formData.selectedDays.length > 0 &&
        formData.startTime &&
        formData.endTime &&
        formData.pricePerLesson &&
        formData.paymentMethod;

    const handleSave = (e) => {
        e.preventDefault();
        setStep('conflict_check');
        setTimeout(() => {
            setStep('success');
        }, 2000);
    };

    const handleClose = () => {
        if (!initialData) {
            setFormData({ openingDate: '', transcriptTemplateId: '', selectedDays: [], startTime: '', endTime: '', pricePerLesson: '', paymentMethod: '' });
        }
        setStep('form');
        onClose();
    };

    const handleSuccessClose = () => {
        onSave?.(formData);
        setStep('form');
        onClose();
    };

    const inputClasses = "w-full !px-4 !py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-text-main hover:border-text-muted/30 placeholder:text-text-muted/50 text-sm";
    const labelClasses = "block text-sm font-semibold text-text-main !mb-1.5";

    const renderForm = () => (
        <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-hidden">
            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto !px-6 md:!px-8 !py-6 !space-y-7" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {/* Section 1: Opening Date */}
            <div className="shrink-0">
                <SectionHeader icon="solar:calendar-date-bold-duotone" color="bg-blue-500/10 text-blue-500" title="1. Ngày khai giảng dự kiến" />
                <div className="!space-y-1 group">
                    <label className={labelClasses}>Ngày khai giảng <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Icon icon="solar:calendar-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/70 text-lg group-focus-within:text-primary transition-colors pointer-events-none" />
                        <input type="date" name="openingDate" required value={formData.openingDate} onChange={handleChange} className={`${inputClasses} !pl-11`} />
                    </div>
                </div>
            </div>

            {/* Section 2: Transcript Template */}
            <div className="shrink-0">
                <SectionHeader icon="solar:document-text-bold-duotone" color="bg-violet-500/10 text-violet-500" title="2. Cấu trúc bảng điểm danh mẫu" />
                <div className="grid grid-cols-1 sm:grid-cols-2 !gap-3">
                    {TRANSCRIPT_TEMPLATES.map(t => {
                        const isSelected = formData.transcriptTemplateId === t.id;
                        return (
                            <div key={t.id} onClick={() => handleTranscriptSelect(t.id)}
                                className={`border rounded-2xl !p-4 cursor-pointer transition-all ${isSelected ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-border hover:border-primary/50 bg-background'}`}>
                                <div className="flex items-start !gap-3">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${isSelected ? 'border-primary bg-primary' : 'border-text-muted/40'}`}>
                                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                                    </div>
                                    <div>
                                        <p className={`text-sm font-bold leading-snug ${isSelected ? 'text-primary' : 'text-text-main'}`}>{t.name}</p>
                                        <p className="text-xs text-text-muted mt-0.5">{t.description}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Section 3: Time Frame */}
            <div className="shrink-0">
                <SectionHeader icon="solar:clock-circle-bold-duotone" color="bg-orange-500/10 text-orange-500" title="3. Khung giờ học" />
                <div className="!mb-5">
                    <label className={labelClasses}>Ngày trong tuần <span className="text-red-500">*</span></label>
                    <div className="flex !gap-2 flex-wrap">
                        {DAYS_OF_WEEK.map(day => {
                            const isOn = formData.selectedDays.includes(day.id);
                            return (
                                <button key={day.id} type="button" onClick={() => handleDayToggle(day.id)}
                                    className={`w-12 h-12 rounded-xl font-bold text-sm transition-all ${isOn ? '!bg-primary text-white shadow-lg shadow-primary/30' : 'bg-background border border-border text-text-muted hover:border-primary/50 hover:text-primary'}`}>
                                    {day.label}
                                </button>
                            );
                        })}
                    </div>
                    {formData.selectedDays.length > 0 && (
                        <p className="text-xs text-primary mt-2 font-medium">
                            Đã chọn: {formData.selectedDays.map(id => DAYS_OF_WEEK.find(d => d.id === id)?.label).join(', ')}
                        </p>
                    )}
                </div>
                <div className="grid grid-cols-2 !gap-4">
                    <div className="!space-y-1 group">
                        <label className={labelClasses}>Giờ bắt đầu <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Icon icon="solar:clock-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/70 text-lg group-focus-within:text-primary transition-colors pointer-events-none" />
                            <input type="time" name="startTime" required value={formData.startTime} onChange={handleChange} className={`${inputClasses} !pl-11`} />
                        </div>
                    </div>
                    <div className="!space-y-1 group">
                        <label className={labelClasses}>Giờ kết thúc <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Icon icon="solar:clock-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/70 text-lg group-focus-within:text-primary transition-colors pointer-events-none" />
                            <input type="time" name="endTime" required value={formData.endTime} onChange={handleChange} className={`${inputClasses} !pl-11`} />
                        </div>
                    </div>
                </div>
                {formData.startTime && formData.endTime && formData.endTime > formData.startTime && (
                    <div className="flex items-center !gap-2 !mt-3 !px-4 !py-2.5 bg-green-500/10 border border-green-500/20 rounded-xl">
                        <Icon icon="solar:clock-circle-bold-duotone" className="text-green-500 shrink-0" />
                        <p className="text-xs text-green-700 font-semibold">Ca học: {formData.startTime} – {formData.endTime}</p>
                    </div>
                )}
            </div>

            {/* Section 4: Pricing */}
            <div className="shrink-0">
                <SectionHeader icon="solar:dollar-minimalistic-bold-duotone" color="bg-emerald-500/10 text-emerald-500" title="4. Học phí & Thanh toán" />
                <div className="grid grid-cols-1 md:grid-cols-2 !gap-5">
                    <div className="!space-y-1 group">
                        <label className={labelClasses}>Giá / 1 buổi học (VNĐ) <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Icon icon="solar:tag-price-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/70 text-lg group-focus-within:text-primary transition-colors pointer-events-none" />
                            <input type="number" name="pricePerLesson" required min="0" step="1000" value={formData.pricePerLesson} onChange={handleChange} placeholder="Vd: 150000" className={`${inputClasses} !pl-11`} />
                        </div>
                        {formData.pricePerLesson && (
                            <p className="text-xs text-emerald-600 font-semibold !mt-1">= {Number(formData.pricePerLesson).toLocaleString('vi-VN')} ₫ / buổi</p>
                        )}
                    </div>
                    <div className="!space-y-1.5">
                        <label className={labelClasses}>Phương thức thanh toán <span className="text-red-500">*</span></label>
                        <div className="!space-y-2">
                            {PAYMENT_METHODS.map(m => {
                                const isSelected = formData.paymentMethod === m.id;
                                return (
                                    <button key={m.id} type="button" onClick={() => handlePaymentSelect(m.id)}
                                        className={`w-full flex items-center !gap-3 !px-4 !py-3 border rounded-xl transition-all text-sm font-semibold ${isSelected ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary/20' : 'border-border bg-background text-text-muted hover:border-primary/40 hover:text-text-main'}`}>
                                        <Icon icon={m.icon} className="text-xl shrink-0" />
                                        {m.label}
                                        {isSelected && <Icon icon="solar:check-circle-bold" className="ml-auto text-primary text-lg" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
            </div>{/* end scrollable body */}

            {/* Footer - fixed outside scroll */}
            <div className="!px-6 md:!px-8 !pb-6 !pt-5 border-t border-border flex flex-col-reverse sm:flex-row justify-end !gap-3 sm:!gap-4 w-full shrink-0">
                <Button type="button" variant="outline" onClick={handleClose} className="w-full sm:w-auto justify-center">Hủy bỏ</Button>
                <Button type="submit" variant="!primary" disabled={!isFormValid()}
                    className="w-full sm:w-auto !p-3 justify-center shadow-primary/30 shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none">
                    <Icon icon="solar:diskette-bold-duotone" className="text-xl text-primary !mr-2 group-hover:scale-110 transition-transform" />
                    Lưu lịch học
                </Button>
            </div>
        </form>
    );

    const renderConflictCheck = () => (
        <div className="flex-1 flex flex-col items-center justify-center !p-12 !gap-6 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                <Icon icon="solar:calendar-search-bold-duotone" className="text-4xl text-primary" />
            </div>
            <div>
                <h3 className="text-xl font-bold text-text-main">Đang kiểm tra xung đột lịch...</h3>
                <p className="text-sm text-text-muted mt-2">Hệ thống đang tự động kiểm tra các xung đột về lịch dạy.</p>
            </div>
            <div className="flex !gap-1.5 !mt-2">
                <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
        </div>
    );

    const renderSuccess = () => (
        <div className="flex-1 flex flex-col items-center justify-center !p-12 !gap-5 text-center">
            <div className="relative">
                <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center animate-fade-in-up">
                    <Icon icon="solar:check-circle-bold-duotone" className="text-5xl text-green-500" />
                </div>
                <div className="absolute -right-1 -top-1 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg">
                    <Icon icon="solar:star-bold" className="text-white text-sm" />
                </div>
            </div>
            <div>
                <h3 className="text-2xl font-bold text-text-main">Thiết lập thành công!</h3>
                <p className="text-sm text-text-muted mt-2 max-w-sm">Lịch học định kỳ đã được lưu và hệ thống đã tạo danh sách các buổi học.</p>
            </div>
            <div className="w-full max-w-sm !p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-left !space-y-2">
                <p className="text-sm font-bold text-green-700 flex items-center !gap-2">
                    <Icon icon="solar:calendar-check-bold-duotone" className="text-base" /> Tóm tắt lịch học
                </p>
                <div className="grid grid-cols-2 !gap-x-4 !gap-y-1 text-xs text-text-muted">
                    <span>📅 Ngày khai giảng:</span>
                    <span className="font-semibold text-text-main">{formData.openingDate ? new Date(formData.openingDate + 'T00:00:00').toLocaleDateString('vi-VN') : '-'}</span>
                    <span>⏰ Ca học:</span>
                    <span className="font-semibold text-text-main">{formData.startTime} – {formData.endTime}</span>
                    <span>📆 Ngày học:</span>
                    <span className="font-semibold text-text-main">{formData.selectedDays.map(id => DAYS_OF_WEEK.find(d => d.id === id)?.label).join(', ')}</span>
                    <span>💰 Học phí:</span>
                    <span className="font-semibold text-text-main">{Number(formData.pricePerLesson).toLocaleString('vi-VN')} ₫</span>
                </div>
            </div>
            <Button type="button" variant="!primary" onClick={handleSuccessClose} className="w-full max-w-sm !p-3 justify-center shadow-primary/30 shadow-lg">
                <Icon icon="solar:arrow-right-bold-duotone" className="text-xl !mr-2" />
                Xem danh sách buổi học
            </Button>
        </div>
    );

    return ReactDOM.createPortal(
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] animate-fade-in"
                onClick={step !== 'conflict_check' ? handleClose : undefined} />
            <div className="fixed inset-0 z-[9999] flex items-center justify-center !p-4 pointer-events-none">
                <div className="bg-surface rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-fade-in-up pointer-events-auto flex flex-col relative"
                    onClick={e => e.stopPropagation()}>
                    {/* Header */}
                    <div className="flex items-center justify-between !p-6 border-b border-border rounded-t-3xl shrink-0">
                        <div className="flex items-center !text-primary !gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <Icon icon="solar:calendar-add-bold-duotone" className="text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-xl !text-primary sm:text-2xl font-bold font-['Outfit']">
                                    {step === 'success' ? 'Hoàn tất!' : initialData ? 'Chỉnh sửa lịch định kỳ' : 'Thiết lập lịch định kỳ'}
                                </h2>
                                <p className="text-xs sm:text-sm text-text-muted mt-1">
                                    {step === 'form' && 'Cấu hình lịch học lặp lại cho lớp'}
                                    {step === 'conflict_check' && 'Kiểm tra xung đột tự động...'}
                                    {step === 'success' && 'Lịch học đã được tạo thành công'}
                                </p>
                            </div>
                        </div>
                        {step !== 'conflict_check' && (
                            <button type="button" onClick={handleClose}
                                className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-text-muted hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all shrink-0">
                                <Icon icon="material-symbols:close-rounded" className="text-xl" />
                            </button>
                        )}
                    </div>

                    {/* Step indicator */}
                    {step === 'form' && (
                        <div className="flex items-center !gap-1 !px-6 !pt-4 shrink-0">
                            {[
                                { label: 'Ngày KG', icon: 'solar:calendar-date-bold-duotone', color: 'text-blue-500' },
                                { label: 'Bảng điểm', icon: 'solar:document-text-bold-duotone', color: 'text-violet-500' },
                                { label: 'Khung giờ', icon: 'solar:clock-circle-bold-duotone', color: 'text-orange-500' },
                                { label: 'Học phí', icon: 'solar:dollar-minimalistic-bold-duotone', color: 'text-emerald-500' },
                            ].map((s, i) => (
                                <React.Fragment key={i}>
                                    <div className="flex items-center !gap-1.5">
                                        <div className={`w-7 h-7 rounded-lg bg-background border border-border flex items-center justify-center ${s.color}`}>
                                            <Icon icon={s.icon} className="text-sm" />
                                        </div>
                                        <span className="text-xs text-text-muted font-medium hidden sm:block">{s.label}</span>
                                    </div>
                                    {i < 3 && <div className="flex-1 h-px bg-border mx-1" />}
                                </React.Fragment>
                            ))}
                        </div>
                    )}

                    {step === 'form' && renderForm()}
                    {step === 'conflict_check' && renderConflictCheck()}
                    {step === 'success' && renderSuccess()}
                </div>
            </div>
        </>,
        document.body
    );
};

export default SetupRecurringScheduleModal;
