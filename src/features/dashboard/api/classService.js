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
  },

  removeStudentFromClass: async (classId, studentId, token) => {
    return fetch(getApiUrl(`/api/Class/${classId}/students/${studentId}/remove`), {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  restoreStudentToClass: async (classId, studentId, token) => {
    return fetch(getApiUrl(`/api/Class/${classId}/students/${studentId}/restore`), {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  getClassStaff: async (id, token) => {
    return fetch(getApiUrl(`/api/Class/${id}/staff`), {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  importStudentsExcel: async (classId, file, token) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return fetch(getApiUrl(`/api/StudentAccount/import-excel?classId=${classId}`), {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`
        // Content-Type is determined automatically for FormData
      },
      body: formData
    });
  },

  assignMultipleStudents: async (classId, studentIds, token) => {
    return fetch(getApiUrl(`/api/Class/${classId}/assignMultipleStudent`), {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ studentIds })
    });
  }
};
