import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuthStore from '../../../../../store/authStore';
import { assignmentService } from '../../../api/assignmentService';
import { toast } from 'react-toastify';
import ConfirmModal from '../../../../../components/ui/ConfirmModal';

const ClassworkPage = () => {
    const { user } = useAuthStore();
    const { classId } = useParams();
    const navigate = useNavigate();
    
    // RBAC check
    const userRole = user?.role?.toUpperCase();
    const isTeacherOrTA = userRole === 'TEACHER' || userRole === 'TA';

    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, assignmentId: null });

    useEffect(() => {
        const fetchAssignments = async () => {
            if (!classId) return;
            try {
                setIsLoading(true);
                const res = await assignmentService.getAssignmentsByClass(classId, user?.token);
                if (res.ok) {
                    const data = await res.json();
                    // data từ API trả về mảng trực tiếp: [{assignmentId, title, dueDate, status}]
                    if (Array.isArray(data)) {
                        setAssignments(data);
                    } else if (data.data) {
                        setAssignments(data.data);
                    }
                } else {
                    console.error("Lỗi API khi tải bài tập");
                }
            } catch (err) {
                console.error("Lỗi mạng khi tải bài tập:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAssignments();
    }, [classId, user?.token]);

    const handleDeleteClick = (e, id) => {
        e.stopPropagation();
        setConfirmModal({ isOpen: true, assignmentId: id });
    };

    const handleConfirmDelete = async () => {
        const id = confirmModal.assignmentId;
        if (!id) return;

        try {
            const res = await assignmentService.deleteAssignment(id, user?.token);
            if (res.ok) {
                toast.success('Xóa bài tập thành công!');
                setAssignments(prev => prev.filter(a => (a.assignmentId || a.id) !== id));
            } else {
                toast.error('Có lỗi xảy ra khi xóa bài tập.');
            }
        } catch (err) {
            console.error(err);
            toast.error('Lỗi khi xóa bài tập.');
        } finally {
            setConfirmModal({ isOpen: false, assignmentId: null });
        }
    };

    const formattedAssignments = assignments.map(a => {
        const dDate = new Date(a.dueDate);
        const isOverdue = !isNaN(dDate) && dDate < new Date();
        return {
            id: a.assignmentId,
            title: a.title || 'Chưa có tiêu đề',
            dueDateDisplay: isNaN(dDate) ? 'Không xác định' : dDate.toLocaleString('vi-VN', {
               hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
            }),
            status: a.status || 'Published',
            isOverdue: isOverdue
        };
    });

    return (
        <div className="!space-y-6 animate-fade-in-up">
            {/* Header / Actions */}
            <div className="bg-surface rounded-2xl border border-border !p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-text-main !mb-1">Bài tập trên lớp</h2>
                    <p className="text-text-muted text-sm">Theo dõi hạn nộp và làm bài tập</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    {!isTeacherOrTA && (
                        <button className="flex items-center gap-2 font-semibold text-primary hover:!bg-primary/10 transition-colors !px-4 !py-2 rounded-xl">
                            <Icon icon="material-symbols:person-rounded" className="text-xl" />
                            Xem bài tập của bạn
                        </button>
                    )}

                    {isTeacherOrTA && (
                        <button 
                            onClick={() => navigate(`../create-assignment`, { relative: 'path' })}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 !bg-primary text-white font-semibold !px-6 !py-2.5 rounded-xl hover:!bg-primary-hover transition-colors shadow-sm shadow-primary/20"
                        >
                            <Icon icon="material-symbols:add-rounded" className="text-xl" />
                            Tạo bài tập
                        </button>
                    )}
                </div>
            </div>

            {/* Assignments List */}
            {isLoading ? (
                <div className="flex justify-center items-center py-10">
                    <Icon icon="solar:spinner-linear" className="animate-spin text-3xl text-primary" />
                </div>
            ) : formattedAssignments.length > 0 ? (
                <div className="!space-y-4">
                    <div className="!space-y-3">
                        {formattedAssignments.map(assignment => (
                            <div 
                                onClick={() => navigate(`../assignment/${assignment.id}`, { relative: 'path' })}
                                key={assignment.id} 
                                className="!bg-surface rounded-2xl border !border-border !p-4 hover:!bg-surface-hover hover:!border-primary/50 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-sm"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full !bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:!bg-primary group-hover:text-white transition-colors">
                                        <Icon icon="material-symbols:assignment-rounded" className="text-2xl text-primary group-hover:text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-text-main text-lg group-hover:text-primary transition-colors">{assignment.title}</h4>
                                        <p className="text-sm text-text-muted mt-1">Trạng thái: <span className="font-medium">{assignment.status}</span></p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/3">
                                    {!isTeacherOrTA && (
                                        <span className={`text-sm font-semibold !px-3 !py-1 rounded-full ${
                                            assignment.status === 'Đã nộp' ? '!bg-green-500/10 text-green-600' : '!bg-orange-500/10 text-orange-600'
                                        }`}>
                                            {assignment.status}
                                        </span>
                                    )}
                                    <div className="text-right flex-shrink-0">
                                        <p className="text-sm text-text-main font-semibold">Đến hạn</p>
                                        <p className={`text-sm ${assignment.isOverdue ? 'text-red-500 font-bold' : 'text-text-muted'}`}>{assignment.dueDateDisplay}</p>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity mt-2 sm:mt-0">
                                        {isTeacherOrTA && (
                                            <>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); navigate(`../edit-assignment/${assignment.id}`, { relative: 'path' }); }}
                                                    className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Icon icon="material-symbols:edit-outline-rounded" className="text-xl" />
                                                </button>
                                                <button 
                                                    onClick={(e) => handleDeleteClick(e, assignment.id)}
                                                    className="p-1.5 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Xóa"
                                                >
                                                    <Icon icon="material-symbols:delete-outline-rounded" className="text-xl" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="!bg-surface rounded-2xl border !border-border !p-12 shadow-sm text-center">
                    <div className="w-20 h-20 rounded-full !bg-primary/10 flex items-center justify-center mx-auto !mb-4">
                         <Icon icon="material-symbols:assignment-add-outline-rounded" className="text-4xl text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-text-main !mb-2">Chưa có bài tập nào</h3>
                    <p className="text-text-muted">
                        {isTeacherOrTA ? 'Nhấp vào nút "Tạo bài tập" để giao bài cho lớp.' : 'Giáo viên chưa giao bài tập nào cho lớp.'}
                    </p>
                 </div>
            )}

            <ConfirmModal 
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, assignmentId: null })}
                onConfirm={handleConfirmDelete}
                title="Xác nhận xóa bài tập"
                message="Bạn có chắc chắn muốn xóa bài tập này không? Hành động này không thể hoàn tác."
                confirmText="Xóa bài tập"
                cancelText="Hủy bỏ"
                type="danger"
            />
        </div>
    );
};

export default ClassworkPage;
