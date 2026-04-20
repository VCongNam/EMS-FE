import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import SetupRecurringScheduleModal from './components/SetupRecurringScheduleModal';
import AttendanceModal from './components/AttendanceModal';
import SessionModal from './components/SessionModal';
import useAuthStore from '../../../../../store/authStore';
import { sessionService } from '../../../api/sessionService';
import studentScheduleService from '../../../api/studentScheduleService';
import ConfirmModal from '../../../../../components/ui/ConfirmModal';
import { useTAPermission } from '../../../../dashboard/context/TAPermissionContext';

const DAYS_OF_WEEK = [
    { id: 'MON', label: 'T2' }, { id: 'TUE', label: 'T3' }, { id: 'WED', label: 'T4' },
    { id: 'THU', label: 'T5' }, { id: 'FRI', label: 'T6' }, { id: 'SAT', label: 'T7' }, { id: 'SUN', label: 'CN' },
];

const STATUS_CONFIG = {
    scheduled: { label: 'Sắp diễn ra', className: '!bg-blue-100 text-blue-700 border-blue-200', dot: '!bg-blue-500' },
    'sắp diễn ra': { label: 'Sắp diễn ra', className: '!bg-blue-100 text-blue-700 border-blue-200', dot: '!bg-blue-500' },
    completed: { label: 'Đã hoàn thành', className: '!bg-green-100 text-green-700 border-green-200', dot: '!bg-green-500' },
    'đã kết thúc': { label: 'Đã kết thúc', className: '!bg-green-100 text-green-700 border-green-200', dot: '!bg-green-500' },
    canceled: { label: 'Đã hủy', className: '!bg-red-100 text-red-700 border-red-200', dot: '!bg-red-400' },
    cancelled: { label: 'Đã hủy', className: '!bg-red-100 text-red-700 border-red-200', dot: '!bg-red-400' },
    'đã hủy': { label: 'Đã hủy', className: '!bg-red-100 text-red-700 border-red-200', dot: '!bg-red-400' },
};

const MOCK_SCHEDULE_CONFIG = {
    openingDate: '2026-04-07',
    transcriptTemplateId: 'T1',
    selectedDays: ['TUE', 'THU'],
    startTime: '17:30',
    endTime: '19:00',
    pricePerLesson: '150000',
    paymentMethod: 'bank_transfer',
};

