import React, { useState, useEffect } from 'react';
import useAuthStore from '../../../../../store/authStore';
import GradeMasterView from './grades/GradeMasterView';
import GradeSettingsView from './grades/GradeSettingsView';
import { Icon } from '@iconify/react';

// --- MOCK DATA ---
const MOCK_STUDENTS = [
    { id: '1', name: 'Nguyễn Văn A', avatar: 'https://i.pravatar.cc/150?u=1', studentId: 'SV001', average: 8.5 },
    { id: '2', name: 'Trần Thị B', avatar: 'https://i.pravatar.cc/150?u=2', studentId: 'SV002', average: 9.0 },
    { id: '3', name: 'Lê Hoàng C', avatar: 'https://i.pravatar.cc/150?u=3', studentId: 'SV003', average: 6.5 },
    { id: '4', name: 'Phạm Văn D', avatar: 'https://i.pravatar.cc/150?u=4', studentId: 'SV004', average: 7.2 },
    { id: '5', name: 'Hoàng Thị E', avatar: 'https://i.pravatar.cc/150?u=5', studentId: 'SV005', average: 8.8 },
];

const MOCK_CATEGORIES = [
    { id: 'c1', name: 'Bài tập về nhà', weight: 20 },
    { id: 'c2', name: 'Giữa kỳ', weight: 30 },
    { id: 'c3', name: 'Cuối kỳ', weight: 50 }
];

const MOCK_GRADES = {
    '1': [
        { id: 'g1', assignmentTitle: 'Bài tập 1', categoryId: 'c1', score: 8, maxScore: 10, feedback: 'Làm bài tốt' },
        { id: 'g2', assignmentTitle: 'Bài tập 2', categoryId: 'c1', score: 9, maxScore: 10, feedback: '' },
        { id: 'g3', assignmentTitle: 'Bài thi giữa kỳ', categoryId: 'c2', score: 8.5, maxScore: 10, feedback: 'Cần cẩn thận hơn ở câu 3' },
        { id: 'g4', assignmentTitle: 'Bài thi cuối kỳ', categoryId: 'c3', score: 8.5, maxScore: 10, feedback: '' },
    ],
    '2': [
        { id: 'g1', assignmentTitle: 'Bài tập 1', categoryId: 'c1', score: 10, maxScore: 10, feedback: 'Rất xuất sắc' },
        { id: 'g2', assignmentTitle: 'Bài tập 2', categoryId: 'c1', score: 9, maxScore: 10, feedback: '' },
        { id: 'g3', assignmentTitle: 'Bài thi giữa kỳ', categoryId: 'c2', score: 9.5, maxScore: 10, feedback: '' },
        { id: 'g4', assignmentTitle: 'Bài thi cuối kỳ', categoryId: 'c3', score: 8.5, maxScore: 10, feedback: '' },
    ]
};

