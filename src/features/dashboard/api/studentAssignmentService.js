import { getApiUrl } from '../../../config/api';

export const studentAssignmentService = {
  // Get assignments for student in a specific class
  getAssignments: async (classId, token, page = 1, size = 100) => {
    const queryParams = new URLSearchParams({
      ClassId: classId,
      Page: page,
      Size: size
    });
    const url = getApiUrl(`/api/Assignment/student/assignments?${queryParams.toString()}`);

    return fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  // Get specific assignment detail (Student Portal)
  getAssignmentDetail: async (assignmentId, token) => {
    return fetch(getApiUrl(`/api/Assignment/student/${assignmentId}/detail`), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  // Submit or update assignment (Student Portal)
  submitAssignment: async (assignmentId, formData, token) => {
    return fetch(getApiUrl(`/api/Assignment/student/${assignmentId}/submit`), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Do NOT set Content-Type for FormData
      },
      body: formData
    });
  },

  // Unsubmit assignment (Student Portal)
  unsubmitAssignment: async (assignmentId, token) => {
    return fetch(getApiUrl(`/api/Assignment/student/${assignmentId}/unsubmit`), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
};
