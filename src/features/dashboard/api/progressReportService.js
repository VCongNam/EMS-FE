import { getApiUrl } from '../../../config/api';

export const progressReportService = {
  getSummary: async (month, year, search, token) => {
    let url = `/api/ProgressReport/classes/summary?month=${month}&year=${year}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    return fetch(getApiUrl(url), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  getClassDetail: async (classId, month, year, token) => {
    const url = `/api/ProgressReport/class/${classId}?month=${month}&year=${year}`;
    return fetch(getApiUrl(url), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  upsertReport: async (payload, token) => {
    const isUpdate = !!payload.reportId;
    const url = isUpdate ? `/api/ProgressReport/${payload.reportId}` : '/api/ProgressReport';
    const method = isUpdate ? 'PUT' : 'POST';
    
    // According to Hoppscotch, PUT only needs these fields
    const body = isUpdate ? {
      title: payload.title,
      content: payload.content,
      status: payload.status
    } : payload;

    return fetch(getApiUrl(url), {
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  },

  sendReport: async (reportId, token) => {
    return fetch(getApiUrl(`/api/ProgressReport/${reportId}/send`), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  deleteReport: async (reportId, token) => {
    return fetch(getApiUrl(`/api/ProgressReport/${reportId}`), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
};
