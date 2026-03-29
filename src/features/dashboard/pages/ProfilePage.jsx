import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import useAuthStore from '../../../store/authStore';
import Button from '../../../components/ui/Button';
import { profileService } from '../api/profileService';
const ProfilePage = () => {
    const { user, updateProfile } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...user });

    // Change password states
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    // Toggle states for masking personal info
    const [showEmail, setShowEmail] = useState(false);
    const [showPhone, setShowPhone] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.token) return;
            try {
                const response = await profileService.getProfile(user.token);
                
                if (response.ok) {
                    const data = await response.json();
                    setFormData(prev => ({ ...prev, ...data }));
                    updateProfile(data);
                }
            } catch (error) {
                console.error("Fetch profile failed:", error);
            }
        };

        fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.token]);

    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!user?.token) return;
        setSaving(true);

        try {
            // Determine endpoint based on role dynamically
            const rolePath = user.role?.toLowerCase() || 'ta';
            const endpoint = `/api/Account/${rolePath}/profile`;

            // Build base payload
            let payload = {
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber || ""
            };

            // Add role-specific data for TA and Teacher
            if (user.role === 'TA' || user.role === 'teacher') {
                payload = {
                    ...payload,
                    bio: formData.roleSpecificData?.bio || "",
                    bankName: formData.roleSpecificData?.bankName || "",
                    bankAccount: formData.roleSpecificData?.bankAccount || "",
                    bankAccountName: formData.roleSpecificData?.bankAccountName || ""
                };
                if (user.role === 'teacher') {
                    payload.specialization = formData.roleSpecificData?.specialization || "";
                }
            }

            const response = await profileService.updateProfile(rolePath, payload, user.token);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Lỗi ${response.status}: ${errorText || 'Không rõ nguyên nhân'}`);
            }

            // Sync with local Zustand store only if successful
            updateProfile(formData);
            setIsEditing(false);
            alert("Cập nhật hồ sơ thành công!");
        } catch (error) {
            console.error("Save profile error:", error);
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');
        
        if (newPassword !== confirmNewPassword) {
            setPasswordError('Mật khẩu xác nhận không khớp!');
            return;
        }

        if (!user?.token) return;
        setPasswordLoading(true);

        try {
            const response = await profileService.changePassword({ oldPassword, newPassword }, user.token);

            if (!response.ok) {
                 const errorData = await response.json().catch(() => ({}));
                 throw new Error(errorData.message || "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ!");
            }

            setPasswordSuccess("Đổi mật khẩu thành công!");
            setOldPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (err) {
            setPasswordError(err.message);
        } finally {
            setPasswordLoading(false);
        }
    };

    const roleLabels = {
        student: 'Học sinh',
        teacher: 'Giáo viên',
        TA: 'Trợ giảng'
    };

    return (
        <div className="w-full mx-auto">
            {/* Header / Banner Section */}
            <div className="relative">
            

                <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 relative z-10">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 w-full sm:w-auto">
                        <div className="relative group mx-auto sm:mx-0">
                            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-[2.5rem] bg-surface flex items-center justify-center border-[6px] border-background shadow-2xl relative overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]">
                                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
                                <Icon icon="material-symbols:person-rounded" className="text-8xl sm:text-9xl text-primary" />
                                {isEditing && (
                                    <button className="absolute inset-0 bg-black/40 backdrop-blur-[2px] text-white flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <Icon icon="material-symbols:camera-alt-rounded" className="text-3xl" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Đổi ảnh</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="text-center sm:text-left !pb-4 space-y-2">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-text-main font-['Outfit'] tracking-tight">
                                    {user?.fullName}
                                </h1>
                                <span className="!px-3 !py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg uppercase tracking-widest border border-primary/20">
                                    {roleLabels[user?.role]}
                                </span>
                            </div>
                            <p className="text-text-muted font-medium flex items-center justify-center sm:justify-start gap-2">
                                <Icon icon="material-symbols:mail-rounded" className="text-lg" />
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    <div className="!pb-6 flex gap-3 w-full sm:w-auto">
                        <Button
                            variant="outline"
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            className="!px-8 !py-6 w-full sm:w-auto shadow-xl hover:shadow-primary/20 transition-all rounded-2xl"
                        >
                            <span className="flex items-center gap-2">
                                <Icon icon={isEditing ? "material-symbols:save-rounded" : "material-symbols:edit-document-rounded"} className="text-xl" />
                                {isEditing ? 'Lưu hồ sơ' : 'Chỉnh sửa'}
                            </span>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 !mt-12">
                {/* Left Column: Summary & Account Status */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-surface !p-6 rounded-[2rem] border border-border shadow-sm group hover:shadow-md transition-shadow">
                        <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Icon icon="material-symbols:analytics-rounded" className="text-lg text-primary" /> Tổng quan tài khoản
                        </h3>
                        <div className="space-y-4">
                            <div className="!p-4 !mt-2 bg-background rounded-2xl border border-border/50 flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Ngày tham gia</span>
                                <span className="text-sm text-text-main font-medium flex items-center gap-2">
                                    <Icon icon="material-symbols:calendar-today-rounded" className="text-primary text-base" />
                                    10/03/2026
                                </span>
                            </div>
                            <div className="!p-4 !mt-2 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Trạng thái</span>
                                    <span className="text-sm font-bold text-primary italic">Active</span>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface !mt-2 !p-6 rounded-[2rem] border border-border shadow-sm overflow-hidden relative">
                        <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-3xl"></div>
                        <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Icon icon="material-symbols:verified-user-rounded" className="text-lg text-green-500" /> Xác thực hồ sơ
                        </h3>
                        <p className="text-sm text-text-muted leading-relaxed">
                            Hồ sơ của bạn đã được xác thực bởi bộ phận nhân sự và đang trong trạng thái hoạt động chính thức.
                        </p>
                    </div>
                </div>

                {/* Right Column: Detailed Sections */}
                <div className="lg:col-span-8 space-y-6">
                    {/* General Bio Section (Visible to Teachers/Assistants) */}
                    {(user?.role === 'teacher' || user?.role === 'TA') && (
                        <div className="bg-surface !p-8 rounded-[2rem] border border-border shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-text-main flex items-center gap-3">
                                    <Icon icon="material-symbols:history-edu-rounded" className="text-2xl text-primary" /> Trình độ và giới thiệu
                                </h3>
                            </div>
                            <div>
                                <label className="block text-xs !mt-2 font-bold text-text-muted uppercase tracking-widest mb-3 px-1">Giới thiệu bản thân & Kinh nghiệm</label>
                                <textarea
                                    disabled={!isEditing}
                                    rows="4"
                                    value={formData.roleSpecificData?.bio || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, roleSpecificData: { ...prev.roleSpecificData, bio: e.target.value } }))}
                                    placeholder="Chia sẻ về kinh nghiệm giảng dạy, chuyên môn của bạn..."
                                    className="w-full !mt-2 !p-5 rounded-2xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-70 resize-none font-medium text-text-main placeholder:text-text-muted/50 shadow-inner"
                                ></textarea>
                            </div>
                            
                            {user?.role === 'teacher' && (
                                <div className="!mt-6 space-y-2">
                                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest px-1">Chuyên môn / Môn giảng dạy</label>
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        value={formData.roleSpecificData?.specialization || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, roleSpecificData: { ...prev.roleSpecificData, specialization: e.target.value } }))}
                                        placeholder="Ví dụ: Toán, Văn, Anh..."
                                        className="w-full !mt-2 !px-5 !py-4 rounded-2xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-70 font-bold text-text-main"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    <div className="bg-surface !mt-2 !p-8 rounded-[2rem] border border-border shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-text-main flex items-center gap-3">
                                <Icon icon="material-symbols:contact-page-rounded" className="text-2xl text-primary" /> Thông tin liên hệ
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                            <div className="space-y-2">
                                <label className="block text-xs !mt-2 font-bold text-text-muted uppercase tracking-widest px-1">Họ và tên đầy đủ</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        value={formData.fullName || ''}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full !mt-2 !pl-2 !pr-5 !py-4 rounded-2xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-70 font-bold text-text-main"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs !mt-2 font-bold text-text-muted uppercase tracking-widest px-1">Địa chỉ Email</label>
                                <div className="relative group">
                                    <input
                                        type={showEmail ? "email" : "password"}
                                        disabled={!isEditing}
                                        value={formData.email || ''}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full !mt-2 !pl-2 !pr-12 !py-4 rounded-2xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-70 font-bold text-text-main"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowEmail(!showEmail)}
                                        className="absolute right-4 top-[55%] -translate-y-1/2 text-text-muted hover:text-primary transition-colors focus:outline-none"
                                        title={showEmail ? "Ẩn" : "Hiện"}
                                        disabled={!isEditing && !formData.email}
                                    >
                                        <Icon icon={showEmail ? "mdi:eye-off-outline" : "mdi:eye-outline"} className="text-2xl" />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-widest px-1">Số điện thoại</label>
                                <div className="relative group">
                                    <input
                                        type={showPhone ? "text" : "password"}
                                        disabled={!isEditing}
                                        placeholder="Chưa cập nhật"
                                        value={formData.phoneNumber || ''}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        className="w-full !mt-2 !pl-2 !pr-12 !py-4 rounded-2xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-70 font-bold text-text-main"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPhone(!showPhone)}
                                        className="absolute right-4 top-[55%] -translate-y-1/2 text-text-muted hover:text-primary transition-colors focus:outline-none"
                                        title={showPhone ? "Ẩn" : "Hiện"}
                                        disabled={!isEditing && !formData.phoneNumber}
                                    >
                                        <Icon icon={showPhone ? "mdi:eye-off-outline" : "mdi:eye-outline"} className="text-2xl" />
                                    </button>
                                </div>
                            </div>
                            {user?.role === 'student' && (
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest px-1">Ngày sinh</label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            placeholder="DD/MM/YYYY"
                                            className="w-full !mt-2 !pl-2 !pr-5 !py-4 rounded-2xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-70 font-bold text-text-main"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Role Specific Detailed Sections */}
                    {user?.role === 'student' && (
                        <div className="bg-surface !mt-2 !p-8 rounded-[2rem] border border-border shadow-sm animate-fade-in-up">
                            <h3 className="text-xl font-bold text-text-main mb-8 flex items-center gap-3">
                                <Icon icon="material-symbols:family-restroom-rounded" className="text-2xl text-primary" /> Liên hệ khẩn cấp
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest !mt-2 px-1">Họ tên phụ huynh</label>
                                    <input type="text" disabled={!isEditing} placeholder="Nguyễn Văn A" className="w-full !mt-2 !pl-2 !pr-5 !py-4 rounded-2xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-70 font-bold text-text-main" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest !mt-2 px-1">SĐT liên hệ</label>
                                    <input type="text" disabled={!isEditing} placeholder="0987xxx678" className="w-full !mt-2 !pl-2 !pr-5 !py-4 rounded-2xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-70 font-bold text-text-main" />
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest px-1">Địa chỉ cư trú</label>
                                    <input type="text" disabled={!isEditing} placeholder="Số 1, Đường ABC, TP.HCM" className="w-full !mt-2 !px-2 !py-4 rounded-2xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-70 font-bold text-text-main" />
                                </div>
                            </div>
                        </div>
                    )}

                    {(user?.role === 'teacher' || user?.role === 'TA') && (
                        <div className="bg-surface !mt-2 !p-8 rounded-[2rem] border border-border shadow-sm animate-fade-in-up">
                            <h3 className="text-xl font-bold text-text-main mb-8 flex items-center gap-3">
                                <Icon icon="material-symbols:account-balance-wallet" className="text-2xl text-primary" /> Thông tin thanh toán
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold !mt-2 text-text-muted uppercase tracking-widest px-1">Ngân hàng thụ hưởng</label>
                                    <input type="text" disabled={!isEditing} value={formData.roleSpecificData?.bankName || ''} onChange={(e) => setFormData(prev => ({ ...prev, roleSpecificData: { ...prev.roleSpecificData, bankName: e.target.value } }))} placeholder="Techcombank" className="w-full !mt-2 !px-5 !py-4 rounded-2xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-70 font-bold text-text-main" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold !mt-2 text-text-muted uppercase tracking-widest px-1">Số tài khoản</label>
                                    <input type="text" disabled={!isEditing} value={formData.roleSpecificData?.bankAccount || ''} onChange={(e) => setFormData(prev => ({ ...prev, roleSpecificData: { ...prev.roleSpecificData, bankAccount: e.target.value } }))} placeholder="1903xxxxxx8888" className="w-full !mt-2 !px-5 !py-4 rounded-2xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-70 font-bold text-text-main font-mono" />
                                </div>
                                <div className="space-y-2 sm:col-span-2">
                                    <label className="block text-xs font-bold  text-text-muted uppercase tracking-widest px-1">Chủ tài khoản (Không dấu)</label>
                                    <input type="text" disabled={!isEditing} value={formData.roleSpecificData?.bankAccountName || ''} onChange={(e) => setFormData(prev => ({ ...prev, roleSpecificData: { ...prev.roleSpecificData, bankAccountName: e.target.value } }))} placeholder="NGUYEN VAN B" className="w-full !mt-2 !px-5 !py-4 rounded-2xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-70 font-bold text-text-main uppercase" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Change Password Section */}
                    <div className="bg-surface !mt-2 !p-8 rounded-[2rem] border border-border shadow-sm animate-fade-in-up">
                        <h3 className="text-xl font-bold text-text-main mb-8 flex items-center gap-3">
                            <Icon icon="material-symbols:lock-reset-rounded" className="text-2xl text-primary" /> Đổi mật khẩu
                        </h3>
                        
                        <form onSubmit={handleChangePassword} className="space-y-6">
                            {passwordError && (
                                <div className="!p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
                                    {passwordError}
                                </div>
                            )}
                            {passwordSuccess && (
                                <div className="!p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium">
                                    {passwordSuccess}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-widest px-1">Mật khẩu cũ</label>
                                <input 
                                    type="password" 
                                    required 
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    placeholder="••••••••" 
                                    className="w-full !mt-2 !px-5 !py-4 rounded-2xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-text-main font-mono" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-widest px-1">Mật khẩu mới</label>
                                <input 
                                    type="password" 
                                    required 
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••" 
                                    className="w-full !mt-2 !px-5 !py-4 rounded-2xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-text-main font-mono" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-text-muted uppercase tracking-widest px-1">Xác nhận mật khẩu mới</label>
                                <input 
                                    type="password" 
                                    required 
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    placeholder="••••••••" 
                                    className="w-full !mt-2 !px-5 !py-4 rounded-2xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-text-main font-mono" 
                                />
                            </div>
                            <div className="!pt-4">
                                <Button
                                    type="submit"
                                    disabled={passwordLoading}
                                    variant="outline"
                                    className="!px-8 !py-4 font-bold rounded-xl border-2 hover:bg-background transition-colors text-text-main disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {passwordLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                                </Button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
