/**
 * Phân tích và trích xuất chuỗi thông báo lỗi chính xác nhất từ định dạng trả về của Backend.
 * @param {Object} errData Dữ liệu JSON trả về từ API
 * @param {String} defaultMessage Tin nhắn dự phòng nếu không tìm thấy lỗi
 * @returns {String} Chuỗi thông báo lỗi phù hợp nhất để hiển thị
 */
export const extractErrorMessage = (errData, defaultMessage = 'Hệ thống đang bận, vui lòng thử lại sau.') => {
    if (!errData || typeof errData !== 'object') return defaultMessage;

    // 1. Chuẩn riêng biệt (ví dụ: Student Portal API trả về "error")
    if (errData.error && typeof errData.error === 'string') {
        return errData.error;
    }

    // 2. Format thường thấy ở các API chung (dùng "message")
    if (errData.message && typeof errData.message === 'string') {
        return errData.message;
    }

    // 3. Format chuẩn Problem Details / Validation Errors của .NET C#
    if (errData.errors && typeof errData.errors === 'object') {
        const errorMessages = Object.values(errData.errors).flat();
        if (errorMessages.length > 0) return errorMessages.join('; ');
    }

    // 4. Các trường hợp trả về mảng validation trực tiếp theo key mảng (ít gặp hơn)
    if (Array.isArray(errData)) {
         return errData.map(e => typeof e === 'string' ? e : (e.message || defaultMessage)).join('; ');
    }

    // 5. Lấy Title của Problem Details (ví dụ: "One or more validation errors occurred.")
    if (errData.title && typeof errData.title === 'string') {
        return errData.title;
    }

    return defaultMessage;
};
