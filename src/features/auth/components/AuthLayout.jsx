import React from 'react';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px]"></div>

            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-surface rounded-[40px] shadow-premium overflow-hidden border border-border/50 relative z-10">
                {/* Left Side: Branding/Image */}
                <div className="hidden lg:flex flex-col justify-between p-12 bg-primary relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-secondary opacity-90"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 text-white mb-12">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                                <span className="text-2xl">🎓</span>
                            </div>
                            <span className="text-2xl font-bold font-['Outfit'] tracking-tight">EMS Project</span>
                        </div>

                        <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                            Elevate your <br />
                            <span className="text-accent">Learning Journey</span>
                        </h1>
                        <p className="text-white/70 text-lg max-w-sm">
                            Hệ thống quản lý giáo dục thông minh giúp bạn tối ưu hóa quy trình dạy và học một cách hiện đại nhất.
                        </p>
                    </div>

                    <div className="relative z-10 mt-auto pt-10 border-t border-white/10">
                        <p className="text-white/50 text-sm">
                            © {new Date().getFullYear()} EMS. All rights reserved.
                        </p>
                    </div>
                </div>

                {/* Right Side: Auth Form */}
                <div className="p-8 md:p-16 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        <div className="mb-10 lg:hidden flex items-center gap-2 text-primary font-bold">
                            <span className="text-2xl">🎓</span>
                            <span className="text-xl font-['Outfit']">EMS</span>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-text-main mb-2 tracking-tight">{title}</h2>
                            <p className="text-text-muted">{subtitle}</p>
                        </div>

                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
