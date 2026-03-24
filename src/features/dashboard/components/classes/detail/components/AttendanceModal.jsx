import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';

const MOCK_CLASS_STUDENTS = [
    { id: 'STU001', name: 'Nguyễn Văn A' },
    { id: 'STU002', name: 'Trần Thị B' },
    { id: 'STU003', name: 'Lê Văn C' },
    { id: 'STU004', name: 'Phạm Văn D' },
    { id: 'STU005', name: 'Hoàng Thị E' },
];

const STATUS_OPTIONS = [
    {
        key: 'present',
        label: 'Hiện diện',
        icon: 'material-symbols:check-circle-rounded',
        activeClass: '!bg-green-500/15 border-green-500 text-green-600 ring-2 ring-green-500/20',
        dotClass: '!bg-green-500',
        borderHover: 'hover:border-green-400',
    },
    {
        key: 'late',
        label: 'Đi muộn',
        icon: 'material-symbols:schedule-rounded',
        activeClass: '!bg-orange-500/15 border-orange-500 text-orange-600 ring-2 ring-orange-500/20',
        dotClass: '!bg-orange-500',
        borderHover: 'hover:border-orange-400',
    },
    {
        key: 'absent',
        label: 'Vắng mặt',
        icon: 'material-symbols:cancel-rounded',
        activeClass: '!bg-red-500/15 border-red-500 text-red-600 ring-2 ring-red-500/20',
        dotClass: '!bg-red-500',
        borderHover: 'hover:border-red-400',
    },
];

