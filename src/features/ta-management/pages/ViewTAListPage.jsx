import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Button from "../../../components/ui/Button";
import AssignClassModal from '../../student-management/components/AssignClassModal';
import CreateAssistantModal from '../components/CreateAssistantModal';

const ViewTAListPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedAssistantForAssign, setSelectedAssistantForAssign] = useState(null);

    const [assistants, setAssistants] = useState([
        { id: 'TA001', name: 'Lê Thảo Nhi', email: 'ltn@ta.edu.vn', phone: '0901234567', status: 'active', class: 'MATH101' },
        { id: 'TA002', name: 'Trần Văn Mạnh', email: 'manh@ta.edu.vn', phone: '0912345678', status: 'active', class: 'Chưa có lớp' },
        { id: 'TA003', name: 'Nguyễn Thị Hoa', email: 'hoa@ta.edu.vn', phone: '0923456789', status: 'inactive', class: 'Chưa có lớp' },
        { id: 'TA004', name: 'Phạm Đức Anh', email: 'anh@ta.edu.vn', phone: '0934567890', status: 'active', class: 'CS101' },
    ]);

    const handleCreateAssistant = (newAssistantData) => {
        const newId = `TA00${assistants.length + 1}`;
        const newAssistant = {
            id: newId,
            name: newAssistantData.fullName,
            email: newAssistantData.username + '@ta.edu.vn', // Simplified mock
            phone: newAssistantData.phone,
            status: 'active',
            class: 'Chưa có lớp'
        };
        setAssistants([newAssistant, ...assistants]);
    };

    const handleOpenAssignModal = (assistant) => {
        setSelectedAssistantForAssign(assistant);
        setIsAssignModalOpen(true);
    };

    const handleAssignClass = (assistantId, className) => {
        setAssistants(assistants.map(a => 
            a.id === assistantId ? { ...a, class: className } : a
        ));
    };

    const filteredAssistants = assistants.filter(assistant => {
        const matchesSearch =
            assistant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            assistant.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            assistant.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || assistant.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="w-full !mx-auto !space-y-6 animate-fade-in !pb-8">



            {/* Filters Section */}
            <div className="bg-surface !p-4 sm:!p-6 rounded-[2rem] border border-border shadow-sm !space-y-4">
                <div className="flex flex-col sm:flex-row items-center !gap-4">
                    <div className="relative w-full sm:flex-1">
                        <Icon icon="solar:magnifer-linear" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-lg" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo Tên, Mã TG, Email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full !pl-11 !pr-4 !py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-text-main"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main">
                                <Icon icon="solar:close-circle-bold" className="text-lg" />
                            </button>
                        )}
                    </div>
                    <div className="w-full sm:w-48 shrink-0">
                        <div className="relative flex items-center">
                            <Icon icon="solar:filter-bold-duotone" className="absolute left-4 text-text-muted text-lg pointer-events-none" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full !pl-11 !pr-10 !py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-medium text-text-main appearance-none cursor-pointer"
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="active">Đang dạy</option>
                                <option value="inactive">Đã nghỉ</option>
                            </select>
                            <Icon icon="solar:alt-arrow-down-linear" className="absolute right-4 text-text-muted text-lg pointer-events-none" />
                        </div>
                    </div>
                </div>
                <div className="!pt-2 flex items-center justify-between text-sm">
                    <span className="text-text-muted font-medium">
                        Hiển thị <strong className="text-primary">{filteredAssistants.length}</strong> trợ giảng
                    </span>
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-surface rounded-3xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="bg-background/80 border-b border-border">
                                <th className="!p-5 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap">Mã TG</th>
                                <th className="!p-5 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap">Trợ giảng</th>
                                <th className="!p-5 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap">Lớp phụ trách</th>
                                <th className="!p-5 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap text-center">Trạng thái</th>
                                <th className="!p-5 font-semibold text-text-muted uppercase tracking-wider text-xs whitespace-nowrap text-right w-[100px]">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {filteredAssistants.map((assistant) => (
                                <tr key={assistant.id} className="hover:bg-primary/5 transition-colors group">
                                    <td className="!p-5 font-mono text-sm text-text-muted font-medium">{assistant.id}</td>
                                    <td className="!p-5 text-text-main">
                                        <div className="flex items-center !gap-3 w-max">
                                            <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-sm uppercase shrink-0">
                                                {assistant.name.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-[15px]">{assistant.name}</span>
                                                <div className="flex items-center !gap-2 !mt-0.5 text-xs text-text-muted">
                                                    <span className="flex items-center !gap-1"><Icon icon="solar:letter-linear" /> {assistant.email}</span>
                                                    {assistant.phone && (<><span>•</span><span className="flex items-center !gap-1"><Icon icon="solar:phone-linear" /> {assistant.phone}</span></>)}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="!p-5">
                                        {assistant.class === 'Chưa có lớp' ? (
                                            <span className="text-text-muted text-sm italic">{assistant.class}</span>
                                        ) : (
                                            <span className="!px-3 !py-1 bg-background border border-border rounded-lg text-sm font-semibold text-text-main shadow-sm">{assistant.class}</span>
                                        )}
                                    </td>
                                    <td className="!p-5 text-center">
                                        <div className="flex justify-center">
                                            {assistant.status === 'active' ? (
                                                <span className="inline-flex items-center !px-3 !py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-600 border border-green-500/20 whitespace-nowrap">Đang dạy</span>
                                            ) : (
                                                <span className="inline-flex items-center !px-3 !py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 border border-red-500/20 whitespace-nowrap">Đã nghỉ</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="!p-5 text-right">
                                        <div className="flex items-center justify-end !gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleOpenAssignModal(assistant)}
                                                className="!p-2 text-text-muted hover:text-green-500 transition-colors rounded-xl hover:bg-green-500/10" 
                                                title="Xếp lớp"
                                            >
                                                <Icon icon="solar:square-academic-cap-2-bold-duotone" className="text-xl" />
                                            </button>
                                            <button className="!p-2 text-text-muted hover:text-primary transition-colors rounded-xl hover:bg-primary/10" title="Chỉnh sửa thông tin">
                                                <Icon icon="solar:pen-bold-duotone" className="text-xl" />
                                            </button>
                                            <button className="!p-2 text-text-muted hover:text-red-500 transition-colors rounded-xl hover:bg-red-500/10" title="Xóa trợ giảng">
                                                <Icon icon="solar:trash-bin-trash-bold-duotone" className="text-xl" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredAssistants.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="!p-16 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-70">
                                            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center !mb-4 border border-border">
                                                <Icon icon="solar:ghost-smile-bold-duotone" className="text-4xl text-text-muted" />
                                            </div>
                                            <h3 className="text-lg font-bold text-text-main !mb-1">Không tìm thấy dữ liệu</h3>
                                            <p className="text-text-muted font-medium">Hãy thử điều chỉnh lại bộ lọc tìm kiếm.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {filteredAssistants.length > 0 && (
                    <div className="!p-5 border-t border-border bg-background/30 flex items-center justify-between">
                        <span className="text-sm font-medium text-text-muted">Trang 1 / 1</span>
                        <div className="flex !gap-2">
                            <Button variant="outline" className="!px-3" disabled><Icon icon="solar:alt-arrow-left-linear" /></Button>
                            <Button variant="outline" className="!px-3" disabled><Icon icon="solar:alt-arrow-right-linear" /></Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden !space-y-3">
                {filteredAssistants.length === 0 ? (
                    <div className="bg-surface rounded-3xl border border-border !p-12 text-center">
                        <div className="flex flex-col items-center justify-center opacity-70">
                            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center !mb-4 border border-border">
                                <Icon icon="solar:ghost-smile-bold-duotone" className="text-4xl text-text-muted" />
                            </div>
                            <h3 className="text-lg font-bold text-text-main !mb-1">Không tìm thấy dữ liệu</h3>
                            <p className="text-text-muted font-medium">Hãy thử điều chỉnh lại bộ lọc.</p>
                        </div>
                    </div>
                ) : (
                    filteredAssistants.map((assistant) => (
                        <div key={assistant.id} className="bg-surface rounded-2xl border border-border shadow-sm !p-4 flex flex-col !gap-3">
                            {/* Top row: avatar + name + status */}
                            <div className="flex items-center justify-between !gap-3">
                                <div className="flex items-center !gap-3 min-w-0">
                                    <div className="w-11 h-11 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-base uppercase shrink-0">
                                        {assistant.name.charAt(0)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-text-main truncate">{assistant.name}</p>
                                        <p className="text-xs font-mono text-text-muted">{assistant.id}</p>
                                    </div>
                                </div>
                                {assistant.status === 'active' ? (
                                    <span className="shrink-0 inline-flex items-center !px-2.5 !py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-600 border border-green-500/20">Đang dạy</span>
                                ) : (
                                    <span className="shrink-0 inline-flex items-center !px-2.5 !py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 border border-red-500/20">Đã nghỉ</span>
                                )}
                            </div>

                            {/* Info rows */}
                            <div className="bg-background rounded-xl !p-3 !space-y-2 border border-border/50">
                                <div className="flex items-center !gap-2 text-sm text-text-muted">
                                    <Icon icon="solar:letter-linear" className="shrink-0 text-primary" />
                                    <span className="truncate">{assistant.email}</span>
                                </div>
                                <div className="flex items-center !gap-2 text-sm text-text-muted">
                                    <Icon icon="solar:phone-linear" className="shrink-0 text-primary" />
                                    <span>{assistant.phone || 'Chưa cập nhật'}</span>
                                </div>
                                <div className="flex items-center !gap-2 text-sm text-text-muted">
                                    <Icon icon="solar:book-linear" className="shrink-0 text-primary" />
                                    {assistant.class === 'Chưa có lớp' ? (
                                        <span className="italic">{assistant.class}</span>
                                    ) : (
                                        <span className="!px-2 !py-0.5 bg-surface border border-border rounded-lg text-xs font-semibold text-text-main">{assistant.class}</span>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex !gap-2">
                                <button 
                                    onClick={() => handleOpenAssignModal(assistant)}
                                    className="flex-1 flex items-center justify-center !gap-2 !py-2 text-sm font-semibold text-green-600 bg-green-500/10 hover:bg-green-500/20 rounded-xl transition-colors"
                                >
                                    <Icon icon="solar:square-academic-cap-2-bold-duotone" /> Xếp lớp
                                </button>
                                <button className="flex-[0.8] flex items-center justify-center !gap-2 !py-2 text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors">
                                    <Icon icon="solar:pen-bold-duotone" /> Sửa
                                </button>
                                <button className="flex-[0.8] flex items-center justify-center !gap-2 !py-2 text-sm font-semibold text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors">
                                    <Icon icon="solar:trash-bin-trash-bold-duotone" /> Xóa
                                </button>
                            </div>
                        </div>
                    ))
                )}

                {/* Pagination mobile */}
                {filteredAssistants.length > 0 && (
                    <div className="!pt-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-text-muted">Trang 1 / 1</span>
                        <div className="flex !gap-2">
                            <Button variant="outline" className="!px-3" disabled><Icon icon="solar:alt-arrow-left-linear" /></Button>
                            <Button variant="outline" className="!px-3" disabled><Icon icon="solar:alt-arrow-right-linear" /></Button>
                        </div>
                    </div>
                )}
            </div>

            {isCreateModalOpen && (
                <CreateAssistantModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreate={handleCreateAssistant}
                />
            )}

            <AssignClassModal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                person={selectedAssistantForAssign}
                onAssign={handleAssignClass}
            />
        </div>
    );
};

export default ViewTAListPage;
