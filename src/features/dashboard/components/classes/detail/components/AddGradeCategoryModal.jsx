import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import useAuthStore from '../../../../../../store/authStore';
import { gradebookService } from '../../../../api/gradebookService';

const AddGradeCategoryModal = ({ isOpen, onClose, classId, onSuccess }) => {
    const { user } = useAuthStore();
    const [name, setName] = useState('');
    const [weight, setWeight] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error('Vui lòng nhập tên hạng mục');
            return;
        }

        const weightValue = parseFloat(weight);
        if (isNaN(weightValue) || weightValue <= 0) {
            toast.error('Trọng số phải lớn hơn 0');
            return;
        }

        try {
            setIsSubmitting(true);
            const payload = {
                name: name.trim(),
                weight: weightValue
            };

            const res = await gradebookService.addGradeCategory(classId, payload, user?.token);
            
            if (res.ok) {
                toast.success('Đã thêm hạng mục mới thành công!');
                setName('');
                setWeight('');
                if (onSuccess) {
                    const result = await res.json();
                    onSuccess(result.data || result);
                }
                onClose();
            } else {
                const result = await res.json();
                toast.error(result.message || result.error || 'Có lỗi xảy ra khi thêm hạng mục');
            }
        } catch (error) {
            console.error('Add category error:', error);
            toast.error('Lỗi kết nối đến máy chủ');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center !p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="relative bg-surface w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-zoom-in border border-border">
                {/* Header */}
                <div className="!p-6 border-b border-border bg-background/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Icon icon="material-symbols:add-circle-outline-rounded" className="text-2xl" />
                        </div>
                        <h2 className="text-xl font-black text-text-main tracking-tight">Thêm hạng mục điểm</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-background rounded-full text-text-muted transition-colors"
                    >
                        <Icon icon="material-symbols:close-rounded" className="text-2xl" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="!p-6 space-y-5">
                    <div>
                        <label className="block text-xs font-black text-text-muted uppercase tracking-widest !mb-2 ml-1">
                            Tên hạng mục <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="VD: Bài tập về nhà, Thi Cuối Kỳ..."
                            className="w-full bg-background border border-border rounded-xl !py-3 !px-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black text-text-muted uppercase tracking-widest !mb-2 ml-1">
                            Trọng số (%) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input 
                                type="number"
                                step="0.01"
                                min="0"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                placeholder="VD: 20"
                                className="w-full bg-background border border-border rounded-xl !py-3 !px-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                                required
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted font-bold">%</span>
                        </div>
                        <p className="text-[10px] text-text-muted mt-2 italic ml-1 leading-relaxed">
                            Lưu ý: Tổng trọng số các hạng mục trong lớp phải bằng 100%.
                        </p>
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
                                <Icon icon="line-md:loading-twotone-loop" className="text-xl" />
                            ) : (
                                <>
                                    Thêm ngay
                                    <Icon icon="material-symbols:add-rounded" className="text-xl" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddGradeCategoryModal;
