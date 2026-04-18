import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import useAuthStore from '../../../store/authStore';
import TaskDetailModal from '../components/TaskDetailModal';
import { taService } from '../api/taService';
import Pagination from '../../../components/ui/Pagination';

const MyTasksPage = () => {
    const { user } = useAuthStore();
    const [selectedTask, setSelectedTask] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const fetchTasks = async () => {
        const effectiveTaId = user?.taId || user?.id;
        if (!effectiveTaId || !user?.token) {
            setIsLoading(false);
            return;
        }
        
        try {
            setIsLoading(true);
            const res = await taService.getMyTasks(effectiveTaId, user.token);
            if (res.ok) {
                const json = await res.json();
                const rawTasks = json.data || (Array.isArray(json) ? json : []);
                
                const mappedTasks = rawTasks.map(t => {
                    const status = t.status || 'Todo';
                    return {
                        id: t.taTaskID || t.id,
                        title: t.title,
                        assignedTo: user.taId,
                        classId: t.className,
                        deadline: t.dueDate,
                        status: status,
                        type: t.type,
                        feedback: t.feedback || ''
                    };
                });
                setTasks(mappedTasks);
            }
        } catch (error) {
            console.error("Error fetching TA tasks:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [user?.taId]);

    const handleUpdateStatus = async (taskId, newStatus) => {
        if (!user?.token) return;
        try {
            const res = await taService.updateTaskStatus(taskId, newStatus, user.token);
            if (res.ok) {
                setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
                if (selectedTask?.id === taskId) {
                    setSelectedTask(prev => ({ ...prev, status: newStatus }));
                }
            }
        } catch (error) {
            console.error("Lỗi cập nhật trạng thái:", error);
        }
    };

    const handleViewDetail = (task) => {
        setSelectedTask(task);
        setIsDetailModalOpen(true);
    };

    const getStatusLabel = (s) => {
        const status = (s || '').toLowerCase();
        switch(status) {
            case 'todo': return 'Cần làm';
            case 'inprogress': 
            case 'in_progress': return 'Đang làm';
            case 'review': return 'Chờ duyệt';
            case 'done': return 'Hoàn thành';
            case 'overdue': return 'Quá hạn';
            case 'rejected': return 'Làm lại';
            default: return status;
        }
    };

    const filteredTasks = useMemo(() => {
        return tasks.filter(t => 
            (t.title || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [tasks, searchQuery]);

    const paginatedTasks = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredTasks.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredTasks, currentPage, itemsPerPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const Column = ({ title, statusGroup, icon, colorClass }) => {
        const columnTasks = paginatedTasks.filter(t => {
            const status = (t.status || '').toLowerCase();
            return statusGroup.includes(status);
        });
        
        return (
            <div className="flex flex-col !bg-background/50 rounded-[2rem] border border-border/50 min-h-[400px]">
                <div className="!p-5 border-b border-border/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${colorClass}`}>
                            <Icon icon={icon} className="text-lg" />
                        </div>
                        <h3 className="font-bold text-text-main shrink-0">{title}</h3>
                    </div>
                </div>
                
                <div className="!p-4 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                    {columnTasks.length > 0 ? (
                        columnTasks.map(task => (
                            <div 
                                key={task.id}
                                onClick={() => handleViewDetail(task)}
                                className="!bg-surface border border-border rounded-2xl !p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group space-y-3"
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <h4 className="font-bold text-sm text-text-main group-hover:text-primary transition-colors leading-snug">
                                        {task.title}
                                    </h4>
                                    <span className={`text-[9px] font-bold !px-1.5 !py-0.5 rounded uppercase border ${
                                        task.status === 'Overdue' ? 'bg-red-50 border-red-200 text-red-600' : 
                                        task.status === 'Rejected' ? 'bg-orange-50 border-orange-200 text-orange-600' :
                                        'bg-background border-border text-text-muted'
                                    }`}>
                                        {getStatusLabel(task.status)}
                                    </span>
                                </div>
                                
                                <div className="flex flex-col !gap-2">
                                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary !bg-primary/5 !px-2 !py-1 rounded-lg border border-primary/10 w-fit">
                                        <Icon icon="material-symbols:school-outline-rounded" />
                                        <span>Lớp: {task.classId}</span>
                                    </div>
                                    {task.type && (
                                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-purple-600 !bg-purple-500/5 !px-2 !py-1 rounded-lg border border-purple-500/10 w-fit">
                                            <Icon icon="solar:tag-linear" />
                                            <span>Loại: {task.type}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between !pt-2 border-t border-border/50">
                                    <div className="flex items-center gap-1.5 text-xs text-text-muted font-medium !bg-background !px-2 !py-1 rounded-lg border border-border/50">
                                        <Icon icon="material-symbols:calendar-today-outline" className="text-primary/70" />
                                        {task.deadline ? new Date(task.deadline).toLocaleDateString('vi-VN', {day:'2-digit', month:'2-digit'}) : 'Chưa có hạn'}
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

            {/* Board */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center !py-40 !gap-4">
                    <Icon icon="solar:spinner-linear" className="animate-spin text-5xl text-primary" />
                    <p className="text-text-muted font-bold">Đang tải nhiệm vụ...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 !gap-6">
                    <Column 
                        title="Làm lại" 
                        statusGroup={['rejected']} 
                        icon="material-symbols:history-rounded" 
                        colorClass="!bg-orange-500/10 text-orange-500" 
                    />
                    <Column 
                        title="Cần làm" 
                        statusGroup={['todo']} 
                        icon="material-symbols:format-list-bulleted-rounded" 
                        colorClass="!bg-slate-500/10 text-slate-500" 
                    />
                    <Column 
                        title="Đang làm" 
                        statusGroup={['inprogress', 'in_progress', 'review']} 
                        icon="material-symbols:calendar-clock" 
                        colorClass="!bg-amber-500/10 text-amber-500" 
                    />
                    <Column 
                        title="Hoàn thành" 
                        statusGroup={['done', 'overdue']} 
                        icon="material-symbols:check-circle-outline-rounded" 
                        colorClass="!bg-green-500/10 text-green-500" 
                    />
                </div>
            )}

            {/* Pagination Controls */}
            {!isLoading && filteredTasks.length > itemsPerPage && (
                <div className="!mt-8 flex justify-center">
                    <Pagination 
                        currentPage={currentPage}
                        totalItems={filteredTasks.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            <TaskDetailModal 
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                task={selectedTask}
                onUpdateStatus={handleUpdateStatus}
                userRole="TA"
            />
        </div>
    );
};

export default MyTasksPage;
