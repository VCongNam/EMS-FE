import React from 'react';
import { Icon } from '@iconify/react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuthStore from '../../../../../store/authStore';

const mockAssignments = [
    {
        id: 'a1',
        title: 'Bài tập 1: Thiết kế giao diện figma',
        topic: 'Chương 1: Tổng quan',
        dueDate: 'Ngày mai, 23:59',
        postedDate: '2026-03-24',
        status: 'Chưa làm', // Mock field for student
        maxScore: 100,
        isOverdue: false
    },
    {
        id: 'a2',
        title: 'Quiz 1: Ôn tập chương 1',
        topic: 'Chương 1: Tổng quan',
        dueDate: '2026-03-20, 12:00',
        postedDate: '2026-03-15',
        status: 'Đã nộp',
        maxScore: 10,
        isOverdue: true
    },
    {
        id: 'a3',
        title: 'Đọc trước tài liệu Requirement Analysis',
        topic: 'Chương 2: Phân tích yêu cầu',
        dueDate: 'Không có ngày đến hạn',
        postedDate: '2026-03-24',
        status: 'Chưa làm',
        maxScore: 100,
        isOverdue: false
    }
];

const ClassworkPage = () => {
    const { user } = useAuthStore();
    const { classId } = useParams();
    const navigate = useNavigate();
    
    // RBAC check
    const userRole = user?.role?.toUpperCase();
    const isTeacherOrTA = userRole === 'TEACHER' || userRole === 'TA';

    // Group by topic
    const groupedAssignments = mockAssignments.reduce((acc, assignment) => {
        if (!acc[assignment.topic]) acc[assignment.topic] = [];
        acc[assignment.topic].push(assignment);
        return acc;
    }, {});

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
                        <button className="flex items-center gap-2 font-semibold text-primary hover:    !bg-primary/10 transition-colors !px-4 !py-2 rounded-xl">
                            <Icon icon="material-symbols:person-rounded" className="text-xl" />
                            Xem bài tập của bạn
                        </button>
                    )}

                    {isTeacherOrTA && (
                        <button 
                            onClick={() => navigate(`../create-assignment`, { relative: 'path' })}
                            className="w-full sm:w-auto flex items-center justify-center gap-2  !bg-primary text-white font-semibold !px-6 !py-2.5 rounded-xl hover:  !bg-primary-hover transition-colors shadow-sm shadow-primary/20"
                        >
                            <Icon icon="material-symbols:add-rounded" className="text-xl" />
                            Tạo bài tập
                        </button>
                    )}
                </div>
            </div>

            {/* Assignments List */}
            <div className="!space-y-8">
                {Object.keys(groupedAssignments).map(topic => (
                    <div key={topic} className="!space-y-4">
                        <div className="flex items-center justify-between !border-b-2 !border-primary/20 !pb-2">
                            <h3 className="text-xl font-bold text-primary">{topic}</h3>
                        </div>
                        
                        <div className="!space-y-3">
                            {groupedAssignments[topic].map(assignment => (
                                <div 
                                    onClick={() => navigate(`../assignment/${assignment.id}`, { relative: 'path' })}
                                    key={assignment.id} 
                                    className=" !bg-surface rounded-2xl border !border-border !p-4 hover:  !bg-surface-hover hover:!border-primary/50 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-sm"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full  !bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:    !bg-primary group-hover:text-white transition-colors">
                                            <Icon icon="material-symbols:assignment-rounded" className="text-2xl text-primary group-hover:text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-text-main text-lg group-hover:text-primary transition-colors">{assignment.title}</h4>
                                            <p className="text-sm text-text-muted mt-1">Đã đăng: {assignment.postedDate}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/3">
                                        {!isTeacherOrTA && (
                                            <span className={`text-sm font-semibold !px-3 !py-1 rounded-full ${
                                                assignment.status === 'Đã nộp' ? '  !bg-green-500/10 text-green-600' : '   !bg-orange-500/10 text-orange-600'
                                            }`}>
                                                {assignment.status}
                                            </span>
                                        )}
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-sm text-text-main font-semibold">Đến hạn</p>
                                            <p className={`text-sm ${assignment.isOverdue ? 'text-red-500 font-bold' : 'text-text-muted'}`}>{assignment.dueDate}</p>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity mt-2 sm:mt-0">
                                            {isTeacherOrTA && !assignment.isOverdue && (
                                                <>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); navigate(`../edit-assignment/${assignment.id}`, { relative: 'path' }); }}
                                                        className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                        title="Chỉnh sửa"
                                                    >
                                                        <Icon icon="material-symbols:edit-outline-rounded" className="text-xl" />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); /* delete logic */ }}
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
                ))}
            </div>
            
            {Object.keys(groupedAssignments).length === 0 && (
                 <div className="   !bg-surface rounded-2xl border !border-border !p-12 shadow-sm text-center">
                    <div className="w-20 h-20 rounded-full  !bg-primary/10 flex items-center justify-center mx-auto !mb-4">
                         <Icon icon="material-symbols:assignment-add-outline-rounded" className="text-4xl text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-text-main !mb-2">Chưa có bài tập nào</h3>
                    <p className="text-text-muted">
                        {isTeacherOrTA ? 'Nhấp vào nút "Tạo bài tập" để giao bài cho lớp.' : 'Giáo viên chưa giao bài tập nào cho lớp.'}
                    </p>
                 </div>
            )}
        </div>
    );
};

export default ClassworkPage;
