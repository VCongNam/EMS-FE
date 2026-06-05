import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuthStore from '../../../../../store/authStore';
import { assignmentService } from '../../../api/assignmentService';
import { studentAssignmentService } from '../../../api/studentAssignmentService';
import { toast } from 'react-toastify';
import { formatViDate } from '../../../../../utils/dateUtils';
import ConfirmModal from '../../../../../components/ui/ConfirmModal';
import Pagination from '../../../../../components/ui/Pagination';
import { useTAPermission } from '../../../../dashboard/context/TAPermissionContext';
import { extractErrorMessage } from '../../../../../utils/errorHandler';
import Loading from '../../../../../components/ui/Loading';

/* ─────────────────────────────────────────────
   Status helpers
───────────────────────────────────────────── */
const STATUS_BORDER_CLASS = {
    submitted: '!border-l-emerald-500',
    overdue:   '!border-l-red-500',
    draft:     '!border-l-slate-400',
    published: '!border-l-blue-600',
    graded:    '!border-l-purple-500',
};

const STATUS_PILL = {
    submitted: { label: 'Đã nộp',       cls: '!bg-emerald-50 !text-emerald-800' },
    overdue:   { label: 'Quá hạn',       cls: '!bg-red-50 !text-red-800' },
    draft:     { label: 'Bản nháp',       cls: '!bg-slate-100 !text-slate-600' },
    published: { label: 'Đã giao',        cls: '!bg-blue-50 !text-blue-800' },
    graded:    { label: 'Đã chấm điểm',   cls: '!bg-purple-50 !text-purple-800' },
};

const getStatusKey = (status, isOverdue, isSubmitted) => {
    if (isSubmitted) {
        const s = (status || '').toLowerCase();
        if (s === 'graded') return 'graded';
        return 'submitted';
    }
    if (isOverdue) return 'overdue';
    const s = (status || '').toLowerCase();
    if (s === 'draft')                          return 'draft';
    if (s === 'turned in' || s === 'submitted') return 'submitted';
    if (s === 'graded')                         return 'graded';
    return 'published';
};

/* ─────────────────────────────────────────────
   Row component (table-style)
───────────────────────────────────────────── */
const STATUS_DOT = {
    submitted: 'bg-emerald-500',
    overdue:   'bg-red-500',
    draft:     'bg-slate-400',
    published: 'bg-blue-500',
    graded:    'bg-purple-500',
};

