// src/services/apiClient.js
import axios from 'axios';

// Tạo một instance của axios với các cấu hình mặc định
const apiClient = axios.create({
    // Thay đổi URL này thành địa chỉ Backend thực tế của bạn
    baseURL: 'https://localhost:7049/api', 
    headers: {
        'Content-Type': 'application/json',
    },
    // timeout: 10000, // Có thể setup thời gian chờ tối đa (10 giây)
});

// Bạn có thể thêm Interceptors ở đây sau này (để tự động đính kèm Token khi gửi API)
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;