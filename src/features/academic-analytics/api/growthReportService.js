import { getApiUrl } from '../../../config/api';

export const growthReportService = {
    // Lấy báo cáo hiệu suất giảng dạy và biến động học viên của giáo viên
    getTeacherGrowthReport: async (startDate, endDate, token) => {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);

        const response = await fetch(getApiUrl(`/api/reports/teachers/growth?${queryParams.toString()}`), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response;
    },

    // Lấy báo cáo chi tiết của một lớp học cụ thể
    getClassGrowthReport: async (classId, startDate, endDate, token) => {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);

        const response = await fetch(getApiUrl(`/api/reports/teachers/classes/${classId}/growth?${queryParams.toString()}`), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response;
    }
};
