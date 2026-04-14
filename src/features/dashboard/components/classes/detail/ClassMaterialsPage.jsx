import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuthStore from '../../../../../store/authStore';
import learningMaterialService from '../../../api/learningMaterialService';
import AddMaterialModal from './components/AddMaterialModal';
import MaterialDetailModal from './components/MaterialDetailModal';
import ConfirmModal from '../../../../../components/ui/ConfirmModal';

const getFileIcon = (type, attachments) => {
    // If multiple attachments, use folder icon
    if (attachments && attachments.length > 1) {
        return <Icon icon="solar:folder-with-files-bold-duotone" className="text-4xl text-amber-500" />;
    }
    
    const t = type?.toLowerCase() || attachments?.[0]?.fileType?.toLowerCase() || '';
    if (t.includes('pdf')) return <Icon icon="solar:file-text-bold-duotone" className="text-4xl text-red-500" />;
    if (t.includes('ppt') || t.includes('powerpoint')) return <Icon icon="solar:presentation-graph-bold-duotone" className="text-4xl text-orange-500" />;
    if (t.includes('doc') || t.includes('word')) return <Icon icon="solar:document-bold-duotone" className="text-4xl text-blue-500" />;
    if (t.includes('video') || t.includes('mp4')) return <Icon icon="solar:videocamera-record-bold-duotone" className="text-4xl text-purple-500" />;
    if (t.includes('image') || t.includes('png') || t.includes('jpg')) return <Icon icon="solar:gallery-bold-duotone" className="text-4xl text-emerald-500" />;
    return <Icon icon="solar:file-bold-duotone" className="text-4xl text-primary/40" />;
};

