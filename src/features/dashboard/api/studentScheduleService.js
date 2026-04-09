import { getApiUrl } from '../../../config/api';

const studentScheduleService = {
    // Get schedule for student
    // params: { FromDate: '01/01/2025', ToDate: '01/01/2027', ClassID: '...' }
    getSchedule: async (params, token) => {
        const queryParams = new URLSearchParams();
        if (params.FromDate) queryParams.append('FromDate', params.FromDate);
        if (params.ToDate) queryParams.append('ToDate', params.ToDate);
        if (params.ClassId) queryParams.append('ClassID', params.ClassId);

        const url = getApiUrl(`/api/StudentSchedule?${queryParams.toString()}`);
        
        return fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
};

export default studentScheduleService;
