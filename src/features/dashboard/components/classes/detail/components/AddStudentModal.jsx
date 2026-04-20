import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import Button from "../../../../../../components/ui/Button";
import { classService } from '../../../../api/classService';
import useAuthStore from '../../../../../../store/authStore';

const AddStudentModal = ({ isOpen, onClose, onAdd, classId }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        password: '',
        address: '',
        dob: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showResultPassword, setShowResultPassword] = useState(false);
    const [step, setStep] = useState(0); // 0: form, 1: result
    const [createResult, setCreateResult] = useState(null); // API response

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const token = useAuthStore.getState().user?.token;

        // ── Frontend Validations ──
        const today = new Date(); today.setHours(0, 0, 0, 0);

        // 1. Họ tên: tối thiểu 2 ký tự, không chứa số hoặc ký tự đặc biệt
        const nameRegex = /^[\p{L}\s]{2,}$/u;
        if (!nameRegex.test(formData.fullName.trim())) {
            toast.error('Họ và tên phải có ít nhất 2 ký tự và không chứa số hoặc ký tự đặc biệt.');
            setIsSubmitting(false); return;
        }

        // 2. Số điện thoại: 10 số, đầu 03x/05x/07x/08x/09x
        const phoneRegex = /^(0[3-9])\d{8}$/;
        if (!phoneRegex.test(formData.phoneNumber.trim())) {
            toast.error('Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng Việt Nam (10 số, bắt đầu bằng 0).');
            setIsSubmitting(false); return;
        }

        // 3. Mật khẩu: tối thiểu 8 ký tự, 1 hoa, 1 thường, 1 ký tự đặc biệt
        const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (!pwRegex.test(formData.password)) {
            toast.error('Mật khẩu phải có ít nhất 8 ký tự, bao gồm 1 chữ in hoa, 1 chữ in thường và 1 ký tự đặc biệt.');
            setIsSubmitting(false); return;
        }

        // 4. Ngày sinh: không được tương lai, tuổi hợp lệ 5–100
        if (formData.dob) {
            const dobDate = new Date(formData.dob);
            if (dobDate >= today) {
                toast.error('Ngày sinh không được là ngày hôm nay hoặc ngày trong tương lai.');
                setIsSubmitting(false); return;
            }
            const ageYears = (today - dobDate) / (1000 * 60 * 60 * 24 * 365.25);
            if (ageYears < 5 || ageYears > 100) {
                toast.error('Ngày sinh không hợp lệ. Tuổi chọn phải từ 5 đến 100.');
                setIsSubmitting(false); return;
            }
        }

        // 5. Địa chỉ: tối đa 200 ký tự
        if (formData.address && formData.address.length > 200) {
            toast.error('Địa chỉ không được vượt quá 200 ký tự.');
            setIsSubmitting(false); return;
        }

        try {
            let isoDob = new Date().toISOString();
            if (formData.dob) {
                isoDob = new Date(formData.dob).toISOString();
            }

            const payload = { ...formData, dob: isoDob };

            // Bước 1: Tạo tài khoản học sinh
            const createRes = await classService.createStudentAccount(payload, token);
            if (!createRes.ok) {
                const errorText = await createRes.text();
                throw new Error(errorText || 'Không thể tạo tài khoản học sinh');
            }

            const createData = await createRes.json();
            const newStudentId = createData.studentId;
            if (!newStudentId) throw new Error('Backend không trả về ID sau khi tạo');

            // Bước 2: Gán vào lớp
            const assignRes = await classService.assignStudent(classId, newStudentId, token);
            if (!assignRes.ok) throw new Error('Không thể gán học sinh vào lớp');

            // Lưu kết quả và chuyển về màn hình kết quả
            setCreateResult({ ...createData, fullName: formData.fullName, phoneNumber: formData.phoneNumber });
            setStep(1);
            if (onAdd) onAdd();

        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Lỗi hệ thống');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setFormData({ fullName: '', phoneNumber: '', password: '', address: '', dob: '' });
        setCreateResult(null);
        setShowPassword(false);
        setShowResultPassword(false);
        setStep(0);
    };

    const inputClasses = "w-full !pl-11 !pr-4 !py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-text-main hover:border-text-muted/30 placeholder:text-text-muted/50";
    const labelClasses = "block text-sm font-semibold text-text-main !mb-1.5";

    return ReactDOM.createPortal(
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9997] animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[9998] flex items-center justify-center !p-4 pointer-events-none">
                <div
                    className="bg-surface rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in-up pointer-events-auto flex flex-col relative custom-scrollbar"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between !p-6 border-b border-border rounded-t-3xl shrink-0">
                        <div className="flex items-center !text-primary !gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <Icon icon={step === 1 ? "solar:user-check-bold-duotone" : "solar:user-plus-bold-duotone"} className="text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-xl !text-primary sm:text-2xl font-bold font-['Outfit']">
                                    {step === 0 ? 'Tạo & Gán học viên mới' : 'Kết quả tạo & gán học viên'}
                                </h2>
                                <p className="text-xs sm:text-sm text-text-muted mt-1">
                                    {step === 0 ? 'Khởi tạo hồ sơ và đồng thời gán vào lớp học này' : 'Học sinh đã được tạo và gán vào lớp thành công'}
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-text-muted hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all shrink-0"
                        >
                            <Icon icon="material-symbols:close-rounded" className="text-xl" />
                        </button>
                    </div>

                    {/* ── Step 0: Form ── */}
                    {step === 0 && (
                        <form onSubmit={handleSubmit} className="!p-6 md:!p-8 !space-y-8 flex-1 flex flex-col relative">
                            <div className="!space-y-6 shrink-0">
                                <div className="flex items-center !gap-3 border-b border-border !pb-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                                        <Icon icon="solar:user-id-bold-duotone" className="text-xl" />
                                    </div>
                                    <h3 className="text-lg font-bold text-text-main">Thông tin cá nhân học sinh</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 !gap-x-6 !gap-y-5">
                                    {/* Họ tên */}
                                    <div className="!space-y-1 group">
                                        <label className={labelClasses}>Họ và Tên <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <Icon icon="solar:user-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/70 text-lg group-focus-within:text-primary transition-colors" />
                                            <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange}
                                                placeholder="Vd: Nguyễn Văn A" className={inputClasses}
                                                minLength={2} maxLength={100} />
                                        </div>
                                    </div>

                                    {/* SĐT */}
                                    <div className="!space-y-1 group">
                                        <label className={labelClasses}>Số điện thoại (Tài khoản) <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <Icon icon="solar:phone-calling-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/70 text-lg group-focus-within:text-primary transition-colors" />
                                            <input type="tel" name="phoneNumber" required value={formData.phoneNumber} onChange={handleChange}
                                                placeholder="Vd: 0901234567" className={inputClasses}
                                                pattern="(0[3-9])\d{8}" title="Số điện thoại Việt Nam hợp lệ (10 số, bắt đầu bằng 0)" />
                                        </div>
                                    </div>

                                    {/* Mật khẩu */}
                                    <div className="!space-y-1 group">
                                        <label className={labelClasses}>Mật khẩu khởi tạo <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <Icon icon="solar:lock-password-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/70 text-lg group-focus-within:text-primary transition-colors" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password" required value={formData.password} onChange={handleChange}
                                                placeholder="Tối thiểu 6 ký tự" className={inputClasses} minLength={6}
                                            />
                                            <button type="button" onClick={() => setShowPassword(v => !v)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors" tabIndex={-1}>
                                                <Icon icon={showPassword ? 'solar:eye-closed-linear' : 'solar:eye-linear'} className="text-lg" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Ngày sinh */}
                                    <div className="!space-y-1 group">
                                        <label className={labelClasses}>Ngày sinh <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <Icon icon="solar:calendar-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/70 text-lg group-focus-within:text-primary transition-colors z-10" />
                                            <input type="date" name="dob" value={formData.dob} onChange={handleChange} required
                                                max={new Date().toISOString().split('T')[0]}
                                                className={`${inputClasses} [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 cursor-pointer`} />
                                        </div>
                                    </div>

                                    {/* Địa chỉ */}
                                    <div className="!space-y-1 group md:col-span-2">
                                        <label className={labelClasses}>Địa chỉ thường trú</label>
                                        <div className="relative">
                                            <Icon icon="solar:map-point-linear" className="absolute left-4 top-[18px] text-text-muted/70 text-lg group-focus-within:text-primary transition-colors" />
                                            <textarea name="address" value={formData.address} onChange={handleChange}
                                                placeholder="Vd: 123 Đường XYZ..." rows={2} maxLength={200}
                                                className="w-full !pl-11 !pr-4 !py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-text-main hover:border-text-muted/30 placeholder:text-text-muted/50 resize-none" />
                                            {formData.address.length > 0 && (
                                                <p className={`text-[10px] text-right mt-1 ${formData.address.length > 200 ? 'text-red-500' : 'text-text-muted'}`}>
                                                    {formData.address.length}/200
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="!pt-6 border-t border-border flex flex-col-reverse sm:flex-row justify-end !gap-3 sm:!gap-4 w-full mt-auto shrink-0 bg-surface z-10 sticky bottom-0 pb-2">
                                <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto justify-center">Hủy bỏ</Button>
                                <Button type="submit" variant="!primary" disabled={isSubmitting}
                                    className="w-full sm:w-auto !p-3 justify-center shadow-primary/30 shadow-lg group">
                                    {isSubmitting
                                        ? <Icon icon="solar:spinner-linear" className="animate-spin text-xl text-white mr-2" />
                                        : <Icon icon="solar:user-check-bold-duotone" className="text-xl text-white !mr-2 group-hover:scale-110 transition-transform" />
                                    }
                                    Xác nhận thêm & Gán vào lớp
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* ── Step 1: Result ── */}
                    {step === 1 && createResult && (
                        <div className="!p-6 md:!p-8 space-y-6 animate-fade-in-up">

                            {/* Success Banner */}
                            <div className={`flex items-center !gap-4 !p-5 rounded-2xl border ${createResult.isNewAccount ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shrink-0 ${createResult.isNewAccount ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-blue-500 shadow-blue-500/20'} text-white`}>
                                    <Icon icon={createResult.isNewAccount ? 'solar:user-plus-bold' : 'solar:user-check-bold'} className="text-2xl" />
                                </div>
                                <div>
                                    <p className="font-bold text-base">
                                        {createResult.isNewAccount ? 'Tạo tài khoản mới thành công!' : 'Tài khoản đã tồn tại — đã gán vào lớp!'}
                                    </p>
                                    <p className="text-xs opacity-75 mt-0.5">
                                        {createResult.isNewAccount
                                            ? 'Học sinh đã được khởi tạo tài khoản và thêm vào lớp học.'
                                            : 'Số điện thoại này đã có tài khoản. Đã gán thẳng vào lớp học.'}
                                    </p>
                                </div>
                            </div>

                            {/* Student Info Card */}
                            <div className="border border-border rounded-2xl overflow-hidden">
                                <div className="!px-5 !py-3 bg-background/60 border-b border-border">
                                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Thông tin học sinh</p>
                                </div>

                                <div className="!p-5 space-y-4">
                                    {/* Avatar + Name */}
                                    <div className="flex items-center !gap-4">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white shrink-0 ${createResult.isNewAccount ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                                            {createResult.fullName?.charAt(0) || 'S'}
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-text-main">{createResult.fullName}</p>
                                            <p className="text-sm text-text-muted">{createResult.phoneNumber}</p>
                                        </div>
                                        <div className="ml-auto">
                                            <span className={`text-[11px] font-bold !px-3 !py-1 rounded-full ${createResult.isNewAccount ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {createResult.isNewAccount ? '🆕 Tài khoản mới' : '✅ Đã tồn tại'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="h-px bg-border" />

                                    {/* Fields */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Password */}
                                        <div className={`!p-3 rounded-xl border ${createResult.isNewAccount ? 'bg-emerald-50 border-emerald-200' : 'bg-background border-border'}`}>
                                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Mật khẩu khởi tạo</p>
                                            {createResult.isNewAccount && createResult.password ? (
                                                <div className="flex items-center !gap-2">
                                                    <p className="text-sm font-mono font-bold text-emerald-700 flex-1">
                                                        {showResultPassword ? createResult.password : '••••••••••'}
                                                    </p>
                                                    <button type="button" onClick={() => setShowResultPassword(v => !v)}
                                                        className="text-emerald-600 hover:text-emerald-800 transition-colors shrink-0">
                                                        <Icon icon={showResultPassword ? 'solar:eye-closed-linear' : 'solar:eye-linear'} className="text-base" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-text-muted italic">Không hiển thị (tài khoản cũ)</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Notice for new account */}
                                    {createResult.isNewAccount && (
                                        <div className="flex items-start !gap-2 !p-3 bg-amber-50 border border-amber-200 rounded-xl">
                                            <Icon icon="solar:danger-triangle-bold-duotone" className="text-amber-500 text-lg shrink-0 mt-0.5" />
                                            <p className="text-xs text-amber-700 font-medium">
                                                Hãy ghi lại mật khẩu này trước khi đóng. Mật khẩu sẽ không hiển thị lại sau khi bạn bấm hoàn tất.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex flex-col-reverse sm:flex-row justify-end !gap-3 !pt-4 border-t border-border">
                                <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto justify-center">
                                    <Icon icon="solar:user-plus-bold-duotone" className="text-lg !mr-2" />
                                    Thêm học sinh khác
                                </Button>
                                <Button onClick={onClose} className="w-full sm:w-auto !px-8 justify-center">
                                    Hoàn tất
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>,
        document.body
    );
};

export default AddStudentModal;
