import { getApiUrl } from '../../../config/api';

export const authService = {
  login: async (credentials) => {
    const response = await fetch(getApiUrl('/api/Auth/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return response;
  },

  register: async (credentials) => {
    const response = await fetch(getApiUrl('/api/Auth/register'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return response;
  },

  verifyEmail: async (payload) => {
    const response = await fetch(getApiUrl('/api/Auth/verify-email'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return response;
  },

  forgotPassword: async (email) => {
    const response = await fetch(getApiUrl('/api/Auth/forgot-password'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    return response;
  },

  resetPassword: async (payload) => {
    const response = await fetch(getApiUrl('/api/Auth/reset-password'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return response;
  }
};