const AssignmentRow = ({ assignment, isTeacherOrTA, canManageAssignment, onEdit, onDelete, navigate, index }) => {
    const {
        id, title, dueDateDisplay, statusKey, isOverdue,
        isDraft, isOffline, totalSubmissions, totalStudents,
        gradeCategoryName, grade, isGraded,
    } = assignment;

    const pill = STATUS_PILL[statusKey] || STATUS_PILL.published;
    const dot  = STATUS_DOT[statusKey]  || STATUS_DOT.published;

    return (
        <tr
            onClick={() => navigate(`../assignment/${id}`, { relative: 'path' })}
            className={`group cursor-pointer transition-colors border-b border-border last:border-b-0 ${index % 2 === 0 ? 'bg-white' : 'bg-background/40'} hover:bg-primary/5`}
        >
            {/* # */}
            <td className="!px-4 !py-3 !text-xs !text-text-muted !font-medium !w-8 !text-center !tabular-nums">
                {index + 1}
            </td>

            {/* Title */}
            <td className="!px-3 !py-3 !min-w-0">
                <p className="!text-sm !font-semibold !text-text-main !truncate group-hover:!text-primary !transition-colors !max-w-xs md:!max-w-sm lg:!max-w-md">
                    {title}
                </p>
                {gradeCategoryName && (
                    <span className="!text-[10px] !text-text-muted !font-medium">
                        {gradeCategoryName}
                    </span>
                )}
            </td>

            {/* Hình thức */}
            <td className="!px-3 !py-3 !hidden sm:!table-cell">
                <span className={`!inline-flex !items-center !gap-1 !text-[10px] !font-semibold !px-2 !py-0.5 !rounded !uppercase !tracking-wider ${
                    isOffline ? '!bg-amber-50 !text-amber-700' : '!bg-sky-50 !text-sky-700'
                }`}>
                    {isOffline ? 'Offline' : 'Online'}
                </span>
            </td>

            {/* Trạng thái */}
            <td className="!px-3 !py-3 !hidden md:!table-cell">
                <span className={`!inline-flex !items-center !gap-1.5 !text-[11px] !font-medium !px-2.5 !py-1 !rounded-full !whitespace-nowrap ${pill.cls}`}>
                    <span className={`!w-1.5 !h-1.5 !rounded-full !inline-block ${dot}`} />
                    {pill.label}
                </span>
            </td>

            {/* Nộp bài (teacher) / Điểm (student) */}
            <td className="!px-3 !py-3 !hidden lg:!table-cell !text-center">
                {isTeacherOrTA ? (
                    isDraft ? (
                        <span className="!text-sm !text-text-muted">—</span>
                    ) : (
                        <div>
                            <span className="!text-sm !font-bold !text-text-main">{totalSubmissions}</span>
                            <span className="!text-xs !text-text-muted !font-normal">/{totalStudents}</span>
                        </div>
                    )
                ) : (
                    isGraded && grade != null ? (
                        <span className="!text-sm !font-bold !text-primary">{grade}</span>
                    ) : (
                        <span className="!text-xs !text-text-muted">—</span>
                    )
                )}
            </td>

            {/* Đến hạn */}
            <td className="!px-3 !py-3 !text-right !whitespace-nowrap">
                <span className={`!text-xs !font-medium ${isOverdue ? '!text-red-600' : '!text-text-muted'}`}>
                    {dueDateDisplay}
                </span>
            </td>

            {/* Actions */}
            {isTeacherOrTA && canManageAssignment && (
                <td className="!px-3 !py-3 !text-right !w-24" onClick={e => e.stopPropagation()}>
                    <div className="!flex !items-center !justify-end !gap-1.5 !opacity-0 group-hover:!opacity-100 !transition-opacity">
                        <button
                            onClick={() => onEdit(id)}
                            className="!text-[11px] !font-semibold !px-2.5 !py-1 !rounded-lg !border !border-blue-200 !text-blue-600 hover:!bg-blue-50 !transition-colors !bg-transparent !cursor-pointer"
                        >
                            Sửa
                        </button>
                        <button
                            onClick={() => onDelete(id)}
                            className="!text-[11px] !font-semibold !px-2.5 !py-1 !rounded-lg !border !border-red-200 !text-red-500 hover:!bg-red-50 !transition-colors !bg-transparent !cursor-pointer"
                        >
                            Xóa
                        </button>
                    </div>
                </td>
            )}
        </tr>
    );
};

