import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import CTASection from '../../../components/common/CTASection';

const CONTACT_INFO = [
    { icon: 'solar:letter-linear', label: 'Email', value: 'support@ems.vn', href: 'mailto:support@ems.vn' },
    { icon: 'solar:phone-linear', label: 'Điện thoại', value: '0901 234 567', href: 'tel:0901234567' },
    { icon: 'solar:map-point-linear', label: 'Địa chỉ', value: 'TP. Hồ Chí Minh, Việt Nam', href: null },
    { icon: 'solar:clock-circle-broken', label: 'Giờ hỗ trợ', value: 'Thứ 2 – Thứ 6 · 8:00 – 17:00', href: null },
];

const REASONS = [
    { icon: 'solar:headphones-round-linear', text: 'Hỗ trợ kỹ thuật & giải đáp thắc mắc' },
    { icon: 'solar:star-linear', text: 'Tư vấn tính năng phù hợp nhu cầu của bạn' },
    { icon: 'solar:chat-round-dots-linear', text: 'Gửi góp ý để chúng tôi cải thiện EMS' },
];

const SUBJECTS = [
    'Hỗ trợ kỹ thuật',
    'Tư vấn tính năng',
    'Báo lỗi',
    'Góp ý sản phẩm',
    'Hợp tác & kinh doanh',
    'Khác',
];

const ContactUs = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const inputBase = "w-full px-4 py-3 rounded-xl border border-border bg-white text-[#2D3142] text-sm placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200";

    return (
        <div className="overflow-x-hidden container">

            {/* ── Hero ── */}
            <section className="!pt-15  text-center">
                <h1 className="text-4xl lg:text-5xl font-extrabold text-[#2D3142] font-['Outfit'] leading-tight mb-4">
                    Chúng tôi luôn sẵn sàng{' '}
                    <span className="text-primary">lắng nghe</span>
                </h1>
                <p className="text-xl text-text-muted max-w-xl !mx-auto leading-relaxed">
                    Có câu hỏi về EMS? Hãy để lại tin nhắn — chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.
                </p>
            </section>

            {/* ── Main 2-col ── */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 !pt-15 items-start">

                {/* Left — Info */}
                <div className="flex flex-col gap-8">
                    {/* Contact info cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {CONTACT_INFO.map(item => (
                            <div key={item.label} className="flex items-start gap-4 !p-5 rounded-[18px] border border-border bg-white hover:border-primary/30 hover:shadow-md transition-all duration-300">
                                <div className=" w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Icon icon={item.icon} className="text-primary" width="20" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-0.5">{item.label}</p>
                                    {item.href ? (
                                        <a href={item.href} className="text-sm font-semibold text-[#2D3142] hover:text-primary transition-colors duration-200">
                                            {item.value}
                                        </a>
                                    ) : (
                                        <p className="text-sm font-semibold text-[#2D3142]">{item.value}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Why contact */}
                    <div className="!p-7 rounded-[20px] bg-gradient-to-br from-[#2D3142]/[0.03] to-primary/[0.05] border border-border">
                        <h3 className="text-lg font-bold text-[#2D3142] font-['Outfit'] mb-5">Tại sao nên liên hệ?</h3>
                        <ul className="flex flex-col gap-4">
                            {REASONS.map(r => (
                                <li key={r.text} className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Icon icon={r.icon} className="text-primary" width="18" />
                                    </div>
                                    <span className="text-sm text-[#2D3142] font-medium">{r.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right — Form */}
                <div className="!p-8 rounded-[24px] border border-border bg-white shadow-[0_8px_40px_-12px_rgba(53,88,114,0.12)]">
                    {submitted ? (
                        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                <Icon icon="solar:check-circle-bold" className="text-primary" width="36" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#2D3142] font-['Outfit']">Đã gửi thành công!</h3>
                            <p className="text-text-muted max-w-xs">
                                Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.
                            </p>
                            <button
                                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                                className="mt-2 text-sm font-semibold text-primary hover:underline"
                            >
                                Gửi tin nhắn khác
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <h3 className="text-xl font-bold text-[#2D3142] font-['Outfit'] mb-1">Gửi tin nhắn</h3>

                            {/* Name + Email */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-[#2D3142]">Họ và tên <span className="text-red-400">*</span></label>
                                    <input
                                        required name="name" value={form.name} onChange={handleChange}
                                        placeholder="Nguyễn Văn A"
                                        className={`${inputBase} !p-2`}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-[#2D3142]">Email <span className="text-red-400">*</span></label>
                                    <input
                                        required type="email" name="email" value={form.email} onChange={handleChange}
                                        placeholder="email@example.com"
                                        className={`${inputBase} !p-2`}
                                    />
                                </div>
                            </div>

                            {/* Subject */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-[#2D3142]">Chủ đề <span className="text-red-400">*</span></label>
                                <select
                                    required name="subject" value={form.subject} onChange={handleChange}
                                    className={`${inputBase} appearance-none !p-2`}
                                >
                                    <option value="" disabled>Chọn chủ đề...</option>
                                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            {/* Message */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-[#2D3142]">Nội dung <span className="text-red-400">*</span></label>
                                <textarea
                                    required name="message" value={form.message} onChange={handleChange}
                                    placeholder="Mô tả vấn đề hoặc câu hỏi của bạn..."
                                    rows={5}
                                    className={`${inputBase} resize-none !p-2`}
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="w-full !py-3.5 rounded-xl !text-black bg-gradient-to-r from-[#355872] to-[#7AAACE] text-white font-semibold text-sm shadow-[0_8px_20px_-4px_rgba(53,88,114,0.4)] hover:shadow-[0_12px_28px_-4px_rgba(53,88,114,0.5)] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <span>Gửi tin nhắn</span>
                                <Icon icon="solar:arrow-right-linear" width="18" />
                            </button>
                        </form>
                    )}
                </div>
            </section>

            {/* ── CTA ── */}
            <CTASection
                title="Muốn dùng thử trước khi liên hệ?"
                subtitle="Đăng ký miễn phí và khám phá EMS ngay hôm nay — không cần thẻ tín dụng."
                secondaryBtnText="Xem tính năng"
                secondaryBtnLink="/features"
            />
        </div>
    );
};

export default ContactUs;