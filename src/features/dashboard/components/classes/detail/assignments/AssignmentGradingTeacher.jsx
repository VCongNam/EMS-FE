import React, { useState } from 'react';
import { Icon } from '@iconify/react';

const AssignmentGradingTeacher = ({ assignment }) => {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [scoreInput, setScoreInput] = useState('');
    const [commentInput, setCommentInput] = useState('');

    const submissions = assignment.submissions || [];

    const handleSelectStudent = (sub) => {
        setSelectedStudent(sub);
        setScoreInput(sub.score || '');
        setCommentInput('');
    };

    const handleBack = () => {
        setSelectedStudent(null);
    };

    const countTurnedIn = submissions.filter(s => s.status !== 'Chưa nộp').length;
    const countMissing = submissions.length - countTurnedIn;

    // Helper to get Icon for file
    const getFileIcon = (type) => {
        if (type?.includes('image')) return 'material-symbols:image-outline-rounded';
        if (type?.includes('pdf')) return 'vscode-icons:file-type-pdf2';
        if (type?.includes('word') || type?.includes('doc')) return 'vscode-icons:file-type-word';
        return 'material-symbols:insert-drive-file-outline-rounded';
    };

    return (
        <div className="animate-fade-in-up h-[calc(100vh-140px)]">
            <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden h-full flex flex-col md:flex-row">

                {/* ── Left Column: Student List ── */}
                <div className={`
                    ${selectedStudent ? 'hidden md:flex' : 'flex'}
                    md:w-1/3 w-full flex-col border-r border-border bg-background
                `}>
                    {/* Header Info */}
                    <div className="!p-4 border-b border-border bg-surface group relative shrink-0">
                        <div className="flex items-start justify-between">
                            <h2 className="text-lg font-bold text-primary truncate !mb-2 flex-1" title={assignment.title}>
                                {assignment.title}
                            </h2>
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-text-main">{countTurnedIn}</span>
                                <span className="text-xs text-text-muted font-medium">Đã nộp</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-text-main">{countMissing}</span>
                                <span className="text-xs text-text-muted font-medium">Chưa nộp</span>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="!p-3 border-b border-border flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" className="rounded text-primary focus:ring-primary h-4 w-4" />
                            <span className="text-sm font-semibold text-text-main">Tất cả bài tập</span>
                        </div>
                        <button className="text-primary hover:bg-primary/10 !p-1.5 rounded-lg transition-colors" title="Lọc">
                            <Icon icon="material-symbols:filter-list-rounded" className="text-xl" />
                        </button>
                    </div>

                    {/* Student List */}
                    <div className="flex-1 overflow-y-auto">
                        {submissions.map((sub) => (
                            <div
                                key={sub.id}
                                onClick={() => handleSelectStudent(sub)}
                                className={`flex items-center justify-between !px-4 !py-3 cursor-pointer border-b border-border transition-colors ${
                                    selectedStudent?.id === sub.id
                                        ? 'bg-primary/5 border-l-4 border-l-primary'
                                        : 'hover:bg-surface border-l-4 border-l-transparent'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                        <Icon icon="material-symbols:person" className="text-primary text-sm" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-text-main">{sub.studentName}</p>
                                        <p className={`text-xs ${
                                            sub.status === 'Đã nộp' ? 'text-green-600'
                                            : sub.status === 'Nộp muộn' ? 'text-orange-600'
                                            : 'text-red-500'
                                        }`}>
                                            {sub.status}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-text-main">
                                        {sub.score !== null ? `${sub.score}/${assignment.maxScore}` : `--/100`}
                                    </span>
                                    <Icon icon="material-symbols:chevron-right-rounded" className="text-text-muted md:hidden" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Nút xem lại đề bài (Quick View) khi đang ở Mobile/Desktop */}
                    <button 
                        onClick={() => setSelectedStudent(null)}
                        className={`md:hidden absolute bottom-4 right-4 w-12 h-12 rounded-full !bg-primary text-white shadow-lg flex items-center justify-center transition-transform ${selectedStudent ? 'scale-100' : 'scale-0'}`}
                    >
                        <Icon icon="material-symbols:assignment-outline-rounded" className="text-2xl" />
                    </button>
                </div>

                {/* ── Right Column: Grading / Instructions ── */}
                <div className={`
                    ${selectedStudent ? 'flex' : 'hidden md:flex'}
                    md:w-2/3 w-full flex-col bg-surface
                `}>
                    {selectedStudent ? (
                        <>
                            {/* Grading Header */}
                            <div className="!px-4 sm:!px-6 !py-4 border-b border-border bg-surface shrink-0">
                                <button
                                    onClick={handleBack}
                                    className="md:hidden flex items-center gap-1 text-sm font-semibold text-text-muted hover:text-primary transition-colors !mb-3"
                                >
                                    <Icon icon="material-symbols:arrow-back-rounded" className="text-lg" />
                                    Danh sách học sinh
                                </button>

                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <h3 className="text-base sm:text-lg font-bold text-text-main truncate">{selectedStudent.studentName}</h3>
                                        <span className={`shrink-0 text-xs font-semibold !px-2 !py-0.5 rounded-full ${
                                            selectedStudent.status === 'Đã nộp' ? 'bg-green-100 text-green-700'
                                            : selectedStudent.status === 'Nộp muộn' ? 'bg-orange-100 text-orange-700'
                                            : 'bg-red-100 text-red-700'
                                        }`}>
                                            {selectedStudent.status}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="flex items-center border border-border rounded-lg overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                                            <input
                                                type="number"
                                                value={scoreInput}
                                                onChange={(e) => setScoreInput(e.target.value)}
                                                placeholder="Điểm"
                                                className="w-16 bg-transparent border-none text-center !py-1.5 focus:outline-none font-bold text-primary"
                                            />
                                            <span className="text-text-muted bg-background !px-3 !py-1.5 font-medium border-l border-border">
                                                / {assignment.maxScore}
                                            </span>
                                        </div>
                                        <button className="!bg-primary text-white font-bold !px-5 !py-1.5 rounded-lg hover:bg-primary/90 shadow-sm transition-colors">
                                            Trả bài
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Main Grading Content */}
                            <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row min-h-0">
                                <div className="flex-1 !p-4 sm:!p-6 border-b lg:border-b-0 lg:border-r border-border bg-background/50">
                                    {selectedStudent.files && selectedStudent.files.length > 0 ? (
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-text-main">Tệp đã nộp ({selectedStudent.files.length})</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {selectedStudent.files.map(file => (
                                                    <div key={file.id} className="border border-border bg-surface rounded-xl !p-3 flex items-center gap-3 hover:border-primary cursor-pointer transition-colors group">
                                                        <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center text-primary group-hover:scale-110 transition-transform shrink-0">
                                                            <Icon icon={getFileIcon(file.type)} className="text-2xl" />
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <p className="font-medium text-sm text-text-main truncate group-hover:text-primary transition-colors">{file.name}</p>
                                                            <p className="text-xs text-text-muted">{selectedStudent.submittedAt}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="w-full h-48 sm:h-64 border-2 border-dashed border-border rounded-xl mt-4 flex flex-col items-center justify-center text-text-muted">
                                                <Icon icon="material-symbols:preview-off-outline-rounded" className="text-5xl !mb-2 opacity-50" />
                                                <p className="text-sm text-center">Chọn tệp để xem trước (nếu được hỗ trợ)</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-text-muted !py-16">
                                            <Icon icon="material-symbols:folder-off-outline-rounded" className="text-6xl !mb-4 opacity-50" />
                                            <p className="text-lg">Học sinh chưa nộp tệp nào.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Private Comments area */}
                                <div className="w-full lg:w-72 bg-surface flex flex-col shrink-0">
                                    {/* ... */}
                                    <div className="!p-4 border-b border-border bg-background/50">
                                         <h4 className="font-semibold text-text-main flex items-center gap-2">
                                            <Icon icon="material-symbols:comment-rounded" className="text-primary" />
                                            Nhận xét riêng tư
                                        </h4>
                                    </div>
                                    <div className="flex-1 !p-4 overflow-y-auto min-h-[80px]">
                                        <p className="text-sm text-text-muted text-center italic mt-6">Chưa có nhận xét nào.</p>
                                    </div>
                                    <div className="!p-4 border-t border-border bg-background/50">
                                        <textarea
                                            value={commentInput}
                                            onChange={(e) => setCommentInput(e.target.value)}
                                            placeholder="Thêm nhận xét..."
                                            className="w-full bg-surface border border-border rounded-xl !p-3 min-h-[80px] resize-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm transition-colors text-text-main"
                                        />
                                        <button
                                            disabled={!commentInput.trim()}
                                            className="w-full !mt-2 bg-primary/10 text-primary font-bold !py-2 rounded-xl hover:bg-primary hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            Đăng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        /* ── Assignment Overview (Instructions) ── */
                        <div className="w-full h-full flex flex-col bg-[#F8FAFC] overflow-y-auto">
                            {/* Sticky Header for Assignment Title in Overview */}
                            <div className="bg-white/80 backdrop-blur-md sticky top-0 z-10 !px-6 sm:!px-8 !py-6 border-b border-border flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                                        <Icon icon="material-symbols:assignment-rounded" className="text-2xl" />
                                    </div>
                                    <div className="min-w-0">
                                        <h2 className="text-xl sm:text-2xl font-black text-text-main truncate leading-tight">{assignment.title}</h2>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="!px-2 !py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                                                {assignment.gradeCategoryName || 'Bài tập'}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-border" />
                                            <span className="text-xs text-text-muted font-medium">Id: {assignment.assignmentId?.slice(0, 8)}...</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="!p-6 sm:!p-8 max-w-5xl mx-auto w-full space-y-8 pb-12">
                                {/* Metadata Cards Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-white rounded-2xl border border-border !p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            <Icon icon="material-symbols:person-rounded" className="text-2xl" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Người giao</p>
                                            <p className="text-sm font-bold text-text-main truncate">{assignment.authorName || 'Giáo viên'}</p>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl border border-border !p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
                                            <Icon icon="material-symbols:alarm-on-rounded" className="text-2xl" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Hạn nộp</p>
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

                                {/* Attachments Grid */}
                                {assignment.attachments && assignment.attachments.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-bold text-text-main flex items-center gap-2">
                                                <Icon icon="material-symbols:attach-file-rounded" className="text-primary rotate-45 text-xl" />
                                                Tài liệu đính kèm ({assignment.attachments.length})
                                            </h4>
                                        </div>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            {assignment.attachments.map((att, idx) => (
                                                <a 
                                                    key={idx} 
                                                    href={att.fileUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-4 bg-white border border-border rounded-2xl !p-4 hover:border-primary hover:shadow-lg hover:-translate-y-0.5 transition-all group relative overflow-hidden"
                                                >
                                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shrink-0 shadow-sm border border-primary/5">
                                                        <Icon icon={getFileIcon(att.fileType || att.name)} className="text-2xl" />
                                                    </div>
                                                    <div className="overflow-hidden flex-1">
                                                        <p className="font-bold text-sm text-text-main truncate group-hover:text-primary transition-colors">{att.fileName || att.name}</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{(att.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                                                            <span className="w-1 h-1 rounded-full bg-border" />
                                                            <span className="text-[10px] text-primary font-bold uppercase tracking-widest">{att.fileType?.split('/')[1] || 'FILE'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="w-9 h-9 rounded-full bg-background flex items-center justify-center text-text-muted group-hover:bg-primary/10 group-hover:text-primary transition-all shadow-sm border border-border group-hover:border-primary/20">
                                                        <Icon icon="material-symbols:download-rounded" className="text-xl" />
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssignmentGradingTeacher;