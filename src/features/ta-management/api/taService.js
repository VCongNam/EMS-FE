import { getApiUrl } from '../../../config/api';
// Force reload triggers

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
  },

  // GET /api/TeachingAssistants/getByMail?email=...
  getTAByEmail: async (email, token) => {
    return fetch(getApiUrl(`/api/TeachingAssistants/getByMail?email=${encodeURIComponent(email)}`), {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  // GET /api/Class/ta/{taId}/classes
  getAssignedClasses: async (taId, token) => {
    return fetch(getApiUrl(`/api/Class/ta/${taId}/classes`), {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },
  // GET /api/Class/ta/{taId}/tasks
  getMyTasks: async (taId, token) => {
    return fetch(getApiUrl(`/api/Class/ta/${taId}/tasks`), {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  // GET /api/TeachingAssistants/myTas
  getMyTas: async (token) => {
    return fetch(getApiUrl(`/api/TeachingAssistants/myTas`), {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  // DELETE /api/Class/{classId}/tas/{taId}/remove
  removeTAFromClass: async (classId, taId, token) => {
    return fetch(getApiUrl(`/api/Class/${classId}/tas/${taId}/remove`), {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  // PATCH /api/TeachingAssistants/{taskId}/status
  updateTaskStatus: async (taskId, status, token) => {
    return fetch(getApiUrl(`/api/TeachingAssistants/${taskId}/status`), {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ status })
    });
  },

  // PATCH /api/TeachingAssistants/{taskId}/review
  reviewTask: async (taskId, payload, token) => {
    return fetch(getApiUrl(`/api/TeachingAssistants/${taskId}/review`), {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(payload)
    });
  }
};

export default taService;