const AttendanceModal = ({ isOpen, lesson, existingRecord, onClose, onSave }) => {
    const [students, setStudents] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isEditMode = !!existingRecord;

    useEffect(() => {
        if (isOpen && lesson) {
            if (existingRecord && existingRecord.length > 0) {
                setStudents(existingRecord);
            } else {
                setStudents(MOCK_CLASS_STUDENTS.map(s => ({ ...s, status: 'none' })));
            }
        }
    }, [isOpen, lesson, existingRecord]);

    if (!isOpen || !lesson) return null;

    const handleStatusChange = (studentId, status) => {
        setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status } : s));
    };

    const handleMarkAll = (status) => {
        setStudents(prev => prev.map(s => ({ ...s, status })));
    };

    const handleSubmit = () => {
        const unchecked = students.filter(s => s.status === 'none');
        if (unchecked.length > 0) {
            toast.warning(`Còn ${unchecked.length} học sinh chưa được điểm danh!`);
            return;
        }
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            onSave(lesson.id, students);
            toast.success(`Đã lưu điểm danh Buổi ${lesson.session} thành công!`);
        }, 500);
    };

    const presentCount = students.filter(s => s.status === 'present').length;
    const lateCount    = students.filter(s => s.status === 'late').length;
    const absentCount  = students.filter(s => s.status === 'absent').length;
    const noneCount    = students.filter(s => s.status === 'none').length;

    const formatDate = (dateStr) =>
        new Date(dateStr + 'T00:00:00').toLocaleDateString('vi-VN', {
            weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric'
        });

    const modalContent = (
        <>
            <div
                style={{ zIndex: 9998 }}
                className="fixed inset-0 !bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            <div style={{ zIndex: 9999 }} className="fixed inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:!p-4 pointer-events-none">
                <div className="!bg-surface border border-border border-b-0 sm:border-b rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl w-full sm:max-w-2xl max-h-[92dvh] sm:max-h-[90vh] flex flex-col pointer-events-auto animate-fade-in-up">

                    {/* Header */}
                    <div className="flex items-start justify-between !p-5 border-b border-border shrink-0">
                        <div className="flex items-center !gap-3">
                            <div className="w-11 h-11 rounded-2xl !bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <Icon icon="material-symbols:fact-check-rounded" className="text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-text-main leading-tight">
                                    {isEditMode ? 'Xem / Sửa điểm danh' : 'Điểm danh'} — Buổi {lesson.session}
                                </h2>
                                <p className="text-xs font-medium text-text-muted mt-0.5 flex items-center flex-wrap !gap-x-2 !gap-y-0.5">
                                    <span className="flex items-center !gap-1">
                                        <Icon icon="solar:calendar-date-linear" />
                                        {lesson.day}, {formatDate(lesson.date).split(', ')[1]}
                                    </span>
                                    <span className="opacity-40">·</span>
                                    <span className="flex items-center !gap-1">
                                        <Icon icon="solar:clock-circle-linear" />
                                        {lesson.startTime} – {lesson.endTime}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="!p-2 text-text-muted hover:text-text-main hover:!bg-background rounded-xl transition-colors shrink-0"
                        >
                            <Icon icon="material-symbols:close-rounded" className="text-xl" />
                        </button>
                    </div>

                    {/* Stats Row */}
                    <div className="!px-5 !pt-4 !pb-2 shrink-0">
                        <div className="grid grid-cols-2 sm:flex sm:flex-wrap !gap-2">
                            <div className="flex items-center !gap-2 !px-3 !py-2 !bg-green-500/10 border border-green-500/20 rounded-2xl">
                                <span className="w-2 h-2 rounded-full !bg-green-500 shrink-0" />
                                <span className="text-xs font-bold text-green-600">Hiện diện: {presentCount}</span>
                            </div>
                            <div className="flex items-center !gap-2 !px-3 !py-2 !bg-orange-500/10 border border-orange-500/20 rounded-2xl">
                                <span className="w-2 h-2 rounded-full !bg-orange-500 shrink-0" />
                                <span className="text-xs font-bold text-orange-600">Đi muộn: {lateCount}</span>
                            </div>
                            <div className="flex items-center !gap-2 !px-3 !py-2 !bg-red-500/10 border border-red-500/20 rounded-2xl">
                                <span className="w-2 h-2 rounded-full !bg-red-500 shrink-0" />
                                <span className="text-xs font-bold text-red-600">Vắng mặt: {absentCount}</span>
                            </div>
                            {noneCount > 0 && (
                                <div className="flex items-center !gap-2 !px-3 !py-2 !bg-background border border-border rounded-2xl">
                                    <Icon icon="material-symbols:pending-rounded" className="text-text-muted text-sm shrink-0" />
                                    <span className="text-xs font-semibold text-text-muted">Chưa điểm: {noneCount}</span>
                                </div>
                            )}
                        </div>

                        {/* Quick mark all */}
                        <div className="flex items-center !gap-2 !mt-3">
                            <span className="text-xs font-semibold text-text-muted shrink-0">Đánh dấu tất cả:</span>
                            <button
                                onClick={() => handleMarkAll('present')}
                                className="text-xs font-semibold !px-3 !py-1.5 rounded-xl !bg-green-500/10 text-green-600 border border-green-500/20 hover:!bg-green-500/20 transition-colors"
                            >
                                Hiện diện
                            </button>
                            <button
                                onClick={() => handleMarkAll('absent')}
                                className="text-xs font-semibold !px-3 !py-1.5 rounded-xl !bg-red-500/10 text-red-600 border border-red-500/20 hover:!bg-red-500/20 transition-colors"
                            >
                                Vắng mặt
                            </button>
                        </div>
                    </div>

                    {/* Student List */}
                    <div className="overflow-y-auto flex-1 !px-5 !pb-2">
                        <div className="!bg-background rounded-2xl border border-border overflow-hidden !mt-3">

                            {/* Desktop table header — hidden on mobile */}
                            <div className="hidden sm:grid grid-cols-[auto_1fr_auto] items-center !gap-4 !px-4 !py-2.5 border-b border-border !bg-surface/50">
                                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider w-16">Mã HS</span>
                                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Họ và Tên</span>
                                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider text-center pr-2">Trạng thái</span>
                            </div>

                            <div className="divide-y divide-border/50">
                                {students.map((student) => (
                                    <div key={student.id}>

                                        {/* Desktop row */}
                                        <div className="hidden sm:grid grid-cols-[auto_1fr_auto] items-center !gap-4 !px-4 !py-3 hover:!bg-primary/5 transition-colors">
                                            <span className="font-mono text-xs text-text-muted w-16 shrink-0">{student.id}</span>
                                            <div className="flex items-center !gap-2.5 min-w-0">
                                                <div className="w-8 h-8 rounded-full !bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <span className="font-semibold text-sm text-text-main truncate">{student.name}</span>
                                            </div>
                                            <div className="flex items-center !gap-1.5 shrink-0">
                                                {STATUS_OPTIONS.map(opt => (
                                                    <button
                                                        key={opt.key}
                                                        title={opt.label}
                                                        onClick={() => handleStatusChange(student.id, opt.key)}
                                                        className={`flex items-center !gap-1.5 !px-3 !py-1.5 rounded-xl border text-xs font-semibold transition-all whitespace-nowrap ${
                                                            student.status === opt.key
                                                                ? opt.activeClass
                                                                : `!bg-surface border-border text-text-muted ${opt.borderHover}`
                                                        }`}
                                                    >
                                                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${student.status === opt.key ? opt.dotClass : '!bg-border'}`} />
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Mobile row — tên + mã trên, 3 nút dưới */}
                                        <div className="sm:hidden !px-4 !py-3 hover:!bg-primary/5 transition-colors">
                                            <div className="flex items-center !gap-2.5 !mb-2.5">
                                                <div className="w-9 h-9 rounded-full !bg-primary/10 text-primary flex items-center justify-center font-bold text-sm uppercase shrink-0">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-sm text-text-main">{student.name}</p>
                                                    <p className="font-mono text-xs text-text-muted">{student.id}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center !gap-2">
                                                {STATUS_OPTIONS.map(opt => (
                                                    <button
                                                        key={opt.key}
                                                        onClick={() => handleStatusChange(student.id, opt.key)}
                                                        className={`flex-1 flex items-center justify-center !gap-1.5 !py-2 rounded-xl border text-xs font-semibold transition-all ${
                                                            student.status === opt.key
                                                                ? opt.activeClass
                                                                : `!bg-surface border-border text-text-muted ${opt.borderHover}`
                                                        }`}
                                                    >
                                                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${student.status === opt.key ? opt.dotClass : '!bg-border'}`} />
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="!p-5 border-t border-border flex items-center justify-end !gap-3 shrink-0">
                        <button
                            onClick={onClose}
                            className="!px-5 !py-2.5 text-sm font-semibold text-text-muted border border-border rounded-xl hover:!bg-background hover:text-text-main transition-all"
                        >
                            Huỷ
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex items-center !gap-2 !px-5 !py-2.5 !bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/30 hover:!bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <Icon icon="svg-spinners:ring-resize" className="text-lg" />
                            ) : (
                                <Icon icon="material-symbols:save-rounded" className="text-lg" />
                            )}
                            Lưu điểm danh
                        </button>
                    </div>
                </div>
            </div>
        </>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default AttendanceModal;