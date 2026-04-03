import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import Button from "../../../../../../components/ui/Button";
import { studentService } from '../../../../../student-management/api/studentService';
import { classService } from '../../../../api/classService';
import useAuthStore from '../../../../../../store/authStore';

const AddStudentModal = ({ isOpen, onClose, onAdd, classId }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: '',
        parentName: '',
        parentPhone: '',
        parentEmail: '',
        address: '',
        dob: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const token = useAuthStore.getState().user?.token;

        try {
            // Bước 1: Tạo tài khoản học sinh mới
            const createRes = await studentService.createStudentAccount(formData, token);
            if (!createRes.ok) throw new Error('Không thể tạo tài khoản học sinh');
            
            const createData = await createRes.json();
            const newStudentId = createData.studentId;

            if (!newStudentId) throw new Error('Backend không trả về ID sau khi tạo');

            // Bước 2: Gán học sinh vừa tạo vào Lớp học
            const assignRes = await classService.assignStudent(classId, newStudentId, token);
            
            if (!assignRes.ok) throw new Error('Không thể gán học sinh vào lớp');

            toast.success('Học sinh đã được tạo và gán vào lớp thành công!');
            
            // Dọn dẹp form và đóng modal
            setFormData({
                fullName: '', email: '', phoneNumber: '', password: '',
                parentName: '', parentPhone: '', parentEmail: '', address: '', dob: ''
            });
            onAdd(); // Trigger hàm load lại danh sách học sinh của lớp
            onClose();

        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Lỗi hệ thống');
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
                    className="bg-surface rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fade-in-up pointer-events-auto flex flex-col relative custom-scrollbar"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between !p-6 border-b border-border rounded-t-3xl shrink-0">
                        <div className="flex items-center !text-primary !gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <Icon icon="solar:user-plus-bold-duotone" className="text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-xl !text-primary sm:text-2xl font-bold font-['Outfit']">Tạo & Gán học viên mới</h2>
                                <p className="text-xs sm:text-sm text-text-muted mt-1">Khởi tạo hồ sơ và đồng thời gán vào lớp học này</p>
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

                    {/* Form Body */}
                    <form onSubmit={handleSubmit} className="!p-6 md:!p-8 !space-y-8 flex-1 flex flex-col relative">
                        {/* Personal Info */}
                        <div className="!space-y-6 shrink-0">
                            <div className="flex items-center !gap-3 border-b border-border !pb-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                                    <Icon icon="solar:user-id-bold-duotone" className="text-xl" />
                                </div>
                                <h3 className="text-lg font-bold text-text-main">Thông tin cá nhân học sinh</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 !gap-x-6 !gap-y-5">
                                <div className="!space-y-1 group">
                                    <label className={labelClasses}>Họ và Tên <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <Icon icon="solar:user-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/70 text-lg group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="text"
                                            name="fullName"
                                            required
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            placeholder="Vd: Nguyễn Văn A"
                                            className={inputClasses}
                                        />
                                    </div>
                                </div>
                                
                                <div className="!space-y-1 group">
                                    <label className={labelClasses}>Email Đăng Nhập <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <Icon icon="solar:letter-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/70 text-lg group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="hocsinh@example.com"
                                            className={inputClasses}
                                        />
                                    </div>
                                </div>

                                <div className="!space-y-1 group">
                                    <label className={labelClasses}>Mật khẩu khởi tạo <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <Icon icon="solar:lock-password-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/70 text-lg group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="password"
                                            name="password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Tối thiểu 6 ký tự"
                                            className={inputClasses}
                                            minLength={6}
                                        />
                                    </div>
                                </div>

                                <div className="!space-y-1 group">
                                    <label className={labelClasses}>Số điện thoại</label>
                                    <div className="relative">
                                        <Icon icon="solar:phone-calling-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/70 text-lg group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            placeholder="SĐT học sinh"
                                            className={inputClasses}
                                        />
                                    </div>
                                </div>

                                <div className="!space-y-1 group">
                                    <label className={labelClasses}>Ngày sinh</label>
                                    <div className="relative">
                                        <Icon icon="solar:calendar-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/70 text-lg group-focus-within:text-primary transition-colors z-10" />
                                        <input
                                            type="date"
                                            name="dob"
                                            value={formData.dob}
                                            onChange={handleChange}
                                            className={`${inputClasses} [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 cursor-pointer`}
                                        />
                                    </div>
                                </div>

                                <div className="!space-y-1 group md:col-span-2">
                                    <label className={labelClasses}>Địa chỉ thường trú</label>
                                    <div className="relative">
                                        <Icon icon="solar:map-point-linear" className="absolute left-4 top-[18px] text-text-muted/70 text-lg group-focus-within:text-primary transition-colors" />
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="Vd: 123 Đường XYZ..."
                                            rows={2}
                                            className={`w-full !pl-11 !pr-4 !py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-text-main hover:border-text-muted/30 placeholder:text-text-muted/50 resize-none`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Parent Info */}
                        <div className="!space-y-6 shrink-0 pt-2">
                            <div className="flex items-center !gap-3 border-b border-border !pb-3">
                                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                                    <Icon icon="solar:users-group-two-rounded-bold-duotone" className="text-xl" />
                                </div>
                                <h3 className="text-lg font-bold text-text-main">Thông tin liên hệ phụ huynh</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 !gap-x-6 !gap-y-5">
                                <div className="!space-y-1 group">
                                    <label className={labelClasses}>Họ và tên phụ huynh <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <Icon icon="solar:user-circle-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/70 text-lg group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="text"
                                            name="parentName"
                                            required
                                            value={formData.parentName}
                                            onChange={handleChange}
                                            placeholder="Vd: Nguyễn Văn B"
                                            className={inputClasses}
                                        />
                                    </div>
                                </div>

                                <div className="!space-y-1 group">
                                    <label className={labelClasses}>Số điện thoại phụ huynh <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <Icon icon="solar:phone-calling-rounded-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/70 text-lg group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="tel"
                                            name="parentPhone"
                                            required
                                            value={formData.parentPhone}
                                            onChange={handleChange}
                                            placeholder="Dùng để liên hệ khẩn cấp"
                                            className={inputClasses}
                                        />
                                    </div>
                                </div>

                                <div className="!space-y-1 group md:col-span-2">
                                    <label className={labelClasses}>Email phụ huynh</label>
                                    <div className="relative">
                                        <Icon icon="solar:letter-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/70 text-lg group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="email"
                                            name="parentEmail"
                                            value={formData.parentEmail}
                                            onChange={handleChange}
                                            placeholder="Gửi thông báo học tập"
                                            className={inputClasses}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="!pt-6 border-t border-border flex flex-col-reverse sm:flex-row justify-end !gap-3 sm:!gap-4 w-full mt-auto shrink-0 bg-surface z-10 sticky bottom-0 pb-2">
                            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto justify-center">
                                Hủy bỏ
                            </Button>
                            <Button 
                                type="submit" 
                                variant="!primary" 
                                disabled={isSubmitting}
                                className="w-full sm:w-auto !p-3 justify-center shadow-primary/30 shadow-lg group"
                            >
                                {isSubmitting ? (
                                    <Icon icon="solar:spinner-linear" className="animate-spin text-xl text-white mr-2" />
                                ) : (
                                    <Icon icon="solar:user-check-bold-duotone" className="text-xl text-white !mr-2 group-hover:scale-110 transition-transform" />
                                )}
                                Xác nhận thêm & Gán vào lớp
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>,
        document.body
    );
};

export default AddStudentModal;
