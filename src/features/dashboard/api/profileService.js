import { getApiUrl } from '../../../config/api';

export const profileService = {
  getProfile: async (token) => {
    const response = await fetch(getApiUrl('/api/Account/profile'), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response;
  },

  updateProfile: async (rolePath, payload, token) => {
    const endpoint = `/api/Account/${rolePath}/profile`;
    const response = await fetch(getApiUrl(endpoint), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    return response;
  },

  changePassword: async (payload, token) => {
    const response = await fetch(getApiUrl('/api/Account/change-password'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    return response;
  },

  updateStudentProfile: async (studentId, payload, token) => {
    const response = await fetch(getApiUrl(`/api/Account/student/${studentId}/profile`), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    return response;
  },

  updateAvatar: async (file, token) => {
    const formData = new FormData();
    formData.append('AvatarFile', file);
    formData.append('file', file);
    formData.append('avatar', file);
    formData.append('image', file);

    const response = await fetch(getApiUrl('/api/Account/avatar'), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    return response;
  }
};
