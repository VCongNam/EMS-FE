import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import useAuthStore from '../../../store/authStore';
import TaskDetailModal from '../components/TaskDetailModal';

const MyTasksPage = () => {
    const { user } = useAuthStore();
    const [selectedTask, setSelectedTask] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Mock Tasks for the current TA (identifying as TA001 for demo)
    const [tasks, setTasks] = useState([
        {
            id: 'TASK-1',
            title: 'Chấm 40 bài tập lớn',
            description: 'Chấm điểm và ghi chú lỗi sai cho sinh viên lớp Toán Cao Cấp. Chú ý các bài nộp muộn.',
            assignedTo: 'TA001',
            classId: 'MATH101',
            deadline: '2026-03-25',
            priority: 'high',
            status: 'todo'
        },
        {
            id: 'TASK-2',
            title: 'Soạn slide ôn tập chương 3',
            description: 'Tổng hợp lại lý thuyết chương 3 theo giáo trình mới. Tập trung vào phần Đạo hàm và Tích phân.',
            assignedTo: 'TA001',
            classId: 'MATH101',
            deadline: '2026-03-28',
            priority: 'medium',
            status: 'in_progress'
        },
        {
            id: 'TASK-4',
            title: 'Hỗ trợ giải đáp thắc mắc Lab 2',
            description: 'Trực tuyến trên MS Teams để trả lời câu hỏi của sinh viên về bài Lab 2: Cài đặt môi trường.',
            assignedTo: 'TA001',
            classId: 'CS101',
            deadline: '2026-03-22',
            priority: 'high',
            status: 'done'
        },
        {
            id: 'TASK-5',
            title: 'Kiểm tra sĩ số đầu giờ',
            description: 'Ghi lại danh sách sinh viên vắng mặt không phép.',
            assignedTo: 'TA001',
            classId: 'CS101',
            deadline: '2026-03-30',
            priority: 'low',
            status: 'todo'
        }
    ]);

    const handleUpdateStatus = (taskId, newStatus) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    };

    const handleViewDetail = (task) => {
        setSelectedTask(task);
        setIsDetailModalOpen(true);
    };

    const getPriorityBadge = (priority) => {
        switch(priority) {
            case 'high': return <span className="text-[10px] font-bold !bg-red-500/10 text-red-600 !px-2 !py-0.5 rounded border border-red-500/20">CAO</span>;
            case 'medium': return <span className="text-[10px] font-bold !bg-amber-500/10 text-amber-600 !px-2 !py-0.5 rounded border border-amber-500/20">TRUNG BÌNH</span>;
            case 'low': return <span className="text-[10px] font-bold !bg-slate-500/10 text-slate-600 !px-2 !py-0.5 rounded border border-slate-500/20">THẤP</span>;
            default: return null;
        }
    };

    const Column = ({ title, status, icon, colorClass }) => {
        const filteredTasks = tasks.filter(t => t.status === status && t.title.toLowerCase().includes(searchQuery.toLowerCase()));
        
        return (
            <div className="flex flex-col !bg-background/50 rounded-[2rem] border border-border/50 min-h-[400px]">
                <div className="!p-5 border-b border-border/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${colorClass}`}>
                            <Icon icon={icon} className="text-lg" />
                        </div>
                        <h3 className="font-bold text-text-main shrink-0">{title}</h3>
                    </div>
                    <span className="!bg-surface border border-border !px-2 !py-0.5 rounded-full text-xs font-bold text-text-muted">
                        {filteredTasks.length}
                    </span>
                </div>
                
                <div className="!p-4 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map(task => (
                            <div 
                                key={task.id}
                                onClick={() => handleViewDetail(task)}
                                className="!bg-surface border border-border rounded-2xl !p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group space-y-3"
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <h4 className="font-bold text-sm text-text-main group-hover:text-primary transition-colors leading-snug">
                                        {task.title}
                                    </h4>
                                    {getPriorityBadge(task.priority)}
                                </div>
                                
                                {task.classId && (
                                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary !bg-primary/5 !px-2 !py-1 rounded-lg border border-primary/10 w-fit">
                                        <Icon icon="material-symbols:school-outline-rounded" />
                                        <span>Lớp: {task.classId}</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between !pt-2 border-t border-border/50">
                                    <div className="flex items-center gap-1.5 text-xs text-text-muted font-medium !bg-background !px-2 !py-1 rounded-lg border border-border/50">
                                        <Icon icon="material-symbols:calendar-today-outline" className="text-primary/70" />
                                        {new Date(task.deadline).toLocaleDateString('vi-VN', {day:'2-digit', month:'2-digit'})}
                                    </div>
                                    <div className="w-7 h-7 rounded-full !bg-primary/10 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Icon icon="material-symbols:arrow-forward-rounded" />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center opacity-40 !py-10">
                            <Icon icon="solar:ghost-smile-bold-duotone" className="text-4xl !mb-2" />
                            <p className="text-xs font-bold text-center">Trống</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full !mx-auto !space-y-6 animate-fade-in !pb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center !gap-6 !bg-surface !p-6 rounded-[2rem] border border-border shadow-sm">
                <div className="flex items-center !gap-4">
                    <div className="w-14 h-14 rounded-2xl !bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
                        <Icon icon="material-symbols:task-rounded" className="text-3xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-text-main font-['Outfit']">Nhiệm vụ của tôi</h1>
                        <p className="text-text-muted !mt-1 text-sm sm:text-base">Theo dõi và cập nhật tiến độ công việc được giao</p>
                    </div>
                </div>

                <div className="relative w-full md:w-80 shrink-0">
                    <Icon icon="solar:magnifer-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
                    <input
                        type="text"
                        placeholder="Tìm nhiệm vụ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full !pl-11 !pr-4 !py-3 !bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-text-main font-medium placeholder:font-normal"
                    />
                </div>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-3 !gap-6">
                <Column 
                    title="Cần làm" 
                    status="todo" 
                    icon="material-symbols:format-list-bulleted-rounded" 
                    colorClass="!bg-slate-500/10 text-slate-500" 
                />
                <Column 
                    title="Đang làm" 
                    status="in_progress" 
                    icon="material-symbols:calendar-clock" 
                    colorClass="!bg-amber-500/10 text-amber-500" 
                />
                <Column 
                    title="Hoàn thành" 
                    status="done" 
                    icon="material-symbols:check-circle-outline-rounded" 
                    colorClass="!bg-green-500/10 text-green-500" 
                />
            </div>

            <TaskDetailModal 
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                task={selectedTask}
                onUpdateStatus={handleUpdateStatus}
            />
        </div>
    );
};

export default MyTasksPage;
