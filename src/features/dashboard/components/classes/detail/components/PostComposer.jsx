import React, { useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import useAuthStore from '../../../../../../store/authStore';

const PostComposer = ({ onPost, editMode = false, initialContent = '', initialAttachments = [], onSave, onCancel }) => {
    const { user } = useAuthStore();
    const [isExpanded, setIsExpanded] = useState(editMode);
    const [title, setTitle] = useState(initialContent?.title || '');
    const [content, setContent] = useState(initialContent?.content || initialContent || '');
    const [existingAttachments, setExistingAttachments] = useState(initialAttachments);
    const [newFiles, setNewFiles] = useState([]);
    const [removedAttachmentIds, setRemovedAttachmentIds] = useState([]);
    const fileInputRef = useRef(null);

    const userRole = user?.role?.toUpperCase();
    const canPost = userRole === 'TEACHER' || userRole === 'TA';

    if (!canPost) return null;

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const formattedNewFiles = files.map(file => ({
                id: Math.random().toString(36).substr(2, 9),
                name: file.name,
                size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                type: file.type.includes('image') ? 'image'
                    : file.name.endsWith('.pdf') ? 'pdf'
                        : file.name.endsWith('.doc') || file.name.endsWith('.docx') ? 'doc'
                            : file.type.includes('video') ? 'video' : 'other',
                rawFile: file
            }));
            setNewFiles([...newFiles, ...formattedNewFiles]);
        }
        e.target.value = null;
    };

    const removeExistingAttachment = (id) => {
        setExistingAttachments(existingAttachments.filter(a => (a.attachmentId || a.id) !== id));
        setRemovedAttachmentIds([...removedAttachmentIds, id]);
    };

    const removeNewFile = (id) => {
        setNewFiles(newFiles.filter(f => f.id !== id));
    };

    const handlePost = () => {
        if (!title.trim() && !content.trim() && existingAttachments.length === 0 && newFiles.length === 0) return;

        if (editMode && onSave) {
            onSave({
                title,
                content,
                newFiles: newFiles.map(f => f.rawFile),
                removedIds: removedAttachmentIds
            });
            return;
        }

        const formData = new FormData();
        formData.append('Title', title);
        formData.append('Content', content);

        newFiles.forEach(f => {
            if (f.rawFile) formData.append('Attachments', f.rawFile);
        });

        if (onPost) onPost(formData);

        // Reset states
        setTitle('');
        setContent('');
        setNewFiles([]);
        setExistingAttachments([]);
        setRemovedAttachmentIds([]);
        setIsExpanded(false);
    };

    if (!isExpanded) {
        return (
            <div
                onClick={() => setIsExpanded(true)}
                className="bg-surface rounded-2xl border border-border !mb-6 !p-4 md:!p-6 shadow-sm flex items-center gap-4 cursor-pointer hover:bg-surface-hover transition-colors group"
            >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
                    <Icon icon="material-symbols:person" className="text-primary text-xl" />
                </div>
                <span className="text-text-muted group-hover:text-text-main transition-colors">
                    Thông báo nội dung nào đó cho lớp của bạn...
                </span>
            </div>
        );
    }

    return (
        <div className="bg-surface rounded-2xl border border-border !mb-6 !p-4 md:!p-6 shadow-md animate-fade-in">
            <div className="flex flex-col gap-4 !mb-4">
                <div className="flex gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
                        <Icon icon="material-symbols:person" className="text-primary text-xl" />
                    </div>
                    <div className="flex-1 space-y-3">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Tiêu đề bài đăng (tùy chọn)"
                            className="w-full bg-background border-none focus:ring-0 !p-2 font-bold text-text-main text-lg placeholder:font-bold"
                        />
                        <textarea
                            autoFocus
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Thông báo nội dung nào đó cho lớp của bạn..."
                            className="w-full bg-background border-none resize-none focus:ring-0 !p-2 min-h-[100px] text-text-main"
                        ></textarea>
                    </div>
                </div>
            </div>

            {/* Attachments Preview Area */}
            {(existingAttachments.length > 0 || newFiles.length > 0) && (
                <div className="!mb-4 space-y-2 border-t border-border !pt-4">
                    <span className="text-sm font-semibold text-text-main">
                        Tệp đính kèm ({existingAttachments.length + newFiles.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Existing Attachments */}
                        {existingAttachments.map(att => (
                            <div key={att.attachmentId || att.id} className="flex items-center justify-between bg-background border border-border rounded-xl !p-3">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-10 h-10 rounded bg-surface border border-border flex items-center justify-center flex-shrink-0">
                                        <Icon icon="solar:file-check-bold-duotone" className="text-primary text-2xl" />
                                    </div>
                                    <div className="truncate">
                                        <p className="text-sm font-medium text-text-main truncate" title={att.fileName || att.name}>{att.fileName || att.name}</p>
                                        <p className="text-xs text-text-muted">Đã tải lên</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeExistingAttachment(att.attachmentId || att.id)}
                                    className="p-1.5 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                                >
                                    <Icon icon="material-symbols:close-rounded" />
                                </button>
                            </div>
                        ))}
                        {/* New Files */}
                        {newFiles.map(f => (
                            <div key={f.id} className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl !p-3">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-10 h-10 rounded bg-white border border-primary/20 flex items-center justify-center flex-shrink-0">
                                        <Icon
                                            icon={
                                                f.type === 'pdf' ? 'vscode-icons:file-type-pdf2' :
                                                    f.type === 'doc' ? 'vscode-icons:file-type-word' :
                                                        f.type === 'image' ? 'vscode-icons:file-type-image' :
                                                            'material-symbols:insert-drive-file'
                                            }
                                            className="text-2xl"
                                        />
                                    </div>
                                    <div className="truncate">
                                        <p className="text-sm font-medium text-primary truncate" title={f.name}>{f.name}</p>
                                        <p className="text-xs text-primary/60">{f.size}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeNewFile(f.id)}
                                    className="p-1.5 text-primary/60 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                                >
                                    <Icon icon="material-symbols:close-rounded" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions Area */}
            <div className="flex items-center justify-between border-t border-border !pt-4">
                <div className="flex items-center gap-2">
                    <input
                        type="file"
                        multiple
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.mp4"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-hover text-text-muted hover:text-primary transition-colors tooltip-trigger"
                        title="Tải tệp lên"
                    >
                        <Icon icon="material-symbols:upload-file-outline-rounded" className="text-2xl" />
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            if (editMode && onCancel) {
                                onCancel();
                            } else {
                                setIsExpanded(false);
                                setContent('');
                                setNewFiles([]);
                                setExistingAttachments([]);
                            }
                        }}
                        className="!px-4 !py-2 rounded-xl font-semibold text-text-muted hover:bg-surface-hover transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handlePost}
                        disabled={!content.trim() && existingAttachments.length === 0 && newFiles.length === 0}
                        className="!px-6 !py-2 rounded-xl font-semibold !bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        {editMode ? 'Lưu' : 'Đăng'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostComposer;
