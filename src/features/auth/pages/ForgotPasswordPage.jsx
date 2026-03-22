import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import AuthLayout from '../components/AuthLayout';
import { getApiUrl } from '../../../config/api';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [formData, setFormData] = useState({ code: '', password: '', confirmPassword: '' });

    // Toggle password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // UI states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await fetch(getApiUrl('/api/Auth/forgot-password'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Gửi yêu cầu thất bại. Vui lòng thử lại!');
            }

            // Call API to send reset link/code
            setStep(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(getApiUrl('/api/Auth/reset-password'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    otpCode: formData.code,
                    newPassword: formData.password
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Mã xác nhận không hợp lệ hoặc đã hết hạn.');
            }

            setStep(3);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title={step === 1 ? "Quên Mật Khẩu" : step === 2 ? "Đặt Mật Khẩu Mới" : "Thành công"}
            subtitle={step === 1 ? "Nhập email của bạn để nhận mã khôi phục." : step === 2 ? "Nhập mã đã được gửi đến email và mật khẩu mới." : ""}
        >
            {step === 1 && (
                <form onSubmit={handleEmailSubmit} className="animate-fade-in-up !space-y-6">
                    {error && (
                        <div className="!p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="!space-y-2">
                        <label className="block text-sm font-semibold text-text-main !mb-2">Email đăng ký</label>
                        <div className="relative group">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@school.edu.vn"
                                className="w-full !px-4 !py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-text-main font-medium placeholder:text-text-muted/50"
                            />
                        </div>
                    </div>

                    <div className="!pt-2">
                        <Button
                            type="submit"
                            size="lg"
                            disabled={loading}
                            className="w-full !py-4 text-[15px] !text-primary rounded-xl font-bold shadow-premium-primary hover:shadow-premium-primary-hover hover:-translate-y-0.5 transition-all duration-300 bg-primary text-white disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                        >
                            {loading ? 'Đang gửi...' : 'Nhận mã khôi phục'}
                        </Button>
                    </div>

                    <div className="text-center !mt-6">
                        <Link to="/login" className="text-sm font-bold text-text-muted hover:text-primary transition-colors flex items-center justify-center gap-2">
                            <span>←</span> Quay lại Đăng nhập
                        </Link>
                    </div>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handlePasswordSubmit} className="animate-fade-in-up !space-y-6">
                    {error && (
                        <div className="!p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="!space-y-5">
                        <div className="bg-green-50 border border-green-200 text-green-700 !p-4 rounded-xl text-sm">
                            Mã khôi phục đã được gửi tới <strong className="text-green-800">{email}</strong>
                        </div>

                        {/* Reset Code */}
                        <div>
                            <label className="block text-sm font-semibold text-text-main !mb-2">
                                Mã khôi phục
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                placeholder="Nhập mã 6 chữ số"
                                className="w-full !px-4 !py-3.5 rounded-xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-text-main font-medium placeholder:text-text-muted/50 tracking-widest"
                            />
                        </div>

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

                    <div className="!pt-2 !space-y-4">
                        <Button
                            type="submit"
                            size="lg"
                            disabled={loading}
                            className="w-full !py-4 text-[15px] !text-primary rounded-xl font-bold shadow-premium-primary hover:shadow-premium-primary-hover hover:-translate-y-0.5 transition-all duration-300 bg-primary text-white disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                        >
                            {loading ? 'Đang lưu...' : 'Lưu mật khẩu & Đăng nhập'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setStep(1)}
                            className="w-full !py-4 font-bold rounded-xl border-2 hover:bg-background transition-colors text-text-main"
                        >
                            Quay lại
                        </Button>
                    </div>
                </form>
            )}

            {step === 3 && (
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

export default ForgotPasswordPage;
