import React, { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import Button from '../../../components/ui/Button';
import ClassCard from '../components/classes/ClassCard';
import ClassListFilter from '../components/classes/ClassListFilter';
import { mockClasses } from '../data/mockClasses';

const StudentClassListPage = () => {
    // In a real app, this would fetch only the classes the student is enrolled in
    const [mockClassesData] = useState(mockClasses);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Filter logic
    const filteredClasses = useMemo(() => {
        return mockClassesData.filter(cls => {
            const matchesSearch = cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cls.code.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesFilter = filterStatus === 'all' ? cls.status !== 'archived' : cls.status === filterStatus;

            return matchesSearch && matchesFilter;
        });
    }, [searchQuery, filterStatus, mockClassesData]);

    return (
        <div className="w-full mx-auto animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 !mb-12">
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
            <div className="!my-2">
                <ClassListFilter
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    filterStatus={filterStatus}
                    onFilterChange={setFilterStatus}
                />
            </div>

            {/* Class Grid */}
            {filteredClasses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up">
                    {filteredClasses.map((cls) => (
                        <ClassCard 
                            key={cls.id} 
                            classData={cls} 
                            // Only passing the basePath, omitting onEdit, onDelete, etc., 
                            // so the card operates in view-only mode for students.
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
    );
};

export default StudentClassListPage;
