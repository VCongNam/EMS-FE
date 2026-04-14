import { getApiUrl } from '../../../config/api';

export const adminService = {
    // Dashboard Stats
    getDashboardStats: async (startDate, endDate) => {
        const token = localStorage.getItem('ems-auth-storage') ? 
            JSON.parse(localStorage.getItem('ems-auth-storage')).state.user?.token : null;
            
        let url = getApiUrl('/api/admin/dashboard');
        const params = new URLSearchParams();
        if (startDate) params.append('StartDate', startDate);
        if (endDate) params.append('EndDate', endDate);

        if (params.toString()) {
            url += `?${params.toString()}`;
        }
            
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Không thể tải dữ liệu dashboard');
        return await response.json();
    },

    // Account List (Adapted for Teachers based on current Backend Response)
    getAccounts: async (searchTerm = '', statusFilter = 'Active') => {
        const token = localStorage.getItem('ems-auth-storage') ? 
            JSON.parse(localStorage.getItem('ems-auth-storage')).state.user?.token : null;

        let url = getApiUrl('/api/admin/teachers');
        const params = new URLSearchParams();
        if (searchTerm) params.append('searchTerm', searchTerm);
        if (statusFilter && statusFilter !== 'all') params.append('statusFilter', statusFilter);
        
        url += `?${params.toString()}`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Không thể tải danh sách tài khoản');
        return await response.json();
    },

    // Account Detail (Teacher Detail)
    getAccountById: async (id) => {
        const token = localStorage.getItem('ems-auth-storage') ? 
            JSON.parse(localStorage.getItem('ems-auth-storage')).state.user?.token : null;

        const response = await fetch(getApiUrl(`/api/admin/teachers/${id}`), {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Không thể tải chi tiết tài khoản');
        return await response.json();
    },

    // Update Status
    updateAccountStatus: async (id, newStatus, reason) => {
        const token = localStorage.getItem('ems-auth-storage') ? 
            JSON.parse(localStorage.getItem('ems-auth-storage')).state.user?.token : null;

        const response = await fetch(getApiUrl(`/api/admin/accounts/${id}/status`), {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newStatus, reason })
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Không thể cập nhật trạng thái');
        }
        return await response.json();
    },

    // Feedback Endpoints
    getFeedbacks: async (type = '', status = '') => {
        const token = localStorage.getItem('ems-auth-storage') ? 
            JSON.parse(localStorage.getItem('ems-auth-storage')).state.user?.token : null;

        const params = new URLSearchParams();
        if (type && type !== 'all') params.append('type', type);
        if (status && status !== 'all') params.append('status', status);

        const response = await fetch(getApiUrl(`/api/admin/feedbacks?${params.toString()}`), {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Không thể tải danh sách phản hồi');
        return await response.json();
    },

    getFeedbackById: async (id) => {
        const token = localStorage.getItem('ems-auth-storage') ? 
            JSON.parse(localStorage.getItem('ems-auth-storage')).state.user?.token : null;

        const response = await fetch(getApiUrl(`/api/admin/feedbacks/${id}`), {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Không thể tải chi tiết phản hồi');
        return await response.json();
    },

    processFeedback: async (id, payload) => {
        const token = localStorage.getItem('ems-auth-storage') ? 
            JSON.parse(localStorage.getItem('ems-auth-storage')).state.user?.token : null;

        // Note: Using POST as specified in the Postman configuration System Admin.json
        const response = await fetch(getApiUrl(`/api/admin/feedbacks/${id}/process`), {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload) // { newStatus, adminReply }
        });
        if (!response.ok) throw new Error('Không thể cập nhật phản hồi');
        return await response.json();
    }
};
