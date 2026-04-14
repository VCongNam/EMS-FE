import React, { useState, useEffect } from 'react';
import useAuthStore from '../../../../../store/authStore';
import GradeMasterView from './grades/GradeMasterView';
import GradeSettingsView from './grades/GradeSettingsView';
import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';
import { gradebookService } from '../../../api/gradebookService';
import { toast } from 'react-toastify';

const ClassGradesPage = () => {
    const { user } = useAuthStore();
    const role = user?.role || 'student';
    const { classId } = useParams();
    
    const [activeTab, setActiveTab] = useState(role === 'student' ? 'individual' : 'overview');
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState([]);
    const [gradeTableData, setGradeTableData] = useState(null);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [isLoadingTable, setIsLoadingTable] = useState(true);

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
            const res = await gradebookService.getGradeTable(classId, user?.token);
            if (res.ok) {
                const data = await res.json();
                setGradeTableData(data);
                // Select first student by default if none selected
                if (!selectedStudentId && data.studentRows?.length > 0) {
                    setSelectedStudentId(data.studentRows[0].studentId);
                }
            }
        } catch (error) {
            console.error("Lỗi mạng:", error);
        } finally {
            setIsLoadingTable(false);
        }
    };

    const refreshAll = () => {
        fetchCategories();
        fetchGradeTable();
    };

    useEffect(() => {
        if (classId) {
            refreshAll();
        }
    }, [classId, user?.token, activeTab]);

    // If student, lock to their own data (mocking student ID match)
    useEffect(() => {
        if (role === 'student' && user?.id) {
            setSelectedStudentId(user.id);
            setActiveTab('individual');
        }
    }, [role, user?.id]);

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
                
                {role !== 'student' && (
                    <div className="!bg-background !p-1 !rounded-xl !flex !items-center border border-border !w-full sm:!w-auto !overflow-x-auto custom-scrollbar">
                        <button 
                            onClick={() => setActiveTab('overview')}
                            className={`!px-4 !py-1.5 !rounded-lg !text-sm !font-bold !transition-all !whitespace-nowrap ${activeTab === 'overview' ? '!bg-white !text-primary !shadow-sm' : '!text-text-muted hover:!text-text-main'}`}
                        >
                            Tổng quan
                        </button>
                        
                        {role === 'teacher' && (
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
            
            {role === 'teacher' && (
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

    const renderIndividualView = () => (
        <div className="!flex !flex-col md:!flex-row !flex-1 md:!overflow-hidden !bg-surface">
            {/* Left Panel: Student List (Hidden for students) */}
            {role !== 'student' && (
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
                                className={`!w-full !flex !items-center !gap-3 !p-3 !rounded-xl !transition-all !text-left ${
                                    selectedStudentId === student.studentId 
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
            )}

            {/* Right Panel: Student Grades Detail */}
            <div className={`!flex-1 !flex !flex-col !overflow-y-auto md:!overflow-hidden ${role === 'student' ? '!bg-white' : '!bg-surface'}`}>
                {activeStudent ? (
                    <>
                        {/* Student Header */}
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

                        {/* Grades List segmented by categories */}
                        <div className="!flex-1 md:!overflow-y-auto !p-6 sm:!p-8 !space-y-8 custom-scrollbar">
                            {categories.map(category => {
                                // Find assignments in this category from columns
                                const categoryColumns = gradeTableData.columns.filter(c => c.gradeCategoryId === category.gradeCategoryId);
                                if(categoryColumns.length === 0) return null;

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
                                )
                            })}
                        </div>
                    </>
                ) : (
                    <div className="!flex-1 !flex !flex-col !items-center !justify-center !text-text-muted !p-10 !text-center !gap-4">
                        <Icon icon="material-symbols:person-search-rounded" className="!text-6xl !opacity-20" />
                        <p className="!font-medium">Chọn một học sinh từ danh sách bên trái để xem chi tết bảng điểm.</p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="!h-full !flex !flex-col !bg-surface !animate-fade-in md:!overflow-hidden">
            {renderHeader()}
            
            <div className="!flex-1 !flex !flex-col !overflow-hidden">
                {activeTab === 'overview' && role !== 'student' && gradeTableData && (
                    <GradeMasterView 
                        classId={classId}
                        gradeTableData={gradeTableData}
                        onRefresh={refreshAll}
                    />
                )}
                
                {activeTab === 'individual' && renderIndividualView()}
                
                {activeTab === 'settings' && role === 'teacher' && (
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
