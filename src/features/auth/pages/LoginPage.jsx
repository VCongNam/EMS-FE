import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import AuthLayout from '../components/AuthLayout';
import useAuthStore from '../../../store/authStore';
import { getApiUrl } from '../../../config/api';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuthStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(getApiUrl('/api/Auth/login'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại!');
            }

            const data = await response.json();

            // Hàm login trong store đã được viết để xử lý token và decode -> lấy ra role tự động
            login(data);

            // Navigate tương ứng với store set -> Cần lấy state mới nhất
            const stateStore = useAuthStore.getState();
            if (stateStore.user?.role === 'teacher') {
                navigate('/teacher/classes');
            } else {
                navigate('/dashboard');
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Chào mừng trở lại!"
            subtitle="Đăng nhập vào tài khoản của bạn để tiếp tục."
        >
            <form className="animate-fade-in-up !space-y-6" onSubmit={handleLogin}>
                {error && (
                    <div className="!p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2">
                        {error}
                    </div>
                )}

                <div className="!space-y-5">
                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-semibold text-text-main !mb-2">
                            Tên đăng nhập / Email
                        </label>
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="name@school.edu.vn"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full !px-4 !py-3.5 rounded-xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-text-main font-medium placeholder:text-text-muted/50"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <div className="flex items-center justify-between !mb-2">
                            <label className="text-sm font-semibold text-text-main">
                                Mật khẩu
                            </label>
                            <Link to="/forgot-password" className="text-sm font-medium text-primary hover:text-primary-dark hover:underline transition-colors">
                                Quên mật khẩu?
                            </Link>
                        </div>
                        <div className="relative group">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
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
                </div>

                <div className="!pt-2">
                    <Button
                        variant="primary"
                        size="lg"
                        type="submit"
                        disabled={loading}
                        className="w-full !py-4 text-[15px] !text-primary rounded-xl font-bold shadow-premium-primary hover:shadow-premium-primary-hover hover:-translate-y-0.5 transition-all duration-300 bg-primary text-white disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                    >
                        {loading ? 'Đang xử lý...' : 'Đăng nhập ngay'}
                    </Button>
                </div>

                <div className="text-center !mt-6">
                    <p className="text-text-muted font-medium">
                        Chưa có tài khoản?{' '}
                        <Link to="/register" className="text-primary font-bold hover:underline transition-all">
                            Đăng ký
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
};

export default LoginPage;
