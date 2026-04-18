import { getApiUrl } from '../../../config/api';

const studentScheduleService = {
    // Get schedule for student (all classes or specific class)
    // params: { FromDate: '2025-01-01', ToDate: '2027-01-01', ClassId: '...' }
    getSchedule: async (params, token) => {
        const queryParams = new URLSearchParams();
        if (params.FromDate) queryParams.append('FromDate', params.FromDate);
        if (params.ToDate) queryParams.append('ToDate', params.ToDate);
        if (params.ClassId) queryParams.append('ClassID', params.ClassId);

        const url = getApiUrl(`/api/Session/student/schedule?${queryParams.toString()}`);
        
        return fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
};

export default studentScheduleService;
