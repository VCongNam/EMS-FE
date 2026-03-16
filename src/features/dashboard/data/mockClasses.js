export const mockClasses = [
    {
        id: '1',
        name: 'Toán học - Lớp 10A',
        code: 'Lớp 10A',
        status: 'ongoing', // ongoing, upcoming, completed
        createdAt: '10 tháng 03, 2026',
        schedule: 'T2 - T4 - T6 | 18:00 - 19:30',
        progress: {
            currentSession: 12,
            totalSessions: 24,
        },
        students: {
            count: 35,
            max: 40
        }
    },
    {
        id: '2',
        name: 'Ngữ văn - Lớp 10B',
        code: 'Lớp 10B',
        status: 'ongoing',
        createdAt: '08 tháng 03, 2026',
        schedule: 'T3 - T5 | 19:30 - 21:00',
        progress: {
            currentSession: 8,
            totalSessions: 16,
        },
        students: {
            count: 38,
            max: 40
        }
    },
    {
        id: '3',
        name: 'Vật lý Đại cương - Lớp 11A1',
        code: 'Lớp 11A1',
        status: 'upcoming',
        createdAt: '15 tháng 03, 2026',
        schedule: 'T7 Chủ Nhật | 09:00 - 11:00',
        progress: {
            currentSession: 0,
            totalSessions: 30,
        },
        students: {
            count: 22,
            max: 45
        }
    },
    {
        id: '4',
        name: 'Hóa học Cơ bản - Lớp 10C',
        code: 'Lớp 10C',
        status: 'completed',
        createdAt: '01 tháng 01, 2026',
        schedule: 'T2 - T4 - T6 | 19:30 - 21:00',
        progress: {
            currentSession: 24,
            totalSessions: 24,
        },
        students: {
            count: 30,
            max: 40
        }
    }
];
