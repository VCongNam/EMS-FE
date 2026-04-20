import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import useAuthStore from '../../../store/authStore';
import { taService } from '../api/taService';
import EditTAPermissionModal from '../components/EditTAPermissionModal';

const PERMISSION_MAP = {
    'Attendance': 'Điểm danh',
    'Grade': 'Chấm điểm',
    'Report': 'Báo cáo',
    'Assignment': 'Bài tập',
    'Permission': 'Toàn quyền',
    'None': 'Mặc định'
};

const getPermissionLabel = (perm) => {
    return PERMISSION_MAP[perm.trim()] || perm.trim();
};

const GlobalTAManagementPage = () => {
    const { user } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [assistants, setAssistants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAssistant, setSelectedAssistant] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchAssistants = async () => {
        if (!user?.token) return;
        try {
            setIsLoading(true);
            const res = await taService.getMyTas(user.token);

            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    setAssistants(data);
                } else if (data && Array.isArray(data.data)) {
                    setAssistants(data.data);
                } else {
                    setAssistants([]);
                }
            } else {
                toast.error('Không thể tải danh sách trợ giảng');
            }
        } catch (error) {
            console.error(error);
            toast.error('Lỗi kết nối máy chủ');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAssistants();
    }, [user?.token]);

    const filteredAssistants = assistants.filter(assistant => {
        const query = searchQuery.toLowerCase();
        return (
            (assistant.fullName || '').toLowerCase().includes(query) ||
            (assistant.email || '').toLowerCase().includes(query) ||
            (assistant.className || '').toLowerCase().includes(query)
        );
    });

    return (
        <div className="w-full !space-y-6 animate-fade-in !pb-8 !p-6 bg-surface rounded-2xl shadow-sm border border-border mt-2">
            
            {/* Header Section */}

            <div className="bg-background !p-4 sm:!p-6 rounded-[2rem] border border-border shadow-sm !space-y-4">
                 <div className="flex items-center !gap-4 !mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
                                    <Icon icon="solar:users-group-rounded-bold-duotone" className="text-3xl" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-text-main font-['Outfit']">Quản lý trợ giảng</h1>
                                    <p className="text-sm text-text-muted mt-0.5">Điều chỉnh danh sách, phân quyền cấu hình và giao việc cho trợ giảng</p>
                                </div>
                            </div>
                <div className="flex flex-col sm:flex-row items-center !gap-4">
                    <div className="relative w-full sm:flex-1">
                        <Icon icon="solar:magnifer-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo Tên, Lớp, Email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full !pl-11 !pr-4 !py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-text-main"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main">
                                <Icon icon="solar:close-circle-bold" className="text-lg" />
                            </button>
                        )}
                    </div>
                </div>
                <div className="!pt-2 flex items-center justify-between text-sm">
                    <span className="text-text-muted font-medium">
                        Tổng số: <strong className="text-primary">{filteredAssistants.length}</strong> trợ giảng
                    </span>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-background rounded-3xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-surface/80 border-b border-border">
                                <th className="!p-5 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap">Tên Trợ giảng</th>
                                <th className="!p-5 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap">Lớp hỗ trợ</th>
                                <th className="!p-5 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap">Liên hệ</th>
                                <th className="!p-5 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap">Quyền hiện tại</th>
                                <th className="!p-5 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap text-center">Lương / Buổi</th>
                                <th className="!p-5 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 bg-surface">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="!p-10 text-center text-primary">
                                        <Icon icon="solar:spinner-linear" className="animate-spin text-3xl mx-auto mb-2" />
                                        <p className="font-medium">Đang tải danh sách...</p>
                                    </td>
                                </tr>
                            ) : filteredAssistants.map((assistant, index) => (
                                <tr key={assistant.classTaId || index} className="hover:bg-primary/5 transition-colors group">
                                    <td className="!p-5 text-text-main">
                                        <div className="flex items-center !gap-3 w-max">
                                            <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-sm uppercase shrink-0">
                                                {assistant.fullName ? assistant.fullName.charAt(0) : '?'}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-[15px]">{assistant.fullName}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="!p-5">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-primary">{assistant.className || 'Chưa rõ'}</span>
                                        </div>
                                    </td>
                                    <td className="!p-5">
                                        <span className="text-sm font-medium text-text-main flex items-center gap-1.5">
                                            <Icon icon="solar:phone-linear" className="text-primary text-xs" />
                                            {assistant.phoneNumber || 'Chưa cập nhật'}
                                        </span>
                                    </td>
                                    <td className="!p-5">
                                        {assistant.permission ? (
                                            <div className="flex flex-wrap gap-1">
                                                {assistant.permission.split(',').map((p, i) => (
                                                    <span key={i} className="!px-2 !py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-md text-[10px] font-bold shadow-sm whitespace-nowrap">
                                                        {getPermissionLabel(p)}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-text-muted text-xs italic">Mặc định</span>
                                        )}
                                    </td>
                                    <td className="!p-5 text-center">
                                        <span className="font-bold text-emerald-600 text-sm">
                                            {assistant.salaryPerSession ? assistant.salaryPerSession.toLocaleString('vi-VN') + ' đ' : '0 đ'}
                                        </span>
                                    </td>
                                    <td className="!p-5 text-right">
                                        <button 
                                            onClick={() => {
                                                setSelectedAssistant(assistant);
                                                setIsEditModalOpen(true);
                                            }}
                                            className="!p-2 !rounded-lg !bg-amber-50 !text-amber-600 hover:!bg-amber-600 hover:!text-white transition-all shadow-sm border border-amber-100"
                                            title="Sửa quyền hạn"
                                        >
                                            <Icon icon="solar:shield-keyhole-minimalistic-bold-duotone" className="text-xl" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {!isLoading && filteredAssistants.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="!p-16 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-70">
                                            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center !mb-4 border border-border">
                                                <Icon icon="solar:ghost-smile-bold-duotone" className="text-4xl text-text-muted" />
                                            </div>
                                            <h3 className="text-lg font-bold text-text-main !mb-1">Chưa có trợ giảng nào</h3>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile View */}
            <div className="md:hidden !space-y-4">
                {filteredAssistants.map((assistant, index) => (
                    <div key={assistant.classTaId || index} className="bg-background rounded-2xl border border-border shadow-sm !p-4 flex flex-col !gap-3">
                        <div className="flex items-center justify-between !gap-3">
                            <div className="flex items-center !gap-3 min-w-0">
                                <div className="w-11 h-11 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-base uppercase shrink-0">
                                    {assistant.fullName ? assistant.fullName.charAt(0) : '?'}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-text-main truncate text-sm">{assistant.fullName}</p>
                                    <p className="text-xs text-text-muted truncate">{assistant.email || 'N/A'}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => {
                                    setSelectedAssistant(assistant);
                                    setIsEditModalOpen(true);
                                }}
                                className="!p-2 !rounded-lg !bg-amber-50 !text-amber-600 shadow-sm border border-amber-100"
                            >
                                <Icon icon="solar:shield-keyhole-minimalistic-bold-duotone" className="text-lg" />
                            </button>
                        </div>
                        <div className="bg-surface rounded-xl !p-3 !space-y-2 border border-border/50">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-text-muted">Lớp:</span>
                                <span className="font-bold text-primary truncate max-w-[150px]">{assistant.className || 'Chưa rõ'}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-text-muted">Quyền hạn:</span>
                                <span className="font-semibold text-primary">
                                    {assistant.permission 
                                        ? assistant.permission.split(',').map(p => getPermissionLabel(p)).join(', ') 
                                        : 'Mặc định'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-text-muted">Lương/Buổi:</span>
                                <span className="font-bold text-emerald-600">{assistant.salaryPerSession ? assistant.salaryPerSession.toLocaleString('vi-VN') + ' đ' : '0 đ'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {isEditModalOpen && (
                <EditTAPermissionModal 
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    assistant={selectedAssistant}
                    onUpdate={fetchAssistants}
                />
            )}
        </div>
    );
};

export default GlobalTAManagementPage;
