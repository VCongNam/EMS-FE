import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import { classService } from '../../../../api/classService';
import useAuthStore from '../../../../../../store/authStore';

// ── Tạo mật khẩu ngẫu nhiên đủ điều kiện ──────────────────────────────────
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '0123456789';
const SPECIAL = '!@#$%^&*()_+-=[]{}|;:,.<>?';

function generatePassword(length = 12) {
    const all = UPPER + LOWER + DIGITS + SPECIAL;
    // Đảm bảo đủ mỗi loại
    const required = [
        UPPER[Math.floor(Math.random() * UPPER.length)],
        LOWER[Math.floor(Math.random() * LOWER.length)],
        DIGITS[Math.floor(Math.random() * DIGITS.length)],
        SPECIAL[Math.floor(Math.random() * SPECIAL.length)],
    ];
    const rest = Array.from({ length: length - 4 }, () => all[Math.floor(Math.random() * all.length)]);
    return [...required, ...rest].sort(() => Math.random() - 0.5).join('');
}

// ── Step 1: Confirm ────────────────────────────────────────────────────────
const ConfirmStep = ({ studentName, onConfirm, onClose }) => (
    <div className="!p-6 md:!p-8 space-y-6 animate-fade-in-up">
        {/* Icon */}
        <div className="flex flex-col items-center text-center !gap-3">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center shadow-lg">
                <Icon icon="solar:key-bold-duotone" className="text-3xl text-amber-500" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-text-main">Xác nhận reset mật khẩu</h3>
                <p className="text-sm text-text-muted mt-1">
                    Bạn có chắc muốn đặt lại mật khẩu cho học sinh{' '}
                    <span className="font-bold text-text-main">"{studentName}"</span> không?
                </p>
            </div>
        </div>

        <div className="flex items-start !gap-3 !p-4 bg-amber-50 border border-amber-200 rounded-2xl">
            <Icon icon="solar:danger-triangle-bold-duotone" className="text-amber-500 text-xl shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">
                Sau khi reset, học sinh sẽ không thể đăng nhập bằng mật khẩu cũ. Hãy gửi mật khẩu mới cho học sinh ngay sau khi thực hiện.
            </p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end !gap-3 !pt-2">
            <button onClick={onClose}
                className="!px-5 !py-2.5 rounded-xl border border-border text-text-muted hover:text-text-main hover:bg-background transition-colors text-sm font-semibold">
                Hủy bỏ
            </button>
            <button onClick={onConfirm}
                style={{ backgroundColor: '#f59e0b', color: '#ffffff' }}
                className="!px-5 !py-2.5 rounded-xl hover:opacity-90 text-sm font-bold transition-opacity flex items-center gap-2 justify-center shadow-lg">
                <Icon icon="solar:key-bold" className="text-base" />
                Tiếp tục đặt mật khẩu
            </button>
        </div>
    </div>
);

