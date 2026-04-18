import React from 'react';
import { usePWA } from '../../../contexts/PWAContext';
import { Icon } from '@iconify/react';
import Button from '../../../components/ui/Button';
import heroImg from '../../../assets/images/heroPic1.png';
import heroImg2 from '../../../assets/images/heroPic2.png';
import heroImg3 from '../../../assets/images/heroPic3.png';
import feature1 from '../../../assets/images/feature1.png';
import feature2 from '../../../assets/images/feature2.png';
import feature3 from '../../../assets/images/feature3.png';
import feature4 from '../../../assets/images/feature4.png';
import attendance from '../../../assets/images/attendance.png';
import dash from '../../../assets/images/dash.png';
import report from '../../../assets/images/report.png';
import finance from '../../../assets/images/finance.png';
import FeatureCard from '../components/FeatureCard';
import StepCard from '../components/StepCard';
import CTASection from '../../../components/common/CTASection';
import ImageCarousel from '../../../components/common/ImageCarousel';

const LandingPage = () => {
    const { isInstallable, installApp } = usePWA();
    const features = [
        {
            icon: <img src={feature1} alt="feature1" />,
            title: 'Quản lý lớp học trực quan',
            description: 'Dễ dàng sắp xếp lịch học, phân bổ giáo viên và quản lý học viên với giao diện thân thiện.',
            iconColor: 'text-yellow-600',
        },
        {
            icon: <img src={feature2} alt="feature2" />,
            title: 'Tương tác trong lớp',
            description: 'Diễn đàn thảo luận, điểm danh trực tuyến và báo cáo chi tiết giúp theo dõi sự tham gia của học viên.',
            iconColor: 'text-orange-600',
        },
        {
            icon: <img src={feature3} alt="feature3" />,
            title: 'Phù hợp quy mô trong nước',
            description: 'Hệ thống tập trung vào nhu cầu quản lý lớp học tại Việt Nam, hỗ trợ đa dạng cấp học và hình thức đào tạo.',
            iconColor: 'text-green-600',
        },
        {
            icon: <img src={feature4} alt="feature4" />,
            title: 'Chính sách học phí linh hoạt',
            description: 'Cho phép quản lý học phí, giảm trừ hoặc miễn phí theo từng lớp, từng học viên.',
            iconColor: 'text-purple-600',
        }
    ];

    const steps = [
        {
            number: '01',
            title: 'Đăng ký & Khởi tạo',
            description: 'Tạo tài khoản và thiết lập thông tin trung tâm ban đầu chỉ trong vài phút.',
            icon: 'solar:rocket-2-linear'
        },
        {
            number: '02',
            title: 'Quản lý Lớp & Học viên',
            description: 'Import danh mục, sắp xếp lịch học và phân quyền cho giáo viên/trợ giảng.',
            icon: 'solar:users-group-rounded-linear'
        },
        {
            number: '03',
            title: 'Vận hành & Tự động hóa',
            description: 'Theo dõi điểm danh, học phí và tự động gửi báo cáo tiến độ cho phụ huynh.',
            icon: 'solar:chart-2-linear'
        }
    ];

    const carouselImages = [
        {
            src: dash,
            alt: 'Trang tổng quan',
            caption: 'Bảng điều khiển tổng quan — theo dõi mọi thứ trong một màn hình'
        },
        {
            src: 'https://placehold.co/1280x720/2D3142/ffffff?text=Quản+Lý+Lớp+Học',
            alt: 'Quản lý lớp học',
            caption: 'Quản lý lớp học — sắp xếp lịch học và phân công giáo viên dễ dàng'
        },
        {
            src: finance,
            alt: 'Báo cáo học phí',
            caption: 'Báo cáo học phí — theo dõi doanh thu và lịch sử thanh toán'
        },
        {
            src: attendance,
            alt: 'Điểm danh trực tuyến',
            caption: 'Điểm danh trực tuyến — ghi nhận sự tham gia của học viên tức thì'
        },
        {
            src: report,
            alt: 'Báo cáo phụ huynh',
            caption: 'Báo cáo phụ huynh — tự động gửi tiến độ học tập định kỳ'
        },
    ];

    return (
        <div className="overflow-x-hidden container">
            {/* Hero Section */}
            <section className="container-fluid bg !pt-16 grid grid-cols-1 lg:grid-cols-5 items-center justify-between py-16 lg:py-24 gap-12 lg:gap-16 animate-fade-in">
                <div className="lg:col-span-3 text-center lg:text-left">
                    <h3 className="text-4xl lg:text-6xl font-bold !mb-6 leading-tight">
                        Nâng tầm chuyên nghiệp cho mô hình giáo dục của bạn.
                    </h3>
                    <p className="text-xl text-text-muted mb-10 !pb-2 max-w-xl mx-auto lg:mx-0">
                        Hệ thống SaaS quản lý toàn diện: Từ theo dõi doanh thu thực tế đến gửi báo cáo tiến độ định kỳ cho phụ huynh chuyên nghiệp. Quản lý phân quyền thông minh cho Giáo viên và Trợ giảng.
                    </p>
                    <div className="flex mt-1 flex-wrap gap-6 justify-center lg:justify-start">
                        <Button size="lg" className="!bg-gradient-to-r !p-3 !from-[#355872] !to-[#7AAACE] !text-white border-none shadow-[0_10px_20px_-5px_rgba(53,88,114,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(53,88,114,0.5)] hover:scale-105 transition-all duration-300 animate-shine"
                        >Bắt đầu miễn phí</Button>
                        <Button variant="outline" size="lg">Tìm hiểu thêm về EMS</Button>
                        <Button
                            size="lg"
                            className="!bg-green-600 !text-white border-none shadow-lg hover:bg-green-700 transition-all flex items-center gap-2"
                            onClick={installApp}
                        >
                            <Icon icon="material-symbols:download-for-offline-rounded" className="text-2xl" />
                            Tải ứng dụng
                        </Button>
                    </div>
                </div>

                <div className="lg:col-span-2 w-full mt-12 lg:mt-0 px-4">
                    <div className="grid grid-cols-2 gap-4 lg:gap-6 w-full max-w-[500px] lg:max-w-none mx-auto lg:mx-0">
                        {/* Ảnh dọc chữ nhật to */}
                        <div className="row-span-2 rounded-[32px] overflow-hidden shadow-[0_20px_40px_-15px_rgba(53,88,114,0.3)] transition-transform duration-500 hover:-translate-y-2 hover:shadow-[0_25px_50px_-15px_rgba(53,88,114,0.4)]">
                            <img src={heroImg} alt="Hero Main Vertical" className="w-full h-full object-cover min-h-[400px] lg:min-h-[500px]" />
                        </div>

                        {/* 2 ảnh vuông nằm bên cạnh */}
                        <div className="rounded-[24px] overflow-hidden shadow-lg transition-transform duration-500 hover:-translate-y-1 hover:shadow-xl aspect-square">
                            <img src={heroImg2} alt="Hero Square 1" className="w-full h-full object-cover" />
                        </div>
                        <div className="rounded-[24px] overflow-hidden shadow-lg transition-transform duration-500 hover:-translate-y-1 hover:shadow-xl aspect-square">
                            <img src={heroImg3} alt="Hero Square 2" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </section >

            {/* Features Section */}
            <section className="!pt-16">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-[#2D3142] font-['Outfit']">
                        Tại sao lại lựa chọn <span className="text-primary font-bold">EMS ?</span>
                    </h2>
                </div>

                <div className=" !py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            {...feature}
                        />
                    ))}
                </div>
            </section>

            {/* How it works Section */}
            <section className=" relative overflow-hidden">
                <div className="text-center mb-24">
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-[#2D3142] font-['Outfit'] tracking-tight">
                        Bắt đầu <span className="text-primary font-bold">dễ dàng</span>
                    </h2>
                    <p className="text-text-muted text-lg !mb-4 max-w-2xl !mx-auto text-center">
                        Quy trình thiết lập đơn giản giúp bạn tối ưu hóa việc quản lý lớp học của mình chỉ trong <span className="text-primary font-bold">3 bước.</span>
                    </p>
                </div>

                <div className="relative">
                    {/* Central Timeline Line (Desktop) */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px border-l-2 border-dashed border-border -translate-x-1/2" />

                    <div className="space-y-20 md:space-y-32">
                        {steps.map((step, index) => (
                            <StepCard
                                key={index}
                                {...step}
                                isReversed={index % 2 !== 0}
                            />
                        ))}
                    </div>
                </div>
            </section>
            {/* Picture Section */}
            <ImageCarousel
                images={carouselImages}
                title="Hình ảnh thực tế"
                subtitle="Khám phá giao diện trực quan và đầy đủ tính năng của EMS."
            />

            {/* CTA Section */}
            <CTASection />
        </div >
    );
};

export default LandingPage;

