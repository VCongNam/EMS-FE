import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import AuthLayout from '../components/AuthLayout';

const RegisterPage = () => {
    return (
        <AuthLayout
            title="Đăng ký Giáo viên 📝"
            subtitle="Bắt đầu hành trình giảng dạy hiện đại cùng EMS. Chỉ mất 2 phút để khởi tạo."
        >
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1.5 text-sm font-semibold text-text-main">Họ</label>
                        <input
                            type="text"
                            placeholder="Nguyễn"
                            className="w-full px-4 py-3 text-sm rounded-xl bg-background border border-border outline-none focus:border-primary transition-all"
                        />
                    </div>
                    <div>
                        <label className="block mb-1.5 text-sm font-semibold text-text-main">Tên</label>
                        <input
                            type="text"
                            placeholder="Văn A"
                            className="w-full px-4 py-3 text-sm rounded-xl bg-background border border-border outline-none focus:border-primary transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block mb-1.5 text-sm font-semibold text-text-main">Email công việc</label>
                    <input
                        type="email"
                        placeholder="teacher@school.edu.vn"
                        className="w-full px-4 py-3 text-sm rounded-xl bg-background border border-border outline-none focus:border-primary transition-all"
                    />
                </div>

                <div>
                    <label className="block mb-1.5 text-sm font-semibold text-text-main">Trường / Tổ chức</label>
                    <input
                        type="text"
                        placeholder="Ví dụ: THPT Chuyên Hà Nội"
                        className="w-full px-4 py-3 text-sm rounded-xl bg-background border border-border outline-none focus:border-primary transition-all"
                    />
                </div>

                <div>
                    <label className="block mb-1.5 text-sm font-semibold text-text-main">Mật khẩu</label>
                    <input
                        type="password"
                        placeholder="Tối thiểu 8 ký tự"
                        className="w-full px-4 py-3 text-sm rounded-xl bg-background border border-border outline-none focus:border-primary transition-all"
                    />
                </div>

                <div className="pt-2">
                    <p className="text-xs text-text-muted mb-4">
                        Bằng việc đăng ký, bạn đồng ý với <a href="#" className="text-primary hover:underline">Điều khoản dịch vụ</a> và <a href="#" className="text-primary hover:underline">Chính sách bảo mật</a> của chúng tôi.
                    </p>
                    <Button variant="primary" size="lg" className="w-full">
                        Tạo tài khoản Giáo viên
                    </Button>
                </div>

                <div className="mt-6 text-center text-text-muted">
                    <p>Bạn đã có tài khoản? <Link to="/login" className="text-primary font-bold hover:underline">Đăng nhập</Link></p>
                </div>
            </form>
        </AuthLayout>
    );
};

export default RegisterPage;
