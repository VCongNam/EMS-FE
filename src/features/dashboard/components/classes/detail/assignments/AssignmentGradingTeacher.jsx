import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { assignmentService } from '../../../../api/assignmentService';
import useAuthStore from '../../../../../../store/authStore';
import { toast } from 'react-toastify';
import { useTAPermission } from '../../../../../dashboard/context/TAPermissionContext';

/* ─── helpers ─────────────────────────────────────────────────────────────── */
const getFileIcon = (type = '', name = '') => {
    const t = (type + name).toLowerCase();
    if (t.includes('image') || /\.(png|jpe?g|gif|bmp|webp)/.test(t))
        return 'material-symbols:image-outline-rounded';
    if (t.includes('pdf')) return 'vscode-icons:file-type-pdf2';
    if (t.includes('word') || t.includes('doc')) return 'vscode-icons:file-type-word';
    if (t.includes('sheet') || t.includes('xls') || t.includes('csv'))
        return 'vscode-icons:file-type-excel';
    return 'material-symbols:insert-drive-file-outline-rounded';
};

const getInitials = (name = '') =>
    name
        .split(' ')
        .filter(Boolean)
        .slice(-2)
        .map((w) => w[0].toUpperCase())
        .join('');

const StatusBadge = ({ status }) => {
    const map = {
        'In Time': { bg: 'bg-green-100', text: 'text-green-700', label: 'Đã nộp' },
        'Late': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Nộp muộn' },
        'Pending': { bg: 'bg-red-100', text: 'text-red-600', label: 'Chưa nộp' },
        'Missing': { bg: 'bg-red-100', text: 'text-red-600', label: 'Chưa nộp' },
        'Not Submitted': { bg: 'bg-red-100', text: 'text-red-600', label: 'Chưa nộp' },
        'Graded': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Đã chấm' },
        'Đã nộp': { bg: 'bg-green-100', text: 'text-green-700', label: 'Đã nộp' },
        'Nộp muộn': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Nộp muộn' },
        'Chưa nộp': { bg: 'bg-red-100', text: 'text-red-600', label: 'Chưa nộp' },
    };
    const s = map[status] ?? { bg: 'bg-gray-100', text: 'text-gray-600', label: status };
    return (
        <span className={`inline-flex items-center !px-2.5 !py-0.5 rounded-full text-[11px] font-semibold ${s.bg} ${s.text}`}>
            {s.label}
        </span>
    );
};

const AvatarCircle = ({ name, status, size = 'md' }) => {
    const colorMap = {
        'In Time': 'bg-green-100 text-green-700',
        'Late': 'bg-amber-100 text-amber-700',
        'Pending': 'bg-red-100   text-red-600',
        'Missing': 'bg-red-100   text-red-600',
        'Not Submitted': 'bg-red-100   text-red-600',
        'Graded': 'bg-blue-100  text-blue-700',
        'Đã nộp': 'bg-green-100 text-green-700',
        'Nộp muộn': 'bg-amber-100 text-amber-700',
        'Chưa nộp': 'bg-red-100   text-red-600',
    };
    const sizeMap = {
        sm: 'w-8 h-8 text-[11px]',
        md: 'w-10 h-10 text-[13px]',
        lg: 'w-12 h-12 text-[15px]',
    };
    const color = colorMap[status] ?? 'bg-primary/15 text-primary';
    return (
        <div className={`rounded-full flex items-center justify-center font-bold shrink-0 ${sizeMap[size]} ${color}`}>
            {getInitials(name) || <Icon icon="material-symbols:person" className="text-base" />}
        </div>
    );
};

