import { createContext, useContext } from 'react';

/**
 * TAPermissionContext
 * Permissions come from: GET /api/TeachingAssistants/{taId}/permission
 * Response: string like "Attendance, Grade, Report, Assignment"
 *
 * Keys:
 *   'Attendance' → Điểm danh học sinh
 *   'Grade'      → Chấm điểm & Nhập điểm
 *   'Report'     → Xem báo cáo học tập (Tiến độ)
 *   'Assignment' → Tạo Bài tập & Assignment
 */
export const TAPermissionContext = createContext({
    permissions: [],       // string[]
    hasPermission: () => true, // always true for Teacher / when not TA
    isTA: false,
    isLoading: false,
});

/**
 * useTAPermission() — use inside any class detail child page
 */
export const useTAPermission = () => useContext(TAPermissionContext);
