import React, { useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import useAuthStore from '../../../../../../store/authStore';

const PostComposer = ({ onPost, editMode = false, initialContent = '', initialAttachments = [], onSave, onCancel }) => {
    const { user } = useAuthStore();
    const [isExpanded, setIsExpanded] = useState(editMode);
    const [content, setContent] = useState(initialContent);
    const [attachments, setAttachments] = useState(initialAttachments);
    const fileInputRef = useRef(null);

    // Add case-insensitivity to handle both 'TEACHER' and 'teacher'
    const userRole = user?.role?.toUpperCase();
    const canPost = userRole === 'TEACHER' || userRole === 'TA';

    if (!canPost) {
        return null;
    }

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            // Mocking file selection
            const newAttachments = files.map(file => ({
                id: Math.random().toString(36).substr(2, 9),
                name: file.name,
                size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
                type: file.type.includes('image') ? 'image' 
                        : file.name.endsWith('.pdf') ? 'pdf' 
                        : file.name.endsWith('.doc') || file.name.endsWith('.docx') ? 'doc'
                        : file.type.includes('video') ? 'video' : 'other',
                rawFile: file
            }));
            setAttachments([...attachments, ...newAttachments]);
        }
        // Reset input so the same file can be selected again if needed
        e.target.value = null;
    };

    const removeAttachment = (id) => {
        setAttachments(attachments.filter(a => a.id !== id));
    };

    const handlePost = () => {
        if (!content.trim() && attachments.length === 0) return;
        
        if (editMode && onSave) {
            onSave({ content, attachments });
            return;
        }

        const newPost = {
            id: Math.random().toString(36).substr(2, 9),
            author: user?.fullName || 'Người Dùng',
            role: user?.role || 'TEACHER',
            time: 'Vừa xong',
            content: content,
            attachments: attachments.map(a => ({
                id: a.id,
                name: a.name,
                type: a.type,
                size: a.size
            }))
        };

        if (onPost) onPost(newPost);
        setContent('');
        setAttachments([]);
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
            <div className="flex gap-4 !mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
                    <Icon icon="material-symbols:person" className="text-primary text-xl" />
                </div>
                <textarea
                    autoFocus
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Thông báo nội dung nào đó cho lớp của bạn..."
                    className="w-full bg-background border-none resize-none focus:ring-0 !p-2 min-h-[100px] text-text-main"
                ></textarea>
            </div>

            {/* Attachments Preview Area */}
            {attachments.length > 0 && (
                <div className="!mb-4 space-y-2 border-t border-border !pt-4">
                    <span className="text-sm font-semibold text-text-main">Tệp đính kèm ({attachments.length})</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {attachments.map(att => (
                            <div key={att.id} className="flex items-center justify-between bg-background border border-border rounded-xl !p-3">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="w-10 h-10 rounded bg-surface border border-border flex items-center justify-center flex-shrink-0">
                                        <Icon 
                                            icon={
                                                att.type === 'pdf' ? 'vscode-icons:file-type-pdf2' :
                                                att.type === 'doc' ? 'vscode-icons:file-type-word' :
                                                att.type === 'image' ? 'vscode-icons:file-type-image' :
                                                att.type === 'video' ? 'vscode-icons:file-type-video' :
                                                'material-symbols:insert-drive-file'
                                            } 
                                            className="text-2xl" 
                                        />
                                    </div>
                                    <div className="truncate">
                                        <p className="text-sm font-medium text-text-main truncate" title={att.name}>{att.name}</p>
                                        <p className="text-xs text-text-muted">{att.size}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => removeAttachment(att.id)}
                                    className="p-1.5 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
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
                    <button 
                        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-hover text-text-muted hover:text-primary transition-colors"
                        title="Thêm liên kết Youtube"
                        onClick={() => toast.info("Chức năng thêm link Youtube đang phát triển")}
                    >
                        <Icon icon="mdi:youtube" className="text-2xl" />
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
                                setAttachments([]);
                            }
                        }}
                        className="!px-4 !py-2 rounded-xl font-semibold text-text-muted hover:bg-surface-hover transition-colors"
                    >
                        Hủy
                    </button>
                    <button 
                        onClick={handlePost}
                        disabled={!content.trim() && attachments.length === 0}
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
