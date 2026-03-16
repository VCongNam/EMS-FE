import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Button from '../../../components/ui/Button'; // Ensure this path aligns with your structure

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Call API to send reset link
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-surface p-8 rounded-[2rem] border border-border shadow-xl">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-inner">
                        <Icon icon="material-symbols:lock-reset-rounded" className="text-4xl text-primary" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-text-main font-['Outfit'] tracking-tight">Quên Mật Khẩu</h1>
                    <p className="text-text-muted mt-2 font-medium">Nhập email của bạn để nhận liên kết khôi phục</p>
                </div>

                {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-text-main ml-1 uppercase tracking-widest text-xs">Email đăng ký</label>
                            <div className="relative">
                                <Icon icon="material-symbols:mail-rounded" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-xl" />
                                <input 
                                    type="email" 
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email" 
                                    className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-semibold"
                                />
                            </div>
                        </div>

                        <Button 
                            type="submit"
                            className="w-full py-4 text-lg font-bold shadow-lg shadow-primary/20 rounded-2xl"
                        >
                            Gửi liên kết khôi phục
                        </Button>
                        
                        <div className="text-center">
                            <Link to="/login" className="text-sm font-bold text-text-muted hover:text-primary transition-colors flex items-center justify-center gap-1">
                                <Icon icon="material-symbols:arrow-back-rounded" />
                                Quay lại Đăng nhập
                            </Link>
                        </div>
                    </form>
                ) : (
                    <div className="text-center space-y-6 animate-fade-in">
                        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl">
                            <p className="font-semibold text-sm">Chúng tôi đã gửi một liên kết khôi phục mật khẩu tới địa chỉ email <strong>{email}</strong>. Vui lòng kiểm tra hộp thư đến.</p>
                        </div>
                        <Button 
                            variant="outline"
                            onClick={() => window.location.href='/login'}
                            className="w-full py-4 font-bold rounded-2xl"
                        >
                            Trở về trang Đăng nhập
                        </Button>
                    </div>
                )}
            </div>
            {/* Background Decorations */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
