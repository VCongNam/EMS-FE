import { getApiUrl } from '../../../config/api';

export const assignmentService = {
  createAssignment: async (payloadFormData, token) => {
    return fetch(getApiUrl('/api/Assignment'), {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`
        // Do NOT set Content-Type header when sending FormData, 
        // fetch handles the boundary automatically
      },
      body: payloadFormData
    });
  },
  getAssignmentsByClass: async (classId, token) => {
    return fetch(getApiUrl(`/api/Assignment/class/${classId}`), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  },
  getAssignmentById: async (assignmentId, token) => {
    return fetch(getApiUrl(`/api/Assignment/${assignmentId}`), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  },
  updateAssignment: async (assignmentId, payloadFormData, token) => {
    return fetch(getApiUrl(`/api/Assignment/${assignmentId}`), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
        // Do NOT set Content-Type header when sending FormData
      },
      body: payloadFormData
    });
  },
  deleteAssignment: async (assignmentId, token) => {
    return fetch(getApiUrl(`/api/Assignment/${assignmentId}`), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  },
  getSubmissions: async (assignmentId, token) => {
    return fetch(getApiUrl(`/api/Assignment/${assignmentId}/submissions`), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  },
  gradeSubmission: async (submissionId, grade, token) => {
    return fetch(getApiUrl(`/api/Assignment/submissions/${submissionId}/grade`), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ grade: parseFloat(grade) })
    });
  },
  giveFeedback: async (submissionId, content, token) => {
    return fetch(getApiUrl(`/api/Assignment/submissions/${submissionId}/feedback`), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    });
  }
};
