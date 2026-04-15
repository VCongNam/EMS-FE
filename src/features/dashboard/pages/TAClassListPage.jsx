import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import Button from '../../../components/ui/Button';
import ClassCard from '../components/classes/ClassCard';
import ClassListFilter from '../components/classes/ClassListFilter';
import ClassDetailsModal from '../components/classes/ClassDetailsModal';
import useAuthStore from '../../../store/authStore';
import taService from '../../ta-management/api/taService';

const TAClassListPage = () => {
    const { user } = useAuthStore();
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [viewClass, setViewClass] = useState(null);

    const fetchClasses = async () => {
        const effectiveTaId = user?.taId || user?.id;
        if (!effectiveTaId || !user?.token) return;

        try {
            setIsLoading(true);
            console.log("Testing taService object:", taService);
            if (typeof taService.getAssignedClasses !== 'function') {
                console.error("Critical: getAssignedClasses is still NOT a function in this bundle!", Object.keys(taService));
            }
            const res = await taService.getAssignedClasses(effectiveTaId, user.token);
            if (res.ok) {
                const json = await res.json();
                const rawData = json.data || (Array.isArray(json) ? json : []);
                
                // Map backend response specifically for TA view
                const mappedData = rawData.map(item => {
                    const status = (item.status || 'Active').toLowerCase();
                    // For TAs, treat Archived as Completed
                    const finalStatus = status === 'archived' ? 'completed' : status;
                    
                    return {
                        id: item.classID,
                        name: item.className,
                        code: item.subjectName || 'Chưa phân loại',
                        teacher: item.teacherName,
                        status: finalStatus,
                        studentCount: item.studentCount || 0,
                        schedule: Array.isArray(item.schedules) ? item.schedules.join(', ') : 'Chưa có lịch',
                        salary: item.salaryPerSession,
                        permission: item.permission,
                        createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : 'Unknown'
                    };
                });
                setClasses(mappedData);
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách lớp hỗ trợ:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, [user?.taId, user?.id, user?.token]);

    const handleOpenViewModal = (classData) => {
        setViewClass(classData);
    };

    // Filter logic
    const filteredClasses = useMemo(() => {
        return classes.filter(cls => {
            const matchesSearch = 
                cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cls.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (cls.teacher || '').toLowerCase().includes(searchQuery.toLowerCase());

            // Handle status filtering
            let matchesFilter = true;
            if (filterStatus === 'all') {
                // TAs see everything in "All" tab
                matchesFilter = true;
            } else {
                matchesFilter = cls.status === filterStatus;
            }

            return matchesSearch && matchesFilter;
        });
    }, [searchQuery, filterStatus, classes]);

    return (
        <>
        <div className="w-full mx-auto animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 !mb-12">
                <div className="space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-text-main font-['Outfit'] tracking-tight flex items-center gap-3">
                        <Icon icon="material-symbols:handshake-rounded" className="text-primary" />
                        Danh sách lớp hỗ trợ
                    </h1>
                    <p className="text-text-muted font-medium !ml-1">
                        Quản lý các lớp học bạn đang làm trợ giảng.
                    </p>
                </div>
            </div>

            {/* Filter Section */}
            <div className="!my-2">
                <ClassListFilter
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    filterStatus={filterStatus}
                    onFilterChange={setFilterStatus}
                    showUpcoming={true}
                />
            </div>

            {/* Class Grid */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center !p-20 text-primary">
                    <Icon icon="solar:spinner-linear" className="animate-spin text-5xl mb-4" />
                    <span className="font-medium text-text-muted">Đang tải danh sách lớp học...</span>
                </div>
            ) : filteredClasses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up">
                    {filteredClasses.map((cls) => (
                        <ClassCard 
                            key={cls.id} 
                            classData={cls} 
                            onViewDetails={() => handleOpenViewModal(cls)}
                            basePath="/assisted-classes"
                            showProgress={false}
                            salary={cls.salary}
                            permission={cls.permission}
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
                        Thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn các bộ lọc để xem toàn bộ danh sách lớp học hỗ trợ của bạn.
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearchQuery('');
                            setFilterStatus('all');
                        }}
                        className='!px-6 !py-2 !border'
                    >
                        Xóa bộ lọc
                    </Button>
                </div>
            )}
        </div>

        <ClassDetailsModal
            isOpen={!!viewClass}
            onClose={() => setViewClass(null)}
            classData={viewClass}
        />
    </>
    );
};

export default TAClassListPage;
