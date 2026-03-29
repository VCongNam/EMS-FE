import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import useAuthStore from '../../../store/authStore';
import { sessionService } from '../../dashboard/api/sessionService';
import SessionModal from '../../dashboard/components/classes/detail/components/SessionModal';

const COLOR_OPTIONS = ['blue', 'purple', 'green', 'orange'];
const COLOR_MAP = {
    blue:   { bg: 'bg-blue-100',   text: 'text-blue-700',   border: 'border-blue-200',   dot: 'bg-blue-500'   },
    purple: { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200', dot: 'bg-violet-500' },
    green:  { bg: 'bg-green-100',  text: 'text-green-700',  border: 'border-green-200',  dot: 'bg-green-500'  },
    orange: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
    red:    { bg: 'bg-red-100',    text: 'text-red-600',    border: 'border-red-200',    dot: 'bg-red-400'    },
};

const STATUS_LABEL = {
    scheduled: 'Sắp diễn ra',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
    canceled: 'Đã hủy',
};

// Helper: add days to a Date
const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
};

const toDateStr = (d) => {
    const offset = d.getTimezoneOffset()
    let d_copy = new Date(d.getTime() - (offset*60*1000))
    return d_copy.toISOString().split('T')[0]
};

const WEEKDAYS_VN = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
const MONTHS_VN = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];

// --- Event Card Component ---
const LessonCard = ({ lesson, onEdit, onDelete }) => {
    const isCancelled = lesson.status === 'cancelled' || lesson.status === 'canceled';
    const c = COLOR_MAP[isCancelled ? 'red' : lesson.color];

    return (
        <div className={`flex flex-col rounded-xl overflow-hidden border border-border bg-background shadow-sm hover:shadow-md hover:border-primary/40 transition-all ${isCancelled ? 'opacity-70 grayscale' : ''}`}>
            {/* Header: Date/Time */}
            <div className={`!px-2 !py-1.5 ${c.bg} ${c.text} flex items-center justify-between shrink-0`}>
                <p className="font-bold text-[10px] sm:text-[11px] truncate leading-none">
                    {lesson.startTime} – {lesson.endTime}
                </p>
                <div className={`w-2 h-2 rounded-full shrink-0 shadow-sm ${c.dot}`} />
            </div>
            
            {/* Body: Info */}
            <div className="!px-2 !py-2 !space-y-1 border-b border-border flex-1 min-h-[50px]">
                <p className={`font-semibold text-[11px] sm:text-xs leading-snug line-clamp-2 ${isCancelled ? 'text-red-500 line-through' : 'text-text-main'}`} title={lesson.className}>
                    {lesson.className}
                </p>
                {lesson.topic && <p className="text-[10px] text-text-muted truncate">CĐ: {lesson.topic}</p>}
                {lesson.raw.meetingLink && (
                    <a href={lesson.raw.meetingLink} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="flex inline-flex items-center !gap-1 text-[10px] text-blue-500 hover:text-blue-700 bg-blue-50 !px-1.5 !py-0.5 rounded-md hover:underline truncate">
                        <Icon icon="solar:link-minimalistic-linear" className="shrink-0" /> Link
                    </a>
                )}
            </div>

            {/* Footer: Actions */}
            <div className="flex gap-1.5 p-1.5 bg-surface shrink-0">
                <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(lesson); }} 
                    className="flex flex-1 items-center justify-center !p-1 sm:!px-0 sm:!py-1.5 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-500 hover:text-white transition-colors"
                    title="Chỉnh sửa buổi học"
                >
                    <Icon icon="solar:pen-bold-duotone" className="text-sm sm:text-base cursor-pointer" />
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(lesson.id); }} 
                    className="flex flex-1 items-center justify-center !p-1 sm:!px-0 sm:!py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                    title="Xóa buổi học"
                >
                    <Icon icon="solar:trash-bin-trash-bold-duotone" className="text-sm sm:text-base cursor-pointer" />
                </button>
            </div>
        </div>
    );
};

