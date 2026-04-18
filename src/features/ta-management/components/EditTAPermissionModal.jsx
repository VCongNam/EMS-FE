import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import useAuthStore from '../../../store/authStore';
import { taService } from '../api/taService';

const PERMISSION_OPTIONS = [
    { key: 'Attendance', label: 'Điểm danh học sinh', icon: 'solar:calendar-check-bold-duotone', desc: 'Cho phép TA thực hiện điểm danh trong lớp học do mình phụ trách.' },
    { key: 'Grade', label: 'Chấm điểm & Nhập điểm', icon: 'solar:pen-new-square-bold-duotone', desc: 'Cho phép TA nhập, sửa điểm các bài kiểm tra của học sinh.' },
    { key: 'Report', label: 'Xem Báo cáo học tập', icon: 'solar:chart-2-bold-duotone', desc: 'Xem biểu đồ thống kê, báo cáo học tập của lớp học.' },
    { key: 'Assignment', label: 'Tạo Bài tập & Assignment', icon: 'solar:document-add-bold-duotone', desc: 'Đăng tải bài tập, quản lý tài liệu, thông báo lớp.' },
];

const EditTAPermissionModal = ({ isOpen, onClose, assistant, onUpdate }) => {
    const { user } = useAuthStore();
    const [isSaving, setIsSaving] = useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [salaryPerSession, setSalaryPerSession] = useState(0);

    useEffect(() => {
        if (assistant?.permission) {
            const perms = assistant.permission.split(',').map(p => p.trim());
            setSelectedPermissions(perms);
        } else {
            setSelectedPermissions([]);
        }
        
        if (assistant?.salaryPerSession) {
            setSalaryPerSession(assistant.salaryPerSession);
        } else {
            setSalaryPerSession(0);
        }
    }, [assistant]);

    if (!isOpen) return null;

    const handleToggle = (permKey) => {
        setSelectedPermissions(prev => 
            prev.includes(permKey) 
                ? prev.filter(p => p !== permKey) 
                : [...prev, permKey]
        );
    };

    const handleSave = async (e) => {
        e?.stopPropagation();
        const taId = assistant.taId || assistant.taid;
        const classId = assistant.classId;
        
        if (!taId || !classId) {
            toast.error('Thiếu thông tin trợ giảng hoặc lớp học');
            return;
        }

        const payload = {
            permission: selectedPermissions.join(', ') || 'None',
            salaryPerSession: Number(salaryPerSession)
        };

        try {
            setIsSaving(true);
            const res = await taService.setTAPermission(classId, taId, payload, user?.token);
            if (res.ok) {
                toast.success(`Đã cập nhật quyền cho ${assistant.fullName} thành công!`);
                onUpdate();
                onClose();
            } else {
                const error = await res.json();
                toast.error(error.message || 'Lỗi khi cập nhật quyền');
            }
        } catch (error) {
            console.error(error);
            toast.error('Lỗi kết nối máy chủ');
        } finally {
            setIsSaving(false);
        }
    };

    return ReactDOM.createPortal(
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-[9999] animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center !p-4 pointer-events-none">
                <div 
                    className="bg-surface w-full max-w-2xl rounded-[1.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-border overflow-hidden animate-slide-up pointer-events-auto flex flex-col"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="!p-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Icon icon="solar:shield-keyhole-bold-duotone" className="text-[26px] text-primary" />
                            <h3 className="text-xl font-bold text-text-main">Quyền hạn cấu hình</h3>
                        </div>
                        <div className="!px-5 !py-1.5 bg-background text-text-muted rounded-lg text-[13px] font-bold">
                            {assistant?.fullName}
                        </div>
                    </div>

                    <div className="px-6 pb-6">
                        {/* Divider */}
                        <div className="h-[1px] bg-border/50 w-full mb-6"></div>

                        {/* Salary Field */}
                        <div className="!mb-8 !p-5 bg-primary/5 rounded-2xl border border-primary/20">
                            <label className="block text-sm font-bold text-text-main !mb-3 flex items-center gap-2">
                                <Icon icon="solar:wad-of-money-bold-duotone" className="text-xl text-primary" />
                                Lương mỗi buổi học (đ)
                            </label>
                            <div className="relative">
                                <input 
                                    type="number"
                                    value={salaryPerSession}
                                    onChange={(e) => setSalaryPerSession(e.target.value)}
                                    className="w-full !px-4 !py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-bold text-primary text-lg"
                                    placeholder="Nhập số tiền..."
                                    min="0"
                                    step="1000"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted font-bold text-sm">VND</div>
                            </div>
                        </div>

                        <label className="block text-sm font-bold text-text-main !mb-4 flex items-center gap-2">
                            <Icon icon="solar:shield-check-bold-duotone" className="text-xl text-primary" />
                            Danh sách quyền hạn
                        </label>
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto !pr-1 custom-scrollbar">
                            {PERMISSION_OPTIONS.map((opt) => {
                                const isActive = selectedPermissions.includes(opt.key);
                                return (
                                    <div
                                        key={opt.key}
                                        onClick={() => handleToggle(opt.key)}
                                        className="flex items-center justify-between p-4 rounded-[1.2rem] border border-border/50 bg-background hover:bg-border/20 transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-5">
                                            {/* Icon in Circle */}
                                            <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted shadow-sm shrink-0">
                                                <Icon icon={opt.icon} className="text-xl" />
                                            </div>
                                            <div className="flex flex-col">
                                                <h4 className="font-bold text-text-main text-[15px]">{opt.label}</h4>
                                                <p className="text-[13px] text-text-muted mt-0.5 leading-snug">{opt.desc}</p>
                                            </div>
                                        </div>

                                        {/* Custom Toggle Switch */}
                                        <div 
                                            className={`relative inline-flex h-[26px] w-[46px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                isActive ? '!bg-primary' : 'bg-border'
                                            }`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full bg-surface shadow ring-0 transition duration-200 ease-in-out ${
                                                    isActive ? 'translate-x-[20px]' : 'translate-x-0'
                                                }`}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Divider */}
                        <div className="h-[1px] !bg-border/50 w-full !mt-8 !mb-6"></div>

                        {/* Footer Actions */}
                        <div className="flex justify-end items-center gap-6 !pr-2">
                            <button
                                onClick={onClose}
                                className="text-[15px] font-bold text-text-muted hover:text-text-main transition-colors !bg-transparent"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="!px-8 !py-2.5 rounded-xl !bg-primary !text-white font-bold shadow-lg shadow-primary/20 hover:!bg-primary-hover transition-all flex items-center gap-2 group disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <Icon icon="solar:spinner-linear" className="animate-spin text-xl !text-white" />
                                ) : (
                                    <Icon icon="solar:diskette-bold-duotone" className="text-xl !text-white group-hover:scale-110 transition-transform" />
                                )}
                                <span className="text-[15px] !text-white">Lưu cấu hình</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
};

export default EditTAPermissionModal;
