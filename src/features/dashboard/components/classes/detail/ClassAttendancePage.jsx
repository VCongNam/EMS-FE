import React, { useState, useMemo, useEffect } from 'react';
import { Icon } from '@iconify/react';
import useAuthStore from '../../../../../store/authStore';

// ── Mock Data ────────────────────────────────────────────────────────────────
const STUDENTS = [
    { id: 'STU001', name: 'Nguyễn Văn A' },
    { id: 'STU002', name: 'Trần Thị B' },
    { id: 'STU003', name: 'Lê Văn C' },
    { id: 'STU004', name: 'Phạm Văn D' },
    { id: 'STU005', name: 'Hoàng Thị E' },
];

const SESSIONS = [
    { id: 1, session: 1, date: '2026-04-07', day: 'Thứ 3', startTime: '17:30', endTime: '19:00' },
    { id: 2, session: 2, date: '2026-04-09', day: 'Thứ 5', startTime: '17:30', endTime: '19:00' },
    { id: 3, session: 3, date: '2026-04-14', day: 'Thứ 3', startTime: '17:30', endTime: '19:00' },
    { id: 4, session: 4, date: '2026-04-16', day: 'Thứ 5', startTime: '17:30', endTime: '19:00' },
];

// Mock attendance records — pre-filled for 4 sessions
const MOCK_RECORDS = {
    1: [
        { id: 'STU001', name: 'Nguyễn Văn A', status: 'present' },
        { id: 'STU002', name: 'Trần Thị B',   status: 'late' },
        { id: 'STU003', name: 'Lê Văn C',      status: 'present' },
        { id: 'STU004', name: 'Phạm Văn D',    status: 'absent' },
        { id: 'STU005', name: 'Hoàng Thị E',   status: 'present' },
    ],
    2: [
        { id: 'STU001', name: 'Nguyễn Văn A', status: 'present' },
        { id: 'STU002', name: 'Trần Thị B',   status: 'present' },
        { id: 'STU003', name: 'Lê Văn C',      status: 'absent' },
        { id: 'STU004', name: 'Phạm Văn D',    status: 'late' },
        { id: 'STU005', name: 'Hoàng Thị E',   status: 'present' },
    ],
    3: [
        { id: 'STU001', name: 'Nguyễn Văn A', status: 'present' },
        { id: 'STU002', name: 'Trần Thị B',   status: 'absent' },
        { id: 'STU003', name: 'Lê Văn C',      status: 'present' },
        { id: 'STU004', name: 'Phạm Văn D',    status: 'absent' },
        { id: 'STU005', name: 'Hoàng Thị E',   status: 'late' },
    ],
    4: [
        { id: 'STU001', name: 'Nguyễn Văn A', status: 'present' },
        { id: 'STU002', name: 'Trần Thị B',   status: 'present' },
        { id: 'STU003', name: 'Lê Văn C',      status: 'present' },
        { id: 'STU004', name: 'Phạm Văn D',    status: 'present' },
        { id: 'STU005', name: 'Hoàng Thị E',   status: 'present' },
    ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_CFG = {
    present: { label: 'Hiện diện', badge: 'bg-green-500/10 text-green-600 border-green-500/20',  dot: 'bg-green-500'  },
    late:    { label: 'Đi muộn',   badge: 'bg-orange-500/10 text-orange-600 border-orange-500/20', dot: 'bg-orange-500' },
    absent:  { label: 'Vắng mặt', badge: 'bg-red-500/10 text-red-600 border-red-500/20',          dot: 'bg-red-500'    },
};

const fmtDate = (dateStr) =>
    new Date(dateStr + 'T00:00:00').toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
    });

// ── View modes ────────────────────────────────────────────────────────────────
// "by-session"  → rows = sessions, columns show each student
// "by-student"  → rows = students, columns show each session

