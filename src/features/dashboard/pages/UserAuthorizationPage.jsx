import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';

const UserAuthorizationPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');

    const users = [
        { id: 'ADM001', name: 'Admin Tổng', email: 'admin@ems.edu.vn', role: 'admin', status: 'Active' },
        { id: 'TCH001', name: 'Giáo viên Toán', email: 'math@ems.edu.vn', role: 'teacher', status: 'Active' },
        { id: 'TA001', name: 'Lê Thảo Nhi', email: 'nhi@ta.edu.vn', role: 'assistant', status: 'Active' },
        { id: 'STU001', name: 'Nguyễn Văn A', email: 'studentA@ems.edu.vn', role: 'student', status: 'Inactive' },
    ];

    const getRoleBadge = (role) => {
        const roles = {
            admin: { label: 'Admin', color: 'bg-red-100 text-red-700' },
            teacher: { label: 'Giáo viên', color: 'bg-blue-100 text-blue-700' },
            assistant: { label: 'Trợ giảng', color: 'bg-purple-100 text-purple-700' },
            student: { label: 'Học sinh', color: 'bg-green-100 text-green-700' },
        };
        const mapped = roles[role] || { label: 'Unknown', color: 'bg-gray-100 text-gray-700' };
        return <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${mapped.color}`}>{mapped.label}</span>;
    };

    const handleRoleChange = (userId, newRole) => {
        toast.success(`Quyền của người dùng ${userId} đã được đổi thành ${newRole}`);
    };

    return (
        <div className="w-full mx-auto space-y-6 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface p-6 rounded-[2rem] border border-border shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-text-main flex items-center gap-3">
                        <Icon icon="material-symbols:admin-panel-settings-rounded" className="text-primary text-3xl" />
                        Quản lý Phân quyền Hệ thống
                    </h1>
                    <p className="text-text-muted mt-1">Giao diện độc quyền dành cho Administrator.</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <select 
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="px-4 py-2 border border-border bg-background rounded-xl font-medium text-text-main focus:outline-none focus:border-primary"
                    >
                        <option value="all">Tất cả nhóm quyền</option>
                        <option value="admin">Admin</option>
                        <option value="teacher">Giáo viên</option>
                        <option value="assistant">Trợ giảng</option>
                        <option value="student">Học sinh</option>
                    </select>
                    <div className="relative flex-1 sm:w-64">
                        <Icon icon="material-symbols:search-rounded" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xl" />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm email, tên..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:border-primary font-medium"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-surface rounded-[2rem] border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-background/50 border-b border-border">
                                <th className="p-4 font-semibold text-text-muted uppercase tracking-wider text-xs">Mã định danh</th>
                                <th className="p-4 font-semibold text-text-muted uppercase tracking-wider text-xs">Thông tin Người dùng</th>
                                <th className="p-4 font-semibold text-text-muted uppercase tracking-wider text-xs text-center">Trạng thái</th>
                                <th className="p-4 font-semibold text-text-muted uppercase tracking-wider text-xs text-center">Nhóm Quyền (Role)</th>
                                <th className="p-4 font-semibold text-text-muted uppercase tracking-wider text-xs text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-primary/5 transition-colors group">
                                    <td className="p-4 font-mono text-sm text-text-main">{user.id}</td>
                                    <td className="p-4 font-medium text-text-main">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs uppercase">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div>{user.name}</div>
                                                <div className="text-xs text-text-muted font-normal">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                            user.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                                        }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        {/* In real app, changing admin role would be restricted */}
                                        <div className="flex items-center justify-center gap-2">
                                            {getRoleBadge(user.role)}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <select 
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            className="px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-semibold text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Chuyển quyền...</option>
                                            <option value="admin">Cấp quyền Admin</option>
                                            <option value="teacher">Cấp quyền Giáo viên</option>
                                            <option value="assistant">Cấp quyền Trợ giảng</option>
                                            <option value="student">Cấp quyền Học sinh</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserAuthorizationPage;
