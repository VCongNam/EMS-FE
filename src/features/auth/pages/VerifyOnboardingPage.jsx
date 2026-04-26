import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import Button from '../../../components/ui/Button';
import AuthLayout from '../components/AuthLayout';
import { authService } from '../api/authService';

const VerifyOnboardingPage = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        phoneNumber: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError(null);

        // 1. Số điện thoại: 10 số, đầu 03x/05x/07x/08x/09x
        const phoneRegex = /^(0[3-9])\d{8}$/;
        if (!phoneRegex.test(formData.phoneNumber.trim())) {
            setError('Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng Việt Nam (10 số, bắt đầu bằng 0).');
            return;
        }

        // 2. Mật khẩu mới: ≥ 8 ký tự, 1 hoa, 1 thường, 1 ký tự đặc biệt
        const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (!pwRegex.test(formData.newPassword)) {
            setError('Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm 1 chữ in hoa, 1 chữ in thường và 1 ký tự đặc biệt.');
            return;
        }

        // 3. Xác nhận mật khẩu khớp
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Mật khẩu mới và xác nhận mật khẩu không khớp.');
            return;
        }

        setLoading(true);
        try {
            const response = await authService.verifyOnboarding(formData);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.log("[VerifyOnboarding] Error Status:", response.status);
                console.log("[VerifyOnboarding] Error Data:", errorData);

                // Parse validation errors from BE
                if (errorData.errors && typeof errorData.errors === 'object') {
                    const translateMsg = (msg) => {
                        const m = msg.toLowerCase();
                        if (m.includes('at least 8') || m.includes('8 character')) return 'ít nhất 8 ký tự';
                        if (m.includes('uppercase')) return 'có ít nhất 1 chữ in hoa';
                        if (m.includes('lowercase')) return 'có ít nhất 1 chữ in thường';
                        if (m.includes('digit') || (m.includes('numeric') && !m.includes('non'))) return 'có ít nhất 1 chữ số';
                        if (m.includes('non alphanumeric') || m.includes('special character')) return 'có ít nhất 1 ký tự đặc biệt (!@#$...)';
                        return null;
                    };
                    const allMessages = Object.values(errorData.errors).flat();
                    const translated = allMessages.map(translateMsg).filter(Boolean);
                    if (translated.length > 0) {
                        throw new Error('Mật khẩu phải ' + translated.join(', ') + '.');
                    }
                }
                throw new Error(errorData.message || errorData.title || 'Kích hoạt tài khoản thất bại. Vui lòng kiểm tra lại thông tin!');
            }

            toast.success('Kích hoạt tài khoản thành công! Vui lòng đăng nhập lại với mật khẩu mới.');
            navigate('/login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "w-full !pl-12 !pr-12 !py-3.5 rounded-xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-text-main font-medium placeholder:text-text-muted/50";
    const labelClasses = "block text-sm font-semibold text-text-main !mb-2";

    return (
        <AuthLayout
            title="Kích hoạt tài khoản"
            subtitle="Đây là lần đầu bạn đăng nhập. Vui lòng cập nhật số điện thoại và mật khẩu để bảo mật tài khoản."
        >
            <form className="animate-fade-in-up !space-y-5" onSubmit={handleVerify}>
                {error && (
                    <div className="!p-4 rounded-xl bg-red-50 border border-red-400/20 text-red-600 text-sm font-medium flex items-center !gap-3 animate-shake">
                        <Icon icon="solar:danger-bold-duotone" className="text-xl shrink-0" />
                        {error}
                    </div>
                )}

                {/* Phone Number */}
                <div>
                    <label className={labelClasses}>Số điện thoại</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 !pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                            <Icon icon="solar:phone-calling-bold-duotone" className="text-xl" />
                        </div>
                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder="Nhập số điện thoại của bạn"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                            className={inputClasses}
                        />
                    </div>
                </div>

                {/* Old Password */}
                <div>
                    <label className={labelClasses}>Mật khẩu hiện tại (được cấp)</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 !pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                            <Icon icon="solar:lock-password-bold-duotone" className="text-xl" />
                        </div>
                        <input
                            type={showPasswords.old ? "text" : "password"}
                            name="oldPassword"
                            placeholder="Mật khẩu giáo viên đã cấp"
                            value={formData.oldPassword}
                            onChange={handleChange}
                            required
                            className={inputClasses}
                        />
                        <button
                            type="button"
                            onClick={() => togglePasswordVisibility('old')}
                            className="absolute inset-y-0 right-0 !pr-4 flex items-center text-text-muted hover:text-primary transition-colors"
                        >
                            <Icon icon={showPasswords.old ? "solar:eye-closed-bold-duotone" : "solar:eye-bold-duotone"} className="text-xl" />
                        </button>
                    </div>
                </div>

                <div className="!grid grid-cols-1 md:grid-cols-2 !gap-4">
                    {/* New Password */}
                    <div>
                        <label className={labelClasses}>Mật khẩu mới</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 !pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                                <Icon icon="solar:key-bold-duotone" className="text-xl" />
                            </div>
                            <input
                                type={showPasswords.new ? "text" : "password"}
                                name="newPassword"
                                placeholder="Tối thiểu 8 ký tự"
                                value={formData.newPassword}
                                onChange={handleChange}
                                required
                                className={inputClasses}
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('new')}
                                className="absolute inset-y-0 right-0 !pr-4 flex items-center text-text-muted hover:text-primary transition-colors"
                            >
                                <Icon icon={showPasswords.new ? "solar:eye-closed-bold-duotone" : "solar:eye-bold-duotone"} className="text-xl" />
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className={labelClasses}>Xác nhận mật khẩu</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 !pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                                <Icon icon="solar:shield-check-bold-duotone" className="text-xl" />
                            </div>
                            <input
                                type={showPasswords.confirm ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Nhập lại mật khẩu mới"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className={inputClasses}
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility('confirm')}
                                className="absolute inset-y-0 right-0 !pr-4 flex items-center text-text-muted hover:text-primary transition-colors"
                            >
                                <Icon icon={showPasswords.confirm ? "solar:eye-closed-bold-duotone" : "solar:eye-bold-duotone"} className="text-xl" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="!pt-4">
                    <Button
                        variant="primary"
                        size="lg"
                        type="submit"
                        disabled={loading}
                        className="w-full !py-4 text-[15px] rounded-xl font-bold bg-primary text-white shadow-premium-primary hover:shadow-premium-primary-hover hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? 'Đang kích hoạt...' : 'Kích hoạt tài khoản'}
                        {!loading && <Icon icon="solar:verified-check-bold-duotone" className="text-xl" />}
                    </Button>
                </div>

                <div className="text-center !mt-6">
                    <button 
                        type="button"
                        onClick={() => navigate('/login')}
                        className="text-text-muted font-bold hover:text-primary transition-all text-sm"
                    >
                        ← Quay lại đăng nhập
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
};

export default VerifyOnboardingPage;
