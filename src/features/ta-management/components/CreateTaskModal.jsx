import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import Button from '../../../components/ui/Button';

const CreateTaskModal = ({ isOpen, onClose, onAssign, tas = [], classes = [] }) => {
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        assignedTo: '',
        classId: '',
        deadline: '',
        priority: 'medium'
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onAssign({
            ...taskData,
            id: `TASK-${Date.now()}`,
            status: 'todo'
        });
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-surface border border-border rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
                {/* Header */}
                <div className="!px-6 !py-5 border-b border-border/50 flex items-center justify-between bg-background/50">
                    <div className="flex items-center !gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Icon icon="material-symbols:add-task-rounded" className="text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-text-main">Giao công việc mới</h2>
                            <p className="text-sm text-text-muted font-medium">Phân công nhiệm vụ cho trợ giảng</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-background hover:bg-red-500/10 hover:text-red-500 text-text-muted transition-colors"
                    >
                        <Icon icon="solar:close-circle-bold" className="text-xl" />
                    </button>
                </div>

                {/* Body */}
                <div className="!p-6 overflow-y-auto">
                    <form id="create-task-form" onSubmit={handleSubmit} className="!space-y-5">
                        <div className="!space-y-1.5">
                            <label className="block text-sm font-semibold text-text-main">Tiêu đề công việc <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                required
                                value={taskData.title}
                                onChange={e => setTaskData({...taskData, title: e.target.value})}
                                placeholder="Ví dụ: Chấm điểm bài tập giữa kỳ"
                                className="w-full !px-4 !py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-text-main outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 !gap-5">
                            <div className="!space-y-1.5">
                                <label className="block text-sm font-semibold text-text-main">Giao cho Trợ giảng <span className="text-red-500">*</span></label>
                                <select
                                    required
                                    value={taskData.assignedTo}
                                    onChange={e => setTaskData({...taskData, assignedTo: e.target.value})}
                                    className="w-full !px-4 !py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-text-main outline-none appearance-none"
                                >
                                    <option value="">-- Chọn Trợ giảng --</option>
                                    {tas.map(ta => (
                                        <option key={ta.id} value={ta.id}>{ta.name} ({ta.id})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="!space-y-1.5">
                                <label className="block text-sm font-semibold text-text-main">Lớp liên quan</label>
                                <select
                                    value={taskData.classId}
                                    onChange={e => setTaskData({...taskData, classId: e.target.value})}
                                    className="w-full !px-4 !py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-text-main outline-none appearance-none"
                                >
                                    <option value="">-- Tất cả lớp / Không cụ thể --</option>
                                    {classes.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="!space-y-1.5">
                                <label className="block text-sm font-semibold text-text-main">Hạn chót (Deadline) <span className="text-red-500">*</span></label>
                                <input
                                    type="date"
                                    required
                                    value={taskData.deadline}
                                    onChange={e => setTaskData({...taskData, deadline: e.target.value})}
                                    className="w-full !px-4 !py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-text-main outline-none"
                                />
                            </div>

                            <div className="!space-y-1.5">
                                <label className="block text-sm font-semibold text-text-main">Mức độ ưu tiên</label>
                                <select
                                    value={taskData.priority}
                                    onChange={e => setTaskData({...taskData, priority: e.target.value})}
                                    className="w-full !px-4 !py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-text-main outline-none appearance-none"
                                >
                                    <option value="low">Thấp</option>
                                    <option value="medium">Trung bình</option>
                                    <option value="high">Cao</option>
                                </select>
                            </div>
                        </div>

                        <div className="!space-y-1.5">
                            <label className="block text-sm font-semibold text-text-main">Mô tả chi tiết</label>
                            <textarea
                                rows="4"
                                value={taskData.description}
                                onChange={e => setTaskData({...taskData, description: e.target.value})}
                                placeholder="Ghi chú cụ thể những việc trợ giảng cần làm..."
                                className="w-full !px-4 !py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-text-main outline-none resize-none"
                            ></textarea>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="!px-6 !py-4 border-t border-border/50 bg-background/50 flex items-center justify-end !gap-3">
                    <Button variant="outline" onClick={onClose} className="!px-6 !py-2.5 rounded-xl font-semibold">
                        Hủy
                    </Button>
                    <Button type="submit" form="create-task-form" variant="!primary" className="!px-6 !py-2.5 rounded-xl font-semibold flex items-center !gap-2 shadow-lg shadow-primary/20">
                        <Icon icon="material-symbols:send-rounded" className="text-lg" />
                        Giao việc
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CreateTaskModal;
