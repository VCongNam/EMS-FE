import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import { adminService } from '../api/adminService';

const FeedbackDetailDrawer = ({ feedbackData, isOpen, onClose, onUpdateSuccess }) => {
    const [updating, setUpdating] = useState(false);
    
    // Form fields
    const [newStatus, setNewStatus] = useState('');
    const [adminReply, setAdminReply] = useState('');

    useEffect(() => {
        if (isOpen && feedbackData) {
            setNewStatus(feedbackData.status || 'InReview');
            setAdminReply(feedbackData.adminReply || '');
        }
    }, [isOpen, feedbackData]);

    const handleProcessFeedback = async () => {
        if (!adminReply.trim()) {
            toast.warning('Vui lòng nhập nội dung phản hồi cho người dùng.');
            return;
        }

        setUpdating(true);
        try {
            const res = await adminService.processFeedback(feedbackData.feedbackId, {
                newStatus,
                adminReply
            });
            toast.success(res.message || 'Đã cập nhật trạng thái và phản hồi.');
            onUpdateSuccess();
            onClose();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setUpdating(false);
        }
    };

    if (!isOpen) return null;

    const feedback = feedbackData;

    const getTypeBadge = (type) => {
        const t = (type || '').toLowerCase();
        if (t === 'bug') return <span className="!px-3 !py-1 !bg-red-50 text-red-700 rounded-xl text-xs font-black uppercase tracking-wider border border-red-100">Bug</span>;
        if (t === 'feature request' || t === 'feature') return <span className="!px-3 !py-1 !bg-purple-50 text-purple-700 rounded-xl text-xs font-black uppercase tracking-wider border border-purple-100">Tính Năng Mới</span>;
        return <span className="!px-3 !py-1 !bg-slate-50 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider border border-slate-100">{type}</span>;
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] overflow-hidden">
            <div 
                className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            ></div>

            <div className={`absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                {!feedback ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                        <p className="text-sm font-bold text-primary">Đang tải dữ liệu...</p>
                    </div>
                ) : (
                    <div className="flex flex-col h-full overflow-hidden">
                        <div className="!px-6 !py-5 border-b border-border flex items-center justify-between !bg-background/20">
                            <div>
                                <h2 className="text-lg font-black text-text-main font-['Outfit'] truncate">Phản hồi Góp ý</h2>
                                <p className="text-xs text-text-secondary truncate">Từ: {feedback.senderName}</p>
                            </div>
                            <button 
                                onClick={onClose}
                                className="w-9 h-9 flex items-center justify-center rounded-xl hover:!bg-red-50 hover:text-red-500 text-text-secondary transition-all"
                            >
                                <Icon icon="material-symbols:close-rounded" className="text-2xl" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto !p-6 !space-y-6 custom-scrollbar">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    {getTypeBadge(feedback.type)}
                                    <span className="text-xs font-bold text-text-secondary">
                                        {new Date(feedback.createdAt).toLocaleString('vi-VN')}
                                    </span>
                                </div>
                                <h3 className="text-xl font-black text-text-main">{feedback.title}</h3>
                                <div className="mt-4 p-4 !bg-slate-50 border border-slate-100 rounded-2xl">
                                    <p className="text-sm text-text-secondary leading-relaxed break-words whitespace-pre-wrap">
                                        {feedback.content || "Không có nội dung chi tiết."}
                                    </p>
                                </div>
                            </div>

                            <div className="!mt-8 !pt-6 border-t border-border !space-y-6">
                                <h3 className="text-sm font-black text-text-primary uppercase tracking-widest flex items-center gap-2">
                                    <Icon icon="solar:pen-bold-duotone" className="text-primary" /> Phản hồi & Cập nhật
                                </h3>
                                
                                <div className="!space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase text-text-secondary tracking-widest !mb-2 block">Cập nhật trạng thái</label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input 
                                                    type="radio" 
                                                    name="status" 
                                                    value="InReview" 
                                                    checked={newStatus === 'InReview'} 
                                                    onChange={e => setNewStatus(e.target.value)} 
                                                    className="w-4 h-4 text-primary"
                                                />
                                                <span className="text-sm font-bold text-text-secondary">Đang Khảo Sát</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input 
                                                    type="radio" 
                                                    name="status" 
                                                    value="Resolved" 
                                                    checked={newStatus === 'Resolved'} 
                                                    onChange={e => setNewStatus(e.target.value)} 
                                                    className="w-4 h-4 text-primary"
                                                />
                                                <span className="text-sm font-bold text-text-secondary">Đã Xử Lý</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black uppercase text-text-secondary tracking-widest !mb-2 block">
                                            Nội dung trả lời Giáo viên <span className="text-red-500">*</span>
                                        </label>
                                        <textarea 
                                            value={adminReply}
                                            onChange={(e) => setAdminReply(e.target.value)}
                                            placeholder="Nhập nội dung trả lời để thông báo lại cho giáo viên..."
                                            rows="5"
                                            className="w-full !px-4 !py-3 rounded-2xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm bg-white resize-none font-medium"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="!p-6 border-t border-border !bg-white">
                            <button 
                                onClick={handleProcessFeedback}
                                disabled={updating}
                                className={`w-full !py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 ${
                                    updating
                                    ? '!bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                    : '!bg-primary text-white hover:shadow-primary/30 transform hover:-translate-y-1'
                                }`}
                            >
                                {updating ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <Icon icon="solar:paperclip-send-bold-duotone" className="text-xl" />
                                )}
                                {updating ? 'Đang gửi...' : 'Cập nhật & Gửi thông báo'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default FeedbackDetailDrawer;
