import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import AuthLayout from '../components/AuthLayout';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Call API to send reset link
        setSubmitted(true);
    };

    return (
        <AuthLayout
            title="Quên Mật Khẩu"
            subtitle="Nhập email của bạn để nhận liên kết khôi phục."
        >
            {!submitted ? (
                <form onSubmit={handleSubmit} className="animate-fade-in-up !space-y-6">
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
                            className="w-full !py-4 text-[15px] !text-primary rounded-xl font-bold shadow-premium-primary hover:shadow-premium-primary-hover hover:-translate-y-0.5 transition-all duration-300 bg-primary text-white flex items-center justify-center gap-2"
                        >
                            Gửi liên kết khôi phục
                        </Button>
                    </div>

                    <div className="text-center !mt-6">
                        <Link to="/login" className="text-sm font-bold text-text-muted hover:text-primary transition-colors flex items-center justify-center gap-2">
                            <span>←</span> Quay lại Đăng nhập
                        </Link>
                    </div>
                </form>
            ) : (
                <div className="text-center animate-fade-in !py-8">
                    <div className="bg-green-50 border border-green-200 text-green-700 !p-5 rounded-2xl !mb-6">
                        <p className="font-semibold text-sm leading-relaxed">
                            Chúng tôi đã gửi một liên kết khôi phục mật khẩu tới địa chỉ email <br />
                            <strong className="text-green-800 text-base">{email}</strong><br />
                            Vui lòng kiểm tra hộp thư đến.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => window.location.href = '/login'}
                        className="w-full !py-4 font-bold rounded-2xl border-2 hover:bg-background transition-colors text-text-main"
                    >
                        Trở về trang Đăng nhập
                    </Button>
                </div>
            )}
        </AuthLayout>
    );
};

export default ForgotPasswordPage;
