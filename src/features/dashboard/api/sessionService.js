import { getApiUrl } from '../../../config/api';

export const sessionService = {
  getTeacherSchedule: async (token) => {
    return fetch(getApiUrl('/api/session/teacher-schedule'), {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  getClassSessions: async (classId, token) => {
    return fetch(getApiUrl(`/api/session/class/${classId}`), {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  createSession: async (payload, token) => {
    return fetch(getApiUrl('/api/session'), {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(payload)
    });
  },

  updateSession: async (sessionId, payload, token) => {
    return fetch(getApiUrl(`/api/session/${sessionId}`), {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(payload)
    });
  },

  deleteSession: async (sessionId, token) => {
    return fetch(getApiUrl(`/api/session/${sessionId}`), {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  getAttendance: async (sessionId, token) => {
    return fetch(getApiUrl(`/api/session/${sessionId}/attendance`), {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  saveAttendance: async (sessionId, payload, token) => {
    return fetch(getApiUrl(`/api/session/${sessionId}/attendance`), {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(payload)
    });
  }
};
