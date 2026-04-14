import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import Button from '../../../../components/ui/Button';
import { feedbackService } from '../../api/feedbackService';

const FeedbackModal = ({ isOpen, onClose, onSuccess, token }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        type: 'General'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const feedbackTypes = [
        { value: 'Bug', label: 'Bug: Báo lỗi hệ thống', description: 'Dùng khi lỗi vặt, sập web, không nộp được bài', icon: 'solar:bug-bold-duotone', color: 'text-red-500', bg: 'bg-red-500/10' },
        { value: 'FeatureRequest', label: 'FeatureRequest: Yêu cầu tính năng', description: 'Dùng khi muốn thêm nút bấm, thêm báo cáo mới', icon: 'solar:magic-stick-3-bold-duotone', color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { value: 'Inquiry', label: 'Inquiry: Hỏi đáp / Thắc mắc', description: 'Dùng khi không hiểu cách dùng một chức năng nào đó', icon: 'solar:question-square-bold-duotone', color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { value: 'General', label: 'General: Góp ý chung', description: 'Dùng cho các vấn đề khác hoặc lời khen', icon: 'solar:chat-line-bold-duotone', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.content) {
            toast.error("Vui lòng điền đầy đủ tiêu đề và nội dung.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await feedbackService.createFeedback(formData, token);
            if (res.ok) {
                toast.success("Gửi phản hồi thành công! Cảm ơn bạn.");
                setFormData({ title: '', content: '', type: 'General' });
                onSuccess();
                onClose();
            } else {
                toast.error("Đã xảy ra lỗi khi gửi phản hồi.");
            }
        } catch (error) {
            console.error("Feedback error:", error);
            toast.error("Lỗi kết nối máy chủ.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses = "w-full !px-5 !py-4 rounded-2xl bg-background border border-border outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium text-text-main placeholder:text-text-muted/50 shadow-inner";
    const labelClasses = "block text-xs font-bold text-text-muted uppercase tracking-widest !mb-2.5 px-1";

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in !p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
            
            <div className="relative w-full max-w-2xl bg-surface border border-border rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
                {/* Header */}
                <div className="!px-8 !py-6 border-b border-border/50 flex items-center justify-between bg-background/50">
                    <div className="flex items-center !gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
                            <Icon icon="solar:letter-bold-duotone" className="text-2xl" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-text-main font-['Outfit']">Gửi phản hồi hệ thống</h2>
                            <p className="text-sm text-text-muted font-medium">Ý kiến của bạn giúp chúng tôi hoàn thiện hơn</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-background hover:bg-danger/10 hover:text-danger text-text-muted transition-all">
                        <Icon icon="solar:close-circle-bold" className="text-2xl" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="!p-8 overflow-y-auto space-y-8 custom-scrollbar">
                    {/* Types Selection */}
                    <div className="space-y-4">
                        <label className={labelClasses}>Loại phản hồi <span className="text-danger">*</span></label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 !gap-3">
                            {feedbackTypes.map((t) => (
                                <div 
                                    key={t.value}
                                    onClick={() => setFormData({ ...formData, type: t.value })}
                                    className={`!p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start !gap-3 relative overflow-hidden group ${
                                        formData.type === t.value 
                                        ? 'border-primary bg-primary/5' 
                                        : 'border-border hover:border-primary/30 hover:bg-background'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${t.bg} ${t.color}`}>
                                        <Icon icon={t.icon} className="text-xl" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className={`text-[13px] font-bold ${formData.type === t.value ? 'text-primary' : 'text-text-main'}`}>
                                            {t.label.split(':')[1].trim()}
                                        </p>
                                        <p className="text-[10px] text-text-muted font-medium line-clamp-2 !mt-0.5 leading-relaxed">{t.description}</p>
                                    </div>
                                    {formData.type === t.value && (
                                        <div className="absolute top-2 right-2">
                                            <Icon icon="solar:check-circle-bold" className="text-primary text-base" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <label className={labelClasses}>Tiêu đề ngắn gọn <span className="text-danger">*</span></label>
                        <input 
                            type="text" 
                            required
                            placeholder="Ví dụ: Lỗi không hiển thị nút Điểm danh"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className={inputClasses}
                        />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <label className={labelClasses}>Mô tả chi tiết nội dung <span className="text-danger">*</span></label>
                        <textarea 
                            rows="5"
                            required
                            placeholder="Vui lòng mô tả cụ thể vấn đề hoặc ý tưởng của bạn..."
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className={`${inputClasses} resize-none`}
                        ></textarea>
                    </div>

                    {/* Note */}
                    <div className="!p-5 bg-primary/5 rounded-[1.5rem] border border-primary/10 flex items-start !gap-3">
                        <Icon icon="solar:info-circle-bold-duotone" className="text-primary text-xl shrink-0 mt-0.5" />
                        <p className="text-[11px] text-primary/80 leading-relaxed font-medium">
                            Phản hồi của bạn sẽ được gửi trực tiếp tới Quản trị viên. Chúng tôi sẽ xem xét và phản hồi sớm nhất có thể qua mục <strong>Lịch sử phản hồi</strong>.
                        </p>
                    </div>
                </form>

                {/* Footer */}
                <div className="!px-8 !py-6 border-t border-border/50 bg-background/50 flex items-center justify-end !gap-4">
                    <Button variant="outline" onClick={onClose} className="!px-8 !rounded-xl font-bold">Hủy bỏ</Button>
                    <Button 
                        onClick={handleSubmit} 
                        isLoading={isSubmitting}
                        className="!px-10 !rounded-xl font-bold shadow-xl shadow-primary/20"
                    >
                        Gửi phản hồi
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default FeedbackModal;
