import { getApiUrl } from '../../../config/api';

export const adminService = {
    // Dashboard Stats
    getDashboardStats: async () => {
        const token = localStorage.getItem('ems-auth-storage') ? 
            JSON.parse(localStorage.getItem('ems-auth-storage')).state.user?.token : null;
            
        const response = await fetch(getApiUrl('/api/admin/dashboard'), {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Không thể tải dữ liệu dashboard');
        return await response.json();
    },

    // Account List
    getAccounts: async () => {
        const token = localStorage.getItem('ems-auth-storage') ? 
            JSON.parse(localStorage.getItem('ems-auth-storage')).state.user?.token : null;

        const response = await fetch(getApiUrl('/api/admin/accounts'), {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Không thể tải danh sách tài khoản');
        return await response.json();
    },

    // Account Detail
    getAccountById: async (id) => {
        const token = localStorage.getItem('ems-auth-storage') ? 
            JSON.parse(localStorage.getItem('ems-auth-storage')).state.user?.token : null;

        const response = await fetch(getApiUrl(`/api/admin/accounts/${id}`), {
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
    }
};