/* ─────────────────────────────────────────────
   Main page
───────────────────────────────────────────── */
const ClassworkPage = () => {
    const { user }    = useAuthStore();
    const { classId } = useParams();
    const navigate    = useNavigate();
    const { hasPermission, isTA } = useTAPermission();

    const userRole            = user?.role?.toUpperCase();
    const isTeacherOrTA       = userRole === 'TEACHER' || userRole === 'TA';
    const canManageAssignment = !isTA || hasPermission('Assignment');

    const [assignments,  setAssignments]  = useState([]);
    const [isLoading,    setIsLoading]    = useState(true);
    const [totalItems,   setTotalItems]   = useState(0);
    const [currentPage,  setCurrentPage]  = useState(1);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, assignmentId: null });
    const itemsPerPage = 8;

    /* ── Fetch ── */
    const fetchAssignments = async () => {
        if (!classId) return;
        try {
            setIsLoading(true);
            let res;
            if (isTeacherOrTA) {
                res = await assignmentService.getAssignmentsByClass(classId, user?.token, currentPage, itemsPerPage);
            } else {
                res = await studentAssignmentService.getAssignments(classId, user?.token, currentPage, itemsPerPage);
            }

            if (res.ok) {
                const result = await res.json();
                let items = [], total = 0;
                if (Array.isArray(result)) {
                    items = result; total = result.length;
                } else if (result.data?.items) {
                    items = result.data.items;
                    total = result.data.totalCount || result.data.totalItems || items.length;
                } else if (result.data) {
                    items = Array.isArray(result.data) ? result.data : [result.data];
                    total = items.length;
                }
                setAssignments(items);
                setTotalItems(total);
            } else {
                const errData = await res.json().catch(() => ({}));
                console.error('Lỗi API:', extractErrorMessage(errData, `Status: ${res.status}`));
            }
        } catch (err) {
            console.error('Lỗi mạng:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchAssignments(); }, [classId, user?.token, isTeacherOrTA, currentPage]);

    /* ── Handlers ── */
    const handleDeleteClick = (id) => setConfirmModal({ isOpen: true, assignmentId: id });

    const handleConfirmDelete = async () => {
        const id = confirmModal.assignmentId;
        if (!id) return;
        try {
            const res = await assignmentService.deleteAssignment(id, user?.token);
            if (res.ok) {
                toast.success('Xóa bài tập thành công!');
                fetchAssignments();
            } else {
                const errData = await res.json().catch(() => ({}));
                toast.error(extractErrorMessage(errData, 'Có lỗi xảy ra khi xóa bài tập.'));
            }
        } catch (err) {
            console.error(err);
            toast.error('Lỗi khi xóa bài tập.');
        } finally {
            setConfirmModal({ isOpen: false, assignmentId: null });
        }
    };

    /* ── Format data ── */
    const formattedAssignments = assignments.map(a => {
        const dDate     = new Date(a.dueDate);
        const isOverdue = !isNaN(dDate) && dDate < new Date() && !a.isSubmitted;
        const statusRaw = a.studentStatus || a.status || 'Published';
        const statusKey = getStatusKey(statusRaw, isOverdue, a.isSubmitted);

        return {
            id:               a.assignmentID || a.assignmentId,
            title:            a.title || 'Chưa có tiêu đề',
            dueDateDisplay:   isNaN(dDate) ? 'Không xác định' : formatViDate(a.dueDate, {
                hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric',
            }),
            statusKey,
            isSubmitted:      a.isSubmitted || false,
            grade:            a.grade,
            isOverdue,
            isDraft:          statusRaw.toLowerCase() === 'draft',
            totalSubmissions: a.totalSubmissions || 0,
            totalStudents:    a.totalStudents    || 0,
            gradeCategoryName: a.gradeCategoryName,
            isOffline:        a.isOffline || false,
            isGraded:         a.isGraded ?? a.isgraded ?? false,
        };
    });

    /* ── Stats ── */
    const totalDraft     = formattedAssignments.filter(a => a.isDraft).length;
    const totalPublished = formattedAssignments.filter(a => !a.isDraft).length;
    const totalOverdue   = formattedAssignments.filter(a => a.isOverdue).length;

    /* ── Render ── */
    return (
        <div className="!space-y-4 animate-fade-in-up">

            {/* ── Header bar ── */}
            {/* <div className="!flex !flex-col sm:!flex-row !justify-between !items-start sm:!items-center !gap-3">
                <div>
                    <h2 className="!text-xl !font-bold !text-text-main">Bài tập trên lớp</h2>
                    <p className="!text-sm !text-text-muted !mt-0.5">Quản lý và theo dõi bài tập của lớp học</p>
                </div>
                <div className="!flex-shrink-0">
                    {!isTeacherOrTA && (
                        <button className="!flex !items-center !gap-2 !text-sm !font-medium !text-primary hover:!bg-primary/10 !px-4 !py-2 !rounded-xl !transition-colors">
                            Xem bài tập của bạn
                        </button>
                    )}
                    {isTeacherOrTA && (
                        <button
                            onClick={() => canManageAssignment && navigate('../create-assignment', { relative: 'path' })}
                            disabled={!canManageAssignment}
                            title={!canManageAssignment ? 'Bạn không có quyền tạo bài tập' : ''}
                            className={`!flex !items-center !gap-2 !text-sm !font-semibold !px-5 !py-2 !rounded-xl !transition-colors !shadow-sm ${
                                canManageAssignment
                                    ? '!bg-primary !text-white hover:!bg-primary-hover'
                                    : '!bg-gray-100 !text-gray-400 !cursor-not-allowed'
                            }`}
                        >
                            + Tạo bài tập
                        </button>
                    )}
                </div>
            </div> */}

            {/* ── Stat chips (teacher only) ── */}
            {isTeacherOrTA && !isLoading && formattedAssignments.length > 0 && (
                <div className="!flex !flex-wrap !gap-2">
                    {[
                        { label: 'Tổng',     value: totalItems || formattedAssignments.length, cls: '!bg-slate-100 !text-slate-700' },
                        { label: 'Đã giao',  value: totalPublished, cls: '!bg-blue-50 !text-blue-700' },
                        { label: 'Bản nháp', value: totalDraft,     cls: '!bg-slate-100 !text-slate-500' },
                        { label: 'Quá hạn',  value: totalOverdue,   cls: '!bg-red-50 !text-red-600' },
                    ].map(chip => (
                        <span key={chip.label} className={`!inline-flex !items-center !gap-1.5 !text-xs !font-semibold !px-3 !py-1.5 !rounded-full ${chip.cls}`}>
                            {chip.label}
                            <span className="!font-bold">{chip.value}</span>
                        </span>
                    ))}
                </div>
            )}

            {/* ── Table / Loading / Empty ── */}
            {isLoading ? (
                <div className="!py-20 !flex !justify-center">
                    <Loading text="Đang tải danh sách bài tập..." />
                </div>
            ) : formattedAssignments.length > 0 ? (
                <div className="!bg-white !rounded-2xl !border !border-border !shadow-sm !overflow-hidden">
                    <div className="!overflow-x-auto">
                        <table className="!w-full !border-collapse">
                            <thead>
                                <tr className="bg-background/80 border-b border-border">
                                    <th className="!p-4 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap text-center w-10">#</th>
                                    <th className="!p-4 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap">Tên bài tập</th>
                                    <th className="!p-4 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap hidden sm:table-cell">Hình thức</th>
                                    <th className="!p-4 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap hidden md:table-cell">Trạng thái</th>
                                    <th className="!p-4 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap text-center hidden lg:table-cell">
                                        {isTeacherOrTA ? 'Nộp bài' : 'Điểm'}
                                    </th>
                                    <th className="!p-4 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap text-right">Đến hạn</th>
                                    {isTeacherOrTA && canManageAssignment && (
                                        <th className="!p-4 w-24" />
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {formattedAssignments.map((a, idx) => (
                                    <AssignmentRow
                                        key={a.id}
                                        assignment={a}
                                        index={idx}
                                        isTeacherOrTA={isTeacherOrTA}
                                        canManageAssignment={canManageAssignment}
                                        onEdit={(id) => navigate(`../edit-assignment/${id}`, { relative: 'path' })}
                                        onDelete={handleDeleteClick}
                                        navigate={navigate}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="!bg-white !rounded-2xl !border !border-border !px-8 !py-14 !shadow-sm !text-center">
                    <div className="!w-12 !h-12 !rounded-2xl !bg-background !flex !items-center !justify-center !mx-auto !mb-4">
                        <Icon icon="solar:clipboard-remove-bold-duotone" width={28} className="!text-text-muted" />
                    </div>
                    <h3 className="!text-base !font-semibold !text-text-main !mb-1">Chưa có bài tập nào</h3>
                    <p className="!text-sm !text-text-muted">
                        {isTeacherOrTA
                            ? 'Nhấp vào nút "+ Tạo bài tập" để giao bài cho lớp.'
                            : 'Giáo viên chưa giao bài tập nào cho lớp.'}
                    </p>
                </div>
            )}

            {/* ── Pagination ── */}
            {!isLoading && totalItems > itemsPerPage && (
                <div className="!flex !justify-center !pt-2">
                    <Pagination
                        currentPage={currentPage}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

            {/* ── Confirm delete ── */}
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, assignmentId: null })}
                onConfirm={handleConfirmDelete}
                title="Xác nhận xóa bài tập"
                message="Bạn có chắc chắn muốn xóa bài tập này không? Hành động này không thể hoàn tác."
                confirmText="Xóa bài tập"
                cancelText="Hủy bỏ"
                type="danger"
            />
        </div>
    );
};

export default ClassworkPage;


