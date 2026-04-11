import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../../../components/ui/Button';
import AuthLayout from '../components/AuthLayout';
import useAuthStore from '../../../store/authStore';
import { authService } from '../api/authService';

const AdminLoginPage = () => {
    const [focusedField, setFocusedField] = useState(null);
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const { login } = useAuthStore();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!identifier || !password) {
            toast.warning('Vui lòng nhập đầy đủ tài khoản và mật khẩu quản trị.');
            return;
        }

        setLoading(true);
        try {
            const response = await authService.login({
                identifier,
                password,
                selectedRole: 'Admin'
            });

            if (response.ok) {
                const data = await response.json();
                login(data);
                toast.success('Xác thực quản trị viên thành công!');
                navigate('/admin/dashboard');
            } else {
                const errorData = await response.json().catch(() => ({}));
                toast.error(errorData.message || 'Tài khoản hoặc mật khẩu Admin không chính xác.');
            }
        } catch (error) {
            toast.error('Lỗi kết nối máy chủ. Vui lòng thử lại sau.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Hệ thống Quản trị 🔑"
            subtitle="Cổng đăng nhập dành riêng cho Quản trị viên hệ thống EMS."
        >
            <div className="!p-6 !rounded-2xl !bg-white/40 !backdrop-blur-md !border !border-white/60 !shadow-lg !shadow-primary/10">
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div className="!p-4 !rounded-xl !bg-gradient-to-r !from-primary/20 !to-primary/10 !border !border-primary/30 !backdrop-blur-sm !mb-6 !hover:from-primary/25 !hover:to-primary/15 !transition-all !duration-300">
                        <p className="text-sm text-primary flex items-center gap-2 font-medium">
                            <span>🛡️</span>
                            Đây là khu vực hạn chế. Vui lòng xác thực quyền quản trị.
                        </p>
                    </div>

                    <div>
                        <label className="block !mb-2 text-sm font-semibold text-text-main">Email Admin</label>
                        <input
                            type="text"
                            placeholder="admin@gmail.com"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            onFocus={() => setFocusedField('username')}
                            onBlur={() => setFocusedField(null)}
                            disabled={loading}
                            className={`w-full !px-5 !py-4 !rounded-xl !bg-white/60 !border !transition-all !duration-300 !outline-none ${focusedField === 'username'
                                ? '!border-primary !shadow-lg !shadow-primary/20 !bg-white/80 !scale-105'
                                : '!border-white/40 !hover:border-white/60 !hover:!bg-white/70'
                                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-semibold text-text-main">Mật khẩu cấp cao</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            disabled={loading}
                            className={`w-full !px-5 !py-4 !rounded-xl !bg-white/60 !border !transition-all !duration-300 !outline-none ${focusedField === 'password'
                                ? '!border-primary !shadow-lg !shadow-primary/20 !bg-white/80 !scale-105'
                                : '!border-white/40 !hover:border-white/60 !hover:!bg-white/70'
                                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                    </div>

                    <Button 
                        type="submit"
                        variant="!primary" 
                        size="lg" 
                        className="!w-full !shadow-lg !shadow-primary/20 !mt-2 !py-4"
                        disabled={loading}
                    >
                        {loading ? 'Đang xác thực...' : 'Đăng nhập Quản trị'}
                    </Button>

                    <div className="!mt-2 !pt-6 !border-t !border-white/40 !text-center">
                        <a href="/" className="text-sm text-text-muted hover:text-primary transition-colors">
                            ← Quay lại trang chủ
                        </a>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
};

export default AdminLoginPage;
