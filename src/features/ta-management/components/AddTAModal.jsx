import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import Button from "../../../components/ui/Button";
import { taService } from '../api/taService';
import useAuthStore from '../../../store/authStore';

const AddTAModal = ({ isOpen, onClose, onAdd, classId }) => {
    const { user } = useAuthStore();
    const token = user?.token;

    const [email, setEmail] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [foundTA, setFoundTA] = useState(null);
    
    // Assignment fields
    const [permission, setPermission] = useState('Attendance');
    const [salaryPerSession, setSalaryPerSession] = useState(50000);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!email.trim()) {
            toast.warn('Vui lòng nhập email');
            return;
        }

        setIsSearching(true);
        setFoundTA(null);
        try {
            const res = await taService.getTAByEmail(email.trim(), token);
            if (res.ok) {
                const data = await res.json();
                setFoundTA(data);
                toast.success('Đã tìm thấy trợ giảng!');
            } else {
                toast.error('Không tìm thấy trợ giảng với email này');
            }
        } catch (error) {
            console.error(error);
            toast.error('Lỗi khi tìm kiếm trợ giảng');
        } finally {
            setIsSearching(false);
        }
    };

    const handleAssign = async () => {
        if (!foundTA) return;
        setIsSubmitting(true);
        try {
            const payload = {
                taid: foundTA.taId,
                permission: permission,
                salaryPerSession: Number(salaryPerSession)
            };
            const res = await taService.assignTAToClass(classId, payload, token);
            if (res.ok) {
                toast.success('Phân công trợ giảng thành công!');
                onAdd(); // Refresh list
                onClose();
            } else {
                const errorData = await res.json().catch(() => ({}));
                toast.error(errorData.message || 'Phân công thất bại');
            }
        } catch (error) {
            console.error(error);
            toast.error('Lỗi khi thực hiện phân công');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses = "w-full !pl-11 !pr-4 !py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-text-main hover:border-text-muted/30 placeholder:text-text-muted/50";
    const labelClasses = "block text-sm font-semibold text-text-main !mb-1.5";

    return ReactDOM.createPortal(
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center !p-4 pointer-events-none">
                <div
                    className="bg-surface rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-fade-in-up pointer-events-auto flex flex-col relative"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between !p-6 border-b border-border bg-background/30 shrink-0">
                        <div className="flex items-center !text-primary !gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <Icon icon="solar:user-plus-bold-duotone" className="text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-xl !text-primary sm:text-2xl font-bold font-['Outfit']">Thêm trợ giảng</h2>
                                <p className="text-xs sm:text-sm text-text-muted mt-1 uppercase tracking-wider font-bold">Gán trợ giảng vào lớp học</p>
                            </div>
                        </div>
                        <button 
                            type="button"
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-text-muted hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all shrink-0"
                        >
                            <Icon icon="material-symbols:close-rounded" className="text-xl" />
                        </button>
                    </div>

                    <div className="overflow-y-auto custom-scrollbar flex-1 !p-6 md:!p-8 !space-y-8">
                        {/* Search Section */}
                        <div className="!space-y-4">
                            <label className={labelClasses}>Tìm kiếm trợ giảng theo Email</label>
                            <form onSubmit={handleSearch} className="flex !gap-3">
                                <div className="relative flex-1 group">
                                    <Icon icon="solar:letter-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/70 text-lg group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Nhập email trợ giảng..."
                                        className={inputClasses}
                                        required
                                    />
                                </div>
                                <Button 
                                    type="submit" 
                                    disabled={isSearching}
                                    variant="!primary"
                                    className="!p-3 !px-6 !rounded-xl shadow-lg shadow-primary/20 shrink-0"
                                >
                                    {isSearching ? (
                                        <Icon icon="solar:spinner-linear" className="animate-spin text-xl" />
                                    ) : (
                                        <Icon icon="solar:magnifer-linear" className="text-xl" />
                                    )}
                                    <span className="ml-2 hidden sm:inline">Tìm kiếm</span>
                                </Button>
                            </form>
                        </div>

                        {/* Result Section */}
                        {foundTA && (
                            <div className="animate-fade-in !space-y-6">
                                <div className="!p-5 bg-primary/5 rounded-2xl border border-primary/10 flex items-center !gap-4">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-2xl uppercase shrink-0 border-2 border-primary/20 shadow-inner">
                                        {foundTA.fullName ? foundTA.fullName.charAt(0) : '?'}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-lg font-bold text-text-main truncate">{foundTA.fullName}</h3>
                                        <p className="text-sm text-text-muted flex items-center !gap-1.5 !mt-0.5">
                                            <Icon icon="solar:letter-linear" />
                                            {foundTA.email}
                                        </p>
                                        <p className="text-sm text-text-muted flex items-center !gap-1.5">
                                            <Icon icon="solar:phone-linear" />
                                            {foundTA.phoneNumber || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                {/* Assignment Inputs */}
                                <div className="grid grid-cols-1 md:grid-cols-2 !gap-6">
                                    <div className="!space-y-1.5 group">
                                        <label className={labelClasses}>Quyền hạn <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <Icon icon="solar:shield-keyhole-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/70 text-lg group-focus-within:text-primary transition-colors" />
                                            <select
                                                value={permission}
                                                onChange={(e) => setPermission(e.target.value)}
                                                className={`${inputClasses} appearance-none cursor-pointer`}
                                            >
                                                <option value="Attendance">Attendance (Điểm danh)</option>
                                                <option value="Grade">Grade (Điểm số)</option>
                                                <option value="Permission">Permission (Toàn quyền cấu hình)</option>
                                            </select>
                                            <Icon icon="solar:alt-arrow-down-linear" className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="!space-y-1.5 group">
                                        <label className={labelClasses}>Lương mỗi buổi (đ) <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <Icon icon="solar:wad-of-money-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/70 text-lg group-focus-within:text-primary transition-colors" />
                                            <input
                                                type="number"
                                                value={salaryPerSession}
                                                onChange={(e) => setSalaryPerSession(e.target.value)}
                                                className={inputClasses}
                                                min="0"
                                                step="1000"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {foundTA.bio && (
                                    <div className="!p-4 bg-background rounded-xl border border-border/50 text-sm text-text-muted italic">
                                        <div className="flex items-center !gap-2 !mb-1.5 font-bold not-italic text-text-main opacity-70 uppercase tracking-tighter text-xs">
                                            <Icon icon="solar:notes-linear" /> Giới thiệu
                                        </div>
                                        "{foundTA.bio}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="!p-6 border-t border-border flex flex-col-reverse sm:flex-row justify-end !gap-3 sm:!gap-4 shrink-0 bg-background/20">
                        <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto justify-center">
                            Hủy bỏ
                        </Button>
                        <Button 
                            type="button" 
                            variant="!primary" 
                            disabled={!foundTA || isSubmitting}
                            onClick={handleAssign}
                            className={`w-full sm:w-auto !p-3 justify-center shadow-lg group transition-all ${!foundTA ? 'opacity-50 cursor-not-allowed' : 'shadow-primary/30'}`}
                        >
                            {isSubmitting ? (
                                <Icon icon="solar:spinner-linear" className="animate-spin text-xl text-white mr-2" />
                            ) : (
                                <Icon icon="solar:user-check-bold-duotone" className="text-xl text-white !mr-2 group-hover:scale-110 transition-transform" />
                            )}
                            Xác nhận phân công
                        </Button>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
};

export default AddTAModal;
