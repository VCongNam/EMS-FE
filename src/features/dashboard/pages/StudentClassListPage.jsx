import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import Button from '../../../components/ui/Button';
import ClassCard from '../components/classes/ClassCard';
import ClassListFilter from '../components/classes/ClassListFilter';
import studentClassService from '../api/studentClassService';
import useAuthStore from '../../../store/authStore';

const StudentClassListPage = () => {
    const { user } = useAuthStore();
    const token = user?.token;
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const fetchMyClasses = async () => {
        setIsLoading(true);
        try {
            // Mapping filter status to API expected values
            let apiStatus = null;
            if (filterStatus === 'ongoing') apiStatus = 'Active';
            else if (filterStatus === 'upcoming') apiStatus = 'Active'; // Giả định Active bao gồm cả sắp khai giảng
            else if (filterStatus === 'completed') apiStatus = 'Past'; // Giả định Past cho đã kết thúc

            const res = await studentClassService.getMyClasses({
                page: 1,
                size: 50,
                status: apiStatus
            }, token);

            if (res.ok) {
                const result = await res.json();
                const mappedClasses = (result.data?.items || []).map(cls => ({
                    id: cls.classID,
                    name: cls.className,
                    code: cls.className.split(' ').pop() || 'CLASS',
                    status: cls.enrollmentStatus?.toLowerCase() === 'active' ? 'ongoing' : 
                            cls.enrollmentStatus?.toLowerCase() === 'past' ? 'completed' : 'ongoing',
                    createdAt: cls.startDate ? new Date(cls.startDate).toLocaleDateString('vi-VN') : 'Chưa xác định',
                    schedule: 'Chưa có lịch cụ thể',
                    progress: {
                        currentSession: 0,
                        totalSessions: 1
                    },
                    students: {
                        count: 0,
                        max: 50
                    }
                }));
                setClasses(mappedClasses);
            } else {
                toast.error('Không thể tải danh sách lớp học');
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
    }, [token, filterStatus]);

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up">
                    {filteredClasses.map((cls) => (
                        <ClassCard 
                            key={cls.id} 
                            classData={cls} 
                            basePath="/student/classes"
                        />
                    ))}
                </div>
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
