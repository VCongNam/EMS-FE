import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Button from '../../../../components/ui/Button';
import { profileService } from '../../api/profileService';
import { toast } from 'react-toastify';

const ChangePasswordModal = ({ isOpen, onClose, token }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmNewPassword) {
            setError('Mật khẩu xác nhận không khớp!');
            return;
        }

        if (newPassword.length < 6) {
            setError('Mật khẩu mới phải có ít nhất 6 ký tự!');
            return;
        }

        setLoading(true);
        try {
            const response = await profileService.changePassword({ oldPassword, newPassword }, token);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ!");
            }

            toast.success("Đổi mật khẩu thành công!");
            setOldPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            ></div>
            
            <div className="relative w-full max-w-md bg-surface rounded-[2.5rem] border border-border shadow-2xl overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="!p-8 !pb-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                            <Icon icon="solar:lock-password-bold-duotone" className="text-2xl" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-text-main tracking-tight">Đổi mật khẩu</h3>
                            <p className="text-xs font-bold text-text-muted">Cập nhật mật khẩu bảo mật của bạn</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="!p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                        <Icon icon="solar:close-circle-bold-duotone" className="text-2xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="!p-8 space-y-5">
                    {error && (
                        <div className="!p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-shake">
                            <Icon icon="solar:danger-bold-duotone" className="text-xl shrink-0" />
                            <p className="text-xs font-bold">{error}</p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Mật khẩu cũ</label>
                        <div className="relative group">
                            <Icon icon="solar:key-bold-duotone" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors text-xl" />
                            <input
                                type="password"
                                required
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full !pl-12 !pr-5 !py-4 rounded-2xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-text-main font-mono"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Mật khẩu mới</label>
                        <div className="relative group">
                            <Icon icon="solar:lock-keyhole-bold-duotone" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors text-xl" />
                            <input
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full !pl-12 !pr-5 !py-4 rounded-2xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-text-main font-mono"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest px-2">Xác nhận mật khẩu mới</label>
                        <div className="relative group">
                            <Icon icon="solar:shield-check-bold-duotone" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors text-xl" />
                            <input
                                type="password"
                                required
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full !pl-12 !pr-5 !py-4 rounded-2xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-text-main font-mono"
                            />
                        </div>
                    </div>

                    <div className="!pt-6 flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 !py-4 !rounded-2xl !font-bold"
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] !py-4 !rounded-2xl !font-black !shadow-lg !shadow-primary/20"
                        >
                            {loading ? (
                                <Icon icon="svg-spinners:180-ring-with-bg" className="text-xl" />
                            ) : 'Xác nhận đổi'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
