import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import AuthLayout from '../components/AuthLayout';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
    const [submitted, setSubmitted] = useState(false);

    // Toggle password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }
        // Call API to reset password
        setSubmitted(true);
        setTimeout(() => {
            navigate('/login');
        }, 3000);
    };

    return (
        <AuthLayout
            title="Đặt Mật Khẩu Mới"
            subtitle="Bảo vệ tài khoản của bạn với một mật khẩu an toàn."
        >
            {!submitted ? (
                <form onSubmit={handleSubmit} className="animate-fade-in-up !space-y-6">
                    <div className="!space-y-5">
                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-semibold text-text-main !mb-2">
                                Mật khẩu mới
                            </label>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full !pl-4 !pr-16 !py-3.5 rounded-xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-text-main font-medium placeholder:text-text-muted/50 font-mono tracking-wider"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 !pr-4 flex items-center text-sm font-semibold text-text-muted hover:text-primary transition-colors"
                                >
                                    {showPassword ? "Ẩn" : "Hiện"}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-semibold text-text-main !mb-2">
                                Xác nhận mật khẩu
                            </label>
                            <div className="relative group">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full !pl-4 !pr-16 !py-3.5 rounded-xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-text-main font-medium placeholder:text-text-muted/50 font-mono tracking-wider"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 !pr-4 flex items-center text-sm font-semibold text-text-muted hover:text-primary transition-colors"
                                >
                                    {showConfirmPassword ? "Ẩn" : "Hiện"}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="!pt-2">
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full !py-4 text-[15px] !text-primary rounded-xl font-bold shadow-premium-primary hover:shadow-premium-primary-hover hover:-translate-y-0.5 transition-all duration-300 bg-primary text-white flex items-center justify-center gap-2"
                        >
                            Lưu mật khẩu & Đăng nhập
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="text-center animate-fade-in !py-8">
                    <div className="w-16 h-16 bg-green-100/50 rounded-full flex items-center justify-center mx-auto !mb-6">
                        <span className="text-3xl text-green-600">✓</span>
                    </div>
                    <h3 className="text-2xl font-bold text-text-main !mb-3">Thành công!</h3>
                    <p className="text-text-muted">Mật khẩu của bạn đã được thay đổi. Hệ thống sẽ tự động chuyển hướng về trang đăng nhập...</p>
                </div>
            )}
        </AuthLayout>
    );
};

export default ResetPasswordPage;
