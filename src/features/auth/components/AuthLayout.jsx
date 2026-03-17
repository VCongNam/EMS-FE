import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle, panelContent }) => {
    return (
        <div className="min-h-screen bg-background flex items-stretch">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 bg-primary flex-col justify-between p-12 relative overflow-hidden">
                {/* Subtle geometric decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />

                {/* Logo */}
                <div className="relative z-10">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-md">
                            <span className="text-primary font-bold text-lg leading-none" style={{ fontFamily: 'Outfit, sans-serif' }}>E</span>
                        </div>
                        <span className="text-white text-xl font-bold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>EMS</span>
                    </Link>
                </div>

                {/* Center content */}
                <div className="relative z-10 flex-1 flex flex-col justify-center py-16">
                    {panelContent ? panelContent : (
                        <>
                            <div className="mb-6">
                                <span className="inline-block px-3 py-1 bg-white/15 text-white/90 text-xs font-semibold rounded-full uppercase tracking-wider">
                                    Hệ thống Quản lý Giáo dục
                                </span>
                            </div>
                            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
                                Nền tảng quản lý<br />
                                <span className="text-accent">thông minh</span><br />
                                cho giáo dục
                            </h1>
                            <p className="text-white/65 text-base leading-relaxed max-w-xs">
                                Quản lý lớp học, điểm số và lịch học một cách hiệu quả. Kết nối giáo viên, trợ giảng và học sinh trong một nền tảng duy nhất.
                            </p>
                        </>
                    )}

                    {/* Stats */}
                    <div className="mt-12 grid grid-cols-3 gap-6">
                        {[
                            { value: '500+', label: 'Lớp học' },
                            { value: '10K+', label: 'Học sinh' },
                            { value: '99%', label: 'Hài lòng' },
                        ].map((stat) => (
                            <div key={stat.label}>
                                <p className="text-white text-2xl font-bold">{stat.value}</p>
                                <p className="text-white/50 text-xs mt-0.5">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10">
                    <p className="text-white/35 text-xs">
                        © {new Date().getFullYear()} EMS Project. All rights reserved.
                    </p>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 lg:p-14 overflow-y-auto">
                {/* Mobile logo */}
                <div className="lg:hidden mb-8 self-start">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>E</span>
                        </div>
                        <span className="text-primary text-lg font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>EMS</span>
                    </Link>
                </div>

                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-text-main mb-2 text-balance">{title}</h2>
                        <p className="text-text-muted leading-relaxed">{subtitle}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
