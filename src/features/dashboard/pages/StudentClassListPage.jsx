import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import Button from '../../../components/ui/Button';
import ClassCard from '../components/classes/ClassCard';
import ClassListFilter from '../components/classes/ClassListFilter';
import studentClassService from '../api/studentClassService';
import studentScheduleService from '../api/studentScheduleService';
import Pagination from '../../../components/ui/Pagination';
import useAuthStore from '../../../store/authStore';
import { extractErrorMessage } from '../../../utils/errorHandler';

const formatSchedule = (cls) => {
    // Try all possible property names from various API versions
    const schedules = cls.schedules || cls.Schedules || cls.classSchedules || cls.schedule || [];
    
    if (!Array.isArray(schedules) || schedules.length === 0) {
        return 'Chưa có lịch cụ thể';
    }

    const dayNames = {
        1: 'CN',
        2: 'T2',
        3: 'T3',
        4: 'T4',
        5: 'T5',
        6: 'T6',
        7: 'T7'
    };

    try {
        const formatted = schedules
            .sort((a, b) => {
                const da = a.dayOfWeek || a.DayOfWeek || 0;
                const db = b.dayOfWeek || b.DayOfWeek || 0;
                return (da === 1 ? 8 : da) - (db === 1 ? 8 : db);
            })
            .map(s => {
                const dow = s.dayOfWeek || s.DayOfWeek;
                if (!dow) return null;
                return dayNames[dow] || '??';
            })
            .filter(Boolean)
            .join(', ');

        return formatted || 'Chưa có lịch cụ thể';
    } catch (err) {
        console.error("Format schedule error for class:", cls.className, err);
        return 'Chưa có lịch cụ thể';
    }
};

const StudentClassListPage = () => {
    const { user } = useAuthStore();
    const token = user?.token;
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 8;

    const fetchMyClasses = async () => {
        setIsLoading(true);
        try {
            // Mapping filter status to API expected values
            let apiStatus = null;
            if (filterStatus === 'ongoing') apiStatus = 'Active';
            else if (filterStatus === 'upcoming') apiStatus = 'Active'; 
            else if (filterStatus === 'completed') apiStatus = 'Past'; 

            const res = await studentClassService.getMyClasses({
                page: currentPage,
                size: itemsPerPage,
                status: apiStatus
            }, token);

            if (res.ok) {
                const result = await res.json();
                console.log("Student Classes API Raw Result:", result);
                
                const items = result.data?.items || result.items || [];
                const mappedClasses = await Promise.all(items.map(async (cls) => {
                    // Fetch sessions to calculate progress for this class
                    let currentSession = 0;
                    let totalSessions = 0;
                    try {
                        const schedRes = await studentScheduleService.getSchedule({
                            FromDate: '2025-01-01',
                            ToDate: '2027-01-01',
                            ClassId: cls.classID
                        }, token);
                        if (schedRes.ok) {
                            const schedData = await schedRes.json();
                            const sessions = Array.isArray(schedData) ? schedData : (schedData.data || []);
                            totalSessions = sessions.length;
                            currentSession = sessions.filter(s => 
                                (s.status || '').toLowerCase().includes('completed') || 
                                (s.status || '').toLowerCase().includes('đã kết thúc')
                            ).length;
                        }
                    } catch (e) {
                        console.warn(`Failed to fetch sessions for student class ${cls.classID}`, e);
                    }

                    return {
                        id: cls.classID || cls.id,
                        name: cls.className,
                        code: cls.className?.split(' ').pop() || 'CLASS',
                        status: cls.enrollmentStatus?.toLowerCase() === 'active' ? 'ongoing' : 
                                cls.enrollmentStatus?.toLowerCase() === 'past' ? 'completed' : 'ongoing',
                        createdAt: cls.startDate ? new Date(cls.startDate).toLocaleDateString('vi-VN') : 'Chưa xác định',
                        schedule: formatSchedule(cls),
                        progress: {
                            currentSession: currentSession,
                            totalSessions: totalSessions || 1
                        },
                        students: {
                            count: cls.currentStudents || 0,
                            max: cls.maxStudents || 50
                        }
                    };
                }));
                setClasses(mappedClasses);
                setTotalItems(result.data?.totalCount || result.data?.totalItems || result.totalCount || mappedClasses.length);
            } else {
                const errData = await res.json().catch(() => ({}));
                toast.error(extractErrorMessage(errData, 'Không thể tải danh sách lớp học'));
            }
        } catch (error) {
            console.error('Fetch classes error:', error);
            toast.error('Lỗi khi tải danh sách lớp học');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchMyClasses();
        }
    }, [token, filterStatus, currentPage]);

    // Reset to page 1 when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filterStatus]);

    const filteredClasses = useMemo(() => {
        return classes.filter(cls => {
            const matchesSearch = cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cls.code.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        });
    }, [searchQuery, classes]);

    return (
        <div className="w-full mx-auto animate-fade-in px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 !mb-8 !mt-4">
                <div className="space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-text-main font-['Outfit'] tracking-tight flex items-center gap-3">
                        <Icon icon="material-symbols:school-rounded" className="text-primary" />
                        Lớp học của tôi
                    </h1>
                    <p className="text-text-muted font-medium !ml-1">
                        Xem danh sách các lớp học bạn đang tham gia.
                    </p>
                </div>
            </div>

            {/* Filter Section */}
            <div className="!mb-8">
                <ClassListFilter
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    filterStatus={filterStatus}
                    onFilterChange={setFilterStatus}
                    showArchived={false}
                />
            </div>

            {/* Class Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-surface rounded-2xl border border-border h-[320px] animate-pulse"></div>
                    ))}
                </div>
            ) : filteredClasses.length > 0 ? (
                <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up">
                    {filteredClasses.map((cls) => (
                        <ClassCard 
                            key={cls.id} 
                            classData={cls} 
                            basePath="/student/classes"
                            showStudentCount={false}
                        />
                    ))}
                </div>

                <Pagination
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
                </>
            ) : (
                <div className="bg-surface rounded-2xl border border-border !p-12 flex flex-col items-center justify-center text-center shadow-sm min-h-[300px]">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center !mb-6">
                        <Icon icon="material-symbols:search-off-rounded" className="text-5xl text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-text-main !mb-2">Không tìm thấy lớp học nào</h3>
                    <p className="text-text-muted max-w-md !mb-6">
                        Thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn các bộ lọc để xem toàn bộ danh sách lớp học của bạn.
                    </p>
                </div>
            )}
        </div>
    );
};

export default StudentClassListPage;
