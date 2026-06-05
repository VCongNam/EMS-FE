/**
 * Formats a date string to Vietnam time (GMT+7)
 * @param {string|Date} date - The date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
export const formatViDate = (date, options = {}) => {
    if (!date) return '';
    
    const defaultOptions = {
        timeZone: 'Asia/Ho_Chi_Minh',
        ...options
    };

    try {
        let d;
        if (typeof date === 'string') {
            let dateStr = date;
            // If the date string has a 'T' (date-time format) and lacks a timezone specifier (Z or offset),
            // treat it as UTC by appending 'Z'
            const parts = date.split('T');
            const timePart = parts[1];
            if (timePart && !timePart.endsWith('Z') && !timePart.includes('+') && !timePart.includes('-')) {
                dateStr = date + 'Z';
            }
            d = new Date(dateStr);
        } else {
            d = date;
        }
        
        // Check if date is valid
        if (isNaN(d.getTime())) return date;
        
        return d.toLocaleString('vi-VN', defaultOptions);
    } catch (error) {
        console.error('Error formatting date:', error);
        return date;
    }
};

/**
 * Specifically format as time (HH:mm) in Vietnam timezone
 */
export const formatViTime = (date) => {
    return formatViDate(date, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

/**
 * Specifically format as short date-time (HH:mm dd/MM)
 */
export const formatViDateTimeShort = (date) => {
    return formatViDate(date, {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit'
    });
};

/**
 * Specifically format as full date (dd/MM/yyyy)
 */
export const formatViFullDate = (date) => {
    return formatViDate(date, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};
