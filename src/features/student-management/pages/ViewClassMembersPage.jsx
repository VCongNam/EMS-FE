import React, { useState } from 'react';
import { Icon } from '@iconify/react';

const ViewClassMembersPage = () => {
    const [searchQuery, setSearchQuery] = useState('');

    // Dummy data for visual representation
    const members = [
        { id: 'STU001', name: 'Nguyễn Văn A', email: 'nva@example.com', phone: '0901234567', attendance: '95%' },
        { id: 'STU002', name: 'Trần Thị B', email: 'ttb@example.com', phone: '0912345678', attendance: '88%' },
        { id: 'STU003', name: 'Lê Văn C', email: 'lvc@example.com', phone: '0923456789', attendance: '100%' },
    ];

    return (
        <div className="w-full mx-auto space-y-6 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface p-6 rounded-[2rem] border border-border shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-text-main flex items-center gap-3">
                        <Icon icon="material-symbols:group-rounded" className="text-primary text-3xl" />
                        Danh sách học sinh
                    </h1>
                    <p className="text-text-muted mt-1">Lớp: Toán Cao Cấp (MATH101)</p>
                </div>
                <div className="relative w-full sm:w-64">
                    <Icon icon="material-symbols:search-rounded" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xl" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm học sinh..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>
            </div>

            {/* Content Section */}
            <div className="bg-surface rounded-[2rem] border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-background/50 border-b border-border">
                                <th className="p-4 font-semibold text-text-muted uppercase tracking-wider text-xs">Mã HS</th>
                                <th className="p-4 font-semibold text-text-muted uppercase tracking-wider text-xs">Họ và Tên</th>
                                <th className="p-4 font-semibold text-text-muted uppercase tracking-wider text-xs hidden sm:table-cell">Liên hệ</th>
                                <th className="p-4 font-semibold text-text-muted uppercase tracking-wider text-xs text-center">Tỷ lệ đi học</th>
                                <th className="p-4 font-semibold text-text-muted uppercase tracking-wider text-xs text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {members.map((member) => (
                                <tr key={member.id} className="hover:bg-primary/5 transition-colors group">
                                    <td className="p-4 font-mono text-sm text-text-main">{member.id}</td>
                                    <td className="p-4 font-medium text-text-main">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs uppercase">
                                                {member.name.charAt(0)}
                                            </div>
                                            {member.name}
                                        </div>
                                    </td>
                                    <td className="p-4 hidden sm:table-cell">
                                        <div className="text-sm text-text-main">{member.email}</div>
                                        <div className="text-xs text-text-muted">{member.phone}</div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                            {member.attendance}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button className="p-2 text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-primary/10">
                                            <Icon icon="material-symbols:info-outline-rounded" className="text-xl" />
                                        </button>
                                        <button className="p-2 text-text-muted hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                                            <Icon icon="material-symbols:person-remove-rounded" className="text-xl" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {members.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-text-muted">
                                        Không tìm thấy học sinh nào.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ViewClassMembersPage;
