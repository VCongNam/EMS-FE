import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import Button from '../../../components/ui/Button'; // Ensure this path aligns

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }
        // Call API to reset password
        setSubmitted(true);
        setTimeout(() => {
            navigate('/login');
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-surface p-8 rounded-[2rem] border border-border shadow-xl">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-inner">
                        <Icon icon="material-symbols:vpn-key-rounded" className="text-4xl text-primary" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-text-main font-['Outfit'] tracking-tight">Đặt Mật Khẩu Mới</h1>
                    <p className="text-text-muted mt-2 font-medium">Bảo vệ tài khoản của bạn với một mật khẩu an toàn</p>
                </div>

                {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-text-main ml-1 uppercase tracking-widest text-xs">Mật khẩu mới</label>
                            <div className="relative">
                                <Icon icon="material-symbols:lock-rounded" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-xl" />
                                <input 
                                    type="password" 
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    placeholder="Enter new password" 
                                    className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-semibold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-text-main ml-1 uppercase tracking-widest text-xs">Xác nhận mật khẩu</label>
                            <div className="relative">
                                <Icon icon="material-symbols:lock-reset-rounded" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-xl" />
                                <input 
                                    type="password" 
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                    placeholder="Confirm new password" 
                                    className="w-full pl-12 pr-4 py-4 bg-background border border-border rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-semibold"
                                />
                            </div>
                        </div>

                        <Button 
                            type="submit"
                            className="w-full py-4 text-lg font-bold shadow-lg shadow-primary/20 rounded-2xl"
                        >
                            Lưu mật khẩu & Đăng nhập
                        </Button>
                    </form>
                ) : (
                    <div className="text-center space-y-4 animate-fade-in py-4">
                        <Icon icon="material-symbols:check-circle-rounded" className="text-6xl text-green-500 mx-auto" />
                        <h3 className="text-xl font-bold text-text-main">Thành công!</h3>
                        <p className="text-text-muted">Mật khẩu của bạn đã được thay đổi. Hệ thống sẽ tự động chuyển hướng...</p>
                    </div>
                )}
            </div>
            
            {/* Background Decorations */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-green-500/5 rounded-full blur-3xl"></div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
