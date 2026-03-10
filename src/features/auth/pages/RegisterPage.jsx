import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import AuthLayout from '../components/AuthLayout';

const RegisterPage = () => {
    const [focusedField, setFocusedField] = useState(null);

    const handleInputFocus = (fieldName) => setFocusedField(fieldName);
    const handleInputBlur = () => setFocusedField(null);

    const getInputClassName = (fieldName) => `w-full px-4 py-3 text-sm rounded-xl bg-white/60 border transition-all duration-300 outline-none ${focusedField === fieldName
        ? 'border-primary shadow-lg shadow-primary/20 bg-white/80 scale-105'
        : 'border-white/40 hover:border-white/60 hover:bg-white/70'
        }`;

    return (
        <AuthLayout
            title="Đăng ký Giáo viên 📝"
            subtitle="Bắt đầu hành trình giảng dạy hiện đại cùng EMS. Chỉ mất 2 phút để khởi tạo."
        >
            <div className="p-6 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-lg shadow-primary/10">
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1.5 text-sm font-semibold text-text-main">Họ</label>
                            <input
                                type="text"
                                placeholder="Nguyễn"
                                onFocus={() => handleInputFocus('lastName')}
                                onBlur={handleInputBlur}
                                className={getInputClassName('lastName')}
                            />
                        </div>
                        <div>
                            <label className="block mb-1.5 text-sm font-semibold text-text-main">Tên</label>
                            <input
                                type="text"
                                placeholder="Văn A"
                                onFocus={() => handleInputFocus('firstName')}
                                onBlur={handleInputBlur}
                                className={getInputClassName('firstName')}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1.5 text-sm font-semibold text-text-main">Email công việc</label>
                        <input
                            type="email"
                            placeholder="teacher@school.edu.vn"
                            onFocus={() => handleInputFocus('email')}
                            onBlur={handleInputBlur}
                            className={getInputClassName('email')}
                        />
                    </div>

                    <div>
                        <label className="block mb-1.5 text-sm font-semibold text-text-main">Trường / Tổ chức</label>
                        <input
                            type="text"
                            placeholder="Ví dụ: THPT Chuyên Hà Nội"
                            onFocus={() => handleInputFocus('organization')}
                            onBlur={handleInputBlur}
                            className={getInputClassName('organization')}
                        />
                    </div>

                    <div>
                        <label className="block mb-1.5 text-sm font-semibold text-text-main">Mật khẩu</label>
                        <input
                            type="password"
                            placeholder="Tối thiểu 8 ký tự"
                            onFocus={() => handleInputFocus('password')}
                            onBlur={handleInputBlur}
                            className={getInputClassName('password')}
                        />
                    </div>

                    <div className="pt-2">
                        <p className="text-xs text-text-muted mb-4">
                            Bằng việc đăng ký, bạn đồng ý với <a href="#" className="text-primary hover:text-primary-hover transition-colors">Điều khoản dịch vụ</a> và <a href="#" className="text-primary hover:text-primary-hover transition-colors">Chính sách bảo mật</a> của chúng tôi.
                        </p>
                        <Button variant="primary" size="lg" className="w-full">
                            Tạo tài khoản Giáo viên
                        </Button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/40 text-center text-text-muted">
                        <p>Bạn đã có tài khoản? <Link to="/login" className="text-primary font-bold hover:text-primary-hover transition-colors">Đăng nhập</Link></p>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
};

export default RegisterPage;
