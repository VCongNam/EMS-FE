import { getApiUrl } from '../../../config/api';

const studentClassService = {
    // Lấy danh sách lớp học của sinh viên
    getMyClasses: async (params, token) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('Page', params.page);
        if (params.size) queryParams.append('Size', params.size);
        if (params.status && params.status !== 'all') queryParams.append('Status', params.status);

        const url = getApiUrl(`/api/StudentClass/MyClasses?${queryParams.toString()}`);
        
        return fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },

    // Lấy chi tiết lớp học (Portal Sinh viên)
    getClassDetail: async (classId, token) => {
        const url = getApiUrl(`/api/StudentClass/${classId}/Detail`);
        return fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
};

export default studentClassService;
