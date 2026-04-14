import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { gradebookService } from '../../../../api/gradebookService';
import useAuthStore from '../../../../../../store/authStore';
import { toast } from 'react-toastify';

const GradeMasterView = ({ classId, gradeTableData, onRefresh }) => {
    const { user } = useAuthStore();
    const [localGrades, setLocalGrades] = useState({}); // { studentId: { assignmentId: newScore } }
    const [isSaving, setIsSaving] = useState(false);

    // Reset local changes when data refreshes
    useEffect(() => {
        setLocalGrades({});
    }, [gradeTableData]);

    const handleScoreChange = (studentId, assignmentId, value) => {
        setLocalGrades(prev => ({
            ...prev,
            [studentId]: {
                ...(prev[studentId] || {}),
                [assignmentId]: value
            }
        }));
    };

    const handleSaveAll = async () => {
        const changes = [];
        Object.entries(localGrades).forEach(([studentId, scores]) => {
            Object.entries(scores).forEach(([assignmentId, grade]) => {
                if (grade !== '' && !isNaN(grade)) {
                    changes.push({
                        studentId,
                        assignmentId,
                        grade: parseFloat(grade)
                    });
                }
            });
        });

        if (changes.length === 0) {
            toast.info("Không có thay đổi nào cần lưu.");
            return;
        }

        try {
            setIsSaving(true);
            const res = await gradebookService.bulkSaveGrades(classId, changes, user?.token);
            if (res.ok) {
                toast.success("Đã lưu bảng điểm thành công!");
                if (onRefresh) onRefresh();
            } else {
                toast.error("Lỗi khi lưu bảng điểm");
            }
        } catch (error) {
            toast.error("Lỗi mạng khi lưu bảng điểm");
        } finally {
            setIsSaving(false);
        }
    };

    const getScore = (student, assignmentId) => {
        // Priority: local edit > server data
        if (localGrades[student.studentId]?.[assignmentId] !== undefined) {
            return localGrades[student.studentId][assignmentId];
        }
        const gradeObj = student.grades.find(g => g.assignmentId === assignmentId);
        return gradeObj?.grade ?? '';
    };

    const hasChanges = Object.keys(localGrades).length > 0;

    return (
        <div className="!flex-1 !flex !flex-col !overflow-hidden !bg-white animate-fade-in">
            {/* Toolbar */}
            <div className="!px-6 !py-3 !bg-background/40 !border-b !border-border !flex !justify-between !items-center !shrink-0">
                <div className="!flex !items-center !gap-4">
                    <div className="!flex !items-center !gap-2 !text-xs !text-text-muted">
                        <Icon icon="material-symbols:info-outline" className="!text-base" />
                        Nhấp vào ô điểm để chỉnh sửa trực tiếp
                    </div>
                </div>
                {hasChanges && (
                    <button 
                        onClick={handleSaveAll}
                        disabled={isSaving}
                        className="!px-4 !py-2 !bg-primary !text-white !rounded-xl !text-sm !font-bold !flex !items-center !gap-2 !shadow-lg !shadow-primary/20 hover:!bg-primary/90 !transition-all disabled:!opacity-50"
                    >
                        {isSaving ? <Icon icon="solar:spinner-linear" className="!animate-spin" /> : <Icon icon="material-symbols:save-rounded" />}
                        Lưu {Object.values(localGrades).reduce((acc, curr) => acc + Object.keys(curr).length, 0)} thay đổi
                    </button>
                )}
            </div>

            {/* Desktop Table View */}
            <div className="!hidden md:!block !overflow-x-auto !overflow-y-auto !flex-1 custom-scrollbar">
                <table className="!w-full !border-collapse !text-sm">
                    <thead className="!sticky !top-0 !z-20 !bg-white">
                        <tr className="!border-b !border-border">
                            <th className="!sticky !left-0 !z-30 !bg-white !p-4 !text-left !font-bold !text-text-main !min-w-[240px] !border-r !border-border">
                                Học sinh
                            </th>
                            {gradeTableData.columns.map((col) => (
                                <th key={col.assignmentId} className="!p-4 !text-center !min-w-[140px] !border-r !border-border !bg-background/20">
                                    <div className="!text-[10px] !font-bold !text-primary !uppercase !tracking-tighter !mb-1">
                                        {col.gradeCategoryName}
                                    </div>
                                    <div className="!font-bold !text-text-main !truncate" title={col.title}>{col.title}</div>
                                    <div className="!text-[10px] !text-text-muted !font-normal">Trọng số: {col.weight}%</div>
                                </th>
                            ))}
                            <th className="!sticky !right-0 !z-30 !bg-background !p-4 !text-center !font-bold !text-primary !min-w-[100px] !border-l !border-border">
                                TB Tổng
                            </th>
                        </tr>
                    </thead>
                    <tbody className="!divide-y !divide-border">
                        {gradeTableData.studentRows.map(student => (
                            <tr key={student.studentId} className="hover:!bg-primary/5 !transition-colors !group">
                                <td className="!sticky !left-0 !z-10 !bg-white group-hover:!bg-primary/5 !p-4 !border-r !border-border !transition-colors">
                                    <div className="!flex !items-center !gap-3 !w-full !text-left">
                                        <div className="!w-8 !h-8 !rounded-full !bg-primary/10 !flex !items-center !justify-center !text-primary !font-bold !text-xs">
                                            {student.studentName?.charAt(0)}
                                        </div>
                                        <div className="!flex-1 !min-w-0">
                                            <div className="!font-semibold !text-text-main !truncate">{student.studentName}</div>
                                        </div>
                                    </div>
                                </td>
                                {gradeTableData.columns.map((col) => {
                                    const score = getScore(student, col.assignmentId);
                                    const isEdited = localGrades[student.studentId]?.[col.assignmentId] !== undefined;
                                    return (
                                        <td key={col.assignmentId} className="!p-2 !text-center !border-r !border-border">
                                            <input 
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="10"
                                                value={score}
                                                onChange={(e) => handleScoreChange(student.studentId, col.assignmentId, e.target.value)}
                                                className={`!w-full !bg-transparent !border-none !text-center !py-2 !font-bold !focus:outline-none !rounded-lg !transition-all ${
                                                    isEdited ? '!bg-amber-100/50 !text-amber-700' : '!text-text-main group-hover:!bg-white/50'
                                                }`}
                                            />
                                        </td>
                                    );
                                })}
                                <td className="!sticky !right-0 !z-10 !bg-white group-hover:!bg-primary/5 !p-4 !text-center !font-bold !border-l !border-border !transition-colors">
                                    <span className={student.finalAverage >= 8 ? 'text-emerald-600' : student.finalAverage < 5 ? 'text-red-500' : 'text-primary'}>
                                        {student.finalAverage?.toFixed(1) || '--'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Legend / Stats Footer */}
            <div className="!p-4 !bg-background !border-t !border-border !flex !flex-col sm:!flex-row !items-center !justify-between !text-[10px] sm:!text-xs !text-text-muted !gap-3">
                <div className="!flex !items-center !gap-4 sm:!gap-6">
                    <div className="!flex !items-center !gap-2">
                        <div className="!w-2.5 !h-2.5 !rounded-full !bg-emerald-500"></div>
                        <span>Giỏi {'(>= 8.0)'}</span>
                    </div>
                    <div className="!flex !items-center !gap-2">
                        <div className="!w-2.5 !h-2.5 !rounded-full !bg-primary"></div>
                        <span>Khá (5.0 - 7.9)</span>
                    </div>
                    <div className="!flex !items-center !gap-2">
                        <div className="!w-2.5 !h-2.5 !rounded-full !bg-red-500"></div>
                        <span>Yếu {'(< 5.0)'}</span>
                    </div>
                </div>
                <div className="!font-bold !uppercase !tracking-widest">Học sinh: {gradeTableData.studentRows.length} | Cột điểm: {gradeTableData.columns.length}</div>
            </div>
        </div>
    );
};

export default GradeMasterView;
