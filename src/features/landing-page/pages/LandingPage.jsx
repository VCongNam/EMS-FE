import React from 'react';
import Button from '../../../components/ui/Button';

const LandingPage = () => {
    return (
        <div className="overflow-x-hidden">
            {/* Hero Section */}
            <section className="container flex flex-col lg:flex-row items-center justify-between py-16 lg:py-24 gap-16 animate-fade-in">
                <div className="flex-1 text-center lg:text-left">
                    <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                        Quản lý giáo dục <br />
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Thông minh & Hiệu quả
                        </span>
                    </h1>
                    <p className="text-xl text-text-muted mb-10 max-w-xl mx-auto lg:mx-0">
                        Giải pháp toàn diện giúp tối ưu hóa quy trình dạy và học,
                        kết nối nhà trường, giáo viên và học sinh trên một nền tảng duy nhất.
                    </p>
                    <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
                        <Button size="lg">Bắt đầu miễn phí</Button>
                        <Button variant="outline" size="lg">Xem bài hướng dẫn</Button>
                    </div>
                </div>

                <div className="flex-1 flex justify-center lg:justify-end">
                    <div className="w-full max-w-[500px] aspect-[5/4] bg-gradient-to-br from-primary/10 to-white border border-dashed border-primary rounded-[40px] flex items-center justify-center relative">
                        <span className="text-primary font-semibold text-lg">Hero Illustration</span>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container py-24 text-center">
                <h2 className="text-4xl font-bold mb-16">Tại sao chọn EMS?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-surface p-10 rounded-3xl border border-border transition-all duration-300 text-left hover:-translate-y-2 hover:border-primary hover:shadow-premium">
                        <div className="text-5xl mb-6">📊</div>
                        <h3 className="text-xl font-bold mb-3">Báo cáo chi tiết</h3>
                        <p className="text-text-muted">Theo dõi tiến độ học tập của từng học sinh qua biểu đồ trực quan.</p>
                    </div>
                    <div className="bg-surface p-10 rounded-3xl border border-border transition-all duration-300 text-left hover:-translate-y-2 hover:border-primary hover:shadow-premium">
                        <div className="text-5xl mb-6">📅</div>
                        <h3 className="text-xl font-bold mb-3">Lịch học thông minh</h3>
                        <p className="text-text-muted">Tự động sắp xếp thời khóa biểu và nhắc nhở lịch học.</p>
                    </div>
                    <div className="bg-surface p-10 rounded-3xl border border-border transition-all duration-300 text-left hover:-translate-y-2 hover:border-primary hover:shadow-premium">
                        <div className="text-5xl mb-6">💬</div>
                        <h3 className="text-xl font-bold mb-3">Tương tác trực tiếp</h3>
                        <p className="text-text-muted">Hỗ trợ kênh giao tiếp nhanh giữa phụ huynh và giáo viên.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;