const ClassMaterialsPage = () => {
    const { classId } = useParams();
    const { user } = useAuthStore();
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedMaterialId, setSelectedMaterialId] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, materialId: null });
    
    // RBAC check
    const userRole = user?.role?.toUpperCase();
    const isTeacherOrTA = userRole === 'TEACHER' || userRole === 'TA';

    const fetchMaterials = useCallback(async () => {
        setLoading(true);
        try {
            const res = await learningMaterialService.getMaterialsByClass(classId, user?.token);
            if (res.ok) {
                const data = await res.json();
                setMaterials(data || []);
            } else {
                throw new Error('Không thể tải danh sách tài liệu');
            }
        } catch (error) {
            console.error('Error fetching materials:', error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }, [classId, user?.token]);

    useEffect(() => {
        fetchMaterials();
    }, [fetchMaterials]);

    const handleDeleteClick = (id) => {
        setConfirmModal({ isOpen: true, materialId: id });
    };

    const handleConfirmDelete = async () => {
        const id = confirmModal.materialId;
        if (!id) return;

        try {
            const res = await learningMaterialService.deleteMaterial(id, user?.token);
            if (res.ok) {
                toast.success('Đã xóa tài liệu');
                fetchMaterials();
            } else {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || 'Không thể xóa tài liệu');
            }
        } catch (error) {
            console.error('Error deleting material:', error);
            toast.error(error.message);
        } finally {
            setConfirmModal({ isOpen: false, materialId: null });
        }
    };

    const handleViewDetail = (id) => {
        setSelectedMaterialId(id);
        setIsDetailModalOpen(true);
    };

    const filteredMaterials = (materials || []).filter(m => 
        m.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header Section */}
            <div className="bg-white rounded-3xl border border-border !p-6 sm:!p-8 shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                        <Icon icon="material-symbols:book-rounded" className="text-3xl" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-text-main !mb-1 tracking-tight">Tài liệu học tập</h2>
                        <p className="text-text-muted text-sm font-medium">Quản lý và chia sẻ học liệu cho lớp học của bạn</p>
                    </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    <div className="relative w-full sm:w-80">
                        <Icon icon="material-symbols:search-rounded" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-xl" />
                        <input 
                            type="text" 
                            placeholder="Tìm nhanh tài liệu..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#F8FAFC] border border-border rounded-2xl !py-3 !pl-12 !pr-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-medium"
                        />
                    </div>
                    {isTeacherOrTA && (
                        <button 
                            onClick={() => setIsUploadModalOpen(true)}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 !bg-primary text-white font-black !px-6 !py-3 rounded-2xl hover:bg-primary-hover hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 whitespace-nowrap"
                        >
                            <Icon icon="material-symbols:cloud-upload-rounded" className="text-2xl" />
                            Tải lên
                        </button>
                    )}
                </div>
            </div>

            {/* List Section */}
            <div className="bg-white !mt-2 rounded-[2rem] border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#F8FAFC] border-b border-border">
                                <th className="!p-5 font-black text-text-muted text-[11px] uppercase tracking-widest">Tên tài liệu</th>
                                <th className="!p-5 font-black text-text-muted text-[11px] uppercase tracking-widest hidden sm:table-cell">Kích thước</th>
                                <th className="!p-5 font-black text-text-muted text-[11px] uppercase tracking-widest hidden md:table-cell">Người đăng</th>
                                <th className="!p-5 font-black text-text-muted text-[11px] uppercase tracking-widest">Ngày tải lên</th>
                                <th className="!p-5 font-black text-text-muted text-[11px] uppercase tracking-widest text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="!p-8">
                                            <div className="h-8 bg-background rounded-xl w-3/4"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredMaterials.length > 0 ? (
                                filteredMaterials.map((material) => (
                                    <tr key={material.materialId} className="group hover:bg-[#F8FAFC] transition-all">
                                        <td className="!p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center group-hover:bg-white transition-colors border border-transparent group-hover:border-border shadow-sm">
                                                    {getFileIcon(material.type, material.attachments)}
                                                </div>
                                                <div className="min-w-0">
                                                    <span 
                                                        onClick={() => handleViewDetail(material.materialId)}
                                                        className="block font-bold text-text-main group-hover:text-primary transition-colors cursor-pointer truncate max-w-sm" 
                                                        title={material.title}
                                                    >
                                                        {material.title}
                                                    </span>
                                                    <span className="text-[11px] text-text-muted font-medium line-clamp-1 opacity-70">
                                                        {material.description || 'Không có mô tả'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="!p-5 text-text-muted text-sm font-bold hidden sm:table-cell">
                                            {material.attachments && material.attachments.length > 0 ? (
                                                <span className="text-text-main">
                                                    {(material.attachments.reduce((acc, curr) => acc + (curr.fileSize || 0), 0) / 1024 / 1024).toFixed(2)} MB
                                                </span>
                                            ) : material.contentSize ? (
                                                <span className="text-text-main">
                                                    {(material.contentSize / 1024 / 1024).toFixed(2)} MB
                                                </span>
                                            ) : (
                                                <span className="opacity-30 italic font-medium text-xs">Phụ thuộc tệp đính kèm</span>
                                            )}
                                        </td>
                                        <td className="!p-5 hidden md:table-cell">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                    <Icon icon="material-symbols:person-rounded" className="text-xs" />
                                                </div>
                                                <span className="text-sm font-bold text-text-main opacity-80">{material.authorName}</span>
                                            </div>
                                        </td>
                                        <td className="!p-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-text-main">
                                                    {new Date(material.createdAt).toLocaleDateString('vi-VN')}
                                                </span>
                                                <span className="text-[10px] text-text-muted font-medium">
                                                    {new Date(material.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="!p-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => handleViewDetail(material.materialId)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-background text-text-muted hover:text-primary hover:bg-primary/10 transition-all border border-border hover:border-primary/30" 
                                                    title="Xem chi tiết & Tải xuống"
                                                >
                                                    <Icon icon="material-symbols:download-rounded" className="text-xl" />
                                                </button>
                                                {isTeacherOrTA && (
                                                    <button 
                                                        onClick={() => handleDeleteClick(material.materialId)}
                                                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-background text-text-muted hover:text-red-500 hover:bg-red-50 transition-all border border-border hover:border-red-500/30" 
                                                        title="Xóa"
                                                    >
                                                        <Icon icon="material-symbols:delete-outline-rounded" className="text-xl" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="!p-20 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4 opacity-40">
                                            <Icon icon="material-symbols:folder-open-outline-rounded" className="text-8xl" />
                                            <div>
                                                <p className="text-xl font-black tracking-tight">Thư mục trống</p>
                                                <p className="text-sm font-medium">Không tìm thấy tài liệu học tập nào ở đây.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Upload Modal */}
            <AddMaterialModal 
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                classId={classId}
                onSuccess={fetchMaterials}
            />

            {/* Detail Modal */}
            <MaterialDetailModal 
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                materialId={selectedMaterialId}
            />

            <ConfirmModal 
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, materialId: null })}
                onConfirm={handleConfirmDelete}
                title="Xác nhận xóa tài liệu"
                message="Bạn có chắc chắn muốn xóa tài liệu học tập này không? Hành động này không thể hoàn tác."
                confirmText="Xóa tài liệu"
                cancelText="Hủy bỏ"
                type="danger"
            />
        </div>
    );
};

export default ClassMaterialsPage;
