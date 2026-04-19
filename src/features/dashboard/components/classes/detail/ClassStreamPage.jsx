import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Icon } from '@iconify/react';
import PostComposer from './components/PostComposer';
import PostCard from './components/PostCard';
import postService from '../../../api/postService';
import useAuthStore from '../../../../../store/authStore';

const ClassStreamPage = () => {
    const { classId } = useParams();
    const { user } = useAuthStore();
    const token = user?.token;
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPosts = async (silent = false) => {
        if (!silent) setIsLoading(true);
        try {
            const res = await postService.getPostsByClassId(classId, token);
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            } else {
                if (!silent) toast.error('Không thể tải bản tin');
            }
        } catch (error) {
            console.error('Fetch posts error:', error);
            if (!silent) toast.error('Lỗi kết nối máy chủ');
        } finally {
            if (!silent) setIsLoading(false);
        }
    };

    useEffect(() => {
        if (classId && token) {
            fetchPosts();
        }
    }, [classId, token]);

    const handleNewPost = async (formData) => {
        try {
            formData.append('ClassId', classId);
            const res = await postService.createPost(formData, token);

            if (res.ok) {
                toast.success('Đã đăng bài mới');
                fetchPosts();
            } else {
                const errorData = await res.json().catch(() => ({}));
                toast.error(`Lỗi khi đăng bài: ${errorData.message || res.statusText}`);
            }
        } catch (error) {
            console.error('Create post error:', error);
            toast.error('Lỗi kết nối khi đăng bài');
        }
    };

    const handleUpdatePost = async (postId, data) => {
        const formData = new FormData();
        formData.append('Title', data.title);
        formData.append('Content', data.content);

        if (data.newFiles && data.newFiles.length > 0) {
            data.newFiles.forEach(file => {
                formData.append('NewAttachments', file);
            });
        }

        if (data.removedIds && data.removedIds.length > 0) {
            data.removedIds.forEach(id => {
                formData.append('RemoveAttachmentIds', id);
            });
        }

        try {
            const res = await postService.updatePost(postId, formData, token);
            if (res.ok) {
                toast.success('Đã cập nhật bài đăng');
                fetchPosts(true); // Silent fetch to keep the UI smooth
            } else {
                toast.error('Lỗi khi cập nhật bài đăng');
            }
        } catch (error) {
            console.error('Update post error:', error);
            toast.error('Lỗi kết nối khi cập nhật');
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            const res = await postService.deletePost(postId, token);
            if (res.ok) {
                toast.success('Đã xóa bài đăng');
                setPosts(posts.filter(p => p.postId !== postId));
            } else {
                toast.error('Lỗi khi xóa bài đăng');
            }
        } catch (error) {
            console.error('Delete post error:', error);
            toast.error('Lỗi kết nối khi xóa');
        }
    };

    const handleComment = async (postId, content) => {
        try {
            const res = await postService.commentOnPost(postId, content, token);
            if (res.ok) {
                // Fetch silently to update the comments list without flickering
                await fetchPosts(true);
            } else {
                toast.error('Lỗi khi gửi nhận xét');
            }
        } catch (error) {
            console.error('Comment error:', error);
            toast.error('Lỗi kết nối khi gửi nhận xét');
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const res = await postService.deleteComment(commentId, token);
            if (res.ok) {
                toast.success('Đã xóa nhận xét');
                await fetchPosts(true);
            } else {
                toast.error('Lỗi khi xóa nhận xét');
            }
        } catch (error) {
            console.error('Delete comment error:', error);
            toast.error('Lỗi kết nối khi xóa nhận xét');
        }
    };

    return (
        <div className="w-full !pb-12 animate-fade-in">
            {/* Cột chính (100%) */}
            <div className="w-full space-y-6">
                {/* Post Composer */}
                <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md !pb-4 !pt-2">
                    <PostComposer onPost={handleNewPost} />
                </div>

                {/* Danh sách Posts */}
                {isLoading ? (
                    <div className="space-y-8 mt-4">
                        {[1, 2].map(i => (
                            <div key={i} className="bg-surface rounded-2xl border border-border h-64 animate-pulse shadow-sm"></div>
                        ))}
                    </div>
                ) : posts.length > 0 ? (
                    <div className="space-y-6 mt-4">
                        {posts.map(post => (
                            <PostCard
                                key={post.postId}
                                post={post}
                                onUpdate={handleUpdatePost}
                                onDelete={handleDeletePost}
                                onComment={handleComment}
                                onDeleteComment={handleDeleteComment}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-surface rounded-3xl border border-border !p-12 shadow-sm text-center flex flex-col items-center justify-center min-h-[400px] mt-4">
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center !mb-6">
                            <Icon icon="solar:chat-round-dots-bold-duotone" className="text-primary text-5xl" />
                        </div>
                        <h3 className="text-xl font-bold text-text-main !mb-2">Đây là nơi giao tiếp với lớp học của bạn</h3>
                        <p className="text-text-muted max-w-md mx-auto leading-relaxed">
                            Sử dụng bảng tin để chia sẻ thông báo quan trọng, thảo luận về bài học và đặt câu hỏi cho giáo viên.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClassStreamPage;
