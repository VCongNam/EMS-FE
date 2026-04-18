import React, { useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import useAuthStore from '../../../../../../store/authStore';
import { studentAssignmentService } from '../../../../api/studentAssignmentService';

const getFileIcon = (type) => {
    if (type?.includes('pdf')) return <Icon icon="vscode-icons:file-type-pdf2" className="text-3xl" />;
    if (type?.includes('word') || type?.includes('doc')) return <Icon icon="vscode-icons:file-type-word" className="text-3xl" />;
    if (type?.includes('excel') || type?.includes('xls')) return <Icon icon="vscode-icons:file-type-excel" className="text-3xl" />;
    if (type?.includes('image')) return <Icon icon="material-symbols:image-outline-rounded" className="text-3xl text-orange-400" />;
    return <Icon icon="material-symbols:insert-drive-file" className="text-3xl text-gray-400" />;
};

const AssignmentDetailStudent = ({ assignment, onRefresh }) => {
    const { user } = useAuthStore();
    const [localFiles, setLocalFiles] = useState([]); // Files selected but not yet uploaded
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const mySubmission = assignment.submission || null;
    const isSubmitted = ["Submitted", "Graded"].includes(mySubmission?.status);
    const statusText =
    mySubmission?.status === "Graded"
        ? "Đã chấm"
        : isSubmitted
        ? "Đã nộp"
        : "Chưa nộp";
    const isGraded = mySubmission?.status === "Graded";
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setLocalFiles(prev => [...prev, ...files]);
        }
        e.target.value = null;
    };

    const removeLocalFile = (index) => {
        setLocalFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleTurnIn = async () => {
        if (localFiles.length === 0 && !isSubmitted) {
            toast.error("Bạn chưa tải lên tệp nào!");
            return;
        }

        try {
            setIsSubmitting(true);
            const formData = new FormData();
            localFiles.forEach(file => {
                formData.append('Files', file);
            });

            const res = await studentAssignmentService.submitAssignment(assignment.assignmentID, formData, user?.token);
            if (res.ok) {
                toast.success(isSubmitted ? 'Cập nhật bài làm thành công!' : 'Nộp bài thành công!');
                setLocalFiles([]);
                if (onRefresh) onRefresh();
            } else {
                const errData = await res.json().catch(() => ({}));
                toast.error(errData.message || 'Có lỗi xảy ra khi nộp bài.');
            }
        } catch (err) {
            console.error(err);
            toast.error('Lỗi kết nối khi nộp bài.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelSubmit = async () => {
        if (!isSubmitted) {
            setLocalFiles([]);
            return;
        }

        if (!window.confirm('Bạn có chắc chắn muốn hủy nộp bài không? Hành động này sẽ xóa bài làm hiện tại của bạn.')) {
            return;
        }

        try {
            setIsSubmitting(true);
            const res = await studentAssignmentService.unsubmitAssignment(assignment.assignmentID, user?.token);
            if (res.ok) {
                toast.success('Đã hủy nộp bài thành công!');
                if (onRefresh) onRefresh();
            } else {
                const errData = await res.json().catch(() => ({}));
                toast.error(errData.message || 'Không thể hủy nộp bài. Có thể bài đã quá hạn hoặc đã được chấm.');
            }
        } catch (err) {
            console.error(err);
            toast.error('Lỗi kết nối khi hủy nộp bài.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 animate-fade-in-up !pb-12 bg-[#F8FAFC] min-h-screen">
            {/* Left Column: Assignment Content */}
            <div className="flex-1 flex flex-col gap-6">
                {/* Sticky Top Header */}
                <div className="bg-white/80 backdrop-blur-md sticky top-0 z-10 !px-6 sm:!px-8 !py-6 border-b border-border rounded-b-3xl shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <Icon icon="material-symbols:assignment-rounded" className="text-3xl" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-2xl md:text-3xl font-black text-text-main truncate leading-tight" title={assignment.title}>
                                {assignment.title}
                            </h1>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className="!px-2 !py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                                    {assignment.gradeCategoryName || 'Bài tập'}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-border" />
                                <span className="text-sm font-bold text-text-muted">{assignment.authorName || 'Giáo viên'}</span>
                                <span className="w-1 h-1 rounded-full bg-border" />
                                <span className="text-sm font-bold text-primary">{assignment.maxScore || 100} điểm</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="!px-4 sm:!px-6 space-y-6">
                    {/* Metadata Cards Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white rounded-2xl border border-border !p-5 flex items-center gap-4 shadow-sm">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <Icon icon="material-symbols:person-rounded" className="text-2xl" />
                            </div>
                            <div>
                                <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">NGƯỜI GIAO</p>
                                <p className="text-sm font-bold text-text-main">{assignment.authorName || 'Giáo viên'}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-border !p-5 flex items-center gap-4 shadow-sm border-l-4 border-l-orange-500">
                            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                                <Icon icon="material-symbols:alarm-on-rounded" className="text-2xl" />
                            </div>
                            <div>
                                <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest text-orange-600">HẠN NỘP</p>
                                <p className="text-sm font-bold text-text-main">
                                    {new Date(assignment.dueDate).toLocaleString('vi-VN', {
                                        hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Description Card */}
                    <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
                        <div className="!px-6 !py-4 border-b border-border bg-background/50 flex items-center gap-2">
                            <Icon icon="material-symbols:subject-rounded" className="text-primary text-xl" />
                            <h4 className="font-bold text-text-main">Hướng dẫn chi tiết</h4>
                        </div>
                        <div className="!p-6 sm:!p-8">
                            <div className="prose max-w-none text-text-main leading-relaxed whitespace-pre-wrap font-medium text-[15px]">
                                {assignment.description || (
                                    <div className="flex flex-col items-center justify-center !py-6 text-text-muted opacity-60">
                                        <Icon icon="material-symbols:edit-note-outline-rounded" className="text-4xl !mb-2" />
                                        <p className="italic">Chưa có mô tả đính kèm cho bài tập này.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Attachments Section */}
                    {assignment.attachments && assignment.attachments.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="font-bold text-text-main flex items-center gap-2 !px-2">
                                <Icon icon="material-symbols:attach-file-rounded" className="text-primary rotate-45 text-xl" />
                                Tài liệu tham khảo ({assignment.attachments.length})
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {assignment.attachments.map((att, idx) => (
                                    <a
                                        key={idx}
                                        href={att.fileURL || att.fileUrl || att.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 bg-white border border-border rounded-2xl !p-4 hover:border-primary hover:shadow-lg hover:-translate-y-0.5 transition-all group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0 shadow-sm border border-primary/5">
                                            {getFileIcon(att.fileType || att.fileName || att.name)}
                                        </div>
                                        <div className="overflow-hidden flex-1">
                                            <p className="font-bold text-sm text-text-main truncate group-hover:text-primary transition-colors">{att.fileName || att.name}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] text-text-muted font-bold tracking-widest">{(att.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                                                <span className="w-1 h-1 rounded-full bg-border" />
                                                <span className="text-[10px] text-primary font-bold uppercase tracking-widest">{att.fileType?.split('/')[1] || att.fileType || 'FILE'}</span>
                                            </div>
                                        </div>
                                        <div className="w-9 h-9 rounded-full bg-background flex items-center justify-center text-text-muted group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-sm border border-border">
                                            <Icon icon="material-symbols:download-rounded" className="text-xl" />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Submission Widget */}
            <div className="w-full lg:w-[380px] shrink-0 sticky top-24 self-start !px-4 sm:!px-0">
                <div className="bg-white rounded-[2rem] border-2 border-primary/10 !p-8 shadow-2xl shadow-primary/5 space-y-8 relative overflow-hidden">
                    {/* Decorative Background Element */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex items-center justify-between relative">
                        <h3 className="text-xl font-black text-text-main tracking-tight">Bài làm</h3>
                        <div className={`!px-3 !py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${isSubmitted
                            ? 'bg-green-50 text-green-600 border-green-200'
                            : 'bg-orange-50 text-orange-600 border-orange-200 animate-pulse'
                            }`}>
                            {statusText}
                        </div>
                    </div>

                    {/* Files Area */}
                    <div className="space-y-4 min-h-[100px] flex flex-col justify-center">

                        {/* ===== FILE ĐÃ NỘP ===== */}
                        {isSubmitted && (
                            <div className="space-y-3">
                                {mySubmission?.attachments?.map((file, idx) => (
                                    <a
                                        key={idx}
                                        href={file.fileURL || file.fileUrl || file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between border border-green-200 rounded-2xl !p-3 bg-green-50/30 group hover:border-green-400 transition-all hover:bg-white hover:shadow-md"
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="shrink-0">
                                                {getFileIcon(file.fileType || file.fileName || file.name)}
                                            </div>
                                            <span className="font-bold text-sm text-text-main truncate">
                                                {file.fileName || file.name}
                                            </span>
                                        </div>
                                        <Icon icon="material-symbols:check-circle-rounded" className="text-green-500 text-xl" />
                                    </a>
                                ))}
                            </div>
                        )}

                        {/* ===== NHẬN XÉT ===== */}
                        {mySubmission?.status === "Graded" && (
                            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 space-y-3">

                                <p className="font-bold text-green-700 space-10px">
                                    Điểm: {mySubmission.grade}
                                </p>

                                {mySubmission.feedbacks?.length > 0 && (
                                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2 leading-relaxed">
                                        {mySubmission.feedbacks.map((f, i) => (
                                            <li key={i}>{f}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}

                        {/* Local Files (Pending upload) */}
                        {localFiles.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between border border-border rounded-2xl !p-3 bg-[#F8FAFC] group hover:border-primary/30 transition-all hover:bg-white hover:shadow-md">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="shrink-0">
                                        {getFileIcon(file.name)}
                                    </div>
                                    <span className="font-bold text-sm text-text-main truncate">{file.name}</span>
                                </div>
                                <button
                                    onClick={() => removeLocalFile(idx)}
                                    className="text-text-muted hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50"
                                    title="Gỡ bỏ"
                                >
                                    <Icon icon="material-symbols:close-rounded" className="text-xl" />
                                </button>
                            </div>
                        ))}

                        {/* Empty State */}
                        {!isSubmitted && localFiles.length === 0 && (
                            <div className="text-center !py-8 border-2 border-dashed border-border rounded-[1.5rem] flex flex-col items-center gap-3 bg-background/50 group hover:border-primary/30 transition-colors">
                                <Icon icon="material-symbols:cloud-upload-outline-rounded" className="text-4xl text-text-muted opacity-30 group-hover:text-primary/50 group-hover:scale-110 transition-transform" />
                                <p className="text-xs text-text-muted font-bold tracking-tight px-6 italic">Chưa có tệp đính kèm nào được tải lên</p>
                            </div>
                        )}
                    </div>

                    <input
                        type="file"
                        multiple
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />

                    <div className="space-y-3 pt-4">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full flex items-center justify-center gap-2 border-2 border-primary/20 bg-white text-primary font-black rounded-2xl !p-4 hover:bg-primary hover:text-white hover:border-primary transition-all group shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting || isGraded}
                        >
                            <Icon icon="material-symbols:add-rounded" className="text-2xl group-hover:rotate-90 transition-transform" />
                            <span>Thêm hoặc tạo</span>
                        </button>

                        <button
                            onClick={handleTurnIn}
                            className={`w-full font-black rounded-2xl !p-4 shadow-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${(localFiles.length > 0 || isSubmitted) && !isSubmitting
                                ? '!bg-primary text-white hover:bg-primary-hover shadow-primary/20'
                                : 'bg-border text-text-muted cursor-not-allowed'
                                }`}
                            disabled={(localFiles.length === 0 && !isSubmitted) || isSubmitting || isGraded}
                        >
                            {isSubmitting ? (
                                <Icon icon="solar:spinner-linear" className="animate-spin text-xl" />
                            ) : isSubmitted ? (
                                'Cập nhật bài làm'
                            ) : (
                                'Nộp bài'
                            )}
                        </button>

                        {isSubmitted && !isGraded &&(
                            <button
                                onClick={handleCancelSubmit}
                                className="w-full bg-white border-2 border-border text-text-main font-black rounded-2xl !p-4 hover:border-red-500 hover:text-red-500 transition-all shadow-sm"
                            >
                                Hủy nộp bài
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AssignmentDetailStudent;
