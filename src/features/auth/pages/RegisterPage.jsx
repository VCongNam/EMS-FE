import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import AuthLayout from '../components/AuthLayout';

const RegisterPage = () => {
    // State cho việc chọn Role MOCKUP: 'teacher' | 'ta'
    const [role, setRole] = useState('teacher');
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = (e) => {
        e.preventDefault();
        console.log("Mockup Register Submit with role:", role);
    };

    return (
        <AuthLayout
            title="Khởi tạo tài khoản"
            subtitle="Bắt đầu hành trình giảng dạy hiện đại cùng EMS. Chỉ mất 2 phút."
        >
            <div className="!mb-8 w-full">
                {/* Role Tabs Segmented Control */}
                <div className="bg-background/80 !p-1.5 rounded-2xl flex border border-border/50 shadow-sm relative z-0">
                    {/* Animated background cho tab */}
                    <div
                        className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm border border-border/30 transition-transform duration-300 ease-out z-[-1]"
                        style={{ transform: role === 'teacher' ? 'translateX(0)' : 'translateX(100%)' }}
                    />

                    <button
                        type="button"
                        onClick={() => setRole('teacher')}
                        className={`flex-1 !py-3 text-sm font-bold rounded-xl flex items-center justify-center transition-colors duration-300 ${role === 'teacher' ? 'text-primary' : 'text-text-muted hover:text-text-main'
                            }`}
                    >
                        Giáo viên
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole('ta')}
                        className={`flex-1 !py-3 text-sm font-bold rounded-xl flex items-center justify-center transition-colors duration-300 ${role === 'ta' ? 'text-primary' : 'text-text-muted hover:text-text-main'
                            }`}
                    >
                        Trợ giảng
                    </button>
                </div>
            </div>

            <form className="animate-fade-in-up !space-y-5" onSubmit={handleRegister}>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-text-main !mb-2">Họ</label>
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Nguyễn"
                                className="w-full !px-4 !py-3.5 rounded-xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-text-main font-medium placeholder:text-text-muted/50"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-text-main !mb-2">Tên</label>
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Văn A"
                                className="w-full !px-4 !py-3.5 rounded-xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-text-main font-medium placeholder:text-text-muted/50"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-text-main !mb-2">Email công việc</label>
                    <div className="relative group">
                        <input
                            type="email"
                            placeholder="teacher@school.edu.vn"
                            className="w-full !px-4 !py-3.5 rounded-xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-text-main font-medium placeholder:text-text-muted/50"
                        />
                    </div>
                </div>

                {role === 'teacher' && (
                    <div className="animate-fade-in">
                        <label className="block text-sm font-semibold text-text-main !mb-2">Trường / Tổ chức</label>
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="VD: THPT Chuyên Hà Nội"
                                className="w-full !px-4 !py-3.5 rounded-xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-text-main font-medium placeholder:text-text-muted/50"
                            />
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-semibold text-text-main !mb-2">Mật khẩu</label>
                    <div className="relative group">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Tối thiểu 8 ký tự"
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

                <div className="!pt-2">
                    <p className="text-xs text-text-muted !mb-5 leading-relaxed">
                        Bằng việc đăng ký, bạn đồng ý với <a href="#" className="text-primary font-medium hover:underline">Điều khoản dịch vụ</a> và <a href="#" className="text-primary font-medium hover:underline">Chính sách bảo mật</a> của chứng tôi.
                    </p>
                    <Button
                        variant="primary"
                        size="lg"
                        type="submit"
                        className="w-full !py-4 text-[15px] !text-primary rounded-xl font-bold shadow-premium-primary hover:shadow-premium-primary-hover hover:-translate-y-0.5 transition-all duration-300 bg-primary text-white flex items-center justify-center gap-2"
                    >
                        Tạo tài khoản {role === 'teacher' ? 'Giáo viên' : 'Trợ giảng'}
                    </Button>
                </div>

                <div className="text-center !mt-6">
                    <p className="text-text-muted font-medium">
                        Đã có tài khoản?{' '}
                        <Link to="/login" className="text-primary font-bold hover:underline transition-all">
                            Đăng nhập
                        </Link>
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
};

export default RegisterPage;
