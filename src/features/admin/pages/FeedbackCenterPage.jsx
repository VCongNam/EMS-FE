import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import { adminService } from '../api/adminService';
import FeedbackDetailDrawer from '../components/FeedbackDetailDrawer';

const FeedbackCenterPage = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    
    // Drawer State
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchFeedbacks();
    }, [typeFilter, statusFilter]);

    const fetchFeedbacks = async () => {
        setLoading(true);
        try {
            const data = await adminService.getFeedbacks(typeFilter, statusFilter);
            setFeedbacks(data);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDrawer = (fb) => {
        setSelectedFeedback(fb);
        setIsDrawerOpen(true);
    };

    // Client-side pagination
    const totalPages = Math.ceil(feedbacks.length / itemsPerPage);
    const paginatedFeedbacks = feedbacks.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getStatusBadge = (status) => {
        if (status === 'Resolved') return <span className="!px-3 !py-1 !bg-green-50 text-green-700 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 w-max border border-green-100"><div className="w-1.5 h-1.5 rounded-full !bg-green-500"></div> Đã Xử Lý</span>;
        if (status === 'New') return <span className="!px-3 !py-1 !bg-blue-50 text-blue-700 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 w-max border border-blue-100"><div className="w-1.5 h-1.5 rounded-full !bg-blue-500"></div> Mới</span>;
        if (status === 'InReview') return <span className="!px-3 !py-1 !bg-amber-50 text-amber-700 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 w-max border border-amber-100"><div className="w-1.5 h-1.5 rounded-full !bg-amber-500"></div> Đang Khảo Sát</span>;
        return <span className="!px-3 !py-1 !bg-slate-50 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 w-max border border-slate-100"><div className="w-1.5 h-1.5 rounded-full !bg-slate-500"></div> {status}</span>;
    };

    const getTypeBadge = (type) => {
        if (type.toLowerCase() === 'bug') return <span className="!px-3 !py-1 !bg-red-50 text-red-700 rounded-xl text-[10px] font-black uppercase tracking-wider border border-red-100">Bug</span>;
        if (type.toLowerCase() === 'feature request' || type.toLowerCase() === 'feature') return <span className="!px-3 !py-1 !bg-purple-50 text-purple-700 rounded-xl text-[10px] font-black uppercase tracking-wider border border-purple-100">Tính Năng Mới</span>;
        return <span className="!px-3 !py-1 !bg-slate-50 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider border border-slate-100">{type}</span>;
    };

    return (
        <div className="!space-y-6 animate-fade-in relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-text-main font-['Outfit'] tracking-tight">Trung Tâm Phản Hồi</h1>
                    <p className="text-sm text-text-secondary !mt-1">Tra cứu và xử lý các góp ý, báo lỗi từ người dùng hệ thống.</p>
                </div>
            </div>

            <div className="!bg-white !p-4 rounded-3xl border border-border shadow-soft flex flex-col xl:flex-row gap-4 items-center justify-end">
                <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
                    <div className="flex items-center gap-2 !bg-background !px-3 !py-1.5 rounded-2xl border border-border flex-1 xl:flex-none">
                        <Icon icon="solar:tag-bold-duotone" className="text-text-secondary text-lg" />
                        <select
                            value={typeFilter}
                            onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                            className="!bg-transparent border-none text-xs font-black uppercase tracking-wider focus:ring-0 cursor-pointer text-text-main py-2 pr-8"
                        >
                            <option value="all">Tất cả Loại</option>
                            <option value="Bug">Lỗi (Bug)</option>
                            <option value="Feature Request">Góp ý Tính Năng</option>
                            <option value="Inquiry">Câu hỏi (Inquiry)</option>
                            <option value="General">Khác</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 !bg-background !px-3 !py-1.5 rounded-2xl border border-border flex-1 xl:flex-none">
                        <Icon icon="solar:checklist-minimalistic-bold-duotone" className="text-text-secondary text-lg" />
                        <select
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                            className="!bg-transparent border-none text-xs font-black uppercase tracking-wider focus:ring-0 cursor-pointer text-text-main py-2 pr-8"
                        >
                            <option value="all">Tất cả Trạng Thái</option>
                            <option value="New">Mới</option>
                            <option value="InReview">Đang Khảo Sát</option>
                            <option value="Resolved">Đã Xử Lý</option>
                        </select>
                    </div>

                    <button 
                        onClick={fetchFeedbacks}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl !bg-primary/10 text-primary hover:!bg-primary hover:text-white transition-all shadow-sm"
                        title="Làm mới dữ liệu"
                    >
                        <Icon icon="solar:restart-bold-duotone" className="text-2xl" />
                    </button>
                </div>
            </div>

            <div className="!bg-white rounded-3xl border border-border shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="!bg-background/50 border-b border-border text-[10px] font-black uppercase tracking-widest text-text-secondary">
                            <tr>
                                <th className="!px-8 !py-5">Người Gửi</th>
                                <th className="!px-6 !py-5">Tiêu Đề</th>
                                <th className="!px-6 !py-5">Phân Loại</th>
                                <th className="!px-6 !py-5">Ngày Gửi</th>
                                <th className="!px-6 !py-5">Trạng Thái</th>
                                <th className="!px-8 !py-5 text-right">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, idx) => (
                                    <tr key={idx} className="animate-pulse">
                                        <td className="!px-8 !py-5"><div className="h-6 w-32 !bg-slate-100 rounded-lg"></div></td>
                                        <td className="!px-6 !py-5"><div className="h-6 w-48 !bg-slate-100 rounded-lg"></div></td>
                                        <td className="!px-6 !py-5"><div className="h-6 w-16 !bg-slate-100 rounded-lg"></div></td>
                                        <td className="!px-6 !py-5"><div className="h-6 w-24 !bg-slate-100 rounded-lg"></div></td>
                                        <td className="!px-6 !py-5"><div className="h-6 w-20 !bg-slate-100 rounded-lg"></div></td>
                                        <td className="!px-8 !py-5 text-right"><div className="h-8 w-8 !bg-slate-100 rounded-lg ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : paginatedFeedbacks.length > 0 ? (
                                paginatedFeedbacks.map((fb) => (
                                    <tr key={fb.feedbackId} className="group hover:!bg-background/40 transition-all">
                                        <td className="!px-8 !py-5 font-black text-text-main text-sm">{fb.senderName}</td>
                                        <td className="!px-6 !py-5 font-bold text-text-secondary">{fb.title}</td>
                                        <td className="!px-6 !py-5">{getTypeBadge(fb.type)}</td>
                                        <td className="!px-6 !py-5">
                                            <span className="text-xs font-bold text-text-secondary">
                                                {new Date(fb.createdAt).toLocaleDateString('vi-VN')}
                                            </span>
                                        </td>
                                        <td className="!px-6 !py-5">{getStatusBadge(fb.status)}</td>
                                        <td className="!px-8 !py-5 text-right">
                                            <button 
                                                onClick={() => handleOpenDrawer(fb)}
                                                className="px-4 py-2 rounded-xl !bg-primary/10 text-primary font-bold text-xs hover:!bg-primary hover:text-white transition-all active:scale-95"
                                            >
                                                Phản hồi
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="!px-6 !py-20 text-center">
                                        <div className="flex flex-col items-center justify-center max-w-xs mx-auto">
                                            <div className="w-20 h-20 !bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                <Icon icon="solar:file-smile-bold-duotone" className="text-5xl text-slate-300" />
                                            </div>
                                            <h3 className="text-lg font-black text-text-main">Không có phản hồi</h3>
                                            <p className="text-sm text-text-secondary mt-1">Chưa có phản hồi nào phù hợp với điều kiện lọc hiện tại.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Setup */}
            <div className="!px-8 !py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                    Trang <b>{currentPage}</b> / {totalPages || 1} — Tổng <b>{feedbacks.length}</b> phản hồi
                </p>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:!bg-slate-200 border border-border disabled:opacity-30 transition-all font-bold"
                    >
                        {"<"}
                    </button>
                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:!bg-slate-200 border border-border disabled:opacity-30 transition-all font-bold"
                    >
                        {">"}
                    </button>
                </div>
            </div>

            <FeedbackDetailDrawer
                feedbackData={selectedFeedback}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                onUpdateSuccess={fetchFeedbacks}
            />
        </div>
    );
};

export default FeedbackCenterPage;
