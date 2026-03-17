import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import useAuthStore from '../../../store/authStore';
import { getApiUrl } from '../../../config/api';

const EyeIcon = ({ open }) => open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
);

const ROLE_OPTIONS = [
    {
        id: 'student',
        label: 'Học sinh',
        description: 'Xem lịch học, bài tập và điểm số',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
        ),
    },
    {
        id: 'teacher',
        label: 'Giáo viên',
        description: 'Quản lý lớp học, điểm số và lịch dạy',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M3 9h18M9 21V9" />
            </svg>
        ),
    },
    {
        id: 'assistant',
        label: 'Trợ giảng',
        description: 'Hỗ trợ điểm danh và quản lý lớp',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
];

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { login } = useAuthStore();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(getApiUrl('/api/Auth/login'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại!');
            }

            const data = await response.json();
            login(data);

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

    const panelContent = (
        <div>
            <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-white/15 text-white/90 text-xs font-semibold rounded-full uppercase tracking-wider">
                    Hệ thống Quản lý Giáo dục
                </span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
                Chào mừng<br />
                trở lại<br />
                <span className="text-accent">EMS</span>
            </h1>
            <p className="text-white/65 text-base leading-relaxed max-w-xs mb-10">
                Đăng nhập để tiếp tục hành trình học tập và giảng dạy của bạn.
            </p>

            {/* Role highlights */}
            <div className="space-y-3">
                {ROLE_OPTIONS.map((role) => (
                    <div key={role.id} className="flex items-center gap-3 text-white/70">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                            {role.icon}
                        </div>
                        <div>
                            <p className="text-white/90 text-sm font-medium">{role.label}</p>
                            <p className="text-white/45 text-xs">{role.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <AuthLayout
            title="Đăng nhập"
            subtitle="Nhập thông tin tài khoản của bạn để tiếp tục."
            panelContent={panelContent}
        >
            <form onSubmit={handleLogin} noValidate>
                {error && (
                    <div className="mb-5 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 mt-0.5 flex-shrink-0">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" x2="12" y1="8" y2="12" />
                            <line x1="12" x2="12.01" y1="16" y2="16" />
                        </svg>
                        <p className="text-red-600 text-sm leading-relaxed">{error}</p>
                    </div>
                )}

                <div className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-text-main mb-1.5">
                            Email hoặc tên đăng nhập
                        </label>
                        <input
                            type="text"
                            placeholder="example@school.edu.vn"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="username"
                            className="w-full px-4 py-3 rounded-xl bg-surface border border-border outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all text-text-main placeholder:text-text-muted/50 text-sm"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-sm font-semibold text-text-main">Mật khẩu</label>
                            <Link
                                to="/forgot-password"
                                className="text-xs text-primary font-medium hover:underline"
                            >
                                Quên mật khẩu?
                            </Link>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                className="w-full px-4 py-3 pr-11 rounded-xl bg-surface border border-border outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all text-text-main placeholder:text-text-muted/50 text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
                                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                            >
                                <EyeIcon open={showPassword} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 px-6 py-3.5 bg-primary text-white text-sm font-semibold rounded-xl shadow-md hover:bg-primary-hover active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Đang đăng nhập...
                        </>
                    ) : (
                        'Đăng nhập'
                    )}
                </button>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="px-3 bg-background text-xs text-text-muted">Bạn là giáo viên hoặc trợ giảng?</span>
                    </div>
                </div>

                <Link
                    to="/register"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-surface text-text-main text-sm font-medium hover:border-primary hover:text-primary transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <line x1="19" x2="19" y1="8" y2="14" />
                        <line x1="22" x2="16" y1="11" y2="11" />
                    </svg>
                    Tạo tài khoản giáo viên / trợ giảng
                </Link>
            </form>
        </AuthLayout>
    );
};

export default LoginPage;
