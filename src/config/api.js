// API Base URLs
const DEV_URL = 'https://localhost:7049';
const PROD_URL = 'https://ems-be-2-s2nk.onrender.com';

// Bật cờ này thành true nếu bạn muốn test API bằng localhost
const USE_LOCAL_API = true;

export const API_BASE_URL = USE_LOCAL_API ? DEV_URL : PROD_URL;

// Helper to get full API endpoint
export const getApiUrl = (endpoint) => {
    // Ensure endpoint starts with a slash if not provided
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_BASE_URL}${path}`;
};
