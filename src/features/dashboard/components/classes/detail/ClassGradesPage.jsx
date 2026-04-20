import React, { useState, useEffect } from 'react';
import useAuthStore from '../../../../../store/authStore';
import GradeMasterView from './grades/GradeMasterView';
import GradeSettingsView from './grades/GradeSettingsView';
import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';
import { gradebookService } from '../../../api/gradebookService';
import { toast } from 'react-toastify';

// ─── Student Grades View ───────────────────────────────────────────────────────
const StudentGradesView = ({ classId, token }) => {
    const [gradesData, setGradesData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyGrades = async () => {
            setLoading(true);
            try {
                const res = await gradebookService.getStudentGrades(classId, token);
                if (res.ok) {
                    const data = await res.json();
                    setGradesData(data);
                } else {
                    toast.error('Không thể tải bảng điểm');
                }
            } catch (err) {
                console.error(err);
                toast.error('Lỗi kết nối khi tải bảng điểm');
            } finally {
                setLoading(false);
            }
        };
        if (classId && token) fetchMyGrades();
    }, [classId, token]);

    if (loading) {
        return (
            <div className="flex-1 flex flex-col gap-4 !p-6 animate-pulse">
                {[1, 2].map(i => (
                    <div key={i} className="h-40 bg-background rounded-2xl border border-border" />
                ))}
            </div>
        );
    }

    if (!gradesData) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-text-muted !p-10 text-center gap-4">
                <Icon icon="solar:sad-circle-bold-duotone" className="text-6xl opacity-20" />
                <p className="font-medium">Chưa có dữ liệu điểm số</p>
            </div>
        );
    }

    const avg = gradesData.currentAverageScore ?? null;
    const avgColor = avg === null ? 'text-text-muted' : avg >= 8 ? 'text-emerald-600' : avg >= 5 ? 'text-amber-600' : 'text-red-600';
    const avgBg = avg === null ? 'bg-background' : avg >= 8 ? 'bg-emerald-50 border-emerald-200' : avg >= 5 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200';

    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar !p-6 !space-y-6 animate-fade-in-up">
            {/* Average Score Banner */}
            <div className={`flex items-center justify-between !p-5 rounded-2xl border ${avgBg}`}>
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Icon icon="solar:chart-2-bold-duotone" className="text-3xl" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Điểm trung bình hiện tại</p>
                        <p className="text-sm text-text-muted mt-0.5">Tổng hợp từ tất cả các cột điểm</p>
                    </div>
                </div>
                <div className={`text-4xl font-black ${avgColor}`}>
                    {avg !== null ? avg.toFixed(2) : '--'}
                    <span className="text-lg text-text-muted font-normal"> / 10</span>
                </div>
            </div>

            {/* Grade Report Table by Category */}
            {(gradesData.gradeReportTable || []).map((category, idx) => {
                const catAvg = category.categoryScore ?? null;
                return (
                    <div key={idx} className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
                        {/* Category Header */}
                        <div className="!px-6 !py-4 bg-background/50 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Icon icon="solar:folder-bold-duotone" className="text-base" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-main">{category.categoryName}</h3>
                                    <p className="text-xs text-text-muted">Trọng số: {category.weight}%</p>
                                </div>
                            </div>
                            {/* Category score badge */}
                            <div className={`flex flex-col items-end`}>
                                <p className="text-xs text-text-muted font-semibold uppercase tracking-wider">Điểm cột</p>
                                <span className={`text-xl font-black ${catAvg === null ? 'text-text-muted' :
                                    catAvg >= 8 ? 'text-emerald-600' :
                                        catAvg >= 5 ? 'text-amber-600' : 'text-red-600'
                                    }`}>
                                    {catAvg !== null ? catAvg.toFixed(2) : '--'}
                                    <span className="text-sm text-text-muted font-normal"> / 10</span>
                                </span>
                            </div>
                        </div>

                        {/* Assignments in this category */}
                        <div className="divide-y divide-border">
                            {(category.assignments || []).map((assignment, aIdx) => {
                                const score = assignment.score;
                                const hasScore = score !== null && score !== undefined;
                                const scoreColor = !hasScore ? 'text-text-muted'
                                    : score >= 8 ? 'text-emerald-600'
                                        : score >= 5 ? 'text-amber-600'
                                            : 'text-red-600';
                                const scoreBg = !hasScore ? 'bg-background'
                                    : score >= 8 ? 'bg-emerald-50 border-emerald-200'
                                        : score >= 5 ? 'bg-amber-50 border-amber-200'
                                            : 'bg-red-50 border-red-200';

                                return (
                                    <div key={assignment.assignmentId} className="!px-6 !py-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-background/30 transition-colors">
                                        {/* Assignment Title */}
                                        <div className="flex-1 min-w-0 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0">
                                                <Icon icon="solar:document-text-bold-duotone" className="text-sm" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-text-main text-sm truncate">{assignment.title}</p>
                                                <p className="text-[11px] text-text-muted truncate">
                                                    ID: {assignment.assignmentId?.substring(0, 8)}...
                                                </p>
                                            </div>
                                        </div>

                                        {/* Feedback */}
                                        <div className="sm:w-1/3">
                                            {assignment.commentFeedback && assignment.commentFeedback !== 'Chưa có nhận xét' ? (
                                                <div className="bg-blue-50 border border-blue-200 rounded-xl !px-3 !py-2">
                                                    <p className="text-[11px] font-bold text-blue-700 uppercase tracking-wider mb-1">Nhận xét</p>
                                                    <p className="text-xs text-blue-800 line-clamp-2">{assignment.commentFeedback}</p>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-text-muted italic">Chưa có nhận xét</p>
                                            )}
                                        </div>

                                        {/* Score */}
                                        <div className={`shrink-0 flex items-center justify-center w-20 h-12 rounded-xl border font-black text-xl ${scoreBg} ${scoreColor}`}>
                                            {hasScore ? score.toFixed(1) : '--'}
                                        </div>
                                    </div>
                                );
                            })}

                            {(!category.assignments || category.assignments.length === 0) && (
                                <div className="!px-6 !py-6 text-center text-text-muted text-sm italic">
                                    Chưa có bài tập nào trong nhóm này
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}

            {(!gradesData.gradeReportTable || gradesData.gradeReportTable.length === 0) && (
                <div className="flex flex-col items-center justify-center py-20 text-text-muted opacity-50 gap-4">
                    <Icon icon="solar:notebook-bold-duotone" className="text-6xl" />
                    <p className="font-medium">Chưa có bảng điểm nào</p>
                </div>
            )}
        </div>
    );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
const ClassGradesPage = () => {
    const { user } = useAuthStore();
    const role = user?.role?.toUpperCase() || 'STUDENT';
    const isStudent = role === 'STUDENT';
    const { classId } = useParams();

    const [activeTab, setActiveTab] = useState(isStudent ? 'individual' : 'overview');
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const [gradeTableData, setGradeTableData] = useState(null);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [isLoadingTable, setIsLoadingTable] = useState(true);
    const [tableError, setTableError] = useState(false);

    const fetchCategories = async () => {
        try {
            setIsLoadingCategories(true);
            const res = await gradebookService.getGradeCategories(classId, user?.token);
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error("Lỗi mạng:", error);
        } finally {
            setIsLoadingCategories(false);
        }
    };

    const fetchGradeTable = async () => {
        try {
            setIsLoadingTable(true);
            setTableError(false);
            const res = await gradebookService.getGradeTable(classId, user?.token);
            if (res.ok) {
                const data = await res.json();
                setGradeTableData(data);
                if (!selectedStudentId && data.studentRows?.length > 0) {
                    setSelectedStudentId(data.studentRows[0].studentId);
                }
            } else {
                console.error('Grade table API error:', res.status);
                setTableError(true);
            }
        } catch (error) {
            console.error("Lỗi mạng:", error);
            setTableError(true);
        } finally {
            setIsLoadingTable(false);
        }
    };

    const refreshAll = () => {
        fetchCategories();
        fetchGradeTable();
    };

    useEffect(() => {
        // Student uses their own API, no need to fetch teacher table data
        if (classId && !isStudent) {
            refreshAll();
        }
    }, [classId, user?.token, activeTab, isStudent]);

    const filteredStudents = gradeTableData?.studentRows?.filter(s =>
        s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const activeStudent = gradeTableData?.studentRows?.find(s => s.studentId === selectedStudentId);

    const handleExport = async (type) => {
        try {
            toast.info(`Đang tạo file ${type.toUpperCase()}...`);
            const res = type === 'excel'
                ? await gradebookService.exportToExcel(classId, user?.token)
                : await gradebookService.exportToPdf(classId, user?.token);

            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Gradebook_${classId}_${new Date().toLocaleDateString()}.${type === 'excel' ? 'xlsx' : 'pdf'}`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                toast.success(`Xuất file ${type.toUpperCase()} thành công!`);
            } else {
                toast.error("Xuất file thất bại");
            }
        } catch (error) {
            toast.error("Lỗi mạng khi xuất file");
        }
    };

    const renderHeader = () => (
        <div className="!flex !flex-col sm:!flex-row !items-start sm:!items-center !justify-between !px-4 sm:!px-6 !py-4 border-b border-border !gap-4 !bg-white">
            <div className="!flex !flex-col sm:!flex-row !items-start sm:!items-center !gap-4 !w-full sm:!w-auto">
                <h2 className="!text-xl !font-bold !text-text-main">Bảng Điểm</h2>

                {!isStudent && (
                    <div className="!bg-background !p-1 !rounded-xl !flex !items-center border border-border !w-full sm:!w-auto !overflow-x-auto custom-scrollbar">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`!px-4 !py-1.5 !rounded-lg !text-sm !font-bold !transition-all !whitespace-nowrap ${activeTab === 'overview' ? '!bg-white !text-primary !shadow-sm' : '!text-text-muted hover:!text-text-main'}`}
                        >
                            Tổng quan
                        </button>

                        {role === 'TEACHER' && (
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`!px-4 !py-1.5 !rounded-lg !text-sm !font-bold !transition-all !whitespace-nowrap ${activeTab === 'settings' ? '!bg-white !text-primary !shadow-sm' : '!text-text-muted hover:!text-text-main'}`}
                            >
                                Cài đặt
                            </button>
                        )}
                    </div>
                )}
            </div>

            {role === 'TEACHER' && (
                <div className="!flex !items-center !gap-2">
                    <button
                        onClick={() => handleExport('excel')}
                        className="!w-full sm:!w-auto !justify-center !px-4 !py-2 !bg-emerald-600 !text-white !rounded-xl !text-sm !font-bold hover:!bg-emerald-700 !flex !items-center !gap-2 !transition-all"
                    >
                        <Icon icon="vscode-icons:file-type-excel" className="!text-lg" />
                        Excel
                    </button>
                    <button
                        onClick={() => handleExport('pdf')}
                        className="!w-full sm:!w-auto !justify-center !px-4 !py-2 !bg-rose-600 !text-white !rounded-xl !text-sm !font-bold hover:!bg-rose-700 !flex !items-center !gap-2 !transition-all"
                    >
                        <Icon icon="vscode-icons:file-type-pdf2" className="!text-lg" />
                        PDF
                    </button>
                </div>
            )}
        </div>
    );

    const renderTeacherIndividualView = () => (
        <div className="!flex !flex-col md:!flex-row !flex-1 md:!overflow-hidden !bg-surface">
            {/* Left Panel: Student List */}
            <div className="!w-full md:!w-1/3 !h-64 md:!h-full border-b md:border-b-0 md:border-r border-border !flex !flex-col !bg-background/30">
                <div className="!p-4 border-b border-border !shrink-0">
                    <div className="!relative">
                        <Icon icon="material-symbols:search" className="!absolute !left-3 !top-1/2 !-translate-y-1/2 !text-text-muted" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm học sinh..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="!w-full !pl-9 !pr-4 !py-2.5 !bg-white border border-border !rounded-xl focus:!outline-none focus:!border-primary focus:!ring-4 focus:!ring-primary/10 !transition-all !text-sm"
                        />
                    </div>
                </div>

                <div className="!flex-1 !overflow-y-auto !p-2 !space-y-1 custom-scrollbar">
                    {filteredStudents.map(student => (
                        <button
                            key={student.studentId}
                            onClick={() => setSelectedStudentId(student.studentId)}
                            className={`!w-full !flex !items-center !gap-3 !p-3 !rounded-xl !transition-all !text-left ${selectedStudentId === student.studentId
                                ? '!bg-primary/5 !border !border-primary/20'
                                : 'hover:!bg-white hover:!border-border border border-transparent'
                                }`}
                        >
                            <div className="!w-10 !h-10 !rounded-full !bg-primary/10 !flex !items-center !justify-center !text-primary !font-bold !border !border-primary/20">
                                {student.studentName?.charAt(0)}
                            </div>
                            <div className="!flex-1 !min-w-0">
                                <h4 className={`!text-sm !font-bold !truncate ${selectedStudentId === student.studentId ? '!text-primary' : '!text-text-main'}`}>
                                    {student.studentName}
                                </h4>
                                <p className="!text-[10px] !text-text-muted">{student.studentId}</p>
                            </div>
                            <div className="!text-right">
                                <span className={`!text-sm !font-black ${student.finalAverage >= 8 ? '!text-emerald-600' : student.finalAverage >= 5 ? '!text-amber-600' : '!text-destructive'}`}>
                                    {student.finalAverage?.toFixed(1) || '--'}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Right Panel: Student Grades Detail */}
            <div className="!flex-1 !flex !flex-col !overflow-y-auto md:!overflow-hidden !bg-surface">
                {activeStudent ? (
                    <>
                        <div className="!p-6 sm:!p-8 border-b border-border !bg-white !flex !flex-col sm:!flex-row !items-start sm:!items-center !justify-between !gap-6 !shrink-0">
                            <div className="!flex !items-center !gap-5">
                                <img src={activeStudent.avatar} alt={activeStudent.name} className="!w-16 sm:!w-20 !h-16 sm:!h-20 !rounded-3xl !border-4 !border-primary/5 !shadow-sm" />
                                <div>
                                    <h2 className="!text-2xl sm:!text-3xl !font-black !text-text-main !tracking-tight">{activeStudent.name}</h2>
                                </div>
                            </div>
                            <div className="!p-4 sm:!p-6 !rounded-2xl !bg-primary/5 !border !border-primary/10 !w-full sm:!w-auto !flex sm:!flex-col !justify-between !items-center sm:!items-end !gap-1">
                                <p className="!text-[11px] !font-bold !text-text-muted !uppercase !tracking-widest">Điểm trung bình</p>
                                <h3 className={`!text-3xl sm:!text-4xl !font-black ${activeStudent.average >= 8 ? '!text-emerald-600' : '!text-primary'}`}>
                                    {activeStudent.average.toFixed(1)}
                                </h3>
                            </div>
                        </div>

                        <div className="!flex-1 md:!overflow-y-auto !p-6 sm:!p-8 !space-y-8 custom-scrollbar">
                            {categories.map(category => {
                                const categoryColumns = gradeTableData.columns.filter(c => c.gradeCategoryId === category.gradeCategoryId);
                                if (categoryColumns.length === 0) return null;

                                return (
                                    <div key={category.gradeCategoryId} className="!bg-white !border !border-border !rounded-2xl !overflow-hidden !shadow-sm">
                                        <div className="!px-6 !py-4 !bg-background/40 !border-b !border-border !flex !justify-between !items-center">
                                            <h3 className="!font-bold !text-text-main">
                                                {category.name}
                                                <span className="!text-text-muted !font-normal !text-sm !ml-2">({category.weight}%)</span>
                                            </h3>
                                        </div>

                                        <div className="!divide-y !divide-border">
                                            {categoryColumns.map(col => {
                                                const studentGrade = activeStudent.grades.find(g => g.assignmentId === col.assignmentId);
                                                return (
                                                    <div key={col.assignmentId} className="!p-6 !flex !flex-col sm:!flex-row !gap-6 transition-colors hover:!bg-background/20">
                                                        <div className="!w-full sm:!w-1/3">
                                                            <h4 className="!font-bold !text-text-main !mb-1">{col.title}</h4>
                                                            <p className="!text-[10px] !text-text-muted !font-bold !uppercase">TRỌNG SỐ: {col.weight}%</p>
                                                        </div>
                                                        <div className="!flex !items-center !w-full sm:!w-1/4">
                                                            <div className="!px-4 !py-2 !bg-background !rounded-xl !font-black !text-primary !text-lg">
                                                                {studentGrade?.grade !== null ? studentGrade.grade : '--'}
                                                            </div>
                                                            <span className="!text-text-muted !text-sm !ml-3">/ 10</span>
                                                        </div>
                                                        <div className="!w-full sm:!w-1/2 !flex !items-center !text-sm !text-text-muted">
                                                            {studentGrade?.submissionId ? (
                                                                <span className="!flex !items-center !gap-1.5 !text-emerald-600 !font-semibold">
                                                                    <Icon icon="material-symbols:check-circle" />
                                                                    Đã nộp bài
                                                                </span>
                                                            ) : (
                                                                <span className="!italic !opacity-60">Chưa nộp / Offline</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <div className="!flex-1 !flex !flex-col !items-center !justify-center !text-text-muted !p-10 !text-center !gap-4">
                        <Icon icon="material-symbols:person-search-rounded" className="!text-6xl !opacity-20" />
                        <p className="!font-medium">Chọn một học sinh từ danh sách bên trái để xem chi tiết bảng điểm.</p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="!h-full !flex !flex-col !bg-surface !animate-fade-in md:!overflow-hidden">
            {renderHeader()}

            <div className="!flex-1 !flex !flex-col !overflow-hidden">
                {/* Student role: use dedicated student grades view */}
                {isStudent && (
                    <StudentGradesView classId={classId} token={user?.token} />
                )}

                {/* Teacher/TA: existing master table view */}
                {!isStudent && activeTab === 'overview' && isLoadingTable && (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-primary">
                        <Icon icon="solar:spinner-linear" className="animate-spin text-5xl" />
                        <p className="font-bold">Đang tải bảng điểm...</p>
                    </div>
                )}

                {!isStudent && activeTab === 'overview' && !isLoadingTable && tableError && (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-text-muted !p-10 text-center">
                        <Icon icon="solar:shield-warning-bold-duotone" className="text-6xl opacity-30" />
                        <p className="font-bold text-lg">Không thể tải bảng điểm</p>
                        <p className="text-sm">Tài khoản của bạn có thể chưa được cấp quyền truy cập bảng điểm lớp này, hoặc có lỗi xảy ra.</p>
                        <button
                            onClick={refreshAll}
                            className="flex items-center gap-2 !px-5 !py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors"
                        >
                            <Icon icon="solar:refresh-bold-duotone" />
                            Thử lại
                        </button>
                    </div>
                )}

                {!isStudent && activeTab === 'overview' && !isLoadingTable && !tableError && gradeTableData && (
                    <GradeMasterView
                        classId={classId}
                        gradeTableData={gradeTableData}
                        onRefresh={refreshAll}
                    />
                )}

                {!isStudent && activeTab === 'overview' && !isLoadingTable && !tableError && !gradeTableData && (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-text-muted !p-10 text-center">
                        <Icon icon="solar:notebook-bold-duotone" className="text-6xl opacity-20" />
                        <p className="font-medium">Chưa có dữ liệu bảng điểm</p>
                    </div>
                )}

                {!isStudent && activeTab === 'individual' && renderTeacherIndividualView()}

                {!isStudent && activeTab === 'settings' && role === 'TEACHER' && (
                    <GradeSettingsView
                        classId={classId}
                        categories={categories}
                        gradeTableData={gradeTableData}
                        onRefresh={refreshAll}
                        isLoading={isLoadingCategories}
                    />
                )}
            </div>
        </div>
    );
};

export default ClassGradesPage;