const ClassGradesPage = () => {
    const { user } = useAuthStore();
    const role = user?.role || 'student';
    
    const [activeTab, setActiveTab] = useState(role === 'student' ? 'individual' : 'overview');
    const [selectedStudentId, setSelectedStudentId] = useState(MOCK_STUDENTS[0].id);
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState(MOCK_CATEGORIES);

    // If student, lock to their own data (mocking student ID match)
    useEffect(() => {
        if (role === 'student') {
            // Find student by email or ID in real app. Here we just pick index 0 for mock.
            setSelectedStudentId('1');
            setActiveTab('individual');
        }
    }, [role]);

    const filteredStudents = MOCK_STUDENTS.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeStudent = MOCK_STUDENTS.find(s => s.id === selectedStudentId);
    const studentGrades = MOCK_GRADES[selectedStudentId] || [];

    const handleExport = () => {
        toast.info('Đang chuẩn bị tệp bảng điểm Excel cho lớp học...');
        console.log('Exporting gradebook for role:', role);
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
                        <button 
                            onClick={() => setActiveTab('individual')}
                            className={`!px-4 !py-1.5 !rounded-lg !text-sm !font-bold !transition-all !whitespace-nowrap ${activeTab === 'individual' ? '!bg-white !text-primary !shadow-sm' : '!text-text-muted hover:!text-text-main'}`}
                        >
                            Cá nhân
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
                <button 
                    onClick={handleExport}
                    className="!w-full sm:!w-auto !justify-center !px-5 !py-2.5 !bg-primary !text-white !rounded-xl !font-bold !hover:bg-primary/95 !flex !items-center !gap-2 !transition-all !shadow-lg !shadow-primary/20"
                >
                    <Icon icon="material-symbols:download" className="!text-xl" />
                    Xuất file
                </button>
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
                                key={student.id}
                                onClick={() => setSelectedStudentId(student.id)}
                                className={`!w-full !flex !items-center !gap-3 !p-3 !rounded-xl !transition-all !text-left ${
                                    selectedStudentId === student.id 
                                        ? '!bg-primary/5 !border !border-primary/20' 
                                        : 'hover:!bg-white hover:!border-border border border-transparent'
                                }`}
                            >
                                <img src={student.avatar} alt={student.name} className="!w-10 !h-10 !rounded-full !object-cover !border !border-border" />
                                <div className="!flex-1 !min-w-0">
                                    <h4 className={`!text-sm !font-bold !truncate ${selectedStudentId === student.id ? '!text-primary' : '!text-text-main'}`}>
                                        {student.name}
                                    </h4>
                                    <p className="!text-xs !text-text-muted !truncate">{student.studentId}</p>
                                </div>
                                <div className="!text-right">
                                    <span className={`!text-sm !font-black ${student.average >= 8 ? '!text-emerald-600' : student.average >= 5 ? '!text-amber-600' : '!text-destructive'}`}>
                                        {student.average.toFixed(1)}
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
                                    <p className="!text-sm !font-medium !text-text-muted !mt-1">Mã định danh: {activeStudent.studentId}</p>
                                </div>
                            </div>
                            <div className="!p-4 sm:!p-6 !rounded-2xl !bg-primary/5 !border !border-primary/10 !w-full sm:!w-auto !flex sm:!flex-col !justify-between !items-center sm:!items-end !gap-1">
                                <p className="!text-[11px] !font-bold !text-text-muted !uppercase !tracking-widest">Điểm trung bình</p>
                                <h3 className={`!text-3xl sm:!text-4xl !font-black ${activeStudent.average >= 8 ? '!text-emerald-600' : '!text-primary'}`}>
                                    {activeStudent.average.toFixed(1)}
                                </h3>
                            </div>
                        </div>

                        {/* Grades List */}
                        <div className="!flex-1 md:!overflow-y-auto !p-6 sm:!p-8 !space-y-8 custom-scrollbar">
                            {categories.map(category => {
                                const categoryGrades = studentGrades.filter(g => g.categoryId === category.id);
                                if(categoryGrades.length === 0) return null;

                                return (
                                    <div key={category.id} className="!bg-white !border !border-border !rounded-2xl !overflow-hidden !shadow-sm">
                                        <div className="!px-6 !py-4 !bg-background/40 !border-b !border-border !flex !justify-between !items-center">
                                            <h3 className="!font-bold !text-text-main">{category.name} <span className="!text-text-muted !font-normal !text-sm !ml-2">({category.weight}%)</span></h3>
                                        </div>
                                        
                                        <div className="!divide-y !divide-border">
                                            {categoryGrades.map(grade => (
                                                <div key={grade.id} className="!p-6 !flex !flex-col sm:!flex-row !gap-6 transition-colors hover:!bg-background/20">
                                                    <div className="!w-full sm:!w-1/3">
                                                        <h4 className="!font-bold !text-text-main !mb-1">{grade.assignmentTitle}</h4>
                                                        <p className="!text-xs !text-text-muted">Tổng điểm: {grade.maxScore}</p>
                                                    </div>
                                                    <div className="!flex !items-center !w-full sm:!w-1/4">
                                                        {role !== 'student' ? (
                                                            <input 
                                                                type="number" 
                                                                defaultValue={grade.score}
                                                                className="!w-24 !px-4 !py-2 !bg-background !border !border-border !rounded-xl !text-base !font-bold !text-primary focus:!border-primary focus:!ring-4 focus:!ring-primary/10 !transition-all"
                                                            />
                                                        ) : (
                                                            <div className="!px-4 !py-2 !bg-background !rounded-xl !font-black !text-primary !text-lg">
                                                                {grade.score}
                                                            </div>
                                                        )}
                                                        <span className="!text-text-muted !text-sm !ml-3">/ {grade.maxScore}</span>
                                                    </div>
                                                    <div className="!w-full sm:!w-1/2">
                                                        {grade.feedback || role !== 'student' ? (
                                                            <textarea 
                                                                placeholder={role === 'student' ? "Chưa có nhận xét" : "Thêm nhận xét cho học sinh..." }
                                                                defaultValue={grade.feedback}
                                                                readOnly={role === 'student'}
                                                                className="!w-full !px-4 !py-3 !bg-background/50 !border !border-border !rounded-xl !text-sm !focus:outline-none !focus:border-primary !resize-none !h-24 sm:!h-16 custom-scrollbar !text-text-main"
                                                            />
                                                        ) : (
                                                            <div className="!text-xs !text-text-muted/40 !italic">Chưa có nhận xét nào từ giáo viên.</div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
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
                {activeTab === 'overview' && role !== 'student' && (
                    <GradeMasterView 
                        students={MOCK_STUDENTS} 
                        categories={categories} 
                        grades={MOCK_GRADES}
                        onSelectStudent={(id) => {
                            setSelectedStudentId(id);
                            setActiveTab('individual');
                        }}
                    />
                )}
                
                {activeTab === 'individual' && renderIndividualView()}
                
                {activeTab === 'settings' && role === 'teacher' && (
                    <GradeSettingsView 
                        categories={categories} 
                        onUpdateCategories={setCategories}
                    />
                )}
            </div>
        </div>
    );
};

export default ClassGradesPage;
