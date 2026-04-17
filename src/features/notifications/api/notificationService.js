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
        return await fetch(getApiUrl('/api/Push/vapid-public-key'), {
            headers: { 
                'Authorization': `Bearer ${token}` 
            }
        });
    },

    /**
     * Lưu Subscription Object lên Server
     */
    saveSubscription: async (subscription, token) => {
        return await fetch(getApiUrl('/api/Push/subscribe'), {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(subscription)
        });
    },

    /**
     * Hủy đăng ký trên Server
     */
    unsubscribe: async (endpoint, token) => {
        return await fetch(getApiUrl('/api/Push/unsubscribe'), {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ endpoint })
        });
    }
};
