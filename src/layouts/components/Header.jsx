import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import logo from '../../assets/images/emsIcon.png';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Trang chủ', path: '/' },
        { name: 'Về chúng tôi', path: '/about' },
        { name: 'Tính năng', path: '/features' },
        { name: 'Giá cả', path: '/pricing' },
        { name: 'Liên hệ', path: '/contact' },
    ];

    return (
        <header className="h-[70px] fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-border z-[1000] flex items-center">
            <div className="container flex justify-between items-center w-full relative">

                {/* Left: Logo & Name */}
                <div className="flex-1 flex justify-start">
                    <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-[#355872] font-['Outfit']">
                        <img src={logo} alt="EMS Logo" className="w-10 h-10 object-contain" />
                        <span className="tracking-tight">EMS</span>
                    </Link>
                </div>

                {/* Center: Navigation (Desktop) */}
                <nav className="hidden lg:flex items-center gap-8 flex-none">
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

                {/* Right: Action Buttons (Desktop) */}
                <div className="hidden lg:flex items-center justify-end gap-3 flex-1">
                    <Link to="/login">
                        <Button variant="outline" size="md">Đăng nhập</Button>
                    </Link>
                    <Link to="/register">
                        <Button
                            variant="primary"
                            size="md"
                            className="!bg-gradient-to-r !p-3 !from-[#355872] !to-[#7AAACE] !text-white border-none shadow-[0_10px_20px_-5px_rgba(53,88,114,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(53,88,114,0.5)] hover:scale-105 transition-all duration-300 animate-shine"
                        >
                            Tham gia ngay
                        </Button>
                    </Link>
                </div>

                {/* Mobile: Menu Button */}
                <button
                    className="lg:hidden p-2 text-text-main"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <div className="w-6 h-5 relative flex flex-col justify-between">
                        <span className={`h-0.5 w-full bg-current rounded-full transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`h-0.5 w-full bg-current rounded-full transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`h-0.5 w-full bg-current rounded-full transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </div>
                </button>

                {/* Mobile: Navigation Menu */}
                <div className={`
          absolute top-full left-0 right-0 bg-white border-b border-border shadow-xl transition-all duration-300 lg:hidden
          ${isMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'}
        `}>
                    <div className="container py-6 flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className="text-lg font-medium text-text-muted hover:text-primary py-2"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <hr className="border-border my-2" />
                        <div className="flex flex-col gap-3">
                            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                <Button variant="outline" size="lg" className="w-full">Đăng nhập</Button>
                            </Link>
                            <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="w-full !p-3 !mb-3 !bg-gradient-to-r !from-[#355872] !to-[#7AAACE] !text-white border-none animate-shine"
                                >
                                    Tham gia ngay
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </header>
    );
};

export default Header;
