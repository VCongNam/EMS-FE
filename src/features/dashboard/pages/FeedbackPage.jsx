import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import useAuthStore from '../../../store/authStore';
import Button from '../../../components/ui/Button';
import { feedbackService } from '../api/feedbackService';
import FeedbackModal from '../components/feedback/FeedbackModal';

const FeedbackPage = () => {
    const { user } = useAuthStore();
    const [feedbacks, setFeedbacks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchHistory = async () => {
        if (!user?.token) return;
        try {
            setIsLoading(true);
            const res = await feedbackService.getFeedbackHistory(user.token);
            if (res.ok) {
                const data = await res.json();
                setFeedbacks(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            }
        } catch (error) {
            console.error("Fetch feedback history error:", error);
            toast.error("Không thể tải lịch sử phản hồi.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [user?.token]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'New': return 'bg-blue-500/10 text-blue-600 border-blue-200';
            case 'InProgress': return 'bg-amber-500/10 text-amber-600 border-amber-200';
            case 'Resolved': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
            case 'Closed': return 'bg-slate-500/10 text-slate-600 border-slate-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'Bug': return { icon: 'solar:bug-bold-duotone', color: 'text-red-500', bg: 'bg-red-500/10', label: 'Báo lỗi' };
            case 'FeatureRequest': return { icon: 'solar:magic-stick-3-bold-duotone', color: 'text-purple-500', bg: 'bg-purple-500/10', label: 'Yêu cầu tính năng' };
            case 'Inquiry': return { icon: 'solar:question-square-bold-duotone', color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Thắc mắc' };
            case 'General': return { icon: 'solar:chat-line-bold-duotone', color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Góp ý chung' };
            default: return { icon: 'solar:letter-bold-duotone', color: 'text-primary', bg: 'bg-primary/10', label: 'Khác' };
        }
    };

    return (
        <div className="w-full !mx-auto !space-y-8 animate-fade-in !pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center !gap-6 !bg-surface !p-8 rounded-[2.5rem] border border-border shadow-sm">
                <div className="flex items-center !gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0 ring-1 ring-primary/20">
                        <Icon icon="solar:letter-bold-duotone" className="text-3xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-text-main font-['Outfit'] tracking-tight">Phản hồi hệ thống</h1>
                        <p className="text-text-muted !mt-1.5 text-sm sm:text-base font-medium leading-relaxed">Gửi ý kiến đóng góp của bạn để chúng tôi phục vụ tốt hơn</p>
                    </div>
                </div>

                <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full md:w-auto !px-8 !py-5 !rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 font-bold group hover:translate-y-[-2px] transition-all"
                >
                    <Icon icon="solar:add-circle-bold-duotone" className="text-2xl group-hover:rotate-90 transition-transform duration-300" />
                    Gửi phản hồi mới
                </Button>
            </div>

            {/* History Section */}
            <div className="bg-surface rounded-[2.5rem] border border-border shadow-sm overflow-hidden min-h-[500px] flex flex-col relative">
                <div className="!px-8 !py-6 border-b border-border/50 flex items-center justify-between bg-background/30">
                    <h3 className="text-lg font-bold text-text-main flex items-center gap-3 font-['Outfit']">
                        <Icon icon="solar:history-bold-duotone" className="text-2xl text-primary" />
                        Lịch sử phản hồi
                    </h3>
                    <div className="!px-3 !py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full border border-primary/20 uppercase tracking-widest">
                        {feedbacks.length} Bản ghi
                    </div>
                </div>

                <div className="flex-1 !p-8">
                    {isLoading ? (
                        <div className="h-full flex flex-col items-center justify-center !py-20 !gap-4 opacity-70">
                            <Icon icon="solar:spinner-bold-duotone" className="text-5xl text-primary animate-spin" />
                            <p className="text-text-muted font-bold text-sm tracking-wide">Đang đồng bộ dữ liệu...</p>
                        </div>
                    ) : feedbacks.length > 0 ? (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {feedbacks.map((fb) => {
                                const typeInfo = getTypeIcon(fb.type);
                                return (
                                    <div 
                                        key={fb.feedbackId}
                                        className="!bg-background/40 border border-border rounded-3xl !p-6 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all group flex flex-col gap-4"
                                    >
                                        <div className="flex justify-between items-start !gap-4">
                                            <div className="flex items-center !gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${typeInfo.bg} ${typeInfo.color} ring-1 ring-white/20 shadow-sm transition-transform group-hover:scale-110`}>
                                                    <Icon icon={typeInfo.icon} className="text-xl" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-text-main group-hover:text-primary transition-colors leading-tight line-clamp-1">{fb.title}</h4>
                                                    <p className="text-[10px] text-text-muted !mt-1 font-bold uppercase tracking-wider">{typeInfo.label}</p>
                                                </div>
                                            </div>
                                            <div className={`!px-3 !py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${getStatusStyle(fb.status)} shadow-sm`}>
                                                {fb.status === 'New' ? 'Mới' : 
                                                 fb.status === 'InProgress' ? 'Đang lý' :
                                                 fb.status === 'Resolved' ? 'Đã giải quyết' : 
                                                 fb.status === 'Closed' ? 'Đã đóng' : fb.status}
                                            </div>
                                        </div>

                                        <div className="flex-1 bg-surface/50 rounded-2xl !p-4 border border-border/30 shadow-inner overflow-hidden">
                                            <p className="text-sm text-text-main/80 font-medium leading-relaxed italic line-clamp-3">"{fb.content}"</p>
                                        </div>

                                        {fb.adminReply && (
                                            <div className="!mt-2 !p-4 bg-emerald-500/[0.03] border-l-4 border-emerald-500 rounded-r-2xl">
                                                <div className="flex items-center !gap-2 !mb-2">
                                                    <Icon icon="solar:shield-user-bold" className="text-emerald-600 text-sm" />
                                                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Phản hồi từ Admin</span>
                                                </div>
                                                <p className="text-sm text-emerald-800 font-bold leading-relaxed">{fb.adminReply}</p>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between !pt-2 border-t border-border/30 text-[11px] font-bold text-text-muted">
                                            <div className="flex items-center !gap-2">
                                                <Icon icon="solar:calendar-date-bold-duotone" className="text-base text-primary/70" />
                                                <span>Ngày gửi: {new Date(fb.createdAt).toLocaleDateString('vi-VN', {
                                                    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                })}</span>
                                            </div>
                                            {fb.updatedAt !== fb.createdAt && (
                                                <span className="italic opacity-60">Cập nhật: {new Intl.RelativeTimeFormat('vi', { numeric: 'auto' }).format(
                                                    Math.ceil((new Date(fb.updatedAt) - new Date()) / (1000 * 60 * 60 * 24)), 'day'
                                                )}</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center !py-20 !gap-6 opacity-40 grayscale">
                            <div className="w-28 h-28 rounded-full bg-primary/5 flex items-center justify-center ring-8 ring-primary/[0.02]">
                                <Icon icon="solar:box-minimalistic-bold-duotone" className="text-7xl text-primary" />
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-xl font-black text-text-main tracking-tight">Chưa có lịch sử phản hồi</p>
                                <p className="text-sm font-bold max-w-xs mx-auto">Mọi đóng góp của bạn sẽ được lưu trữ và hiển thị tại đây.</p>
                            </div>
                            <Button onClick={() => setIsModalOpen(true)} variant="outline" className="!rounded-xl font-bold">Gửi phản hồi ngay</Button>
                        </div>
                    )}
                </div>
            </div>

            <FeedbackModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchHistory}
                token={user?.token}
            />
        </div>
    );
};

export default FeedbackPage;
