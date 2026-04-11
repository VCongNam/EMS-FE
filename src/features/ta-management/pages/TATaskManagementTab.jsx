import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import Button from '../../../components/ui/Button';
import CreateTaskModal from '../components/CreateTaskModal';
import useAuthStore from '../../../store/authStore';
import { taService } from '../api/taService';

const TATaskManagementTab = ({ classId }) => {
    const { user } = useAuthStore();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [tas, setTas] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = async () => {
        if (!classId || !user?.token) return;
        try {
            setIsLoading(true);
            // 1. Fetch TAs
            const taRes = await taService.getTAListByClass(classId, user.token);
            let taList = [];
            if (taRes.ok) {
                const dataRaw = await taRes.json();
                taList = Array.isArray(dataRaw) ? dataRaw : (dataRaw?.data && Array.isArray(dataRaw.data) ? dataRaw.data : []);
                setTas(taList);
            }

            // 2. Fetch Tasks for each TA
            let allTasks = [];
            for (const ta of taList) {
                const identifier = ta.classTAId || ta.classTaId || ta.taid;
                if (!identifier) continue;
                
                try {
                    const taskRes = await taService.getAssignedTasks(identifier, user.token);
                    if (taskRes.ok) {
                        const taTasks = await taskRes.json();
                        // Append and attach TA info so we can display it
                        const formattedTasks = Array.isArray(taTasks) ? taTasks.map(t => ({
                            ...t,
                            assignedTo: ta.taid,
                            assignedToName: ta.fullName || ta.name,
                            id: t.taTaskID || t.id,
                            status: t.status ? t.status.toLowerCase() : 'todo',
                            deadline: t.dueDate || t.deadline
                        })) : [];
                        allTasks = [...allTasks, ...formattedTasks];
                    }
                } catch (e) {
                    console.error("Lỗi lấy task của TA", identifier, e);
                }
            }
            setTasks(allTasks);

        } catch (error) {
            console.error('Lỗi khi tải dữ liệu công việc:', error);
            toast.error('Lỗi kết nối máy chủ');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [classId, user?.token]);

    const handleAssignTask = async (taskData) => {
        try {
            // map frontend data to API payload
            const payload = {
                classTAId: taskData.classTAId || taskData.assignedTo,
                title: taskData.title,
                dueDate: taskData.deadline,
                type: taskData.type || 'Chấm điểm'
            };
            
            const res = await taService.createTask(payload, user.token);
            if (res.ok) {
                toast.success('Giao việc thành công!');
                setIsCreateModalOpen(false);
                loadData(); // Re-fetch all tasks
            } else {
                const error = await res.json();
                toast.error(error.message || 'Lỗi khi giao việc');
            }
        } catch (e) {
            console.error(e);
            toast.error('Lỗi kết nối máy chủ');
        }
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
        const taName = task.assignedToName || 'Không rõ';

        return (
            <div className="bg-surface rounded-2xl border border-border flex-shrink-0 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group !p-4 flex flex-col !gap-3">
                <div className="flex justify-between items-start !gap-2">
                    <h4 className="font-bold text-text-main text-sm leading-snug group-hover:text-primary transition-colors">{task.title}</h4>
                    {task.priority && getPriorityBadge(task.priority)}
                </div>
                
                <div className="!pt-3 border-t border-border/50 flex items-center justify-between !gap-2 mt-auto">
                    <div className="flex items-center !gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-500/15 text-purple-600 flex items-center justify-center text-[10px] font-bold uppercase ring-2 ring-background">
                            {taName.charAt(0)}
                        </div>
                        <span className="text-xs font-medium text-text-muted truncate max-w-[80px]">{taName}</span>
                    </div>
                    <div className="flex items-center !gap-1.5 text-xs font-medium text-text-muted bg-background !px-2 !py-1 rounded border border-border/50">
                        <Icon icon="material-symbols:calendar-today-outline" className="text-primary/70" />
                        {task.deadline ? new Date(task.deadline).toLocaleDateString('vi-VN', {day: '2-digit', month:'2-digit'}) : 'No date'}
                    </div>
                </div>
            </div>
        );
    };

    const Column = ({ title, status, icon, colorClass, borderClass }) => {
        const filteredTasks = tasks.filter(t => t.status === status && (t.title || '').toLowerCase().includes(searchQuery.toLowerCase()));
        
        return (
            <div className={`bg-background/50 rounded-[2rem] border ${borderClass} flex flex-col min-w-[300px] sm:min-w-0 max-h-full`}>
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
                <div className="!p-3 sm:!p-4 flex flex-col !gap-3 flex-1 overflow-y-auto max-h-[600px] min-h-[150px] custom-scrollbar">
                    {isLoading ? (
                        <div className="flex-1 flex items-center justify-center text-primary">
                            <Icon icon="solar:spinner-linear" className="animate-spin text-2xl" />
                        </div>
                    ) : filteredTasks.length > 0 ? (
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
            <div className="grid grid-cols-1 md:grid-cols-3 !gap-6 overflow-x-auto !pb-4 min-h-[400px]">
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

            {isCreateModalOpen && (
                <CreateTaskModal 
                    isOpen={isCreateModalOpen} 
                    onClose={() => setIsCreateModalOpen(false)} 
                    onAssign={handleAssignTask}
                    tas={tas}
                    classes={null} // Removed mock classes
                />
            )}
        </div>
    );
};

export default TATaskManagementTab;
