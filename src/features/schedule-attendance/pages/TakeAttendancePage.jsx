import React, { useState } from 'react';
import { Icon } from '@iconify/react';

const TakeAttendancePage = () => {
    // Current class session details
    const sessionDetails = {
        className: 'Toán Cao Cấp (MATH101)',
        date: '02/10/2026',
        time: '08:00 - 10:00',
        room: 'P.301',
        teacherName: 'Nguyễn Văn Giảng Viên'
    };

    const initialStudents = [
        { id: 'STU001', name: 'Nguyễn Văn A', status: 'present' },
        { id: 'STU002', name: 'Trần Thị B', status: 'absent' },
        { id: 'STU003', name: 'Lê Văn C', status: 'late' },
        { id: 'STU004', name: 'Phạm Văn D', status: 'none' },
    ];

    const [students, setStudents] = useState(initialStudents);

    const handleStatusChange = (studentId, status) => {
        setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status } : s));
    };

    const handleSubmit = () => {
        const unchecked = students.filter(s => s.status === 'none');
        if (unchecked.length > 0) {
            alert(`Còn ${unchecked.length} học sinh chưa được điểm danh!`);
            return;
        }
        alert('Đã lưu dữ liệu điểm danh thành công!');
    };

    // Calculate stats
    const presentCount = students.filter(s => s.status === 'present').length;
    const absentCount = students.filter(s => s.status === 'absent').length;
    const lateCount = students.filter(s => s.status === 'late').length;

    return (
        <div className="w-full mx-auto space-y-6 animate-fade-in">
            {/* Header / Session Details */}
            <div className="bg-surface p-6 rounded-[2rem] border border-border shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[40%] h-full bg-primary/5 -skew-x-12 translate-x-10 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Icon icon="material-symbols:fact-check-rounded" className="text-primary text-4xl" />
                            <h1 className="text-2xl font-bold text-text-main">Điểm danh ngày học</h1>
                        </div>
                        <h2 className="text-xl font-bold text-primary">{sessionDetails.className}</h2>
                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm font-medium text-text-muted">
                            <span className="flex items-center gap-1"><Icon icon="material-symbols:calendar-today-rounded" className="text-lg" /> {sessionDetails.date}</span>
                            <span className="flex items-center gap-1"><Icon icon="material-symbols:schedule-rounded" className="text-lg" /> {sessionDetails.time}</span>
                            <span className="flex items-center gap-1"><Icon icon="material-symbols:door-open-outline-rounded" className="text-lg" /> {sessionDetails.room}</span>
                        </div>
                    </div>

                    {/* Stats Dashboard */}
                    <div className="flex gap-4">
                        <div className="flex flex-col items-center justify-center min-w-[80px] bg-background border border-border rounded-2xl p-3">
                            <span className="text-2xl font-extrabold text-green-500">{presentCount}</span>
                            <span className="text-xs uppercase tracking-wider font-bold text-text-muted mt-1">Hiện diện</span>
                        </div>
                        <div className="flex flex-col items-center justify-center min-w-[80px] bg-background border border-border rounded-2xl p-3">
                            <span className="text-2xl font-extrabold text-red-500">{absentCount}</span>
                            <span className="text-xs uppercase tracking-wider font-bold text-text-muted mt-1">Vắng mặt</span>
                        </div>
                        <div className="flex flex-col items-center justify-center min-w-[80px] bg-background border border-border rounded-2xl p-3">
                            <span className="text-2xl font-extrabold text-orange-500">{lateCount}</span>
                            <span className="text-xs uppercase tracking-wider font-bold text-text-muted mt-1">Đi muộn</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Attendance List */}
            <div className="bg-surface rounded-[2rem] border border-border shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-border bg-background/50 flex justify-between items-center">
                    <h3 className="font-semibold text-text-main">Danh sách Học sinh lớp ({students.length})</h3>
                    <div className="text-sm font-medium text-text-muted hidden sm:block">Đánh dấu chính xác trạng thái tham gia</div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-background border-b border-border">
                                <th className="p-4 font-semibold text-text-muted uppercase tracking-wider text-xs">Mã HS</th>
                                <th className="p-4 font-semibold text-text-muted uppercase tracking-wider text-xs">Họ và Tên</th>
                                <th className="p-4 font-semibold text-text-muted uppercase tracking-wider text-xs text-center">Đánh giá trạng thái tham gia</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {students.map((student) => (
                                <tr key={student.id} className="hover:bg-primary/5 transition-colors">
                                    <td className="p-4 font-mono text-sm text-text-main">{student.id}</td>
                                    <td className="p-4 font-medium text-text-main">{student.name}</td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-center gap-2 sm:gap-4">
                                            {/* Present */}
                                            <button 
                                                onClick={() => handleStatusChange(student.id, 'present')}
                                                className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border transition-all font-semibold text-sm ${
                                                    student.status === 'present' 
                                                        ? 'bg-green-100 border-green-500 text-green-700 shadow-sm ring-2 ring-green-200' 
                                                        : 'bg-background border-border text-text-muted hover:border-green-300'
                                                }`}
                                            >
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${student.status === 'present' ? 'border-green-500' : 'border-gray-400'}`}>
                                                    {student.status === 'present' && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
                                                </div>
                                                <span className="hidden sm:inline">Hiện diện</span>
                                            </button>

                                            {/* Late */}
                                            <button 
                                                onClick={() => handleStatusChange(student.id, 'late')}
                                                className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border transition-all font-semibold text-sm ${
                                                    student.status === 'late' 
                                                        ? 'bg-orange-100 border-orange-500 text-orange-700 shadow-sm ring-2 ring-orange-200' 
                                                        : 'bg-background border-border text-text-muted hover:border-orange-300'
                                                }`}
                                            >
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${student.status === 'late' ? 'border-orange-500' : 'border-gray-400'}`}>
                                                    {student.status === 'late' && <div className="w-2 h-2 rounded-full bg-orange-500"></div>}
                                                </div>
                                                <span className="hidden sm:inline">Đi muộn</span>
                                            </button>

                                            {/* Absent */}
                                            <button 
                                                onClick={() => handleStatusChange(student.id, 'absent')}
                                                className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border transition-all font-semibold text-sm ${
                                                    student.status === 'absent' 
                                                        ? 'bg-red-100 border-red-500 text-red-700 shadow-sm ring-2 ring-red-200' 
                                                        : 'bg-background border-border text-text-muted hover:border-red-300'
                                                }`}
                                            >
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${student.status === 'absent' ? 'border-red-500' : 'border-gray-400'}`}>
                                                    {student.status === 'absent' && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
                                                </div>
                                                <span className="hidden sm:inline">Vắng mặt</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 bg-background/50 border-t border-border flex justify-end">
                    <button 
                        onClick={handleSubmit}
                        className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg hover:shadow-primary/40 hover:bg-primary/90 transition-all flex items-center gap-2"
                    >
                        <Icon icon="material-symbols:save-rounded" className="text-xl" />
                        Lưu kết quả điểm danh
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TakeAttendancePage;
