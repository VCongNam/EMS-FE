import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import { adminService } from '../api/adminService';
import AccountDetailDrawer from '../components/AccountDetailDrawer';

const AccountListPage = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    
    // Drawer State
    const [selectedAccountId, setSelectedAccountId] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        setLoading(true);
        try {
            const data = await adminService.getAccounts();
            setAccounts(data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDrawer = (id) => {
        setSelectedAccountId(id);
        setIsDrawerOpen(true);
    };

    // Client-side filtering
    const filteredAccounts = accounts.filter(acc => {
        const matchesSearch = acc.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              acc.phoneNumber?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || acc.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Client-side pagination logic
    const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
    const paginatedAccounts = filteredAccounts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    useEffect(() => {
        setCurrentPage(1); // Reset to first page when filtering
    }, [searchQuery, statusFilter]);

    const getStatusBadge = (status) => {
        if (status === 'Active') return <span className="!px-3 !py-1 !bg-green-50 text-green-700 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 w-max border border-green-100"><div className="w-1.5 h-1.5 rounded-full !bg-green-500"></div> Hoạt động</span>;
        if (status === 'Banned') return <span className="!px-3 !py-1 !bg-red-50 text-red-700 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 w-max border border-red-100"><div className="w-1.5 h-1.5 rounded-full !bg-red-500"></div> Đã khóa</span>;
        return <span className="!px-3 !py-1 !bg-slate-50 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 w-max border border-slate-100"><div className="w-1.5 h-1.5 rounded-full !bg-slate-500"></div> {status}</span>;
    };

    return (
        <div className="!space-y-6 animate-fade-in relative">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-text-main font-['Outfit'] tracking-tight">Quản lý Tài khoản</h1>
                    <p className="text-sm text-text-secondary !mt-1">Xem, tìm kiếm và quản lý quyền người dùng trong toàn hệ thống.</p>
                </div>
                <div className="flex items-center gap-2 !bg-blue-50 !px-4 !py-2 rounded-2xl border border-blue-100">
                    <Icon icon="solar:users-group-rounded-bold-duotone" className="text-2xl text-blue-600" />
                    <div>
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Tổng người dùng</p>
                        <p className="text-sm font-black text-blue-700 leading-none">{accounts.length}</p>
                    </div>
                </div>
            </div>

            {/* Toolbar (Search & Filter) */}
            <div className="!bg-white !p-4 rounded-3xl border border-border shadow-soft flex flex-col xl:flex-row gap-4 items-center justify-between">
                <div className="relative w-full xl:max-w-xl">
                    <Icon icon="solar:magnifer-bold-duotone" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-xl" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo Tên hoặc Số điện thoại..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full !pl-12 !pr-5 !py-3.5 !bg-background border-2 border-transparent rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary focus:!bg-white transition-all placeholder:text-text-muted"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                    <div className="flex items-center gap-2 !bg-background !px-3 !py-1.5 rounded-2xl border border-border flex-1 xl:flex-none">
                        <Icon icon="solar:shield-check-bold-duotone" className="text-text-secondary text-lg" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="!bg-transparent border-none text-xs font-black uppercase tracking-wider focus:ring-0 cursor-pointer text-text-main py-2 pr-8"
                        >
                            <option value="all">Tất cả trạng thái</option>
                            <option value="Active">Đang hoạt động</option>
                            <option value="Banned">Đã bị khóa</option>
                            <option value="Unverified">Chưa xác minh</option>
                        </select>
                    </div>

                    <button 
                        onClick={fetchAccounts}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl !bg-primary/10 text-primary hover:!bg-primary hover:text-white transition-all shadow-sm"
                        title="Làm mới dữ liệu"
                    >
                        <Icon icon="solar:restart-bold-duotone" className="text-2xl" />
                    </button>
                </div>
            </div>

            {/* Table Area */}
            <div className="!bg-white rounded-3xl border border-border shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="!bg-background/50 border-b border-border text-[10px] font-black uppercase tracking-widest text-text-secondary">
                            <tr>
                                <th className="!px-8 !py-5">Người dùng (GV)</th>
                                <th className="!px-6 !py-5">SĐT</th>
                                <th className="!px-6 !py-5">Số Lớp</th>
                                <th className="!px-6 !py-5">Sĩ Số</th>
                                <th className="!px-6 !py-5">Ngày tạo</th>
                                <th className="!px-6 !py-5">Trạng thái</th>
                                <th className="!px-8 !py-5 text-right">Quản lý</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, idx) => (
                                    <tr key={idx} className="animate-pulse">
                                        <td className="!px-8 !py-5"><div className="h-10 w-48 !bg-slate-100 rounded-xl"></div></td>
                                        <td className="!px-6 !py-5"><div className="h-6 w-20 !bg-slate-100 rounded-lg"></div></td>
                                        <td className="!px-6 !py-5"><div className="h-6 w-16 !bg-slate-100 rounded-lg"></div></td>
                                        <td className="!px-6 !py-5"><div className="h-6 w-16 !bg-slate-100 rounded-lg"></div></td>
                                        <td className="!px-6 !py-5"><div className="h-6 w-32 !bg-slate-100 rounded-lg"></div></td>
                                        <td className="!px-6 !py-5"><div className="h-6 w-24 !bg-slate-100 rounded-lg"></div></td>
                                        <td className="!px-8 !py-5 text-right"><div className="h-8 w-8 !bg-slate-100 rounded-lg ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : paginatedAccounts.length > 0 ? (
                                paginatedAccounts.map((account) => (
                                    <tr key={account.teacherId} className="group hover:!bg-background/40 transition-all">
                                        <td className="!px-8 !py-5">
                                            <div className="flex items-center gap-4">
                                                {account.avatarUrl ? (
                                                    <img src={account.avatarUrl} alt="Avatar" className="w-11 h-11 rounded-2xl object-cover shrink-0 border-2 border-white shadow-sm group-hover:scale-110 transition-transform" />
                                                ) : (
                                                    <div className="w-11 h-11 rounded-2xl !bg-primary/10 text-primary flex items-center justify-center font-black text-lg shrink-0 border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                                                        {account.fullName?.charAt(0) || 'U'}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-black text-text-main text-sm">{account.fullName}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="!px-6 !py-5 font-medium text-xs text-text-secondary">{account.phoneNumber || 'N/A'}</td>
                                        <td className="!px-6 !py-5">
                                            <span className="!px-2.5 !py-1 rounded-xl !bg-slate-100 text-slate-700 text-[11px] font-bold">
                                                {account.activeClassesCount || 0} lớp
                                            </span>
                                        </td>
                                        <td className="!px-6 !py-5">
                                            <span className="!px-2.5 !py-1 rounded-xl !bg-blue-50 text-blue-600 text-[11px] font-bold">
                                                {account.totalStudentsCount || 0} hs
                                            </span>
                                        </td>
                                        <td className="!px-6 !py-5">
                                            <span className="text-xs font-bold text-text-secondary">
                                                {new Date(account.joinedDate).toLocaleDateString('vi-VN')}
                                            </span>
                                        </td>
                                        <td className="!px-6 !py-5">{getStatusBadge(account.status)}</td>
                                        <td className="!px-8 !py-5 text-right">
                                            <button 
                                                onClick={() => handleOpenDrawer(account.teacherId)}
                                                className="w-10 h-10 rounded-xl !bg-primary text-white flex items-center justify-center hover:!bg-primary-dark transition-all shadow-md active:scale-95"
                                                title="Xem và chỉnh sửa"
                                            >
                                                <Icon icon="solar:settings-minimalistic-bold-duotone" className="text-xl" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="!px-6 !py-20 text-center">
                                        <div className="flex flex-col items-center justify-center max-w-xs mx-auto">
                                            <div className="w-20 h-20 !bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                <Icon icon="solar:user-block-bold-duotone" className="text-5xl text-slate-300" />
                                            </div>
                                            <h3 className="text-lg font-black text-text-main">Không có kết quả</h3>
                                            <p className="text-sm text-text-secondary mt-1">Chúng tôi không tìm thấy tài khoản nào phù hợp với bộ lọc hiện tại của bạn.</p>
                                            <button 
                                                onClick={() => {setSearchQuery(''); setStatusFilter('all');}}
                                                className="!mt-4 text-primary font-bold hover:underline text-sm"
                                            >
                                                Xóa tất cả bộ lọc
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination (Client-side) */}
                <div className="!px-8 !py-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 !bg-background/20">
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                        Trang <b>{currentPage}</b> / {totalPages || 1} — Hiển thị <b>{paginatedAccounts.length}</b> tài khoản
                    </p>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="w-10 h-10 flex items-center justify-center rounded-xl hover:!bg-white border border-border disabled:opacity-30 transition-all shadow-sm shadow-black/5"
                        >
                            <Icon icon="solar:double-alt-arrow-left-bold-duotone" className="text-xl" />
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 flex items-center justify-center rounded-xl font-black text-sm transition-all shadow-sm ${
                                    currentPage === page 
                                    ? '!bg-primary text-white shadow-primary/20 transform scale-110' 
                                    : 'hover:!bg-white border border-border'
                                }`}
                            >
                                {page}
                            </button>
                        )).slice(Math.max(0, currentPage - 2), Math.min(totalPages, currentPage + 1))}

                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="w-10 h-10 flex items-center justify-center rounded-xl hover:!bg-white border border-border disabled:opacity-30 transition-all shadow-sm shadow-black/5"
                        >
                            <Icon icon="solar:double-alt-arrow-right-bold-duotone" className="text-xl" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Account Detail Drawer */}
            <AccountDetailDrawer
                accountId={selectedAccountId}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                onUpdateSuccess={fetchAccounts}
            />
        </div>
    );
};

export default AccountListPage;
