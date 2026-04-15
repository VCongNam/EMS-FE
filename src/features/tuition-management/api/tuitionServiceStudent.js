import { getApiUrl } from '../../../config/api';

export const tuitionService = {
    // Lấy danh sách học phí của sinh viên
    getStudentTuitions: async (token, params = {}) => {
        // params: Page, Size, ClassID, Status, Period
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('Page', params.page);
        if (params.size) queryParams.append('Size', params.size);
        if (params.classId) queryParams.append('ClassID', params.classId);
        if (params.status) queryParams.append('Status', params.status);
        if (params.period) queryParams.append('Period', params.period);

        const response = await fetch(getApiUrl(`/api/TuitionFee/student/myTuitions?${queryParams.toString()}`), {
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
        const response = await fetch(getApiUrl(`/api/TuitionFee/student/${invoiceId}/detail`), {
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
        const response = await fetch(getApiUrl(`/api/TuitionFee/${invoiceId}/paymentQr`), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response;
    },

    // Submit ảnh minh chứng thanh toán
    uploadTransactionProof: async (invoiceId, file, token) => {
        const formData = new FormData();
        formData.append('ProofImage', file);

        const response = await fetch(getApiUrl(`/api/TuitionFee/${invoiceId}/proof`), {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        return response;
    },

    // Lấy danh sách giao dịch của tôi
    getMyTransactions: async (token, classId = null) => {
        const url = classId
            ? getApiUrl(`/api/TuitionFee/student/myTransactions?classId=${classId}`)
            : getApiUrl(`/api/TuitionFee/student/myTransactions`);
            
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response;
    },

    // Lấy chi tiết giao dịch
    getTransactionDetail: async (transactionId, token) => {
        const response = await fetch(getApiUrl(`/api/TuitionFee/student/myTransactions/${transactionId}`), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response;
    }
};
