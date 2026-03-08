import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import CTASection from '../../../components/common/CTASection';

// ── Data ─────────────────────────────────────────────────────────────────────

const PLANS = [
    {
        name: 'Miễn phí',
        desc: 'Dành cho gia sư cá nhân hoặc trung tâm nhỏ muốn thử nghiệm.',
        monthlyPrice: 0,
        yearlyPrice: 0,
        priceLabel: '0đ',
        cta: 'Bắt đầu miễn phí',
        ctaLink: '/register',
        highlight: false,
        features: [
            { text: 'Tối đa 30 học viên', included: true },
            { text: 'Tối đa 2 lớp học', included: true },
            { text: 'Điểm danh cơ bản', included: true },
            { text: 'Quản lý học viên', included: true },
            { text: '1 tài khoản giáo viên', included: true },
            { text: 'Báo cáo học tập', included: false },
            { text: 'Quản lý học phí', included: false },
            { text: 'Thông báo tự động', included: false },
            { text: 'Trợ giảng (TA)', included: false },
            { text: 'Xuất dữ liệu', included: false },
        ],
    },
    {
        name: 'Pro',
        desc: 'Dành cho trung tâm đang phát triển, cần đầy đủ tính năng.',
        monthlyPrice: 199000,
        yearlyPrice: 159000,
        highlight: true,
        badge: 'Phổ biến nhất',
        cta: 'Dùng thử 14 ngày',
        ctaLink: '/register',
        features: [
            { text: 'Không giới hạn học viên', included: true },
            { text: 'Không giới hạn lớp học', included: true },
            { text: 'Điểm danh & ghi chú buổi học', included: true },
            { text: 'Quản lý học viên nâng cao', included: true },
            { text: 'Nhiều tài khoản giáo viên', included: true },
            { text: 'Báo cáo học tập tự động', included: true },
            { text: 'Quản lý học phí linh hoạt', included: true },
            { text: 'Thông báo tự động cho phụ huynh', included: true },
            { text: 'Phân công Trợ giảng (TA)', included: true },
            { text: 'Xuất dữ liệu (Excel, PDF)', included: true },
        ],
    },
    {
        name: 'Enterprise',
        desc: 'Dành cho hệ thống trung tâm lớn, cần hỗ trợ và tùy chỉnh riêng.',
        monthlyPrice: null,
        yearlyPrice: null,
        priceLabel: 'Liên hệ',
        cta: 'Liên hệ tư vấn',
        ctaLink: '/contact',
        highlight: false,
        features: [
            { text: 'Tất cả tính năng Pro', included: true },
            { text: 'API tích hợp hệ thống', included: true },
            { text: 'SLA & uptime guarantee', included: true },
            { text: 'Hỗ trợ riêng (dedicated support)', included: true },
            { text: 'Custom domain & branding', included: true },
            { text: 'Đào tạo & onboarding riêng', included: true },
            { text: 'Báo cáo nâng cao theo yêu cầu', included: true },
            { text: 'Quản lý đa chi nhánh', included: true },
            { text: 'Backup dữ liệu hàng ngày', included: true },
            { text: 'Thanh toán linh hoạt theo hợp đồng', included: true },
        ],
    },
];

const FAQS = [
    {
        q: 'Tôi có thể nâng cấp hoặc hạ cấp gói bất cứ lúc nào không?',
        a: 'Có. Bạn có thể nâng cấp lên gói cao hơn bất cứ lúc nào và bắt đầu dùng tính năng ngay lập tức. Khi hạ cấp, thay đổi sẽ có hiệu lực vào kỳ gia hạn tiếp theo.',
    },
    {
        q: 'Gói miễn phí có giới hạn thời gian không?',
        a: 'Không. Gói miễn phí là mãi mãi (forever free) — không cần thẻ tín dụng, không bị tính phí sau thời gian dùng thử.',
    },
    {
        q: 'Dữ liệu của tôi có được bảo mật không?',
        a: 'Tất cả dữ liệu được mã hóa theo chuẩn AES-256. Chúng tôi không bán hay chia sẻ dữ liệu với bên thứ ba. Gói Enterprise có thêm backup hàng ngày và SLA bảo đảm.',
    },
    {
        q: 'Tôi thanh toán như thế nào?',
        a: 'EMS chấp nhận thanh toán qua chuyển khoản ngân hàng, ví điện tử (MoMo, ZaloPay) và thẻ tín dụng/ghi nợ quốc tế. Hóa đơn VAT được xuất tự động.',
    },
];

