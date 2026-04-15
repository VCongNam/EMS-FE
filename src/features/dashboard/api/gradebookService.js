import { getApiUrl } from '../../../config/api';

export const gradebookService = {
  getGradeCategories: async (classId, token) => {
    console.log(`[API Request] GET /api/Gradebook/classes/${classId}/categories`);
    const res = await fetch(getApiUrl(`/api/Gradebook/classes/${classId}/categories`), {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const clone = res.clone();
    try {
      const data = await clone.json();
      console.log(`[API Response] GET /api/Gradebook/classes/${classId}/categories`, data);
    } catch(e) {
      console.log(`[API Response Status] GET /api/Gradebook/classes/${classId}/categories: ${res.status}`);
    }
    return res;
  },

  addGradeCategory: async (classId, payload, token) => {
    console.log(`[API Request] POST /api/Gradebook/classes/${classId}/categories`, payload);
    const res = await fetch(getApiUrl(`/api/Gradebook/classes/${classId}/categories`), {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(payload)
    });
    const clone = res.clone();
    try {
      const data = await clone.json();
      console.log(`[API Response] POST /api/Gradebook/classes/${classId}/categories`, data);
    } catch(e) {
      console.log(`[API Response Status] POST /api/Gradebook/classes/${classId}/categories: ${res.status}`);
    }
    return res;
  },

  updateGradeCategory: async (classId, payload, token) => {
    console.log(`[API Request] PUT /api/Gradebook/classes/${classId}/categories`, payload);
    const res = await fetch(getApiUrl(`/api/Gradebook/classes/${classId}/categories`), {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify(payload)
    });
    const clone = res.clone();
    try {
      const data = await clone.json();
      console.log(`[API Response] PUT /api/Gradebook/classes/${classId}/categories`, data);
    } catch(e) {
      console.log(`[API Response Status] PUT /api/Gradebook/classes/${classId}/categories: ${res.status}`);
    }
    return res;
  },

  deleteGradeCategory: async (classId, categoryId, token) => {
    console.log(`[API Request] DELETE /api/Gradebook/classes/${classId}/categories/${categoryId}`);
    const res = await fetch(getApiUrl(`/api/Gradebook/classes/${classId}/categories/${categoryId}`), {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`[API Response Status] DELETE /api/Gradebook/classes/${classId}/categories/${categoryId}: ${res.status}`);
    return res;
  },

  getGradeTable: async (classId, token) => {
    console.log(`[API Request] GET /api/Gradebook/classes/${classId}`);
    const res = await fetch(getApiUrl(`/api/Gradebook/classes/${classId}`), {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      }
    });
    const clone = res.clone();
    try {
      const data = await clone.json();
      console.log(`[API Response] GET /api/Gradebook/classes/${classId}`, data);
    } catch(e) {
      console.log(`[API Response Status] GET /api/Gradebook/classes/${classId}: ${res.status}`);
    }
    return res;
  },

  bulkSaveGrades: async (classId, changedGrades, token) => {
    console.log(`[API Request] PUT /api/Gradebook/class/${classId}/bulk-save`, { changedGrades });
    const res = await fetch(getApiUrl(`/api/Gradebook/class/${classId}/bulk-save`), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ changedGrades })
    });
    const clone = res.clone();
    try {
      const data = await clone.json();
      console.log(`[API Response] PUT /api/Gradebook/class/${classId}/bulk-save`, data);
    } catch(e) {
      console.log(`[API Response Status] PUT /api/Gradebook/class/${classId}/bulk-save: ${res.status}`);
    }
    return res;
  },

  exportToExcel: async (classId, token) => {
    console.log(`[API Request] GET /api/Gradebook/classes/${classId}/export/excel (Binary response)`);
    return fetch(getApiUrl(`/api/Gradebook/classes/${classId}/export/excel`), {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  exportToPdf: async (classId, token) => {
    console.log(`[API Request] GET /api/Gradebook/classes/${classId}/export/pdf (Binary response)`);
    return fetch(getApiUrl(`/api/Gradebook/classes/${classId}/export/pdf`), {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  },

  bulkUpdateGradeCategories: async (classId, categories, token) => {
    console.log(`[API Request] PUT /api/Gradebook/classes/${classId}/categories/bulk-update`, { categories });
    const res = await fetch(getApiUrl(`/api/Gradebook/classes/${classId}/categories/bulk-update`), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ categories })
    });
    const clone = res.clone();
    try {
      const data = await clone.json();
      console.log(`[API Response] PUT /api/Gradebook/classes/${classId}/categories/bulk-update`, data);
    } catch(e) {
      console.log(`[API Response Status] PUT /api/Gradebook/classes/${classId}/categories/bulk-update: ${res.status}`);
    }
    return res;
  },

  // Lấy bảng điểm của học sinh (Student Portal)
  getStudentGrades: async (classId, token) => {
    return fetch(getApiUrl(`/api/Gradebook/student/${classId}/myGrades`), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }
};
