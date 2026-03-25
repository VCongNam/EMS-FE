import React, { useState, useRef } from 'react';
import { Icon } from '@iconify/react';

const getFileIcon = (type) => {
    switch(type) {
        case 'pdf': return <Icon icon="vscode-icons:file-type-pdf2" className="text-3xl" />;
        case 'doc': return <Icon icon="vscode-icons:file-type-word" className="text-3xl" />;
        default: return <Icon icon="material-symbols:insert-drive-file" className="text-3xl text-gray-400" />;
    }
};

const AssignmentDetailStudent = ({ assignment }) => {
    const [myFiles, setMyFiles] = useState([]);
    const [status, setStatus] = useState('Chưa nộp'); // 'Chưa nộp', 'Đã nộp', 'Nộp muộn'
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newFiles = files.map(file => ({
                id: Math.random().toString(36).substr(2, 9),
                name: file.name,
                type: file.name.endsWith('.pdf') ? 'pdf' : file.name.endsWith('.doc') || file.name.endsWith('.docx') ? 'doc' : 'other',
            }));
            setMyFiles([...myFiles, ...newFiles]);
        }
        e.target.value = null;
    };

    const removeFile = (id) => {
        setMyFiles(myFiles.filter(f => f.id !== id));
    };

    const handleTurnIn = () => {
        if (myFiles.length === 0) {
            alert("Bạn chưa tải lên tệp nào!");
            return;
        }
        setStatus('Đã nộp');
    };

    const handleCancelSubmit = () => {
        setStatus('Chưa nộp');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {/* Left Column: Assignment Details */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-surface rounded-2xl border border-border !p-6 md:!p-8 shadow-sm">
                    <div className="flex items-start gap-4 !mb-6">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon icon="material-symbols:assignment-rounded" className="text-2xl text-primary" />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl md:text-3xl font-bold text-primary !mb-2">{assignment.title}</h1>
                            <div className="flex items-center gap-4 text-sm text-text-muted">
                                <span>{assignment.author} • {assignment.postedDate}</span>
                                <span className="font-semibold text-text-main">
                                    {assignment.maxScore} điểm
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="border-b border-border !pb-4 !mb-4 flex items-center justify-between">
                        <span className="font-semibold text-text-main">Đến hạn: {assignment.dueDate}</span>
                    </div>

                    <div className="text-text-main whitespace-pre-wrap leading-relaxed !mb-8">
                        {assignment.description}
                    </div>

                    {/* Teacher Attachments */}
                    {assignment.attachments && assignment.attachments.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {assignment.attachments.map(att => (
                                <div key={att.id} className="flex items-center gap-3 border border-border rounded-xl !p-3 hover:bg-surface-hover transition-colors cursor-pointer group">
                                    <div className="w-12 h-12 bg-background border border-border rounded flex items-center justify-center flex-shrink-0 group-hover:bg-primary/5">
                                        {getFileIcon(att.type)}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-medium text-sm text-text-main truncate group-hover:text-primary transition-colors">{att.name}</p>
                                        <p className="text-xs text-text-muted">{att.type.toUpperCase()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <div className="border-t border-border !mt-8 !pt-6">
                        <div className="flex items-center gap-3 text-text-muted hover:text-text-main transition-colors cursor-pointer">
                            <Icon icon="material-symbols:group-rounded" className="text-xl" />
                            <span className="font-medium">Thêm nhận xét của lớp học...</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Student Submission Panel */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-surface rounded-2xl border border-border !p-6 shadow-sm">
                    <div className="flex items-center justify-between !mb-4">
                        <h3 className="text-xl font-bold text-text-main">Bài tập của bạn</h3>
                        <span className={`font-semibold text-sm ${
                            status === 'Đã nộp' ? 'text-green-600' : 'text-orange-600'
                        }`}>
                            {status}
                        </span>
                    </div>

                    {/* Uploaded Files */}
                    <div className="space-y-3 !mb-4">
                        {myFiles.map(file => (
                            <div key={file.id} className="flex items-center justify-between border border-border rounded-xl !p-3 bg-background group">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    {getFileIcon(file.type)}
                                    <span className="font-medium text-sm text-text-main truncate">{file.name}</span>
                                </div>
                                {status === 'Chưa nộp' && (
                                    <button 
                                        onClick={() => removeFile(file.id)}
                                        className="text-text-muted hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
                                    >
                                        <Icon icon="material-symbols:close-rounded" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <input 
                        type="file" 
                        multiple 
                        className="hidden" 
                        ref={fileInputRef} 
                        onChange={handleFileChange}
                    />

                    {status === 'Chưa nộp' ? (
                        <>
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-primary/50 text-primary font-semibold rounded-xl !p-3 hover:bg-primary/5 hover:border-primary transition-all !mb-3"
                            >
                                <Icon icon="material-symbols:add-rounded" className="text-xl" />
                                Thêm hoặc tạo
                            </button>
                            <button 
                                onClick={handleTurnIn}
                                className={`w-full font-bold rounded-xl !p-3 shadow-sm transition-colors ${
                                    myFiles.length > 0 
                                    ? 'bg-primary text-white hover:bg-primary-hover shadow-primary/20' 
                                    : 'bg-background border border-border text-text-muted cursor-not-allowed'
                                }`}
                                disabled={myFiles.length === 0}
                            >
                                Nộp bài
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={handleCancelSubmit}
                            className="w-full bg-background border border-border text-text-main font-bold rounded-xl !p-3 hover:bg-surface-hover transition-colors"
                        >
                            Hủy nộp bài
                        </button>
                    )}
                </div>

                {/* Private Comments */}
                <div className="bg-surface rounded-2xl border border-border !p-6 shadow-sm flex items-center gap-3 text-text-muted cursor-pointer hover:bg-surface-hover transition-colors">
                    <Icon icon="material-symbols:person-rounded" className="text-xl" />
                    <span className="font-medium text-sm">Thêm nhận xét riêng tư với GV...</span>
                </div>
            </div>
        </div>
    );
};

export default AssignmentDetailStudent;
