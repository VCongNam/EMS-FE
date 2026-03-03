import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import AuthLayout from '../components/AuthLayout';
import RoleSelector from '../components/RoleSelector';

const LoginPage = () => {
    const [role, setRole] = useState('student');

    return (
        <AuthLayout
            title="Đăng nhập 👋"
            subtitle="Chào mừng bạn quay lại! Vui lòng chọn vai trò và nhập thông tin để truy cập."
        >
            <RoleSelector activeRole={role} onRoleChange={setRole} />

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label className="block mb-2 text-sm font-semibold text-text-main">
                        {role === 'student' ? 'Mã học sinh / Email' : 'Email công việc'}
                    </label>
                    <input
                        type="email"
                        placeholder="example@ems.com"
                        className="w-full px-5 py-4 rounded-xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-semibold text-text-main">Mật khẩu</label>
                        <a href="#" className="text-sm font-medium text-primary hover:underline">Quên mật khẩu?</a>
                    </div>
                    <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-5 py-4 rounded-xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    />
                </div>

                <div className="flex items-center gap-2 mb-6">
                    <input type="checkbox" id="remember" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                    <label htmlFor="remember" className="text-sm text-text-muted">Ghi nhớ đăng nhập</label>
                </div>

                <Button variant="primary" size="lg" className="w-full">
                    Đăng nhập ngay
                </Button>

                <div className="mt-8 text-center text-text-muted">
                    {role === 'teacher' ? (
                        <p>Bạn chưa có tài khoản? <Link to="/register" className="text-primary font-bold hover:underline">Đăng ký ngay</Link></p>
                    ) : (
                        <p>Học sinh được cấp tài khoản bởi Nhà trường/Giáo viên.</p>
                    )}
                </div>
            </form>
        </AuthLayout>
    );
};

export default LoginPage;
