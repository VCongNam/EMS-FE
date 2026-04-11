import React, { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import Button from '../../../components/ui/Button';
import ClassCard from '../components/classes/ClassCard';
import ClassListFilter from '../components/classes/ClassListFilter';
import CreateClassModal from '../components/classes/CreateClassModal';
import ClassDetailsModal from '../components/classes/ClassDetailsModal';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { mockClasses } from '../data/mockClasses';
import { getApiUrl } from '../../../config/api';
import useAuthStore from '../../../store/authStore';
import { classService } from '../api/classService';

// Helper functions for formatting Data to API shapes
const parseDate = (dateStr) => {
    if (!dateStr) return null;
    return dateStr; // Trả về nguyên bản chuỗi YYYY-MM-DD cho C# System.DateOnly
};

const parseTime = (timeStr) => {
    if (!timeStr) return null;
    return timeStr + ":00"; // Nối thêm giây HH:mm:ss cho C# System.TimeOnly
};

const mapDaysToIso = (daysArr) => {
    // Mapping: Sunday=1, Monday=2, ..., Saturday=7 (Vietnamese convention)
    const map = { 'CN': 1, 'T2': 2, 'T3': 3, 'T4': 4, 'T5': 5, 'T6': 6, 'T7': 7 };
    return daysArr.map(d => map[d] !== undefined ? map[d] : 2); // Default to Monday if not found
};

const TeacherClassListPage = () => {
    // 1. Loại bỏ mockClasses cứng, sử dụng state rỗng ban đầu
    const [mockClassesData, setMockClassesData] = useState([]);
    const [loading, setLoading] = useState(true); // Trạng thái màn hình tải
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [viewClass, setViewClass] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', classId: null });

    // 2. Định nghĩa hàm Tải danh sách lớp thực tế từ Database thông qua Backend
    const fetchClasses = async () => {
        try {
            setLoading(true);
            const token = useAuthStore.getState().user?.token;
            if (!token) return;

            const [activeRes, archivedRes] = await Promise.all([
                classService.getTeacherDashboard(token),
                classService.getArchivedClasses(token)
            ]);

            if (!activeRes.ok) console.warn('Active classes failed: ', activeRes.status);
            if (!archivedRes.ok) console.warn('Archived classes failed: ', archivedRes.status);

            let activeData = [];
            let archivedData = [];

            try {
                if (activeRes.ok) activeData = await activeRes.json();
            } catch (e) {
                console.warn('Failed parsing active classes JSON', e);
            }
            try {
                if (archivedRes.ok) archivedData = await archivedRes.json();
            } catch (e) {
                console.warn('Failed parsing archived classes JSON', e);
            }

            // Trộn 2 mảng lại với nhau để filter xào nấu mượt mà
            const data = [...(Array.isArray(activeData) ? activeData : []), ...(Array.isArray(archivedData) ? archivedData : [])];

            // 3. Mapping cấu trúc Data thực tế về cấu trúc thẻ ClassCard hiển thị
            const mappedData = data.map(apiClass => {
                let mappedStatus = 'upcoming';
                const st = apiClass.status?.toLowerCase() || '';
                if (st.includes('scheduled')) mappedStatus = 'upcoming';
                if (st.includes('ongoing')) mappedStatus = 'ongoing';
                if (st.includes('completed')) mappedStatus = 'completed';
                if (st.includes('archived')) mappedStatus = 'archived';

                return {
                    id: apiClass.classId,
                    name: apiClass.className,
                    code: apiClass.room || 'N/A', // Lấy tạm room làm mã phụ
                    status: mappedStatus,
                    createdAt: apiClass.startDate || 'N/A',
                    schedule: 'Xem lịch chi tiết', // Backend chưa đổ detail schedules ra
                    students: {
                        count: 0, // Backend array ko chứa count người dùng
                        max: apiClass.maxStudents || 30
                    },
                    progress: {
                        currentSession: 0,
                        totalSessions: 10 // Mock progress tạm thời cho đẹp ui
                    }
                };
            });

            setMockClassesData(mappedData);
        } catch (error) {
            console.error("Lỗi lấy danh sách lớp:", error);
        } finally {
            setLoading(false);
        }
    };

    // 4. Cho phép tự động fetch lần đầu khi tải màn hình
    React.useEffect(() => {
        fetchClasses();
    }, []);

    const handleOpenCreateModal = () => {
        setSelectedClass(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (classData) => {
        setSelectedClass(classData);
        setIsModalOpen(true);
    };

    const handleOpenViewModal = (classData) => {
        setViewClass(classData);
    };

    const handleSaveClass = async (formData) => {
        // Mapping sang JSON Backend yêu cầu (dùng chung cho cả Tạo mới và Cập nhật)
        const payload = {
            className: formData.className,
            room: formData.room || "",
            startDate: parseDate(formData.startDate),
            tuitionFee: formData.tuitionFee ? parseInt(formData.tuitionFee) : 0,
            maxStudents: formData.maxCapacity ? parseInt(formData.maxCapacity) : 0,
            subjectName: formData.subject,
            gradeLevel: parseInt(formData.gradeLevel.replace(/\D/g, '')) || parseInt(formData.gradeLevel) || 0,
            schedules: formData.schedules && formData.schedules.length > 0
                ? formData.schedules.map(schedule => ({
                    dayOfWeek: mapDaysToIso([schedule.day])[0],
                    startTime: parseTime(schedule.startTime),
                    endTime: parseTime(schedule.endTime)
                }))
                : []
        };

        if (formData.endDate) {
            payload.endDate = parseDate(formData.endDate);
        }

        try {
            const token = useAuthStore.getState().user?.token;
            if (!token) return toast.error('Vui lòng đăng nhập lại!');

            if (selectedClass) {
                // Đang Edit lớp -> Gọi PUT API với biến URL {id}
                const response = await classService.updateClass(selectedClass.id, payload, token);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Update Class Error:', errorText);
                    throw new Error('Lỗi khi cập nhật lớp học. Backend có thể trả về lỗi 400 Bad Request!');
                }

                toast.success('Cập nhật thông tin lớp học thành công!');
            } else {
                // Cờ đang rỗng -> Gọi POST API tạo lớp mới tinh
                const response = await classService.createClass(payload, token);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Create Class Error:', errorText);
                    throw new Error(`Lỗi khi cắm Lớp Mới: ${errorText || response.statusText}`);
                }

                toast.success('Tạo lớp học thành công!');
            }

            setIsModalOpen(false);
            fetchClasses(); // Cập nhật lại danh sách màn hình ngay lập tức 
        } catch (error) {
            toast.error(error.message);
            console.error('Save Class Error:', error);
        }
    };

    const openConfirmArchive = (classId) => {
        setConfirmModal({ isOpen: true, type: 'archive', classId });
    };

    const openConfirmUnarchive = (classId) => {
        setConfirmModal({ isOpen: true, type: 'unarchive', classId });
    };

    const handleConfirmAction = async () => {
        const { type, classId } = confirmModal;
        if (!classId) return;

        try {
            const token = useAuthStore.getState().user?.token;
            if (!token) return toast.error('Vui lòng đăng nhập lại!');

            if (type === 'archive') {
                const res = await classService.archiveClass(classId, token);
                if (!res.ok) throw new Error('Không thể chuyển lớp học này sang trạng thái Lưu trữ!');
                toast.success('Đã đưa lớp học vào mục Lưu trữ thành công.');
            } else if (type === 'unarchive') {
                // Sửa thành API đường dẫn thực thế là /restore theo Swagger
                const res = await classService.restoreClass(classId, token);
                if (!res.ok) throw new Error('Cầu nối API khôi phục lớp học hiện Backend báo lỗi hoặc chưa hỗ trợ!');
                toast.success('Đã khôi phục lớp học thành công.');
            }

            // Xử lý UI sau khi thành công
            setConfirmModal({ isOpen: false, type: '', classId: null });
            fetchClasses(); // Gọi cục DB load lại List lớp mới ròi đổ ra màng hình

        } catch (error) {
            console.error('Lỗi khi thao tác lớp học:', error);
            toast.error(error.message);
            setConfirmModal({ isOpen: false, type: '', classId: null });
        }
    };

    const closeConfirmModal = () => {
        setConfirmModal({ isOpen: false, type: '', classId: null });
    };

    // Filter logic
    const filteredClasses = useMemo(() => {
        return mockClassesData.filter(cls => {
            const matchesSearch = cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cls.code.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesFilter = filterStatus === 'all' ? cls.status !== 'archived' : cls.status === filterStatus;

            return matchesSearch && matchesFilter;
        });
    }, [searchQuery, filterStatus, mockClassesData]);

    // Statistics
    const stats = {
        total: mockClassesData.filter(c => c.status !== 'archived').length,
        ongoing: mockClassesData.filter(c => c.status === 'ongoing').length,
        upcoming: mockClassesData.filter(c => c.status === 'upcoming').length,
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
                        <Button variant="outline" className="!px-6 !py-3 rounded-xl !border  shadow-md w-full sm:w-auto" onClick={handleOpenCreateModal}>
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
                        showUpcoming={true}
                    />
                </div>

                {/* Class Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center !py-20">
                        <Icon icon="material-symbols:sync-rounded" className="animate-spin text-5xl text-primary opacity-50 !mb-4" />
                        <p className="text-text-muted font-medium">Đang đồng bộ dữ liệu lớp học từ máy chủ...</p>
                    </div>
                ) : filteredClasses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up">
                        {filteredClasses.map((cls) => (
                            <ClassCard
                                key={cls.id}
                                classData={cls}
                                onEdit={() => handleOpenEditModal(cls)}
                                onViewDetails={() => handleOpenViewModal(cls)}
                                onArchive={() => openConfirmArchive(cls.id)}
                                onUnarchive={() => openConfirmUnarchive(cls.id)}
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

            <CreateClassModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={selectedClass}
                onSubmit={handleSaveClass}
            />

            <ClassDetailsModal
                isOpen={!!viewClass}
                onClose={() => setViewClass(null)}
                classData={viewClass}
                onEdit={(cls) => handleOpenEditModal(cls)}
            />

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirmModal}
                onConfirm={handleConfirmAction}
                title={confirmModal.type === 'archive' ? 'Xác nhận lưu trữ lớp học' : 'Xác nhận mở lại lớp học'}
                message={confirmModal.type === 'archive' ? 'Bạn có chắc chắn muốn lưu trữ lớp học này không? Lớp học sẽ được ẩn đi và chuyển sang thẻ Đã lưu trữ.' : 'Bạn có chắc chắn muốn bỏ lưu trữ và mở lại lớp học này không?'}
                confirmText="Đồng ý"
                cancelText="Hủy"
                type={confirmModal.type === 'archive' ? 'warning' : 'info'}
            />
        </>
    );
};

export default TeacherClassListPage;
