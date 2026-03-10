import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import AuthLayout from '../components/AuthLayout';

const AdminLoginPage = () => {
    const [focusedField, setFocusedField] = useState(null);

    return (
        <AuthLayout
            title="Hệ thống Quản trị 🔑"
            subtitle="Cổng đăng nhập dành riêng cho Quản trị viên hệ thống EMS."
        >
            <div className="p-6 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-lg shadow-primary/10">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="p-4 rounded-xl bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 backdrop-blur-sm mb-6 hover:from-primary/25 hover:to-primary/15 transition-all duration-300">
                        <p className="text-sm text-primary flex items-center gap-2 font-medium">
                            <span>🛡️</span>
                            Đây là khu vực hạn chế. Vui lòng xác thực quyền quản trị.
                        </p>
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-semibold text-text-main">Tên đăng nhập Admin</label>
                        <input
                            type="text"
                            placeholder="admin_id"
                            onFocus={() => setFocusedField('username')}
                            onBlur={() => setFocusedField(null)}
                            className={`w-full px-5 py-4 rounded-xl bg-white/60 border transition-all duration-300 outline-none ${focusedField === 'username'
                                ? 'border-primary shadow-lg shadow-primary/20 bg-white/80 scale-105'
                                : 'border-white/40 hover:border-white/60 hover:bg-white/70'
                                }`}
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-semibold text-text-main">Mật khẩu cấp cao</label>
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

                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer hover:text-primary transition-colors">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-white/60 text-primary accent-primary transition-all hover:border-primary"
                            />
                            Giữ phiên đăng nhập
                        </label>
                    </div>

                    <Button variant="primary" size="lg" className="w-full shadow-lg shadow-primary/20">
                        Xác thực Quản trị
                    </Button>

                    <div className="mt-8 pt-6 border-t border-white/40 text-center">
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