// ── Sub-components ────────────────────────────────────────────────────────────

const PricingCard = ({ plan, isYearly }) => {
    const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
    const displayPrice = plan.priceLabel
        ? plan.priceLabel
        : price === 0
            ? '0đ'
            : new Intl.NumberFormat('vi-VN').format(price) + 'đ';

    return (
        <div className={`!p-5   relative flex flex-col rounded-[24px] border transition-all duration-300 hover:-translate-y-1 ${plan.highlight
            ? 'border-primary bg-gradient-to-b from-[#2D3142] to-[#355872] text-white shadow-[0_20px_60px_-15px_rgba(53,88,114,0.5)]'
            : 'border-border bg-white hover:border-primary/30 hover:shadow-lg'
            }`}>
            {/* Popular badge */}
            {plan.badge && (
                <div className="absolute  -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-[#7AAACE] to-[#355872] text-white text-xs font-bold px-4 !p-1.5 rounded-full shadow-md whitespace-nowrap">
                        ✦ {plan.badge}
                    </span>
                </div>
            )}

            <div className="p-8 flex flex-col flex-1">
                {/* Header */}
                <div className="mb-6">
                    <h3 className={`text-xl font-extrabold font-['Outfit'] mb-1 ${plan.highlight ? '!text-white' : '!text-[#2D3142]'}`}>
                        {plan.name}
                    </h3>
                    <p className={`text-sm leading-relaxed ${plan.highlight ? '!text-white/70' : '!text-text-muted'}`}>
                        {plan.desc}
                    </p>
                </div>

                {/* Price */}
                <div className="mb-6">
                    <div className="flex items-end gap-1">
                        <span className={`text-4xl font-extrabold font-['Outfit'] ${plan.highlight ? '!text-white' : '!text-[#2D3142]'}`}>
                            {displayPrice}
                        </span>
                        {price !== null && price > 0 && (
                            <span className={`text-sm mb-1.5 ${plan.highlight ? '!text-white/60' : '!text-text-muted'}`}>/tháng</span>
                        )}
                    </div>
                    {isYearly && plan.monthlyPrice > 0 && (
                        <p className={`text-xs mt-1 ${plan.highlight ? '!text-white/60' : '!text-text-muted'}`}>
                            Thanh toán <span className="font-semibold">{new Intl.NumberFormat('vi-VN').format(plan.yearlyPrice * 12)}đ/năm</span>
                            <span className="!px-2 !ml-2 bg-emerald-400/20 text-emerald-300 px-1.5 py-0.5 rounded text-xs font-bold">-20%</span>
                        </p>
                    )}
                </div>

                {/* CTA button */}
                <Link to={plan.ctaLink}>
                    <button className={`w-full !py-3 rounded-xl font-semibold text-sm transition-all duration-300 !my-5 ${plan.highlight
                            ? '!bg-white !text-[#2D3142] hover:bg-white/90 shadow-md'
                            : '!bg-gradient-to-r from-[#355872] to-[#7AAACE] !text-white hover:shadow-[0_8px_20px_-4px_rgba(53,88,114,0.4)] hover:scale-[1.02]'
                        }`}>
                        {plan.cta}
                    </button>
                </Link>

                {/* Divider */}
                <div className={`h-px mb-6 ${plan.highlight ? '!bg-white/10' : '!bg-border'}`} />

                {/* Features */}
                <ul className="flex flex-col gap-3 flex-1">
                    {plan.features.map(f => (
                        <li key={f.text} className="!p-2 flex items-start gap-3">
                            <Icon
                                icon={f.included ? 'solar:check-circle-bold' : 'solar:close-circle-bold'}
                                className={f.included
                                    ? (plan.highlight ? 'text-emerald-300' : 'text-primary')
                                    : (plan.highlight ? 'text-white/20' : 'text-border')}
                                width="18"
                            />
                            <span className={`text-sm ${f.included
                                ? (plan.highlight ? 'text-white/90' : 'text-[#2D3142]')
                                : (plan.highlight ? 'text-white/30' : 'text-text-muted/50')
                                }`}>
                                {f.text}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const FAQItem = ({ q, a }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="border !p-5 border-border rounded-[16px] overflow-hidden">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-primary/[0.02] transition-colors duration-200"
            >
                <span className="font-semibold text-[#2D3142] font-['Outfit'] text-md">{q}</span>
                <Icon
                    icon={open ? 'solar:alt-arrow-up-linear' : 'solar:alt-arrow-down-linear'}
                    className="text-primary flex-shrink-0"
                    width="20"
                />
            </button>
            {open && (
                <div className="px-6 pb-5 text-sm text-text-muted leading-relaxed border-t border-border pt-4">
                    {a}
                </div>
            )}
        </div>
    );
};

// ── Page ─────────────────────────────────────────────────────────────────────

const Pricing = () => {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <div className="overflow-x-hidden container">

            {/* Hero */}
            <section className="!pt-15 text-center">
                <div className="!p-2 inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-8">
                    <Icon icon="solar:tag-price-linear" width="16" />
                    <span>Minh bạch, không phí ẩn</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-extrabold text-[#2D3142] font-['Outfit'] leading-tight mb-6 max-w-3xl !mx-auto">
                    Chọn gói phù hợp với{' '}
                    <span className="text-primary">trung tâm của bạn</span>
                </h1>
                <p className="text-xl text-text-muted max-w-xl !mx-auto leading-relaxed">
                    Bắt đầu miễn phí, nâng cấp khi cần. Không ràng buộc hợp đồng dài hạn.
                </p>
            </section>

            {/* Billing toggle */}
            <div className="flex items-center justify-center gap-4 !mt-10">
                <span className={`text-sm font-semibold ${!isYearly ? '!text-[#2D3142]' : '!text-text-muted'}`}>Hàng tháng</span>
                <button
                    onClick={() => setIsYearly(y => !y)}
                    className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${isYearly ? '!bg-primary' : '!bg-slate-300'}`}
                >
                    <span className={`absolute top-1.5 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${isYearly ? 'left-8' : 'left-1.5'}`} />
                </button>
                <span className={`text-sm font-semibold ${isYearly ? '!text-[#2D3142]' : '!text-text-muted'}`}>
                    Hàng năm
                    <span className="!px-2 !ml-2 bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">-20%</span>
                </span>
            </div>

            {/* Pricing cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 !mt-10 !pb-20 items-start">
                {PLANS.map(plan => <PricingCard key={plan.name} plan={plan} isYearly={isYearly} />)}
            </section>

            {/* FAQ */}
            <section className="">
                <div className="text-center !mb-12">
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-[#2D3142] font-['Outfit'] tracking-tight">
                        Câu hỏi <span className="text-primary">thường gặp</span>
                    </h2>
                </div>
                <div className=" max-w-3xl !mx-auto flex flex-col gap-3">
                    {FAQS.map(faq => <FAQItem key={faq.q} {...faq} />)}
                </div>
            </section>

            {/* CTA */}
            <CTASection
                title="Vẫn chưa chắc chắn? Hãy thử miễn phí!"
                subtitle="Gói miễn phí không giới hạn thời gian — không cần thẻ tín dụng, không cam kết."
                secondaryBtnText="Xem tính năng"
                secondaryBtnLink="/features"
            />
        </div>
    );
};

export default Pricing;