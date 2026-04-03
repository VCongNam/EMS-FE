import React from 'react';
import { Icon } from '@iconify/react';

const GradeMasterView = ({ students, categories, grades, onSelectStudent }) => {
    // Flatten assignments from all categories to create table headers
    const allAssignments = [];
    categories.forEach(cat => {
        // In a real app, we'd fetch assignments per category. 
        // For mock, we'll extract unique titles from existing grades.
        const catGrades = Object.values(grades).flat().filter(g => g.categoryId === cat.id);
        const uniqueTitles = [...new Set(catGrades.map(g => g.assignmentTitle))];
        uniqueTitles.forEach(title => {
            allAssignments.push({ title, categoryId: cat.id, weight: cat.weight });
        });
    });

    const getScore = (studentId, assignmentTitle) => {
        const studentGrades = grades[studentId] || [];
        const found = studentGrades.find(g => g.assignmentTitle === assignmentTitle);
        return found ? found.score : '-';
    };

    return (
        <div className="!flex-1 !flex !flex-col !overflow-hidden !bg-white animate-fade-in">
            {/* Desktop Table View (md and above) */}
            <div className="!hidden md:!block !overflow-x-auto !overflow-y-auto !flex-1 custom-scrollbar">
                <table className="!w-full !border-collapse !text-sm">
                    <thead className="!sticky !top-0 !z-20 !bg-background/95 !backdrop-blur-md">
                        <tr className="!border-b !border-border">
                            <th className="!sticky !left-0 !z-30 !bg-background !p-4 !text-left !font-bold !text-text-main !min-w-[240px] !border-r !border-border">
                                Học sinh
                            </th>
                            {allAssignments.map((asgn, idx) => (
                                <th key={idx} className="!p-4 !text-center !min-w-[120px] !border-r !border-border">
                                    <div className="!text-[11px] !font-bold !text-primary !uppercase !tracking-tighter !mb-1">
                                        {categories.find(c => c.id === asgn.categoryId)?.name}
                                    </div>
                                    <div className="!font-bold !text-text-main">{asgn.title}</div>
                                    <div className="!text-[10px] !text-text-muted !font-normal">Trọng số: {asgn.weight}%</div>
                                </th>
                            ))}
                            <th className="!sticky !right-0 !z-30 !bg-background !p-4 !text-center !font-bold !text-primary !min-w-[100px] !border-l !border-border">
                                TB Tổng
                            </th>
                        </tr>
                    </thead>
                    <tbody className="!divide-y !divide-border">
                        {students.map(student => (
                            <tr key={student.id} className="hover:!bg-primary/5 !transition-colors !group">
                                <td className="!sticky !left-0 !z-10 !bg-white group-hover:!bg-primary/5 !p-4 !border-r !border-border !transition-colors">
                                    <button 
                                        onClick={() => onSelectStudent(student.id)}
                                        className="!flex !items-center !gap-3 !w-full !text-left"
                                    >
                                        <img src={student.avatar} alt="" className="!w-8 !h-8 !rounded-full !border !border-border" />
                                        <div className="!flex-1 !min-w-0">
                                            <div className="!font-semibold !text-text-main !truncate">{student.name}</div>
                                            <div className="!text-[11px] !text-text-muted">{student.studentId}</div>
                                        </div>
                                    </button>
                                </td>
                                {allAssignments.map((asgn, idx) => {
                                    const score = getScore(student.id, asgn.title);
                                    return (
                                        <td key={idx} className="!p-4 !text-center !border-r !border-border">
                                            <span className={`!font-medium ${typeof score === 'number' ? (score >= 8 ? 'text-emerald-600' : score < 5 ? 'text-red-500' : 'text-text-main') : 'text-text-muted'}`}>
                                                {score}
                                            </span>
                                        </td>
                                    );
                                })}
                                <td className="!sticky !right-0 !z-10 !bg-white group-hover:!bg-primary/5 !p-4 !text-center !font-bold !border-l !border-border !transition-colors">
                                    <span className={student.average >= 8 ? 'text-emerald-600' : student.average < 5 ? 'text-red-500' : 'text-primary'}>
                                        {student.average.toFixed(1)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card List View (below md) */}
            <div className="md:!hidden !flex-1 !overflow-y-auto !bg-background/20 !p-4 !space-y-4 custom-scrollbar">
                {students.map(student => (
                    <div 
                        key={student.id} 
                        className="!bg-white !rounded-2xl !border !border-border !shadow-sm !overflow-hidden !transition-all active:!scale-[0.98]"
                        onClick={() => onSelectStudent(student.id)}
                    >
                        {/* Card Header */}
                        <div className="!p-4 !bg-background/50 !border-b !border-border !flex !items-center !justify-between">
                            <div className="!flex !items-center !gap-3">
                                <img src={student.avatar} alt="" className="!w-10 !h-10 !rounded-full !border !border-border" />
                                <div>
                                    <div className="!font-bold !text-text-main">{student.name}</div>
                                    <div className="!text-xs !text-text-muted">{student.studentId}</div>
                                </div>
                            </div>
                            <div className="!text-right">
                                <div className="!text-[10px] !text-text-muted !font-bold !uppercase !tracking-widest">Trung bình</div>
                                <div className={`!text-xl !font-black ${student.average >= 8 ? 'text-emerald-600' : student.average < 5 ? 'text-red-500' : 'text-primary'}`}>
                                    {student.average.toFixed(1)}
                                </div>
                            </div>
                        </div>

                        {/* Card Body - Grades Grid */}
                        <div className="!p-4 !grid !grid-cols-2 !gap-3">
                            {allAssignments.map((asgn, idx) => {
                                const score = getScore(student.id, asgn.title);
                                return (
                                    <div key={idx} className="!bg-background/30 !p-3 !rounded-xl !border !border-border/50">
                                        <div className="!text-[9px] !font-bold !text-text-muted !uppercase !tracking-tighter !truncate">
                                            {asgn.title}
                                        </div>
                                        <div className={`!text-sm !font-bold ${typeof score === 'number' ? (score >= 8 ? 'text-emerald-600' : score < 5 ? 'text-red-500' : 'text-text-main') : 'text-text-muted'}`}>
                                            {score}
                                            <span className="!text-[10px] !text-text-muted !font-normal !ml-1">/ 10</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div className="!px-4 !py-3 !bg-background/10 !flex !justify-center">
                            <span className="!text-[10px] !font-bold !text-primary !uppercase !tracking-widest !flex !items-center !gap-1">
                                Xem chi tiết & nhận xét
                                <Icon icon="material-symbols:arrow-forward-ios-rounded" className="!text-[8px]" />
                            </span>
                        </div>
                    </div>
                ))}
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
                <div className="!font-bold !uppercase !tracking-widest">Tổng số học sinh: {students.length}</div>
            </div>
        </div>
    );
};

export default GradeMasterView;
