import { getApiUrl } from '../../../config/api';

export const notificationService = {
  /**
   * View all notifications for the current user
   */
  getNotifications: async (token) => {
    const response = await fetch(getApiUrl('/api/Notification/Notifications'), {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response;
  },

  /**
   * Mark a specific notification as read
   */
  markAsRead: async (notificationId, token) => {
    const response = await fetch(getApiUrl(`/api/Notification/mark-as-read/${notificationId}`), {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response;
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (token) => {
    const response = await fetch(getApiUrl('/api/Notification/mark-all-as-read'), {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response;
  },

  getUnreadCount: async (token) => {
        return await fetch(getApiUrl('/api/Notification/unread-count'), {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    },

    /**
     * Lấy VAPID Public Key từ Backend (để đăng ký Push)
     */
    getVapidPublicKey: async (token) => {
        // Giả sử npoint là /api/Notification/vapid-public-key
        // Bạn có thể đổi lại nếu BE dùng path khác
        return await fetch(getApiUrl('/api/Notification/vapid-key'), {
            headers: { 
                'Authorization': `Bearer ${token}` 
            }
        });
    },

    /**
     * Lưu Subscription Object lên Server (Cấu trúc phẳng theo BE yêu cầu)
     */
    saveSubscription: async (subscription, token) => {
        const subJson = subscription.toJSON();
        
        // Chuyển cấu trúc từ { endpoint, keys: {p256dh, auth} } 
        // thành cấu trúc phẳng { endpoint, p256dh, auth, deviceName }
        const payload = {
            endpoint: subJson.endpoint,
            p256dh: subJson.keys.p256dh,
            auth: subJson.keys.auth,
            deviceName: `${navigator.platform} - ${navigator.userAgent.split(' ')[0]}` // Tự tạo tên thiết bị
        };

        return await fetch(getApiUrl('/api/Notification/subscribe'), {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
    },

    /**
     * Hủy đăng ký trên Server
     */
    unsubscribe: async (endpoint, token) => {
        return await fetch(getApiUrl('/api/Notification/unsubscribe'), {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ endpoint })
        });
    }
};
