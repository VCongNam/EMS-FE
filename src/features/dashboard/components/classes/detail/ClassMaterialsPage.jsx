import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import useAuthStore from '../../../../../store/authStore';

const mockMaterials = [
    { id: 'm1', name: 'Bài giảng tuần 1: Tổng quan', type: 'pdf', size: '2.5 MB', date: '2026-03-20', uploader: 'Nguyễn Văn A' },
    { id: 'm2', name: 'Slide bài giảng - Chương 1', type: 'ppt', size: '5.1 MB', date: '2026-03-21', uploader: 'Trần Thị B' },
    { id: 'm3', name: 'Video hướng dẫn cài đặt môi trường', type: 'video', size: '150 MB', date: '2026-03-22', uploader: 'Nguyễn Văn A' },
    { id: 'm4', name: 'Tài liệu tham khảo bổ sung', type: 'doc', size: '1.2 MB', date: '2026-03-23', uploader: 'Lê Văn C' }
];

const getFileIcon = (type) => {
    switch(type) {
        case 'pdf': return <Icon icon="vscode-icons:file-type-pdf2" className="text-4xl" />;
        case 'ppt': return <Icon icon="vscode-icons:file-type-powerpoint" className="text-4xl" />;
        case 'doc': return <Icon icon="vscode-icons:file-type-word" className="text-4xl" />;
        case 'video': return <Icon icon="vscode-icons:file-type-video" className="text-4xl" />;
        default: return <Icon icon="material-symbols:insert-drive-file" className="text-4xl text-gray-400" />;
    }
};

const ClassMaterialsPage = () => {
    const { user } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState('');
    
    // RBAC check
    const userRole = user?.role?.toUpperCase();
    const isTeacherOrTA = userRole === 'TEACHER' || userRole === 'TA';

    const filteredMaterials = mockMaterials.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-6  animate-fade-in-up">
            <div className="bg-surface rounded-2xl border !mb-2 border-border !p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-text-main !mb-1">Tài liệu học tập</h2>
                    <p className="text-text-muted text-sm">Tổng hợp các tài liệu, bài giảng và tệp tin của lớp học</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Icon icon="material-symbols:search-rounded" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xl" />
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm tài liệu..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-background border border-border rounded-xl !py-2 !pl-10 !pr-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        />
                    </div>
                    {isTeacherOrTA && (
                        <button className="w-full sm:w-auto flex items-center justify-center gap-2 !bg-primary text-white font-semibold !px-4 !py-2 rounded-xl hover:bg-primary-hover transition-colors shadow-sm shadow-primary/20 whitespace-nowrap">
                            <Icon icon="material-symbols:upload-rounded" className="text-xl" />
                            Tải lên
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-background/50 border-b border-border">
                                <th className="!p-4 font-semibold text-text-muted text-sm">Tên tài liệu</th>
                                <th className="!p-4 font-semibold text-text-muted text-sm hidden sm:table-cell">Kích thước</th>
                                <th className="!p-4 font-semibold text-text-muted text-sm hidden md:table-cell">Người đăng</th>
                                <th className="!p-4 font-semibold text-text-muted text-sm">Ngày tải lên</th>
                                <th className="!p-4 font-semibold text-text-muted text-sm text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMaterials.map((material) => (
                                <tr key={material.id} className="border-b border-border hover:bg-surface-hover transition-colors group">
                                    <td className="!p-4">
                                        <div className="flex items-center gap-3">
                                            {getFileIcon(material.type)}
                                            <span className="font-medium text-text-main group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
                                                {material.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="!p-4 text-text-muted text-sm hidden sm:table-cell">{material.size}</td>
                                    <td className="!p-4 text-text-muted text-sm hidden md:table-cell">{material.uploader}</td>
                                    <td className="!p-4 text-text-muted text-sm">{material.date}</td>
                                    <td className="!p-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="text-text-muted hover:text-primary transition-colors !p-2 rounded-lg hover:bg-primary/10 tooltip-trigger" title="Tải xuống">
                                                <Icon icon="material-symbols:download-rounded" className="text-xl" />
                                            </button>
                                            {isTeacherOrTA && (
                                                <button className="text-text-muted hover:text-red-500 transition-colors !p-2 rounded-lg hover:bg-red-500/10 tooltip-trigger" title="Xóa">
                                                    <Icon icon="material-symbols:delete-outline-rounded" className="text-xl" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredMaterials.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="!p-8 text-center text-text-muted">
                                        Không tìm thấy tài liệu phù hợp
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

export default ClassMaterialsPage;