// ── Step 2: Set New Password ───────────────────────────────────────────────
const SetPasswordStep = ({ studentName, studentId, onSuccess, onClose }) => {
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleRandom = () => {
        const pw = generatePassword(12);
        setPassword(pw);
        setShowPw(true);
    };

    const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    const isValid = pwRegex.test(password);

    const handleSubmit = async () => {
        if (!isValid) {
            toast.error('Mật khẩu phải có ít nhất 8 ký tự, 1 chữ in hoa, 1 chữ in thường và 1 ký tự đặc biệt.');
            return;
        }
        setIsSaving(true);
        try {
            const token = useAuthStore.getState().user?.token;
            const res = await classService.resetStudentPassword(studentId, password, token);
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || 'Không thể reset mật khẩu.');
            }
            onSuccess(password);
        } catch (err) {
            toast.error(err.message || 'Lỗi hệ thống.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="!p-6 md:!p-8 space-y-5 animate-fade-in-up">
            <div className="flex items-center !gap-3 border-b border-border !pb-4">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Icon icon="solar:lock-password-bold-duotone" className="text-xl" />
                </div>
                <div>
                    <p className="font-bold text-text-main">Nhập mật khẩu mới</p>
                    <p className="text-xs text-text-muted">Cho học sinh: <span className="font-semibold text-text-main">{studentName}</span></p>
                </div>
            </div>

            {/* Password input */}
            <div>
                <label className="block text-sm font-semibold text-text-main !mb-2">
                    Mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <div className="flex !gap-2">
                    <div className="relative flex-1">
                        <Icon icon="solar:lock-password-linear" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted text-base" />
                        <input
                            type={showPw ? 'text' : 'password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Nhập hoặc tạo ngẫu nhiên..."
                            className="w-full !pl-10 !pr-11 !py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-text-main placeholder:text-text-muted/50 font-mono"
                        />
                        <button type="button" onClick={() => setShowPw(v => !v)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors" tabIndex={-1}>
                            <Icon icon={showPw ? 'solar:eye-closed-linear' : 'solar:eye-linear'} className="text-base" />
                        </button>
                    </div>

                    {/* Random Password Button */}
                    <button
                        type="button"
                        onClick={handleRandom}
                        title="Tạo mật khẩu ngẫu nhiên"
                        style={{ color: 'var(--color-primary, #6366f1)' }}
                        className="!px-3 !py-3 rounded-xl !bg-primary/10 hover:!bg-primary/20 transition-all border border-primary/20 hover:border-primary/40 shrink-0 flex items-center gap-2 font-bold text-sm"
                    >
                        <Icon icon="solar:refresh-bold-duotone" className="text-lg" />
                        <span className="hidden sm:inline">Ngẫu nhiên</span>
                    </button>
                </div>

                {/* Password strength hint */}
                {password.length > 0 && (
                    <p className={`text-[11px] mt-1.5 font-medium ${isValid ? 'text-emerald-600' : 'text-text-muted'}`}>
                        {isValid
                            ? '✓ Mật khẩu hợp lệ'
                            : '✗ Cần ít nhất 8 ký tự, 1 hoa, 1 thường, 1 ký tự đặc biệt'}
                    </p>
                )}
            </div>

            {/* Warning */}
            <div className="flex items-start !gap-2.5 !p-3.5 bg-blue-50 border border-blue-200 rounded-xl">
                <Icon icon="solar:info-circle-bold-duotone" className="text-blue-500 text-lg shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 font-medium leading-relaxed">
                    <span className="font-bold">Lưu ý:</span> Hãy ghi lại và gửi mật khẩu mới cho học sinh ngay sau khi reset. Mật khẩu sẽ không được lưu lại trong hệ thống.
                </p>
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse sm:flex-row justify-end !gap-3 !pt-2 border-t border-border">
                <button onClick={onClose}
                    className="!px-5 !py-2.5 rounded-xl border border-border text-text-muted hover:text-text-main hover:bg-background transition-colors text-sm font-semibold">
                    Hủy
                </button>
                <button onClick={handleSubmit} disabled={isSaving || !isValid}
                    style={{ backgroundColor: 'var(--color-primary, #6366f1)', color: '#ffffff' }}
                    className="!px-5 !py-2.5 rounded-xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-bold transition-opacity flex items-center gap-2 justify-center shadow-lg">
                    {isSaving
                        ? <Icon icon="solar:spinner-linear" className="animate-spin text-base" />
                        : <Icon icon="solar:key-bold" className="text-base" />}
                    Xác nhận reset
                </button>
            </div>
        </div>
    );
};

// ── Step 3: Done ───────────────────────────────────────────────────────────
const DoneStep = ({ newPassword, onClose }) => {
    const [showPw, setShowPw] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(newPassword);
        toast.success('Đã sao chép mật khẩu!');
    };

    return (
        <div className="!p-6 md:!p-8 space-y-5 animate-fade-in-up">
            <div className="flex flex-col items-center text-center !gap-3">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center shadow-lg">
                    <Icon icon="solar:check-circle-bold-duotone" className="text-3xl text-emerald-500" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-emerald-700">Reset mật khẩu thành công!</h3>
                    <p className="text-sm text-text-muted mt-1">Mật khẩu đã được cập nhật cho học sinh.</p>
                </div>
            </div>

            <div className="!p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider !mb-2">Mật khẩu mới</p>
                <div className="flex items-center !gap-2">
                    <p className="text-base font-mono font-bold text-emerald-700 flex-1">
                        {showPw ? newPassword : '••••••••••••'}
                    </p>
                    <button onClick={() => setShowPw(v => !v)} className="text-emerald-600 hover:text-emerald-800 transition-colors shrink-0">
                        <Icon icon={showPw ? 'solar:eye-closed-linear' : 'solar:eye-linear'} className="text-lg" />
                    </button>
                    <button onClick={handleCopy} className="!p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-colors shrink-0" title="Sao chép">
                        <Icon icon="solar:copy-bold-duotone" className="text-base" />
                    </button>
                </div>
            </div>

            <div className="flex items-start !gap-2.5 !p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
                <Icon icon="solar:danger-triangle-bold-duotone" className="text-amber-500 text-lg shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 font-medium">
                    Gửi ngay mật khẩu này cho học sinh. Sau khi đóng modal, mật khẩu sẽ không hiển thị lại.
                </p>
            </div>

            <div className="flex justify-end !pt-2 border-t border-border">
                <button onClick={onClose}
                    style={{ backgroundColor: 'var(--color-primary, #6366f1)', color: '#ffffff' }}
                    className="!px-6 !py-2.5 rounded-xl hover:opacity-90 text-sm font-bold transition-opacity shadow-lg">
                    Hoàn tất
                </button>
            </div>
        </div>
    );
};

// ── Main Modal ─────────────────────────────────────────────────────────────
const ResetPasswordModal = ({ isOpen, onClose, studentId, studentName }) => {
    const [step, setStep] = useState(0); // 0: confirm, 1: set pw, 2: done
    const [newPassword, setNewPassword] = useState('');

    if (!isOpen) return null;

    const handleClose = () => {
        setStep(0);
        setNewPassword('');
        onClose();
    };

    const handleSuccess = (pw) => {
        setNewPassword(pw);
        setStep(2);
    };

    const STEP_LABELS = ['Xác nhận', 'Đặt mật khẩu', 'Hoàn tất'];

    return ReactDOM.createPortal(
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9997] animate-fade-in" onClick={handleClose} />
            <div className="fixed inset-0 z-[9998] flex items-center justify-center !p-4 pointer-events-none">
                <div
                    className="bg-surface rounded-3xl shadow-2xl w-full max-w-md animate-fade-in-up pointer-events-auto flex flex-col relative"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between !px-6 !pt-6 !pb-4 border-b border-border">
                        <div className="flex items-center !gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                                <Icon icon="solar:key-bold-duotone" className="text-xl" />
                            </div>
                            <div>
                                <h2 className="font-bold text-text-main text-base">Reset mật khẩu học sinh</h2>
                                {/* Step indicator */}
                                <div className="flex items-center !gap-1 mt-0.5">
                                    {STEP_LABELS.map((label, i) => (
                                        <React.Fragment key={i}>
                                            <span className={`text-[10px] font-semibold ${i === step ? 'text-primary' : i < step ? 'text-emerald-500' : 'text-text-muted/50'}`}>
                                                {i < step ? '✓' : i + 1}. {label}
                                            </span>
                                            {i < STEP_LABELS.length - 1 && <span className="text-text-muted/30 text-[10px]">›</span>}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button onClick={handleClose}
                            className="w-8 h-8 rounded-xl bg-background border border-border flex items-center justify-center text-text-muted hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all shrink-0">
                            <Icon icon="material-symbols:close-rounded" className="text-lg" />
                        </button>
                    </div>

                    {/* Steps */}
                    {step === 0 && <ConfirmStep studentName={studentName} onConfirm={() => setStep(1)} onClose={handleClose} />}
                    {step === 1 && <SetPasswordStep studentName={studentName} studentId={studentId} onSuccess={handleSuccess} onClose={handleClose} />}
                    {step === 2 && <DoneStep newPassword={newPassword} onClose={handleClose} />}
                </div>
            </div>
        </>,
        document.body
    );
};

export default ResetPasswordModal;
