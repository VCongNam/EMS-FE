import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Button from '../../../components/ui/Button';
import CreateTaskModal from '../components/CreateTaskModal';

const TATaskManagementTab = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Mock Data
    const tas = [
        { id: 'TA001', name: 'Lê Thảo Nhi' },
        { id: 'TA002', name: 'Nguyễn Quang Vinh' },
        { id: 'TA003', name: 'Phạm Đức Anh' },
    ];
    const classes = [
        { id: 'C1', name: 'Toán Cao Cấp (MATH101)' },
        { id: 'C2', name: 'Lập Trình Cơ Bản (CS101)' },
    ];

    const [tasks, setTasks] = useState([
        {
            id: 'TASK-1',
            title: 'Chấm 40 bài tập lớn',
            description: 'Chấm điểm và ghi chú lỗi sai cho sinh viên',
            assignedTo: 'TA001',
            classId: 'C1',
            deadline: '2026-03-25',
            priority: 'high',
            status: 'todo'
        },
        {
            id: 'TASK-2',
            title: 'Soạn slide ôn tập chương 3',
            description: 'Tổng hợp lại lý thuyết chương 3 theo giáo trình mới',
            assignedTo: 'TA002',
            classId: 'C2',
            deadline: '2026-03-24',
            priority: 'medium',
            status: 'in_progress'
        },
        {
            id: 'TASK-3',
            title: 'Điểm danh buổi thực hành',
            description: '',
            assignedTo: 'TA003',
            classId: 'C2',
            deadline: '2026-03-20',
            priority: 'low',
            status: 'done'
        }
    ]);

    const handleAssignTask = (newTask) => {
        setTasks([newTask, ...tasks]);
    };

    const getPriorityBadge = (priority) => {
        switch(priority) {
            case 'high': return <span className="inline-flex items-center !px-2 !py-0.5 rounded-md text-[11px] font-bold bg-red-500/10 text-red-600 border border-red-500/20">CAO</span>;
            case 'medium': return <span className="inline-flex items-center !px-2 !py-0.5 rounded-md text-[11px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">TRUNG BÌNH</span>;
            case 'low': return <span className="inline-flex items-center !px-2 !py-0.5 rounded-md text-[11px] font-bold bg-slate-500/10 text-slate-600 border border-slate-500/20">THẤP</span>;
            default: return null;
        }
    };

    const TaskCard = ({ task }) => {
        const ta = tas.find(t => t.id === task.assignedTo);
        const taskClass = classes.find(c => c.id === task.classId);

        return (
            <div className="bg-surface rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group !p-4 flex flex-col !gap-3">
                <div className="flex justify-between items-start !gap-2">
                    <h4 className="font-bold text-text-main text-sm leading-snug group-hover:text-primary transition-colors">{task.title}</h4>
                    {getPriorityBadge(task.priority)}
                </div>
                
                {task.classId && (
                    <div className="inline-flex max-w-max items-center !gap-1.5 !px-2 !py-1 rounded-lg bg-primary/5 border border-primary/10 text-primary text-xs font-semibold">
                        <Icon icon="material-symbols:school-outline-rounded" />
                        <span className="truncate">{taskClass?.name}</span>
                    </div>
                )}

                <div className="!pt-3 border-t border-border/50 flex items-center justify-between !gap-2 mt-auto">
                    <div className="flex items-center !gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-500/15 text-purple-600 flex items-center justify-center text-[10px] font-bold uppercase ring-2 ring-background">
                            {ta?.name.charAt(0)}
                        </div>
                        <span className="text-xs font-medium text-text-muted truncate max-w-[80px]">{ta?.name}</span>
                    </div>
                    <div className="flex items-center !gap-1.5 text-xs font-medium text-text-muted bg-background !px-2 !py-1 rounded border border-border/50">
                        <Icon icon="material-symbols:calendar-today-outline" className="text-primary/70" />
                        {new Date(task.deadline).toLocaleDateString('vi-VN', {day: '2-digit', month:'2-digit'})}
                    </div>
                </div>
            </div>
        );
    };

    const Column = ({ title, status, icon, colorClass, borderClass }) => {
        const filteredTasks = tasks.filter(t => t.status === status && t.title.toLowerCase().includes(searchQuery.toLowerCase()));
        
        return (
            <div className={`bg-background/50 rounded-[2rem] border ${borderClass} flex flex-col min-w-[300px] sm:min-w-0`}>
                <div className="!p-4 sm:!p-5 border-b border-border/50 flex items-center justify-between">
                    <div className="flex items-center !gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${colorClass}`}>
                            <Icon icon={icon} className="text-lg" />
                        </div>
                        <h3 className="font-bold text-text-main">{title}</h3>
                    </div>
                    <span className="flex items-center justify-center !min-w-[1.5rem] !px-1.5 !h-6 rounded-full bg-surface border border-border text-xs font-bold text-text-muted shadow-sm">
                        {filteredTasks.length}
                    </span>
                </div>
                <div className="!p-3 sm:!p-4 flex flex-col !gap-3 flex-1 overflow-y-auto max-h-[600px] min-h-[150px]">
                    {filteredTasks.length > 0 ? (
                        filteredTasks.map(task => <TaskCard key={task.id} task={task} />)
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center !p-6 opacity-60">
                            <div className="w-12 h-12 rounded-full border border-dashed border-border flex items-center justify-center !mb-3">
                                <Icon icon="solar:ghost-smile-bold-duotone" className="text-2xl text-text-muted" />
                            </div>
                            <p className="text-sm font-medium text-text-muted">Không có công việc nào</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="animate-fade-in !space-y-6">
            {/* Control Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between !gap-4 bg-surface !p-4 sm:!p-6 rounded-[2rem] border border-border shadow-sm">
                <div className="relative w-full sm:max-w-md">
                    <Icon icon="solar:magnifer-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên công việc..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full !pl-11 !pr-4 !py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-text-main font-medium placeholder:font-normal"
                    />
                </div>
                
                <Button 
                    onClick={() => setIsCreateModalOpen(true)}
                    variant="!primary" 
                    className="w-full sm:w-auto !py-3 !px-6 rounded-xl font-bold flex items-center justify-center !gap-2.5 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all shrink-0"
                >
                    <Icon icon="material-symbols:add-task-rounded" className="text-xl" />
                    Giao việc mới
                </Button>
            </div>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-3 !gap-6 overflow-x-auto !pb-4">
                <Column 
                    title="Cần làm" 
                    status="todo" 
                    icon="material-symbols:format-list-bulleted-rounded" 
                    colorClass="bg-slate-500/10 text-slate-500" 
                    borderClass="border-slate-200 dark:border-slate-800"
                />
                <Column 
                    title="Đang làm" 
                    status="in_progress" 
                    icon="material-symbols:clock-loader-40-outline" 
                    colorClass="bg-amber-500/10 text-amber-500" 
                    borderClass="border-amber-200 dark:border-amber-900/30"
                />
                <Column 
                    title="Đã xong" 
                    status="done" 
                    icon="material-symbols:check-circle-outline-rounded" 
                    colorClass="bg-green-500/10 text-green-500" 
                    borderClass="border-green-200 dark:border-green-900/30"
                />
            </div>

            <CreateTaskModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                onAssign={handleAssignTask}
                tas={tas}
                classes={classes}
            />
        </div>
    );
};

export default TATaskManagementTab;
