import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';

const AccountDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mock Data based on ID (In a real app, you would fetch this from an API using the `id`)
    const account = {
        id,
        fullName: 'Nguyễn Văn Administrator',
        email: 'admin@ems.edu.vn',
        phone: '0901234567',
        role: 'admin',
        status: 'active',
        joinDate: '2023-01-15',
        lastLogin: '2026-04-03 15:30:00',
        activities: [
            { id: 1, action: 'Đăng nhập hệ thống', time: '2026-04-03 15:30:00', status: 'success' },
            { id: 2, action: 'Cập nhật phân quyền user #5', time: '2026-04-02 09:15:22', status: 'success' },
            { id: 3, action: 'Đổi mật khẩu', time: '2026-03-25 14:00:10', status: 'success' }
        ]
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'admin': return <span className="!px-3 !py-1.5 !bg-purple-100 text-purple-700 rounded-lg text-sm font-bold">Admin</span>;
            case 'teacher': return <span className="!px-3 !py-1.5 !bg-emerald-100 text-emerald-700 rounded-lg text-sm font-bold">Giáo viên</span>;
            case 'TA': return <span className="!px-3 !py-1.5 !bg-amber-100 text-amber-700 rounded-lg text-sm font-bold">Trợ giảng</span>;
            case 'student': return <span className="!px-3 !py-1.5 !bg-blue-100 text-blue-700 rounded-lg text-sm font-bold">Học sinh</span>;
            default: return null;
        }
    };

    const getStatusBadge = (status) => {
        if (status === 'active') return <span className="!px-3 !py-1.5 !bg-green-100 text-green-700 rounded-lg text-sm font-bold flex items-center gap-1 w-max"><div className="w-2 h-2 rounded-full !bg-green-500"></div> Hoạt động</span>;
        return <span className="!px-3 !py-1.5 !bg-red-100 text-red-700 rounded-lg text-sm font-bold flex items-center gap-1 w-max"><div className="w-2 h-2 rounded-full !bg-red-500"></div> Đã khóa</span>;
    };

    return (
        <div className="!space-y-6">
            {/* Header / Back Button */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => navigate('/admin/accounts')}
                    className="w-10 h-10 flex items-center justify-center rounded-xl !bg-white border border-border text-text-secondary hover:text-primary hover:border-primary/30 transition-all shadow-sm"
                >
                    <Icon icon="material-symbols:arrow-back-rounded" className="text-2xl" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-text-main font-['Outfit']">Hồ sơ Tài khoản</h1>
                    <p className="text-sm text-text-secondary !mt-1">Chi tiết thông tin và lịch sử hoạt động của người dùng.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="!bg-white !p-6 rounded-2xl border border-border shadow-sm lg:col-span-1 h-fit">
                    <div className="flex flex-col items-center text-center pb-6 border-b border-border">
                        <div className="w-24 h-24 rounded-full !bg-primary/10 text-primary flex items-center justify-center font-bold text-4xl !mb-4 border-4 border-white shadow-md">
                            {account.fullName.charAt(0)}
                        </div>
                        <h2 className="text-xl font-bold text-text-main font-['Outfit']">{account.fullName}</h2>
                        <p className="text-text-secondary !mt-1">{account.email}</p>
                        <div className="flex items-center gap-2 !mt-4">
                            {getRoleBadge(account.role)}
                            {getStatusBadge(account.status)}
                        </div>
                    </div>
                    <div className="!pt-6 !space-y-4">
                        <div>
                            <p className="text-xs text-text-muted font-medium mb-1">Số điện thoại</p>
                            <p className="text-sm font-medium text-text-main">{account.phone || 'Chưa cập nhật'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-text-muted font-medium mb-1">Ngày đăng ký</p>
                            <p className="text-sm font-medium text-text-main">{account.joinDate}</p>
                        </div>
                        <div>
                            <p className="text-xs text-text-muted font-medium mb-1">Cập nhật cuối</p>
                            <p className="text-sm font-medium text-text-main">{account.lastLogin}</p>
                        </div>
                    </div>
                    <div className="!mt-6 !pt-6 border-t border-border flex flex-col gap-3">
                        <button className="w-full !py-2.5 rounded-xl !bg-primary/10 text-primary font-bold hover:!bg-primary/20 transition-all text-sm flex items-center justify-center gap-2">
                            <Icon icon="material-symbols:edit-document-rounded" className="text-lg" />
                            Cập nhật thông tin
                        </button>
                        <button className="w-full !py-2.5 rounded-xl !bg-red-50 text-red-600 font-bold hover:!bg-red-100 transition-all text-sm flex items-center justify-center gap-2">
                            <Icon icon="material-symbols:lock-person-rounded" className="text-lg" />
                            Khóa tài khoản
                        </button>
                    </div>
                </div>

                {/* Activity & Stats */}
                <div className="!bg-white !p-6 rounded-2xl border border-border shadow-sm lg:col-span-2">
                    <h3 className="text-lg font-bold text-text-main font-['Outfit'] !mb-6">Hoạt động gần đây</h3>
                    
                    {/* Timeline */}
                    <div className="relative border-l-2 border-border !ml-3 !space-y-8">
                        {account.activities.map((activity, index) => (
                            <div key={activity.id} className="relative !pl-6">
                                {/* Dot */}
                                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full !bg-white border-2 border-primary"></div>
                                
                                <div className="!bg-background/50 !p-4 rounded-xl border border-border">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-text-main text-sm">{activity.action}</h4>
                                        <span className="text-xs font-medium text-text-secondary">{activity.time}</span>
                                    </div>
                                    <div className="flex items-center gap-1 !mt-2">
                                        <Icon icon="material-symbols:check-circle-rounded" className="text-green-500" />
                                        <span className="text-xs text-green-600 font-medium capitalize">Thành công</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountDetailPage;
