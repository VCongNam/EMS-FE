import apiClient from './apiClient';

export const authService = {
    // Gọi API Đăng nhập
    login: async (email, password) => {
        const response = await apiClient.post('/Auth/Login', { email, password });
        return response.data;
    },

    // Gọi API Đăng ký
    register: async (userData) => {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    }
};