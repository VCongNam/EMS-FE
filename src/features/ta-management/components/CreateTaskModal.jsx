import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import Button from '../../../components/ui/Button';

const CreateTaskModal = ({ isOpen, onClose, onAssign, tas = [], classes = [] }) => {
    const [taskData, setTaskData] = useState({
        title: '',
        assignedTo: '',
        deadline: '',
        type: 'Grade'
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate deadline: must be after today
        const selectedDate = new Date(taskData.deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate <= today) {
            toast.error('Hạn chót phải sau ngày hôm nay!');
            return;
        }

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
                                        <option key={ta.classTAId || ta.taid} value={ta.classTAId || ta.taid}>
                                            {ta.fullName || ta.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="!space-y-1.5">
                                <label className="block text-sm font-semibold text-text-main">Hạn chót (Deadline) <span className="text-red-500">*</span></label>
                                <input
                                    type="date"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    value={taskData.deadline}
                                    onChange={e => setTaskData({...taskData, deadline: e.target.value})}
                                    className="w-full !px-4 !py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-text-main outline-none"
                                />
                            </div>

                            <div className="!space-y-1.5">
                                <label className="block text-sm font-semibold text-text-main">Loại công việc <span className="text-red-500">*</span></label>
                                <select
                                    required
                                    value={taskData.type}
                                    onChange={e => setTaskData({...taskData, type: e.target.value})}
                                    className="w-full !px-4 !py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-text-main outline-none appearance-none"
                                >
                                    <option value="Grade">Chấm điểm </option>
                                </select>
                            </div>
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
