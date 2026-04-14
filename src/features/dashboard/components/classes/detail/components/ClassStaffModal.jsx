import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import useAuthStore from '../../../../../../store/authStore';
import TAPermissionsModal from './TAPermissionsModal';

const ClassStaffModal = ({ isOpen, onClose }) => {
    const { user } = useAuthStore();
    const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);

    if (!isOpen) return null;

    const staff = [
        { id: 'TCH001', name: 'PGS.TS Trần Văn Giáo Viên', role: 'Giáo viên', email: 'teacher@fpt.edu.vn', type: 'TEACHER' },
        { id: 'TA001', name: user?.fullName || 'Nguyễn Trợ Giảng', role: 'Trợ giảng', email: user?.email || 'ta@fpt.edu.vn', type: 'TA' },
    ];

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center !p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-surface rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                
                {/* Header */}
                <div className="bg-surface border-b border-border !px-6 !py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Icon icon="solar:user-id-bold-duotone" className="text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-text-main">Ban giảng huấn</h2>
                            <p className="text-text-muted text-sm">Giáo viên và Trợ giảng của lớp</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:bg-surface-hover hover:text-text-main transition-colors"
                    >
                        <Icon icon="material-symbols:close-rounded" className="text-xl" />
                    </button>
                </div>

                {/* Body */}
                <div className="!p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {staff.map((p) => (
                        <div key={p.id} className="border border-border rounded-xl !p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/30 transition-colors bg-background">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${
                                    p.type === 'TEACHER' ? 'bg-blue-500/10 text-blue-600' : 'bg-green-500/10 text-green-600'
                                }`}>
                                    {p.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-main group-hover:text-primary transition-colors">{p.name}</h3>
                                    <p className="text-sm text-text-muted">{p.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 self-start sm:self-center">
                                <span className={`text-xs font-semibold !px-2.5 !py-1 rounded-md border shrink-0 ${
                                    p.type === 'TEACHER' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 'bg-green-500/10 text-green-600 border-green-500/20'
                                }`}>
                                    {p.role}
                                </span>
                                {p.type === 'TA' && user?.role?.toUpperCase() === 'TA' && (
                                    <button 
                                        onClick={() => setIsPermissionsOpen(true)}
                                        className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 !px-3 !py-1.5 rounded-lg transition-colors border border-primary/20 shrink-0 flex items-center gap-1.5"
                                        title="Xem quyền hạn của bạn"
                                    >
                                        <Icon icon="solar:shield-check-bold" className="text-sm" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <TAPermissionsModal 
                isOpen={isPermissionsOpen} 
                onClose={() => setIsPermissionsOpen(false)} 
            />
        </div>,
        document.body
    );
};

export default ClassStaffModal;