const ClassAttendancePage = () => {
    const { user } = useAuthStore();
    const isTeacherOrTA = ['TEACHER', 'TA'].includes(user?.role?.toUpperCase());

    const [viewMode, setViewMode]     = useState(isTeacherOrTA ? 'by-session' : 'by-student'); // 'by-session' | 'by-student'
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'present' | 'late' | 'absent'
    const [expandedSession, setExpandedSession] = useState(null);

    // Make sure student view is enforced for non-teachers
    useEffect(() => {
        if (!isTeacherOrTA) {
            setViewMode('by-student');
        }
    }, [isTeacherOrTA]);

    const recordedSessions = SESSIONS.filter(s => MOCK_RECORDS[s.id]);

    // ── By-session view data ─────────────────────────────────────
    const sessionRows = useMemo(() => {
        return recordedSessions.map(session => {
            const rec = MOCK_RECORDS[session.id] || [];
            const present = rec.filter(r => r.status === 'present').length;
            const late    = rec.filter(r => r.status === 'late').length;
            const absent  = rec.filter(r => r.status === 'absent').length;
            const total   = rec.length;
            return { ...session, rec, present, late, absent, total };
        });
    }, []);

    // ── By-student view data ─────────────────────────────────────
    const studentRows = useMemo(() => {
        let activeStudents = STUDENTS;
        // If not teacher/TA, mock the student view by ONLY showing their own record (STU001)
        if (!isTeacherOrTA) {
            activeStudents = STUDENTS.filter(s => s.id === 'STU001');
        }

        return activeStudents.map(student => {
            const entries = recordedSessions.map(session => {
                const rec = MOCK_RECORDS[session.id] || [];
                const entry = rec.find(r => r.id === student.id);
                return { session, status: entry?.status || null };
            });
            const present = entries.filter(e => e.status === 'present').length;
            const late    = entries.filter(e => e.status === 'late').length;
            const absent  = entries.filter(e => e.status === 'absent').length;
            const attended = present + late;
            const rate = recordedSessions.length > 0 ? Math.round((attended / recordedSessions.length) * 100) : 0;
            return { ...student, entries, present, late, absent, rate };
        }).filter(s => {
            const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                s.id.toLowerCase().includes(searchQuery.toLowerCase());
            if (!matchSearch) return false;
            if (statusFilter === 'all') return true;
            // filter: student has at least one entry of that status
            return s.entries.some(e => e.status === statusFilter);
        });
    }, [searchQuery, statusFilter]);

    // ── Session filter (for by-session) ──────────────────────────
    const filteredSessionRows = useMemo(() => {
        if (!searchQuery && statusFilter === 'all') return sessionRows;
        return sessionRows.filter(session => {
            const matchSearch = !searchQuery ||
                `Buổi ${session.session}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fmtDate(session.date).includes(searchQuery) ||
                session.day.toLowerCase().includes(searchQuery.toLowerCase()) ||
                session.rec.some(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()));
            if (!matchSearch) return false;
            if (statusFilter === 'all') return true;
            return session.rec.some(r => r.status === statusFilter);
        });
    }, [searchQuery, statusFilter, sessionRows]);

    // ── Overall stats ─────────────────────────────────────────────
    const totalPresent = sessionRows.reduce((a, s) => a + s.present, 0);
    const totalLate    = sessionRows.reduce((a, s) => a + s.late, 0);
    const totalAbsent  = sessionRows.reduce((a, s) => a + s.absent, 0);
    const totalEntries = totalPresent + totalLate + totalAbsent;
    const overallRate  = totalEntries > 0 ? Math.round(((totalPresent + totalLate) / totalEntries) * 100) : 0;

    return (
        <div className="space-y-6 animate-fade-in-up">

            {/* ── Summary Stats ─────────────────────────────────────── */}
            <div className="grid grid-cols-2  sm:grid-cols-4 gap-3">
                {[
                    { label: 'Tỷ lệ đi học', value: `${overallRate}%`, icon: 'solar:chart-bold-duotone', color: 'text-primary bg-primary/10' },
                    { label: 'Hiện diện', value: totalPresent, icon: 'material-symbols:check-circle-rounded', color: 'text-green-600 bg-green-500/10' },
                    { label: 'Đi muộn', value: totalLate, icon: 'material-symbols:schedule-rounded', color: 'text-orange-500 bg-orange-500/10' },
                    { label: 'Vắng mặt', value: totalAbsent, icon: 'material-symbols:cancel-rounded', color: 'text-red-500 bg-red-500/10' },
                ].map((stat, i) => (
                    <div key={i} className="bg-surface border border-border rounded-2xl !p-4 flex items-center !gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
                            <Icon icon={stat.icon} className="text-xl" />
                        </div>
                        <div>
                            <p className="text-2xl font-extrabold text-text-main leading-none">{stat.value}</p>
                            <p className="text-xs font-semibold text-text-muted mt-0.5">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Toolbar ───────────────────────────────────────────── */}
            <div className="bg-surface !my-2 border border-border rounded-2xl !p-4 flex flex-col sm:flex-row items-stretch sm:items-center !gap-3">
                {/* Search */}
                <div className="relative flex-1">
                    <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                        type="text"
                        placeholder={viewMode === 'by-student' ? 'Tìm theo tên, mã học sinh...' : 'Tìm theo buổi, ngày, học sinh...'}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full !pl-9 !pr-8 !py-2.5 bg-background border border-border rounded-xl text-sm text-text-main placeholder:text-text-muted/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main">
                            <Icon icon="solar:close-circle-bold" className="text-sm" />
                        </button>
                    )}
                </div>

                {/* Status filter */}
                <div className="flex items-center !gap-1 bg-background border border-border rounded-xl !p-1 shrink-0">
                    {['all', 'present', 'late', 'absent'].map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`!px-3 !py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                                statusFilter === s ? '!bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-main'
                            }`}
                        >
                            {s === 'all' ? 'Tất cả' : STATUS_CFG[s].label}
                        </button>
                    ))}
                </div>

                {/* View mode toggle */}
                {isTeacherOrTA && (
                <div className="flex items-center !gap-1 bg-background border border-border rounded-xl !p-1 shrink-0">
                    <button
                        onClick={() => setViewMode('by-session')}
                        title="Xem theo buổi"
                        className={`flex items-center !gap-1.5 !px-3 !py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            viewMode === 'by-session' ? '!bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-main'
                        }`}
                    >
                        <Icon icon="solar:calendar-bold-duotone" className="text-base" />
                        <span className="hidden sm:inline">Theo buổi</span>
                    </button>
                    <button
                        onClick={() => setViewMode('by-student')}
                        title="Xem theo học sinh"
                        className={`flex items-center !gap-1.5 !px-3 !py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            viewMode === 'by-student' ? '!bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-main'
                        }`}
                    >
                        <Icon icon="solar:users-group-two-rounded-bold-duotone" className="text-base" />
                        <span className="hidden sm:inline">Theo học sinh</span>
                    </button>
                </div>
                )}
            </div>

            {/* ── Content ───────────────────────────────────────────── */}
            {viewMode === 'by-session' ? (
                <BySessionView
                    rows={filteredSessionRows}
                    expandedSession={expandedSession}
                    setExpandedSession={setExpandedSession}
                    statusFilter={statusFilter}
                />
            ) : (
                <ByStudentView rows={studentRows} sessions={recordedSessions} />
            )}
        </div>
    );
};

// ── Sub-view: By Session ──────────────────────────────────────────────────────
const BySessionView = ({ rows, expandedSession, setExpandedSession, statusFilter }) => {
    if (rows.length === 0) return <EmptyState />;

    return (
        <div className="space-y-3">
            {rows.map(session => {
                const isExpanded = expandedSession === session.id;
                const filteredRec = statusFilter === 'all'
                    ? session.rec
                    : session.rec.filter(r => r.status === statusFilter);

                return (
                    <div key={session.id} className="bg-surface border border-border rounded-2xl overflow-hidden">
                        {/* Session header row */}
                        <button
                            onClick={() => setExpandedSession(isExpanded ? null : session.id)}
                            className="w-full flex flex-col sm:flex-row items-start sm:items-center !gap-4 !p-4 hover:bg-primary/5 transition-colors text-left"
                        >
                            {/* Session badge */}
                            <div className="flex items-center !gap-3 flex-1 min-w-0">
                                <div className="flex flex-col items-center justify-center min-w-[52px] !px-2 !py-2 bg-primary/10 rounded-xl text-primary border border-primary/20 shrink-0">
                                    <span className="text-[9px] font-bold uppercase tracking-wide opacity-70">Buổi</span>
                                    <span className="text-lg font-extrabold leading-none">{session.session}</span>
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-text-main">{session.day}, {fmtDate(session.date)}</p>
                                    <p className="text-xs text-text-muted flex items-center !gap-1 mt-0.5">
                                        <Icon icon="solar:clock-circle-linear" className="text-primary/70" />
                                        {session.startTime} – {session.endTime}
                                    </p>
                                </div>
                            </div>

                            {/* Mini stats */}
                            <div className="flex items-center !gap-2 flex-wrap">
                                <StatPill value={session.present} label="Hiện diện" color="text-green-600 bg-green-500/10 border-green-500/20" />
                                <StatPill value={session.late}    label="Đi muộn"   color="text-orange-500 bg-orange-500/10 border-orange-500/20" />
                                <StatPill value={session.absent}  label="Vắng mặt"  color="text-red-500 bg-red-500/10 border-red-500/20" />
                                <Icon
                                    icon="material-symbols:keyboard-arrow-down-rounded"
                                    className={`text-xl text-text-muted transition-transform duration-200 ml-1 ${isExpanded ? 'rotate-180' : ''}`}
                                />
                            </div>
                        </button>

                        {/* Expanded student detail */}
                        {isExpanded && (
                            <div className="border-t border-border bg-background/50">
                                {/* Desktop table */}
                                <table className="hidden sm:table w-full text-left">
                                    <thead>
                                        <tr className="border-b border-border/50">
                                            <th className="!px-5 !py-2.5 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Mã HS</th>
                                            <th className="!px-5 !py-2.5 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Họ và Tên</th>
                                            <th className="!px-5 !py-2.5 text-[11px] font-semibold text-text-muted uppercase tracking-wider text-center">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/30">
                                        {filteredRec.map(student => (
                                            <tr key={student.id} className="hover:bg-primary/5 transition-colors">
                                                <td className="!px-5 !py-3 font-mono text-xs text-text-muted">{student.id}</td>
                                                <td className="!px-5 !py-3">
                                                    <div className="flex items-center !gap-2">
                                                        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold uppercase shrink-0">
                                                            {student.name.charAt(0)}
                                                        </div>
                                                        <span className="font-semibold text-sm text-text-main">{student.name}</span>
                                                    </div>
                                                </td>
                                                <td className="!px-5 !py-3 text-center">
                                                    <StatusBadge status={student.status} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Mobile card list */}
                                <div className="sm:hidden divide-y divide-border/30">
                                    {filteredRec.map(student => (
                                        <div key={student.id} className="flex items-center justify-between !px-4 !py-3">
                                            <div className="flex items-center !gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold uppercase shrink-0">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-text-main">{student.name}</p>
                                                    <p className="font-mono text-xs text-text-muted">{student.id}</p>
                                                </div>
                                            </div>
                                            <StatusBadge status={student.status} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

// ── Sub-view: By Student ──────────────────────────────────────────────────────
const ByStudentView = ({ rows, sessions }) => {
    if (rows.length === 0) return <EmptyState />;

    return (
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            {/* Desktop cross-table */}
            <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr className="bg-background/80 border-b border-border">
                            <th className="!px-5 !py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider sticky left-0 bg-background/80">Học sinh</th>
                            {sessions.map(s => (
                                <th key={s.id} className="!px-3 !py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider text-center whitespace-nowrap">
                                    Buổi {s.session}
                                    <div className="text-[10px] normal-case font-normal text-text-muted/60 mt-0.5">{fmtDate(s.date)}</div>
                                </th>
                            ))}
                            <th className="!px-4 !py-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider text-center whitespace-nowrap">Tỷ lệ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                        {rows.map(student => (
                            <tr key={student.id} className="hover:bg-primary/5 transition-colors group">
                                <td className="!px-5 !py-3 sticky left-0 bg-surface group-hover:bg-primary/5 transition-colors">
                                    <div className="flex items-center !gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold uppercase shrink-0">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-text-main whitespace-nowrap">{student.name}</p>
                                            <p className="font-mono text-[11px] text-text-muted">{student.id}</p>
                                        </div>
                                    </div>
                                </td>
                                {student.entries.map((entry, i) => (
                                    <td key={i} className="!px-3 !py-3 text-center">
                                        {entry.status ? (
                                            <StatusDot status={entry.status} />
                                        ) : (
                                            <span className="text-text-muted/30 text-lg">—</span>
                                        )}
                                    </td>
                                ))}
                                <td className="!px-4 !py-3 text-center">
                                    <div className="flex flex-col items-center !gap-1">
                                        <span className={`text-sm font-bold ${student.rate >= 80 ? 'text-green-600' : student.rate >= 60 ? 'text-orange-500' : 'text-red-500'}`}>
                                            {student.rate}%
                                        </span>
                                        <div className="w-12 h-1 bg-background rounded-full overflow-hidden border border-border/50">
                                            <div
                                                className={`h-full rounded-full ${student.rate >= 80 ? 'bg-green-500' : student.rate >= 60 ? 'bg-orange-500' : 'bg-red-500'}`}
                                                style={{ width: `${student.rate}%` }}
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile: student cards with session pills */}
            <div className="sm:hidden divide-y divide-border/40">
                {rows.map(student => (
                    <div key={student.id} className="!p-4">
                        <div className="flex items-center justify-between !mb-3">
                            <div className="flex items-center !gap-2.5">
                                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold uppercase shrink-0">
                                    {student.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-text-main">{student.name}</p>
                                    <p className="font-mono text-xs text-text-muted">{student.id}</p>
                                </div>
                            </div>
                            <span className={`text-sm font-extrabold ${student.rate >= 80 ? 'text-green-600' : student.rate >= 60 ? 'text-orange-500' : 'text-red-500'}`}>
                                {student.rate}%
                            </span>
                        </div>
                        <div className="flex flex-wrap !gap-2">
                            {student.entries.map((entry, i) => (
                                <div
                                    key={i}
                                    className={`flex items-center !gap-1.5 !px-2.5 !py-1 rounded-xl border text-xs font-semibold ${
                                        entry.status ? STATUS_CFG[entry.status].badge : 'bg-background border-border text-text-muted/40'
                                    }`}
                                >
                                    {entry.status && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_CFG[entry.status].dot}`} />}
                                    <span>B{sessions[i]?.session}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ── Atomic components ─────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    if (!status || !STATUS_CFG[status]) return null;
    const cfg = STATUS_CFG[status];
    return (
        <span className={`inline-flex items-center !gap-1.5 !px-2.5 !py-1 rounded-full border text-xs font-semibold ${cfg.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
};

const StatusDot = ({ status }) => {
    if (!status || !STATUS_CFG[status]) return null;
    const cfg = STATUS_CFG[status];
    return (
        <span title={cfg.label} className="flex justify-center">
            <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${cfg.badge}`}>
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            </span>
        </span>
    );
};

const StatPill = ({ value, label, color }) => (
    <span className={`inline-flex items-center !gap-1 !px-2.5 !py-1 rounded-xl border text-xs font-bold ${color}`}>
        {value} {label}
    </span>
);

const EmptyState = () => (
    <div className="bg-surface border border-border rounded-2xl !py-16 flex flex-col items-center text-center !gap-3">
        <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center border border-border">
            <Icon icon="solar:ghost-smile-bold-duotone" className="text-3xl text-text-muted" />
        </div>
        <p className="font-bold text-text-main">Không tìm thấy dữ liệu</p>
        <p className="text-sm text-text-muted">Thử điều chỉnh lại bộ lọc tìm kiếm</p>
    </div>
);

export default ClassAttendancePage;
