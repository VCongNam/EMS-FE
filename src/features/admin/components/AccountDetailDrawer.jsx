import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import { adminService } from '../api/adminService';
import { toast } from 'react-toastify';
import { extractErrorMessage } from '../../../utils/errorHandler';

const AccountDetailDrawer = ({ accountId, isOpen, onClose, onUpdateSuccess }) => {
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);
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
        } catch (error) {
            toast.error(extractErrorMessage(error, 'Lỗi khi tải thông tin tài khoản'));
            onClose();
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] overflow-hidden">
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
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
                                <span className="!px-3 !py-1.5 rounded-xl text-xs font-black uppercase tracking-wider !bg-emerald-100 text-emerald-700">
                                    Giáo viên
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
                                
                            </div>

                            {/* Teacher Specific Details */}
                            <div className="!space-y-6 animate-slide-up">
                                <h3 className="text-sm font-black text-text-primary uppercase tracking-widest flex items-center gap-2">
                                    <Icon icon="solar:book-bookmark-bold-duotone" className="text-primary" /> Thông tin Chuyên môn
                                </h3>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-text-secondary tracking-widest !mb-1">Chuyên môn</p>
                                    <p className="text-sm font-bold text-text-main leading-relaxed italic text-text-secondary">
                                        {account.specialization || "Chưa cập nhật chuyên môn."}
                                    </p>
                                </div>
                                
                                <h3 className="text-sm font-black text-text-primary uppercase tracking-widest flex items-center gap-2 !mt-8">
                                    <Icon icon="solar:users-group-rounded-bold-duotone" className="text-primary" /> Danh sách Lớp học ({account.currentClasses?.length || 0})
                                </h3>
                                {account.currentClasses && account.currentClasses.length > 0 ? (
                                    <div className="!space-y-3">
                                        {account.currentClasses.map(cls => (
                                            <div key={cls.classId} className="!bg-slate-50 !p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                                                <div>
                                                    <p className="font-bold text-sm text-text-main">{cls.className}</p>
                                                    <p className="text-xs text-text-secondary !mt-1 flex items-center gap-2">
                                                        <span><Icon icon="solar:calendar-bold-duotone" className="inline text-primary mr-1" />{new Date(cls.createdAt).toLocaleDateString('vi-VN')}</span>
                                                    </p>
                                                </div>
                                                <div className="!bg-blue-50 text-blue-600 px-3 py-1 rounded-xl flex items-center gap-1.5 focus:outline-none">
                                                    <Icon icon="solar:users-group-two-rounded-bold-duotone" />
                                                    <span className="text-xs font-black">{cls.studentCount} HS</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm font-medium text-text-secondary flex items-center gap-2 bg-slate-50 px-4 py-3 rounded-xl">
                                        <Icon icon="solar:info-circle-bold-duotone" /> Giáo viên này hiện chưa được phân công lớp nào.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default AccountDetailDrawer;
