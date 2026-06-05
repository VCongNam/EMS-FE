import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import useAuthStore from '../../../../../../store/authStore';
import { formatViDate } from '../../../../../../utils/dateUtils';
import PostComposer from './PostComposer';
import ConfirmModal from '../../../../../../components/ui/ConfirmModal';

const PostCard = ({ post, onUpdate, onDelete, onComment, onDeleteComment }) => {
    const { user } = useAuthStore();
    const token = user?.token;
    const userRole = user?.role?.toUpperCase();
    const isTeacher = userRole === 'TEACHER';
    const isTA = userRole === 'TA';
    
    // Permission rules:
    // 1. Teachers can manage all posts (moderator role)
    // 2. TAs can only manage posts that are NOT from Teachers
    const canManagePost = isTeacher || (isTA && post.role !== 'TEACHER');
    
    console.log('PostCard - Role:', userRole, 'Post Role:', post.role, 'Can Manage:', canManagePost);
    const [isEditing, setIsEditing] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [showAllComments, setShowAllComments] = useState(false);

    const handleCommentSubmit = async () => {
        if (!commentText.trim() || isSubmittingComment) return;

        setIsSubmittingComment(true);
        try {
            await onComment(post.postId, commentText);
            setCommentText('');
        } finally {
            setIsSubmittingComment(false);
        }
    };

    if (isEditing) {
        return (
            <PostComposer
                editMode={true}
                initialContent={{ title: post.title, content: post.content }}
                initialAttachments={post.attachments || []}
                onSave={(data) => {
                    onUpdate(post.postId, data);
                    setIsEditing(false);
                }}
                onCancel={() => setIsEditing(false)}
            />
        );
    }

    return (
        <div className="bg-surface rounded-2xl border border-border !mb-6 shadow-sm hover:shadow-md transition-shadow group">
            {/* Post Header */}
            <div className="!p-5 !pb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon icon="solar:user-bold-duotone" className="text-primary text-xl" />
                    </div>
                    <div>
                        <h4 className="font-bold text-text-main line-clamp-1">{post.authorName || post.author}</h4>
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                            {post.role && (
                                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold">
                                    {post.role === 'TEACHER' ? 'GIÁO VIÊN' : post.role === 'TA' ? 'TRỢ GIẢNG' : 'HỌC SINH'}
                                </span>
                            )}
                            <span>{formatViDate(post.createdAt, {
                                day: '2-digit', month: '2-digit', year: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                            })}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                    {canManagePost && (
                        <>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="!p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors border border-transparent hover:border-primary/20"
                                title="Chỉnh sửa"
                            >
                                <Icon icon="material-symbols:edit-outline-rounded" className="text-lg" />
                            </button>
                            <button
                                onClick={() => setIsConfirmOpen(true)}
                                className="!p-1.5 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-200"
                                title="Xóa"
                            >
                                <Icon icon="material-symbols:delete-outline-rounded" className="text-lg" />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Post Content */}
            <div className="!px-5 !py-2 space-y-2">
                {post.title && (
                    <h3 className="text-lg font-bold text-text-main">{post.title}</h3>
                )}
                <div className="text-text-main whitespace-pre-wrap leading-relaxed">
                    {post.content}
                </div>
            </div>

            {/* Post Attachments */}
            {post.attachments && post.attachments.length > 0 && (
                <div className="!px-5 !py-3">
                    <div className={`grid gap-3 ${post.attachments.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                        {post.attachments.map((att) => {
                            const fileName = att.fileName || att.name;
                            const fileExt = fileName.split('.').pop().toUpperCase();
                            const displayType = fileExt.length > 4 ? fileExt.substring(0, 4) : fileExt;
                            const fileSize = att.fileSize ? `${(att.fileSize / 1024 / 1024).toFixed(2)} MB` : att.size;

                            return (
                                <a
                                    key={att.attachmentId || att.id}
                                    href={att.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group border border-border rounded-xl overflow-hidden hover:bg-surface-hover hover:border-primary/50 transition-all cursor-pointer flex items-center h-24"
                                >
                                    {/* Attachment Icon Side */}
                                    <div className="w-24 h-full border-r border-border bg-background flex flex-col items-center justify-center flex-shrink-0 group-hover:bg-primary/5 transition-colors p-2">
                                        <Icon
                                            icon={
                                                fileName.toLowerCase().endsWith('.pdf') ? 'solar:file-text-bold-duotone' :
                                                    fileName.toLowerCase().match(/\.(doc|docx)$/) ? 'solar:document-bold-duotone' :
                                                        fileName.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/) ? 'solar:gallery-bold-duotone' :
                                                            fileName.toLowerCase().match(/\.(mp4|mov|avi)$/) ? 'solar:videocamera-record-bold-duotone' :
                                                                fileName.toLowerCase().match(/\.(ppt|pptx)$/) ? 'solar:presentation-graph-bold-duotone' :
                                                                    'solar:file-bold-duotone'
                                            }
                                            className={`text-4xl !mb-1 ${fileName.toLowerCase().endsWith('.pdf') ? 'text-red-500' :
                                                    fileName.toLowerCase().match(/\.(doc|docx)$/) ? 'text-blue-500' :
                                                        fileName.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/) ? 'text-emerald-500' :
                                                            fileName.toLowerCase().match(/\.(mp4|mov|avi)$/) ? 'text-purple-500' :
                                                                'text-text-muted'
                                                }`}
                                        />
                                        <span className="text-[10px] font-bold text-text-muted truncate w-full text-center group-hover:text-primary">{displayType}</span>
                                    </div>

                                    {/* Attachment Detail Side */}
                                    <div className="p-4 w-full overflow-hidden flex flex-col justify-center gap-1">
                                        <h5 className="text-sm font-semibold text-text-main truncate group-hover:text-primary transition-colors">
                                            {fileName}
                                        </h5>
                                        <p className="text-xs text-text-muted">{fileSize}</p>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Comments Section */}
            {(post.comments?.length > 0 || isSubmittingComment) && (
                <div className="!px-5 !py-4 border-t border-border bg-background/50">
                    <div className="flex items-center justify-between !mb-4">
                        <button
                            onClick={() => setShowAllComments(!showAllComments)}
                            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                        >
                            <Icon icon={showAllComments ? "solar:alt-arrow-up-linear" : "solar:chat-round-dots-bold-duotone"} />
                            {showAllComments ? 'Thu gọn bình luận' : `Xem ${post.comments?.length} bình luận`}
                        </button>
                    </div>

                    <div className={`space-y-4 ${!showAllComments && post.comments?.length > 2 ? 'max-h-[160px] overflow-hidden' : ''}`}>
                        {(showAllComments ? post.comments : post.comments.slice(-2))?.map((comment) => (
                            <div key={comment.commentId} className="flex gap-3 group">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <Icon icon="solar:user-bold-duotone" className="text-primary text-xs" />
                                </div>
                                <div className="flex-1 bg-background !p-3 rounded-2xl border border-border group-hover:border-primary/30 transition-colors">
                                        <div className="flex items-center justify-between !mb-1">
                                            <h5 className="text-xs font-bold text-text-main">{comment.authorName}</h5>
                                            <div className="flex items-center gap-2">
                                                {canManagePost && (
                                                    <button
                                                        onClick={() => onDeleteComment(comment.commentId)}
                                                        className="opacity-0 group-hover:opacity-100 p-1 text-text-muted hover:text-red-500 transition-opacity"
                                                        title="Xóa nhận xét"
                                                    >
                                                        <Icon icon="material-symbols:delete-outline-rounded" className="text-sm" />
                                                    </button>
                                                )}
                                            <span className="text-[10px] text-text-muted">
                                                {formatViDate(comment.createdAt, { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-text-main leading-relaxed">{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Post Footer (Add Comment) */}
            <div className="!px-5 !py-3 border-t border-border bg-background/30 rounded-b-2xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
                    <Icon icon="solar:user-bold-duotone" className="text-primary text-sm" />
                </div>
                <div className="w-full bg-background border border-border rounded-full !px-4 !py-2 flex items-center gap-2 focus-within:border-primary/50 transition-colors">
                    <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
                        placeholder="Thêm nhận xét của lớp học..."
                        className="w-full bg-transparent border-none focus:outline-none text-sm text-text-main"
                    />
                    <button
                        onClick={handleCommentSubmit}
                        disabled={!commentText.trim() || isSubmittingComment}
                        className="text-text-muted hover:text-primary disabled:opacity-30 transition-colors"
                    >
                        <Icon icon={isSubmittingComment ? "solar:spinner-linear" : "solar:send-bold-duotone"} className={`text-xl ${isSubmittingComment ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={() => {
                    onDelete(post.postId);
                    setIsConfirmOpen(false);
                }}
                title="Xác nhận xóa bài đăng"
                message="Bạn có chắc chắn muốn xóa bài đăng này không? Hành động này không thể hoàn tác."
                confirmText="Xóa bài đăng"
                cancelText="Hủy bỏ"
                type="danger"
            />
        </div>
    );
};

export default PostCard;
