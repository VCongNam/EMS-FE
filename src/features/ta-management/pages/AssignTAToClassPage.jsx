import React, { useState } from 'react';
import { Icon } from '@iconify/react';

const AssignTAToClassPage = () => {
    const [selectedTA, setSelectedTA] = useState('');
    const [selectedClass, setSelectedClass] = useState('');

    const tas = [
        { id: 'TA001', name: 'Lê Thảo Nhi' },
        { id: 'TA002', name: 'Nguyễn Quang Vinh' },
    ];

    const classes = [
        { id: 'C1', name: 'Toán Cao Cấp (MATH101)' },
        { id: 'C2', name: 'Vật Lý Đại Cương (PHYS101)' },
        { id: 'C3', name: 'Lập Trình Cơ Bản (CS101)' },
    ];

    const handleAssign = () => {
        if (!selectedTA || !selectedClass) {
            alert('Vui lòng chọn cả TA và Lớp học!');
            return;
        }
        alert('Đã phân công Trợ giảng thành công!');
        setSelectedClass('');
        setSelectedTA('');
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="flex items-center gap-4 bg-surface p-6 rounded-[2rem] border border-border shadow-sm">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Icon icon="material-symbols:supervised-user-circle-rounded" className="text-3xl" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-text-main">Phân công Trợ giảng</h1>
                    <p className="text-text-muted mt-1">Chỉ định trợ giảng hỗ trợ cho lớp học cụ thể.</p>
                </div>
            </div>

            <div className="bg-surface p-8 rounded-[2rem] border border-border shadow-sm space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-text-main">Chọn Trợ giảng (TA)</label>
                    <select 
                        value={selectedTA} 
                        onChange={(e) => setSelectedTA(e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-text-main"
                    >
                        <option value="">-- Chọn TA --</option>
                        {tas.map(ta => (
                            <option key={ta.id} value={ta.id}>{ta.name} ({ta.id})</option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-center text-primary/50">
                    <Icon icon="material-symbols:arrow-downward-rounded" className="text-2xl" />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-text-main">Chọn Lớp học</label>
                    <select 
                        value={selectedClass} 
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-text-main"
                    >
                        <option value="">-- Chọn Lớp --</option>
                        {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="pt-6 border-t border-border">
                    <button 
                        onClick={handleAssign}
                        className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary/90 shadow-lg hover:shadow-primary/30 transition-all font-semibold flex items-center justify-center gap-2"
                    >
                        <Icon icon="material-symbols:check-circle-rounded" className="text-xl" />
                        Xác nhận Phân công
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignTAToClassPage;