/* ─── FilePreview ──────────────────────────────────────────────────────────── */
const FilePreview = ({ file }) => {
    if (!file) {
        return (
            <div className="w-full h-44 sm:h-56 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 text-text-muted">
                <Icon icon="material-symbols:preview-off-outline-rounded" className="text-4xl opacity-40" />
                <p className="text-sm text-center">Chọn tệp bên trên để xem trước</p>
            </div>
        );
    }

    const url = file.fileUrl || file.url || '';
    const name = file.fileName || file.name || '';
    const ext = name.includes('.') ? name.split('.').pop().toLowerCase() : '';

    const isImage = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(ext);
    const isPdf = ext === 'pdf';
    const isOffice = ['xlsx', 'xls', 'docx', 'doc', 'pptx', 'ppt', 'csv'].includes(ext);

    const PreviewHeader = () => (
        <div className="!px-4 !py-2.5 border-b border-border bg-surface flex items-center justify-between shrink-0">
            <span className="text-xs font-semibold text-text-main flex items-center !gap-2">
                <Icon icon="material-symbols:preview-rounded" className="text-primary" />
                Xem trước — {ext.toUpperCase()}
            </span>
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-primary/10 text-text-muted hover:text-primary transition-colors"
                title="Mở tab mới"
            >
                <Icon icon="material-symbols:open-in-new-rounded" />
            </a>
        </div>
    );

    if (isImage) {
        return (
            <div className="w-full border border-border rounded-xl overflow-hidden flex flex-col" style={{ height: '420px' }}>
                <PreviewHeader />
                <div className="flex-1 overflow-auto bg-white flex items-center justify-center !p-2">
                    <img src={url} alt={name} className="max-w-full max-h-full object-contain" />
                </div>
            </div>
        );
    }

    if (isPdf) {
        return (
            <div className="w-full border border-border rounded-xl overflow-hidden flex flex-col" style={{ height: '420px' }}>
                <PreviewHeader />
                <iframe src={url} title={name} className="flex-1 w-full border-none" />
            </div>
        );
    }

    if (isOffice) {
        const googleUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
        return (
            <div className="w-full border border-border rounded-xl overflow-hidden flex flex-col" style={{ height: '420px' }}>
                <PreviewHeader />
                <iframe
                    src={googleUrl}
                    title={name}
                    className="flex-1 w-full border-none"
                    sandbox="allow-scripts allow-same-origin allow-popups"
                />
            </div>
        );
    }

    return (
        <div className="w-full h-44 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center !gap-3 text-text-muted bg-surface">
            <Icon icon="material-symbols:broken-image-outline-rounded" className="text-4xl opacity-40" />
            <p className="text-sm text-center">
                Không hỗ trợ xem trực tiếp định dạng <strong>{ext || 'không xác định'}</strong>
            </p>
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center !gap-1.5 text-white bg-primary !px-4 !py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-semibold"
            >
                <Icon icon="material-symbols:download-rounded" />
                Tải về hoặc mở ngoài
            </a>
        </div>
    );
};

