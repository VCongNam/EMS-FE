import { getApiUrl } from '../../../config/api';

export const taService = {
  // GET /api/Class/{classId}/tas
  getTAListByClass: async (classId, token) => {
    return fetch(getApiUrl(`/api/Class/${classId}/tas`), {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  // POST /api/Class/{classId}/tas/assign
  assignTAToClass: async (classId, payload, token) => {
    return fetch(getApiUrl(`/api/Class/${classId}/tas/assign`), {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(payload)
    });
  },

  // PUT /api/Class/{classId}/tas/{taId}/permission
  setTAPermission: async (classId, taId, payload, token) => {
    return fetch(getApiUrl(`/api/Class/${classId}/tas/${taId}/permission`), {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(payload)
    });
  },

  // POST /api/Class/createTask
  createTask: async (payload, token) => {
    return fetch(getApiUrl(`/api/Class/createTask`), {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(payload)
    });
  },

  // GET /api/Class/classta/{classTaId}
  getAssignedTasks: async (classTaId, token) => {
    return fetch(getApiUrl(`/api/Class/classta/${classTaId}`), {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }
};
