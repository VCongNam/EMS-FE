import React from 'react';
import { useParams } from 'react-router-dom';
import useAuthStore from '../../../../../../store/authStore';
import AssignmentDetailStudent from './AssignmentDetailStudent';
import AssignmentGradingTeacher from './AssignmentGradingTeacher';

// Move mock data to a shared place later, but for now we put it here to pass to both
export const mockAssignmentDetail = {
    id: 'a1',
    title: 'Bài tập 1: Thiết kế giao diện figma',
    description: 'Dựa vào yêu cầu dự án trong buổi học, các bạn hãy thiết kế giao diện Figma cho phân hệ Đăng nhập và Đăng ký. Nộp link Figma tại đây (nhớ mở quyền Viewer).',
    topic: 'Chương 1: Tổng quan',
    dueDate: '23:59 - 25/03/2026',
    postedDate: '24/03/2026',
    maxScore: 100,
    isOverdue: false,
    author: 'Nguyễn Văn A',
    attachments: [
        { id: '1', name: 'Yeu_cau_du_an.pdf', type: 'pdf', size: '1.2 MB' }
    ],
    // For Grading mock
    submissions: [
        { id: 's1', studentId: 'stu1', studentName: 'Vũ Đức Nam', status: 'Đã nộp', submittedAt: '10:30 - 25/03/2026', score: null, files: [{ id: 'f1', name: 'Figma_Link.txt', type: 'doc'}] },
        { id: 's2', studentId: 'stu2', studentName: 'Lê Hữu Nghĩa', status: 'Nộp muộn', submittedAt: '08:15 - 26/03/2026', score: 85, files: [{ id: 'f2', name: 'Bai_lam_Nghia.pdf', type: 'pdf'}] },
        { id: 's3', studentId: 'stu3', studentName: 'Nguyễn Thị C', status: 'Chưa nộp', submittedAt: null, score: null, files: [] }
    ]
};

const AssignmentDetailPage = () => {
    const { user } = useAuthStore();
    const { assignmentId } = useParams();

    const userRole = user?.role?.toUpperCase();
    const isTeacherOrTA = userRole === 'TEACHER' || userRole === 'TA';

    // In a real app we fetch assignment data here by assignmentId
    const assignment = mockAssignmentDetail;

    if (isTeacherOrTA) {
        return <AssignmentGradingTeacher assignment={assignment} />;
    }

    return <AssignmentDetailStudent assignment={assignment} />;
};

export default AssignmentDetailPage;
