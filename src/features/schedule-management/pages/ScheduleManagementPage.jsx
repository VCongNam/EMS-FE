import React, { useState } from 'react';
import { Icon } from '@iconify/react';

// --- Mock lessons across all classes ---
const ALL_LESSONS = [
    { id: 1,  classId: 'C1', className: 'Toán Cao Cấp – Lớp 10A', date: '2026-03-23', startTime: '17:30', endTime: '19:00', status: 'scheduled', color: 'blue' },
    { id: 2,  classId: 'C2', className: 'Vật Lý – Lớp 11B',       date: '2026-03-23', startTime: '19:30', endTime: '21:00', status: 'scheduled', color: 'purple' },
    { id: 3,  classId: 'C1', className: 'Toán Cao Cấp – Lớp 10A', date: '2026-03-25', startTime: '17:30', endTime: '19:00', status: 'scheduled', color: 'blue' },
    { id: 4,  classId: 'C3', className: 'Hóa Học – Lớp 12C',      date: '2026-03-25', startTime: '15:00', endTime: '17:00', status: 'completed', color: 'green' },
    { id: 5,  classId: 'C2', className: 'Vật Lý – Lớp 11B',       date: '2026-03-26', startTime: '19:30', endTime: '21:00', status: 'scheduled', color: 'purple' },
    { id: 6,  classId: 'C3', className: 'Hóa Học – Lớp 12C',      date: '2026-03-27', startTime: '15:00', endTime: '17:00', status: 'cancelled', color: 'red' },
    { id: 7,  classId: 'C1', className: 'Toán Cao Cấp – Lớp 10A', date: '2026-03-28', startTime: '17:30', endTime: '19:00', status: 'completed', color: 'blue' },
    { id: 8,  classId: 'C4', className: 'Lập Trình – Lớp 10D',    date: '2026-03-28', startTime: '08:00', endTime: '11:00', status: 'scheduled', color: 'orange' },
    { id: 9,  classId: 'C4', className: 'Lập Trình – Lớp 10D',    date: '2026-03-29', startTime: '08:00', endTime: '11:00', status: 'scheduled', color: 'orange' },
    { id: 10, classId: 'C2', className: 'Vật Lý – Lớp 11B',       date: '2026-03-30', startTime: '19:30', endTime: '21:00', status: 'scheduled', color: 'purple' },
    { id: 11, classId: 'C1', className: 'Toán Cao Cấp – Lớp 10A', date: '2026-04-01', startTime: '17:30', endTime: '19:00', status: 'scheduled', color: 'blue' },
    { id: 12, classId: 'C3', className: 'Hóa Học – Lớp 12C',      date: '2026-04-02', startTime: '15:00', endTime: '17:00', status: 'scheduled', color: 'green' },
    { id: 13, classId: 'C4', className: 'Lập Trình – Lớp 10D',    date: '2026-04-04', startTime: '08:00', endTime: '11:00', status: 'scheduled', color: 'orange' },
    { id: 14, classId: 'C1', className: 'Toán Cao Cấp – Lớp 10A', date: '2026-04-06', startTime: '17:30', endTime: '19:00', status: 'scheduled', color: 'blue' },
    { id: 15, classId: 'C2', className: 'Vật Lý – Lớp 11B',       date: '2026-03-24', startTime: '19:30', endTime: '21:00', status: 'scheduled', color: 'purple' },
];

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
};

// Helper: add days to a Date
const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
};

const toDateStr = (d) => d.toISOString().split('T')[0];

const WEEKDAYS_VN = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
const MONTHS_VN = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];

