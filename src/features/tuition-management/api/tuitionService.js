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
    },

    // Lấy thống kê Báo cáo tài chính tất cả các lớp (Màn 3)
    getClassFinancialSummaries: async (token) => {
        const response = await fetch(getApiUrl(`/api/TuitionFee/report/class-summaries`), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response;
    },

    // Lấy báo cáo thống kê tóm tắt (Màn 2)
    getOverallReportSummary: async (token) => {
        const response = await fetch(getApiUrl(`/api/TuitionFee/report/summary`), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response;
    },

    // Lấy chi tiết tài khoản/hóa đơn cho từng học sinh trong 1 lớp (Màn 4)
    getClassFinancialDetail: async (classId, month, year, token) => {
        const response = await fetch(getApiUrl(`/api/TuitionFee/class/${classId}/detail?month=${month}&year=${year}`), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response;
    },

    // Gia hạn số ngày hoàn thành hóa đơn cho một học sinh (Màn 4)
    extendInvoiceDueDate: async (invoiceId, additionalDays, token) => {
        const response = await fetch(getApiUrl(`/api/TuitionFee/invoice/${invoiceId}/extend-due-date`), {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ additionalDays })
        });
        return response;
    },

    // Gia hạn hàng loạt cho toàn bộ các hóa đơn chưa đóng trong lớp
    extendClassDueDates: async (classId, periodMonth, periodYear, additionalDays, token) => {
        const response = await fetch(getApiUrl(`/api/TuitionFee/class/${classId}/extend-due-date`), {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ periodMonth, periodYear, additionalDays })
        });
        return response;
    },

    // Lấy toàn bộ danh sách các giao dịch (UNC) đang chờ kế toán duyệt (Màn 5)
    getPendingTransactions: async (token) => {
        const response = await fetch(getApiUrl(`/api/TuitionFee/transactions/pending`), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response;
    },

    // Lệnh Kế Toán thực hiện xác nhận (Duyệt/Thất bại) hóa đơn (Màn 5)
    reviewTransaction: async (transactionId, payload, token) => {
        // payload: { isApproved: boolean, note: string }
        const response = await fetch(getApiUrl(`/api/TuitionFee/transaction/${transactionId}/review`), {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        return response;
    }
};
