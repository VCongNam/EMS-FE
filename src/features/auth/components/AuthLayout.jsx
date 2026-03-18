import React from 'react';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen bg-background flex w-full relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px]"></div>

            <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-surface relative z-10">
                {/* Left Side: Branding/Image */}
                <div className="hidden lg:flex flex-col justify-between !p-12 xl:!p-20 bg-primary relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary/90 opacity-90"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 text-white !mb-12">
                            <img src="/emsIcon.png" alt="EMS Logo" className="w-10 h-10 object-contain drop-shadow-md" />
                            <span className="text-2xl font-bold font-['Outfit'] tracking-tight">Extra-Class Management System</span>
                        </div>

                        <h1 className="text-5xl xl:text-6xl font-bold text-white !mb-6 leading-tight">
                            Elevate your <br />
                            <span className="text-accent">Learning Journey</span>
                        </h1>
                        <p className="text-white/80 text-lg xl:text-xl max-w-md">
                            Hệ thống quản lý giáo dục thông minh giúp bạn tối ưu hóa quy trình dạy và học một cách hiện đại nhất.
                        </p>
                    </div>

                    <div className="relative z-10 !mt-auto !pt-10 border-t border-white/10">
                        <p className="text-white/50 text-sm">
                            © {new Date().getFullYear()} EMS. All rights reserved.
                        </p>
                    </div>
                </div>

                {/* Right Side: Auth Form */}
                <div className="!p-8 md:!p-16 lg:!p-24 flex flex-col justify-center items-center h-screen overflow-y-auto w-full">
                    <div className="max-w-md w-full !my-auto">
                        <div className="!mb-10 lg:hidden flex items-center justify-center gap-2 text-primary font-bold">
                            <img src="/emsIcon.png" alt="EMS Logo" className="w-10 h-10 object-contain" />
                            <span className="text-3xl font-['Outfit']">EMS</span>
                        </div>

                        <div className="!mb-8">
                            <h2 className="text-3xl xl:text-4xl font-bold text-text-main !mb-3 tracking-tight">{title}</h2>
                            <p className="text-text-muted text-base">{subtitle}</p>
                        </div>

                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
