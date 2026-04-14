import { getApiUrl } from '../../../config/api';

const postService = {
    // Lấy tất cả bài đăng theo lớp học
    getPostsByClassId: async (classId, token) => {
        return fetch(getApiUrl(`/api/Post/class/${classId}`), {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },

    // Lấy chi tiết bài đăng
    getPostById: async (postId, token) => {
        return fetch(getApiUrl(`/api/Post/${postId}`), {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },

    // Tạo bài đăng mới (Multipart/FormData)
    createPost: async (formData, token) => {
        return fetch(getApiUrl('/api/Post'), {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
                // Không set Content-Type để browser tự set x-boundary cho FormData
            },
            body: formData
        });
    },

    // Cập nhật bài đăng (Multipart/FormData)
    updatePost: async (postId, formData, token) => {
        return fetch(getApiUrl(`/api/Post/${postId}`), {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
    },

    // Xóa bài đăng
    deletePost: async (postId, token) => {
        return fetch(getApiUrl(`/api/Post/${postId}`), {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },

    // Bình luận bài đăng
    commentOnPost: async (postId, content, token) => {
        const url = getApiUrl(`/api/Post/${postId}/comments`);
        console.log('Fetching comment API:', url);
        return fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        });
    },

    // Xóa bình luận
    deleteComment: async (commentId, token) => {
        return fetch(getApiUrl(`/api/Post/comments/${commentId}`), {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
};

export default postService;
