import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import SetupRecurringScheduleModal from './components/SetupRecurringScheduleModal';
import AttendanceModal from './components/AttendanceModal';

// --- Mock Data ---
const MOCK_GENERATED_LESSONS = [
    { id: 1, date: '2026-04-07', day: 'Thứ 3', startTime: '17:30', endTime: '19:00', status: 'scheduled', session: 1 },
    { id: 2, date: '2026-04-09', day: 'Thứ 5', startTime: '17:30', endTime: '19:00', status: 'scheduled', session: 2 },
    { id: 3, date: '2026-04-14', day: 'Thứ 3', startTime: '17:30', endTime: '19:00', status: 'completed', session: 3 },
    { id: 4, date: '2026-04-16', day: 'Thứ 5', startTime: '17:30', endTime: '19:00', status: 'scheduled', session: 4 },
    { id: 5, date: '2026-04-21', day: 'Thứ 3', startTime: '17:30', endTime: '19:00', status: 'scheduled', session: 5 },
    { id: 6, date: '2026-04-23', day: 'Thứ 5', startTime: '17:30', endTime: '19:00', status: 'cancelled', session: 6 },
];

const DAYS_OF_WEEK = [
    { id: 'MON', label: 'T2' }, { id: 'TUE', label: 'T3' }, { id: 'WED', label: 'T4' },
    { id: 'THU', label: 'T5' }, { id: 'FRI', label: 'T6' }, { id: 'SAT', label: 'T7' }, { id: 'SUN', label: 'CN' },
];

