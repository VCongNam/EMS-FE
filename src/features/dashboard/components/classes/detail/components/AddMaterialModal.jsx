import React, { useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import useAuthStore from '../../../../../../store/authStore';
import learningMaterialService from '../../../../api/learningMaterialService';

const AddMaterialModal = ({ isOpen, onClose, classId, onSuccess }) => {
    const { user } = useAuthStore();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files]);
        // Reset value to allow selecting same file again
        e.target.value = '';
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error('Vui lòng nhập tiêu đề tài liệu');
            return;
        }
        if (selectedFiles.length === 0) {
            toast.error('Vui lòng chọn ít nhất một tệp tin');
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('ClassId', classId);
            formData.append('Title', title);
            formData.append('Description', description);
            
            selectedFiles.forEach(file => {
                formData.append('Attachments', file);
            });

            const res = await learningMaterialService.createMaterial(formData, user?.token);
            
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Không thể tải lên tài liệu');
            }

            toast.success('Tải lên tài liệu thành công!');
            onSuccess();
            onClose();
            // Reset form
            setTitle('');
            setDescription('');
            setSelectedFiles([]);
        } catch (error) {
            console.error('Error uploading material:', error);
            toast.error(error.message || 'Có lỗi xảy ra khi tải lên tài liệu');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center !p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="relative bg-surface w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-zoom-in border border-border">
                {/* Header */}
                <div className="!p-6 border-b border-border bg-background/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Icon icon="material-symbols:upload-rounded" className="text-2xl" />
                        </div>
                        <h2 className="text-xl font-black text-text-main tracking-tight">Tải lên tài liệu</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-background rounded-full text-text-muted transition-colors"
                    >
                        <Icon icon="material-symbols:close-rounded" className="text-2xl" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="!p-6 space-y-6">
                    <div className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-xs font-black text-text-muted uppercase tracking-widest !mb-2 ml-1">
                                Tiêu đề tài liệu <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ví dụ: Bài giảng tuần 1, Slide chương 2..."
                                className="w-full bg-background border border-border rounded-xl !py-3 !px-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-black text-text-muted uppercase tracking-widest !mb-2 ml-1">
                                Mô tả ngắn (Tùy chọn)
                            </label>
                            <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Ghi chú thêm về bộ tài liệu này..."
                                rows="3"
                                className="w-full bg-background border border-border rounded-xl !py-3 !px-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none"
                            ></textarea>
                        </div>

                        {/* File Upload */}
                        <div>
                            <label className="block text-xs font-black text-text-muted uppercase tracking-widest !mb-2 ml-1">
                                Tệp tin đính kèm <span className="text-red-500">*</span>
                            </label>
                            
                            <div className="space-y-3">
                                {selectedFiles.length > 0 && (
                                    <div className="max-h-40 overflow-y-auto space-y-2 !mb-4 custom-scrollbar">
                                        {selectedFiles.map((file, idx) => (
                                            <div key={idx} className="flex items-center justify-between !p-2 bg-background border border-border rounded-xl text-sm group hover:border-primary/30 transition-all">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <Icon icon="material-symbols:description-outline-rounded" className="text-primary text-lg flex-shrink-0" />
                                                    <span className="truncate font-medium text-text-main">{file.name}</span>
                                                    <span className="text-[10px] text-text-muted flex-shrink-0">({(file.size / 1024).toFixed(0)} KB)</span>
                                                </div>
                                                <button 
                                                    type="button"
                                                    onClick={() => removeFile(idx)}
                                                    className="p-1.5 hover:bg-red-50 text-text-muted hover:text-red-500 rounded-lg transition-colors"
                                                >
                                                    <Icon icon="material-symbols:close-rounded" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <button 
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full !py-4 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all text-text-muted group"
                                >
                                    <Icon icon="material-symbols:add-rounded" className="text-3xl group-hover:scale-125 transition-transform" />
                                    <span className="text-xs font-bold uppercase tracking-widest group-hover:text-primary">Chọn tệp từ máy tính</span>
                                </button>
                                <input 
                                    type="file" 
                                    multiple 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex gap-3 pt-2">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="flex-1 !py-3 rounded-xl border border-border font-bold text-text-main hover:bg-background transition-colors"
                        >
                            Hủy bỏ
                        </button>
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 !py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Icon icon="line-md:loading-twotone-loop" className="text-xl" />
                                    Đang tải lên...
                                </>
                            ) : (
                                <>
                                    Tải lên ngay
                                    <Icon icon="material-symbols:send-rounded" className="text-xl" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMaterialModal;
