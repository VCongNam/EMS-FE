import React, { useState } from 'react';
import { Icon } from '@iconify/react';

const ViewTAListPage = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const tas = [
        { id: 'TA001', name: 'Lê Thảo Nhi', email: 'ltn@ta.edu.vn', phone: '0909001122', classes: 2, status: 'Active' },
        { id: 'TA002', name: 'Nguyễn Quang Vinh', email: 'nqv@ta.edu.vn', phone: '0912112233', classes: 1, status: 'Active' },
        { id: 'TA003', name: 'Trần Minh Tuấn', email: 'tmt@ta.edu.vn', phone: '0988776655', classes: 0, status: 'Inactive' },
    ];

    return (
        <div className="w-full mx-auto space-y-6 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface p-6 rounded-[2rem] border border-border shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-text-main flex items-center gap-3">
                        <Icon icon="material-symbols:badge-rounded" className="text-primary text-3xl" />
                        Danh sách Trợ giảng (TA)
                    </h1>
                    <p className="text-text-muted mt-1">Quản lý đội ngũ trợ giảng của trung tâm.</p>
                </div>
                <div className="relative w-full sm:w-64">
                    <Icon icon="material-symbols:search-rounded" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xl" />
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm TA..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-text-main"
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-surface rounded-[2rem] border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-background/50 border-b border-border">
                                <th className="p-4 font-semibold text-text-muted uppercase tracking-wider text-xs">Mã TA</th>
                                <th className="p-4 font-semibold text-text-muted uppercase tracking-wider text-xs">Họ và Tên</th>
                                <th className="p-4 font-semibold text-text-muted uppercase tracking-wider text-xs">Liên hệ</th>
                                <th className="p-4 font-semibold text-text-muted uppercase tracking-wider text-xs text-center">Lớp phụ trách</th>
                                <th className="p-4 font-semibold text-text-muted uppercase tracking-wider text-xs text-center">Trạng thái</th>
                                <th className="p-4 font-semibold text-text-muted uppercase tracking-wider text-xs text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {tas.map((ta) => (
                                <tr key={ta.id} className="hover:bg-primary/5 transition-colors group">
                                    <td className="p-4 font-mono text-sm text-text-main">{ta.id}</td>
                                    <td className="p-4 font-medium text-text-main">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs uppercase">
                                                {ta.name.charAt(0)}
                                            </div>
                                            {ta.name}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm text-text-main">{ta.email}</div>
                                        <div className="text-xs text-text-muted">{ta.phone}</div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="font-bold text-text-main">{ta.classes}</span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            ta.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {ta.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="p-2 text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-primary/10">
                                            <Icon icon="material-symbols:edit-document-rounded" className="text-xl" />
                                        </button>
                                        <button className="p-2 text-text-muted hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                                            <Icon icon="material-symbols:delete-rounded" className="text-xl" />
                                        </button>
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

export default ViewTAListPage;
