import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/emsIcon.png';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const navLinks = [
        { name: 'Trang chủ', path: '/' },
        { name: 'Về chúng tôi', path: '/about' },
        { name: 'Tính năng', path: '/features' },
        { name: 'Giá cả', path: '/pricing' },
        { name: 'Liên hệ', path: '/contact' },
    ];

    return (
        <footer className="bg-white border-t border-border pt-16 pb-8 mt-16">
            <div className="container flex flex-col items-center">
                {/* Top: Centered Logo */}
                <div className="!mb-10 animate-fade-in text-center">
                    <Link to="/" className="flex flex-col items-center gap-3 text-3xl font-bold text-[#355872] font-['Google Sans'] group">
                        <img
                            src={logo}
                            alt="EMS Logo"
                            className="w-14 h-14 object-contain transition-transform duration-500 group-hover:scale-110"
                        />
                        <span className="tracking-tight">Extra-Class Management System</span>
                    </Link>
                </div>

                {/* Middle: Centered Navigation Links */}
                <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 !mb-12 max-w-2xl px-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="text-[15px] font-medium text-text-muted hover:text-[#355872] transition-all duration-300 relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#355872] transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    ))}
                </nav>

                {/* Bottom Separator & Details */}
                <div className="w-full border-t border-border pt-10 flex flex-col items-center gap-8">
                    {/* Copyright & Secondary Links */}
                    <div className="flex flex-col items-center gap-4 text-text-muted text-[14px] text-center">
                        <p>&copy; {currentYear} EMS Project. All rights reserved.</p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <Link to="/privacy" className="hover:text-[#355872] transition-colors">Bảo mật</Link>
                            <Link to="/terms" className="hover:text-[#355872] transition-colors">Điều khoản</Link>
                            <Link to="/sitemap" className="hover:text-[#355872] transition-colors">Sitemap</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
