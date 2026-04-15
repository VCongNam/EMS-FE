import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import Button from '../../../components/ui/Button';
import CreateTaskModal from '../components/CreateTaskModal';
import TaskDetailModal from '../components/TaskDetailModal';
import useAuthStore from '../../../store/authStore';
import { taService } from '../api/taService';

const TATaskManagementTab = ({ classId }) => {
    const { user } = useAuthStore();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [tas, setTas] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const loadData = async () => {
        if (!classId || !user?.token) return;
        try {
            setIsLoading(true);
            // 1. Fetch TAs in class
            const taRes = await taService.getTAListByClass(classId, user.token);
            let taList = [];
            if (taRes.ok) {
                const json = await taRes.json();
                taList = json.data || (Array.isArray(json) ? json : []);
                setTas(taList);
            }

            // 2. Fetch Tasks for each TA using the relationship ID
            let allTasks = [];
            for (const ta of taList) {
                // Find classTAID case-insensitively to be robust
                const taKeys = Object.keys(ta);
                const classTAIDKey = taKeys.find(k => k.toLowerCase() === 'classtaid');
                const identifier = classTAIDKey ? ta[classTAIDKey] : ta.taid;
                
                if (!identifier) continue;
                
                try {
                    const taskRes = await taService.getAssignedTasks(identifier, user.token);
                    if (taskRes.ok) {
                        const json = await taskRes.json();
                        // Extract array from { data: [] } or raw []
                        const taTasksList = json.data || (Array.isArray(json) ? json : []);
                        
                        // Append and attach TA info
                        const formattedTasks = taTasksList.map(t => {
                            const status = t.status || 'Todo';

                            return {
                                ...t,
                                assignedTo: ta.taid,
                                assignedToName: ta.fullName || ta.name,
                                id: t.taTaskID || t.id,
                                classId: classId,
                                status: status,
                                deadline: t.dueDate || t.deadline,
                                feedback: t.feedback || ''
                            };
                        });
                        allTasks = [...allTasks, ...formattedTasks];
                    }
                } catch (e) {
                    console.error("Lỗi lấy task của trợ giảng:", identifier, e);
                }
            }

            // 3. Sort tasks by dueDate (ascending)
            allTasks.sort((a, b) => {
                const dateA = new Date(a.deadline || a.dueDate || 0);
                const dateB = new Date(b.deadline || b.dueDate || 0);
                return dateA - dateB;
            });

            setTasks(allTasks);

        } catch (error) {
            console.error('Lỗi khi tải dữ liệu công việc:', error);
            toast.error('Lỗi kết nối máy chủ khi tải danh sách công việc');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [classId, user?.token]);

    const handleReviewTask = async (taskId, isApproved, feedback) => {
        if (!user?.token) return;
        try {
            const payload = { isApproved, feedback };
            const res = await taService.reviewTask(taskId, payload, user.token);
            if (res.ok) {
                toast.success(isApproved ? 'Đã duyệt công việc thành công!' : 'Đã gửi yêu cầu làm lại cho trợ giảng.');
                setIsDetailModalOpen(false);
                loadData(); // Re-fetch to get new status and feedback
            } else {
                const err = await res.json();
                toast.error(err.message || 'Lỗi khi xử lý yêu cầu');
            }
        } catch (e) {
            console.error(e);
            toast.error('Lỗi kết nối máy chủ');
        }
    };


    const TaskCard = ({ task }) => {
        const taName = task.assignedToName || 'Không rõ';
        
        const getStatusStyles = (s) => {
            const status = (s || '').toLowerCase();
            switch(status) {
                case 'inprogress':
                case 'in_progress':
                    return "bg-amber-500/10 text-amber-600 border-amber-200/50";
                case 'review':
                    return "bg-purple-500/10 text-purple-600 border-purple-200/50";
                case 'done':
                    return "bg-green-500/10 text-green-600 border-green-200/50";
                case 'overdue':
                    return "bg-red-500/10 text-red-600 border-red-200/50";
                default:
                    return "bg-slate-500/10 text-slate-600 border-slate-200/50";
            }
        };

        const getStatusLabel = (s) => {
            const status = (s || '').toLowerCase();
            switch(status) {
                case 'inprogress':
                case 'in_progress': return "Đang làm";
                case 'review': return "Chờ duyệt";
                case 'done': return "Đã xong";
                case 'overdue': return "Quá hạn";
                default: return "Cần làm";
            }
        };

        return (
            <div 
                onClick={() => {
                    setSelectedTask(task);
                    setIsDetailModalOpen(true);
                }}
                className="bg-surface rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-primary/30 transition-all !p-4 sm:!p-5 flex flex-col sm:flex-row sm:items-center justify-between !gap-4 group cursor-pointer"
            >
                <div className="flex items-start !gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        task.type === 'Grade' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'
                    }`}>
                        <Icon icon={task.type === 'Grade' ? "solar:pen-new-square-bold-duotone" : "solar:clipboard-list-bold-duotone"} className="text-xl" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center !gap-3 !mb-1">
                            <h4 className="font-bold text-text-main text-base truncate group-hover:text-primary transition-colors">{task.title}</h4>
                            <span className={`!px-2.5 !py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider shrink-0 ${getStatusStyles(task.status)}`}>
                                {getStatusLabel(task.status)}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center !gap-x-4 !gap-y-2 text-sm text-text-muted">
                            <div className="flex items-center !gap-1.5">
                                <Icon icon="solar:user-circle-linear" className="text-primary/70" />
                                <span className="font-medium">{taName}</span>
                            </div>
                            <div className="flex items-center !gap-1.5">
                                <Icon icon="solar:tag-linear" className="text-text-muted/70" />
                                <span>{task.type || 'Nhiệm vụ'}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end !gap-4 shrink-0 sm:border-l border-border/50 sm:!pl-6">
                    <div className="flex flex-col sm:items-end">
                        <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest !mb-0.5">Hạn chót</span>
                        <div className="flex items-center !gap-2 text-sm font-bold text-text-main">
                            <Icon icon="solar:calendar-date-linear" className="text-primary" />
                            {task.deadline ? new Date(task.deadline).toLocaleDateString('vi-VN', {day: '2-digit', month:'2-digit', year: 'numeric'}) : 'Không có'}
                        </div>
                    </div>
                    <button className="w-8 h-8 rounded-lg hover:bg-background flex items-center justify-center text-text-muted hover:text-primary transition-colors">
                        <Icon icon="solar:alt-arrow-right-linear" className="text-lg" />
                    </button>
                </div>
            </div>
        );
    };

    const filteredTasks = tasks.filter(t => (t.title || '').toLowerCase().includes(searchQuery.toLowerCase()));

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

            {/* Tasks List */}
            <div className="bg-background/30 rounded-[2rem] border border-border !p-4 sm:!p-6 min-h-[400px] flex flex-col">
                <div className="flex items-center justify-between !mb-6 !px-2">
                    <div className="flex items-center !gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                            <Icon icon="solar:list-check-bold-duotone" className="text-2xl" />
                        </div>
                        <div>
                            <h3 className="font-bold text-text-main text-lg leading-tight">Danh sách công việc</h3>
                            <p className="text-xs text-text-muted mt-0.5">Tổng số {filteredTasks.length} nhiệm vụ được phân công</p>
                        </div>
                    </div>
                </div>

                <div className="!space-y-4 flex-1">
                    {isLoading ? (
                        <div className="flex-1 flex flex-col items-center justify-center !py-20 text-primary !gap-4">
                            <Icon icon="solar:spinner-linear" className="animate-spin text-4xl" />
                            <span className="font-medium text-text-muted">Đang tải danh sách công việc...</span>
                        </div>
                    ) : filteredTasks.length > 0 ? (
                        filteredTasks.map(task => <TaskCard key={task.id} task={task} />)
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center !py-20 opacity-60">
                            <div className="w-20 h-20 rounded-3xl border-2 border-dashed border-border flex items-center justify-center !mb-4">
                                <Icon icon="solar:ghost-line-duotone" className="text-4xl text-text-muted" />
                            </div>
                            <h4 className="text-lg font-bold text-text-main">Không có công việc nào</h4>
                            <p className="text-sm text-text-muted max-w-[250px] mt-1">Chưa có nhiệm vụ nào được giao hoặc không tìm thấy kết quả phù hợp</p>
                        </div>
                    )}
                </div>
            </div>

            {isCreateModalOpen && (
                <CreateTaskModal 
                    isOpen={isCreateModalOpen} 
                    onClose={() => setIsCreateModalOpen(false)} 
                    onAssign={async (taskData) => {
                        try {
                            const payload = {
                                classTAID: taskData.classTAId || taskData.assignedTo,
                                title: taskData.title,
                                dueDate: taskData.deadline,
                                type: taskData.type || 'Grade'
                            };
                            const res = await taService.createTask(payload, user.token);
                            if (res.ok) {
                                toast.success('Giao việc thành công!');
                                setIsCreateModalOpen(false);
                                loadData();
                            } else {
                                const error = await res.json();
                                toast.error(error.message || 'Lỗi khi giao việc');
                            }
                        } catch (e) {
                            console.error(e);
                            toast.error('Lỗi kết nối máy chủ');
                        }
                    }}
                    tas={tas}
                    classes={[]} 
                />
            )}

            {isDetailModalOpen && (
                <TaskDetailModal
                    isOpen={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                    task={selectedTask}
                    userRole="TEACHER"
                    onReviewTask={handleReviewTask}
                />
            )}
        </div>
    );
};

export default TATaskManagementTab;
