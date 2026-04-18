import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import useAuthStore from '../../../store/authStore';
import Button from '../../../components/ui/Button';
import { profileService } from '../api/profileService';
import { toast } from 'react-toastify';
import ChangePasswordModal from '../components/profile/ChangePasswordModal';

const ProfilePage = () => {
    const { user, updateProfile } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...user });

    // Modal state for password change
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

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
                    
                    // Format DOB for HTML date input: YYYY-MM-DD
                    let dobStr = '';
                    if (data.dob && typeof data.dob === 'object') {
                        const { year, month, day } = data.dob;
                        if (year && month && day) {
                            dobStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        }
                    } else if (data.dob && typeof data.dob === 'string') {
                        dobStr = data.dob.split('T')[0];
                    }

                    setFormData(prev => ({ ...prev, ...data, dobString: dobStr }));
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
    const [banks, setBanks] = useState([]);
    const [showBankDropdown, setShowBankDropdown] = useState(false);
    const [bankSearch, setBankSearch] = useState('');

    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const response = await fetch('https://api.vietqr.io/v2/banks');
                if (response.ok) {
                    const result = await response.json();
                    setBanks(result.data || []);
                }
            } catch (error) {
                console.error("Fetch banks failed:", error);
            }
        };
        fetchBanks();
    }, []);

    useEffect(() => {
        if (formData.roleSpecificData?.bankName && banks.length > 0) {
            setBankSearch(getBankDisplay(formData.roleSpecificData.bankName));
        }
    }, [formData.roleSpecificData?.bankName, banks]);

    const getBankDisplay = (val) => {
        if (!val) return '';
        const bank = banks.find(b => b.bin === val);
        return bank ? bank.shortName : val;
    };

    const filteredBanks = banks.filter(bank =>
        (bank.shortName || '').toLowerCase().includes(bankSearch.toLowerCase()) ||
        (bank.name || '').toLowerCase().includes(bankSearch.toLowerCase()) ||
        (bank.bin || '').includes(bankSearch)
    );

    const handleSave = async () => {
        if (!user?.token) return;
        setSaving(true);

        try {
            // Determine endpoint based on role dynamically
            const rolePath = user.role?.toLowerCase() || 'ta';
            
            // Build payload
            let payload = {
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber || ""
            };

            // Add role-specific data for student
            if (user.role === 'student') {
                payload = {
                    ...payload,
                    parentName: formData.parentName || "",
                    parentPhone: formData.parentPhone || "",
                    parentEmail: formData.parentEmail || "",
                    address: formData.address || "",
                    dob: formData.dobString || null // System.DateOnly expects "YYYY-MM-DD"
                };
            }

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
                let errorMsg = 'Cập nhật hồ sơ thất bại';
                try {
                    const errData = await response.json();
                    errorMsg = errData.message || (errData.errors ? Object.values(errData.errors).flat().join(', ') : errorMsg);
                } catch {
                    const text = await response.text();
                    errorMsg = text || errorMsg;
                }
                throw new Error(errorMsg);
            }

            // Sync with local Zustand store only if successful
            updateProfile(formData);
            setIsEditing(false);
            toast.success("Cập nhật hồ sơ thành công!");
        } catch (error) {
            console.error("Save profile error:", error);
            const msg = error.message === '[object Object]' ? 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.' : error.message;
            toast.error(msg);
        } finally {
            setSaving(false);
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
                            disabled={saving}
                            className="!px-8 !py-6 w-full sm:w-auto shadow-xl hover:shadow-primary/20 transition-all rounded-2xl"
                        >
                            <span className="flex items-center gap-2">
                                {saving ? (
                                    <Icon icon="svg-spinners:180-ring-with-bg" className="text-xl" />
                                ) : (
                                    <Icon icon={isEditing ? "material-symbols:save-rounded" : "material-symbols:edit-document-rounded"} className="text-xl" />
                                )}
                                {saving ? 'Đang lưu...' : (isEditing ? 'Lưu hồ sơ' : 'Chỉnh sửa')}
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
                                    10/03/2025
                                </span>
                            </div>
                            <div className="!p-4 !mt-2 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Trạng thái</span>
                                    <span className="text-sm font-bold text-primary italic">Đang hoạt động</span>
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
                            Hồ sơ của bạn đã được xác thực bởi bộ phận học vụ và đang trong trạng thái hoạt động chính thức.
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
                                <Icon icon="material-symbols:contact-page-rounded" className="text-2xl text-primary" /> 
                                {user?.role === 'student' ? 'Thông tin học sinh' : 'Thông tin liên hệ'}
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                            <div className="space-y-2">
                                <label className="block text-xs !mt-2 font-bold text-text-muted uppercase tracking-widest px-1">Họ và tên đầy đủ</label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={formData.fullName || ''}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full !mt-2 !px-5 !py-4 rounded-2xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-70 font-bold text-text-main"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs !mt-2 font-bold text-text-muted uppercase tracking-widest px-1">Địa chỉ Email</label>
                                <div className="relative group">
                                    <input
                                        type={showEmail ? "email" : "password"}
                                        disabled={!isEditing}
                                        value={formData.email || ''}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full !mt-2 !px-5 !pr-12 !py-4 rounded-2xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-70 font-bold text-text-main"
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
                                        className="w-full !mt-2 !px-5 !pr-12 !py-4 rounded-2xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-70 font-bold text-text-main"
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
                                    <input
                                        type="date"
                                        disabled={!isEditing}
                                        value={formData.dobString || ''}
                                        onChange={(e) => setFormData({ ...formData, dobString: e.target.value })}
                                        className="w-full !mt-2 !px-5 !py-4 rounded-2xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-70 font-bold text-text-main"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Role Specific Detailed Sections */}
                    {user?.role === 'student' && (
                        <div className="bg-surface !mt-2 !p-8 rounded-[2rem] border border-border shadow-sm animate-fade-in-up">
                            <h3 className="text-xl font-bold text-text-main mb-8 flex items-center gap-3">
                                <Icon icon="solar:user-id-bold-duotone" className="text-2xl text-primary" /> Thông tin bổ sung & Gia đình
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest !mt-2 px-1">Email phụ huynh</label>
                                    <input 
                                        type="email" 
                                        disabled={!isEditing} 
                                        value={formData.parentEmail || ''} 
                                        onChange={(e) => setFormData({...formData, parentEmail: e.target.value})}
                                        placeholder="parent@example.com" 
                                        className="w-full !mt-2 !px-5 !py-4 rounded-2xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-70 font-bold text-text-main" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest !mt-2 px-1">Họ tên phụ huynh</label>
                                    <input 
                                        type="text" 
                                        disabled={!isEditing} 
                                        value={formData.parentName || ''} 
                                        onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                                        placeholder="Nguyễn Văn A" 
                                        className="w-full !mt-2 !px-5 !py-4 rounded-2xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-70 font-bold text-text-main" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest !mt-2 px-1">SĐT phụ huynh</label>
                                    <input 
                                        type="text" 
                                        disabled={!isEditing} 
                                        value={formData.parentPhone || ''} 
                                        onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
                                        placeholder="09xxx..." 
                                        className="w-full !mt-2 !px-5 !py-4 rounded-2xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-70 font-bold text-text-main" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-text-muted uppercase tracking-widest !mt-2 px-1">Địa chỉ thường trú</label>
                                    <input 
                                        type="text" 
                                        disabled={!isEditing} 
                                        value={formData.address || ''} 
                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                        placeholder="Số nhà, tên đường, phường/xã..." 
                                        className="w-full !mt-2 !px-5 !py-4 rounded-2xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-70 font-bold text-text-main" 
                                    />
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
                                <div className="space-y-2 relative">
                                    <label className="block text-xs font-bold !mt-2 text-text-muted uppercase tracking-widest px-1">Ngân hàng thụ hưởng</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={isEditing ? bankSearch : getBankDisplay(formData.roleSpecificData?.bankName || '')}
                                            onChange={(e) => {
                                                setBankSearch(e.target.value);
                                                setShowBankDropdown(true);
                                            }}
                                            onFocus={() => isEditing && setShowBankDropdown(true)}
                                            placeholder="Chọn hoặc nhập tên ngân hàng"
                                            className="w-full !mt-2 !px-5 !py-4 rounded-2xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-70 font-bold text-text-main"
                                        />

                                        {isEditing && showBankDropdown && filteredBanks.length > 0 && (
                                            <div className="absolute left-0 right-0 top-full !mt-2 max-h-64 overflow-y-auto bg-surface border border-border rounded-2xl shadow-xl z-50 animate-fade-in-up">
                                                {filteredBanks.map((bank) => (
                                                    <button
                                                        key={bank.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData(prev => ({ ...prev, roleSpecificData: { ...prev.roleSpecificData, bankName: bank.bin } }));
                                                            setBankSearch(bank.shortName);
                                                            setShowBankDropdown(false);
                                                        }}
                                                        className="w-full !px-4 !py-3 flex items-center gap-3 hover:bg-primary/5 transition-colors border-b border-border/50 last:border-0"
                                                    >
                                                        <div className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center p-1 overflow-hidden flex-shrink-0">
                                                            <img src={bank.logo} alt={bank.shortName} className="max-w-full max-h-full object-contain" />
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="text-sm font-bold text-text-main">{bank.shortName}</div>
                                                            <div className="text-[10px] text-text-muted line-clamp-1">{bank.name}</div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {isEditing && showBankDropdown && (
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowBankDropdown(false)}
                                        ></div>
                                    )}
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
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                    <Icon icon="material-symbols:lock-reset-rounded" className="text-2xl" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-text-main tracking-tight">Bảo mật tài khoản</h3>
                                    <p className="text-xs font-medium text-text-muted">Thay đổi mật khẩu định kỳ để bảo vệ tài khoản</p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setIsPasswordModalOpen(true)}
                                className="!px-8 !py-4 !rounded-2xl !font-bold"
                            >
                                Đổi mật khẩu
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Change Password Modal */}
            <ChangePasswordModal 
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                token={user?.token}
            />
        </div>
    );
};

export default ProfilePage;
