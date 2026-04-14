import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import useAuthStore from '../../../../../../store/authStore';
import { sessionService } from '../../../../api/sessionService';

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
    const [isLoading, setIsLoading] = useState(false);

    // If there is ANY existing attendance we treat it as Edit mode
    const isEditMode = students.some(s => s.status !== 'none' && s.attendanceId);

    useEffect(() => {
        if (isOpen && lesson) {
            const fetchAttendance = async () => {
                setIsLoading(true);
                const token = useAuthStore.getState().user?.token;
                try {
                    const res = await sessionService.getAttendance(lesson.id, token);
                    if (res.ok) {
                        const data = await res.json();
                        const mapped = data.map(item => ({
                            id: item.studentId,
                            name: item.fullName,
                            attendanceId: item.attendanceId,
                            status: item.status ? item.status.toLowerCase() : 'none',
                            isExcused: item.isExcused || false,
                            note: item.note || ''
                        }));
                        setStudents(mapped);
                    } else {
                        toast.error('Lỗi khi tải danh sách điểm danh');
                    }
                } catch (err) {
                    toast.error('Lỗi kết nối máy chủ');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchAttendance();
        } else {
            setStudents([]);
        }
    }, [isOpen, lesson]);

    if (!isOpen || !lesson) return null;

    const handleStatusChange = (studentId, status) => {
        setStudents(prev => prev.map(s => s.id === studentId ? { ...s, status } : s));
    };

    const handleNoteChange = (studentId, note) => {
        setStudents(prev => prev.map(s => s.id === studentId ? { ...s, note } : s));
    };

    const handleExcusedChange = (studentId, isExcused) => {
        setStudents(prev => prev.map(s => s.id === studentId ? { ...s, isExcused } : s));
    };

    const handleMarkAll = (status) => {
        setStudents(prev => prev.map(s => ({ ...s, status })));
    };

    const handleSubmit = async () => {
        const unchecked = students.filter(s => s.status === 'none');
        if (unchecked.length > 0) {
            toast.warning(`Còn ${unchecked.length} học sinh chưa được điểm danh!`);
            return;
        }

        setIsSubmitting(true);
        const token = useAuthStore.getState().user?.token;
        const payload = students.map(s => ({
            studentId: s.id,
            status: s.status.charAt(0).toUpperCase() + s.status.slice(1), // "present" -> "Present", "absent" -> "Absent"
            isExcused: s.isExcused,
            note: s.note
        }));

        try {
            const res = await sessionService.saveAttendance(lesson.id, payload, token);

            if (res.ok) {
                toast.success(`Đã lưu điểm danh Buổi ${lesson.session} thành công!`);
                onSave(lesson.id, students);
            } else {
                toast.error('Có lỗi xảy ra khi lưu điểm danh');
            }
        } catch (err) {
            toast.error('Lỗi kết nối máy chủ');
        } finally {
            setIsSubmitting(false);
        }
    };

    const presentCount = students.filter(s => s.status === 'present').length;
    const lateCount = students.filter(s => s.status === 'late').length;
    const absentCount = students.filter(s => s.status === 'absent').length;
    const noneCount = students.filter(s => s.status === 'none').length;

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        // handle YYYY-MM-DD
        const datePart = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
        return new Date(datePart + 'T00:00:00').toLocaleDateString('vi-VN', {
            weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric'
        });
    };

    const formattedDateSplitted = formatDate(lesson.date).split(', ');
    const displayDate = formattedDateSplitted.length > 1 ? formattedDateSplitted[1] : lesson.date;

    const modalContent = (
        <>
            <div
                style={{ zIndex: 9998 }}
                className="fixed inset-0 !bg-black/60 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            <div style={{ zIndex: 9999 }} className="fixed inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center sm:!p-4 pointer-events-none">
                <div className="!bg-surface border border-border border-b-0 sm:border-b rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl w-full sm:max-w-2xl max-h-[92dvh] sm:max-h-[90vh] flex flex-col pointer-events-auto animate-fade-in-up relative">

                    {isLoading && (
                        <div className="absolute inset-0 z-10 !bg-surface/80 backdrop-blur-[2px] rounded-t-[2rem] sm:rounded-[2rem] flex items-center justify-center">
                            <Icon icon="line-md:loading-loop" className="text-4xl text-primary" />
                        </div>
                    )}

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
                                        {lesson.day}, {displayDate}
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
                        <div className="flex items-center !gap-2 !mt-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                            <span className="text-xs font-semibold text-text-muted shrink-0">Đánh dấu tất cả:</span>
                            <button
                                onClick={() => handleMarkAll('present')}
                                className="text-xs font-semibold !px-3 !py-1.5 rounded-xl !bg-green-500/10 text-green-600 border border-green-500/20 hover:!bg-green-500/20 transition-colors whitespace-nowrap"
                            >
                                Hiện diện
                            </button>
                            <button
                                onClick={() => handleMarkAll('absent')}
                                className="text-xs font-semibold !px-3 !py-1.5 rounded-xl !bg-red-500/10 text-red-600 border border-red-500/20 hover:!bg-red-500/20 transition-colors whitespace-nowrap"
                            >
                                Vắng mặt
                            </button>
                        </div>
                    </div>

                    {/* Student List */}
                    <div className="overflow-y-auto flex-1 !px-5 !pb-2">
                        <div className="!bg-background rounded-2xl border border-border overflow-hidden !mt-3">
                            <div className="hidden sm:grid grid-cols-[auto_1fr_auto] items-center !gap-4 !px-4 !py-2.5 border-b border-border !bg-surface/50">
                                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider w-16">Mã HS</span>
                                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Họ và Tên</span>
                                <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider text-center flex-1">Trạng thái</span>
                            </div>

                            <div className="flex flex-col">
                                {students.map((student) => (
                                    <div key={student.id} className="flex flex-col border-b border-border hover:!bg-primary/5 transition-colors pb-1 sm:pb-0">
                                        {/* Desktop row */}
                                        <div className="hidden sm:grid grid-cols-[auto_1fr_auto] items-center !gap-4 !px-4 !py-3">
                                            <span className="font-mono text-xs text-text-muted w-16 shrink-0" title={student.id}>
                                                {student.id.substring(0, 8).toUpperCase()}
                                            </span>
                                            <div className="flex items-center !gap-2.5 min-w-0">
                                                <div className="w-8 h-8 rounded-full !bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <span className="font-semibold text-sm text-text-main truncate">{student.name}</span>
                                            </div>
                                            <div className="flex items-center justify-end !gap-1.5 shrink-0">
                                                {STATUS_OPTIONS.map(opt => (
                                                    <button
                                                        key={opt.key}
                                                        title={opt.label}
                                                        onClick={() => handleStatusChange(student.id, opt.key)}
                                                        className={`flex items-center !gap-1.5 !px-3 !py-1.5 rounded-xl border text-xs font-semibold transition-all whitespace-nowrap ${student.status === opt.key
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

                                        {/* Mobile row */}
                                        <div className="sm:hidden !px-4 !pt-3 !pb-2">
                                            <div className="flex items-center !gap-2.5 !mb-2.5">
                                                <div className="w-9 h-9 rounded-full !bg-primary/10 text-primary flex items-center justify-center font-bold text-sm uppercase shrink-0">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-sm text-text-main">{student.name}</p>
                                                    <p className="font-mono text-xs text-text-muted">{student.id.substring(0, 8).toUpperCase()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center !gap-2">
                                                {STATUS_OPTIONS.map(opt => (
                                                    <button
                                                        key={opt.key}
                                                        onClick={() => handleStatusChange(student.id, opt.key)}
                                                        className={`flex-1 flex items-center justify-center !gap-1.5 !py-2 rounded-xl border text-xs font-semibold transition-all ${student.status === opt.key
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

                                        {/* Add Note & isExcused section for absent or late */}
                                        {(student.status === 'absent' || student.status === 'late') && (
                                            <div className="!px-4 !pb-3 sm:!pl-[5.5rem] !pt-0 flex flex-col sm:flex-row items-start sm:items-center !gap-3 animate-fade-in mt-1 sm:mt-0">
                                                <label className="flex items-center !gap-2 cursor-pointer group shrink-0">
                                                    <input
                                                        type="checkbox"
                                                        checked={student.isExcused}
                                                        onChange={(e) => handleExcusedChange(student.id, e.target.checked)}
                                                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                                                    />
                                                    <span className="text-xs font-semibold text-text-main group-hover:text-primary transition-colors">Có phép</span>
                                                </label>
                                                <div className="relative w-full sm:flex-1">
                                                    <Icon icon="solar:pen-new-square-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted/70" />
                                                    <input
                                                        type="text"
                                                        value={student.note}
                                                        onChange={(e) => handleNoteChange(student.id, e.target.value)}
                                                        placeholder="Ghi chú (Lý do nghỉ / muộn...)"
                                                        className="w-full text-xs !pl-9 !pr-3 !py-2 rounded-xl border border-border bg-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-medium placeholder:text-text-muted/50"
                                                    />
                                                </div>
                                            </div>
                                        )}
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
                            disabled={isSubmitting || isLoading}
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