// --- Week View ---
const WeekView = ({ weekStart }) => {
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const today = toDateStr(new Date());

    return (
        <div className="grid grid-cols-7 !gap-2">
            {/* Header */}
            {days.map((day, i) => {
                const ds = toDateStr(day);
                const isToday = ds === today;
                return (
                    <div key={i} className="text-center">
                        <p className="text-[11px] font-semibold text-text-muted !mb-1">{WEEKDAYS_VN[i]}</p>
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center mx-auto font-bold text-sm transition-all ${
                            isToday ? 'bg-primary text-white shadow-md shadow-primary/40' : 'text-text-main'
                        }`}>
                            {day.getDate()}
                        </div>
                    </div>
                );
            })}

            {/* Lessons per day */}
            {days.map((day, i) => {
                const ds = toDateStr(day);
                const dayLessons = ALL_LESSONS
                    .filter(l => l.date === ds)
                    .sort((a, b) => a.startTime.localeCompare(b.startTime));

                return (
                    <div key={`lessons-${i}`} className="!space-y-1.5 min-h-[80px] !pt-2">
                        {dayLessons.map(lesson => {
                            const c = COLOR_MAP[lesson.status === 'cancelled' ? 'red' : lesson.color];
                            return (
                                <div key={lesson.id}
                                    className={`${c.bg} ${c.text} border ${c.border} rounded-xl !px-2 !py-1.5 cursor-pointer hover:opacity-80 transition-opacity`}
                                    title={`${lesson.className} | ${lesson.startTime}–${lesson.endTime}`}
                                >
                                    <p className="text-[10px] font-bold leading-tight truncate">{lesson.className.split('–')[0].trim()}</p>
                                    <p className="text-[10px] opacity-80 mt-0.5">{lesson.startTime}</p>
                                </div>
                            );
                        })}
                        {dayLessons.length === 0 && (
                            <div className="h-10 rounded-xl border border-dashed border-border" />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

// --- Month View ---
const MonthView = ({ year, month }) => {
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
                    <div key={d} className="text-center text-[11px] font-bold text-text-muted !py-2">{d}</div>
                ))}
            </div>

            {weeks.map((week, wi) => (
                <div key={wi} className="grid grid-cols-7 !gap-1">
                    {(week.length < 7 ? [...week, ...Array(7 - week.length).fill(null)] : week).map((day, di) => {
                        if (!day) return <div key={di} className="min-h-[80px]" />;
                        const ds = toDateStr(day);
                        const isToday = ds === today;
                        const dayLessons = ALL_LESSONS.filter(l => l.date === ds)
                            .sort((a, b) => a.startTime.localeCompare(b.startTime));

                        return (
                            <div key={di}
                                className={`min-h-[80px] rounded-2xl border !p-2 transition-all ${
                                    isToday ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-primary/30'
                                }`}
                            >
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold !mb-1 ${
                                    isToday ? 'bg-primary text-white' : 'text-text-main'
                                }`}>
                                    {day.getDate()}
                                </div>
                                <div className="!space-y-0.5">
                                    {dayLessons.slice(0, 2).map(lesson => {
                                        const c = COLOR_MAP[lesson.status === 'cancelled' ? 'red' : lesson.color];
                                        return (
                                            <div key={lesson.id}
                                                className={`${c.bg} ${c.text} rounded-lg !px-1.5 !py-0.5 text-[9px] font-bold truncate cursor-pointer hover:opacity-80`}
                                                title={`${lesson.className} | ${lesson.startTime}–${lesson.endTime}`}
                                            >
                                                {lesson.startTime} {lesson.className.split('–')[0].trim()}
                                            </div>
                                        );
                                    })}
                                    {dayLessons.length > 2 && (
                                        <p className="text-[9px] text-text-muted font-semibold !pl-1">+{dayLessons.length - 2} buổi</p>
                                    )}
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
const UpcomingList = () => {
    const today = toDateStr(new Date());
    const upcoming = ALL_LESSONS
        .filter(l => l.date >= today && l.status !== 'cancelled')
        .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
        .slice(0, 8);

    return (
        <div className="!space-y-2">
            {upcoming.map(lesson => {
                const c = COLOR_MAP[lesson.color];
                const d = new Date(lesson.date + 'T00:00:00');
                return (
                    <div key={lesson.id} className="flex items-center !gap-3 !px-4 !py-3 bg-background border border-border rounded-2xl hover:border-primary/30 hover:shadow-sm transition-all">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-text-main truncate">{lesson.className}</p>
                            <p className="text-xs text-text-muted">{d.toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' })} · {lesson.startTime}–{lesson.endTime}</p>
                        </div>
                        <span className={`text-[10px] font-bold !px-2 !py-1 rounded-lg border ${COLOR_MAP[lesson.status === 'cancelled' ? 'red' : lesson.color].bg} ${COLOR_MAP[lesson.status === 'cancelled' ? 'red' : lesson.color].text} ${COLOR_MAP[lesson.status === 'cancelled' ? 'red' : lesson.color].border}`}>
                            {STATUS_LABEL[lesson.status]}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

// --- Main Page ---
const ScheduleManagementPage = () => {
    const [viewMode, setViewMode] = useState('week'); // 'week' | 'month'
    const [refDate, setRefDate] = useState(new Date('2026-03-23'));

    // Week navigation
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
    const totalToday = ALL_LESSONS.filter(l => l.date === todayStr).length;
    const totalScheduled = ALL_LESSONS.filter(l => l.status === 'scheduled').length;
    const totalCompleted = ALL_LESSONS.filter(l => l.status === 'completed').length;
    const totalClasses = [...new Set(ALL_LESSONS.map(l => l.classId))].length;

    return (
        <div className="w-full !space-y-6 animate-fade-in">
            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center !gap-4 bg-surface !p-6 rounded-[2rem] border border-border shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-text-main flex items-center !gap-3 font-['Outfit']">
                        <Icon icon="solar:calendar-bold-duotone" className="text-primary text-3xl" />
                        Lịch dạy tổng hợp
                    </h1>
                    <p className="text-text-muted text-sm mt-1">Xem lịch dạy của tất cả lớp theo tuần hoặc tháng</p>
                </div>

                {/* Controls */}
                <div className="flex items-center !gap-2 flex-wrap">
                    {/* View toggle */}
                    <div className="flex items-center bg-background border border-border rounded-xl !p-1">
                        <button onClick={() => setViewMode('week')}
                            className={`flex items-center !gap-1.5 !px-3 !py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'week' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-main'}`}>
                            <Icon icon="solar:calendar-date-bold-duotone" className="text-sm" /> Tuần
                        </button>
                        <button onClick={() => setViewMode('month')}
                            className={`flex items-center !gap-1.5 !px-3 !py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'month' ? 'bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-main'}`}>
                            <Icon icon="solar:calendar-bold-duotone" className="text-sm" /> Tháng
                        </button>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center !gap-1">
                        <button onClick={prevPeriod} className="w-9 h-9 border border-border rounded-xl text-text-muted hover:bg-background hover:border-primary/30 transition-colors flex items-center justify-center">
                            <Icon icon="material-symbols:chevron-left-rounded" className="text-xl" />
                        </button>
                        <button onClick={goToday} className="!px-3 h-9 border border-border rounded-xl text-xs font-bold text-text-main hover:bg-background hover:border-primary/30 transition-colors">
                            Hôm nay
                        </button>
                        <button onClick={nextPeriod} className="w-9 h-9 border border-border rounded-xl text-text-muted hover:bg-background hover:border-primary/30 transition-colors flex items-center justify-center">
                            <Icon icon="material-symbols:chevron-right-rounded" className="text-xl" />
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Quick Stats ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 !gap-4">
                {[
                    { icon: 'solar:calendar-bold-duotone',         color: 'text-primary bg-primary/10',   label: 'Lớp đang dạy',  value: totalClasses },
                    { icon: 'solar:clock-circle-bold-duotone',     color: 'text-blue-500 bg-blue-500/10', label: 'Buổi hôm nay',  value: totalToday },
                    { icon: 'solar:calendar-mark-bold-duotone',    color: 'text-orange-500 bg-orange-500/10', label: 'Sắp diễn ra', value: totalScheduled },
                    { icon: 'solar:check-circle-bold-duotone',     color: 'text-green-500 bg-green-500/10',  label: 'Hoàn thành', value: totalCompleted },
                ].map((s, i) => (
                    <div key={i} className="bg-surface !p-5 rounded-[1.5rem] border border-border flex items-center !gap-4 shadow-sm">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${s.color}`}>
                            <Icon icon={s.icon} className="text-2xl" />
                        </div>
                        <div>
                            <p className="text-2xl font-extrabold text-text-main">{s.value}</p>
                            <p className="text-xs text-text-muted">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Main Calendar + Upcoming ── */}
            <div className="flex flex-col lg:flex-row !gap-6">
                {/* Calendar */}
                <div className="flex-1 bg-surface !p-6 rounded-[2rem] border border-border shadow-sm">
                    {/* Period label */}
                    <div className="flex items-center justify-between !mb-6">
                        <h2 className="text-lg font-bold text-text-main">{periodLabel}</h2>
                        {/* Legend */}
                        <div className="hidden sm:flex items-center !gap-3">
                            {[
                                { color: 'bg-blue-500', label: 'Toán' },
                                { color: 'bg-violet-500', label: 'Vật Lý' },
                                { color: 'bg-green-500', label: 'Hóa' },
                                { color: 'bg-orange-500', label: 'CNTT' },
                            ].map(l => (
                                <div key={l.label} className="flex items-center !gap-1.5 text-xs text-text-muted">
                                    <span className={`w-2 h-2 rounded-full ${l.color}`} /> {l.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {viewMode === 'week'
                        ? <WeekView weekStart={weekStart} />
                        : <MonthView year={currentYear} month={currentMonth} />
                    }
                </div>

                {/* Upcoming sidebar */}
                <div className="lg:w-72 bg-surface !p-6 rounded-[2rem] border border-border shadow-sm">
                    <div className="flex items-center !gap-3 !mb-5">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Icon icon="solar:list-check-minimalistic-bold-duotone" className="text-lg" />
                        </div>
                        <h2 className="text-base font-bold text-text-main">Sắp diễn ra</h2>
                    </div>
                    <UpcomingList />
                </div>
            </div>
        </div>
    );
};

export default ScheduleManagementPage;
