import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import AuthLayout from '../components/AuthLayout';
import RoleSelector from '../components/RoleSelector';

const LoginPage = () => {
    const [role, setRole] = useState('student');
    const [focusedField, setFocusedField] = useState(null);

    return (
        <AuthLayout
            title="Đăng nhập 👋"
            subtitle="Chào mừng bạn quay lại! Vui lòng chọn vai trò và nhập thông tin để truy cập."
        >
            <RoleSelector activeRole={role} onRoleChange={setRole} />

            <div className="p-6 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-lg shadow-primary/10 mb-6">
                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-text-main">
                            {role === 'student' ? 'Mã học sinh / Email' : 'Email công việc'}
                        </label>
                        <input
                            type="email"
                            placeholder="example@ems.com"
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            className={`w-full px-5 py-4 rounded-xl bg-white/60 border transition-all duration-300 outline-none ${focusedField === 'email'
                                ? 'border-primary shadow-lg shadow-primary/20 bg-white/80 scale-105'
                                : 'border-white/40 hover:border-white/60 hover:bg-white/70'
                                }`}
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-semibold text-text-main">Mật khẩu</label>
                            <a href="#" className="text-sm font-medium text-primary hover:text-primary-hover transition-colors">Quên mật khẩu?</a>
                        </div>
                        <input
                            type="password"
                            placeholder="••••••••"
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            className={`w-full px-5 py-4 rounded-xl bg-white/60 border transition-all duration-300 outline-none ${focusedField === 'password'
                                ? 'border-primary shadow-lg shadow-primary/20 bg-white/80 scale-105'
                                : 'border-white/40 hover:border-white/60 hover:bg-white/70'
                                }`}
                        />
                    </div>

                    <div className="flex items-center gap-2 mb-6">
                        <input
                            type="checkbox"
                            id="remember"
                            className="w-4 h-4 rounded border-white/60 text-primary accent-primary cursor-pointer transition-all hover:border-primary"
                        />
                        <label htmlFor="remember" className="text-sm text-text-muted cursor-pointer hover:text-primary transition-colors">Ghi nhớ đăng nhập</label>
                    </div>

                    <Button variant="primary" size="lg" className="w-full">
                        Đăng nhập ngay
                    </Button>

                    <div className="mt-8 pt-6 border-t border-white/40 text-center text-text-muted">
                        {role === 'teacher' ? (
                            <p>Bạn chưa có tài khoản? <Link to="/register" className="text-primary font-bold hover:text-primary-hover transition-colors">Đăng ký ngay</Link></p>
                        ) : (
                            <p>Học sinh được cấp tài khoản bởi Nhà trường/Giáo viên.</p>
                        )}
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;
