import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import useAuthStore from '../../../store/authStore';
import { sessionService } from '../../dashboard/api/sessionService';
import studentScheduleService from '../../dashboard/api/studentScheduleService';
import SessionModal from '../../dashboard/components/classes/detail/components/SessionModal';
import ConfirmModal from '../../../components/ui/ConfirmModal';

const COLOR_OPTIONS = ['blue', 'purple', 'green', 'orange'];
const COLOR_MAP = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
    purple: { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200', dot: 'bg-violet-500' },
    green: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
    red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200', dot: 'bg-red-400' },
};

const STATUS_LABEL = {
    scheduled: 'Sắp diễn ra',
    'sắp diễn ra': 'Sắp diễn ra',
    completed: 'Hoàn thành',
    'đã kết thúc': 'Đã kết thúc',
    cancelled: 'Đã hủy',
    canceled: 'Đã hủy',
    'đã hủy': 'Đã hủy',
};

const ATTENDANCE_CONFIG = {
    'Có mặt': { label: 'Có mặt', bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', icon: 'solar:check-circle-bold' },
    'Vắng mặt': { label: 'Vắng mặt', bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200', icon: 'solar:close-circle-bold' },
    'Chưa điểm danh': { label: 'Chưa điểm danh', bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', icon: 'solar:clock-circle-bold' },
    'N/A': null,
};

const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
};

const toDateStr = (d) => {
    const offset = d.getTimezoneOffset();
    let d_copy = new Date(d.getTime() - (offset * 60 * 1000));
    return d_copy.toISOString().split('T')[0];
};

const WEEKDAYS_VN = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
const MONTHS_VN = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

// --- Student Lesson Card (read-only) ---
const StudentLessonCard = ({ lesson }) => {
    const c = COLOR_MAP[lesson.color] || COLOR_MAP.blue;
    const att = ATTENDANCE_CONFIG[lesson.attendanceStatus];
    const statusStr = lesson.status?.toLowerCase() || '';
    const isCancelled = statusStr.includes('hủy') || statusStr === 'cancelled' || statusStr === 'canceled';
    const isEnded = statusStr.includes('kết thúc') || statusStr === 'completed';
    const isUpcoming = statusStr.includes('sắp') || statusStr === 'scheduled';

    return (
        <div className={`flex flex-col rounded-xl overflow-hidden border border-border bg-background shadow-sm hover:shadow-md hover:border-primary/40 transition-all ${isCancelled ? 'opacity-60 grayscale' : ''}`}>
            <div className={`!px-2 !py-1.5 ${c.bg} ${c.text} flex items-center justify-between shrink-0`}>
                <p className="font-bold text-[10px] sm:text-[11px] truncate leading-none">
                    {lesson.startTime && lesson.startTime !== '--:--' ? `${lesson.startTime} – ${lesson.endTime}` : lesson.date}
                </p>
                <div className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
            </div>

            <div className="!px-2 !py-2 !space-y-1.5 border-b border-border flex-1">
                <p className={`font-semibold text-[11px] sm:text-xs leading-snug line-clamp-2 ${isCancelled ? 'text-red-500 line-through' : 'text-text-main'}`}>
                    {lesson.className}
                </p>

                {/* Attendance Badge */}
                {att && (
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${att.bg} ${att.text} ${att.border}`}>
                        <Icon icon={att.icon} className="shrink-0" />
                        {att.label}
                    </span>
                )}

                {/* Meeting link for upcoming */}
                {lesson.raw?.meetingLink && (
                    <a href={lesson.raw.meetingLink} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                        className="flex inline-flex items-center !gap-1 text-[10px] text-blue-500 hover:text-blue-700 bg-blue-50 !px-1.5 !py-0.5 rounded-md hover:underline truncate">
                        <Icon icon="solar:link-minimalistic-linear" className="shrink-0" /> Tham gia
                    </a>
                )}
            </div>

            <div className={`px-2 py-1.5 text-center text-[10px] font-bold ${isUpcoming ? 'bg-blue-50 text-blue-600' :
                    isEnded ? 'bg-gray-50 text-gray-500' :
                        'bg-red-50 text-red-500'
                }`}>
                {STATUS_LABEL[lesson.status?.toLowerCase()] || lesson.status || '—'}
            </div>
        </div>
    );
};

// --- Teacher Lesson Card (with edit/delete) ---
const TeacherLessonCard = ({ lesson, onEdit, onDelete }) => {
    const isCancelled = lesson.status === 'cancelled' || lesson.status === 'canceled';
    const c = COLOR_MAP[isCancelled ? 'red' : lesson.color];

    return (
        <div className={`flex flex-col rounded-xl overflow-hidden border border-border bg-background shadow-sm hover:shadow-md hover:border-primary/40 transition-all ${isCancelled ? 'opacity-70 grayscale' : ''}`}>
            <div className={`!px-2 !py-1.5 ${c.bg} ${c.text} flex items-center justify-between shrink-0`}>
                <p className="font-bold text-[10px] sm:text-[11px] truncate leading-none">
                    {lesson.startTime} – {lesson.endTime}
                </p>
                <div className={`w-2 h-2 rounded-full shrink-0 shadow-sm ${c.dot}`} />
            </div>

            <div className="!px-2 !py-2 !space-y-1 border-b border-border flex-1 min-h-[50px]">
                <p className={`font-semibold text-[11px] sm:text-xs leading-snug line-clamp-2 ${isCancelled ? 'text-red-500 line-through' : 'text-text-main'}`} title={lesson.className}>
                    {lesson.className}
                </p>
                {lesson.topic && <p className="text-[10px] text-text-muted truncate">CĐ: {lesson.topic}</p>}
                {lesson.raw.meetingLink && (
                    <a href={lesson.raw.meetingLink} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                        className="flex inline-flex items-center !gap-1 text-[10px] text-blue-500 hover:text-blue-700 bg-blue-50 !px-1.5 !py-0.5 rounded-md hover:underline truncate">
                        <Icon icon="solar:link-minimalistic-linear" className="shrink-0" /> Link
                    </a>
                )}
            </div>

            <div className="flex gap-1.5 p-1.5 bg-surface shrink-0">
                <button onClick={(e) => { e.stopPropagation(); onEdit(lesson); }}
                    className="flex flex-1 items-center justify-center !p-1 sm:!px-0 sm:!py-1.5 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-500 hover:text-white transition-colors"
                    title="Chỉnh sửa buổi học">
                    <Icon icon="solar:pen-bold-duotone" className="text-sm sm:text-base cursor-pointer" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(lesson.id); }}
                    className="flex flex-1 items-center justify-center !p-1 sm:!px-0 sm:!py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                    title="Xóa buổi học">
                    <Icon icon="solar:trash-bin-trash-bold-duotone" className="text-sm sm:text-base cursor-pointer" />
                </button>
            </div>
        </div>
    );
};

// --- Week View ---
const WeekView = ({ weekStart, lessons, onEdit, onDelete, isStudent }) => {
    const today = toDateStr(new Date());
    const [selectedDateStr, setSelectedDateStr] = useState(today);

    useEffect(() => {
        const currentDays = Array.from({ length: 7 }, (_, i) => toDateStr(addDays(weekStart, i)));
        if (!currentDays.includes(selectedDateStr)) {
            if (currentDays.includes(today)) {
                setSelectedDateStr(today);
            } else {
                setSelectedDateStr(currentDays[0]);
            }
        }
    }, [weekStart, today, selectedDateStr]);

    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const selectedLessons = lessons
        .filter(l => l.date === selectedDateStr)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

    return (
        <div className="!space-y-6">
            <div className="grid grid-cols-7 !gap-2 sm:!gap-4">
                {days.map((day, i) => {
                    const ds = toDateStr(day);
                    const isToday = ds === today;
                    const isSelected = ds === selectedDateStr;
                    const dayLessons = lessons.filter(l => l.date === ds);
                    const dots = [...new Set(dayLessons.map(l => l.color))].slice(0, 3);

                    return (
                        <button key={`tab-${i}`} onClick={() => setSelectedDateStr(ds)}
                            className={`flex flex-col items-center justify-center !py-3 sm:!py-4 rounded-xl border transition-all ${isSelected
                                    ? '!bg-primary border-primary shadow-lg shadow-primary/30 transform scale-[1.02] relative z-10'
                                    : 'bg-surface border-border hover:border-primary/40 hover:bg-background'
                                }`}>
                            <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider !mb-1 ${isSelected ? 'text-white/90' : isToday ? 'text-primary' : 'text-text-muted'}`}>
                                {WEEKDAYS_VN[i]}
                            </p>
                            <div className={`text-lg sm:text-xl font-extrabold ${isSelected ? 'text-white' : 'text-text-main'}`}>
                                {day.getDate()}
                            </div>
                            <div className="flex gap-1 h-1.5 mt-2">
                                {dayLessons.length > 0 ? (
                                    dots.map((color, idx) => (
                                        <div key={idx} className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : COLOR_MAP[color]?.dot || 'bg-primary'}`} />
                                    ))
                                ) : (
                                    <div className="w-1.5 h-1.5 rounded-full opacity-0" />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="bg-background rounded-[2rem] border border-border !p-6 shadow-inner min-h-[300px]">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Icon icon="solar:calendar-mark-bold-duotone" className="text-xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-text-main">
                            {isStudent ? 'Lịch học' : 'Lịch dạy'} {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </h3>
                        <p className="text-xs text-text-muted mt-0.5">
                            {selectedLessons.length > 0 ? `Có ${selectedLessons.length} buổi học trong ngày này.` : 'Không có buổi học nào.'}
                        </p>
                    </div>
                </div>

                {selectedLessons.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 !gap-4 animate-fade-in-up">
                        {selectedLessons.map(lesson => (
                            isStudent
                                ? <StudentLessonCard key={lesson.id} lesson={lesson} />
                                : <TeacherLessonCard key={lesson.id} lesson={lesson} onEdit={onEdit} onDelete={onDelete} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-text-muted opacity-60">
                        <Icon icon="solar:sleeping-bold-duotone" className="text-5xl mb-3" />
                        <p className="text-sm font-semibold">{isStudent ? 'Không có buổi học nào.' : 'Trống lịch! Bạn có thể thoải mái thư giãn.'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Month View ---
const MonthView = ({ year, month, lessons, onEdit, onDelete, isStudent }) => {
    const today = toDateStr(new Date());
    const [selectedDateStr, setSelectedDateStr] = useState(today);

    useEffect(() => {
        const selDate = new Date(selectedDateStr);
        if (selDate.getFullYear() !== year || selDate.getMonth() !== month) {
            const tDate = new Date(today);
            if (tDate.getFullYear() === year && tDate.getMonth() === month) {
                setSelectedDateStr(today);
            } else {
                setSelectedDateStr(toDateStr(new Date(year, month, 1)));
            }
        }
    }, [year, month, today, selectedDateStr]);

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    let startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) cells.push(new Date(year, month, d));

    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

    const selectedLessons = lessons
        .filter(l => l.date === selectedDateStr)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

    return (
        <div className="flex flex-col xl:flex-row !gap-6">
            <div className="flex-1 xl:w-2/3 bg-background rounded-[2rem] !p-6 border border-border shadow-inner">
                <div className="grid grid-cols-7 !mb-4">
                    {WEEKDAYS_VN.map(d => (
                        <div key={d} className="text-center text-xs font-bold text-text-muted uppercase tracking-wider">{d}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 !gap-2">
                    {weeks.map((week, wi) => (
                        <React.Fragment key={wi}>
                            {(week.length < 7 ? [...week, ...Array(7 - week.length).fill(null)] : week).map((day, di) => {
                                if (!day) return <div key={`empty-${wi}-${di}`} className="min-h-[60px] sm:min-h-[80px] rounded-xl bg-surface/30" />;

                                const ds = toDateStr(day);
                                const isToday = ds === today;
                                const isSelected = ds === selectedDateStr;
                                const dayLessons = lessons.filter(l => l.date === ds);
                                const dots = [...new Set(dayLessons.map(l => l.color))].slice(0, 3);

                                return (
                                    <button key={`day-${di}`} onClick={() => setSelectedDateStr(ds)}
                                        className={`flex flex-col min-h-[60px] sm:min-h-[80px] rounded-xl border !p-2 items-center transition-all ${isSelected
                                                ? 'border-primary ring-2 ring-primary/20 bg-primary/5 shadow-sm transform scale-[1.02] relative z-10'
                                                : 'border-border bg-surface hover:border-primary/50 hover:bg-background'
                                            }`}>
                                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${isSelected ? 'bg-primary text-white shadow-md' : isToday ? 'text-primary bg-primary/10' : 'text-text-main'
                                            }`}>
                                            {day.getDate()}
                                        </div>
                                        <div className="flex gap-1 mt-auto pb-1 h-2">
                                            {dayLessons.length > 0 ? (
                                                dots.map((color, idx) => (
                                                    <div key={idx} className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : COLOR_MAP[color]?.dot || 'bg-primary'}`} />
                                                ))
                                            ) : (
                                                <div className="w-1.5 h-1.5 rounded-full opacity-0" />
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="xl:w-1/3 flex flex-col bg-surface rounded-[2rem] border border-border !p-6 shadow-sm min-h-[400px]">
                <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Icon icon="solar:calendar-mark-bold-duotone" className="text-xl" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-text-main leading-tight tracking-tight">
                                {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit' })}
                            </h3>
                            <p className="text-xs text-text-muted mt-0.5">{selectedLessons.length} buổi học</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar !pr-2">
                    {selectedLessons.length > 0 ? (
                        <div className="flex flex-col gap-4 animate-fade-in-right">
                            {selectedLessons.map(lesson => (
                                isStudent
                                    ? <StudentLessonCard key={lesson.id} lesson={lesson} />
                                    : <TeacherLessonCard key={lesson.id} lesson={lesson} onEdit={onEdit} onDelete={onDelete} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-text-muted opacity-60 min-h-[200px]">
                            <Icon icon="solar:sleeping-bold-duotone" className="text-5xl mb-3" />
                            <p className="text-sm font-semibold">Hiện không có buổi học</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Upcoming List ---
const UpcomingList = ({ lessons, isStudent }) => {
    const today = toDateStr(new Date());
    const upcoming = lessons
        .filter(l => l.date >= today)
        .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
        .slice(0, 8);

    if (upcoming.length === 0) {
        return <div className="text-sm text-text-muted text-center !py-8">Không có lịch sắp tới</div>;
    }

    return (
        <div className="!space-y-2">
            {upcoming.map(lesson => {
                const c = COLOR_MAP[lesson.color] || COLOR_MAP.blue;
                const d = new Date(lesson.date + 'T00:00:00');
                const att = isStudent ? ATTENDANCE_CONFIG[lesson.attendanceStatus] : null;
                return (
                    <div key={`upcoming-${lesson.id}`} className="flex items-center !gap-3 !px-4 !py-3 bg-background border border-border rounded-2xl hover:border-primary/30 hover:shadow-sm transition-all relative overflow-hidden">
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${c.bg} brightness-90`} />
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${c.dot} shadow-sm`} />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate text-text-main">{lesson.className}</p>
                            <p className="text-[11px] font-medium text-text-muted mt-0.5">
                                {d.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' })}
                                {lesson.startTime && lesson.startTime !== '--:--' ? ` · ${lesson.startTime}–${lesson.endTime}` : ''}
                            </p>
                        </div>
                        {isStudent && att && (
                            <span className={`shrink-0 text-[10px] font-bold !px-2 !py-1 rounded-lg border flex items-center gap-1 ${att.bg} ${att.text} ${att.border}`}>
                                {att.label}
                            </span>
                        )}
                        {!isStudent && (
                            <span className={`shrink-0 text-[10px] font-bold !px-2 !py-1 rounded-lg border flex items-center gap-1 ${c.bg} ${c.text} ${c.border}`}>
                                {STATUS_LABEL[lesson.status] || lesson.status}
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

// --- Main Page ---
const ScheduleManagementPage = () => {
    const { user } = useAuthStore();
    const token = user?.token;
    const isStudent = user?.role?.toUpperCase() === 'STUDENT';

    const [viewMode, setViewMode] = useState('week');
    const [refDate, setRefDate] = useState(new Date());

    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    const [sessionModalState, setSessionModalState] = useState({ isOpen: false, initialData: null });
    const [deletingId, setDeletingId] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, sessionId: null });

    // --- Fetch: Student (all classes, no ClassID) ---
    const fetchStudentSchedule = useCallback(async () => {
        if (!token) return;
        try {
            setLoading(true);
            const res = await studentScheduleService.getSchedule(
                { FromDate: '2024-01-01', ToDate: '2027-12-31' },
                token
            );
            if (res.ok) {
                const json = await res.json();
                const data = Array.isArray(json) ? json : (json.data || []);

                const uniqueClassIds = [...new Set(data.map(i => i.classID))];
                const mapped = data.map(item => {
                    const classIdx = uniqueClassIds.indexOf(item.classID);
                    return {
                        id: item.sessionID,
                        classId: item.classID,
                        className: item.className || `Lớp ${item.classID?.substring(0, 6)}`,
                        date: item.date ? item.date.split('T')[0] : '',
                        startTime: item.startTime?.substring(0, 5) || '--:--',
                        endTime: item.endTime?.substring(0, 5) || '--:--',
                        status: item.status || 'N/A',
                        attendanceStatus: item.attendanceStatus || 'N/A',
                        color: COLOR_OPTIONS[classIdx % COLOR_OPTIONS.length],
                        raw: item,
                    };
                });
                setLessons(mapped);
            } else {
                toast.error('Không thể tải thời khóa biểu');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    // --- Fetch: Teacher ---
    const fetchTeacherSchedule = useCallback(async () => {
        if (!token) return;

        const currentMonth = refDate.getMonth();
        const currentYear = refDate.getFullYear();
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        firstDay.setDate(firstDay.getDate() - 7);
        lastDay.setDate(lastDay.getDate() + 7);

        try {
            setLoading(true);
            const res = await sessionService.getTeacherSchedule(token, toDateStr(firstDay), toDateStr(lastDay));
            if (res.ok) {
                const data = await res.json();
                const uniqueClassIds = [...new Set(data.map(i => i.classId))];
                const mapped = data.map(item => {
                    const classIdx = uniqueClassIds.indexOf(item.classId);
                    return {
                        id: item.sessionId,
                        classId: item.classId,
                        className: item.title || `Class ${item.classId?.substring(0, 6)}`,
                        date: item.date ? item.date.split('T')[0] : '',
                        startTime: item.startTime?.substring(0, 5) || '--:--',
                        endTime: item.endTime?.substring(0, 5) || '--:--',
                        status: item.status ? item.status.toLowerCase() : 'scheduled',
                        color: COLOR_OPTIONS[classIdx % COLOR_OPTIONS.length],
                        title: item.title,
                        topic: item.topic,
                        note: item.note,
                        raw: item,
                    };
                });
                setLessons(mapped);
            } else {
                toast.error('Không thể tải Lịch dạy');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [token, refDate]);

    useEffect(() => {
        if (isStudent) fetchStudentSchedule();
        else fetchTeacherSchedule();
    }, [isStudent, fetchStudentSchedule, fetchTeacherSchedule]);

    // --- Teacher handlers ---
    const handleEditLesson = (lesson) => setSessionModalState({ isOpen: true, initialData: lesson.raw });
    const handleDeleteLesson = (id) => setConfirmModal({ isOpen: true, sessionId: id });

    const handleConfirmDelete = async () => {
        const id = confirmModal.sessionId;
        if (!id) return;
        try {
            setDeletingId(id);
            const res = await sessionService.deleteSession(id, token);
            if (res.ok) {
                toast.success('Đã xóa buổi học thành công!');
                fetchTeacherSchedule();
            } else {
                toast.error('Lỗi khi xóa!');
            }
        } catch {
            toast.error('Lỗi mạng!');
        } finally {
            setDeletingId(null);
            setConfirmModal({ isOpen: false, sessionId: null });
        }
    };

    const handleSaveSessionAPI = async (formData) => {
        try {
            const isEdit = sessionModalState.initialData?.sessionId;
            const payload = {
                classId: sessionModalState.initialData?.classId,
                title: formData.title,
                date: formData.date,
                startTime: formData.startTime.length === 5 ? `${formData.startTime}:00` : formData.startTime,
                endTime: formData.endTime.length === 5 ? `${formData.endTime}:00` : formData.endTime,
                meetingLink: formData.meetingLink,
                topic: formData.topic,
                note: formData.note,
            };
            const res = isEdit
                ? await sessionService.updateSession(sessionModalState.initialData.sessionId, payload, token)
                : await sessionService.createSession(payload, token);

            if (res.ok) {
                toast.success(isEdit ? 'Cập nhật thành công!' : 'Tạo mới thành công!');
                setSessionModalState({ isOpen: false, initialData: null });
                fetchTeacherSchedule();
            } else {
                toast.error('Lưu thất bại!');
            }
        } catch {
            toast.error('Lỗi hệ thống!');
        }
    };

    // --- Navigation ---
    const getWeekStart = (d) => {
        const date = new Date(d);
        const day = date.getDay();
        const diff = day === 0 ? -6 : 1 - day;
        date.setDate(date.getDate() + diff);
        date.setHours(0, 0, 0, 0);
        return date;
    };

    const weekStart = getWeekStart(refDate);
    const weekEnd = addDays(weekStart, 6);
    const currentMonth = refDate.getMonth();
    const currentYear = refDate.getFullYear();

    const prevPeriod = () => {
        if (viewMode === 'week') setRefDate(prev => addDays(prev, -7));
        else setRefDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };
    const nextPeriod = () => {
        if (viewMode === 'week') setRefDate(prev => addDays(prev, 7));
        else setRefDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };
    const goToday = () => setRefDate(new Date());

    const periodLabel = viewMode === 'week'
        ? `${weekStart.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} – ${weekEnd.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}`
        : `${MONTHS_VN[currentMonth]} ${currentYear}`;

    // --- Stats ---
    const todayStr = toDateStr(new Date());
    const totalToday = lessons.filter(l => l.date === todayStr).length;
    const totalClasses = [...new Set(lessons.map(l => l.classId))].length;

    // Student stats
    const totalPresent = isStudent ? lessons.filter(l => l.attendanceStatus === 'Có mặt').length : 0;
    const totalAbsent = isStudent ? lessons.filter(l => l.attendanceStatus === 'Vắng mặt').length : 0;
    const totalUpcoming = lessons.filter(l => {
        const s = l.status?.toLowerCase() || '';
        return l.date >= todayStr && (s.includes('sắp') || s === 'scheduled');
    }).length;

    // Teacher stats
    const totalScheduled = !isStudent ? lessons.filter(l => l.status === 'scheduled').length : 0;
    const totalCompleted = !isStudent ? lessons.filter(l => l.status === 'completed').length : 0;

    const stats = isStudent ? [
        { icon: 'solar:users-group-rounded-bold-duotone', color: 'text-primary bg-primary/10 border-primary/20', label: 'Lớp đang học', value: totalClasses },
        { icon: 'solar:clock-circle-bold-duotone', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', label: 'Buổi hôm nay', value: totalToday },
        { icon: 'solar:check-circle-bold-duotone', color: 'text-green-500 bg-green-500/10 border-green-500/20', label: 'Đã có mặt', value: totalPresent },
        { icon: 'solar:calendar-mark-bold-duotone', color: 'text-orange-500 bg-orange-500/10 border-orange-500/20', label: 'Sắp diễn ra', value: totalUpcoming },
    ] : [
        { icon: 'solar:users-group-rounded-bold-duotone', color: 'text-primary bg-primary/10 border-primary/20', label: 'Lớp tham gia', value: totalClasses },
        { icon: 'solar:clock-circle-bold-duotone', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', label: 'Buổi hôm nay', value: totalToday },
        { icon: 'solar:calendar-mark-bold-duotone', color: 'text-orange-500 bg-orange-500/10 border-orange-500/20', label: 'Sắp diễn ra', value: totalScheduled },
        { icon: 'solar:check-circle-bold-duotone', color: 'text-green-500 bg-green-500/10 border-green-500/20', label: 'Hoàn thành', value: totalCompleted },
    ];

    return (
        <div className="w-full !space-y-6 animate-fade-in relative min-h-[400px]">
            {loading && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-[2rem]">
                    <Icon icon="line-md:loading-loop" className="text-4xl text-primary" />
                </div>
            )}

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center !gap-4 bg-surface !p-6 rounded-[2rem] border border-border shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-text-main flex items-center !gap-3 font-['Outfit']">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <Icon icon="solar:calendar-bold-duotone" className="text-3xl" />
                        </div>
                        {isStudent ? 'Thời khóa biểu' : 'Lịch dạy tổng hợp'}
                    </h1>
                    <p className="text-text-muted text-sm mt-1 sm:ml-[60px]">
                        {isStudent ? 'Toàn bộ lịch học của bạn từ tất cả các lớp' : 'Quản lý và cập nhật toàn bộ biểu đồ lịch dạy'}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center !gap-3 w-full sm:w-auto">
                    <div className="flex items-center bg-background border border-border rounded-xl !p-1 shadow-inner">
                        <button onClick={() => setViewMode('week')}
                            className={`flex-1 sm:flex-none flex justify-center items-center !gap-2 !px-4 !py-2.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'week' ? '!bg-primary text-white shadow-md' : 'text-text-muted hover:text-text-main hover:bg-surface'}`}>
                            <Icon icon="solar:calendar-date-bold-duotone" className="text-lg" /> Tuần
                        </button>
                        <button onClick={() => setViewMode('month')}
                            className={`flex-1 sm:flex-none flex justify-center items-center !gap-2 !px-4 !py-2.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'month' ? '!bg-primary text-white shadow-md' : 'text-text-muted hover:text-text-main hover:bg-surface'}`}>
                            <Icon icon="solar:calendar-bold-duotone" className="text-lg" /> Tháng
                        </button>
                    </div>

                    <div className="flex items-center !gap-1.5 justify-center">
                        <button onClick={prevPeriod} className="w-10 h-10 bg-background border border-border rounded-xl text-text-muted hover:bg-primary/5 hover:text-primary hover:border-primary/30 shadow-sm transition-all flex items-center justify-center">
                            <Icon icon="material-symbols:chevron-left-rounded" className="text-2xl" />
                        </button>
                        <button onClick={goToday} className="flex items-center justify-center !px-4 h-10 bg-background border border-border rounded-xl text-xs font-bold text-text-main hover:bg-primary/5 hover:text-primary hover:border-primary/30 shadow-sm transition-all">
                            Hôm nay
                        </button>
                        <button onClick={nextPeriod} className="w-10 h-10 bg-background border border-border rounded-xl text-text-muted hover:bg-primary/5 hover:text-primary hover:border-primary/30 shadow-sm transition-all flex items-center justify-center">
                            <Icon icon="material-symbols:chevron-right-rounded" className="text-2xl" />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Quick Stats ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 !gap-4">
                {stats.map((s, i) => (
                    <div key={i} className={`bg-surface/60 backdrop-blur-sm !p-5 rounded-[1.5rem] border ${s.color.split(' ')[2] || 'border-border'} flex items-center !gap-4 shadow-sm hover:shadow-md transition-shadow`}>
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${s.color.split(' ').slice(0, 2).join(' ')} shadow-inner`}>
                            <Icon icon={s.icon} className="text-3xl" />
                        </div>
                        <div>
                            <p className="text-3xl font-extrabold text-text-main font-['Outfit']">{s.value}</p>
                            <p className="text-xs font-semibold text-text-muted mt-0.5">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Main Calendar + Upcoming ── */}
            <div className="flex flex-col lg:flex-row !gap-6">
                <div className="flex-1 overflow-x-auto bg-surface !p-6 rounded-[2rem] border border-border shadow-sm min-h-[600px]">
                    <div className="flex items-center justify-between !mb-6 sticky left-4 right-4">
                        <div className="flex items-center !gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <Icon icon="solar:calendar-minimalistic-bold-duotone" className="text-xl" />
                            </div>
                            <h2 className="text-xl font-bold text-text-main font-['Outfit'] uppercase tracking-wide">
                                {periodLabel}
                            </h2>
                        </div>
                    </div>

                    <div className="min-w-[800px]">
                        {viewMode === 'week'
                            ? <WeekView weekStart={weekStart} lessons={lessons} onEdit={handleEditLesson} onDelete={handleDeleteLesson} isStudent={isStudent} />
                            : <MonthView year={currentYear} month={currentMonth} lessons={lessons} onEdit={handleEditLesson} onDelete={handleDeleteLesson} isStudent={isStudent} />
                        }
                    </div>
                </div>

                {/* Upcoming sidebar */}
                <div className="lg:w-80 shrink-0 bg-surface !p-6 rounded-[2rem] border border-border shadow-sm self-start sticky top-6">
                    <div className="flex items-center !gap-3 !mb-6">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <Icon icon="solar:bell-bing-bold-duotone" className="text-xl" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-text-main leading-tight">Sắp diễn ra</h2>
                            <p className="text-[11px] text-text-muted mt-0.5">Các buổi học thời gian tới</p>
                        </div>
                    </div>
                    <div className="bg-background !p-2 rounded-[1.5rem] border border-border">
                        <UpcomingList lessons={lessons} isStudent={isStudent} />
                    </div>
                </div>
            </div>

            {/* Modals (Teacher only) */}
            {!isStudent && (
                <>
                    <SessionModal
                        isOpen={sessionModalState.isOpen}
                        onClose={() => setSessionModalState({ isOpen: false, initialData: null })}
                        onSave={handleSaveSessionAPI}
                        initialData={sessionModalState.initialData}
                    />
                    <ConfirmModal
                        isOpen={confirmModal.isOpen}
                        onClose={() => setConfirmModal({ isOpen: false, sessionId: null })}
                        onConfirm={handleConfirmDelete}
                        title="Xác nhận xóa buổi học"
                        message="Bạn có chắc chắn muốn xóa buổi học này không? Hành động này không thể hoàn tác."
                        confirmText="Xóa buổi học"
                        cancelText="Hủy bỏ"
                        type="danger"
                    />
                </>
            )}
        </div>
    );
};

export default ScheduleManagementPage;
