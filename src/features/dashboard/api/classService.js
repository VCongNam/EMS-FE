import { getApiUrl } from '../../../config/api';

export const classService = {
  getTeacherDashboard: async (token) => {
    return fetch(getApiUrl('/api/Class/teacher/dashboard'), {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  getArchivedClasses: async (token) => {
    return fetch(getApiUrl('/api/Class/teacher/archived-classes'), {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  getClassById: async (id, token) => {
    return fetch(getApiUrl(`/api/Class/${id}`), {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  createClass: async (payload, token) => {
    return fetch(getApiUrl('/api/Class'), {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  },

  updateClass: async (id, payload, token) => {
    return fetch(getApiUrl(`/api/Class/${id}`), {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  },

  archiveClass: async (id, token) => {
    return fetch(getApiUrl(`/api/Class/${id}/archive`), {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  restoreClass: async (id, token) => {
    return fetch(getApiUrl(`/api/Class/${id}/restore`), {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  getClassMembers: async (id, token) => {
    return fetch(getApiUrl(`/api/Class/${id}/members`), {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  assignStudent: async (classId, studentId, token) => {
    return fetch(getApiUrl(`/api/Class/${classId}/assignStudent`), {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ studentID: studentId })
    });
  }
};
