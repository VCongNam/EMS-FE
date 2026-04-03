import { getApiUrl } from '../../../config/api';

export const studentService = {
  createStudentAccount: async (payload, token) => {
    return fetch(getApiUrl('/api/StudentAccount/CreateStudentAccount'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
  }
};
