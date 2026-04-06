import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';

const AccountListPage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    // Mock Data
    const [accounts, setAccounts] = useState([
        { id: '1', fullName: 'Nguyễn Văn Administrator', email: 'admin@ems.edu.vn', role: 'admin', status: 'active', joinDate: '2023-01-15' },
        { id: '2', fullName: 'Trần Thị Giáo Viên', email: 'tranthigv@ems.edu.vn', role: 'teacher', status: 'active', joinDate: '2023-06-20' },
        { id: '3', fullName: 'Lê Học Sinh', email: 'lehocsinh@ems.edu.vn', role: 'student', status: 'active', joinDate: '2023-08-05' },
        { id: '4', fullName: 'Phạm Trợ Giảng', email: 'phamtrogiang@ems.edu.vn', role: 'TA', status: 'locked', joinDate: '2023-09-12' },
        { id: '5', fullName: 'Hoàng Học Sinh', email: 'hoanghs@ems.edu.vn', role: 'student', status: 'active', joinDate: '2024-01-10' },
    ]);

    const handleToggleStatus = (accountId, currentStatus) => {
        if (window.confirm(`Bạn có chắc chắn muốn ${currentStatus === 'active' ? 'khóa' : 'mở khóa'} tài khoản này không?`)) {
            setAccounts(accounts.map(acc => {
                if (acc.id === accountId) {
                    return { ...acc, status: currentStatus === 'active' ? 'locked' : 'active' };
                }
                return acc;
            }));
            toast.success(`Đã ${currentStatus === 'active' ? 'khóa' : 'mở khóa'} tài khoản thành công!`);
        }
    };

    const filteredAccounts = accounts.filter(acc => {
        const matchesSearch = acc.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              acc.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'all' || acc.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || acc.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    const getRoleBadge = (role) => {
        switch (role) {
            case 'admin': return <span className="!px-2.5 !py-1 !bg-purple-100 text-purple-700 rounded-lg text-xs font-bold">Admin</span>;
            case 'teacher': return <span className="!px-2.5 !py-1 !bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">Giáo viên</span>;
            case 'TA': return <span className="!px-2.5 !py-1 !bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">Trợ giảng</span>;
            case 'student': return <span className="!px-2.5 !py-1 !bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">Học sinh</span>;
            default: return null;
        }
    };

    const getStatusBadge = (status) => {
        if (status === 'active') return <span className="!px-2.5 !py-1 !bg-green-100 text-green-700 rounded-lg text-xs font-bold flex items-center gap-1 w-max"><div className="w-1.5 h-1.5 rounded-full !bg-green-500"></div> Hoạt động</span>;
        return <span className="!px-2.5 !py-1 !bg-red-100 text-red-700 rounded-lg text-xs font-bold flex items-center gap-1 w-max"><div className="w-1.5 h-1.5 rounded-full !bg-red-500"></div> Đã khóa</span>;
    };

    return (
        <div className="!space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-text-main font-['Outfit']">Quản lý Tài khoản</h1>
                <p className="text-sm text-text-secondary !mt-1">Xem, tìm kiếm và phân quyền cho người dùng hệ thống.</p>
            </div>

            {/* Toolbar (Search & Filter) */}
            <div className="!bg-white !p-4 rounded-2xl border border-border shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-md">
                    <Icon icon="material-symbols:search-rounded" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-xl" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên, email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full !pl-10 !pr-4 !py-2.5 !bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="flex-1 sm:w-36 !px-4 !py-2.5 !bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text-main cursor-pointer"
                    >
                        <option value="all">Mọi vai trò</option>
                        <option value="student">Học sinh</option>
                        <option value="teacher">Giáo viên</option>
                        <option value="TA">Trợ giảng</option>
                        <option value="admin">Quản trị viên</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="flex-1 sm:w-40 !px-4 !py-2.5 !bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-text-main cursor-pointer"
                    >
                        <option value="all">Mọi trạng thái</option>
                        <option value="active">Đang hoạt động</option>
                        <option value="locked">Đang bị khóa</option>
                    </select>
                </div>
            </div>

            {/* Table Area */}
            <div className="!bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="!bg-background/50 border-b border-border text-text-secondary font-medium">
                            <tr>
                                <th className="!px-6 !py-4">Tài khoản</th>
                                <th className="!px-6 !py-4">Vai trò</th>
                                <th className="!px-6 !py-4">Trạng thái</th>
                                <th className="!px-6 !py-4">Ngày tham gia</th>
                                <th className="!px-6 !py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredAccounts.length > 0 ? (
                                filteredAccounts.map((account) => (
                                    <tr key={account.id} className="hover:!bg-background/30 transition-colors">
                                        <td className="!px-6 !py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full !bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                                                    {account.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-text-main">{account.fullName}</p>
                                                    <p className="text-xs text-text-secondary">{account.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="!px-6 !py-4">{getRoleBadge(account.role)}</td>
                                        <td className="!px-6 !py-4">{getStatusBadge(account.status)}</td>
                                        <td className="!px-6 !py-4 text-text-main font-medium">{account.joinDate}</td>
                                        <td className="!px-6 !py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => navigate(`/admin/accounts/${account.id}`)}
                                                    className="w-8 h-8 rounded-lg !bg-blue-50 text-blue-600 flex items-center justify-center hover:!bg-blue-100 transition-colors tooltip-trigger"
                                                    title="Xem chi tiết"
                                                >
                                                    <Icon icon="material-symbols:visibility-rounded" />
                                                </button>
                                                <button 
                                                    onClick={() => handleToggleStatus(account.id, account.status)}
                                                    className={`w-8 h-8 rounded-lg text-white flex items-center justify-center transition-colors tooltip-trigger ${
                                                        account.status === 'active' 
                                                        ? '!bg-red-500 hover:!bg-red-600' 
                                                        : '!bg-green-500 hover:!bg-green-600'
                                                    }`}
                                                    title={account.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                                                >
                                                    <Icon icon={account.status === 'active' ? "material-symbols:lock-person-rounded" : "material-symbols:lock-open-rounded"} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="!px-6 !py-12 text-center text-text-secondary">
                                        <div className="flex flex-col items-center justify-center">
                                            <Icon icon="material-symbols:search-off-rounded" className="text-4xl text-text-secondary/50 !mb-2" />
                                            <p>Không tìm thấy tài khoản nào khớp với bộ lọc.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination (Mock) */}
                <div className="!px-6 !py-4 border-t border-border flex items-center justify-between text-sm text-text-secondary !bg-background/30">
                    <p>Hiển thị <b>{filteredAccounts.length}</b> tài khoản</p>
                    <div className="flex items-center gap-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:!bg-white border border-border disabled:opacity-50" disabled>
                            <Icon icon="material-symbols:chevron-left-rounded" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg !bg-primary text-white font-medium">1</button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:!bg-white border border-border disabled:opacity-50" disabled>
                            <Icon icon="material-symbols:chevron-right-rounded" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountListPage;
