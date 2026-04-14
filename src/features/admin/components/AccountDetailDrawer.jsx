import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { adminService } from '../api/adminService';
import { toast } from 'react-toastify';

const AccountDetailDrawer = ({ accountId, isOpen, onClose, onUpdateSuccess }) => {
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (isOpen && accountId) {
            fetchAccountDetails();
        }
    }, [isOpen, accountId]);

    const fetchAccountDetails = async () => {
        setLoading(true);
        try {
            const data = await adminService.getAccountById(accountId);
            setAccount(data);
            setNewStatus(data.status);
            setReason('');
        } catch (error) {
            toast.error(error.message);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        if (newStatus === account.status) {
            toast.info('Trạng thái không thay đổi');
            return;
        }
        if (!reason.trim()) {
            toast.warning('Vui lòng nhập lý do thay đổi trạng thái');
            return;
        }

        setUpdating(true);
        try {
            await adminService.updateAccountStatus(accountId, newStatus, reason);
            toast.success('Cập nhật trạng thái thành công');
            onUpdateSuccess();
            onClose();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setUpdating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            ></div>

            {/* Sidebar */}
            <div className={`absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm font-bold text-primary">Đang tải hồ sơ...</p>
                    </div>
                ) : (
                    <div className="flex flex-col h-full overflow-hidden">
                        {/* Header */}
                        <div className="!px-6 !py-5 border-b border-border flex items-center justify-between !bg-background/20">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl !bg-primary/10 text-primary flex items-center justify-center font-black text-xl border-2 border-white shadow-sm shrink-0">
                                    {account.fullName.charAt(0)}
                                </div>
                                <div className="overflow-hidden">
                                    <h2 className="text-lg font-black text-text-main font-['Outfit'] truncate">{account.fullName}</h2>
                                    <p className="text-xs text-text-secondary truncate">{account.email}</p>
                                </div>
                            </div>
                            <button 
                                onClick={onClose}
                                className="w-9 h-9 flex items-center justify-center rounded-xl hover:!bg-red-50 hover:text-red-500 text-text-secondary transition-all"
                            >
                                <Icon icon="material-symbols:close-rounded" className="text-2xl" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto !p-6 !space-y-8 custom-scrollbar">
                            {/* Role & Status Badges */}
                            <div className="flex items-center gap-3">
                                <span className={`!px-3 !py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${
                                    account.roleName === 'Admin' ? '!bg-purple-100 text-purple-700' :
                                    account.roleName === 'Teacher' ? '!bg-emerald-100 text-emerald-700' :
                                    account.roleName === 'TA' ? '!bg-amber-100 text-amber-700' :
                                    '!bg-blue-100 text-blue-700'
                                }`}>
                                    {account.roleName}
                                </span>
                                <span className={`!px-3 !py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 ${
                                    account.status === 'Active' ? '!bg-green-100 text-green-700' :
                                    account.status === 'Banned' ? '!bg-red-100 text-red-700' :
                                    '!bg-slate-100 text-slate-700'
                                }`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${
                                        account.status === 'Active' ? '!bg-green-500' :
                                        account.status === 'Banned' ? '!bg-red-500' :
                                        '!bg-slate-500'
                                    }`}></div>
                                    {account.status}
                                </span>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-6 pb-6 border-b border-border">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-text-secondary tracking-widest !mb-1">Số điện thoại</p>
                                    <p className="text-sm font-bold text-text-main">{account.phoneNumber || 'Chưa cập nhật'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-text-secondary tracking-widest !mb-1">Ngày tạo</p>
                                    <p className="text-sm font-bold text-text-main">{new Date(account.createdAt).toLocaleDateString('vi-VN')}</p>
                                </div>
                            </div>

                            {/* Role-Specific Details */}
                            {account.roleName === 'Student' ? (
                                <div className="!space-y-6 animate-slide-up">
                                    <h3 className="text-sm font-black text-text-primary uppercase tracking-widest flex items-center gap-2">
                                        <Icon icon="solar:user-speak-bold-duotone" className="text-primary" /> Thông tin phụ huynh
                                    </h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-text-secondary tracking-widest !mb-1">Tên phụ huynh</p>
                                            <p className="text-sm font-bold text-text-main">Chưa cập nhật</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-text-secondary tracking-widest !mb-1">SĐT phụ huynh</p>
                                            <p className="text-sm font-bold text-text-main">Chưa cập nhật</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-text-secondary tracking-widest !mb-1">Địa chỉ</p>
                                        <p className="text-sm font-bold text-text-main truncate" title="Dữ liệu mẫu">Quận Cam, TP. Hồ Chí Minh</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="!space-y-6 animate-slide-up">
                                    <h3 className="text-sm font-black text-text-primary uppercase tracking-widest flex items-center gap-2">
                                        <Icon icon="solar:bank-bold-duotone" className="text-primary" /> Thông tin Công việc & Tài chính
                                    </h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-text-secondary tracking-widest !mb-1">Tài khoản Ngân hàng</p>
                                            <p className="text-sm font-bold text-text-main tracking-widest">MB BANK - 0123456789</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-text-secondary tracking-widest !mb-1">Số lớp phụ trách</p>
                                            <p className="text-sm font-bold text-text-main">3 lớp</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-text-secondary tracking-widest !mb-1">Giới thiệu ngắn</p>
                                        <p className="text-sm font-bold text-text-main leading-relaxed italic text-text-secondary">
                                            "Chuyên gia với hơn 5 năm kinh nghiệm trong lĩnh vực giảng dạy tiếng Anh IELTS."
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Status Update Form */}
                            <div className="!mt-10 !pt-8 border-t border-border !space-y-6 bg-background/30 rounded-3xl !p-6 border-dashed">
                                <h3 className="text-sm font-black text-text-primary uppercase tracking-widest">Quản lý trạng thái</h3>
                                
                                <div className="!space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-text-secondary tracking-widest !mb-2 block">Cập nhật trạng thái mới</label>
                                        <select 
                                            value={newStatus}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                            className="w-full !px-4 !py-3 rounded-2xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold text-sm bg-white"
                                        >
                                            <option value="Active">🟢 Đang hoạt động (Active)</option>
                                            <option value="Banned">🔴 Khóa tài khoản (Banned)</option>
                                            <option value="Unverified">⚪ Chưa xác minh (Unverified)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase text-text-secondary tracking-widest !mb-2 block">Lý do thay đổi <span className="text-red-500">*</span></label>
                                        <textarea 
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            placeholder="Ghi rõ lý do thay đổi để gửi thông báo cho người dùng..."
                                            rows="4"
                                            className="w-full !px-4 !py-3 rounded-2xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white resize-none font-medium"
                                        ></textarea>
                                        <p className="text-[10px] text-text-muted italic !mt-2 flex items-center gap-1">
                                            <Icon icon="material-symbols:info-outline-rounded" /> Người dùng sẽ nhận được thông báo qua Email về thay đổi này.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="!p-6 border-t border-border !bg-white">
                            <button 
                                onClick={handleUpdateStatus}
                                disabled={updating || newStatus === account.status}
                                className={`w-full !py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 ${
                                    updating || newStatus === account.status
                                    ? '!bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                    : '!bg-primary text-white hover:shadow-primary/30 transform hover:-translate-y-1'
                                }`}
                            >
                                {updating ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <Icon icon="solar:diskette-bold-duotone" className="text-xl" />
                                )}
                                {updating ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountDetailDrawer;
