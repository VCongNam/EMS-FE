import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Icon } from '@iconify/react';
import Button from "../../../components/ui/Button";

// Mock data for available classes
const MOCK_CLASSES = [
    { id: 'C001', name: 'Toán học - Lớp 10A', schedule: 'T2, T4, T6 (17:30 - 19:00)', teacher: 'Nguyễn Văn T', currentStudents: 25, maxStudents: 30 },
    { id: 'C002', name: 'Vật lý - Lớp 10B', schedule: 'T3, T5, T7 (19:30 - 21:00)', teacher: 'Trần Thị M', currentStudents: 28, maxStudents: 30 },
    { id: 'C003', name: 'Hóa học - Lớp 11A', schedule: 'T2, T5 (17:30 - 19:30)', teacher: 'Lê Văn L', currentStudents: 15, maxStudents: 25 },
    { id: 'C004', name: 'Ngữ văn - Lớp 12C', schedule: 'T4, T7 (19:30 - 21:30)', teacher: 'Phạm Thị H', currentStudents: 20, maxStudents: 20 }, // Full
    { id: 'C005', name: 'Lập trình cơ bản', schedule: 'T7 (14:00 - 17:00), CN (08:00 - 11:00)', teacher: 'Hoàng Văn K', currentStudents: 10, maxStudents: 20 },
];

const AssignClassModal = ({ isOpen, onClose, person, onAssign }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClassId, setSelectedClassId] = useState(null);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setSearchQuery('');
            setSelectedClassId(null);
        }
    }, [isOpen]);

    if (!isOpen || !person) return null;

    const filteredClasses = MOCK_CLASSES.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.teacher.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAssign = () => {
        if (selectedClassId) {
            const selectedClass = MOCK_CLASSES.find(c => c.id === selectedClassId);
            onAssign(person.id, selectedClass.name);
            onClose();
        }
    };

    return ReactDOM.createPortal(
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center !p-4 pointer-events-none">
                <div
                    className="bg-surface rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up pointer-events-auto flex flex-col relative custom-scrollbar"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between !p-6 border-b border-border rounded-t-3xl shrink-0">
                        <div className="flex items-center !text-primary !gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <Icon icon="solar:square-academic-cap-2-bold-duotone" className="text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-xl !text-primary sm:text-2xl font-bold font-['Outfit']">Xếp lớp học</h2>
                                <p className="text-xs sm:text-sm text-text-muted mt-1">
                                    Xếp lớp cho <strong className="text-text-main">{person.name}</strong>
                                </p>
                            </div>
                        </div>
                        <button 
                            type="button"
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-text-muted hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all shrink-0"
                        >
                            <Icon icon="material-symbols:close-rounded" className="text-xl" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="!p-6 md:!p-8 flex-1 flex flex-col relative">
                        {/* Search Input */}
                        <div className="relative !mb-6 shrink-0">
                            <Icon icon="solar:magnifer-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/70 text-lg" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm lớp học hoặc giáo viên..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full !pl-11 !pr-4 !py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-text-main hover:border-text-muted/30 placeholder:text-text-muted/50"
                            />
                        </div>

                        {/* Class List */}
                        <div className="!space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2">
                            {filteredClasses.length === 0 ? (
                                <div className="text-center !py-10 text-text-muted">
                                    <Icon icon="solar:folder-error-bold-duotone" className="text-4xl mx-auto !mb-3 opacity-50" />
                                    <p>Không tìm thấy lớp học phù hợp.</p>
                                </div>
                            ) : (
                                filteredClasses.map((cls) => {
                                    const isSelected = selectedClassId === cls.id;
                                    const isFull = cls.currentStudents >= cls.maxStudents;

                                    return (
                                        <div 
                                            key={cls.id}
                                            onClick={() => !isFull && setSelectedClassId(cls.id)}
                                            className={`
                                                relative border rounded-2xl !p-4 transition-all cursor-pointer overflow-hidden
                                                ${isFull ? 'opacity-60 cursor-not-allowed bg-background border-border' : ''}
                                                ${isSelected ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-surface-hover'}
                                            `}
                                        >
                                            {/* Top right indicator */}
                                            <div className="absolute top-4 right-4 flex items-center gap-2 text-sm font-semibold">
                                                {isFull ? (
                                                    <span className="text-red-500 bg-red-500/10 !px-2 !py-0.5 rounded-lg flex items-center !gap-1">
                                                        <Icon icon="solar:lock-bold" /> Đã đầy
                                                    </span>
                                                ) : (
                                                    <span className={isSelected ? 'text-primary' : 'text-text-muted'}>
                                                        {cls.currentStudents}/{cls.maxStudents} HS
                                                    </span>
                                                )}
                                                
                                                {/* Hidden radio button replacement for better accessibility/UI */}
                                                {!isFull && (
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-primary bg-primary' : 'border-text-muted/40'}`}>
                                                        {isSelected && <div className="w-2 h-2 bg-white rounded-full scale-in"></div>}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="pr-20"> {/* Give space for indicator */}
                                                <h3 className={`text-lg font-bold !mb-1 ${isSelected ? 'text-primary' : 'text-text-main'}`}>
                                                    {cls.name}
                                                </h3>
                                                <div className="!space-y-1 text-sm text-text-muted">
                                                    <div className="flex items-center !gap-2">
                                                        <Icon icon="solar:calendar-date-bold-duotone" className="text-primary/70 shrink-0" />
                                                        <span>{cls.schedule}</span>
                                                    </div>
                                                    <div className="flex items-center !gap-2">
                                                        <Icon icon="solar:user-bold-duotone" className="text-primary/70 shrink-0" />
                                                        <span>GV: {cls.teacher}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Spacer */}
                        <div className="min-h-[20px] shrink-0"></div>

                        {/* Footer Actions */}
                        <div className="!pt-6 border-t border-border flex flex-col-reverse sm:flex-row justify-end !gap-3 sm:!gap-4 w-full mt-auto shrink-0">
                            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto justify-center">
                                Hủy bỏ
                            </Button>
                            <Button 
                                type="button" 
                                variant="!primary" 
                                disabled={!selectedClassId}
                                onClick={handleAssign}
                                className="w-full sm:w-auto !p-3 justify-center shadow-primary/30 shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                <Icon icon="solar:check-circle-bold-duotone" className={`text-xl !mr-2 ${selectedClassId ? 'text-primary' : 'text-white'} group-hover:scale-110 transition-transform`} />
                                Xác nhận xếp lớp
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
};

export default AssignClassModal;
