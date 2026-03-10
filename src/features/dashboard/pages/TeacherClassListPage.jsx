import React, { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import Button from '../../../components/ui/Button';
import ClassCard from '../components/classes/ClassCard';
import ClassListFilter from '../components/classes/ClassListFilter';
import CreateClassModal from '../components/classes/CreateClassModal';
import { mockClasses } from '../data/mockClasses';

const TeacherClassListPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Filter logic
    const filteredClasses = useMemo(() => {
        return mockClasses.filter(cls => {
            const matchesSearch = cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cls.code.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesFilter = filterStatus === 'all' || cls.status === filterStatus;

            return matchesSearch && matchesFilter;
        });
    }, [searchQuery, filterStatus]);

    // Statistics
    const stats = {
        total: mockClasses.length,
        ongoing: mockClasses.filter(c => c.status === 'ongoing').length,
        upcoming: mockClasses.filter(c => c.status === 'upcoming').length,
    };

    return (
        <>
        <div className="w-full mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 !mb-12">
                <div className="space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-text-main font-['Outfit'] tracking-tight flex items-center gap-3">
                        Danh sách lớp học
                    </h1>
                    <p className="text-text-muted font-medium !ml-1">
                        Quản lý các lớp học bạn đang phụ trách giảng dạy.
                    </p>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" className="!px-6 !py-3 rounded-xl shadow-md w-full sm:w-auto" onClick={() => setIsModalOpen(true)}>
                        <Icon icon="material-symbols:add-circle-rounded" className="text-xl" />
                        Tạo lớp học mới
                    </Button>
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
                        <ClassCard key={cls.id} classData={cls} />
                    ))}
                </div>
            ) : (
                <div className="bg-surface rounded-2xl border border-border !p-12 text-center shadow-sm">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto !mb-6">
                        <Icon icon="material-symbols:search-off-rounded" className="text-5xl text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-text-main !mb-2">Không tìm thấy lớp học nào</h3>
                    <p className="text-text-muted max-w-md mx-auto !mb-6">
                        Thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn các bộ lọc để xem toàn bộ danh sách lớp học của bạn.
                    </p>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setSearchQuery('');
                            setFilterStatus('all');
                        }}
                    >
                        Xóa bộ lọc
                    </Button>
                </div>
            )}
        </div>

        <CreateClassModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
    );
};

export default TeacherClassListPage;
