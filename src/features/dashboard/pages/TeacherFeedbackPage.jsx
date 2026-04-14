import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import { feedbackService } from '../api/feedbackService';

const TeacherFeedbackPage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        type: 'General',
        content: ''
    });

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const data = await feedbackService.getFeedbackHistory();
            // Data could be returning [{feedbackId, title, type, status, adminReply, createdAt}] based on mock
            setHistory(data || []);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title.trim()) {
            return toast.warning('Vui lòng nhập tiêu đề góp ý.');
        }
        if (!formData.content.trim() || formData.content.trim().length < 10) {
            return toast.warning('Nội dung góp ý cần ít nhất 10 ký tự.');
        }

        setSubmitting(true);
        try {
            await feedbackService.createFeedback(formData);
            toast.success('Gửi góp ý thành công!');
            setFormData({ title: '', type: 'General', content: '' });
            fetchHistory(); // Refresh
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (status) => {
        if (status === 'Resolved') return <span className="!px-3 !py-1 !bg-green-50 text-green-700 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 w-max border border-green-100"><div className="w-1.5 h-1.5 rounded-full !bg-green-500"></div> Đã Phản Hồi</span>;
        if (status === 'New') return <span className="!px-3 !py-1 !bg-blue-50 text-blue-700 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 w-max border border-blue-100"><div className="w-1.5 h-1.5 rounded-full !bg-blue-500"></div> Đã Gửi</span>;
        if (status === 'InReview') return <span className="!px-3 !py-1 !bg-amber-50 text-amber-700 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 w-max border border-amber-100"><div className="w-1.5 h-1.5 rounded-full !bg-amber-500"></div> Đang Xem Xét</span>;
        return <span className="!px-3 !py-1 !bg-slate-50 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 w-max border border-slate-100">{status}</span>;
    };

    const getTypeDisplay = (type) => {
        const t = (type || '').toLowerCase();
        if (t === 'bug') return 'Báo Lỗi Hệ Thống';
        if (t === 'feature request' || t === 'feature') return 'Góp ý Tính Năng Mới';
        if (t === 'inquiry') return 'Câu hỏi / Thắc mắc';
        return 'Góp ý Chung';
    };

    return (
        <div className="max-w-4xl mx-auto !space-y-8 animate-fade-in pb-12">
            <div>
                <h1 className="text-3xl font-black text-text-main font-['Outfit'] tracking-tight">Hỗ Trợ & Góp Ý</h1>
                <p className="text-sm text-text-secondary !mt-2">Gửi phản hồi, báo cáo sự cố hoặc đóng góp ý tưởng để giúp chúng tôi cải thiện hệ thống.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Form Section */}
                <div className="md:col-span-5 !space-y-6">
                    <div className="!bg-white !p-6 rounded-3xl border border-border shadow-soft h-full">
                        <form onSubmit={handleSubmit} className="!space-y-5">
                            <div>
                                <label className="text-xs font-black uppercase text-text-secondary tracking-widest !mb-2 flex items-center gap-2">
                                    <Icon icon="solar:tag-bold-duotone" className="text-primary text-base" /> Phân Loại
                                </label>
                                <select 
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full !px-4 !py-3 rounded-2xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-bold bg-background transition-all"
                                >
                                    <option value="General">Góp ý Chung</option>
                                    <option value="Bug">Báo cáo Lỗi (Bug)</option>
                                    <option value="Feature Request">Đề xuất Tính năng</option>
                                    <option value="Inquiry">Thắc mắc về Hệ thống</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-black uppercase text-text-secondary tracking-widest !mb-2 flex items-center gap-2">
                                    <Icon icon="solar:text-field-bold-duotone" className="text-primary text-base" /> Tiêu Đề
                                </label>
                                <input 
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Tóm tắt vấn đề của bạn..."
                                    className="w-full !px-4 !py-3 rounded-2xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium bg-background transition-all"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-black uppercase text-text-secondary tracking-widest !mb-2 flex items-center gap-2">
                                    <Icon icon="solar:document-text-bold-duotone" className="text-primary text-base" /> Nội Dung Chi Tiết
                                </label>
                                <textarea 
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    placeholder="Mô tả cụ thể lỗi bạn gặp phải hoặc ý tưởng của bạn..."
                                    rows="6"
                                    className="w-full !px-4 !py-3 rounded-2xl border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium bg-background resize-none transition-all"
                                ></textarea>
                            </div>

                            <button 
                                type="submit"
                                disabled={submitting}
                                className={`w-full !py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 !mt-6 ${
                                    submitting
                                    ? '!bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                    : '!bg-primary text-white hover:shadow-primary/30 transform hover:-translate-y-1'
                                }`}
                            >
                                {submitting ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <Icon icon="solar:paperclip-send-bold-duotone" className="text-xl" />
                                )}
                                {submitting ? 'Đang gửi...' : 'Gửi Phản Hồi'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* History Section */}
                <div className="md:col-span-7">
                    <div className="!space-y-4">
                        <h2 className="text-lg font-black text-text-main flex items-center gap-2">
                            <Icon icon="solar:history-bold-duotone" className="text-primary" /> Lịch sử gửi Phản hồi
                        </h2>
                        
                        <div className="!space-y-4">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, idx) => (
                                    <div key={idx} className="!bg-white !p-6 rounded-3xl border border-border animate-pulse flex flex-col gap-3">
                                        <div className="h-4 w-32 !bg-slate-100 rounded"></div>
                                        <div className="h-6 w-full !bg-slate-100 rounded"></div>
                                        <div className="h-4 w-20 !bg-slate-100 rounded"></div>
                                    </div>
                                ))
                            ) : history.length > 0 ? (
                                history.map(item => (
                                    <div key={item.feedbackId} className={`!bg-white !p-6 rounded-3xl border shadow-sm transition-all flex flex-col gap-4 ${
                                        item.status === 'Resolved' ? 'border-green-100 shadow-green-500/5' : 'border-border'
                                    }`}>
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-3 !mb-2">
                                                    {getStatusBadge(item.status)}
                                                    <span className="text-xs font-bold text-text-secondary bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                                                        {getTypeDisplay(item.type)}
                                                    </span>
                                                </div>
                                                <h3 className="text-base font-bold text-text-main">{item.title}</h3>
                                            </div>
                                            <span className="text-xs font-bold text-text-secondary whitespace-nowrap bg-background px-3 py-1.5 rounded-xl">
                                                {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>

                                        {/* Hiển thị Content nếu API trả về */}
                                        {item.content && (
                                            <p className="text-sm text-text-secondary leading-relaxed p-4 bg-slate-50 rounded-2xl italic border border-slate-100">
                                                "{item.content}"
                                            </p>
                                        )}

                                        {/* Trả lời của Admin nếu có */}
                                        {item.adminReply && (
                                            <div className="!mt-2 !bg-blue-50/50 border border-blue-100 rounded-2xl !p-4 flex gap-3 relative overflow-hidden">
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400"></div>
                                                <Icon icon="solar:chat-round-line-bold-duotone" className="text-blue-500 text-xl shrink-0 !mt-0.5" />
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-blue-500 tracking-widest !mb-1">Ban Quản Trị Hệ Thống</p>
                                                    <p className="text-sm text-slate-700 font-medium">{item.adminReply}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="!bg-white !px-6 !py-16 rounded-3xl border border-border shadow-soft text-center flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 !bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                        <Icon icon="solar:box-minimalistic-bold-duotone" className="text-4xl text-slate-300" />
                                    </div>
                                    <h3 className="text-base font-black text-text-main">Chưa có phản hồi nào</h3>
                                    <p className="text-sm text-text-secondary mt-1 max-w-xs">Bạn chưa gửi bất kỳ góp ý hay báo lỗi nào cho hệ thống.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherFeedbackPage;
