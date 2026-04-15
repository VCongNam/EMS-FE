import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
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

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const res = await postService.getPostsByClassId(classId, token);
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            } else {
                toast.error('Không thể tải bản tin');
            }
        } catch (error) {
            console.error('Fetch posts error:', error);
            toast.error('Lỗi kết nối máy chủ');
        } finally {
            setIsLoading(false);
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
                fetchPosts();
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
                fetchPosts();
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
                fetchPosts();
            } else {
                toast.error('Lỗi khi xóa nhận xét');
            }
        } catch (error) {
            console.error('Delete comment error:', error);
            toast.error('Lỗi kết nối khi xóa nhận xét');
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in-up">
            {/* Cột chính (100%) */}
            <div className="w-full">
                {/* Post Composer */}
                <PostComposer onPost={handleNewPost} />

                {/* Danh sách Posts */}
                {isLoading ? (
                    <div className="space-y-6">
                        {[1, 2].map(i => (
                            <div key={i} className="bg-surface rounded-2xl border border-border h-48 animate-pulse"></div>
                        ))}
                    </div>
                ) : posts.length > 0 ? (
                    <div className="space-y-6">
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
                    <div className="bg-surface rounded-2xl border border-border !p-6 shadow-sm text-center !py-12">
                        <p className="text-text-muted">Đây là nơi giao tiếp với lớp học của bạn</p>
                        <p className="text-sm text-text-muted mt-2">Sử dụng luồng để chia sẻ thông báo, bài tập và câu hỏi</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClassStreamPage;
