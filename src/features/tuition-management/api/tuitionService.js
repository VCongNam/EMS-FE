import { getApiUrl } from '../../../config/api';

export const tuitionService = {
    // Lấy danh sách học phí
    getStudentTuitions: async (token, params = {}) => {
        // params: Page, Size, ClassID, Status, Period
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('Page', params.page);
        if (params.size) queryParams.append('Size', params.size);
        if (params.classId) queryParams.append('ClassID', params.classId);
        if (params.status) queryParams.append('Status', params.status);
        if (params.period) queryParams.append('Period', params.period);

        const response = await fetch(getApiUrl(`/api/StudentTuition/tuitions?${queryParams.toString()}`), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response;
    },

    // Lấy chi tiết hóa đơn
    getInvoiceDetail: async (invoiceId, token) => {
        const response = await fetch(getApiUrl(`/api/StudentTuition/${invoiceId}`), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response;
    },

    // Lấy QR thanh toán
    getPaymentQr: async (invoiceId, token) => {
        const response = await fetch(getApiUrl(`/api/StudentTuition/${invoiceId}/paymentQr`), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response;
    },

    // Submi ảnh minh chứng
    uploadTransactionProof: async (invoiceId, file, token) => {
        const formData = new FormData();
        formData.append('ProofImage', file);

        const response = await fetch(getApiUrl(`/api/StudentTuition/${invoiceId}/proof`), { 
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        return response;
    },

    // --- CÁC API DÀNH CHO TEACHER / QUẢN TRỊ VIÊN ---
    
    // Tổng quan cấu hình học phí các lớp (Màn hình 1)
    getTuitionConfigs: async (token) => {
        const response = await fetch(getApiUrl(`/api/TuitionFee/configs`), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response;
    },

    // Lấy thống kê tổng quan (Dashboard Analytics)
    getDashboardAnalytics: async (token) => {
        const response = await fetch(getApiUrl(`/api/TuitionFee/report/dashboard-analytics`), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response;
    },

    // Cập nhật cấu hình phí cho lớp
    updateTuitionFee: async (classId, data, token) => {
        const response = await fetch(getApiUrl(`/api/TuitionFee/class/${classId}/fee`), {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return response;
    },

    // Tạo hóa đơn cho lớp (Thường dùng cho lớp Trả Sau)
    generateClassInvoices: async (classId, data, token) => {
        const response = await fetch(getApiUrl(`/api/TuitionFee/class/${classId}/generate-invoices`), {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // { periodMonth, periodYear, dueDate }
        });
        return response;
    },

    // Lên bill đối chiếu / trả trước (Thường dùng cho lớp Trả Trước)
    reconcilePrepaidClass: async (classId, month, year, token) => {
        const formData = new FormData();
        formData.append('month', month);
        formData.append('year', year);

        const response = await fetch(getApiUrl(`/api/TuitionFee/class/${classId}/reconcile`), {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        return response;
    }
};
