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

    return (
        <div className="animate-fade-in-up h-[calc(100vh-140px)]">
            <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden h-full flex flex-col md:flex-row">

                {/* ── Left Column: Student List ── */}
                {/* Mobile: ẩn khi đã chọn học sinh | Desktop: luôn hiện */}
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
                            {!assignment.isOverdue && (
                                <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                                    <button className="!p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Chỉnh sửa">
                                        <Icon icon="material-symbols:edit-outline-rounded" className="text-lg" />
                                    </button>
                                    <button className="!p-1.5 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Xóa">
                                        <Icon icon="material-symbols:delete-outline-rounded" className="text-lg" />
                                    </button>
                                </div>
                            )}
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
                                        {sub.score !== null ? `${sub.score}/${assignment.maxScore}` : '--/100'}
                                    </span>
                                    <Icon icon="material-symbols:chevron-right-rounded" className="text-text-muted md:hidden" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Right Column: Grading Panel ── */}
                {/* Mobile: hiện khi đã chọn học sinh | Desktop: luôn hiện */}
                <div className={`
                    ${selectedStudent ? 'flex' : 'hidden md:flex'}
                    md:w-2/3 w-full flex-col bg-surface
                `}>
                    {selectedStudent ? (
                        <>
                            {/* Grading Header */}
                            <div className="!px-4 sm:!px-6 !py-4 border-b border-border bg-surface shrink-0">
                                {/* Mobile back button */}
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

                            {/* Main Content Area */}
                            <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row min-h-0">
                                {/* Files Preview */}
                                <div className="flex-1 !p-4 sm:!p-6 border-b lg:border-b-0 lg:border-r border-border bg-background/50">
                                    {selectedStudent.files && selectedStudent.files.length > 0 ? (
                                        <div className="space-y-4">
                                            <h4 className="font-semibold text-text-main">Tệp đã nộp ({selectedStudent.files.length})</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {selectedStudent.files.map(file => (
                                                    <div key={file.id} className="border border-border bg-surface rounded-xl !p-3 flex items-center gap-3 hover:border-primary cursor-pointer transition-colors group">
                                                        <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center text-primary group-hover:scale-110 transition-transform shrink-0">
                                                            <Icon icon={file.type === 'pdf' ? 'vscode-icons:file-type-pdf2' : 'vscode-icons:file-type-word'} className="text-2xl" />
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

                                {/* Private Comments */}
                                <div className="w-full lg:w-72 bg-surface flex flex-col shrink-0">
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
                        <div className="w-full h-full flex flex-col items-center justify-center text-text-muted bg-background/50 !p-8">
                            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center !mb-6">
                                <Icon icon="material-symbols:assignment-ind-outline-rounded" className="text-5xl text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-text-main !mb-2">Chấm điểm bài tập</h3>
                            <p className="text-center">Chọn một học sinh từ danh sách bên trái để xem bài làm và nhập điểm.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssignmentGradingTeacher;