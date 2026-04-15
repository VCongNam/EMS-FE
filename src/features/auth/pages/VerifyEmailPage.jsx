import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../../../components/ui/Button';
import AuthLayout from '../components/AuthLayout';
import { authService } from '../api/authService';

const VerifyEmailPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Retrieve email from navigation state or fallback
    const email = location.state?.email || '';
    
    const [otpCode, setOtpCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const [error, setError] = useState(null);

    // Countdown effect for Resend button
    useEffect(() => {
        let interval = null;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    // If no email is provided, they shouldn't be here
    if (!email) {
        navigate('/register');
        return null;
    }

    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await authService.verifyEmail({ email, otpCode });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Xác thực email thất bại. Mã xác nhận không hợp lệ!');
            }

            toast.success("Xác thực email thành công! Chào mừng bạn.");
            // Đăng ký và xác thực thành công, chuyển hướng về Login
            navigate('/login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0 || resending) return;

        setResending(true);
        setError(null);
        try {
            const response = await authService.resendOtp(email);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Không thể gửi lại mã OTP.');
            }
            toast.success("Mã OTP mới đã được gửi tới email của bạn!");
            setResendTimer(60); // Reset timer
        } catch (err) {
            toast.error(err.message);
            setError(err.message);
        } finally {
            setResending(false);
        }
    };

    return (
        <AuthLayout
            title="Xác thực Email"
            subtitle="Mã xác thực 6 số đã được gửi tới email của bạn."
        >
            <form className="animate-fade-in-up !space-y-5" onSubmit={handleVerifyEmail}>
                {error && (
                    <div className="!p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2">
                        {error}
                    </div>
                )}

                <div className="bg-green-50 border border-green-200 text-green-700 !p-4 rounded-xl text-sm !mb-6">
                    Mã xác nhận OTP đã được gửi tới <strong className="text-green-800">{email}</strong>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-text-main !mb-2">Mã xác nhận (OTP)</label>
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Nhập mã 6 chữ số"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            required
                            className="w-full !px-4 !py-3.5 rounded-xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-text-main font-medium placeholder:text-text-muted/50 tracking-widest text-center"
                        />
                    </div>
                </div>

                {/* Resend OTP Link */}
                <div className="text-center !mt-4">
                    {resendTimer > 0 ? (
                        <p className="text-sm text-text-muted font-medium">
                            Gửi lại mã sau <span className="text-primary font-bold">{resendTimer}s</span>
                        </p>
                    ) : (
                        <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={resending}
                            className="text-sm text-primary font-bold hover:underline disabled:opacity-50"
                        >
                            {resending ? 'Đang gửi...' : 'Chưa nhận được mã? Gửi lại ngay'}
                        </button>
                    )}
                </div>

                <div className="!pt-2 !space-y-4">
                    <Button
                        variant="primary"
                        size="lg"
                        type="submit"
                        disabled={loading}
                        className="w-full !py-4 text-[15px] !text-primary rounded-xl font-bold shadow-premium-primary hover:shadow-premium-primary-hover hover:-translate-y-0.5 transition-all duration-300 bg-primary text-white disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                    >
                        {loading ? 'Đang xác thực...' : 'Xác thực & Đăng nhập'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/register')}
                        className="w-full !py-4 font-bold rounded-xl border-2 hover:bg-background transition-colors text-text-main"
                    >
                        Quay lại đăng ký
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
};

export default VerifyEmailPage;
