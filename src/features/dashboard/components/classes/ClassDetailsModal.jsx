import React from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';

const ClassDetailsModal = ({ isOpen, onClose, classData, onEdit }) => {
    if (!isOpen || !classData) return null;

    const getStatusConfig = (status) => {
        switch (status) {
            case 'ongoing':
                return { label: 'Đang diễn ra', color: 'text-green-600', bg: 'bg-green-100', dot: 'bg-green-500' };
            case 'upcoming':
                return { label: 'Sắp khai giảng', color: 'text-blue-600', bg: 'bg-blue-100', dot: 'bg-blue-500' };
            case 'completed':
                return { label: 'Đã kết thúc', color: 'text-gray-600', bg: 'bg-gray-100', dot: 'bg-gray-500' };
            case 'archived':
                return { label: 'Đã lưu trữ', color: 'text-orange-600', bg: 'bg-orange-100', dot: 'bg-orange-500' };
            default:
                return { label: 'Không xác định', color: 'text-gray-600', bg: 'bg-gray-100', dot: 'bg-gray-500' };
        }
    };

    const statusConfig = getStatusConfig(classData.status);
    const progressPercent = classData.progress?.totalSessions > 0 
        ? Math.round((classData.progress.currentSession / classData.progress.totalSessions) * 100) 
        : 0;

    return createPortal(
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center !p-4 pointer-events-none">
                <div
                    className="bg-surface rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in-up pointer-events-auto"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <div className="flex items-center justify-between !p-6 border-b border-border sticky top-0 bg-surface/95 backdrop-blur-md z-10 rounded-t-3xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                <Icon icon="material-symbols:info-rounded" className="text-primary text-xl" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-text-main font-['Outfit']">
                                    Chi tiết lớp học
                                </h2>
                                <p className="text-xs text-text-muted">
                                    Thông tin chi tiết về lớp học
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-9 h-9 rounded-xl bg-background border border-border flex items-center justify-center text-text-muted hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
                        >
                            <Icon icon="material-symbols:close-rounded" className="text-lg" />
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="!p-6 space-y-5">
                        {/* Class Name */}
                        <div className="space-y-1.5">
                            <label className="!py-2 block text-xs font-bold text-text-muted uppercase tracking-widest">Tên lớp học</label>
                            <div className="w-full !px-4 !py-3 bg-surface border border-border rounded-xl text-text-main font-medium cursor-default">
                                {classData.name}
                            </div>
                        </div>

                        {/* Mô tả */}
                        <div className="space-y-1.5">
                            <label className="!py-2 block text-xs font-bold text-text-muted uppercase tracking-widest">Mô tả</label>
                            <textarea
                                readOnly
                                className="w-full !px-4 !py-3 bg-surface border border-border rounded-xl text-text-main font-medium resize-none cursor-default focus:outline-none"
                                rows={3}
                                value={classData.description || 'Chưa có mô tả cho lớp học này.'}
                            />
                        </div>

                        {/* Thông tin số lượng & buổi */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="!py-2 block text-xs font-bold text-text-muted uppercase tracking-widest">Số lượng dự kiến</label>
                                <div className="w-full !px-4 !py-3 bg-surface border border-border rounded-xl text-text-main font-medium cursor-default flex items-center justify-between">
                                    <span>{classData.students?.max || 0} học viên</span>
                                    <Icon icon="material-symbols:group-rounded" className="text-text-muted text-lg" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="!py-2 block text-xs font-bold text-text-muted uppercase tracking-widest">Số buổi dự kiến</label>
                                <div className="w-full !px-4 !py-3 bg-surface border border-border rounded-xl text-text-main font-medium cursor-default flex items-center justify-between">
                                    <span>{classData.progress?.totalSessions || 0} buổi</span>
                                    <Icon icon="material-symbols:menu-book-rounded" className="text-text-muted text-lg" />
                                </div>
                            </div>
                        </div>

                        {/* Học phí & Lịch học */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="!py-2 block text-xs font-bold text-text-muted uppercase tracking-widest">Học phí</label>
                                <div className="w-full !px-4 !py-3 bg-surface border border-border rounded-xl text-text-main font-medium cursor-default flex items-center justify-between">
                                    <span>{classData.tuitionFee ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(classData.tuitionFee) : 'Chưa cập nhật'}</span>
                                    <Icon icon="material-symbols:payments-rounded" className="text-text-muted text-lg" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="!py-2 block text-xs font-bold text-text-muted uppercase tracking-widest">Lịch học</label>
                                <div className="w-full !px-4 !py-3 bg-surface border border-border rounded-xl text-text-main font-medium cursor-default flex items-center justify-between">
                                    <span>{classData.schedule || 'Chưa cập nhật'}</span>
                                    <Icon icon="material-symbols:schedule-rounded" className="text-text-muted text-lg" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex gap-3 !px-6 !pb-6 !pt-2">
                        <button
                            onClick={onClose}
                            className="w-full !px-4 !py-3 rounded-xl bg-background border border-border text-text-muted font-semibold hover:bg-surface hover:text-text-main transition-all"
                        >
                            Đóng
                        </button>
                        <button
                            onClick={() => {
                                onClose();
                                if (onEdit) onEdit(classData);
                            }}
                            className="w-full !px-4 !py-3 rounded-xl bg-primary text-outline font-semibold hover:bg-primary-hover transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2"
                        >
                            <Icon icon="material-symbols:edit-rounded" className="text-lg" />
                            Chỉnh sửa lớp học
                        </button>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
};

export default ClassDetailsModal;