// --- Week View ---
const WeekView = ({ weekStart, lessons, onEdit, onDelete }) => {
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const today = toDateStr(new Date());

    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 !gap-3">
            {days.map((day, i) => {
                const ds = toDateStr(day);
                const isToday = ds === today;
                const dayLessons = lessons
                    .filter(l => l.date === ds)
                    .sort((a, b) => a.startTime.localeCompare(b.startTime));

                return (
                    <div key={`col-${i}`} className="flex flex-col h-full border border-border rounded-xl bg-surface/30 !pb-2 overflow-hidden shadow-sm">
                        {/* Day Header */}
                        <div className={`text-center !py-3 border-b flex flex-col items-center justify-center ${isToday ? 'bg-primary/5 border-primary/30' : 'border-border bg-surface'}`}>
                            <p className={`text-xs font-bold uppercase tracking-wider !mb-1 ${isToday ? 'text-primary' : 'text-text-muted'}`}>
                                {WEEKDAYS_VN[i]}
                            </p>
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-sm transition-all ${
                                isToday ? 'bg-primary text-white shadow-md shadow-primary/30' : 'text-text-main bg-background border border-border'
                            }`}>
                                {day.getDate()}
                            </div>
                        </div>

                        {/* Lessons List */}
                        <div className="flex-1 !p-2 !space-y-2 mt-1">
                            {dayLessons.map(lesson => (
                                <LessonCard key={lesson.id} lesson={lesson} onEdit={onEdit} onDelete={onDelete} />
                            ))}
                            {dayLessons.length === 0 && (
                                <div className="h-16 rounded-xl border-2 border-dashed border-border flex items-center justify-center opacity-50">
                                    <Icon icon="solar:sleeping-bold-duotone" className="text-xl text-text-muted" />
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// --- Month View ---
const MonthView = ({ year, month, lessons, onEdit, onDelete }) => {
    const firstDay = new Date(year, month, 1);
    const lastDay  = new Date(year, month + 1, 0);
    // Monday-first grid
    let startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const today = toDateStr(new Date());

    const cells = [];
    // leading blanks
    for (let i = 0; i < startOffset; i++) cells.push(null);
    // days
    for (let d = 1; d <= lastDay.getDate(); d++) cells.push(new Date(year, month, d));

    // chunk into weeks
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

    return (
        <div className="!space-y-1">
            {/* Header */}
            <div className="grid grid-cols-7 !mb-2">
                {WEEKDAYS_VN.map(d => (
                    <div key={d} className="text-center text-xs font-bold text-text-muted uppercase tracking-wider !py-2 bg-surface rounded-lg">{d}</div>
                ))}
            </div>

            {weeks.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7 !gap-2">
                    {(week.length < 7 ? [...week, ...Array(7 - week.length).fill(null)] : week).map((day, di) => {
                        if (!day) return <div key={di} className="min-h-[120px] rounded-2xl bg-surface/30" />;
                        
                        const ds = toDateStr(day);
                        const isToday = ds === today;
                        const dayLessons = lessons.filter(l => l.date === ds)
                            .sort((a, b) => a.startTime.localeCompare(b.startTime));

                        return (
                            <div key={di}
                                className={`flex flex-col min-h-[140px] rounded-2xl border !p-2 transition-all ${
                                    isToday ? 'border-primary shadow-sm bg-primary/5' : 'border-border bg-surface/30 hover:bg-surface'
                                }`}
                            >
                                <div className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold !mb-2 ${
                                    isToday ? 'bg-primary text-white shadow-md' : 'text-text-main hover:bg-background'
                                }`}>
                                    {day.getDate()}
                                </div>
                                <div className="flex-1 !space-y-2 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                                    {dayLessons.map(lesson => (
                                        <LessonCard key={lesson.id} lesson={lesson} onEdit={onEdit} onDelete={onDelete} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

// --- Upcoming List ---
const UpcomingList = ({ lessons }) => {
    const today = toDateStr(new Date());
    const upcoming = lessons
        .filter(l => l.date >= today && l.status !== 'cancelled' && l.status !== 'canceled')
        .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
        .slice(0, 8);

    if (upcoming.length === 0) {
        return <div className="text-sm text-text-muted text-center !py-8">Không có lịch sắp tới</div>;
    }

    return (
        <div className="!space-y-2">
            {upcoming.map(lesson => {
                const c = COLOR_MAP[lesson.color];
                const d = new Date(lesson.date + 'T00:00:00');
                const isCancelled = lesson.status === 'cancelled' || lesson.status === 'canceled';
                return (
                    <div key={`upcoming-${lesson.id}`} className="flex items-center !gap-3 !px-4 !py-3 bg-background border border-border rounded-2xl hover:border-primary/30 hover:shadow-sm transition-all relative overflow-hidden">
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${c.bg} brightness-90`} />
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${c.dot} shadow-sm`} />
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold truncate ${isCancelled ? 'text-text-muted line-through' : 'text-text-main'}`}>
                                {lesson.className}
                            </p>
                            <p className="text-[11px] font-medium text-text-muted mt-0.5">
                                {d.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' })} · {lesson.startTime}–{lesson.endTime}
                            </p>
                        </div>
                        <span className={`shrink-0 text-[10px] font-bold !px-2 !py-1 rounded-lg border flex items-center gap-1 ${COLOR_MAP[isCancelled ? 'red' : lesson.color].bg} ${COLOR_MAP[isCancelled ? 'red' : lesson.color].text} ${COLOR_MAP[isCancelled ? 'red' : lesson.color].border}`}>
                            {STATUS_LABEL[lesson.status] || lesson.status}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

// --- Main Page ---
const ScheduleManagementPage = () => {
    const { token } = useAuthStore(state => state.user || {});
    const [viewMode, setViewMode] = useState('week'); // 'week' | 'month'
    const [refDate, setRefDate] = useState(new Date());
    
    // API Data state
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [sessionModalState, setSessionModalState] = useState({ isOpen: false, initialData: null });
    const [deletingId, setDeletingId] = useState(null);

    // Fetch API
    const fetchTeacherSchedule = useCallback(async () => {
        if (!token) return;
        try {
            setLoading(true);
            const res = await sessionService.getTeacherSchedule(token);
            if (res.ok) {
                const data = await res.json();
                
                // Trích xuất classIds độc lập để chia màu nếu có thể
                const uniqueClassIds = [...new Set(data.map(i => i.classId))];
                
                const mapped = data.map(item => {
                    const classIdx = uniqueClassIds.indexOf(item.classId);
                    const colorPick = COLOR_OPTIONS[classIdx % COLOR_OPTIONS.length] || 'blue';

                    return {
                        id: item.sessionId,
                        classId: item.classId,
                        className: item.title || `Class ${item.classId?.substring(0,6)}`,
                        date: item.date ? item.date.split('T')[0] : '',
                        startTime: item.startTime?.substring(0, 5) || '--:--',
                        endTime: item.endTime?.substring(0, 5) || '--:--',
                        status: item.status ? item.status.toLowerCase() : 'scheduled',
                        title: item.title,
                        topic: item.topic,
                        note: item.note,
                        color: colorPick,
                        raw: item
                    };
                });
                setLessons(mapped);
            } else {
                toast.error("Không thể tải Lịch dạy");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchTeacherSchedule();
    }, [fetchTeacherSchedule]);


    // Handlers
    const handleEditLesson = (lesson) => {
        setSessionModalState({
            isOpen: true,
            initialData: lesson.raw
        });
    };

    const handleDeleteLesson = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa bài học này khỏi lịch?")) return;
        
        try {
            setDeletingId(id);
            const res = await sessionService.deleteSession(id, token);
            if (res.ok) {
                toast.success('Đã xóa buổi học thành công!');
                fetchTeacherSchedule();
            } else {
                toast.error('Lỗi khi xóa!');
            }
        } catch (error) {
            toast.error('Lỗi mạng!');
        } finally {
            setDeletingId(null);
        }
    };

    const handleSaveSessionAPI = async (formData) => {
        try {
            // Khi tạo từ Schedule Global, mặc định form trả về formData
            // Nếu update:
            const isEdit = sessionModalState.initialData?.sessionId;
            const url = isEdit ? `/api/session/${sessionModalState.initialData.sessionId}` : `/api/session`;
            const method = isEdit ? 'PUT' : 'POST';

            // Payload API (Kèm classId nếu edit, nếu create thì ClassList page lo)
            const payload = {
                classId: sessionModalState.initialData?.classId, 
                title: formData.title,
                date: formData.date,
                startTime: formData.startTime.length === 5 ? `${formData.startTime}:00` : formData.startTime,
                endTime: formData.endTime.length === 5 ? `${formData.endTime}:00` : formData.endTime,
                meetingLink: formData.meetingLink,
                topic: formData.topic,
                note: formData.note
            };

            const res = isEdit
                ? await sessionService.updateSession(sessionModalState.initialData.sessionId, payload, token)
                : await sessionService.createSession(payload, token);

            if (res.ok) {
                toast.success(isEdit ? 'Cập nhật thành công!' : 'Tạo mới thành công!');
                setSessionModalState({ isOpen: false, initialData: null });
                fetchTeacherSchedule();
            } else {
                toast.error('Cập nhật thất bại!');
            }
        } catch (error) {
            toast.error('Lỗi hệ thống máy chủ!');
        }
    };

    // Week navigation logic
    const getWeekStart = (d) => {
        const date = new Date(d);
        const day = date.getDay(); // 0=Sun
        const diff = day === 0 ? -6 : 1 - day; // Make Monday the start
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

    // Stats
    const todayStr = toDateStr(new Date());
    const totalToday = lessons.filter(l => l.date === todayStr).length;
    const totalScheduled = lessons.filter(l => l.status === 'scheduled').length;
    const totalCompleted = lessons.filter(l => l.status === 'completed').length;
    const totalClasses = [...new Set(lessons.map(l => l.classId))].length;

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
                        Lịch dạy tổng hợp
                    </h1>
                    <p className="text-text-muted text-sm mt-1 sm:ml-[60px]">Quản lý và cập nhật toàn bộ biểu đồ lịch dạy</p>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center !gap-3 w-full sm:w-auto">
                    {/* View toggle */}
                    <div className="flex items-center bg-background border border-border rounded-xl !p-1 shadow-inner">
                        <button onClick={() => setViewMode('week')}
                            className={`flex-1 sm:flex-none flex justify-center items-center !gap-2 !px-4 !py-2.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'week' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text-main hover:bg-surface'}`}>
                            <Icon icon="solar:calendar-date-bold-duotone" className="text-lg" /> Tuần
                        </button>
                        <button onClick={() => setViewMode('month')}
                            className={`flex-1 sm:flex-none flex justify-center items-center !gap-2 !px-4 !py-2.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'month' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-text-main hover:bg-surface'}`}>
                            <Icon icon="solar:calendar-bold-duotone" className="text-lg" /> Tháng
                        </button>
                    </div>

                    {/* Navigation */}
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
                {[
                    { icon: 'solar:users-group-rounded-bold-duotone', color: 'text-primary bg-primary/10 border-primary/20',   label: 'Lớp tham gia',  value: totalClasses },
                    { icon: 'solar:clock-circle-bold-duotone',         color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', label: 'Buổi hôm nay',  value: totalToday },
                    { icon: 'solar:calendar-mark-bold-duotone',        color: 'text-orange-500 bg-orange-500/10 border-orange-500/20', label: 'Sắp diễn ra', value: totalScheduled },
                    { icon: 'solar:check-circle-bold-duotone',         color: 'text-green-500 bg-green-500/10 border-green-500/20',  label: 'Hoàn thành', value: totalCompleted },
                ].map((s, i) => (
                    <div key={i} className={`bg-surface/60 backdrop-blur-sm !p-5 rounded-[1.5rem] border ${s.color.split(' ')[2]||'border-border'} flex items-center !gap-4 shadow-sm hover:shadow-md transition-shadow`}>
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${s.color.split(' ').slice(0,2).join(' ')} shadow-inner`}>
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
                {/* Calendar */}
                <div className="flex-1 overflow-x-auto bg-surface !p-6 rounded-[2rem] border border-border shadow-sm min-h-[600px]">
                    {/* Period label */}
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
                            ? <WeekView weekStart={weekStart} lessons={lessons} onEdit={handleEditLesson} onDelete={handleDeleteLesson} />
                            : <MonthView year={currentYear} month={currentMonth} lessons={lessons} onEdit={handleEditLesson} onDelete={handleDeleteLesson} />
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
                            <p className="text-[11px] text-text-muted mt-0.5">Các lớp học thời gian tới</p>
                        </div>
                    </div>
                    <div className="bg-background !p-2 rounded-[1.5rem] border border-border">
                        <UpcomingList lessons={lessons} />
                    </div>
                </div>
            </div>

            {/* Modals */}
            <SessionModal
                isOpen={sessionModalState.isOpen}
                onClose={() => setSessionModalState({ isOpen: false, initialData: null })}
                onSave={handleSaveSessionAPI}
                initialData={sessionModalState.initialData}
            />
        </div>
    );
};

export default ScheduleManagementPage;
