import { getApiUrl } from '../../../config/api';

export const feedbackService = {
  getFeedbackHistory: async (token) => {
    const response = await fetch(getApiUrl('/api/feedback/history'), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response;
  },

  createFeedback: async (payload, token) => {
    const response = await fetch(getApiUrl('/api/feedback'), {
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
