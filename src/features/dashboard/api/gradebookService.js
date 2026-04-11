import { getApiUrl } from '../../../config/api';

export const gradebookService = {
  getGradeCategories: async (classId, token) => {
    return fetch(getApiUrl(`/api/Gradebook/classes/${classId}/categories`), {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  addGradeCategory: async (classId, payload, token) => {
    return fetch(getApiUrl(`/api/Gradebook/classes/${classId}/categories`), {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(payload)
    });
  },

  updateGradeCategory: async (classId, payload, token) => {
    return fetch(getApiUrl(`/api/Gradebook/classes/${classId}/categories`), {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(payload)
    });
  },

  deleteGradeCategory: async (classId, categoryId, token) => {
    return fetch(getApiUrl(`/api/Gradebook/classes/${classId}/categories/${categoryId}`), {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }
};
