import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import useAuthStore from '../../../store/authStore';
import { taService } from '../api/taService';
import AddTAModal from '../components/AddTAModal';
import EditTAPermissionModal from '../components/EditTAPermissionModal';
import ConfirmModal from '../../../components/ui/ConfirmModal';

const ViewTAListPage = ({ classId }) => {
    const { user } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [assistants, setAssistants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedAssistant, setSelectedAssistant] = useState(null);

    // Confirm Modal State
    const [confirmConfig, setConfirmConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        type: 'danger'
    });

    const fetchAssistants = async () => {
        if (!classId || !user?.token) return;
        try {
            setIsLoading(true);
            const res = await taService.getTAListByClass(classId, user.token);
            if (res.ok) {
                const data = await res.json();
                // Ensure data is an array
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
    }, [classId, user?.token]);

    const handleRemoveTA = (ta) => {
        setConfirmConfig({
            isOpen: true,
            title: 'Gỡ trợ giảng',
            message: `Bạn có chắc chắn muốn gỡ trợ giảng ${ta.fullName} khỏi lớp học này? Trạng thái sẽ chuyển thành "Đã nghỉ".`,
            type: 'danger',
            onConfirm: async () => {
                try {
                    const res = await taService.removeTAFromClass(classId, ta.taid, user.token);
                    if (res.ok) {
                        toast.success('Đã gỡ trợ giảng khỏi lớp thành công.');
                        fetchAssistants();
                    } else {
                        toast.error('Có lỗi xảy ra khi thực hiện thao tác.');
                    }
                } catch (error) {
                    console.error(error);
                    toast.error('Lỗi hệ thống.');
                }
                setConfirmConfig(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleRestoreTA = (ta) => {
        setConfirmConfig({
            isOpen: true,
            title: 'Khôi phục trợ giảng',
            message: `Bạn có chắc chắn muốn khôi phục trợ giảng ${ta.fullName} vào lớp học này?`,
            type: 'info',
            onConfirm: async () => {
                try {
                    // Reuse assignTAToClass API as requested
                    const payload = {
                        taid: ta.taid,
                        permission: ta.permission || 'Attendance', // Default or existing
                        salaryPerSession: ta.salaryPerSession || 0
                    };
                    const res = await taService.assignTAToClass(classId, payload, user.token);
                    if (res.ok) {
                        toast.success('Đã khôi phục trợ giảng thành công.');
                        fetchAssistants();
                    } else {
                        const errorData = await res.json();
                        toast.error(errorData.message || 'Có lỗi xảy ra khi thực hiện thao tác.');
                    }
                } catch (error) {
                    console.error(error);
                    toast.error('Lỗi hệ thống.');
                }
                setConfirmConfig(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const filteredAssistants = assistants.filter(assistant => {
        const matchesSearch =
            (assistant.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (assistant.taid || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (assistant.email || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    return (
        <div className="w-full !mx-auto !space-y-6 animate-fade-in !pb-8">

            {/* Header / Actions */}
            <div className="bg-surface !p-4 sm:!p-6 rounded-[2rem] border border-border shadow-sm !space-y-4">
                
                <div className="flex flex-col sm:flex-row items-center !gap-4">
                    <div className="relative w-full sm:flex-1">
                        <Icon icon="solar:magnifer-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo Tên, Mã TG, Email..."
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
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="!flex !items-center !gap-2 !px-6 !py-3 !bg-primary !text-white !rounded-xl !font-bold !shadow-lg !shadow-primary/20 hover:!bg-primary-hover !transition-all shrink-0"
                    >
                        <Icon icon="solar:user-plus-bold-duotone" className="text-xl" />
                        <span className="hidden sm:inline">Thêm trợ giảng</span>
                    </button>
                </div>
                <div className="!pt-2 flex items-center justify-between text-sm">
                    <span className="text-text-muted font-medium">
                        Tổng số: <strong className="text-primary">{filteredAssistants.length}</strong> trợ giảng
                    </span>
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-background/80 border-b border-border">
                                <th className="!p-5 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap">Tên Trợ giảng</th>
                                <th className="!p-5 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap">Quyền hiện tại</th>
                                <th className="!p-5 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap text-center">Lương / Buổi</th>
                                <th className="!p-5 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap text-center">Tình trạng</th>
                                <th className="!p-5 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="!p-10 text-center text-primary">
                                        <Icon icon="solar:spinner-linear" className="animate-spin text-3xl mx-auto mb-2" />
                                        <p className="font-medium">Đang tải...</p>
                                    </td>
                                </tr>
                            ) : filteredAssistants.map((assistant) => (
                                <tr 
                                    key={assistant.taid} 
                                    className={`transition-all duration-300 group ${
                                        assistant.status === 'Active' 
                                        ? 'hover:bg-primary/5' 
                                        : 'opacity-60 grayscale-[0.6] bg-gray-50/50 grayscale'
                                    }`}
                                >
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
                                        {assistant.permission ? (
                                            <span className="!px-3 !py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-semibold shadow-sm">{assistant.permission}</span>
                                        ) : (
                                            <span className="text-text-muted text-sm italic">Chưa phân quyền</span>
                                        )}
                                    </td>
                                    <td className="!p-5 text-center">
                                        <span className="font-bold text-green-600">{assistant.salaryPerSession ? assistant.salaryPerSession.toLocaleString('vi-VN') + ' đ' : 'N/A'}</span>
                                    </td>
                                    <td className="!p-5 text-center">
                                        <div className="flex justify-center">
                                            {assistant.status === 'Active' ? (
                                                <span className="inline-flex items-center !px-2.5 !py-0.5 rounded-md text-[11px] font-semibold bg-green-500/10 text-green-600 border border-green-500/20 whitespace-nowrap">Đang hỗ trợ</span>
                                            ) : (
                                                <span className="inline-flex items-center !px-2.5 !py-0.5 rounded-md text-[11px] font-semibold bg-red-500/10 text-red-600 border border-red-500/20 whitespace-nowrap">Đã nghỉ</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="!p-5 text-right">
                                        <div className={`flex items-center justify-end gap-1 transition-opacity ${assistant.status === 'Active' ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                                            {assistant.status === 'Active' && (
                                                <button 
                                                    onClick={() => {
                                                        setSelectedAssistant({...assistant, classId});
                                                        setIsEditModalOpen(true);
                                                    }}
                                                    className="!p-1.5 text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-primary/10" 
                                                    title="Chỉnh sửa quyền & lương"
                                                >
                                                    <Icon icon="solar:pen-bold-duotone" className="text-lg" />
                                                </button>
                                            )}
                                            {assistant.status === 'Active' ? (
                                                <button 
                                                    onClick={() => handleRemoveTA(assistant)}
                                                    className="!p-1.5 text-text-muted hover:text-red-500 transition-colors rounded-lg hover:bg-red-500/10" 
                                                    title="Gỡ khỏi lớp"
                                                >
                                                    <Icon icon="solar:trash-bin-trash-bold-duotone" className="text-lg" />
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => handleRestoreTA(assistant)}
                                                    className="!p-1.5 text-green-600 hover:text-green-700 transition-colors rounded-lg bg-green-500/10" 
                                                    title="Khôi phục trợ giảng"
                                                >
                                                    <Icon icon="solar:refresh-bold-duotone" className="text-lg" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!isLoading && filteredAssistants.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="!p-16 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-70">
                                            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center !mb-4 border border-border">
                                                <Icon icon="solar:ghost-smile-bold-duotone" className="text-4xl text-text-muted" />
                                            </div>
                                            <h3 className="text-lg font-bold text-text-main !mb-1">Lớp chưa có trợ giảng nào</h3>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden !space-y-3">
                {!isLoading && filteredAssistants.length === 0 ? (
                    <div className="bg-surface rounded-3xl border border-border !p-12 text-center">
                        <div className="flex flex-col items-center justify-center opacity-70">
                            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center !mb-4 border border-border">
                                <Icon icon="solar:ghost-smile-bold-duotone" className="text-4xl text-text-muted" />
                            </div>
                            <h3 className="text-lg font-bold text-text-main !mb-1">Chưa có trợ giảng</h3>
                        </div>
                    </div>
                ) : (
                    filteredAssistants.map((assistant) => (
                        <div 
                            key={assistant.taid} 
                            className={`bg-surface rounded-2xl border border-border shadow-sm !p-4 flex flex-col !gap-3 transition-all duration-300 ${
                                assistant.status === 'Active' ? '' : 'opacity-60 grayscale-[0.6] bg-gray-50/50'
                            }`}
                        >
                            <div className="flex items-center justify-between !gap-3">
                                <div className="flex items-center !gap-3 min-w-0">
                                    <div className="w-11 h-11 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-base uppercase shrink-0">
                                        {assistant.fullName ? assistant.fullName.charAt(0) : '?'}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-text-main truncate">{assistant.fullName}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {assistant.status === 'Active' ? (
                                                <span className="inline-flex items-center !px-2 !py-0.5 rounded-md text-[10px] font-semibold bg-green-500/10 text-green-600 border border-green-500/20">Đang hỗ trợ</span>
                                            ) : (
                                                <span className="inline-flex items-center !px-2 !py-0.5 rounded-md text-[10px] font-semibold bg-red-500/10 text-red-600 border border-red-500/20">Đã nghỉ</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {assistant.status === 'Active' && (
                                        <button 
                                            onClick={() => {
                                                setSelectedAssistant({...assistant, classId});
                                                setIsEditModalOpen(true);
                                            }}
                                            className="!p-2 text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors"
                                        >
                                            <Icon icon="solar:pen-bold-duotone" className="text-lg" />
                                        </button>
                                    )}
                                    {assistant.status === 'Active' ? (
                                        <button 
                                            onClick={() => handleRemoveTA(assistant)}
                                            className="!p-2 text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors"
                                        >
                                            <Icon icon="solar:trash-bin-trash-bold-duotone" className="text-lg" />
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleRestoreTA(assistant)}
                                            className="!p-2 text-green-600 bg-green-500/10 hover:bg-green-500/20 rounded-xl transition-colors"
                                        >
                                            <Icon icon="solar:refresh-bold-duotone" className="text-lg" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="bg-background rounded-xl !p-3 !space-y-2 border border-border/50">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-text-muted">Quyền hạn:</span>
                                    <span className="font-semibold text-primary">{assistant.permission || 'Chưa phân quyền'}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-text-muted">Lương/Buổi:</span>
                                    <span className="font-bold text-green-600">{assistant.salaryPerSession ? assistant.salaryPerSession.toLocaleString('vi-VN') + ' đ' : 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <AddTAModal 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={fetchAssistants}
                classId={classId}
            />

            <EditTAPermissionModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                assistant={selectedAssistant}
                onUpdate={fetchAssistants}
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

export default ViewTAListPage;
