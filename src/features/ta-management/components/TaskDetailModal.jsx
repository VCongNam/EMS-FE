import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import Button from '../../../components/ui/Button';

const TaskDetailModal = ({ isOpen, onClose, task, onUpdateStatus, onReviewTask, userRole }) => {
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || !task) return null;

    const role = userRole?.toUpperCase() || 'TA';
    const currentStatus = (task.status || 'Todo').toLowerCase();

    const handleTaUpdate = async (newStatus) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await onUpdateStatus(task.id, newStatus);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTeacherReview = async (isApproved) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await onReviewTask(task.id, isApproved, feedback);
            setFeedback('');
        } finally {
            setIsSubmitting(false);
        }
    };

    const statuses = [
        { id: 'todo', label: 'Cần làm', icon: 'material-symbols:format-list-bulleted-rounded', color: 'bg-slate-500' },
        { id: 'inprogress', label: 'Đang làm', icon: 'material-symbols:calendar-clock', color: 'bg-amber-500' },
        { id: 'review', label: 'Chờ duyệt', icon: 'material-symbols:rate-review-outline-rounded', color: 'bg-purple-500' },
        { id: 'done', label: 'Hoàn thành', icon: 'material-symbols:check-circle-outline-rounded', color: 'bg-green-500' }
    ];

    // Add Overdue if needed, but usually it's a sub-state of incomplete ones
    const isOverdue = currentStatus === 'overdue';

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in !p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
            
            <div className="relative w-full max-w-xl bg-surface border border-border rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-scale-up">
                {/* Header */}
                <div className="!px-8 !py-6 border-b border-border/50 flex items-center justify-between bg-background/30">
                    <div className="flex items-center !gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${isOverdue ? 'bg-red-500' : (statuses.find(s => s.id === currentStatus || (s.id === 'inprogress' && currentStatus === 'in_progress'))?.color || 'bg-slate-500')}`}>
                            <Icon icon={isOverdue ? 'material-symbols:error-outline-rounded' : (statuses.find(s => s.id === currentStatus || (s.id === 'inprogress' && currentStatus === 'in_progress'))?.icon || 'material-symbols:help-outline')} className="text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-text-main leading-tight">{task.title}</h2>
                            <p className="text-sm text-text-muted font-medium mt-0.5">Chi tiết công việc ({role === 'TA' ? 'Trợ giảng' : 'Giáo viên'})</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-background hover:bg-red-50 hover:text-red-500 text-text-muted transition-all"
                    >
                        <Icon icon="solar:close-circle-bold" className="text-2xl" />
                    </button>
                </div>

                {/* Body */}
                <div className="!p-8 space-y-8 overflow-y-auto max-h-[70vh]">
                    {/* Basic Info Row */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <span className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                                <Icon icon="solar:calendar-date-linear" className="text-primary" />
                                Hạn chót
                            </span>
                            <div className="!px-4 !py-3 bg-background rounded-2xl border border-border font-bold text-text-main shadow-sm italic">
                                {task.deadline ? new Date(task.deadline).toLocaleDateString('vi-VN', {day:'2-digit', month:'2-digit', year:'numeric'}) : 'Không có'}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <span className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                                <Icon icon="solar:school-outline" className="text-primary" />
                                Lớp học
                            </span>
                            <div className="!px-4 !py-3 bg-primary/5 rounded-2xl border border-primary/20 font-bold text-primary shadow-sm truncate">
                                {task.classId || 'N/A'}
                            </div>
                        </div>
                    </div>

                    {/* Status Progress - NEW HIGHLIGHT VERSION */}
                    <div className="space-y-4">
                        <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Tiến độ thực hiện</span>
                        <div className="grid grid-cols-4 gap-2">
                            {statuses.map((s, index) => {
                                const isActive = currentStatus === s.id || (s.id === 'inprogress' && currentStatus === 'in_progress');
                                return (
                                    <div key={s.id} className="relative flex flex-col items-center">
                                        <div className={`w-full !p-3 rounded-2xl border transition-all flex flex-col items-center gap-2 ${
                                            isActive 
                                                ? `${s.color} border-transparent text-white shadow-lg ring-4 ring-offset-2 ring-offset-surface ring-${s.color.split('-')[1]}-500/30 scale-105 z-10` 
                                                : 'bg-background border-border text-text-muted opacity-50'
                                        }`}>
                                            <Icon icon={s.icon} className="text-xl" />
                                            <span className="text-[10px] font-bold uppercase text-center block leading-none">{s.label}</span>
                                            {isActive && (
                                                <div className="absolute -top-1 -right-1">
                                                    <div className="w-4 h-4 rounded-full bg-white text-primary flex items-center justify-center shadow-md">
                                                        <Icon icon="material-symbols:check-small-rounded" className="text-xs font-bold" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {isOverdue && (
                            <div className="!p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl flex items-center justify-center gap-2 font-bold animate-pulse">
                                <Icon icon="material-symbols:warning-rounded" />
                                <span>CÔNG VIỆC ĐÃ QUÁ HẠN!</span>
                            </div>
                        )}
                    </div>

                    {/* Feedback displayed for BOTH roles */}

                    {/* Feedback displayed only when value exists */}
                    {task.feedback && (
                        <div className="space-y-3">
                            <span className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                                <Icon icon="solar:chat-line-linear" className="text-purple-500" />
                                Nhận xét từ Giáo viên
                            </span>
                            <div className="!p-5 bg-purple-50/50 rounded-[1.5rem] border border-purple-100 text-sm text-text-main leading-relaxed relative overflow-hidden group">
                                <div className="absolute left-0 top-0 w-1.5 h-full bg-purple-400"></div>
                                <p className="font-semibold text-purple-900">{task.feedback}</p>
                            </div>
                        </div>
                    )}
                    <div className="!pt-6 border-t border-border/50">
                        {role === 'TA' ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Hành động của Trợ giảng</span>
                                    {currentStatus === 'review' && (
                                        <span className="text-[10px] font-bold text-purple-500 bg-purple-50 !px-2 !py-0.5 rounded-full border border-purple-200">
                                            ĐANG CHỜ DUYỆT
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-4">
                                    {(status => {
                                        // TA only flows: Todo -> InProgress -> Review
                                        if (status === 'todo') return (
                                            <Button onClick={() => handleTaUpdate('InProgress')} isLoading={isSubmitting} className="w-full !py-4 !bg-amber-500 text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-amber-500/20 hover:scale-[1.02] transition-transform">
                                                <Icon icon="material-symbols:play-arrow-rounded" className="text-2xl" />
                                                Bắt đầu làm ngay
                                            </Button>
                                        );
                                        if (status === 'inprogress' || status === 'in_progress') return (
                                            <Button onClick={() => handleTaUpdate('Review')} isLoading={isSubmitting} className="w-full !py-4 !bg-purple-600 text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-purple-500/20 hover:scale-[1.02] transition-transform">
                                                <Icon icon="material-symbols:send-rounded" className="text-2xl" />
                                                Gửi giáo viên duyệt công việc
                                            </Button>
                                        );
                                        if (status === 'review') return (
                                            <div className="w-full !p-5 bg-purple-50 text-purple-600 border border-purple-200 rounded-2xl text-center flex flex-col items-center gap-1 shadow-inner">
                                                <Icon icon="solar:hourglass-bold" className="text-2xl animate-spin-slow" />
                                                <span className="font-bold">Đang chờ giáo viên duyệt...</span>
                                                <span className="text-[10px] opacity-70">Lưu ý: Chỉ giáo viên mới có quyền duyệt "Hoàn thành" nhiệm vụ này.</span>
                                            </div>
                                        );
                                        if (status === 'done') return (
                                            <div className="w-full !p-5 bg-green-50 text-green-700 border border-green-200 rounded-2xl text-center flex items-center justify-center gap-3 font-bold shadow-inner">
                                                <Icon icon="material-symbols:verified-rounded" className="text-3xl" />
                                                CÔNG VIỆC ĐÃ HOÀN TẤT
                                            </div>
                                        );
                                        return null;
                                    })(currentStatus)}
                                </div>
                            </div>
                        ) : (
                            /* TEACHER ACTIONS */
                            <div className="space-y-4">
                                <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Duyệt & Nhận xét (Giáo viên)</span>
                                {currentStatus === 'review' ? (
                                    <div className="space-y-4">
                                        <textarea
                                            className="w-full !p-5 bg-background border border-border rounded-2xl text-sm focus:outline-none focus:border-primary transition-shadow focus:ring-4 focus:ring-primary/10 min-h-[120px]"
                                            placeholder="Ghi nhận xét tại đây (ví dụ: Tốt lắm, hoặc cần sửa câu 3...)"
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                        ></textarea>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Button onClick={() => handleTeacherReview(false)} variant="outline" isLoading={isSubmitting} className="!py-4 !border-red-500 text-red-600 hover:bg-red-50 font-bold rounded-2xl">
                                                Yêu cầu sửa lại
                                            </Button>
                                            <Button onClick={() => handleTeacherReview(true)} variant="primary" isLoading={isSubmitting} className="!py-4 !bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl shadow-lg shadow-green-500/20">
                                                Duyệt & Hoàn thành
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={`!p-5 rounded-2xl border text-center text-sm font-bold flex items-center justify-center gap-3 ${currentStatus === 'done' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-500 border-slate-200 italic'}`}>
                                        <Icon icon={currentStatus === 'done' ? 'material-symbols:verified-rounded' : 'solar:info-circle-linear'} className="text-2xl" />
                                        {currentStatus === 'done' ? 'Nhiệm vụ này đã được bạn duyệt hoàn thành.' : `Trợ giảng chưa gửi duyệt (Trạng thái hiện tại: ${statuses.find(s=>s.id === currentStatus || (s.id==='inprogress' && currentStatus==='in_progress'))?.label || 'Khác'})`}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="!px-8 !py-5 border-t border-border/50 bg-background/30 flex justify-end">
                    <Button onClick={onClose} variant="!primary" className="!px-10 !py-3 rounded-2xl font-bold hover:shadow-lg transition-all">
                        Đóng
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default TaskDetailModal;
