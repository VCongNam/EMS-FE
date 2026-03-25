import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import useAuthStore from '../../../../../../store/authStore';
import PostComposer from './PostComposer';

const PostCard = ({ post, onUpdate, onDelete }) => {
    const { user } = useAuthStore();
    const isTeacherOrTA = ['TEACHER', 'TA'].includes(user?.role?.toUpperCase());
    const [isEditing, setIsEditing] = useState(false);

    if (isEditing) {
        return (
            <PostComposer 
                editMode={true}
                initialContent={post.content}
                initialAttachments={post.attachments || []}
                onSave={(data) => {
                    onUpdate(post.id, data);
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
                        <Icon icon="material-symbols:person" className="text-primary text-xl" />
                    </div>
                    <div>
                        <h4 className="font-bold text-text-main line-clamp-1">{post.author}</h4>
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold">
                                {post.role === 'TEACHER' ? 'GIÁO VIÊN' : post.role === 'TA' ? 'TRỢ GIẢNG' : 'HỌC SINH'}
                            </span>
                            <span>• {post.time}</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                    {isTeacherOrTA && (
                        <>
                            <button 
                                onClick={() => setIsEditing(true)} 
                                className="!p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors border border-transparent hover:border-primary/20" 
                                title="Chỉnh sửa"
                            >
                                <Icon icon="material-symbols:edit-outline-rounded" className="text-lg" />
                            </button>
                            <button 
                                onClick={() => { if (window.confirm('Bạn có chắc muốn xóa bài đăng này?')) onDelete(post.id); }} 
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
            <div className="!px-5 !py-2 text-text-main whitespace-pre-wrap">
                {post.content}
            </div>

            {/* Post Attachments */}
            {post.attachments && post.attachments.length > 0 && (
                <div className="!px-5 !py-3">
                    <div className={`grid gap-3 ${post.attachments.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                        {post.attachments.map((att) => (
                            <div key={att.id} className="group border border-border rounded-xl overflow-hidden hover:bg-surface-hover hover:border-primary/50 transition-all cursor-pointer flex items-center h-20">
                                {/* Attachment Icon Side */}
                                <div className="w-20 h-full border-r border-border bg-background flex flex-col items-center justify-center flex-shrink-0 group-hover:bg-primary/5 transition-colors">
                                    <Icon 
                                        icon={
                                            att.type === 'pdf' ? 'vscode-icons:file-type-pdf2' :
                                            att.type === 'doc' ? 'vscode-icons:file-type-word' :
                                            att.type === 'image' ? 'vscode-icons:file-type-image' :
                                            att.type === 'video' ? 'vscode-icons:file-type-video' :
                                            att.type === 'ppt' ? 'vscode-icons:file-type-powerpoint' :
                                            'material-symbols:insert-drive-file'
                                        } 
                                        className="text-3xl !mb-1" 
                                    />
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider group-hover:text-primary">{att.type}</span>
                                </div>
                                
                                {/* Attachment Detail Side */}
                                <div className="p-3 w-full overflow-hidden flex flex-col justify-center">
                                    <h5 className="text-sm font-semibold text-text-main truncate group-hover:text-primary transition-colors">
                                        {att.name}
                                    </h5>
                                    <p className="text-xs text-text-muted mt-0.5">{att.size || '3.2 MB'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Post Footer (Comments) */}
            <div className="!px-5 !py-3 border-t border-border bg-background/30 rounded-b-2xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
                    <Icon icon="material-symbols:person" className="text-primary text-sm" />
                </div>
                <div className="w-full bg-background border border-border rounded-full !px-4 !py-2 flex items-center gap-2">
                    <input 
                        type="text" 
                        placeholder="Thêm nhận xét của lớp học..." 
                        className="w-full bg-transparent border-none focus:outline-none text-sm text-text-main"
                    />
                    <button className="text-text-muted hover:text-primary transition-colors tooltip-trigger" title="Gửi">
                        <Icon icon="material-symbols:send-rounded" className="text-xl" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
