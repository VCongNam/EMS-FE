import React from 'react';
import Button from '../ui/Button';

const CTASection = ({
    title = 'Sẵn sàng nâng tầm việc dạy học của bạn ngay hôm nay?',
    subtitle = 'Đăng ký miễn phí ngay hôm nay và trải nghiệm hệ thống quản lý lớp học thông minh nhất.',
    primaryBtnText = 'Bắt đầu miễn phí',
    secondaryBtnText = 'Tìm hiểu thêm',
    primaryBtnLink = '/register',
    secondaryBtnLink = '/features',
}) => {
    return (
        <section className="!py-16">
            <div className="!p-10 relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#2D3142] via-[#355872] to-[#7AAACE] px-8 py-16 md:px-16 md:py-20 flex items-center justify-center text-center">

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full pointer-events-none" />

                {/* Content */}
                <div className="relative z-10 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold !text-white font-['Outfit'] tracking-tight mb-6 leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                        {title}
                    </h2>
                    <p className="text-lg md:text-xl text-white/70 mb-10 leading-relaxed">
                        {subtitle}
                    </p>

                    <div className=" !pt-2 flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a href={primaryBtnLink}>
                            <Button
                                size="lg"
                                className="bg-white !text-[#355872] !border-none !shadow-[0_10px_30px_-5px_rgba(0,0,0,0.3)] hover:!shadow-[0_15px_40px_-5px_rgba(0,0,0,0.4)] hover:!scale-105 !font-bold !px-14 !py-5 !text-lg"
                            >
                                {primaryBtnText}
                            </Button>
                        </a>
                        <a href={secondaryBtnLink}>
                            <Button
                                variant="ghost"
                                size="lg"
                                className="!text-white !border-white/30 !border hover:!bg-white/10 !px-14 !py-5 !text-lg"
                            >
                                {secondaryBtnText}
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
