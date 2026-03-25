import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import Button from '../../../components/ui/Button';

const TaskDetailModal = ({ isOpen, onClose, task, onUpdateStatus }) => {
    const [status, setStatus] = useState(task?.status || 'todo');

    if (!isOpen || !task) return null;

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        if (onUpdateStatus) {
            onUpdateStatus(task.id, newStatus);
        }
    };

    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'high': return 'text-red-600 bg-red-500/10 border-red-500/20';
            case 'medium': return 'text-amber-600 bg-amber-500/10 border-amber-500/20';
            case 'low': return 'text-slate-600 bg-slate-500/10 border-slate-500/20';
            default: return 'text-text-muted bg-background border-border';
        }
    };

    const getStatusInfo = (s) => {
        switch(s) {
            case 'todo': return { label: 'Cần làm', color: 'bg-slate-500', icon: 'material-symbols:format-list-bulleted-rounded' };
            case 'in_progress': return { label: 'Đang làm', color: 'bg-amber-500', icon: 'material-symbols:calendar-clock' };
            case 'done': return { label: 'Đã xong', color: 'bg-green-500', icon: 'material-symbols:check-circle-outline-rounded' };
            default: return { label: 'Không xác định', color: 'bg-gray-500', icon: 'material-symbols:help-outline' };
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in !p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="relative w-full max-w-xl bg-surface border border-border rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-scale-up">
                {/* Header */}
                <div className="!px-6 !py-5 border-b border-border/50 flex items-center justify-between bg-background/50">
                    <div className="flex items-center !gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${getStatusInfo(task.status).color}`}>
                            <Icon icon={getStatusInfo(task.status).icon} className="text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-text-main line-clamp-1">{task.title}</h2>
                            <p className="text-xs text-text-muted font-medium">Chi tiết nhiệm vụ được giao</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-background hover:bg-surface-hover text-text-muted transition-colors"
                    >
                        <Icon icon="solar:close-circle-bold" className="text-xl" />
                    </button>
                </div>

                {/* Body */}
                <div className="!p-6 space-y-6 overflow-y-auto max-h-[70vh]">
                    {/* Priority & Deadline Row */}
                    <div className="flex flex-wrap gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Mức độ ưu tiên</span>
                            <div className={`!px-3 !py-1 rounded-lg border text-xs font-bold w-fit ${getPriorityColor(task.priority)}`}>
                                {task.priority === 'high' ? 'CAO' : task.priority === 'medium' ? 'TRUNG BÌNH' : 'THẤP'}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Hạn chót</span>
                            <div className="flex items-center gap-2 text-sm font-semibold text-text-main bg-background !px-3 !py-1 rounded-lg border border-border">
                                <Icon icon="material-symbols:calendar-today-outline" className="text-primary" />
                                {new Date(task.deadline).toLocaleDateString('vi-VN')}
                            </div>
                        </div>
                        {task.classId && (
                            <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Lớp học</span>
                                <div className="flex items-center gap-2 text-sm font-semibold text-primary bg-primary/5 !px-3 !py-1 rounded-lg border border-primary/10">
                                    <Icon icon="material-symbols:school-outline-rounded" />
                                    <span>Lớp: {task.classId}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Mô tả công việc</span>
                        <div className="!p-4 bg-background rounded-2xl border border-border text-sm text-text-main leading-relaxed whitespace-pre-wrap min-h-[100px]">
                            {task.description || "Không có mô tả chi tiết cho nhiệm vụ này."}
                        </div>
                    </div>

                    {/* Status Update */}
                    <div className="space-y-3">
                        <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Cập nhật trạng thái</span>
                        <div className="grid grid-cols-3 gap-3">
                            {['todo', 'in_progress', 'done'].map((s) => {
                                const info = getStatusInfo(s);
                                const isActive = task.status === s;
                                return (
                                    <button
                                        key={s}
                                        onClick={() => handleStatusChange(s)}
                                        className={`flex flex-col items-center justify-center !p-3 rounded-2xl border transition-all gap-2 ${
                                            isActive 
                                                ? `bg-surface border-transparent ring-2 ring-primary/50 shadow-lg shadow-primary/10` 
                                                : 'bg-background border-border hover:border-primary/30 text-text-muted'
                                        }`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? info.color + ' text-white' : 'bg-surface text-text-muted'}`}>
                                            <Icon icon={info.icon} className="text-lg" />
                                        </div>
                                        <span className={`text-[11px] font-bold uppercase ${isActive ? 'text-primary' : ''}`}>{info.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="!px-6 !py-4 border-t border-border/50 bg-background/50 flex justify-end">
                    <Button onClick={onClose} variant="!primary" className="!px-8 !py-2.5 rounded-xl font-bold">
                        Đóng
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default TaskDetailModal;
