import { getApiUrl } from '../../../config/api';

const learningMaterialService = {
    // Get all materials for a class
    getMaterialsByClass: async (classId, token) => {
        return fetch(getApiUrl(`api/LearningMaterial/class/${classId}`), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    },

    // Get detail of a specific material
    getMaterialById: async (materialId, token) => {
        return fetch(getApiUrl(`api/LearningMaterial/${materialId}`), {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    },

    // Create new material (FormData)
    createMaterial: async (formData, token) => {
        return fetch(getApiUrl('api/LearningMaterial'), {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
                // Do NOT set Content-Type header when sending FormData
            },
            body: formData
        });
    },

    // Update material (FormData)
    updateMaterial: async (materialId, formData, token) => {
        return fetch(getApiUrl(`api/LearningMaterial/${materialId}`), {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
                // Do NOT set Content-Type header when sending FormData
            },
            body: formData
        });
    },

    // Delete material
    deleteMaterial: async (materialId, token) => {
        return fetch(getApiUrl(`api/LearningMaterial/${materialId}`), {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    }
};

export default learningMaterialService;
