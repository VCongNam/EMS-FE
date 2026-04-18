import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import Button from "../../../../../components/ui/Button";
import ConfirmModal from '../../../../../components/ui/ConfirmModal';
import AddStudentModal from './components/AddStudentModal';
import ImportStudentModal from './components/ImportStudentModal';
import useAuthStore from '../../../../../store/authStore';
import TAPermissionsModal from './components/TAPermissionsModal';
import { classService } from '../../../api/classService';
import Pagination from '../../../../../components/ui/Pagination';

const ClassPeoplePage = () => {
    const { classId } = useParams();
    const { user } = useAuthStore();
    const isTeacherOrTA = ['TEACHER', 'TA'].includes(user?.role?.toUpperCase());
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Confirm Modal State
    const [confirmConfig, setConfirmConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        type: 'danger'
    });

    const isCurrentUserTA = user?.role?.toUpperCase() === 'TA';

    const [staff, setStaff] = useState([]);
    const [members, setMembers] = useState([]);
    const [isStaffExpanded, setIsStaffExpanded] = useState(false);

    const fetchStaff = async () => {
        if (!classId) return;
        const token = user?.token;
        try {
            const res = await classService.getClassStaff(classId, token);
            if (res.ok) {
                const data = await res.json();
                const formattedStaff = data.map(s => ({
                    id: s.userId,
                    name: s.fullName,
                    email: s.email,
                    avatarUrl: s.avatarUrl,
                    role: s.role === 'Teacher' ? 'Giáo viên' : 'Trợ giảng',
                    type: s.role?.toUpperCase() === 'TEACHER' ? 'TEACHER' : 'TA'
                }));
                setStaff(formattedStaff);
            }
        } catch (err) {
            console.error("Lỗi fetch staff:", err);
        }
    };

    const fetchMembers = async () => {
        if (!classId) return;
        const token = useAuthStore.getState().user?.token;
        try {
            setIsLoading(true);
            const res = await classService.getClassMembers(classId, token);
            if (res.ok) {
                const data = await res.json();
                if (data.data) {
                    const formattedMembers = data.data.map((m) => ({
                        id: m.studentID,
                        name: m.fullName || 'Chưa cập nhật',
                        email: m.email || 'Chưa cập nhật',
                        phone: m.phoneNumber || 'Chưa cập nhật',
                        enrolledDate: m.enrolledDate || 'Chưa có',
                        status: m.status || 'Active'
                    }));
                    setMembers(formattedMembers);
                }
            } else {
                console.error("Failed to fetch class members");
            }
        } catch (err) {
            console.error("Lỗi fetch API lớp:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
        fetchMembers();
    }, [classId, user?.token]);

    // Reset to page 1 when search or filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter]);

    const handleRemoveStudent = (studentId) => {
        setConfirmConfig({
            isOpen: true,
            title: 'Xóa khỏi lớp',
            message: 'Bạn có chắc chắn muốn đẩy học sinh này ra khỏi lớp? Học sinh sẽ chuyển sang trạng thái "Đã nghỉ".',
            type: 'danger',
            onConfirm: async () => {
                const token = useAuthStore.getState().user?.token;
                try {
                    const res = await classService.removeStudentFromClass(classId, studentId, token);
                    if (res.ok) {
                        toast.success('Đã đẩy học sinh ra khỏi lớp thành công.');
                        fetchMembers();
                    } else {
                        toast.error('Có lỗi xảy ra khi thực hiện thao tác.');
                    }
                } catch (err) {
                    console.error(err);
                    toast.error('Lỗi hệ thống.');
                }
                setConfirmConfig(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleRestoreStudent = (studentId) => {
        setConfirmConfig({
            isOpen: true,
            title: 'Khôi phục trạng thái',
            message: 'Bạn có chắc chắn muốn khôi phục trạng thái học sinh này về "Đang theo học"?',
            type: 'info',
            onConfirm: async () => {
                const token = useAuthStore.getState().user?.token;
                try {
                    const res = await classService.restoreStudentToClass(classId, studentId, token);
                    if (res.ok) {
                        toast.success('Đã khôi phục trạng thái học sinh thành công.');
                        fetchMembers();
                    } else {
                        toast.error('Có lỗi xảy ra khi thực hiện thao tác.');
                    }
                } catch (err) {
                    console.error(err);
                    toast.error('Lỗi hệ thống.');
                }
                setConfirmConfig(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const filteredMembers = members.filter(member => {
        const matchesSearch =
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Pagination logic
    const paginatedMembers = React.useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return filteredMembers.slice(indexOfFirstItem, indexOfLastItem);
    }, [filteredMembers, currentPage, itemsPerPage]);

    const handleAddStudent = () => {
        fetchMembers();
    };

    const teachers = staff.filter(s => s.type === 'TEACHER');
    const assistants = staff.filter(s => s.type === 'TA');

    // Logic for rendering TAs based on expanded state
    const visibleAssistants = isStaffExpanded ? assistants : assistants.slice(0, 1);
    const hiddenTAsCount = assistants.length - visibleAssistants.length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up">
            {/* Cột trái (25%) */}
            <div className="md:col-span-1 space-y-6">
                <div className="bg-surface rounded-2xl border border-border !p-5 shadow-sm">
                    <div className="flex items-center !gap-4 !mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
                            <Icon icon="solar:users-group-two-rounded-bold-duotone" className="text-2xl" />
                        </div>
                        <div>
                            <h2 className="font-bold text-text-main text-[17px]">Mọi người</h2>
                            <span className="text-xs font-semibold !px-2 !py-0.5 bg-primary/10 text-primary rounded-md border border-primary/20">Sĩ số: {filteredMembers.length}</span>
                        </div>
                    </div>
                    {isTeacherOrTA && <p className="text-sm text-text-muted !mb-4">Quản lý danh sách học viên trong lớp</p>}
                    <div className="flex flex-col !gap-2.5">
                        {isTeacherOrTA && (
                            <>
                                <Button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="w-full shadow-primary/30 shadow-lg !py-2.5 !text-primary flex justify-center items-center"
                                >
                                    <Icon icon="solar:user-plus-bold-duotone" className="text-lg !mr-2" />
                                    Thêm học sinh
                                </Button>
                                <Button
                                    onClick={() => setIsImportModalOpen(true)}
                                    variant="outline"
                                    className="w-full !py-2.5 bg-surface hover:bg-primary/5 flex justify-center items-center !text-primary border-primary/20 hover:border-primary/50"
                                >
                                    <Icon icon="solar:document-add-bold-duotone" className="text-lg !mr-2" />
                                    Thêm bằng danh sách
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <div className="bg-surface !mt-2 rounded-2xl border border-border !p-5 shadow-sm">
                    <h3 className="font-bold text-text-main text-sm !mb-3">Tìm kiếm & Lọc</h3>
                    <div className="space-y-3">
                        <div className="relative !mb-2">
                            <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-base" />
                            <input
                                type="text"
                                placeholder="Tên, Email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full !pl-9 !pr-3 !py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm text-text-main placeholder:text-text-muted/70"
                            />
                        </div>
                        <div className="relative flex items-center">
                            <Icon icon="solar:filter-bold-duotone" className="absolute left-3 text-text-muted text-base pointer-events-none" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full !pl-9 !pr-8 !py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium text-text-main appearance-none cursor-pointer"
                            >
                                <option value="all">Tất cả tình trạng</option>
                                <option value="Active">Đang theo học</option>
                                <option value="Dropped">Đã nghỉ</option>
                            </select>
                            <Icon icon="solar:alt-arrow-down-linear" className="absolute right-3 text-text-muted text-base pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Cột chính (75%) */}
            <div className="md:col-span-3 space-y-8">
                <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="!px-6 !py-4 border-b border-border bg-background/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Icon icon="solar:user-id-bold-duotone" className="text-2xl text-primary" />
                            <h2 className="text-lg font-bold text-text-main">Giáo viên & Trợ giảng</h2>
                        </div>
                        {assistants.length > 1 && (
                            <button
                                onClick={() => setIsStaffExpanded(!isStaffExpanded)}
                                className="text-sm font-bold text-primary flex items-center gap-1.5 hover:underline"
                            >
                                <Icon icon={isStaffExpanded ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"} />
                                {isStaffExpanded ? 'Thu gọn' : `Xem thêm (${assistants.length - 1} trợ giảng)`}
                            </button>
                        )}
                    </div>
                    <div className="!p-4 grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-300">
                        {/* Always show teachers */}
                        {teachers.map((p) => (
                            <div key={p.id} className="border border-border rounded-xl !p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/30 transition-colors bg-background">
                                <div className="flex items-center gap-3 text-nowrap min-w-0">
                                    {p.avatarUrl ? (
                                        <img src={p.avatarUrl} alt={p.name} className="w-12 h-12 rounded-full object-cover shrink-0 border border-border" />
                                    ) : (
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 bg-blue-500/10 text-blue-600`}>
                                            {p.name.charAt(0)}
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-text-main group-hover:text-primary transition-colors truncate">{p.name}</h3>
                                        <p className="text-xs text-text-muted truncate">{p.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider !px-2.5 !py-1 rounded-md border bg-blue-500/10 text-blue-600 border-blue-500/20`}>
                                        {p.role}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {/* Visible TAs */}
                        {visibleAssistants.map((p) => (
                            <div key={p.id} className="border border-border rounded-xl !p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/30 transition-colors bg-background">
                                <div className="flex items-center gap-3 text-nowrap min-w-0">
                                    {p.avatarUrl ? (
                                        <img src={p.avatarUrl} alt={p.name} className="w-12 h-12 rounded-full object-cover shrink-0 border border-border" />
                                    ) : (
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 bg-green-500/10 text-green-600`}>
                                            {p.name.charAt(0)}
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-text-main group-hover:text-primary transition-colors truncate">{p.name}</h3>
                                        <p className="text-xs text-text-muted truncate">{p.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider !px-2.5 !py-1 rounded-md border bg-green-500/10 text-green-600 border-green-500/20`}>
                                        {p.role}
                                    </span>
                                    {p.type === 'TA' && user?.role?.toUpperCase() === 'TA' && (
                                        <button
                                            onClick={() => setIsPermissionsModalOpen(true)}
                                            className="text-[10px] font-bold text-primary bg-primary/10 hover:bg-primary/20 !px-2 !py-1 rounded-lg transition-colors border border-primary/20 shrink-0 flex items-center gap-1"
                                        >
                                            <Icon icon="solar:shield-check-bold" /> Quyền
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Show more indicator card inside the grid if not expanded and there are hidden TAs */}
                        {!isStaffExpanded && hiddenTAsCount > 0 && (
                            <button
                                onClick={() => setIsStaffExpanded(true)}
                                className="border-2 border-dashed border-primary/20 rounded-xl !p-4 flex items-center justify-center gap-3 hover:bg-primary/5 hover:border-primary/40 transition-all bg-background group"
                            >
                                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
                                    +{hiddenTAsCount}
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-primary text-sm">Xem thêm trợ giảng</p>
                                    <p className="text-[10px] text-text-muted italic">Tiết kiệm không gian hiển thị</p>
                                </div>
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3 !mt-2 !px-2">
                    <Icon icon="solar:users-group-two-rounded-bold-duotone" className="text-2xl text-primary" />
                    <h2 className="text-lg font-bold text-text-main">Học sinh ({filteredMembers.length})</h2>
                </div>

                <div className="hidden lg:block bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="bg-background/80 border-b border-border">
                                    <th className="!p-4 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap">Học sinh</th>
                                    {isTeacherOrTA && <th className="!p-4 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap">Thông tin</th>}
                                    {isTeacherOrTA && (
                                        <>
                                            <th className="!p-4 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap text-center">Ngày nhập học</th>
                                            <th className="!p-4 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap text-center">Tình trạng</th>
                                        </>
                                    )}
                                    {isTeacherOrTA && <th className="!p-4 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap text-right w-[100px]">Thao tác</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {paginatedMembers.map((member) => (
                                    <tr
                                        key={member.id}
                                        className={`transition-all duration-300 group ${member.status === 'Active'
                                                ? 'hover:bg-primary/5'
                                                : 'opacity-60 grayscale-[0.6] bg-gray-50/50 grayscale'
                                            }`}
                                    >
                                        <td className="!p-4 text-text-main">
                                            <div className="flex items-center !gap-3 w-max">
                                                <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-sm uppercase shrink-0">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-sm">{member.name}</span>
                                                </div>
                                            </div>
                                        </td>
                                        {isTeacherOrTA && (
                                            <td className="!p-4">
                                                <div className="flex flex-col !gap-1 text-xs">
                                                    <span className="flex items-center !gap-1.5 text-text-main">
                                                        <Icon icon="solar:letter-linear" className="text-primary" />
                                                        <span className="truncate max-w-[150px]">{member.email}</span>
                                                    </span>
                                                    <span className="flex items-center !gap-1.5 text-text-muted">
                                                        <Icon icon="solar:phone-linear" className="text-primary" />
                                                        {member.phone}
                                                    </span>
                                                </div>
                                            </td>
                                        )}
                                        {isTeacherOrTA && (
                                            <>
                                                <td className="!p-4 text-center">
                                                    <span className="text-xs font-medium text-text-main">
                                                        {member.enrolledDate !== 'Chưa có' ? new Date(member.enrolledDate).toLocaleDateString('vi-VN') : 'Chưa có'}
                                                    </span>
                                                </td>
                                                <td className="!p-4 text-center">
                                                    <div className="flex justify-center">
                                                        {member.status === 'Active' ? (
                                                            <span className="inline-flex items-center !px-2.5 !py-0.5 rounded-md text-[11px] font-semibold bg-green-500/10 text-green-600 border border-green-500/20 whitespace-nowrap">Đang theo học</span>
                                                        ) : (
                                                            <span className="inline-flex items-center !px-2.5 !py-0.5 rounded-md text-[11px] font-semibold bg-red-500/10 text-red-600 border border-red-500/20 whitespace-nowrap">Đã nghỉ</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                        {isTeacherOrTA && (
                                            <td className="!p-4 text-right">
                                                <div className={`flex items-center justify-end gap-1 transition-opacity ${member.status === 'Active' ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>

                                                    {member.status === 'Active' ? (
                                                        <button
                                                            onClick={() => handleRemoveStudent(member.id)}
                                                            className="!p-1.5 text-text-muted hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10"
                                                            title="Xóa khỏi lớp"
                                                        >
                                                            <Icon icon="solar:trash-bin-trash-bold-duotone" className="text-lg" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleRestoreStudent(member.id)}
                                                            className="!p-1.5 text-green-600 hover:text-green-700 transition-colors rounded-lg bg-green-500/10"
                                                            title="Khôi phục trạng thái"
                                                        >
                                                            <Icon icon="solar:refresh-bold-duotone" className="text-lg" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="lg:hidden space-y-3">
                    {paginatedMembers.map((member) => (
                        <div
                            key={member.id}
                            className={`bg-surface rounded-2xl border border-border shadow-sm !p-4 flex flex-col gap-3 transition-all duration-300 ${member.status === 'Active' ? '' : 'opacity-60 grayscale-[0.6] bg-gray-50/50'
                                }`}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-sm uppercase shrink-0">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-text-main truncate">{member.name}</p>
                                        <p className="text-[11px] text-text-muted">Nhập học: {member.enrolledDate !== 'Chưa có' ? new Date(member.enrolledDate).toLocaleDateString('vi-VN') : 'Chưa có'}</p>
                                    </div>
                                </div>
                                {member.status === 'Active' ? (
                                    <span className="inline-flex items-center !px-2 !py-0.5 rounded-md text-[10px] font-semibold bg-green-500/10 text-green-600 border border-green-500/20 whitespace-nowrap">Đang theo học</span>
                                ) : (
                                    <span className="inline-flex items-center !px-2 !py-0.5 rounded-md text-[10px] font-semibold bg-red-500/10 text-red-600 border border-red-500/20 whitespace-nowrap">Đã nghỉ</span>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-text-muted">
                                <div className="flex items-center gap-1.5">
                                    <Icon icon="solar:letter-linear" className="text-primary" />
                                    <span className="truncate">{member.email}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Icon icon="solar:phone-linear" className="text-primary" />
                                    <span>{member.phone}</span>
                                </div>
                            </div>
                            {isTeacherOrTA && (
                                <div className="flex gap-2 !mt-2">
                                    <button className="flex-1 !py-2 bg-background hover:bg-border/20 rounded-xl text-xs font-bold text-text-muted flex justify-center items-center gap-2 transition-colors">
                                        <Icon icon="solar:chart-2-bold-duotone" /> Tiến độ
                                    </button>
                                    {member.status === 'Active' ? (
                                        <button onClick={() => handleRemoveStudent(member.id)} className="flex-1 !py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-bold flex justify-center items-center gap-2 transition-colors border border-red-100">
                                            <Icon icon="solar:trash-bin-trash-bold-duotone" /> Xóa
                                        </button>
                                    ) : (
                                        <button onClick={() => handleRestoreStudent(member.id)} className="flex-1 !py-2 bg-green-600 text-white hover:bg-green-700 rounded-xl text-xs font-bold flex justify-center items-center gap-2 transition-colors border border-green-600">
                                            <Icon icon="solar:refresh-bold-duotone" /> Khôi phục
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Pagination component for both mobile/desktop */}
                {filteredMembers.length > itemsPerPage && (
                    <Pagination
                        totalItems={filteredMembers.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div>

            <AddStudentModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddStudent}
                classId={classId}
            />

            <ImportStudentModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImportSuccess={fetchMembers}
                classId={classId}
            />

            <TAPermissionsModal
                isOpen={isPermissionsModalOpen}
                onClose={() => setIsPermissionsModalOpen(false)}
            />

            <ConfirmModal
                isOpen={confirmConfig.isOpen}
                onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmConfig.onConfirm}
                title={confirmConfig.title}
                message={confirmConfig.message}
                type={confirmConfig.type}
                confirmText="Xác nhận"
                cancelText="Hủy"
            />
        </div>
    );
};

export default ClassPeoplePage;
