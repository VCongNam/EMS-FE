import { getApiUrl } from '../../../config/api';

export const feedbackService = {
    createFeedback: async (payload) => {
        const token = localStorage.getItem('ems-auth-storage') ?
            JSON.parse(localStorage.getItem('ems-auth-storage')).state.user?.token : null;

        const response = await fetch(getApiUrl('/api/feedback'), {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Không thể tạo phản hồi');
        }
        return await response.json().catch(() => ({})); // Sometimes API returns 204 No Content
    },

    getFeedbackHistory: async () => {
        const token = localStorage.getItem('ems-auth-storage') ?
            JSON.parse(localStorage.getItem('ems-auth-storage')).state.user?.token : null;

        const response = await fetch(getApiUrl('/api/feedback/history'), {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Không thể tải lịch sử phản hồi');
        }
        return await response.json();
    }
};
