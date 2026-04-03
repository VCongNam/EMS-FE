import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAuthStore from '../../../../../../store/authStore';
import AssignmentDetailStudent from './AssignmentDetailStudent';
import AssignmentGradingTeacher from './AssignmentGradingTeacher';
import { assignmentService } from '../../../../api/assignmentService';
import { Icon } from '@iconify/react';

// Giữ lại Mock Submissions vì chưa có API Submissions
const mockSubmissions = [
    { id: 's1', studentId: 'stu1', studentName: 'Vũ Đức Nam', status: 'Đã nộp', submittedAt: '10:30 - 25/03/2026', score: null, files: [{ id: 'f1', name: 'Figma_Link.txt', type: 'doc'}] },
    { id: 's2', studentId: 'stu2', studentName: 'Lê Hữu Nghĩa', status: 'Nộp muộn', submittedAt: '08:15 - 26/03/2026', score: 85, files: [{ id: 'f2', name: 'Bai_lam_Nghia.pdf', type: 'pdf'}] },
    { id: 's3', studentId: 'stu3', studentName: 'Nguyễn Thị C', status: 'Chưa nộp', submittedAt: null, score: null, files: [] }
];

const AssignmentDetailPage = () => {
    const { user } = useAuthStore();
    const { assignmentId } = useParams();
    const [assignment, setAssignment] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const userRole = user?.role?.toUpperCase();
    const isTeacherOrTA = userRole === 'TEACHER' || userRole === 'TA';

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setIsLoading(true);
                const res = await assignmentService.getAssignmentById(assignmentId, user?.token);
                if (res.ok) {
                    const data = await res.json();
                    setAssignment({
                        ...data,
                        submissions: mockSubmissions, // Tạm ghép data giả vào để teacher có cái để chấm
                        maxScore: 100 // Mock maxScore nếu API chưa trả về
                    });
                } else {
                    console.error("Lỗi lấy chi tiết bài tập");
                }
            } catch (error) {
                console.error("Lỗi mạng:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetail();
    }, [assignmentId, user?.token]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-primary">
                <Icon icon="solar:spinner-linear" className="animate-spin text-5xl !mb-4" />
                <p className="font-bold text-lg">Đang tải nội dung bài tập...</p>
            </div>
        );
    }

    if (!assignment) {
        return <div className="text-center !py-20 text-text-muted">Không tìm thấy bài tập này.</div>;
    }

    if (isTeacherOrTA) {
        return <AssignmentGradingTeacher assignment={assignment} />;
    }

    return <AssignmentDetailStudent assignment={assignment} />;
};

export default AssignmentDetailPage;
