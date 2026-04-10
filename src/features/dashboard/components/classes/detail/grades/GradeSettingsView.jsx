import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import useAuthStore from '../../../../../../store/authStore';
import { gradebookService } from '../../../../api/gradebookService';

const GradeSettingsView = ({ classId, categories, onRefresh, isLoading }) => {
    const { user } = useAuthStore();
    const [newName, setNewName] = useState('');
    const [newWeight, setNewWeight] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Edit states
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editWeight, setEditWeight] = useState('');
    const [isActionSubmitting, setIsActionSubmitting] = useState(false);

    // Filter out invalid items and sum weight
    const validCategories = Array.isArray(categories) ? categories : [];
    const totalWeight = validCategories.reduce((sum, cat) => sum + (parseFloat(cat.weight) || 0), 0);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        
        if (!newName.trim()) {
            toast.error('Vui lòng nhập tên hạng mục');
            return;
        }
        
        const weightValue = parseFloat(newWeight);
        if (isNaN(weightValue) || weightValue <= 0) {
            toast.error('Trọng số phải lớn hơn 0');
            return;
        }

        try {
            setIsSubmitting(true);
            const payload = {
                name: newName.trim(),
                weight: weightValue
            };

            const res = await gradebookService.addGradeCategory(classId, payload, user?.token);
            const result = await res.json();

            if (res.ok) {
                toast.success('Đã thêm hạng mục mới thành công!');
                setNewName('');
                setNewWeight('');
                if (onRefresh) onRefresh();
            } else {
                // If it's a 400 Bad Request directly from backend showing error
                if (result.error) {
                    toast.error(result.error);
                } else if (result.message) {
                    toast.error(result.message);
                } else {
                    toast.error('Có lỗi xảy ra khi thêm hạng mục');
                }
            }
        } catch (error) {
            console.error('Add category error:', error);
            toast.error('Lỗi kết nối đến máy chủ');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditCategory = (cat) => {
        setEditingCategoryId(cat.id || cat.gradeCategoryId);
        setEditName(cat.name);
        setEditWeight(cat.weight);
    };

    const handleSaveEdit = async () => {
        if (!editName.trim()) {
            toast.error('Vui lòng nhập tên hạng mục');
            return;
        }
        
        const weightValue = parseFloat(editWeight);
        if (isNaN(weightValue) || weightValue <= 0) {
            toast.error('Trọng số phải lớn hơn 0');
            return;
        }

        try {
            setIsActionSubmitting(true);
            const payload = {
                gradeCategoryId: editingCategoryId,
                name: editName.trim(),
                weight: weightValue
            };

            const res = await gradebookService.updateGradeCategory(classId, payload, user?.token);
            
            if (res.ok) {
                toast.success('Cập nhật hạng mục thành công!');
                setEditingCategoryId(null);
                if (onRefresh) onRefresh();
            } else {
                const result = await res.json();
                if (result.error) toast.error(result.error);
                else if (result.message) toast.error(result.message);
                else toast.error('Có lỗi xảy ra khi cập nhật hạng mục');
            }
        } catch (error) {
            console.error('Update category error:', error);
            toast.error('Lỗi kết nối đến máy chủ');
        } finally {
            setIsActionSubmitting(false);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa hạng mục này? Hành động này không thể hoàn tác và có thể ảnh hưởng đến điểm số.')) return;

        try {
            setIsActionSubmitting(true);
            const res = await gradebookService.deleteGradeCategory(classId, id, user?.token);
            
            if (res.ok) {
                toast.success('Đã xóa hạng mục thành công!');
                if (onRefresh) onRefresh();
            } else {
                const result = await res.json();
                if (result.error) toast.error(result.error);
                else if (result.message) toast.error(result.message);
                else toast.error('Có lỗi xảy ra khi xóa hạng mục');
            }
        } catch (error) {
            console.error('Delete category error:', error);
            toast.error('Lỗi kết nối đến máy chủ');
        } finally {
            setIsActionSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-primary">
                <Icon icon="solar:spinner-linear" className="animate-spin text-4xl mb-4" />
                <p className="font-bold text-lg">Đang tải cấu hình...</p>
            </div>
        );
    }

    return (
        <div className="!flex-1 !p-6 !bg-surface !overflow-y-auto !animate-fade-in custom-scrollbar">
            <div className="!max-w-3xl !mx-auto !space-y-6">
                
                {/* Header Information */}
                <div className="!bg-white !rounded-2xl !border !border-border !shadow-sm !overflow-hidden">
                    <div className="!p-6 !border-b !border-border !bg-background/50 !flex !items-center !justify-between">
                        <div>
                            <h3 className="!text-lg !font-bold !text-text-main !flex !items-center !gap-2">
                                <Icon icon="material-symbols:settings-suggest-rounded" className="!text-primary" />
                                Quản lý Trọng Số Điểm
                            </h3>
                            <p className="!text-sm !text-text-muted !mt-1">Xem và quản lý các hạng mục điểm (Assignment Categories) của lớp.</p>
                        </div>
                        <div className={`!px-4 !py-2 !rounded-xl !border !flex !flex-col !items-end ${totalWeight === 100 ? '!bg-emerald-50 !border-emerald-200 !text-emerald-700' : '!bg-red-50 !border-red-200 !text-red-700'}`}>
                            <span className="!text-xs !font-bold !uppercase !tracking-wider">Tổng Trọng Số</span>
                            <div className="!flex !items-center !gap-1">
                                <span className="!text-xl !font-black">{totalWeight}%</span>
                                {totalWeight === 100 ? (
                                    <Icon icon="material-symbols:check-circle-rounded" />
                                ) : (
                                    <Icon icon="material-symbols:error-rounded" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* List of Existing Categories */}
                <div className="!bg-white !rounded-2xl !border !border-border !shadow-sm !overflow-hidden">
                    <div className="!p-4 !border-b !border-border !bg-background/30 !flex !items-center">
                        <Icon icon="material-symbols:list-alt-outline-rounded" className="!text-text-muted !mr-2 !text-xl" />
                        <h4 className="!font-bold !text-text-main">Danh sách hạng mục hiện có</h4>
                    </div>
                    
                    {validCategories.length === 0 ? (
                        <div className="!p-10 !text-center !text-text-muted">
                            <Icon icon="material-symbols:inbox-outline" className="!text-5xl !mx-auto !opacity-20 !mb-3" />
                            <p>Lớp học này chưa có hạng mục điểm nào.</p>
                        </div>
                    ) : (
                        <div className="!divide-y !divide-border">
                            {validCategories.map((cat) => {
                                const isEditing = editingCategoryId === (cat.id || cat.gradeCategoryId);
                                
                                if (isEditing) {
                                    return (
                                        <div key="editing" className="!p-5 !bg-primary/5">
                                            <div className="!flex !flex-col md:!flex-row !gap-4 !items-start md:!items-center">
                                                <div className="!flex-1 !w-full">
                                                    <input 
                                                        type="text" 
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        className="!w-full !px-3 !py-2 !bg-white !border !border-border !rounded-lg !text-sm focus:!outline-none focus:!border-primary focus:!ring-2 focus:!ring-primary/20"
                                                    />
                                                </div>
                                                <div className="!w-full md:!w-32 !relative">
                                                    <input 
                                                        type="number" 
                                                        step="0.01"
                                                        min="0"
                                                        value={editWeight}
                                                        onChange={(e) => setEditWeight(e.target.value)}
                                                        className="!w-full !px-3 !py-2 !pr-8 !bg-white !border !border-border !rounded-lg !text-sm focus:!outline-none focus:!border-primary focus:!ring-2 focus:!ring-primary/20 !font-bold"
                                                    />
                                                    <span className="!absolute !right-3 !top-1/2 !-translate-y-1/2 !text-text-muted !text-xs !font-bold">%</span>
                                                </div>
                                                <div className="!flex !items-center !gap-2">
                                                    <button 
                                                        onClick={() => setEditingCategoryId(null)}
                                                        disabled={isActionSubmitting}
                                                        className="!px-3 !py-2 !text-sm !font-bold !text-text-muted hover:!bg-background !rounded-lg !transition-colors disabled:!opacity-50"
                                                    >
                                                        Hủy
                                                    </button>
                                                    <button 
                                                        onClick={handleSaveEdit}
                                                        disabled={isActionSubmitting}
                                                        className="!px-4 !py-2 !bg-primary !text-white !text-sm !font-bold !rounded-lg hover:!bg-primary/90 !transition-colors !flex !items-center !gap-2 disabled:!opacity-50"
                                                    >
                                                        {isActionSubmitting ? <Icon icon="solar:spinner-linear" className="!animate-spin" /> : "Lưu"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div key={cat.id || cat.gradeCategoryId} className="!flex !items-center !justify-between !p-5 transition-colors hover:!bg-background/30">
                                        <div className="!flex-1">
                                            <div className="!font-bold !text-text-main !text-base">{cat.name}</div>
                                        </div>
                                        <div className="!flex !items-center !gap-6">
                                            <div className="!text-right">
                                                <div className="!text-sm !text-text-muted">Trọng số</div>
                                                <div className="!font-black !text-primary !text-lg">{cat.weight}%</div>
                                            </div>
                                            <div className="!flex !items-center !gap-2 !border-l !border-border !pl-6 h-10">
                                                <button 
                                                    className="!p-2 !text-text-muted hover:!text-primary hover:!bg-primary/10 !rounded-lg !transition-colors disabled:!opacity-50"
                                                    title="Chỉnh sửa"
                                                    onClick={() => handleEditCategory(cat)}
                                                    disabled={isActionSubmitting}
                                                >
                                                    <Icon icon="material-symbols:edit-document-outline-rounded" className="!text-xl" />
                                                </button>
                                                <button 
                                                    className="!p-2 !text-text-muted hover:!text-destructive hover:!bg-destructive/10 !rounded-lg !transition-colors disabled:!opacity-50"
                                                    title="Xóa"
                                                    onClick={() => handleDeleteCategory(cat.id || cat.gradeCategoryId)}
                                                    disabled={isActionSubmitting}
                                                >
                                                    <Icon icon="material-symbols:delete-outline-rounded" className="!text-xl" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Add New Category Form */}
                <div className="!bg-white !rounded-2xl !border !border-border !shadow-sm !overflow-hidden">
                    <div className="!p-4 !border-b !border-border !bg-primary/5 !flex !items-center text-primary">
                        <Icon icon="material-symbols:add-circle-outline-rounded" className="!mr-2 !text-xl" />
                        <h4 className="!font-bold">Thêm hạng mục mới</h4>
                    </div>
                    
                    <form onSubmit={handleAddCategory} className="!p-6">
                        <div className="!flex !flex-col md:!flex-row !gap-6 !items-start">
                            <div className="!flex-1 !w-full">
                                <label className="!block !text-sm !font-bold !text-text-main !mb-2">Tên hạng mục</label>
                                <input 
                                    type="text" 
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="VD: Bài tập về nhà, Thi Cuối Kỳ..."
                                    className="!w-full !px-4 !py-3 !bg-background !border !border-border !rounded-xl !text-sm focus:!outline-none focus:!border-primary focus:!ring-4 focus:!ring-primary/10 transition-all"
                                />
                            </div>
                            
                            <div className="!w-full md:!w-48">
                                <label className="!block !text-sm !font-bold !text-text-main !mb-2">Trọng số (%)</label>
                                <div className="!relative">
                                    <input 
                                        type="number" 
                                        step="0.01"
                                        min="0"
                                        value={newWeight}
                                        onChange={(e) => setNewWeight(e.target.value)}
                                        placeholder="VD: 25"
                                        className="!w-full !px-4 !py-3 !pr-10 !bg-background !border !border-border !rounded-xl !text-sm focus:!outline-none focus:!border-primary focus:!ring-4 focus:!ring-primary/10 transition-all !font-bold"
                                    />
                                    <span className="!absolute !right-4 !top-1/2 !-translate-y-1/2 !text-text-muted !font-bold">%</span>
                                </div>
                            </div>

                            <div className="!w-full md:!w-auto md:!pt-[28px]">
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="!w-full md:!w-auto !px-6 !py-3 !bg-primary !text-white !rounded-xl !font-bold !shadow-lg !shadow-primary/20 hover:!bg-primary/95 disabled:!opacity-70 disabled:!cursor-not-allowed !transition-all !flex !items-center !justify-center !gap-2"
                                >
                                    {isSubmitting ? (
                                        <Icon icon="solar:spinner-linear" className="!animate-spin !text-xl" />
                                    ) : (
                                        <Icon icon="material-symbols:add-rounded" className="!text-xl" />
                                    )}
                                    Thêm
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Info Note */}
                <div className="!bg-amber-50 !border !border-amber-200 !rounded-xl !p-4 !flex !items-start !gap-3">
                    <Icon icon="material-symbols:info-rounded" className="!text-amber-500 !text-xl !shrink-0" />
                    <div className="!text-sm !text-amber-800 !leading-relaxed">
                        <p><strong>Lưu ý:</strong></p>
                        <ul className="list-disc pl-5 mt-1">
                            <li>Tổng các trọng số phải đúng bằng <strong>100%</strong>. Nếu bạn thêm hạng mục làm tổng vượt quá 100%, hệ thống sẽ báo lỗi.</li>
                            <li>Nếu tổng trọng số chưa đủ 100%, có thể ảnh hưởng đến kết quả GPA cuối cùng của học sinh.</li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default GradeSettingsView;
