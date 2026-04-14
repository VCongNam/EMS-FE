import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import Button from "../../../components/ui/Button";
const CreateStudentAccountPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        parentName: '',
        parentPhone: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission API call here
        console.log('Form submitted:', formData);
        toast.success('Đã tạo tài khoản học sinh thành công!');
    };

    return (
        <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in">
            <div className="flex items-center gap-4 bg-surface p-6 rounded-[2rem] border border-border shadow-sm">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Icon icon="material-symbols:person-add-rounded" className="text-2xl" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-text-main">Tạo tài khoản Học sinh mới</h1>
                    <p className="text-text-muted mt-1">Điền thông tin bên dưới để khởi tạo tài khoản cho học sinh</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-[2rem] border border-border shadow-sm space-y-8">
                {/* Personal Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-main flex items-center gap-2 border-b border-border pb-2">
                        <Icon icon="material-symbols:info-outline-rounded" className="text-primary" /> Thông tin cá nhân
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-text-main">Họ và Tên *</label>
                            <input
                                type="text"
                                name="fullName"
                                required
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Nhập họ và tên đầy đủ"
                                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-text-main"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-text-main">Email đăng nhập *</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@school.edu.vn"
                                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-text-main"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-text-main">Mật khẩu *</label>
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Tạo mật khẩu an toàn"
                                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-text-main"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-text-main">Số điện thoại</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Số điện thoại của học sinh"
                                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-text-main"
                            />
                        </div>
                    </div>
                </div>

                {/* Parent Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-main flex items-center gap-2 border-b border-border pb-2">
                        <Icon icon="material-symbols:family-restroom-rounded" className="text-primary" /> Thông tin phụ huynh
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-text-main">Họ tên phụ huynh</label>
                            <input
                                type="text"
                                name="parentName"
                                value={formData.parentName}
                                onChange={handleChange}
                                placeholder="Nhập tên phụ huynh"
                                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-text-main"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-text-main">SĐT phụ huynh</label>
                            <input
                                type="text"
                                name="parentPhone"
                                value={formData.parentPhone}
                                onChange={handleChange}
                                placeholder="Số điện thoại liên lạc"
                                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-text-main"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-4">
                    <button type="button" className="px-6 py-3 border border-border text-text-main rounded-xl hover:bg-background transition-colors font-semibold">
                        Hủy bỏ
                    </button>
                    <button type="submit" className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 shadow-lg hover:shadow-primary/30 transition-all font-semibold flex items-center gap-2">
                        <Icon icon="material-symbols:save-rounded" className="text-xl" />
                        Tạo tài khoản
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateStudentAccountPage;
