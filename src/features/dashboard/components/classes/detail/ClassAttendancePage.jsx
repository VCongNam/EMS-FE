import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import useAuthStore from '../../../../../store/authStore';
import { sessionService } from '../../../api/sessionService';
import studentScheduleService from '../../../api/studentScheduleService';

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_CFG = {
    present: { label: 'Hiện diện', badge: '!bg-green-500/10 text-green-600 border-green-500/20',  dot: '!bg-green-500'  },
    late:    { label: 'Đi muộn',   badge: '!bg-orange-500/10 text-orange-600 border-orange-500/20', dot: '!bg-orange-500' },
    absent:  { label: 'Vắng mặt', badge: '!bg-red-500/10 text-red-600 border-red-500/20',          dot: '!bg-red-500'    },
    'not taken': { label: 'Chưa điểm danh', badge: '!bg-text-muted/10 text-text-muted border-border', dot: '!bg-text-muted' },
};

const getStatusCfg = (status) => STATUS_CFG[status?.toLowerCase()] || STATUS_CFG['not taken'];

const fmtDate = (dateStr) =>
    new Date(dateStr + 'T00:00:00').toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
    });

// ── View modes ────────────────────────────────────────────────────────────────
const ClassAttendancePage = () => {
    const { classId } = useParams();
    const { user } = useAuthStore();
    const isTeacherOrTA = ['TEACHER', 'TA'].includes(user?.role?.toUpperCase());

    const [viewMode, setViewMode]     = useState(isTeacherOrTA ? 'by-session' : 'by-student'); 
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); 
    const [expandedSession, setExpandedSession] = useState(null);

    const [sessionsData, setSessionsData] = useState([]);
    const [recordsData, setRecordsData] = useState({});
    const [studentsData, setStudentsData] = useState([]);
    const [historyData, setHistoryData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAttendanceData = useCallback(async () => {
        if (!classId) return;
        const token = useAuthStore.getState().user?.token;
        const role = user?.role?.toUpperCase();

        try {
            setIsLoading(true);
            
            // 1. Fetch Basic Sessions List
            const sessRes = (role === 'STUDENT') 
                ? await studentScheduleService.getSchedule({ FromDate: '01/01/2025', ToDate: '01/01/2027', ClassId: classId }, token)
                : await sessionService.getClassSessions(classId, token);

            if (sessRes?.ok) {
                const sessionJson = await sessRes.json();
                const rawSessions = Array.isArray(sessionJson) ? sessionJson : sessionJson.data || [];
                
                const mapped = rawSessions.map((item, index) => {
                    const dateObj = new Date(item.date);
                    const dayLabels = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
                    return {
                        id: item.sessionId || item.sessionID,
                        session: index + 1,
                        day: dayLabels[dateObj.getDay()],
                        date: item.date ? item.date.split('T')[0] : '',
                        startTime: item.startTime?.substring(0, 5) || '--:--',
                        endTime: item.endTime?.substring(0, 5) || '--:--',
                        status: item.status ? item.status.toLowerCase() : 'scheduled',
                        title: item.title || item.className,
                    };
                }).sort((a, b) => new Date(a.date) - new Date(b.date));
                setSessionsData(mapped);
            }

            // 2. Fetch Detailed History (The New API)
            if (isTeacherOrTA) {
                const histRes = await sessionService.getClassAttendanceHistory(classId, token);
                if (histRes.ok) {
                    const histJson = await histRes.json();
                    setHistoryData(histJson);
                }
            } else {
                // Students fetch their own history or we use the sessions to fetch details
                // For simplicity, we'll fetch attendance for recorded sessions like before
            }
        } catch(error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    }, [classId, user, isTeacherOrTA]);

    // Derive session details from History Data for BySessionView
    useEffect(() => {
        if (historyData && isTeacherOrTA) {
            const newRecords = {};
            const stMap = {};
            
            historyData.forEach(student => {
                stMap[student.studentId] = { id: student.studentId, name: student.fullName };
                student.attendances.forEach(att => {
                    if (!newRecords[att.sessionId]) newRecords[att.sessionId] = [];
                    newRecords[att.sessionId].push({
                        id: student.studentId,
                        name: student.fullName,
                        status: att.status ? att.status.toLowerCase() : 'absent',
                        note: att.note
                    });
                });
            });
            
            setRecordsData(newRecords);
            setStudentsData(Object.values(stMap));
        }
    }, [historyData, isTeacherOrTA]);

    useEffect(() => {
        fetchAttendanceData();
    }, [fetchAttendanceData]);

    const recordedSessions = useMemo(() => {
        if (!isTeacherOrTA) return sessionsData.filter(s => recordsData[s.id] && recordsData[s.id].length > 0);
        return sessionsData; 
    }, [sessionsData, recordsData, isTeacherOrTA]);

    const sessionRows = useMemo(() => {
        return recordedSessions.map(session => {
            const rec = recordsData[session.id] || [];
            const present = rec.filter(r => (r.status || '').includes('present')).length;
            const late    = rec.filter(r => (r.status || '').includes('late')).length;
            const absent  = rec.filter(r => (r.status || '').includes('absent')).length;
            return { ...session, rec, present, late, absent, total: rec.length };
        });
    }, [recordedSessions, recordsData]);

    const studentRows = useMemo(() => {
        let sourceData = [];
        if (isTeacherOrTA && historyData) {
            sourceData = historyData.map(s => ({
                id: s.studentId,
                name: s.fullName,
                entries: s.attendances.map(a => ({
                    session: { id: a.sessionId, session: sessionsData.find(sd => sd.id === a.sessionId)?.session || '?' },
                    status: a.status ? a.status.toLowerCase() : null
                })),
                present: s.attendances.filter(a => (a.status || '').toLowerCase().includes('present')).length,
                late: s.attendances.filter(a => (a.status || '').toLowerCase().includes('late')).length,
                absent: s.attendances.filter(a => (a.status || '').toLowerCase().includes('absent')).length,
            })).map(s => ({
                ...s,
                rate: s.entries.length > 0 ? Math.round(((s.present + s.late) / s.entries.length) * 100) : 0
            }));
        } else {
            sourceData = studentsData.map(student => {
                const entries = recordedSessions.map(session => {
                    const rec = recordsData[session.id] || [];
                    const entry = rec.find(r => r.id === student.id);
                    return { session, status: entry?.status || null };
                });
                const present = entries.filter(e => e.status === 'present').length;
                const late    = entries.filter(e => e.status === 'late').length;
                const absent  = entries.filter(e => e.status === 'absent').length;
                return { 
                    ...student, 
                    entries, 
                    present, late, absent, 
                    rate: recordedSessions.length > 0 ? Math.round(((present + late) / recordedSessions.length) * 100) : 0 
                };
            });
        }

        return sourceData.filter(s => {
            const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                s.id.toLowerCase().includes(searchQuery.toLowerCase());
            if (!matchSearch) return false;
            if (statusFilter === 'all') return true;
            return s.status === statusFilter || (s.entries && s.entries.some(e => e.status === statusFilter));
        });
    }, [historyData, studentsData, sessionsData, isTeacherOrTA, recordedSessions, recordsData, searchQuery, statusFilter]);

    const filteredSessionRows = useMemo(() => {
        if (!searchQuery && statusFilter === 'all') return sessionRows;
        return sessionRows.filter(session => {
            const matchSearch = !searchQuery ||
                `Buổi ${session.session}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fmtDate(session.date).includes(searchQuery) ||
                session.day.toLowerCase().includes(searchQuery.toLowerCase());
            if (!matchSearch) return false;
            if (statusFilter === 'all') return true;
            return session.rec.some(r => (r.status || '').includes(statusFilter));
        });
    }, [searchQuery, statusFilter, sessionRows]);

    const stats = useMemo(() => {
        const totalP = sessionRows.reduce((a, s) => a + s.present, 0);
        const totalL = sessionRows.reduce((a, s) => a + s.late, 0);
        const totalA = sessionRows.reduce((a, s) => a + s.absent, 0);
        const total  = totalP + totalL + totalA;
        return {
            present: totalP,
            late: totalL,
            absent: totalA,
            rate: total > 0 ? Math.round(((totalP + totalL) / total) * 100) : 0
        };
    }, [sessionRows]);

    return (
        <div className="space-y-6 animate-fade-in-up relative min-h-[400px]">
            {isLoading && (
                <div className="absolute z-10 inset-0 !bg-background/50 backdrop-blur-[2px] rounded-[2rem] flex items-center justify-center">
                    <Icon icon="line-md:loading-loop" className="text-4xl text-primary" />
                </div>
            )}

            {/* ── Summary Stats ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    { label: 'Tỷ lệ đi học', value: `${stats.rate}%`, icon: 'solar:chart-bold-duotone', color: 'text-primary !bg-primary/10' },
                    { label: 'Hiện diện', value: stats.present, icon: 'material-symbols:check-circle-rounded', color: 'text-green-600 !bg-green-500/10' },
                    { label: 'Đi muộn', value: stats.late, icon: 'material-symbols:schedule-rounded', color: 'text-orange-500 !bg-orange-500/10' },
                    { label: 'Vắng mặt', value: stats.absent, icon: 'material-symbols:cancel-rounded', color: 'text-red-500 !bg-red-500/10' },
                ].map((stat, i) => (
                    <div key={i} className="!bg-surface border border-border rounded-2xl !p-4 flex items-center !gap-3">
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

            {/* ── Toolbar ── */}
            <div className="!bg-surface !my-2 border border-border rounded-2xl !p-4 flex flex-col sm:flex-row items-stretch sm:items-center !gap-3">
                <div className="relative flex-1">
                    <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                        type="text"
                        placeholder={viewMode === 'by-student' ? 'Tìm theo tên, mã học sinh...' : 'Tìm theo buổi, ngày, học sinh...'}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full !pl-9 !pr-8 !py-2.5 !bg-background border border-border rounded-xl text-sm text-text-main placeholder:text-text-muted/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>

                <div className="flex items-center !gap-1 !bg-background border border-border rounded-xl !p-1 shrink-0">
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

                {isTeacherOrTA && (
                    <div className="flex items-center !gap-1 !bg-background border border-border rounded-xl !p-1 shrink-0">
                        <button
                            onClick={() => setViewMode('by-session')}
                            className={`flex items-center !gap-1.5 !px-3 !py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                viewMode === 'by-session' ? '!bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-main'
                            }`}
                        >
                            <Icon icon="solar:list-bold-duotone" className="text-base" /> Theo buổi
                        </button>
                        <button
                            onClick={() => setViewMode('by-student')}
                            className={`flex items-center !gap-1.5 !px-3 !py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                viewMode === 'by-student' ? '!bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-main'
                            }`}
                        >
                            <Icon icon="solar:history-bold-duotone" className="text-base" /> Lịch sử
                        </button>
                    </div>
                )}
            </div>

            {/* ── Content ── */}
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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        setCurrentPage(1);
    }, [rows]);

    if (rows.length === 0) return <EmptyState />;

    const totalPages = Math.ceil(rows.length / itemsPerPage);
    const paginatedRows = rows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="space-y-4">
            <div className="space-y-3">
                {paginatedRows.map(session => {
                const isExpanded = expandedSession === session.id;
                const filteredRec = statusFilter === 'all'
                    ? session.rec
                    : session.rec.filter(r => r.status === statusFilter);

                return (
                    <div key={session.id} className="!bg-surface border border-border rounded-2xl overflow-hidden">
                        {/* Session header row */}
                        <button
                            onClick={() => setExpandedSession(isExpanded ? null : session.id)}
                            className="w-full flex flex-col sm:flex-row items-start sm:items-center !gap-4 !p-4 hover:!bg-primary/5 transition-colors text-left"
                        >
                            {/* Session badge */}
                            <div className="flex items-center !gap-3 flex-1 min-w-0">
                                <div className="flex flex-col items-center justify-center min-w-[52px] !px-2 !py-2 !bg-primary/10 rounded-xl text-primary border border-primary/20 shrink-0">
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
                                <StatPill value={session.present} label="Hiện diện" color="text-green-600 !bg-green-500/10 border-green-500/20" />
                                <StatPill value={session.late}    label="Đi muộn"   color="text-orange-500 !bg-orange-500/10 border-orange-500/20" />
                                <StatPill value={session.absent}  label="Vắng mặt"  color="text-red-500 !bg-red-500/10 border-red-500/20" />
                                <Icon
                                    icon="material-symbols:keyboard-arrow-down-rounded"
                                    className={`text-xl text-text-muted transition-transform duration-200 ml-1 ${isExpanded ? 'rotate-180' : ''}`}
                                />
                            </div>
                        </button>

                        {/* Expanded student detail */}
                        {isExpanded && (
                            <div className="border-t border-border !bg-background/50">
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
                                            <tr key={student.id} className="hover:!bg-primary/5 transition-colors">
                                                <td className="!px-5 !py-3">
                                                    <div className="flex items-center !gap-2">
                                                        <div className="w-7 h-7 rounded-full !bg-primary/10 text-primary flex items-center justify-center text-xs font-bold uppercase shrink-0">
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
                                                <div className="w-8 h-8 rounded-full !bg-primary/10 text-primary flex items-center justify-center text-xs font-bold uppercase shrink-0">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-text-main">{student.name}</p>
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
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-xl border transition-colors ${
                            currentPage === 1 
                                ? 'border-border text-border !bg-background cursor-not-allowed' 
                                : 'border-border text-text-main hover:!bg-primary/5 hover:border-primary/30 !bg-background'
                        }`}
                    >
                        <Icon icon="solar:alt-arrow-left-linear" className="text-lg" />
                    </button>
                    
                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                                    currentPage === page
                                        ? '!bg-primary text-white shadow-md shadow-primary/30'
                                        : 'text-text-muted hover:!bg-primary/5 hover:text-text-main'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-xl border transition-colors ${
                            currentPage === totalPages 
                                ? 'border-border text-border !bg-background cursor-not-allowed' 
                                : 'border-border text-text-main hover:!bg-primary/5 hover:border-primary/30 !bg-background'
                        }`}
                    >
                        <Icon icon="solar:alt-arrow-right-linear" className="text-lg" />
                    </button>
                </div>
            )}
        </div>
    );
};

// ── Sub-view: By Student ──────────────────────────────────────────────────────
const ByStudentView = ({ rows, sessions }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        setCurrentPage(1);
    }, [rows]);

    if (rows.length === 0) return <EmptyState />;

    const totalPages = Math.ceil(rows.length / itemsPerPage);
    const paginatedRows = rows.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="space-y-4">
            <div className="!bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
                {/* Desktop cross-table */}
                <div className="hidden sm:block overflow-x-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                    <table className="w-full text-left border-collapse min-w-full">
                        <thead>
                            <tr className="!bg-background/80 border-b border-border">
                                <th className="!px-5 !py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider sticky left-0 !bg-background/90 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] border-r border-border/50">
                                    Học sinh
                                </th>
                                {sessions.map(s => (
                                    <th key={s.id} className="!px-2 !py-4 text-[10px] font-bold text-text-muted uppercase tracking-wider text-center whitespace-nowrap min-w-[70px] border-r border-border/10 last:border-r-0">
                                        B{s.session}
                                        <div className="text-[9px] normal-case font-medium text-text-muted/50 mt-0.5">{fmtDate(s.date).substring(0, 5)}</div>
                                    </th>
                                ))}
                                <th className="!px-5 !py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider text-center whitespace-nowrap sticky right-0 !bg-background/90 z-20 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.05)] border-l border-border/50">
                                    Tỷ lệ
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            {paginatedRows.map(student => (
                                <tr key={student.id} className="hover:!bg-primary/5 transition-colors group">
                                    <td className="!px-5 !py-3 sticky left-0 !bg-surface z-10 group-hover:!bg-[#f8faff] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] border-r border-border/50">
                                        <div className="flex items-center !gap-3">
                                            <div className="w-8 h-8 rounded-full !bg-primary/10 text-primary flex items-center justify-center text-xs font-bold uppercase shrink-0 border border-primary/20">
                                                {student.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-sm text-text-main whitespace-nowrap">{student.name}</span>
                                        </div>
                                    </td>
                                    {student.entries.map((entry, i) => (
                                        <td key={i} className="!px-2 !py-3 text-center border-r border-border/10 last:border-r-0">
                                            {entry.status ? (
                                                <StatusDot status={entry.status} />
                                            ) : (
                                                <span className="text-text-muted/20 text-lg">—</span>
                                            )}
                                        </td>
                                    ))}
                                    <td className="!px-5 !py-3 sticky right-0 !bg-surface z-10 group-hover:!bg-[#f8faff] shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.05)] border-l border-border/50">
                                        <div className="flex flex-col items-center !gap-1">
                                            <span className={`text-xs font-black ${student.rate >= 80 ? 'text-green-600' : student.rate >= 60 ? 'text-orange-500' : 'text-red-500'}`}>
                                                {student.rate}%
                                            </span>
                                            <div className="w-12 h-1 !bg-background rounded-full overflow-hidden border border-border/50">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${student.rate >= 80 ? '!bg-green-500' : student.rate >= 60 ? '!bg-orange-500' : '!bg-red-500'}`}
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
                    {paginatedRows.map(student => (
                        <div key={student.id} className="!p-4 hover:!bg-primary/5 transition-colors">
                            <div className="flex items-center justify-between !mb-4">
                                <div className="flex items-center !gap-3">
                                    <div className="w-9 h-9 rounded-full !bg-primary/10 text-primary flex items-center justify-center text-sm font-bold uppercase shrink-0 border border-primary/20">
                                        {student.name.charAt(0)}
                                    </div>
                                    <p className="font-bold text-[15px] text-text-main">{student.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-black ${student.rate >= 80 ? 'text-green-600' : student.rate >= 60 ? 'text-orange-500' : 'text-red-500'}`}>
                                        {student.rate}%
                                    </p>
                                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Chuyên cần</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-4 xs:grid-cols-5 gap-2">
                                {student.entries.map((entry, i) => {
                                    const cfg = getStatusCfg(entry.status);
                                    return (
                                        <div
                                            key={i}
                                            className={`flex flex-col items-center justify-center !py-2 rounded-xl border transition-all ${
                                                entry.status ? cfg.badge : '!bg-background border-border/50 text-text-muted/30'
                                            }`}
                                        >
                                            <span className="text-[9px] font-bold mb-1">B{sessions[i]?.session}</span>
                                            {entry.status ? (
                                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                            ) : (
                                                <div className="w-1.5 h-[1px] !bg-current opacity-30" />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className={`!p-2.5 rounded-xl border transition-all ${
                            currentPage === 1 
                                ? 'border-border text-border !bg-background cursor-not-allowed opacity-50' 
                                : '!bg-surface border-border text-text-main hover:border-primary hover:text-primary active:scale-95 shadow-sm'
                        }`}
                    >
                        <Icon icon="solar:alt-arrow-left-linear" className="text-lg" />
                    </button>
                    
                    <div className="flex items-center gap-1.5">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                                    currentPage === page
                                        ? '!bg-primary text-white shadow-lg shadow-primary/30'
                                        : '!bg-surface text-text-muted hover:!bg-primary/5 hover:text-text-main border border-border shadow-sm'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className={`!p-2.5 rounded-xl border transition-all ${
                            currentPage === totalPages 
                                ? 'border-border text-border !bg-background cursor-not-allowed opacity-50' 
                                : '!bg-surface border-border text-text-main hover:border-primary hover:text-primary active:scale-95 shadow-sm'
                        }`}
                    >
                        <Icon icon="solar:alt-arrow-right-linear" className="text-lg" />
                    </button>
                </div>
            )}
        </div>
    );
};

// ── Atomic components ─────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
    const cfg = getStatusCfg(status);
    return (
        <span className={`inline-flex items-center !gap-1.5 !px-2.5 !py-1 rounded-full border text-xs font-semibold ${cfg.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
};

const StatusDot = ({ status }) => {
    const cfg = getStatusCfg(status);
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
    <div className="!bg-surface border border-border rounded-2xl !py-16 flex flex-col items-center text-center !gap-3">
        <div className="w-16 h-16 !bg-background rounded-full flex items-center justify-center border border-border">
            <Icon icon="solar:ghost-smile-bold-duotone" className="text-3xl text-text-muted" />
        </div>
        <p className="font-bold text-text-main">Không tìm thấy dữ liệu</p>
        <p className="text-sm text-text-muted">Thử điều chỉnh lại bộ lọc tìm kiếm</p>
    </div>
);

export default ClassAttendancePage;