/* ─── Main Component ──────────────────────────────────────────────────────── */
const AssignmentGradingTeacher = ({ assignment, onRefresh }) => {
    const { user } = useAuthStore();
    const { hasPermission, isTA } = useTAPermission();
    const canGrade = !isTA || hasPermission('Grade');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [scoreInput, setScoreInput] = useState('');
    const [commentInput, setCommentInput] = useState('');
    const [previewFile, setPreviewFile] = useState(null);
    const [isGrading, setIsGrading] = useState(false);
    const [isFeedbackPosting, setIsFeedbackPosting] = useState(false);
    const [isDownloadingAll, setIsDownloadingAll] = useState(false);

    // State cho việc chấm điểm hàng loạt trên bảng
    const [rowStates, setRowStates] = useState({}); // { studentId: { grade: '', file: null, fileName: '', isSaving: false } }

    const submissions = assignment.submissions || [];
    const countTurnedIn = submissions.filter((s) => 
        ['In Time', 'Late', 'Đã nộp', 'Nộp muộn', 'Graded'].includes(s.status) || 
        (s.submissionId !== null && s.submissionId !== undefined)
    ).length;
    const countMissing = submissions.length - countTurnedIn;

    const handleSelectStudent = async (sub) => {
        // Hiển thị thông tin cơ bản trước để UI phản hồi nhanh
        setSelectedStudent(sub);
        setScoreInput(sub.grade ?? sub.score ?? '');
        setCommentInput('');
        setPreviewFile(null);

        // Gọi API lấy chi tiết bài làm
        try {
            const res = await assignmentService.getSubmissionDetail(assignment.assignmentId, sub.studentId, user?.token);
            if (res.ok) {
                const result = await res.json();
                const detailedData = result.data || result;

                setSelectedStudent(prev => ({
                    ...prev,
                    ...detailedData,
                    // Map studentFullName -> fullName
                    fullName: prev.fullName || detailedData.studentFullName || detailedData.fullName,
                    studentName: prev.studentName || detailedData.studentFullName || detailedData.studentName,
                    status: detailedData.status || prev.status
                }));
            }
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết bài làm:", error);
        }
    };

    const handleBack = () => setSelectedStudent(null);

    const handleGrade = async () => {
        if (!selectedStudent || !selectedStudent.submissionId) {
            toast.error("Không tìm thấy thông tin bài nộp");
            return;
        }

        try {
            setIsGrading(true);
            const formData = new FormData();
            formData.append('Grade', scoreInput);
            // If we had a teacher file in singular grading mode, we'd add it here
            
            console.log("[Grade] SubmissionID:", selectedStudent.submissionId);
            console.log("[Grade] Form Data entries:");
            for (let pair of formData.entries()) {
                console.log(`  ${pair[0]}: ${pair[1]}`);
            }

            const res = await assignmentService.gradeSubmission(
                selectedStudent.submissionId,
                formData,
                user?.token
            );
            if (res.ok) {
                toast.success("Đã chấm điểm thành công!");
                if (onRefresh) onRefresh();
                // Cập nhật local state
                setSelectedStudent(prev => ({ ...prev, grade: scoreInput }));
            } else {
                toast.error("Lỗi khi chấm điểm");
            }
        } catch (error) {
            toast.error("Lỗi mạng khi chấm điểm");
        } finally {
            setIsGrading(false);
        }
    };

    const handlePostFeedback = async () => {
        if (!selectedStudent || !selectedStudent.submissionId) return;

        try {
            setIsFeedbackPosting(true);
            const res = await assignmentService.giveFeedback(
                selectedStudent.submissionId,
                commentInput,
                user?.token
            );
            if (res.ok) {
                toast.success("Đã gửi nhận xét thành công!");
                setCommentInput('');
                // Note: If BE returns actual feedback list, we should fetch it here
            } else {
                toast.error("Lỗi khi gửi nhận xét");
            }
        } catch (error) {
            toast.error("Lỗi mạng khi gửi nhận xét");
        } finally {
            setIsFeedbackPosting(false);
        }
    };

    const handleDownloadAll = async () => {
        try {
            setIsDownloadingAll(true);
            const res = await assignmentService.downloadAllSubmissions(assignment.assignmentId, user?.token);
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `submissions_${assignment.title || 'all'}.zip`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                toast.success("Đã bắt đầu tải về tất cả bài làm");
            } else {
                const errData = await res.json().catch(() => ({}));
                toast.error(errData.message || "Lỗi khi tải về bài làm");
            }
        } catch (error) {
            toast.error("Lỗi mạng khi tải về");
        } finally {
            setIsDownloadingAll(false);
        }
    };

    const handleRowGradeUpdate = (studentId, field, value) => {
        setRowStates(prev => ({
            ...prev,
            [studentId]: {
                ...(prev[studentId] || { grade: '', file: null, fileName: '' }),
                [field]: value
            }
        }));
    };

    const handleSaveRowGrade = async (sub) => {
        const state = rowStates[sub.studentId];
        const gradeValue = state?.grade ?? sub.grade ?? sub.score ?? '';

        if (!sub.submissionId) {
            toast.warning("Học sinh chưa nộp bài, không thể chấm điểm.");
            return;
        }

        try {
            setRowStates(prev => ({ ...prev, [sub.studentId]: { ...prev[sub.studentId], isSaving: true } }));
            
            const formData = new FormData();
            formData.append('Grade', gradeValue);
            if (state?.file) {
                formData.append('CorrectionFiles', state.file);
            }

            console.log("[RowGrade] SubmissionID:", sub.submissionId);
            console.log("[RowGrade] Form Data entries:");
            for (let pair of formData.entries()) {
                console.log(`  ${pair[0]}: ${pair[1]}`);
            }

            const res = await assignmentService.gradeSubmission(sub.submissionId, formData, user?.token);
            if (res.ok) {
                toast.success(`Đã chấm điểm cho ${sub.fullName || sub.studentName}`);
                if (onRefresh) onRefresh();
            } else {
                const err = await res.json().catch(() => ({}));
                toast.error(err.message || "Lỗi khi lưu điểm");
            }
        } catch (error) {
            toast.error("Lỗi kết nối");
        } finally {
            setRowStates(prev => ({ ...prev, [sub.studentId]: { ...prev[sub.studentId], isSaving: false } }));
        }
    };

    /* ── LEFT COLUMN ── */
    const LeftColumn = (
        <div
            className={`
                flex flex-col border-r border-border bg-background
                ${selectedStudent ? 'hidden md:flex' : 'flex'}
                w-full md:w-[280px] lg:w-[300px] shrink-0
            `}
        >
            {/* Assignment header */}
            <div className="!px-5 !py-4 border-b border-border bg-surface shrink-0">
                <h2
                    className="text-base font-bold text-text-main leading-snug !mb-3 line-clamp-2"
                    title={assignment.title}
                >
                    {assignment.title}
                </h2>
                <div className="flex items-center !gap-3">
                    <div className="flex-1 bg-green-50 border border-green-100 rounded-xl !px-3 !py-2">
                        <p className="text-xl font-extrabold text-green-700 leading-none">{countTurnedIn}</p>
                        <p className="text-[11px] text-green-600 font-medium !mt-0.5">Đã nộp</p>
                    </div>
                    <div className="flex-1 bg-red-50 border border-red-100 rounded-xl !px-3 !py-2">
                        <p className="text-xl font-extrabold text-red-600 leading-none">{countMissing}</p>
                        <p className="text-[11px] text-red-500 font-medium !mt-0.5">Chưa nộp</p>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="!px-4 !py-2.5 border-b border-border flex items-center justify-between shrink-0">
                <label className="flex items-center !gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-primary focus:ring-primary h-4 w-4" />
                    <span className="text-sm font-semibold text-text-main">Tất cả bài tập</span>
                </label>
                <div className="flex items-center !gap-1 shrink-0">
                    <button
                        onClick={handleDownloadAll}
                        disabled={isDownloadingAll || countTurnedIn === 0}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-40"
                        title="Tải về tất cả (.zip)"
                    >
                        {isDownloadingAll ? (
                            <Icon icon="solar:spinner-linear" className="animate-spin text-lg" />
                        ) : (
                            <Icon icon="material-symbols:download-for-offline-rounded" className="text-xl" />
                        )}
                    </button>
                    <button
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-primary/10 hover:text-primary transition-colors"
                        title="Lọc"
                    >
                        <Icon icon="material-symbols:filter-list-rounded" className="text-xl" />
                    </button>
                </div>
            </div>

            {/* Student list */}
            <div className="flex-1 overflow-y-auto">
                {submissions.map((sub) => {
                    const isActive = selectedStudent?.submissionId === sub.submissionId;
                    return (
                        <button
                            key={sub.submissionId}
                            onClick={() => handleSelectStudent(sub)}
                            className={`
                                w-full text-left flex items-center !gap-3 !px-4 !py-3
                                border-b border-border transition-colors
                                border-l-4
                                ${isActive
                                    ? 'bg-primary/5 border-l-primary'
                                    : 'hover:bg-surface border-l-transparent'}
                            `}
                        >
                            <AvatarCircle name={sub.fullName || sub.studentName} status={sub.status} size="sm" />
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-text-main truncate">{sub.fullName || sub.studentName}</p>
                                <div className="flex items-center gap-1.5">
                                    <StatusBadge status={sub.gradeStatus === 'Graded' ? 'Graded' : sub.status} />
                                </div>
                            </div>
                            <div className="flex items-center !gap-1 shrink-0">
                                <span className="text-xs font-bold text-text-main whitespace-nowrap">
                                    {sub.grade !== null && sub.grade !== undefined
                                        ? `${sub.grade}/${assignment.maxScore ?? 10}`
                                        : (sub.score !== null && sub.score !== undefined
                                            ? `${sub.score}/${assignment.maxScore ?? 10}`
                                            : `--/${assignment.maxScore ?? 10}`)}
                                </span>
                                <Icon icon="material-symbols:chevron-right-rounded" className="text-text-muted text-base md:hidden" />
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );

    /* ── GRADING PANEL ── */
    const GradingPanel = selectedStudent && (
        <div className="flex flex-col flex-1 min-w-0 bg-surface">
            {/* Header */}
            <div className="!px-4 sm:!px-6 !py-4 border-b border-border bg-surface shrink-0">
                {/* Mobile back */}
                <button
                    onClick={handleBack}
                    className="md:hidden flex items-center !gap-1.5 text-sm font-semibold text-text-muted hover:text-primary transition-colors !mb-3"
                >
                    <Icon icon="material-symbols:arrow-back-rounded" className="text-lg" />
                    Danh sách học sinh
                </button>

                <div className="flex flex-wrap items-center justify-between !gap-3">
                    {/* Student info */}
                    <div className="flex items-center !gap-3 min-w-0">
                        <AvatarCircle name={selectedStudent.fullName || selectedStudent.studentName} status={selectedStudent.status} size="md" />
                        <div className="min-w-0">
                            <h3 className="text-base font-bold text-text-main truncate leading-tight">
                                {selectedStudent.fullName || selectedStudent.studentName}
                            </h3>
                            <div className="!mt-0.5">
                                <StatusBadge status={selectedStudent.gradeStatus === 'Graded' ? 'Graded' : selectedStudent.status} />
                            </div>
                        </div>
                    </div>

                    {/* Score + action */}
                    <div className="flex items-center !gap-2.5 shrink-0">
                        {canGrade ? (
                            <>
                                <div className="flex items-center !gap-0 border border-border rounded-xl overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                                    <input
                                        type="number"
                                        value={scoreInput}
                                        onChange={(e) => setScoreInput(e.target.value)}
                                        placeholder="--"
                                        className="w-14 bg-transparent border-none text-center !py-2 !px-2 focus:outline-none font-bold text-primary text-sm"
                                    />
                                    <span className="bg-background !px-3 !py-2 text-text-muted font-medium text-sm border-l border-border">
                                        / {assignment.maxScore ?? 10}
                                    </span>
                                </div>
                                <button
                                    onClick={handleGrade}
                                    disabled={isGrading}
                                    className="!bg-primary text-white font-bold !px-5 !py-2 rounded-xl hover:bg-primary/90 transition-colors text-sm shadow-sm disabled:opacity-50"
                                >
                                    {isGrading ? <Icon icon="solar:spinner-linear" className="animate-spin text-lg" /> : 'Trả bài'}
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-2 !px-3 !py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs font-bold">
                                <Icon icon="material-symbols:lock-rounded" />
                                Không có quyền chấm điểm
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Body: files + comments */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">

                {/* Files panel */}
                <div className="flex-1 !p-5 overflow-y-auto border-b lg:border-b-0 lg:border-r border-border bg-background/40">
                    {selectedStudent.attachments && selectedStudent.attachments.length > 0 ? (
                        <div className="flex flex-col !gap-4">
                            <h4 className="font-semibold text-sm text-text-main flex items-center !gap-1.5">
                                <Icon icon="material-symbols:attach-file-rounded" className="text-primary rotate-45" />
                                Tệp đã nộp
                                <span className="!ml-0.5 text-xs text-text-muted font-normal">
                                    ({selectedStudent.attachments.length})
                                </span>
                            </h4>

                            {/* File grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 !gap-3">
                                {selectedStudent.attachments.map((file) => {
                                    const isActive = previewFile?.attachmentId === file.attachmentId;
                                    return (
                                        <div
                                            key={file.attachmentId}
                                            onClick={() => setPreviewFile(file)}
                                            className={`
                                                relative flex items-center !gap-3 !p-3 rounded-xl border cursor-pointer
                                                transition-all group
                                                ${isActive
                                                    ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                                                    : 'border-border bg-surface hover:border-primary/50 hover:bg-primary/5'
                                                }
                                            `}
                                        >
                                            <div className={`
                                                w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors
                                                ${isActive ? 'bg-primary/15 text-primary' : 'bg-background text-primary border border-border'}
                                            `}>
                                                <Icon icon={getFileIcon(file.fileType, file.fileName)} className="text-xl" />
                                            </div>
                                            <div className="flex-1 min-w-0 !pr-8">
                                                <p className="text-sm font-semibold text-text-main truncate group-hover:text-primary transition-colors">
                                                    {file.fileName}
                                                </p>
                                                <p className="text-xs text-text-muted !mt-0.5">
                                                    {file.submittedAt || selectedStudent.submittedAt ? 
                                                        new Date(file.submittedAt || selectedStudent.submittedAt).toLocaleString('vi-VN') : 
                                                        'N/A'}
                                                </p>
                                            </div>
                                            {/* Download btn */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const link = document.createElement('a');
                                                    link.href = file.fileUrl || '#';
                                                    link.setAttribute('download', file.fileName || 'download');
                                                    link.target = '_blank';
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    document.body.removeChild(link);
                                                }}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-border bg-background hover:bg-primary/10 hover:border-primary/30 hover:text-primary text-text-muted flex items-center justify-center transition-colors"
                                                title="Tải về"
                                            >
                                                <Icon icon="material-symbols:download-rounded" className="text-lg" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Preview area */}
                            <div className="!mt-1">
                                <FilePreview file={previewFile} />
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center !gap-3 text-text-muted !py-16">
                            <Icon icon="material-symbols:folder-off-outline-rounded" className="text-5xl opacity-40" />
                            <p className="text-base">Học sinh chưa nộp tệp nào.</p>
                        </div>
                    )}
                </div>

                {/* Comments panel */}
                <div className="w-full lg:w-72 flex flex-col bg-surface shrink-0">
                    <div className="!px-4 !py-3 border-b border-border bg-background/50 shrink-0">
                        <h4 className="font-semibold text-sm text-text-main flex items-center !gap-2">
                            <Icon icon="material-symbols:comment-rounded" className="text-primary" />
                            Nhận xét riêng tư
                        </h4>
                    </div>

                    <div className="flex-1 overflow-y-auto !p-4 min-h-[80px]">
                        <p className="text-sm text-text-muted text-center italic !mt-4">Chưa có nhận xét nào.</p>
                    </div>

                    <div className="!p-4 border-t border-border bg-background/50 shrink-0 flex flex-col !gap-2">
                        <textarea
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            placeholder="Thêm nhận xét..."
                            rows={3}
                            className="w-full bg-surface border border-border rounded-xl !p-3 resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-colors text-text-main placeholder:text-text-muted"
                        />
                        <button
                            onClick={handlePostFeedback}
                            disabled={!commentInput.trim() || isFeedbackPosting}
                            className="w-full bg-primary/10 text-primary font-bold !py-2 rounded-xl hover:bg-primary hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                        >
                            {isFeedbackPosting ? <Icon icon="solar:spinner-linear" className="animate-spin text-lg" /> : 'Đăng nhận xét'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    /* ── OVERVIEW PANEL (no student selected) ── */
    const OverviewPanel = !selectedStudent && (
        <div
            className={`
                flex-1 flex flex-col bg-[#F8FAFC] overflow-y-auto
                hidden md:flex
            `}
        >
            {/* Sticky overview header */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-border !px-6 sm:!px-8 !py-5 flex items-center !gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Icon icon="material-symbols:assignment-rounded" className="text-2xl" />
                </div>
                <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-black text-text-main truncate leading-tight">
                        {assignment.title}
                    </h2>
                    <div className="flex items-center !gap-2 !mt-1">
                        <span className="!px-2 !py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                            {assignment.gradeCategoryName || 'Bài tập'}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span className="text-xs text-text-muted font-medium">
                            ID: {assignment.assignmentId?.slice(0, 8)}…
                        </span>
                    </div>
                </div>
            </div>

            <div className="!p-6 sm:!p-8 w-full flex flex-col !gap-8 !pb-12">
                {/* Meta cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 !gap-4">
                    <div className="bg-white rounded-2xl border border-border !p-4 flex items-center !gap-4 shadow-sm">
                        <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                            <Icon icon="material-symbols:check-circle-rounded" className="text-2xl" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Đã nộp</p>
                            <p className="text-lg font-black text-text-main leading-none !mt-0.5">{countTurnedIn}/{submissions.length}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-border !p-4 flex items-center !gap-4 shadow-sm">
                        <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                            <Icon icon="material-symbols:alarm-on-rounded" className="text-2xl" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Hạn nộp</p>
                            <p className="text-sm font-bold text-text-main !mt-0.5">
                                {new Date(assignment.dueDate).toLocaleString('vi-VN', {
                                    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-border !p-4 flex items-center !gap-4 shadow-sm">
                        <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                            <Icon icon="material-symbols:grade-rounded" className="text-2xl" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Thang điểm</p>
                            <p className="text-sm font-bold text-text-main !mt-0.5">{assignment.maxScore ?? 10} điểm</p>
                        </div>
                    </div>
                </div>

                {/* Submissions Table Section */}
                <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
                    <div className="!px-6 !py-4 border-b border-border bg-background/30 flex items-center justify-between">
                        <div className="flex items-center !gap-2">
                            <Icon icon="material-symbols:list-alt-rounded" className="text-primary text-xl" />
                            <h4 className="font-bold text-text-main">Bảng tổng hợp chấm điểm</h4>
                        </div>
                        <div className="flex items-center !gap-3">
                            <span className="text-xs text-text-muted">Tự động lưu nháp sau khi chọn file</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-surface/50 border-b border-border">
                                    <th className="!text-left !px-6 !py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Học sinh</th>
                                    <th className="!text-left !px-4 !py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Bài nộp</th>
                                    <th className="!text-center !px-4 !py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Trạng thái</th>
                                    <th className="!text-center !px-4 !py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Điểm</th>
                                    <th className="!text-left !px-4 !py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">File sửa bài</th>
                                    <th className="!text-center !px-6 !py-4 text-[11px] font-bold text-text-muted uppercase tracking-wider">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map((sub) => {
                                    const rowState = rowStates[sub.studentId] || {};
                                    const currentGrade = rowState.grade !== undefined ? rowState.grade : (sub.grade ?? sub.score ?? '');
                                    
                                    return (
                                        <tr key={sub.studentId} className="border-b border-border hover:bg-surface/30 transition-colors">
                                            <td className="!px-6 !py-4">
                                                <div className="flex items-center !gap-3">
                                                    <AvatarCircle name={sub.fullName || sub.studentName} status={sub.status} size="sm" />
                                                    <span className="text-sm font-bold text-text-main truncate max-w-[150px]">
                                                        {sub.fullName || sub.studentName}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="!px-4 !py-4">
                                                <div className="flex items-center !gap-1.5">
                                                    {(sub.attachments?.length > 0 || sub.submissionId) ? (
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleSelectStudent(sub); }}
                                                            className="flex items-center !gap-1 text-primary hover:underline text-xs font-semibold"
                                                        >
                                                            <Icon icon="material-symbols:attach-file-rounded" className="rotate-45" />
                                                            Xem bài ({sub.attachments?.length || 0})
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs text-text-muted">Chưa nộp</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="!px-4 !py-4 !text-center">
                                                <StatusBadge status={sub.gradeStatus === 'Graded' ? 'Graded' : sub.status} />
                                            </td>
                                            <td className="!px-4 !py-4">
                                                <div className="flex items-center justify-center">
                                                    <input 
                                                        type="number"
                                                        value={currentGrade}
                                                        onChange={(e) => handleRowGradeUpdate(sub.studentId, 'grade', e.target.value)}
                                                        className="w-14 !px-2 !py-1.5 bg-background border border-border rounded-lg text-center text-sm font-bold text-primary focus:border-primary outline-none"
                                                        placeholder="--"
                                                    />
                                                </div>
                                            </td>
                                            <td className="!px-4 !py-4">
                                                <div className="relative flex items-center !gap-2">
                                                    <label className="flex items-center !gap-2 !px-3 !py-1.5 rounded-lg border border-dashed border-border hover:border-primary hover:bg-primary/5 cursor-pointer transition-all group overflow-hidden max-w-[180px]">
                                                        <Icon icon="material-symbols:cloud-upload-outline-rounded" className="text-text-muted group-hover:text-primary shrink-0" />
                                                        <span className="text-[11px] font-semibold text-text-muted group-hover:text-primary truncate">
                                                            {rowState.fileName || 'Đính kèm tệp...'}
                                                        </span>
                                                        <input 
                                                            type="file" 
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    handleRowGradeUpdate(sub.studentId, 'file', file);
                                                                    handleRowGradeUpdate(sub.studentId, 'fileName', file.name);
                                                                }
                                                            }}
                                                        />
                                                    </label>
                                                    {rowState.file && (
                                                        <button 
                                                            onClick={() => {
                                                                handleRowGradeUpdate(sub.studentId, 'file', null);
                                                                handleRowGradeUpdate(sub.studentId, 'fileName', '');
                                                            }}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <Icon icon="material-symbols:close-rounded" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="!px-6 !py-4 !text-center">
                                                <button
                                                    onClick={() => handleSaveRowGrade(sub)}
                                                    disabled={rowState.isSaving || !sub.submissionId}
                                                    className={`
                                                        !px-4 !py-1.5 rounded-lg text-xs font-bold transition-all
                                                        ${(rowState.grade || rowState.file) 
                                                            ? '!bg-primary text-white hover:bg-primary/90' 
                                                            : '!bg-surface text-text-muted border border-border hover:border-primary hover:text-primary'}
                                                        disabled:opacity-40 flex items-center justify-center gap-2 mx-auto
                                                    `}
                                                >
                                                    {rowState.isSaving ? (
                                                        <Icon icon="solar:spinner-linear" className="animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Icon icon="material-symbols:send-rounded" />
                                                            Trả bài
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Original Description & Private Attachments (Moved down as secondary) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 !gap-6">
                    <div className="bg-white rounded-3xl border border-border overflow-hidden">
                        <div className="!px-6 !py-3.5 border-b border-border bg-background/50 flex items-center !gap-2">
                            <Icon icon="material-symbols:subject-rounded" className="text-primary text-lg" />
                            <h4 className="font-bold text-sm text-text-main">Đề bài (Hướng dẫn)</h4>
                        </div>
                        <div className="!p-6 min-h-[150px]">
                            {assignment.description ? (
                                <div className="text-text-main text-sm leading-relaxed whitespace-pre-wrap">
                                    {assignment.description}
                                </div>
                            ) : (
                                <p className="text-sm text-text-muted italic text-center !py-8">Chưa có hướng dẫn.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-border overflow-hidden">
                        <div className="!px-6 !py-3.5 border-b border-border bg-background/50 flex items-center !gap-2">
                            <Icon icon="material-symbols:attach-file-rounded" className="text-primary rotate-45 text-lg" />
                            <h4 className="font-bold text-sm text-text-main">Tài liệu đính kèm ({assignment.attachments?.length || 0})</h4>
                        </div>
                        <div className="!p-6 overflow-y-auto max-h-[150px]">
                            {assignment.attachments?.length > 0 ? (
                                <div className="flex flex-col !gap-2">
                                    {assignment.attachments.map((att, i) => (
                                        <a key={i} href={att.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center !gap-2 text-[13px] text-primary hover:underline font-medium">
                                            <Icon icon={getFileIcon(att.fileType, att.fileName)} />
                                            {att.fileName}
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-text-muted italic text-center !py-8">Không có tệp đính kèm.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in-up h-[calc(100vh-140px)]">
            <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden h-full flex flex-col md:flex-row">
                {LeftColumn}
                {GradingPanel}
                {OverviewPanel}
            </div>
        </div>
    );
};

export default AssignmentGradingTeacher;