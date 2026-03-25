import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockAssignmentDetail } from './AssignmentDetailPage';

const CreateAssignmentPage = () => {
    const navigate = useNavigate();
    const { classId, assignmentId } = useParams();
    const isEditMode = !!assignmentId;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [topic, setTopic] = useState('Chương 1: Tổng quan');
    const [maxScore, setMaxScore] = useState('100');
    const [dueDate, setDueDate] = useState('');
    const [dueTime, setDueTime] = useState('');
    const [attachments, setAttachments] = useState([]);

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (isEditMode) {
            // Mock data population
            setTitle(mockAssignmentDetail.title || '');
            setDescription(mockAssignmentDetail.description || '');
            setTopic(mockAssignmentDetail.topic || '');
            setMaxScore(mockAssignmentDetail.maxScore?.toString() || '100');
            setDueDate('2026-03-25');
            setDueTime('23:59');
            setAttachments(mockAssignmentDetail.attachments || []);
        }
    }, [isEditMode, assignmentId]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newAttachments = files.map(file => ({
                id: Math.random().toString(36).substr(2, 9),
                name: file.name,
                size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                type: file.type.includes('image') ? 'image'
                    : file.name.endsWith('.pdf') ? 'pdf'
                    : file.name.endsWith('.doc') || file.name.endsWith('.docx') ? 'doc'
                    : file.type.includes('video') ? 'video' : 'other',
            }));
            setAttachments([...attachments, ...newAttachments]);
        }
        e.target.value = null;
    };

    const removeAttachment = (id) => {
        setAttachments(attachments.filter(a => a.id !== id));
    };

    const handleCreate = () => {
        navigate(`../classwork`, { relative: 'path' });
    };

    return (
        <div className="mx-auto animate-fade-in-up !pb-8">

            {/* Header */}
            <div className="flex bg-surface rounded-2xl border border-border !p-4 sm:!p-6 shadow-sm items-center gap-3 border-b-2 border-primary/20 !mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-hover text-text-muted transition-colors shrink-0"
                >
                    <Icon icon="material-symbols:close-rounded" className="text-2xl" />
                </button>
                <Icon icon={isEditMode ? "material-symbols:edit-document-outline-rounded" : "material-symbols:assignment-add-outline-rounded"} className="text-2xl sm:text-3xl text-primary shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold text-text-main">{isEditMode ? 'Chỉnh sửa bài tập' : 'Tạo bài tập mới'}</h2>
            </div>

            {/* Body */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left — Main Form */}
                <div className="md:col-span-2 space-y-6">

                    {/* Title + Description */}
                    <div className="bg-surface rounded-2xl border border-border !p-5 sm:!p-6 shadow-sm space-y-4">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Tiêu đề"
                            className="w-full bg-background border border-border rounded-xl !p-4 font-semibold text-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-text-main"
                        />
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Hướng dẫn (không bắt buộc)"
                            className="w-full bg-background border border-border rounded-xl !p-4 min-h-[150px] resize-y focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-text-main"
                        />
                    </div>

                    {/* Attachments */}
                    <div className="bg-surface rounded-2xl border border-border !p-5 sm:!p-6 shadow-sm">
                        <h4 className="font-semibold text-text-main !mb-4">Tệp đính kèm</h4>

                        {attachments.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 !mb-4">
                                {attachments.map(att => (
                                    <div key={att.id} className="flex items-center justify-between bg-background border border-border rounded-xl !p-3">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-10 h-10 rounded bg-surface border border-border flex items-center justify-center shrink-0">
                                                <Icon
                                                    icon={
                                                        att.type === 'pdf' ? 'vscode-icons:file-type-pdf2' :
                                                        att.type === 'doc' ? 'vscode-icons:file-type-word' :
                                                        'material-symbols:insert-drive-file'
                                                    }
                                                    className="text-2xl"
                                                />
                                            </div>
                                            <div className="truncate">
                                                <p className="text-sm font-medium text-text-main truncate">{att.name}</p>
                                                <p className="text-xs text-text-muted">{att.size}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeAttachment(att.id)}
                                            className="!p-1.5 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
                                        >
                                            <Icon icon="material-symbols:close-rounded" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <input
                            type="file"
                            multiple
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center justify-center gap-2 border-2 border-dashed border-primary/50 text-primary font-semibold rounded-xl !p-3 hover:bg-primary/5 hover:border-primary transition-all w-full"
                        >
                            <Icon icon="material-symbols:upload-file-outline-rounded" className="text-xl" />
                            Đính kèm tệp
                        </button>
                    </div>
                </div>

                {/* Right — Settings */}
                <div className="md:col-span-1">
                    <div className="bg-surface rounded-2xl border border-border !p-5 sm:!p-6 shadow-sm space-y-5">

                        <div>
                            <label className="block text-sm font-semibold text-text-main !mb-2">Dành cho</label>
                            <select
                                className="w-full bg-background border border-border rounded-xl !p-3 focus:outline-none focus:border-primary text-text-main cursor-not-allowed opacity-70"
                                disabled
                            >
                                <option>Tất cả học viên (Mặc định)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-text-main !mb-2">Thang điểm</label>
                            <select
                                value={maxScore}
                                onChange={(e) => setMaxScore(e.target.value)}
                                className="w-full bg-background border border-border rounded-xl !p-3 focus:outline-none focus:border-primary text-text-main"
                            >
                                <option value="10">10 điểm</option>
                                <option value="100">100 điểm</option>
                                <option value="unscored">Không chấm điểm</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-text-main !mb-2">Hạn nộp</label>
                            <div className="flex gap-2">
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="flex-1 min-w-0 bg-background border border-border rounded-xl !p-3 focus:outline-none focus:border-primary text-text-main"
                                />
                                <input
                                    type="time"
                                    value={dueTime}
                                    onChange={(e) => setDueTime(e.target.value)}
                                    className="w-24 shrink-0 bg-background border border-border rounded-xl !p-3 focus:outline-none focus:border-primary text-text-main"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-text-main !mb-2">Chủ đề (Topic)</label>
                            <input
                                type="text"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Thêm chủ đề"
                                className="w-full bg-background border border-border rounded-xl !p-3 focus:outline-none focus:border-primary text-text-main"
                            />
                        </div>

                    </div>
                </div>
            </div>

            {/* Footer Actions — full width, pinned at bottom */}
            <div className="!mt-6 rounded-2xl  !p-4 sm:!p-5 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="w-full sm:w-auto !px-6 !py-2.5 text-sm font-semibold text-text-muted border border-border rounded-xl hover:bg-background hover:text-text-main transition-all"
                >
                    Hủy
                </button>
                <button
                    onClick={handleCreate}
                    disabled={!title.trim()}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 !bg-primary text-white font-bold !px-8 !py-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow-sm shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Icon icon={isEditMode ? "material-symbols:save-rounded" : "material-symbols:assignment-turned-in-rounded"} className="text-lg" />
                    {isEditMode ? 'Lưu thay đổi' : 'Giao bài'}
                </button>
            </div>
        </div>
    );
};

export default CreateAssignmentPage;