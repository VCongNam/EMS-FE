import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
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

const ROLES = [
    {
        id: 'teacher',
        label: 'Giáo viên',
        description: 'Tạo và quản lý lớp học',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M3 9h18M9 21V9" />
            </svg>
        ),
    },
    {
        id: 'assistant',
        label: 'Trợ giảng',
        description: 'Hỗ trợ giảng dạy và điểm danh',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
];

const RegisterPage = () => {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'teacher',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const validate = () => {
        if (!form.firstName.trim() || !form.lastName.trim()) return 'Vui lòng nhập đầy đủ họ và tên.';
        if (!form.email.trim()) return 'Vui lòng nhập email.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Email không hợp lệ.';
        if (form.password.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự.';
        if (form.password !== form.confirmPassword) return 'Mật khẩu xác nhận không khớp.';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validate();
        if (validationError) { setError(validationError); return; }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(getApiUrl('/api/Auth/register'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: form.firstName,
                    lastName: form.lastName,
                    email: form.email,
                    password: form.password,
                    role: form.role,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Đăng ký thất bại. Vui lòng thử lại!');
            }

            setSuccess(true);
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
                    Dành cho giảng viên
                </span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
                Bắt đầu<br />
                hành trình<br />
                <span className="text-accent">giảng dạy</span>
            </h1>
            <p className="text-white/65 text-base leading-relaxed max-w-xs mb-10">
                Tạo tài khoản miễn phí để quản lý lớp học, theo dõi tiến độ học sinh và tối ưu hóa quy trình giảng dạy.
            </p>
            <div className="space-y-4">
                {[
                    { icon: '✓', text: 'Quản lý nhiều lớp học cùng lúc' },
                    { icon: '✓', text: 'Theo dõi điểm số và tiến độ học tập' },
                    { icon: '✓', text: 'Điểm danh tự động và báo cáo chi tiết' },
                    { icon: '✓', text: 'Phân quyền linh hoạt cho trợ giảng' },
                ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-accent text-xs font-bold">{item.icon}</span>
                        </div>
                        <p className="text-white/70 text-sm">{item.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    if (success) {
        return (
            <AuthLayout
                title="Đăng ký thành công!"
                subtitle="Tài khoản của bạn đã được tạo. Kiểm tra email để xác minh tài khoản."
                panelContent={panelContent}
            >
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <path d="m9 11 3 3L22 4" />
                        </svg>
                    </div>
                    <p className="text-text-muted text-sm leading-relaxed mb-8">
                        Chúng tôi đã gửi email xác minh đến <strong className="text-text-main">{form.email}</strong>. Vui lòng kiểm tra hộp thư và xác minh tài khoản trước khi đăng nhập.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full px-6 py-3.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-hover transition-all"
                    >
                        Đến trang đăng nhập
                    </button>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Tạo tài khoản"
            subtitle="Dành cho giáo viên và trợ giảng. Học sinh được tạo tài khoản bởi giáo viên."
            panelContent={panelContent}
        >
            <form onSubmit={handleSubmit} noValidate>
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

                {/* Role selector */}
                <div className="mb-5">
                    <label className="block text-sm font-semibold text-text-main mb-2">Vai trò</label>
                    <div className="grid grid-cols-2 gap-3">
                        {ROLES.map((role) => (
                            <button
                                key={role.id}
                                type="button"
                                onClick={() => setForm((prev) => ({ ...prev, role: role.id }))}
                                className={`relative flex flex-col items-start gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
                                    form.role === role.id
                                        ? 'border-primary bg-primary/5 shadow-sm'
                                        : 'border-border bg-surface hover:border-primary/40'
                                }`}
                            >
                                <div className={`${form.role === role.id ? 'text-primary' : 'text-text-muted'} transition-colors`}>
                                    {role.icon}
                                </div>
                                <p className={`text-sm font-semibold ${form.role === role.id ? 'text-primary' : 'text-text-main'}`}>
                                    {role.label}
                                </p>
                                <p className="text-xs text-text-muted leading-snug">{role.description}</p>
                                {form.role === role.id && (
                                    <div className="absolute top-2.5 right-2.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="m20 6-11 11-5-5" />
                                        </svg>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Name */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-text-main mb-1.5">Họ</label>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="Nguyễn"
                                value={form.firstName}
                                onChange={handleChange}
                                required
                                autoComplete="given-name"
                                className="w-full px-4 py-3 rounded-xl bg-surface border border-border outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all text-text-main placeholder:text-text-muted/50 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-text-main mb-1.5">Tên</label>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Văn A"
                                value={form.lastName}
                                onChange={handleChange}
                                required
                                autoComplete="family-name"
                                className="w-full px-4 py-3 rounded-xl bg-surface border border-border outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all text-text-main placeholder:text-text-muted/50 text-sm"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-text-main mb-1.5">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="teacher@school.edu.vn"
                            value={form.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                            className="w-full px-4 py-3 rounded-xl bg-surface border border-border outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all text-text-main placeholder:text-text-muted/50 text-sm"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-semibold text-text-main mb-1.5">Mật khẩu</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Tối thiểu 8 ký tự"
                                value={form.password}
                                onChange={handleChange}
                                required
                                autoComplete="new-password"
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
                        {form.password && (
                            <div className="mt-2 flex gap-1.5">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className={`h-1 flex-1 rounded-full transition-all ${
                                            form.password.length >= i * 3
                                                ? form.password.length >= 12 ? 'bg-green-500'
                                                    : form.password.length >= 8 ? 'bg-secondary'
                                                    : 'bg-yellow-400'
                                                : 'bg-border'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-semibold text-text-main mb-1.5">Xác nhận mật khẩu</label>
                        <div className="relative">
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                name="confirmPassword"
                                placeholder="Nhập lại mật khẩu"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                                autoComplete="new-password"
                                className={`w-full px-4 py-3 pr-11 rounded-xl bg-surface border outline-none focus:ring-2 transition-all text-text-main placeholder:text-text-muted/50 text-sm ${
                                    form.confirmPassword && form.password !== form.confirmPassword
                                        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                                        : 'border-border focus:border-primary focus:ring-primary/15'
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm((v) => !v)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
                                aria-label={showConfirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                            >
                                <EyeIcon open={showConfirm} />
                            </button>
                        </div>
                        {form.confirmPassword && form.password !== form.confirmPassword && (
                            <p className="mt-1.5 text-xs text-red-500">Mật khẩu không khớp</p>
                        )}
                    </div>
                </div>

                {/* Terms */}
                <p className="mt-4 text-xs text-text-muted leading-relaxed">
                    Bằng việc đăng ký, bạn đồng ý với{' '}
                    <a href="#" className="text-primary hover:underline">Điều khoản dịch vụ</a>
                    {' '}và{' '}
                    <a href="#" className="text-primary hover:underline">Chính sách bảo mật</a>.
                </p>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-5 px-6 py-3.5 bg-primary text-white text-sm font-semibold rounded-xl shadow-md hover:bg-primary-hover active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Đang tạo tài khoản...
                        </>
                    ) : (
                        `Tạo tài khoản ${form.role === 'teacher' ? 'Giáo viên' : 'Trợ giảng'}`
                    )}
                </button>

                {/* Login link */}
                <p className="mt-5 text-center text-sm text-text-muted">
                    Đã có tài khoản?{' '}
                    <Link to="/login" className="text-primary font-semibold hover:underline">
                        Đăng nhập ngay
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default RegisterPage;
