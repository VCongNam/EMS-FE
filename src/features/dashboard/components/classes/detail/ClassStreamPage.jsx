import React, { useState } from 'react';
import PostComposer from './components/PostComposer';
import PostCard from './components/PostCard';

const mockPosts = [
    {
        id: '1',
        author: 'Nguyễn Văn A',
        role: 'TEACHER',
        time: ' Hôm qua',
        content: 'Chào các em, thầy gửi tài liệu tuần này nhé. Các em nhớ đọc trước slide và xem video hướng dẫn cài đặt môi trường. Nếu có gì không hiểu thì comment ở dưới nhé.',
        attachments: [
            { id: '1a', name: 'Bài giảng tuần 1: Tổng quan.pdf', type: 'pdf', size: '2.5 MB' },
            { id: '1b', name: 'Slide bài giảng - Chương 1.ppt', type: 'ppt', size: '5.1 MB' },
            { id: '1c', name: 'Video hướng dẫn cài đặt môi trường.mp4', type: 'video', size: '150 MB' }
        ]
    },
    {
        id: '2',
        author: 'Lê Văn C',
        role: 'TA',
        time: ' 2 ngày trước',
        content: 'Đây là tài liệu tham khảo bổ sung cho bài tập lớn. Các nhóm trưởng down về gửi cho các bạn trong nhóm nhé!',
        attachments: [
            { id: '2a', name: 'Tài liệu tham khảo bổ sung.doc', type: 'doc', size: '1.2 MB' }
        ]
    }
];

const ClassStreamPage = () => {
    const [posts, setPosts] = useState(mockPosts);

    const handleNewPost = (newPost) => {
        setPosts([newPost, ...posts]);
    };

    const handleUpdatePost = (postId, data) => {
        setPosts(posts.map(p => p.id === postId ? { ...p, content: data.content, attachments: data.attachments } : p));
    };

    const handleDeletePost = (postId) => {
        setPosts(posts.filter(p => p.id !== postId));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up">
            {/* Cột trái (25%) */}
            <div className="md:col-span-1 space-y-6">
                {/* Upcoming deadlines */}
                <div className="bg-surface rounded-2xl border border-border !p-5 shadow-sm">
                    <h3 className="font-bold text-text-main !mb-2">Sắp tới</h3>
                    <p className="text-sm text-text-muted">Không có bài tập nào đến hạn sớm.</p>
                    <button className="mt-4 text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
                        Xem tất cả
                    </button>
                </div>
            </div>

            {/* Cột chính (75%) */}
            <div className="md:col-span-3">
                {/* Post Composer */}
                <PostComposer onPost={handleNewPost} />

                {/* Danh sách Posts */}
                {posts.length > 0 ? (
                    <div className="space-y-6">
                        {posts.map(post => (
                            <PostCard 
                                key={post.id} 
                                post={post} 
                                onUpdate={handleUpdatePost} 
                                onDelete={handleDeletePost} 
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
