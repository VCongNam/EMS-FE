import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import FileViewer from 'react-file-viewer';
import { assignmentService } from '../../../../api/assignmentService';
import useAuthStore from '../../../../../../store/authStore';
import { toast } from 'react-toastify';

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
        'In Time':  { bg: 'bg-green-100',  text: 'text-green-700', label: 'Đã nộp' },
        'Late':     { bg: 'bg-amber-100',  text: 'text-amber-700', label: 'Nộp muộn' },
        'Pending':  { bg: 'bg-red-100',    text: 'text-red-600',   label: 'Chưa nộp' },
        'Đã nộp':   { bg: 'bg-green-100',  text: 'text-green-700', label: 'Đã nộp' },
        'Nộp muộn': { bg: 'bg-amber-100',  text: 'text-amber-700', label: 'Nộp muộn' },
        'Chưa nộp': { bg: 'bg-red-100',    text: 'text-red-600',   label: 'Chưa nộp' },
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
        'In Time':  'bg-green-100 text-green-700',
        'Late':     'bg-amber-100 text-amber-700',
        'Pending':  'bg-red-100   text-red-600',
        'Đã nộp':   'bg-green-100 text-green-700',
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

    const url  = file.url || file.fileUrl || '';
    const name = file.name || file.fileName || '';
    let ext    = name.includes('.') ? name.split('.').pop().toLowerCase() : '';
    if (ext === 'jpg') ext = 'jpeg';
    if (ext === 'doc') ext = 'docx';
    if (ext === 'xls') ext = 'xlsx';

    const supported = ['png', 'jpeg', 'gif', 'bmp', 'pdf', 'csv', 'xlsx', 'docx', 'mp4', 'webm', 'mp3'];

    if (supported.includes(ext)) {
        return (
            <div className="w-full border border-border rounded-xl overflow-hidden flex flex-col" style={{ height: '420px' }}>
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
                <div className="flex-1 overflow-auto bg-white flex items-center justify-center !p-2">
                    <FileViewer fileType={ext} filePath={url} onError={(e) => console.error('FileViewer:', e)} />
                </div>
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
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [scoreInput,  setScoreInput]  = useState('');
    const [commentInput, setCommentInput] = useState('');
    const [previewFile, setPreviewFile]  = useState(null);
    const [isGrading, setIsGrading] = useState(false);
    const [isFeedbackPosting, setIsFeedbackPosting] = useState(false);

    const submissions    = assignment.submissions || [];
    const countTurnedIn  = submissions.filter((s) => s.status === 'In Time' || s.status === 'Late' || s.status === 'Đã nộp' || s.status === 'Nộp muộn').length;
    const countMissing   = submissions.length - countTurnedIn;

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
                    // Giữ lại các trường thông tin cơ bản nếu API không trả về đầy đủ
                    fullName: prev.fullName || detailedData.fullName,
                    studentName: prev.studentName || detailedData.studentName,
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
            const res = await assignmentService.gradeSubmission(
                selectedStudent.submissionId, 
                scoreInput, 
                user?.token
            );
            if (res.ok) {
                toast.success("Đã chấm điểm thành công!");
                if (onRefresh) onRefresh();
                // Cập nhật local state
                setSelectedStudent(prev => ({...prev, grade: scoreInput}));
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
                <button
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-primary/10 hover:text-primary transition-colors"
                    title="Lọc"
                >
                    <Icon icon="material-symbols:filter-list-rounded" className="text-xl" />
                </button>
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
                                <StatusBadge status={sub.status} />
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
                                <StatusBadge status={selectedStudent.status} />
                            </div>
                        </div>
                    </div>

                    {/* Score + action */}
                    <div className="flex items-center !gap-2.5 shrink-0">
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
                    </div>
                </div>
            </div>

            {/* Body: files + comments */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">

                {/* Files panel */}
                <div className="flex-1 !p-5 overflow-y-auto border-b lg:border-b-0 lg:border-r border-border bg-background/40">
                    {selectedStudent.files && selectedStudent.files.length > 0 ? (
                        <div className="flex flex-col !gap-4">
                            <h4 className="font-semibold text-sm text-text-main flex items-center !gap-1.5">
                                <Icon icon="material-symbols:attach-file-rounded" className="text-primary rotate-45" />
                                Tệp đã nộp
                                <span className="!ml-0.5 text-xs text-text-muted font-normal">
                                    ({selectedStudent.files.length})
                                </span>
                            </h4>

                            {/* File grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 !gap-3">
                                {selectedStudent.files.map((file) => {
                                    const isActive = previewFile?.id === file.id;
                                    return (
                                        <div
                                            key={file.id}
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
                                                <Icon icon={getFileIcon(file.type, file.name || file.fileName)} className="text-xl" />
                                            </div>
                                            <div className="flex-1 min-w-0 !pr-8">
                                                <p className="text-sm font-semibold text-text-main truncate group-hover:text-primary transition-colors">
                                                    {file.name || file.fileName}
                                                </p>
                                                <p className="text-xs text-text-muted !mt-0.5">{selectedStudent.submittedAt}</p>
                                            </div>
                                            {/* Download btn */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const link = document.createElement('a');
                                                    link.href = file.url || file.fileUrl || '#';
                                                    link.setAttribute('download', file.name || file.fileName || 'download');
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

            <div className="!p-6 sm:!p-8 max-w-4xl mx-auto w-full flex flex-col !gap-6 !pb-12">
                {/* Meta cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 !gap-4">
                    <div className="bg-white rounded-2xl border border-border !p-4 flex items-center !gap-4 hover:shadow-sm transition-shadow">
                        <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                            <Icon icon="material-symbols:person-rounded" className="text-2xl" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider !mb-0.5">Người giao</p>
                            <p className="text-sm font-bold text-text-main truncate">{assignment.authorName || 'Giáo viên'}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-border !p-4 flex items-center !gap-4 hover:shadow-sm transition-shadow">
                        <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                            <Icon icon="material-symbols:alarm-on-rounded" className="text-2xl" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider !mb-0.5">Hạn nộp</p>
                            <p className="text-sm font-bold text-text-main">
                                {new Date(assignment.dueDate).toLocaleString('vi-VN', {
                                    hour: '2-digit', minute: '2-digit',
                                    day: '2-digit', month: '2-digit', year: 'numeric',
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-3xl border border-border overflow-hidden">
                    <div className="!px-6 !py-3.5 border-b border-border bg-background/50 flex items-center !gap-2">
                        <Icon icon="material-symbols:subject-rounded" className="text-primary text-lg" />
                        <h4 className="font-bold text-sm text-text-main">Hướng dẫn chi tiết</h4>
                    </div>
                    <div className="!p-6 sm:!p-8">
                        {assignment.description ? (
                            <div className="prose max-w-none text-text-main leading-relaxed whitespace-pre-wrap text-[15px]">
                                {assignment.description}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center !py-8 text-text-muted opacity-60 !gap-2">
                                <Icon icon="material-symbols:edit-note-outline-rounded" className="text-4xl" />
                                <p className="italic text-sm">Chưa có mô tả đính kèm cho bài tập này.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Attachments */}
                {assignment.attachments?.length > 0 && (
                    <div className="flex flex-col !gap-3">
                        <h4 className="font-bold text-sm text-text-main flex items-center !gap-2">
                            <Icon icon="material-symbols:attach-file-rounded" className="text-primary rotate-45 text-lg" />
                            Tài liệu đính kèm
                            <span className="text-text-muted font-normal">({assignment.attachments.length})</span>
                        </h4>
                        <div className="grid grid-cols-1 lg:grid-cols-2 !gap-3">
                            {assignment.attachments.map((att, idx) => (
                                <a
                                    key={idx}
                                    href={att.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative flex items-center !gap-4 bg-white border border-border rounded-2xl !p-4 hover:border-primary hover:shadow-md hover:-translate-y-0.5 transition-all group overflow-hidden"
                                >
                                    <div className="absolute inset-y-0 left-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity rounded-l-2xl" />
                                    <div className="w-11 h-11 bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0 border border-primary/10">
                                        <Icon icon={getFileIcon(att.fileType, att.fileName || att.name)} className="text-xl" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-text-main truncate group-hover:text-primary transition-colors">
                                            {att.fileName || att.name}
                                        </p>
                                        <div className="flex items-center !gap-2 !mt-0.5">
                                            <span className="text-[11px] text-text-muted font-semibold">
                                                {(att.fileSize / 1024 / 1024).toFixed(2)} MB
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-border" />
                                            <span className="text-[11px] text-primary font-bold uppercase">
                                                {att.fileType?.split('/')[1] || 'file'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-9 h-9 rounded-full border border-border bg-background flex items-center justify-center text-text-muted group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/30 transition-all shrink-0">
                                        <Icon icon="material-symbols:download-rounded" className="text-lg" />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
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