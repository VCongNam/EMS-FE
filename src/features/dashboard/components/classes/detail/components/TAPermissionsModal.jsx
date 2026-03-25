import React from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';

const TAPermissionsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const permissions = [
        { id: '1', name: 'Đăng thông báo trên Bảng tin', granted: true, icon: 'material-symbols:campaign-rounded' },
        { id: '2', name: 'Quản lý tài liệu lớp học', granted: true, icon: 'material-symbols:folder-open-rounded' },
        { id: '3', name: 'Tạo và giao bài tập', granted: true, icon: 'material-symbols:assignment-add-rounded' },
        { id: '4', name: 'Chấm điểm bài tập', granted: true, icon: 'material-symbols:grading-rounded' },
        { id: '5', name: 'Quản lý thành viên (Thêm/Xóa)', granted: false, icon: 'material-symbols:group-remove-rounded' },
        { id: '6', name: 'Cấu hình lịch học định kỳ', granted: false, icon: 'solar:calendar-add-bold-duotone' },
        { id: '7', name: 'Điểm danh học viên', granted: true, icon: 'material-symbols:fact-check-rounded' },
    ];

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center !p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-surface rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                
                {/* Header */}
                <div className="bg-primary !px-6 !py-5 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
                            <Icon icon="solar:shield-check-bold-duotone" className="text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold font-['Outfit']">Quyền hạn Trợ giảng</h2>
                            <p className="text-white/80 text-sm">Vai trò hiện tại của bạn trong lớp</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                        <Icon icon="material-symbols:close-rounded" className="text-xl" />
                    </button>
                </div>

                {/* Body */}
                <div className="!p-6 space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {permissions.map((perm) => (
                        <div 
                            key={perm.id} 
                            className={`flex items-center justify-between !p-4 rounded-2xl border transition-all ${
                                perm.granted 
                                    ? 'bg-green-500/5 border-green-500/20' 
                                    : 'bg-surface border-border opacity-70'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                    perm.granted ? 'text-green-600 bg-green-500/10' : 'text-text-muted bg-background'
                                }`}>
                                    <Icon icon={perm.icon} className="text-lg" />
                                </div>
                                <span className={`font-semibold text-sm ${perm.granted ? 'text-text-main' : 'text-text-muted line-through'}`}>
                                    {perm.name}
                                </span>
                            </div>
                            <div className="shrink-0 flex items-center justify-center">
                                {perm.granted ? (
                                    <Icon icon="material-symbols:check-circle-rounded" className="text-xl text-green-500 drop-shadow-sm" />
                                ) : (
                                    <Icon icon="material-symbols:cancel-rounded" className="text-xl text-text-muted" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="!px-6 !py-4 border-t border-border bg-background/50 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="!px-6 !py-2.5 rounded-xl font-bold text-text-main bg-background border border-border hover:bg-surface-hover hover:text-text-main transition-colors"
                    >
                        Đóng lại
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default TAPermissionsModal;
