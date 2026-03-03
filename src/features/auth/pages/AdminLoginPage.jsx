import React from 'react';
import Button from '../../../components/ui/Button';
import AuthLayout from '../components/AuthLayout';

const AdminLoginPage = () => {
    return (
        <AuthLayout
            title="Hệ thống Quản trị 🔑"
            subtitle="Cổng đăng nhập dành riêng cho Quản trị viên hệ thống EMS."
        >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 mb-6">
                    <p className="text-sm text-primary flex items-center gap-2">
                        <span>🛡️</span>
                        Đây là khu vực hạn chế. Vui lòng xác thực quyền quản trị.
                    </p>
                </div>

                <div>
                    <label className="block mb-2 text-sm font-semibold text-text-main">Tên đăng nhập Admin</label>
                    <input
                        type="text"
                        placeholder="admin_id"
                        className="w-full px-5 py-4 rounded-xl bg-background border border-border outline-none focus:border-primary transition-all shadow-inner"
                    />
                </div>

                <div>
                    <label className="block mb-2 text-sm font-semibold text-text-main">Mật khẩu cấp cao</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-5 py-4 rounded-xl bg-background border border-border outline-none focus:border-primary transition-all shadow-inner"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-text-muted">
                        <input type="checkbox" className="w-4 h-4 rounded border-border text-primary" />
                        Giữ phiên đăng nhập
                    </label>
                </div>

                <Button variant="primary" size="lg" className="w-full shadow-lg shadow-primary/20">
                    Xác thực Quản trị
                </Button>

                <div className="mt-8 pt-6 border-t border-border/50 text-center">
                    <a href="/" className="text-sm text-text-muted hover:text-primary transition-all">
                        ← Quay lại trang chủ
                    </a>
                </div>
            </form>
        </AuthLayout>
    );
};

export default AdminLoginPage;