const STATUS_CONFIG = {
    scheduled: { label: 'Sắp diễn ra', className: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
    completed:  { label: 'Đã hoàn thành', className: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500' },
    cancelled:  { label: 'Đã hủy', className: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-400' },
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
    const [scheduleConfig, setScheduleConfig] = useState(MOCK_SCHEDULE_CONFIG); // null = chưa có lịch
    const [lessons, setLessons] = useState(MOCK_GENERATED_LESSONS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [deletingId, setDeletingId] = useState(null);

    // Attendance state
    const [attendanceTarget, setAttendanceTarget] = useState(null); // { lesson, existingRecord }
    // Records: { [lessonId]: student[] }
    const [attendanceRecords, setAttendanceRecords] = useState({});

    const filteredLessons = filterStatus === 'all' ? lessons : lessons.filter(l => l.status === filterStatus);

    const handleSaveSche = (data) => {
        setScheduleConfig(data);
        // In real app: generate lessons from config
        setIsModalOpen(false);
    };

    const handleDeleteLesson = (id) => {
        setDeletingId(id);
        setTimeout(() => {
            setLessons(prev => prev.filter(l => l.id !== id));
            setDeletingId(null);
        }, 600);
    };

    const handleDeleteSchedule = () => {
        setScheduleConfig(null);
        setLessons([]);
        toast.success('Đã xóa lịch định kỳ và toàn bộ buổi học.');
    };

    const handleOpenAttendance = (lesson) => {
        setAttendanceTarget({
            lesson,
            existingRecord: attendanceRecords[lesson.id] || null,
        });
    };

    const handleSaveAttendance = (lessonId, students) => {
        // Persist the attendance record
        setAttendanceRecords(prev => ({ ...prev, [lessonId]: students }));
        // Mark lesson as completed
        setLessons(prev =>
            prev.map(l => l.id === lessonId ? { ...l, status: 'completed' } : l)
        );
        setAttendanceTarget(null);
    };

    // ── Empty State ──
    if (!scheduleConfig) {
        return (
            <div className="flex flex-col items-center text-center !gap-6 !py-16 bg-surface !p-8 rounded-[2rem] border border-border">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon icon="solar:calendar-add-bold-duotone" className="text-5xl text-primary" />
                    </div>
                    <div className="absolute -right-1 -bottom-1 w-9 h-9 rounded-full bg-orange-400/20 border-2 border-surface flex items-center justify-center">
                        <Icon icon="solar:question-circle-bold-duotone" className="text-orange-500 text-lg" />
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-text-main font-['Outfit']">Chưa có lịch định kỳ</h2>
                    <p className="text-text-muted mt-2 max-w-md text-sm leading-relaxed">
                        Lớp học này chưa được thiết lập lịch định kỳ. Nhấn nút bên dưới để cấu hình lịch học, hệ thống sẽ tự động tạo danh sách các buổi học.
                    </p>
                </div>
                <div className="flex flex-wrap justify-center !gap-3">
                    {[
                        { icon: 'solar:calendar-date-bold-duotone', label: 'Chọn ngày khai giảng', color: 'text-blue-500 bg-blue-500/10' },
                        { icon: 'solar:clock-circle-bold-duotone', label: 'Đặt khung giờ học', color: 'text-orange-500 bg-orange-500/10' },
                        { icon: 'solar:list-check-minimalistic-bold-duotone', label: 'Tự động tạo buổi học', color: 'text-green-500 bg-green-500/10' },
                    ].map((s, i) => (
                        <div key={i} className="flex items-center !gap-2 !px-4 !py-2.5 bg-background border border-border rounded-2xl text-sm font-semibold text-text-muted">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${s.color}`}>
                                <Icon icon={s.icon} className="text-sm" />
                            </div>
                            {s.label}
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center !gap-2 !px-8 !py-3.5 !bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Icon icon="solar:calendar-add-bold-duotone" className="text-xl" />
                    Thiết lập lịch định kỳ ngay
                </button>
                <SetupRecurringScheduleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveSche} />
            </div>
        );
    }

    // ── Configured State ──
    const paymentLabels = { bank_transfer: 'Chuyển khoản', cash: 'Tiền mặt', e_wallet: 'Ví điện tử' };
    const templateLabels = { T1: 'Cấu trúc 3 kỳ', T2: 'Cấu trúc 2 kỳ', T3: 'Điểm danh/buổi', T4: 'Không điểm danh' };

    return (
        <div className="!space-y-6 animate-fade-in">
            {/* ── Config Summary Card ── */}
            <div className="bg-surface !p-6 rounded-[2rem] border border-border shadow-sm">
                <div className="flex items-start justify-between !mb-5">
                    <div className="flex items-center !gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <Icon icon="solar:settings-bold-duotone" className="text-xl" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-text-main">Cấu hình lịch định kỳ</h2>
                            <p className="text-xs text-text-muted">Thông tin thiết lập hiện tại của lớp</p>
                        </div>
                    </div>
                    <div className="flex items-center !gap-2">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center !gap-1.5 text-xs font-semibold text-primary !px-3 !py-2 border border-primary/30 rounded-xl hover:bg-primary/5 transition-colors"
                        >
                            <Icon icon="solar:pen-bold-duotone" className="text-sm" /> Chỉnh sửa
                        </button>
                        <button
                            onClick={handleDeleteSchedule}
                            className="flex items-center !gap-1.5 text-xs font-semibold text-red-500 !px-3 !py-2 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                        >
                            <Icon icon="solar:trash-bin-2-bold-duotone" className="text-sm" /> Xóa lịch
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 !gap-3">
                    {[
                        {
                            icon: 'solar:calendar-date-bold-duotone', color: 'text-blue-500 bg-blue-500/10',
                            label: 'Ngày khai giảng',
                            value: new Date(scheduleConfig.openingDate + 'T00:00:00').toLocaleDateString('vi-VN')
                        },
                        {
                            icon: 'solar:calendar-mark-bold-duotone', color: 'text-violet-500 bg-violet-500/10',
                            label: 'Ngày học',
                            value: scheduleConfig.selectedDays.map(id => DAYS_OF_WEEK.find(d => d.id === id)?.label).join(', ')
                        },
                        {
                            icon: 'solar:clock-circle-bold-duotone', color: 'text-orange-500 bg-orange-500/10',
                            label: 'Ca học',
                            value: `${scheduleConfig.startTime} – ${scheduleConfig.endTime}`
                        },
                        {
                            icon: 'solar:document-text-bold-duotone', color: 'text-indigo-500 bg-indigo-500/10',
                            label: 'Bảng điểm',
                            value: templateLabels[scheduleConfig.transcriptTemplateId] || '-'
                        },
                        {
                            icon: 'solar:tag-price-bold-duotone', color: 'text-emerald-500 bg-emerald-500/10',
                            label: 'Học phí/buổi',
                            value: Number(scheduleConfig.pricePerLesson).toLocaleString('vi-VN') + ' ₫'
                        },
                        {
                            icon: 'solar:card-transfer-bold-duotone', color: 'text-pink-500 bg-pink-500/10',
                            label: 'Thanh toán',
                            value: paymentLabels[scheduleConfig.paymentMethod] || '-'
                        },
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col !gap-2 !p-4 bg-background rounded-2xl border border-border">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${item.color}`}>
                                <Icon icon={item.icon} className="text-base" />
                            </div>
                            <p className="text-[11px] text-text-muted">{item.label}</p>
                            <p className="text-sm font-bold text-text-main leading-tight truncate">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Lesson List ── */}
            <div className="bg-surface !p-6 rounded-[2rem] border border-border shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between !gap-4 !mb-6">
                    <div className="flex items-center !gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Icon icon="solar:list-check-minimalistic-bold-duotone" className="text-xl" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-text-main">Danh sách buổi học</h2>
                            <p className="text-xs text-text-muted">Tổng cộng {lessons.length} buổi được tạo</p>
                        </div>
                    </div>

                    {/* Filter */}
                    <div className="flex items-center !gap-1 !bg-background border border-border rounded-xl !p-1">
                        {[
                            { id: 'all', label: 'Tất cả', count: lessons.length },
                            { id: 'scheduled', label: 'Sắp tới', count: lessons.filter(l => l.status === 'scheduled').length },
                            { id: 'completed', label: 'Hoàn thành', count: lessons.filter(l => l.status === 'completed').length },
                            { id: 'cancelled', label: 'Đã hủy', count: lessons.filter(l => l.status === 'cancelled').length },
                        ].map(tab => (
                            <button key={tab.id} onClick={() => setFilterStatus(tab.id)}
                                className={`flex items-center !gap-1.5 !px-3 !py-2 rounded-lg text-xs font-semibold transition-all ${
                                    filterStatus === tab.id ? '!bg-primary text-white shadow-sm' : 'text-text-muted hover:text-text-main'
                                }`}>
                                {tab.label}
                                <span className={`text-[10px] font-bold !px-1.5 !py-0.5 rounded-md ${filterStatus === tab.id ? 'bg-white/20' : 'bg-border'}`}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {filteredLessons.length === 0 ? (
                    <div className="text-center !py-12 text-text-muted">
                        <Icon icon="solar:calendar-minimalistic-bold-duotone" className="mx-auto text-5xl !mb-3 opacity-30" />
                        <p className="font-medium text-sm">Không có buổi học nào</p>
                    </div>
                ) : (
                    <div className="!space-y-3">
                        {filteredLessons.map(lesson => {
                            const cfg = STATUS_CONFIG[lesson.status];
                            const isDeleting = deletingId === lesson.id;
                            return (
                                <div key={lesson.id}
                                    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between !gap-4 !p-4 rounded-2xl border transition-all group ${
                                        isDeleting ? 'opacity-0 scale-95 border-red-200 bg-red-50' :
                                        'border-border hover:border-primary/30 hover:shadow-sm bg-background'
                                    }`}>
                                    <div className="flex items-center !gap-4 w-full sm:w-auto">
                                        {/* Session badge */}
                                        <div className="flex flex-col items-center justify-center min-w-[56px] !px-3 !py-2.5 bg-primary/10 rounded-xl text-primary border border-primary/20 shrink-0">
                                            <span className="text-[9px] font-bold uppercase tracking-wide opacity-70">Buổi</span>
                                            <span className="text-xl font-extrabold leading-none">{lesson.session}</span>
                                        </div>
                                        <div className="!space-y-1">
                                            <p className="font-bold text-text-main text-sm">
                                                {lesson.day}, {new Date(lesson.date + 'T00:00:00').toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                            </p>
                                            <div className="flex items-center !gap-3 text-xs text-text-muted">
                                                <span className="flex items-center !gap-1">
                                                    <Icon icon="solar:clock-linear" className="text-primary/70" />
                                                    {lesson.startTime} – {lesson.endTime}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center !gap-2 w-full sm:w-auto justify-between sm:justify-end">
                                        {/* Status */}
                                        <span className={`flex items-center !gap-1.5 text-[11px] font-bold !px-3 !py-1.5 rounded-full border ${cfg.className}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                            {cfg.label}
                                        </span>

                                        {/* Actions */}
                                        <div className="flex items-center !gap-2">
                                            {/* Attendance button */}
                                            {lesson.status === 'scheduled' && (
                                                <button
                                                    onClick={() => handleOpenAttendance(lesson)}
                                                    className="flex items-center !gap-1.5 !px-3 !py-1.5 text-xs font-bold !bg-primary text-white rounded-xl shadow-sm hover:bg-primary/90 transition-all whitespace-nowrap"
                                                >
                                                    <Icon icon="material-symbols:fact-check-rounded" className="text-sm" />
                                                    Điểm danh
                                                </button>
                                            )}
                                            {lesson.status === 'completed' && (
                                                <button
                                                    onClick={() => handleOpenAttendance(lesson)}
                                                    className="flex items-center !gap-1.5 !px-3 !py-1.5 text-xs font-semibold text-primary border border-primary/30 bg-primary/5 rounded-xl hover:bg-primary/10 transition-all whitespace-nowrap"
                                                >
                                                    <Icon icon="material-symbols:visibility-rounded" className="text-sm" />
                                                    Xem / Sửa DD
                                                </button>
                                            )}
                                            {/* Delete */}
                                            <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                                <button
                                                    title="Xóa buổi học"
                                                    onClick={() => handleDeleteLesson(lesson.id)}
                                                    className="!p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-200"
                                                >
                                                    <Icon icon="material-symbols:delete-outline-rounded" className="text-lg" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Schedule Config Modal */}
            <SetupRecurringScheduleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveSche}
                initialData={scheduleConfig}
            />

            {/* Attendance Modal */}
            <AttendanceModal
                isOpen={!!attendanceTarget}
                lesson={attendanceTarget?.lesson}
                existingRecord={attendanceTarget?.existingRecord}
                onClose={() => setAttendanceTarget(null)}
                onSave={handleSaveAttendance}
            />
        </div>
    );
};

export default ClassSchedulePage;
