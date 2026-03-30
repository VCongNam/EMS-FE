import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import Button from "../../../../../components/ui/Button";
import AddStudentModal from './components/AddStudentModal';
import useAuthStore from '../../../../../store/authStore';
import TAPermissionsModal from './components/TAPermissionsModal';
import { classService } from '../../../api/classService';

const ClassPeoplePage = () => {
    const { classId } = useParams();
    const { user } = useAuthStore();
    const isTeacherOrTA = ['TEACHER', 'TA'].includes(user?.role?.toUpperCase());
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isCurrentUserTA = user?.role?.toUpperCase() === 'TA';

    // Dummy data for Teachers and TAs
    const staff = [
        { id: 'TCH001', name: 'PGS.TS Trần Văn Giáo Viên', role: 'Giáo viên', email: 'teacher@fpt.edu.vn', type: 'TEACHER' },
        { id: 'TA001', name: user?.fullName || 'Nguyễn Trợ Giảng', role: 'Trợ giảng', email: user?.email || 'ta@fpt.edu.vn', type: 'TA' },
    ];

    const [members, setMembers] = useState([]);

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
                        parentName: m.parentName || 'Chưa cập nhật',
                        phone: m.parentPhone || 'Chưa cập nhật',
                        enrolledDate: m.enrolledDate,
                        status: m.status?.toLowerCase() || 'active',
                        attendance: 100 // Mock vì API hiện tại chưa nhả attendance
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
        fetchMembers();
    }, [classId]);

    const filteredMembers = members.filter(member => {
        const matchesSearch =
            member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleAddStudent = () => {
        fetchMembers();
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up">
            {/* Cột trái (25%) */}
            <div className="md:col-span-1 space-y-6">
                {/* Thông tin lớp & Actions */}
                <div className="bg-surface rounded-2xl  border border-border !p-5 shadow-sm">
                    <div className="flex items-center !gap-4 !mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
                            <Icon icon="solar:users-group-two-rounded-bold-duotone" className="text-2xl" />
                        </div>
                        <div>
                            <h2 className="font-bold text-text-main text-[17px]">Mọi người</h2>
                            <span className="text-xs font-semibold !px-2 !py-0.5 bg-primary/10 text-primary rounded-md border border-primary/20">Sĩ số: {filteredMembers.length}</span>
                        </div>
                    </div>
                    <p className="text-sm text-text-muted !mb-4">Quản lý danh sách học viên trong lớp</p>
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
                                <Button variant="outline" className="w-full !py-2.5 bg-surface hover:bg-background flex justify-center items-center">
                                    <Icon icon="solar:download-square-bold-duotone" className="text-lg !mr-2 text-text-muted" />
                                    Xuất danh sách
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Bộ lọc */}
                <div className="bg-surface !mt-2 rounded-2xl border border-border !p-5 shadow-sm">
                    <h3 className="font-bold text-text-main text-sm !mb-3">Tìm kiếm & Lọc</h3>
                    <div className="space-y-3">
                        <div className="relative !mb-2">
                            <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-base" />
                            <input
                                type="text"
                                placeholder="Tên, Mã HS, Email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full !pl-9 !pr-3 !py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm text-text-main placeholder:text-text-muted/70"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main">
                                    <Icon icon="solar:close-circle-bold" className="text-sm" />
                                </button>
                            )}
                        </div>
                        <div className="relative flex items-center">
                            <Icon icon="solar:filter-bold-duotone" className="absolute left-3 text-text-muted text-base pointer-events-none" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full !pl-9 !pr-8 !py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium text-text-main appearance-none cursor-pointer"
                            >
                                <option value="all">Tất cả tình trạng</option>
                                <option value="active">Tốt</option>
                                <option value="warning">Cần chú ý</option>
                                <option value="danger">Báo động</option>
                            </select>
                            <Icon icon="solar:alt-arrow-down-linear" className="absolute right-3 text-text-muted text-base pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Cột chính (75%) */}
            <div className="md:col-span-3 space-y-8">
                {/* Giảng viên & Trợ giảng */}
                <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="!px-6 !py-4 border-b border-border bg-background/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Icon icon="solar:user-id-bold-duotone" className="text-2xl text-primary" />
                            <h2 className="text-lg font-bold text-text-main">Giáo viên & Trợ giảng</h2>
                        </div>
                    </div>
                    <div className="!p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {staff.map((p) => (
                            <div key={p.id} className="border border-border rounded-xl !p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/30 transition-colors bg-background">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${
                                        p.type === 'TEACHER' ? 'bg-blue-500/10 text-blue-600' : 'bg-green-500/10 text-green-600'
                                    }`}>
                                        {p.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-text-main group-hover:text-primary transition-colors">{p.name}</h3>
                                        <p className="text-sm text-text-muted">{p.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 self-start sm:self-center">
                                    <span className={`text-xs font-semibold !px-2.5 !py-1 rounded-md border shrink-0 ${
                                        p.type === 'TEACHER' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 'bg-green-500/10 text-green-600 border-green-500/20'
                                    }`}>
                                        {p.role}
                                    </span>
                                    {p.type === 'TA' && user?.role?.toUpperCase() === 'TA' && (
                                        <button 
                                            onClick={() => setIsPermissionsModalOpen(true)}
                                            className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 !px-3 !py-1.5 rounded-lg transition-colors border border-primary/20 shrink-0 flex items-center gap-1.5"
                                        >
                                            <Icon icon="solar:shield-check-bold" /> Quyền hạn
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Học sinh */}
                <div className="flex items-center gap-3 !mt-2 !px-2">
                    <Icon icon="solar:users-group-two-rounded-bold-duotone" className="text-2xl text-primary" />
                    <h2 className="text-lg font-bold text-text-main">Học sinh ({filteredMembers.length})</h2>
                </div>

                {/* Desktop Table (Hidden on smaller screens, but left column might stack on top) */}
                <div className="hidden lg:block bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="bg-background/80 border-b border-border">
                                    <th className="!p-4 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap">Học sinh</th>
                                    <th className="!p-4 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap">Thông tin</th>
                                    <th className="!p-4 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap text-center">Tỷ lệ đi học</th>
                                    <th className="!p-4 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap text-center">Tình trạng</th>
                                    {isTeacherOrTA && <th className="!p-4 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap text-right w-[100px]">Thao tác</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {filteredMembers.map((member) => (
                                    <tr key={member.id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="!p-4 text-text-main">
                                            <div className="flex items-center !gap-3 w-max">
                                                <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-sm uppercase shrink-0">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-sm">{member.name}</span>
                                                    <span className="text-[11px] text-text-muted font-mono">{member.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="!p-4">
                                            <div className="flex flex-col !gap-1">
                                                <span className="flex items-center !gap-1.5 text-xs text-text-main"><Icon icon="solar:letter-linear" className="text-primary" /> <span className="truncate max-w-[120px]">{member.email}</span></span>
                                                <span className="flex items-center !gap-1.5 text-[11px] text-text-muted"><Icon icon="solar:phone-linear" className="text-primary" /> {member.phone}</span>
                                            </div>
                                        </td>
                                        <td className="!p-4 text-center">
                                            <div className="flex flex-col items-center justify-center !gap-1">
                                                <span className={`text-xs font-bold ${member.attendance >= 90 ? 'text-green-600' : member.attendance >= 80 ? 'text-orange-500' : 'text-red-600'}`}>
                                                    {member.attendance}%
                                                </span>
                                                <div className="w-16 h-1 bg-background rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full ${member.attendance >= 90 ? 'bg-green-500' : member.attendance >= 80 ? 'bg-orange-500' : 'bg-red-500'}`}
                                                        style={{ width: `${member.attendance}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="!p-4 text-center">
                                            <div className="flex justify-center">
                                                {member.status === 'active' && <span className="inline-flex items-center !px-2.5 !py-0.5 rounded-md text-[11px] font-semibold bg-green-500/10 text-green-600 border border-green-500/20 whitespace-nowrap">Tốt</span>}
                                                {member.status === 'warning' && <span className="inline-flex items-center !px-2.5 !py-0.5 rounded-md text-[11px] font-semibold bg-orange-500/10 text-orange-600 border border-orange-500/20 whitespace-nowrap">Cần chú ý</span>}
                                                {member.status === 'danger' && <span className="inline-flex items-center !px-2.5 !py-0.5 rounded-md text-[11px] font-semibold bg-red-500/10 text-red-600 border border-red-500/20 whitespace-nowrap">Báo động</span>}
                                            </div>
                                        </td>
                                        {isTeacherOrTA && (
                                        <td className="!p-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                                                <button className="!p-1.5 text-text-muted hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-500/10" title="Chi tiết học tập">
                                                    <Icon icon="solar:chart-2-bold-duotone" className="text-lg" />
                                                </button>
                                                <button className="!p-1.5 text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-primary/10" title="Gửi thông báo">
                                                    <Icon icon="solar:bell-bold-duotone" className="text-lg" />
                                                </button>
                                                <button className="!p-1.5 text-text-muted hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10" title="Xóa khỏi lớp">
                                                    <Icon icon="solar:trash-bin-trash-bold-duotone" className="text-lg" />
                                                </button>
                                            </div>
                                        </td>
                                        )}
                                    </tr>
                                ))}
                                {filteredMembers.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="!p-12 text-center">
                                            <div className="flex flex-col items-center justify-center opacity-70">
                                                <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center !mb-3 border border-border">
                                                    <Icon icon="solar:ghost-smile-bold-duotone" className="text-3xl text-text-muted" />
                                                </div>
                                                <h3 className="text-base font-bold text-text-main !mb-1">Không tìm thấy dữ liệu</h3>
                                                <p className="text-sm text-text-muted font-medium">Hãy thử điều chỉnh lại bộ lọc.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {filteredMembers.length > 0 && (
                        <div className="!p-4 border-t border-border bg-background/30 flex items-center justify-between">
                            <span className="text-[13px] font-medium text-text-muted">Trang 1 / 1</span>
                            <div className="flex !gap-1.5">
                                <Button variant="outline" className="!px-2.5 !py-1.5" disabled><Icon icon="solar:alt-arrow-left-linear" /></Button>
                                <Button variant="outline" className="!px-2.5 !py-1.5" disabled><Icon icon="solar:alt-arrow-right-linear" /></Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile/Tablet Card List */}
                <div className="lg:hidden space-y-3">
                    {filteredMembers.length === 0 ? (
                        <div className="bg-surface rounded-2xl border border-border !p-10 text-center">
                            <div className="flex flex-col items-center justify-center opacity-70">
                                <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center !mb-3 border border-border">
                                    <Icon icon="solar:ghost-smile-bold-duotone" className="text-3xl text-text-muted" />
                                </div>
                                <h3 className="text-base font-bold text-text-main !mb-1">Không tìm thấy dữ liệu</h3>
                                <p className="text-text-muted text-sm font-medium">Hãy thử điều chỉnh lại bộ lọc.</p>
                            </div>
                        </div>
                    ) : (
                        filteredMembers.map((member) => (
                            <div key={member.id} className="bg-surface rounded-2xl border border-border shadow-sm !p-4 flex flex-col gap-3">
                                {/* Top row: avatar + name + status */}
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-11 h-11 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-base uppercase shrink-0">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-sm text-text-main truncate">{member.name}</p>
                                            <p className="text-xs font-mono text-text-muted">{member.id}</p>
                                        </div>
                                    </div>
                                    {member.status === 'active' && <span className="shrink-0 inline-flex items-center !px-2 !py-0.5 rounded-md text-[11px] font-semibold bg-green-500/10 text-green-600 border border-green-500/20">Tốt</span>}
                                    {member.status === 'warning' && <span className="shrink-0 inline-flex items-center !px-2 !py-0.5 rounded-md text-[11px] font-semibold bg-orange-500/10 text-orange-600 border border-orange-500/20">Cần chú ý</span>}
                                    {member.status === 'danger' && <span className="shrink-0 inline-flex items-center !px-2 !py-0.5 rounded-md text-[11px] font-semibold bg-red-500/10 text-red-600 border border-red-500/20">Báo động</span>}
                                </div>

                                {/* Info rows */}
                                <div className="bg-background rounded-xl !p-3 space-y-2 border border-border/50">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-2 text-[13px] text-text-muted">
                                            <Icon icon="solar:letter-linear" className="shrink-0 text-primary text-base" />
                                            <span className="truncate">{member.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[13px] text-text-muted">
                                            <Icon icon="solar:phone-linear" className="shrink-0 text-primary text-base" />
                                            <span>{member.phone || 'Chưa cập nhật'}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="h-px w-full bg-border/50 my-1 justify-center align-middle"></div>
                                    
                                    <div className="flex flex-col gap-1.5 mt-2">
                                        <div className="flex items-center justify-between text-[13px]">
                                            <span className="text-text-muted flex items-center gap-1.5">
                                                <Icon icon="solar:chart-square-linear" className="text-primary text-base" />
                                                Tỷ lệ đi học
                                            </span>
                                            <span className={`font-bold ${member.attendance >= 90 ? 'text-green-600' : member.attendance >= 80 ? 'text-orange-500' : 'text-red-600'}`}>
                                                {member.attendance}%
                                            </span>
                                        </div>
                                        <div className="w-full h-1 bg-surface rounded-full overflow-hidden border border-border/50">
                                            <div 
                                                className={`h-full rounded-full ${member.attendance >= 90 ? 'bg-green-500' : member.attendance >= 80 ? 'bg-orange-500' : 'bg-red-500'}`}
                                                style={{ width: `${member.attendance}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                {isTeacherOrTA && (
                                <div className="flex gap-2">
                                    <button className="flex-1 flex items-center justify-center gap-1.5 !py-2 text-xs font-semibold text-blue-600 bg-blue-500/10 hover:bg-blue-500/20 rounded-xl transition-colors">
                                        <Icon icon="solar:chart-2-bold-duotone" className="text-base" /> Tiến độ
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-1.5 !py-2 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors">
                                        <Icon icon="solar:bell-bold-duotone" className="text-base" /> TB
                                    </button>
                                    <button className="flex-1 flex items-center justify-center gap-1.5 !py-2 text-xs font-semibold text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors">
                                        <Icon icon="solar:trash-bin-trash-bold-duotone" className="text-base" /> Xóa
                                    </button>
                                </div>
                                )}
                            </div>
                        ))
                    )}
                    {/* Pagination mobile */}
                    {filteredMembers.length > 0 && (
                        <div className="!pt-2 flex items-center justify-between">
                            <span className="text-xs font-medium text-text-muted">Trang 1 / 1</span>
                            <div className="flex gap-2">
                                <Button variant="outline" className="!px-2.5 !py-1.5" disabled><Icon icon="solar:alt-arrow-left-linear" /></Button>
                                <Button variant="outline" className="!px-2.5 !py-1.5" disabled><Icon icon="solar:alt-arrow-right-linear" /></Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <AddStudentModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddStudent}
                classId={classId}
            />

            <TAPermissionsModal 
                isOpen={isPermissionsModalOpen} 
                onClose={() => setIsPermissionsModalOpen(false)} 
            />
        </div>
    );
};

export default ClassPeoplePage;
