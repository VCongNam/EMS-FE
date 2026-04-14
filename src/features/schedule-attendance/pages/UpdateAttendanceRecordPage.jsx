import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';

const UpdateAttendanceRecordPage = () => {
    const [selectedDate, setSelectedDate] = useState('02/10/2026');
    const [isEditing, setIsEditing] = useState(false);

    // Dummy data
    const records = [
        { id: 'STU001', name: 'Nguyễn Văn A', originalStatus: 'present', currentStatus: 'present' },
        { id: 'STU002', name: 'Trần Thị B', originalStatus: 'absent', currentStatus: 'absent' },
        { id: 'STU003', name: 'Lê Văn C', originalStatus: 'late', currentStatus: 'late' },
    ];

    const [students, setStudents] = useState(records);

    const handleStatusChange = (studentId, status) => {
        setStudents(prev => prev.map(s => s.id === studentId ? { ...s, currentStatus: status } : s));
    };

    const handleSave = () => {
        toast.success('Cập nhật lịch sử điểm danh thành công!');
        setIsEditing(false);
    };

    const StatusBadge = ({ status }) => {
        if (status === 'present') return <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-bold uppercase tracking-wider">Hiện diện</span>;
        if (status === 'absent') return <span className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-bold uppercase tracking-wider">Vắng mặt</span>;
        if (status === 'late') return <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded text-xs font-bold uppercase tracking-wider">Đi muộn</span>;
    };

    return (
        <div className="w-full mx-auto space-y-6 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface p-6 rounded-[2rem] border border-border shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-text-main flex items-center gap-3">
                        <Icon icon="material-symbols:history-edu-rounded" className="text-primary text-3xl" />
                        Sửa lịch sử điểm danh
                    </h1>
                    <p className="text-text-muted mt-1">Lớp: Toán Cao Cấp (MATH101)</p>
                </div>
                <div className="flex items-center gap-2">
                    <input 
                        type="date" 
                        className="px-4 py-2 bg-background border border-border rounded-xl font-medium text-text-main focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <button className="px-4 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 shadow-md transition-all flex items-center gap-2">
                        <Icon icon="material-symbols:search-rounded" className="text-xl" /> Tra cứu
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-surface rounded-[2rem] border border-border shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-border bg-background/50 flex justify-between items-center">
                    <h3 className="font-semibold text-text-main">Ngày học: {selectedDate}</h3>
                    {!isEditing ? (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl font-bold hover:bg-primary/20 transition-all flex items-center gap-2 text-sm"
                        >
                            <Icon icon="material-symbols:edit-document-rounded" className="text-lg" /> Mở khóa Chỉnh sửa
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 bg-background text-text-muted border border-border rounded-xl font-bold hover:bg-border/50 transition-all text-sm"
                            >
                                Hủy
                            </button>
                            <button 
                                onClick={handleSave}
                                className="px-4 py-2 bg-primary text-white rounded-xl font-bold flex items-center gap-2 text-sm shadow-md"
                            >
                                <Icon icon="material-symbols:save-rounded" className="text-lg" /> Lưu thay đổi
                            </button>
                        </div>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-background border-b border-border">
                                <th className="p-4 font-semibold text-text-muted uppercase tracking-wider text-xs w-24">Mã HS</th>
                                <th className="p-4 font-semibold text-text-muted uppercase tracking-wider text-xs">Họ và Tên</th>
                                <th className="p-4 font-semibold text-text-muted uppercase tracking-wider text-xs text-center w-40">Trạng thái gốc</th>
                                <th className="p-4 font-semibold text-text-muted uppercase tracking-wider text-xs text-center">Trạng thái mới</th>
                                <th className="p-4 font-semibold text-text-muted uppercase tracking-wider text-xs">Ghi chú sửa đổi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {students.map((student) => (
                                <tr key={student.id} className="hover:bg-primary/5 transition-colors">
                                    <td className="p-4 font-mono text-sm text-text-main">{student.id}</td>
                                    <td className="p-4 font-medium text-text-main">{student.name}</td>
                                    <td className="p-4 text-center">
                                        <StatusBadge status={student.originalStatus} />
                                    </td>
                                    <td className="p-4 text-center">
                                        {!isEditing ? (
                                            <StatusBadge status={student.currentStatus} />
                                        ) : (
                                            <select 
                                                value={student.currentStatus}
                                                onChange={(e) => handleStatusChange(student.id, e.target.value)}
                                                className={`px-3 py-1.5 rounded-lg border focus:ring-2 outline-none font-bold text-sm ${
                                                    student.currentStatus !== student.originalStatus ? 'border-primary ring-1 ring-primary/50 text-primary bg-primary/5' : 'border-border text-text-main bg-background'
                                                }`}
                                            >
                                                <option value="present">Hiện diện</option>
                                                <option value="absent">Vắng mặt</option>
                                                <option value="late">Đi muộn</option>
                                            </select>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        {!isEditing ? (
                                            <span className="text-sm text-text-muted italic">{student.currentStatus !== student.originalStatus ? 'Đã sửa đổi bởi Admin' : '--'}</span>
                                        ) : (
                                            <input 
                                                type="text" 
                                                disabled={student.currentStatus === student.originalStatus}
                                                placeholder={student.currentStatus !== student.originalStatus ? 'Lý do sửa...' : ''}
                                                className="w-full px-3 py-1.5 bg-background border border-border rounded text-sm focus:border-primary outline-none disabled:opacity-50 disabled:bg-surface"
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UpdateAttendanceRecordPage;
