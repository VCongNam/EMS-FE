import React from 'react';
import Button from '../../../components/ui/Button';
import heroImg from '../../../assets/images/heroPic2.jpg';
import heroImg2 from '../../../assets/images/heroPic3.jpg';

const LandingPage = () => {
    return (
        <div className="overflow-x-hidden">
            {/* Hero Section */}
            <section className="container-fluid !px-50 !pt-16 grid grid-cols-1 lg:grid-cols-5 items-center justify-between py-16 lg:py-24 gap-12 lg:gap-16 animate-fade-in">
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
                    </div>
                </div>

                <div className="lg:col-span-2 w-full mt-12 lg:mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:grid-rows-2 w-full h-full max-w-[600px] lg:max-w-none mx-auto lg:mx-0">
                        {/* Ảnh chính to nhất chiếm 2/3 diện tích */}
                        <div className="md:col-span-2 md:row-span-2 rounded-[32px] overflow-hidden shadow-[0_20px_40px_-15px_rgba(53,88,114,0.3)] transition-transform duration-500 hover:-translate-y-2 hover:shadow-[0_25px_50px_-15px_rgba(53,88,114,0.4)]">
                            <img src={heroImg} alt="Hero Main Dashboard" className="w-full h-full object-cover" />
                        </div>

                        {/* 2 ảnh phụ nằm bên cạnh */}
                        <div className="rounded-[24px] overflow-hidden shadow-lg transition-transform duration-500 hover:-translate-y-1 hover:shadow-xl mt-4 md:mt-0 aspect-video md:aspect-auto">
                            <img src={heroImg2} alt="Hero Feature 1" className="w-full h-full object-cover" />
                        </div>
                        <div className="rounded-[24px] overflow-hidden shadow-lg transition-transform duration-500 hover:-translate-y-1 hover:shadow-xl mb-4 md:mb-0 aspect-video md:aspect-auto">
                            <img src={heroImg} alt="Hero Feature 2" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </section >

            {/* Features Section */}
            < section className="container py-24 text-center" >

            </section >
        </div >
    );
};

export default LandingPage;

