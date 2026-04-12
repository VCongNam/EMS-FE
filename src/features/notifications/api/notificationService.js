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
  }
};
