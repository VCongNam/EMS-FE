import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';

const AssignStudentToClassPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');

    // Dummy data
    const classes = [
        { id: 'C1', name: 'Toán Cao Cấp (MATH101)' },
        { id: 'C2', name: 'Vật Lý Đại Cương (PHYS101)' },
        { id: 'C3', name: 'Lập Trình Cơ Bản (CS101)' },
    ];

    const availableStudents = [
        { id: 'STU004', name: 'Phạm Văn D', email: 'pvd@example.com' },
        { id: 'STU005', name: 'Hoàng Thị E', email: 'hte@example.com' },
        { id: 'STU006', name: 'Ngô Văn F', email: 'nvf@example.com' },
        { id: 'STU007', name: 'Vũ Thị G', email: 'vtg@example.com' },
    ].filter(stu => stu.name.toLowerCase().includes(searchTerm.toLowerCase()) || stu.id.toLowerCase().includes(searchTerm.toLowerCase()));

    const toggleStudentSelection = (studentId) => {
        setSelectedStudents(prev => 
            prev.includes(studentId) 
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleAssign = () => {
        if (!selectedClass) {
            toast.warning('Vui lòng chọn một lớp học!');
            return;
        }
        if (selectedStudents.length === 0) {
            toast.warning('Vui lòng chọn ít nhất một học sinh!');
            return;
        }
        toast.success(`Đã xếp ${selectedStudents.length} học sinh vào lớp đã chọn!`);
        setSelectedStudents([]);
    };

    return (
        <div className="w-full mx-auto space-y-6 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface p-6 rounded-[2rem] border border-border shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-text-main flex items-center gap-3">
                        <Icon icon="material-symbols:assignment-add-rounded" className="text-primary text-3xl" />
                        Xếp lớp học sinh
                    </h1>
                    <p className="text-text-muted mt-1">Chọn học sinh chưa có lớp và xếp vào lớp tương ứng.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Select Class & Actions */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-surface p-6 rounded-[2rem] border border-border shadow-sm space-y-4">
                        <h3 className="text-lg font-semibold text-text-main flex items-center gap-2">
                            <Icon icon="material-symbols:school-rounded" className="text-primary" /> Chọn lớp học
                        </h3>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-text-muted">Lớp học đích</label>
                            <select 
                                value={selectedClass} 
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-text-main"
                            >
                                <option value="">-- Chọn lớp học --</option>
                                {classes.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/20 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-text-main font-semibold">Đã chọn:</span>
                            <span className="text-xl font-bold text-primary">{selectedStudents.length} học sinh</span>
                        </div>
                        <button 
                            onClick={handleAssign}
                            className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary/90 shadow-lg hover:shadow-primary/30 transition-all font-semibold flex items-center justify-center gap-2"
                        >
                            <Icon icon="material-symbols:check-circle-rounded" className="text-xl" />
                            Xác nhận xếp lớp
                        </button>
                    </div>
                </div>

                {/* Right Column: Student List */}
                <div className="lg:col-span-2 bg-surface p-6 rounded-[2rem] border border-border shadow-sm space-y-4 flex flex-col min-h-[500px]">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
                        <h3 className="text-lg font-semibold text-text-main flex items-center gap-2">
                            <Icon icon="material-symbols:list-alt-rounded" className="text-primary" /> Danh sách học sinh tự do
                        </h3>
                        <div className="relative w-full sm:w-64">
                            <Icon icon="material-symbols:search-rounded" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xl" />
                            <input 
                                type="text" 
                                placeholder="Tìm theo tên, mã HS..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {availableStudents.length === 0 ? (
                            <div className="text-center text-text-muted py-8 flex flex-col items-center">
                                <Icon icon="material-symbols:search-off-rounded" className="text-4xl mb-2 opacity-50" />
                                <p>Không tìm thấy học sinh nào.</p>
                            </div>
                        ) : (
                            availableStudents.map(student => (
                                <div 
                                    key={student.id} 
                                    onClick={() => toggleStudentSelection(student.id)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between hover:shadow-md ${
                                        selectedStudents.includes(student.id) 
                                            ? 'bg-primary/5 border-primary shadow-sm' 
                                            : 'bg-background border-border hover:border-primary/50'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-6 h-6 rounded flex items-center justify-center border transition-colors ${
                                            selectedStudents.includes(student.id)
                                                ? 'bg-primary border-primary text-white'
                                                : 'bg-surface border-border'
                                        }`}>
                                            {selectedStudents.includes(student.id) && <Icon icon="material-symbols:check-small-rounded" className="text-xl" />}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-text-main flex items-center gap-2">
                                                {student.name}
                                                <span className="px-2 py-0.5 bg-background border border-border rounded text-xs font-mono text-text-muted">
                                                    {student.id}
                                                </span>
                                            </div>
                                            <div className="text-sm text-text-muted mt-1 flex items-center gap-1">
                                                <Icon icon="material-symbols:mail-rounded" className="text-xs" /> {student.email}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignStudentToClassPage;
