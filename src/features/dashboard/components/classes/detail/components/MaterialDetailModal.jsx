import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import useAuthStore from '../../../../../../store/authStore';
import learningMaterialService from '../../../../api/learningMaterialService';

const MaterialDetailModal = ({ isOpen, onClose, materialId }) => {
    const { user } = useAuthStore();
    const [material, setMaterial] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!materialId || !isOpen) return;
            setLoading(true);
            try {
                const res = await learningMaterialService.getMaterialById(materialId, user?.token);
                if (res.ok) {
                    const data = await res.json();
                    setMaterial(data);
                } else {
                    throw new Error('Không thể tải chi tiết tài liệu');
                }
            } catch (error) {
                console.error('Error fetching material detail:', error);
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [materialId, isOpen]);

    if (!isOpen) return null;
    
    return createPortal(
        <div className="fixed inset-0 z-[9999] flex justify-end">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[4px]" onClick={onClose}></div>
            
            <div className="relative bg-surface w-full max-w-xl h-screen shadow-2xl flex flex-col animate-slide-in-right border-l border-border rounded-l-[2rem] pointer-events-auto">

                {/* Header */}
                <div className="!p-6 border-b border-border bg-background/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Icon icon="material-symbols:description-outline-rounded" className="text-2xl" />
                        </div>
                        <h2 className="text-xl font-black text-text-main tracking-tight line-clamp-1">Chi tiết tài liệu</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-background rounded-full text-text-muted transition-colors"
                    >
                        <Icon icon="material-symbols:close-rounded" className="text-2xl" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 !p-6 space-y-6 overflow-y-auto px-7 custom-scrollbar">
                    {loading ? (
                        <div className="space-y-4 animate-pulse">
                            <div className="h-8 bg-background rounded-xl w-3/4"></div>
                            <div className="h-24 bg-background rounded-xl w-full"></div>
                            <div className="h-32 bg-background rounded-xl w-full"></div>
                        </div>
                    ) : material ? (
                        <div className="space-y-6">
                            {/* Title & Info */}
                            <div>
                                <h3 className="text-2xl font-black text-text-main !mb-2">{material.title}</h3>
                                <div className="flex flex-wrap gap-4 text-sm font-medium text-text-muted">
                                    <div className="flex items-center gap-1.5">
                                        <Icon icon="material-symbols:person-outline-rounded" className="text-lg" />
                                        <span>Đăng bởi {material.authorName}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Icon icon="material-symbols:calendar-today-outline-rounded" className="text-lg" />
                                        <span>{new Date(material.createdAt).toLocaleString('vi-VN')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            {material.description && (
                                <div className="bg-background rounded-2xl !p-5 border border-border">
                                    <h4 className="text-xs font-black text-text-muted uppercase tracking-widest !mb-3">Mô tả</h4>
                                    <p className="text-text-main leading-relaxed whitespace-pre-wrap">
                                        {material.description}
                                    </p>
                                </div>
                            )}

                            {/* Attachments */}
                            <div>
                                <h4 className="text-xs font-black text-text-muted uppercase tracking-widest !mb-4 ml-1">
                                    Danh sách tệp tin ({material.attachments?.length || 0})
                                </h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {material.attachments?.map((file) => (
                                        <div 
                                            key={file.attachmentId} 
                                            className="flex items-center justify-between !p-4 bg-background border border-border rounded-2xl hover:border-primary/30 transition-all group"
                                        >
                                            <div className="flex items-center gap-4 min-w-0">
                                                <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-primary border border-border group-hover:bg-white transition-colors">
                                                    <Icon icon="material-symbols:description-outline-rounded" className="text-2xl" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-text-main truncate group-hover:text-primary transition-colors" title={file.fileName}>
                                                        {file.fileName}
                                                    </p>
                                                    <p className="text-xs text-text-muted font-medium">
                                                        {(file.fileSize / 1024 / 1024).toFixed(2)} MB • {file.fileType?.split('/')[1]?.toUpperCase()}
                                                    </p>
                                                </div>
                                            </div>
                                            <a 
                                                href={file.fileUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all shrink-0 hover:scale-110 active:scale-95"
                                                title="Tải xuống"
                                            >
                                                <Icon icon="material-symbols:download-rounded" className="text-xl" />
                                            </a>
                                        </div>
                                    ))}
                                    {(!material.attachments || material.attachments.length === 0) && (
                                        <div className="text-center !py-8 text-text-muted font-medium bg-background rounded-2xl border border-dashed border-border opacity-60">
                                            Không có tệp đính kèm
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center !py-10 text-text-muted">
                            Không tìm thấy dữ liệu tài liệu
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="!p-6 border-t border-border bg-background/50 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="!px-8 !py-3 rounded-xl bg-surface border border-border font-bold text-text-main hover:bg-background transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default MaterialDetailModal;

