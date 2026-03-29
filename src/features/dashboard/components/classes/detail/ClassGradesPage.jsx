import React, { useState } from 'react';

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
    const [selectedStudentId, setSelectedStudentId] = useState(MOCK_STUDENTS[0].id);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredStudents = MOCK_STUDENTS.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeStudent = MOCK_STUDENTS.find(s => s.id === selectedStudentId);
    const studentGrades = MOCK_GRADES[selectedStudentId] || [];

    return (
        <div className="!h-full !flex !flex-col !bg-surface animate-fade-in-up md:!overflow-hidden">
            {/* Toolbar */}
            <div className="!flex !flex-col sm:!flex-row !items-start sm:!items-center !justify-between !px-4 sm:!px-6 !py-4 border-b border-border !gap-4">
                <div className="!flex !flex-col sm:!flex-row !items-start sm:!items-center !gap-4 !w-full sm:!w-auto">
                    <h2 className="text-xl font-bold text-text-main">Bảng Điểm</h2>
                    <div className="!bg-background !p-1 !rounded-lg !flex !items-center border border-border !w-full sm:!w-auto !overflow-x-auto custom-scrollbar">
                        <button className="!px-3 sm:!px-4 !py-1.5 !rounded-md !text-sm !font-medium text-text-muted hover:!text-text-main transition-colors !whitespace-nowrap">Tổng quan</button>
                        <button className="!px-3 sm:!px-4 !py-1.5 !rounded-md !text-sm !font-medium !bg-white shadow-sm text-text-main !whitespace-nowrap">Cá nhân</button>
                        <button className="!px-3 sm:!px-4 !py-1.5 !rounded-md !text-sm !font-medium text-text-muted hover:!text-text-main transition-colors !whitespace-nowrap">Cài đặt</button>
                    </div>
                </div>
                
                <button className="!w-full sm:!w-auto !justify-center !px-4 !py-2 !bg-primary text-white !rounded-lg !font-medium hover:!bg-primary/90 flex items-center !gap-2 transition-colors">
                    <span className="iconify" data-icon="material-symbols:download"></span>
                    Xuất file
                </button>
            </div>

            {/* Main Content: Split Layout */}
            <div className="!flex !flex-col md:!flex-row !flex-1 md:!overflow-hidden">
                {/* Left Panel: Student List */}
                <div className="!w-full md:!w-1/3 !h-64 md:!h-full border-b md:border-b-0 md:border-r border-border !flex !flex-col !bg-background/50">
                    <div className="!p-4 border-b border-border !shrink-0">
                        <div className="relative">
                            <span className="iconify absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" data-icon="material-symbols:search"></span>
                            <input 
                                type="text" 
                                placeholder="Tìm kiếm học sinh..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="!w-full !pl-9 !pr-4 !py-2 !bg-white border border-border !rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                            />
                        </div>
                    </div>
                    
                    <div className="!flex-1 !overflow-y-auto !p-2 !space-y-1 custom-scrollbar">
                        {filteredStudents.map(student => (
                            <button
                                key={student.id}
                                onClick={() => setSelectedStudentId(student.id)}
                                className={`!w-full !flex !items-center !gap-3 !p-3 !rounded-lg transition-all text-left ${
                                    selectedStudentId === student.id 
                                        ? '!bg-primary/5 border border-primary/20' 
                                        : 'hover:!bg-white hover:border-border border border-transparent'
                                }`}
                            >
                                <img src={student.avatar} alt={student.name} className="!w-10 !h-10 !rounded-full object-cover border border-border" />
                                <div className="!flex-1 !min-w-0">
                                    <h4 className={`text-sm font-medium truncate ${selectedStudentId === student.id ? 'text-primary' : 'text-text-main'}`}>
                                        {student.name}
                                    </h4>
                                    <p className="text-xs text-text-muted truncate">{student.studentId}</p>
                                </div>
                                <div className="!text-right">
                                    <span className={`text-sm font-semibold ${student.average >= 8 ? 'text-emerald-600' : student.average >= 5 ? 'text-amber-600' : 'text-destructive'}`}>
                                        {student.average.toFixed(1)}
                                    </span>
                                </div>
                            </button>
                        ))}
                        {filteredStudents.length === 0 && (
                            <div className="!p-4 text-center text-sm text-text-muted">Không tìm thấy học sinh nào</div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Student Grades Detail */}
                <div className="!w-full md:!w-2/3 !flex-1 !flex !flex-col !bg-surface !overflow-y-auto md:!overflow-hidden">
                    {activeStudent ? (
                        <>
                            {/* Student Header */}
                            <div className="!p-4 sm:!p-6 border-b border-border !bg-white !flex !flex-col sm:!flex-row !items-start sm:!items-center !justify-between !gap-4 !shrink-0">
                                <div className="!flex !items-center !gap-4">
                                    <img src={activeStudent.avatar} alt={activeStudent.name} className="!w-14 sm:!w-16 !h-14 sm:!h-16 !rounded-full border-2 border-primary/20" />
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-bold text-text-main">{activeStudent.name}</h2>
                                        <p className="text-sm text-text-muted">Mã HS: {activeStudent.studentId}</p>
                                    </div>
                                </div>
                                <div className="!text-right !bg-primary/5 !px-4 sm:!px-6 !py-2 sm:!py-3 !rounded-xl border border-primary/10 !w-full sm:!w-auto !flex sm:!block !justify-between !items-center">
                                    <p className="text-sm font-medium text-text-muted sm:!mb-1">Điểm Trung Bình</p>
                                    <h3 className={`text-2xl sm:text-3xl font-bold ${activeStudent.average >= 8 ? 'text-emerald-600' : 'text-primary'}`}>
                                        {activeStudent.average.toFixed(1)}
                                    </h3>
                                </div>
                            </div>

                            {/* Grades List */}
                            <div className="!flex-1 md:!overflow-y-auto !p-4 sm:!p-6 !space-y-6 custom-scrollbar">
                                {MOCK_CATEGORIES.map(category => {
                                    const categoryGrades = studentGrades.filter(g => g.categoryId === category.id);
                                    if(categoryGrades.length === 0) return null;

                                    return (
                                        <div key={category.id} className="!bg-white border border-border !rounded-xl overflow-hidden shadow-sm">
                                            <div className="!px-4 sm:!px-5 !py-3 !bg-background border-b border-border !flex !justify-between !items-center">
                                                <h3 className="font-semibold text-text-main">{category.name} <span className="text-text-muted font-normal text-sm ml-2">({category.weight}%)</span></h3>
                                            </div>
                                            
                                            <div className="divide-y divide-border">
                                                {categoryGrades.map(grade => (
                                                    <div key={grade.id} className="!p-4 sm:!p-5 !flex !flex-col sm:!flex-row !gap-4 sm:!gap-6 transition-colors hover:!bg-background/50">
                                                        <div className="w-full sm:!w-1/3">
                                                            <h4 className="font-medium text-text-main !mb-1">{grade.assignmentTitle}</h4>
                                                            <p className="text-xs text-text-muted">Điểm tối đa: {grade.maxScore}</p>
                                                        </div>
                                                        <div className="!flex !items-center w-full sm:!w-1/6">
                                                            <input 
                                                                type="number" 
                                                                defaultValue={grade.score}
                                                                className="!w-20 !px-3 !py-1.5 border border-border !rounded-md text-sm font-medium text-text-main focus:outline-none focus:border-primary"
                                                            />
                                                            <span className="text-text-muted text-sm ml-2">/ {grade.maxScore}</span>
                                                        </div>
                                                        <div className="w-full sm:!w-1/2">
                                                            <textarea 
                                                                placeholder="Thêm nhận xét cho học sinh..." 
                                                                defaultValue={grade.feedback}
                                                                className="!w-full !px-3 !py-2 border border-border !rounded-md text-sm focus:outline-none focus:border-primary resize-none !h-20 sm:!h-14 custom-scrollbar text-text-main"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}
                                {studentGrades.length === 0 && (
                                    <div className="!text-center !py-10 text-text-muted !bg-background !rounded-xl border border-border">
                                        Không có điểm nào cho học sinh này.
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="!flex-1 !flex !items-center !justify-center text-text-muted !p-10 text-center">
                            Chọn một học sinh để xem chi tiết
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClassGradesPage;