const ClassSchedulePage = () => {
    const { classId } = useParams();
    const { user } = useAuthStore();
    const isTeacherOrTA = ['TEACHER', 'TA'].includes(user?.role?.toUpperCase());
    const { hasPermission, isTA } = useTAPermission();
    const canAttend = !isTA || hasPermission('Attendance');

    const [scheduleConfig, setScheduleConfig] = useState(MOCK_SCHEDULE_CONFIG);
    const [lessons, setLessons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sessionModalState, setSessionModalState] = useState({ isOpen: false, initialData: null });
    const [filterStatus, setFilterStatus] = useState('all');
    const [deletingId, setDeletingId] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, sessionId: null });

    const [attendanceTarget, setAttendanceTarget] = useState(null);

    const fetchSessions = useCallback(async () => {
        if (!classId) return;
        const token = useAuthStore.getState().user?.token;
        const role = user?.role?.toUpperCase();

        try {
            setIsLoading(true);
            let res;

            if (role === 'STUDENT') {
                // Students use the StudentSchedule API
                const params = {
                    FromDate: '01/01/2025',
                    ToDate: '01/01/2027',
                    ClassId: classId
                };
                res = await studentScheduleService.getSchedule(params, token);
            } else {
                // Teachers and TAs use the sessionService
                res = await sessionService.getClassSessions(classId, token);
            }

            if (res.ok) {
                const response = await res.json();
                // Both APIs return an array of sessions in response.data or raw array
                const sessionData = Array.isArray(response) ? response : response.data || [];

                const mappedLessons = sessionData.map((item, index) => {
                    const dateObj = new Date(item.startTime || item.date);
                    
                    // Format to GMT+7 (Asia/Ho_Chi_Minh)
                    const gmt7Formatter = new Intl.DateTimeFormat('en-GB', {
                        timeZone: 'Asia/Ho_Chi_Minh',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                        weekday: 'short'
                    });

                    const parts = gmt7Formatter.formatToParts(dateObj);
                    const getPart = (type) => parts.find(p => p.type === type)?.value;
                    
                    const gmt7Date = `${getPart('year')}-${getPart('month')}-${getPart('day')}`;
                    const gmt7StartTime = `${getPart('hour')}:${getPart('minute')}`;
                    
                    // Also for endTime
                    const endDateObj = new Date(item.endTime || item.date);
                    const endParts = gmt7Formatter.formatToParts(endDateObj);
                    const getEndPart = (type) => endParts.find(p => p.type === type)?.value;
                    const gmt7EndTime = `${getEndPart('hour')}:${getEndPart('minute')}`;

                    const dayLabels = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
                    const dayNameMap = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
                    const dayIdx = dayNameMap[getPart('weekday')] ?? dateObj.getDay();

                    // Normalize status: handle both English keys and Vietnamese strings
                    const rawStatus = item.status || '';
                    const normalizedStatus = rawStatus.toLowerCase();

                    return {
                        id: item.sessionId || item.sessionID,
                        session: index + 1,
                        day: dayLabels[dayIdx],
                        date: gmt7Date,
                        startTime: gmt7StartTime,
                        endTime: gmt7EndTime,
                        status: normalizedStatus || 'scheduled',
                        attendanceStatus: item.attendanceStatus || null,
                        title: item.title || item.className,
                        raw: item
                    };
                });

                // Sort by date and startTime
                mappedLessons.sort((a, b) => {
                    const dateDesc = new Date(a.date) - new Date(b.date);
                    if (dateDesc === 0) {
                        return a.startTime.localeCompare(b.startTime);
                    }
                    return dateDesc;
                });

                setLessons(mappedLessons);
            } else {
                console.error('Failed to fetch sessions');
            }
        } catch (error) {
            console.error('Error fetching sessions:', error);
        } finally {
            setIsLoading(false);
        }
    }, [classId, user]);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    const itemsPerPage = 8;
    const [currentPage, setCurrentPage] = useState(1);

    const filteredLessons = filterStatus === 'all' ? lessons : lessons.filter(l => {
        if (filterStatus === 'scheduled') return l.status === 'scheduled' || l.status === 'sắp diễn ra';
        if (filterStatus === 'completed') return l.status === 'completed' || l.status === 'đã kết thúc';
        if (filterStatus === 'cancelled') return l.status === 'cancelled' || l.status === 'canceled' || l.status === 'đã hủy';
        return l.status === filterStatus;
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [filterStatus, lessons]);

    const totalPages = Math.ceil(filteredLessons.length / itemsPerPage);
    const paginatedLessons = filteredLessons.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSaveSche = (data) => {
        setScheduleConfig(data);
        setIsModalOpen(false);
    };

    const handleDeleteSchedule = () => {
        setScheduleConfig(null);
        toast.success('Đã xóa cấu hình lịch định kỳ.');
    };

    const handleDeleteLessonAPI = (id) => {
        setConfirmModal({ isOpen: true, sessionId: id });
    };

    const handleConfirmDelete = async () => {
        const id = confirmModal.sessionId;
        if (!id) return;

        const token = useAuthStore.getState().user?.token;
        if (!token) return;

        try {
            setDeletingId(id);
            const res = await sessionService.deleteSession(id, token);
            if (res.ok) {
                toast.success('Đã xóa kết quả buổi học thành công!');
                fetchSessions();
            } else {
                toast.error('Có lỗi xảy ra khi xóa buổi học');
            }
        } catch (error) {
            console.error(error);
            toast.error('Lỗi kết nối máy chủ');
        } finally {
            setDeletingId(null);
            setConfirmModal({ isOpen: false, sessionId: null });
        }
    };

    const handleSaveSessionAPI = async (formData) => {
        const token = useAuthStore.getState().user?.token;
        if (!token) return;

        try {
            const payload = {
                classId,
                title: formData.title,
                date: formData.date,
                startTime: formData.startTime.length === 5 ? `${formData.startTime}:00` : formData.startTime,
                endTime: formData.endTime.length === 5 ? `${formData.endTime}:00` : formData.endTime,
                meetingLink: formData.meetingLink,
                topic: formData.topic,
                note: formData.note
            };

            const isEdit = sessionModalState.initialData?.sessionId;
            const res = isEdit
                ? await sessionService.updateSession(sessionModalState.initialData.sessionId, payload, token)
                : await sessionService.createSession(payload, token);

            if (res.ok) {
                toast.success(isEdit ? 'Cập nhật lịch buổi học thành công' : 'Thêm buổi học thành công');
                setSessionModalState({ isOpen: false, initialData: null });
                fetchSessions();
            } else {
                toast.error('Lỗi khi lưu thông tin buổi học');
            }
        } catch (error) {
            console.error(error);
            toast.error('Lỗi kết nối máy chủ');
        }
    };

    const handleOpenAttendance = (lesson) => {
        setAttendanceTarget({
            lesson
        });
    };

    const handleSaveAttendance = () => {
        setAttendanceTarget(null);
        fetchSessions();
    };

    const paymentLabels = { bank_transfer: 'Chuyển khoản', cash: 'Tiền mặt', e_wallet: 'Ví điện tử' };
    const templateLabels = { T1: 'Cấu trúc 3 kỳ', T2: 'Cấu trúc 2 kỳ', T3: 'Điểm danh/buổi', T4: 'Không điểm danh' };

    return (
        <div className="!space-y-6 animate-fade-in relative min-h-[400px]">
            {isLoading && (
                <div className="absolute z-10 inset-0 !bg-background/50 backdrop-blur-[2px] rounded-[2rem] flex items-center justify-center">
                    <Icon icon="line-md:loading-loop" className="text-4xl text-primary" />
                </div>
            )}

            {/* ── Config Summary Card ── */}
            {/* {scheduleConfig ? (
                <div className="!bg-surface !p-6 rounded-[2rem] border border-border shadow-sm">
                    

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 !gap-3">
                        {[
                            { icon: 'solar:calendar-date-bold-duotone', color: 'text-blue-500 !bg-blue-500/10', label: 'Ngày khai giảng', value: new Date(scheduleConfig.openingDate + 'T00:00:00').toLocaleDateString('vi-VN') },
                            { icon: 'solar:calendar-mark-bold-duotone', color: 'text-violet-500 !bg-violet-500/10', label: 'Ngày học', value: scheduleConfig.selectedDays.map(id => DAYS_OF_WEEK.find(d => d.id === id)?.label).join(', ') },
                            { icon: 'solar:clock-circle-bold-duotone', color: 'text-orange-500 !bg-orange-500/10', label: 'Ca học', value: `${scheduleConfig.startTime} – ${scheduleConfig.endTime}` },
                            { icon: 'solar:document-text-bold-duotone', color: 'text-indigo-500 !bg-indigo-500/10', label: 'Bảng điểm', value: templateLabels[scheduleConfig.transcriptTemplateId] || '-' },
                            { icon: 'solar:tag-price-bold-duotone', color: 'text-emerald-500 !bg-emerald-500/10', label: 'Học phí/buổi', value: Number(scheduleConfig.pricePerLesson).toLocaleString('vi-VN') + ' ₫' },
                            { icon: 'solar:card-transfer-bold-duotone', color: 'text-pink-500 !bg-pink-500/10', label: 'Thanh toán', value: paymentLabels[scheduleConfig.paymentMethod] || '-' },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col !gap-2 !p-4 !bg-background rounded-2xl border border-border">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.color}`}>
                                    <Icon icon={item.icon} className="text-base" />
                                </div>
                                <p className="text-[11px] text-text-muted">{item.label}</p>
                                <p className="text-sm font-bold text-text-main leading-tight truncate">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center text-center !gap-4 !py-8 !bg-surface rounded-[2rem] border border-dashed border-border">
                    <div className="w-16 h-16 rounded-full !bg-primary/10 flex items-center justify-center">
                        <Icon icon="solar:calendar-add-bold-duotone" className="text-3xl text-primary" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-text-main">Chưa có Luật Lịch Định Kỳ</h2>
                        <p className="text-text-muted mt-1 text-sm">Cấu hình luật tự động đẻ lịch học hàng tuần</p>
                    </div>
                    {isTeacherOrTA && (
                        <button onClick={() => setIsModalOpen(true)} className="!bg-primary text-white font-bold !py-2 !px-6 rounded-xl hover:!bg-primary/90 text-sm">
                            Thiết lập ngay
                        </button>
                    )}
                </div>
            )} */}

            {/* ── Lesson List ── */}
            <div className="!bg-surface !p-6 rounded-[2rem] border border-border shadow-sm min-h-[400px]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between !gap-4 !mb-6">
                    <div className="flex items-center !gap-3">
                        <div className="w-10 h-10 rounded-2xl !bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <Icon icon="solar:list-check-minimalistic-bold-duotone" className="text-xl" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-text-main">Danh sách buổi học</h2>
                            <p className="text-xs text-text-muted">Tổng cộng {lessons.length} buổi được tạo trong hệ thống</p>
                        </div>
                    </div>

                    <div className="flex items-center w-full sm:w-auto justify-between sm:justify-end !gap-3">
                        {/* Filter */}
                        <div className="flex flex-1 items-center !gap-1 !bg-background border border-border rounded-xl !p-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                            {[
                                { id: 'all', label: 'Tất cả', count: lessons.length },
                                { id: 'scheduled', label: 'Sắp tới', count: lessons.filter(l => l.status === 'scheduled' || l.status === 'sắp diễn ra').length },
                                { id: 'completed', label: 'Hoàn thành', count: lessons.filter(l => l.status === 'completed' || l.status === 'đã kết thúc').length },
                                { id: 'cancelled', label: 'Đã hủy', count: lessons.filter(l => l.status === 'cancelled' || l.status === 'canceled' || l.status === 'đã hủy').length },
                            ].map(tab => (
                                <button key={tab.id} onClick={() => setFilterStatus(tab.id)}
                                    className={`flex whitespace-nowrap items-center !gap-1.5 !px-3 !py-2 rounded-lg text-xs font-semibold transition-all ${filterStatus === tab.id ? '!bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-main'
                                        }`}>
                                    {tab.label}
                                    <span className={`text-[10px] font-bold !px-1.5 !py-0.5 rounded-md ${filterStatus === tab.id ? '!bg-white/20' : '!bg-border'}`}>
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Add Session Button */}
                        {isTeacherOrTA && (
                            <button
                                onClick={() => setSessionModalState({ isOpen: true, initialData: null })}
                                className="flex shrink-0 items-center justify-center !w-10 !h-10 sm:!w-auto sm:!px-4 !bg-primary text-white rounded-xl shadow-md shadow-primary/30 hover:!bg-primary/90 hover:scale-105 transition-all"
                                title="Thêm buổi học thủ công"
                            >
                                <Icon icon="solar:medical-kit-bold" className="text-lg sm:!mr-2" />
                                <span className="hidden sm:inline font-bold text-sm">Thêm buổi</span>
                            </button>
                        )}
                    </div>
                </div>

                {filteredLessons.length === 0 ? (
                    <div className="text-center !py-12 text-text-muted">
                        <Icon icon="solar:calendar-minimalistic-bold-duotone" className="mx-auto text-5xl !mb-3 opacity-30" />
                        <p className="font-medium text-sm">Không có buổi học nào {filterStatus !== 'all' && 'trong trạng thái này'}</p>
                    </div>
                ) : (
                    <div className="!space-y-3">
                        {paginatedLessons.map((lesson, idx) => {
                            const cfg = STATUS_CONFIG[lesson.status] || STATUS_CONFIG.scheduled;
                            const isDeleting = deletingId === lesson.id;

                            // Attendance rules logic: Don't allow attendance more than 2 days in advance
                            const now = new Date();
                            now.setHours(0, 0, 0, 0);
                            const lessonDate = new Date(lesson.date + 'T00:00:00');
                            
                            // Days difference (positive if lesson is in future)
                            const diffDaysToFuture = Math.floor((lessonDate - now) / (1000 * 60 * 60 * 24));
                            const tooEarly = diffDaysToFuture > 2;
                            
                            // Days difference (positive if lesson is in past)
                            const diffDaysToPast = Math.floor((now - lessonDate) / (1000 * 60 * 60 * 24));
                            const isLocked = diffDaysToPast > 7;

                            return (
                                <div key={lesson.id || idx}
                                    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between !gap-4 !p-4 rounded-2xl border transition-all group ${isDeleting ? 'opacity-0 scale-95 border-red-200 !bg-red-50' :
                                        'border-border hover:border-primary/30 hover:shadow-sm !bg-background'
                                        }`}>
                                    <div className="flex items-center !gap-4 w-full sm:w-auto">
                                        <div className="flex flex-col items-center justify-center min-w-[56px] !px-3 !py-2.5 !bg-primary/10 rounded-xl text-primary border border-primary/20 shrink-0">
                                            <span className="text-[9px] font-bold uppercase tracking-wide opacity-70">Buổi</span>
                                            <span className="text-xl font-extrabold leading-none">{lesson.session}</span>
                                        </div>
                                        <div className="!space-y-1">
                                            <p className="font-bold text-text-main text-sm">
                                                {lesson.title || `${lesson.day}, ${new Date(lesson.date + 'T00:00:00').toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}`}
                                            </p>
                                            <div className="flex flex-wrap items-center !gap-3 text-xs text-text-muted">
                                                <span className="flex items-center !gap-1">
                                                    <Icon icon="solar:clock-linear" className="text-primary/70" />
                                                    {lesson.date} | {lesson.startTime} – {lesson.endTime}
                                                </span>
                                                {lesson.raw?.meetingLink && (
                                                    <a href={lesson.raw.meetingLink} target="_blank" rel="noreferrer" className="flex items-center !gap-1 text-blue-500 hover:underline">
                                                        <Icon icon="solar:link-minimalistic-linear" /> Link Meeting
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center !gap-2 w-full sm:w-auto justify-between sm:justify-end mt-2 sm:mt-0">
                                        <span className={`flex shrink-0 items-center !gap-1.5 text-[11px] font-bold !px-3 !py-1.5 rounded-full border ${cfg.className}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                            {cfg.label}
                                        </span>

                                        {isTeacherOrTA && (
                                            <div className="flex items-center !gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                {tooEarly ? (
                                                    <div className="flex items-center !gap-1.5 !px-3 !py-1.5 text-xs font-semibold rounded-xl border border-border bg-background text-text-muted cursor-not-allowed" title="Chưa đến hạn điểm danh (Chỉ được điểm danh trước tối đa 2 ngày)">
                                                        <Icon icon="solar:calendar-linear" className="text-sm" />
                                                        Chưa đến hạn
                                                    </div>
                                                ) : canAttend ? (
                                                    <button
                                                        onClick={() => handleOpenAttendance({ ...lesson, isLocked })}
                                                        className={`flex items-center !gap-1.5 !px-3 !py-1.5 text-xs font-bold rounded-xl shadow-sm transition-all whitespace-nowrap ${!isLocked && lesson.status === 'scheduled' ? '!bg-primary text-white hover:!bg-primary/90' : '!bg-background border border-border text-text-main hover:border-primary'}`}
                                                    >
                                                        <Icon icon={isLocked ? "material-symbols:visibility-rounded" : (lesson.status === 'scheduled' ? "material-symbols:fact-check-rounded" : "material-symbols:edit-rounded")} className="text-sm" />
                                                        {isLocked ? 'Xem điểm danh' : 'Điểm danh'}
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center !gap-1.5 !px-3 !py-1.5 text-xs font-semibold rounded-xl border border-amber-200 bg-amber-50 text-amber-600 cursor-not-allowed" title="Không có quyền điểm danh">
                                                        <Icon icon="material-symbols:lock-rounded" className="text-sm" />
                                                        Điểm danh
                                                    </div>
                                                )}
                                                <button
                                                    title="Sửa thông tin"
                                                    onClick={() => setSessionModalState({ isOpen: true, initialData: lesson.raw })}
                                                    className="!p-2 text-text-muted hover:text-primary hover:!bg-primary/10 rounded-xl transition-colors border border-transparent hover:border-primary/20 !bg-background"
                                                >
                                                    <Icon icon="solar:pen-bold-duotone" className="text-lg" />
                                                </button>
                                                <button
                                                    title="Xóa kết quả buổi học"
                                                    onClick={() => handleDeleteLessonAPI(lesson.id)}
                                                    className="!p-2 text-text-muted hover:text-red-500 hover:!bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-200 !bg-background"
                                                >
                                                    <Icon icon="material-symbols:delete-outline-rounded" className="text-lg" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-xl border transition-colors ${currentPage === 1
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
                                    className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${currentPage === page
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
                            className={`p-2 rounded-xl border transition-colors ${currentPage === totalPages
                                ? 'border-border text-border !bg-background cursor-not-allowed'
                                : 'border-border text-text-main hover:!bg-primary/5 hover:border-primary/30 !bg-background'
                                }`}
                        >
                            <Icon icon="solar:alt-arrow-right-linear" className="text-lg" />
                        </button>
                    </div>
                )}
            </div>

            <SetupRecurringScheduleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveSche}
                initialData={scheduleConfig}
            />

            <SessionModal
                isOpen={sessionModalState.isOpen}
                onClose={() => setSessionModalState({ isOpen: false, initialData: null })}
                onSave={handleSaveSessionAPI}
                initialData={sessionModalState.initialData}
            />

            <AttendanceModal
                isOpen={!!attendanceTarget}
                lesson={attendanceTarget?.lesson}
                onClose={() => setAttendanceTarget(null)}
                onSave={handleSaveAttendance}
                readOnly={!canAttend || attendanceTarget?.lesson?.isLocked}
            />

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, sessionId: null })}
                onConfirm={handleConfirmDelete}
                title="Xác nhận xóa buổi học"
                message="Bạn có chắc chắn muốn xóa buổi học này không? Hành động này không thể hoàn tác và dữ liệu điểm danh liên quan sẽ bị mất."
                confirmText="Xóa buổi học"
                cancelText="Hủy bỏ"
                type="danger"
            />
        </div>
    );
};

export default ClassSchedulePage;
