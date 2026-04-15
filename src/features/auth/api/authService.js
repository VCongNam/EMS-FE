import { getApiUrl } from '../../../config/api';

export const authService = {
  login: async ({ identifier, password, selectedRole }) => {
    const response = await fetch(getApiUrl('/api/Auth/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, password, selectedRole }),
    });
    return response;
  },

  selectProfile: async (studentId, tempToken) => {
    const response = await fetch(getApiUrl('/api/Auth/select-profile'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tempToken}`
      },
      body: JSON.stringify({ studentId }),
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
  },

  verifyOnboarding: async (payload) => {
    const response = await fetch(getApiUrl('/api/Auth/verify-onboarding'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return response;
  },

  resendOtp: async (email) => {
    const response = await fetch(getApiUrl('/api/Auth/resend-otp'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    return response;
  }
};
