import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAuthStore from '../../../../../../store/authStore';
import AssignmentDetailStudent from './AssignmentDetailStudent';
import AssignmentGradingTeacher from './AssignmentGradingTeacher';
import { assignmentService } from '../../../../api/assignmentService';
import { studentAssignmentService } from '../../../../api/studentAssignmentService';
import { Icon } from '@iconify/react';


const AssignmentDetailPage = () => {
    const { user } = useAuthStore();
    const { assignmentId } = useParams();
    const [assignment, setAssignment] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const userRole = user?.role?.toUpperCase();
    const isTeacherOrTA = userRole === 'TEACHER' || userRole === 'TA';

    const fetchDetail = async () => {
        try {
            setIsLoading(true);
            const [assignmentRes, submissionsRes] = await Promise.all([
                isTeacherOrTA 
                    ? assignmentService.getAssignmentById(assignmentId, user?.token)
                    : studentAssignmentService.getAssignmentDetail(assignmentId, user?.token),
                isTeacherOrTA
                    ? assignmentService.getSubmissions(assignmentId, user?.token)
                    : Promise.resolve(null)
            ]);

            if (assignmentRes.ok) {
                const result = await assignmentRes.json();
                const data = result.data || result;
                
                let fetchedSubmissions = [];
                if (submissionsRes && submissionsRes.ok) {
                    const subResult = await submissionsRes.json();
                    // Based on provided format: { students: [...] }
                    fetchedSubmissions = subResult.data?.students || subResult.students || [];
                }

                setAssignment({
                    ...data,
                    submissions: fetchedSubmissions,
                    maxScore: data.maxScore || 10
                });
            } else {
                console.error("Lỗi lấy chi tiết bài tập:", assignmentRes.status);
            }
        } catch (error) {
            console.error("Lỗi mạng:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [assignmentId, user?.token, isTeacherOrTA]);

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
        return <AssignmentGradingTeacher assignment={assignment} onRefresh={fetchDetail} />;
    }

    return <AssignmentDetailStudent assignment={assignment} onRefresh={fetchDetail} />;
};

export default AssignmentDetailPage;
