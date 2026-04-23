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
  getAssignmentsByClass: async (classId, token, page = 1, size = 100) => {
    const queryParams = new URLSearchParams({
      Page: page,
      Size: size
    });
    return fetch(getApiUrl(`/api/Assignment/class/${classId}?${queryParams.toString()}`), {
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
  gradeSubmission: async (submissionId, gradePayload, token) => {
    let body;
    let headers = {
      'Authorization': `Bearer ${token}`
    };
    
    // If payload is already FormData (containing Score and Files)
    if (gradePayload instanceof FormData) {
        body = gradePayload;
    } else {
        // Fallback for current string/number grade
        body = new FormData();
        body.append('grade', gradePayload);
        // Do not set Content-Type for FormData, fetch does it automatically with boundary
    }

    return fetch(getApiUrl(`/api/Assignment/submissions/${submissionId}/grade`), {
      method: 'PUT',
      headers: headers,
      body: body
    });
  },
  createOfflineTest: async (payloadFormData, token) => {
    return fetch(getApiUrl('/api/Assignment/offline-test'), {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`
      },
      body: payloadFormData
    });
  },
  createOfflineSubmission: async (assignmentId, payloadFormData, token) => {
    return fetch(getApiUrl(`/api/Assignment/${assignmentId}/offline-submission`), {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`
      },
      body: payloadFormData
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
  },
  getSubmissionDetail: async (assignmentId, studentId, token) => {
    return fetch(getApiUrl(`/api/Assignment/${assignmentId}/submissions/${studentId}`), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  },
  publishAssignment: async (assignmentId, token) => {
    return fetch(getApiUrl(`/api/Assignment/${assignmentId}/publish`), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  }
};
