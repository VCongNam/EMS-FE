import React from 'react';
import logo from '../../assets/images/emsIcon.png';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-surface border-t border-border py-16 mt-16">
            <div className="container grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-2xl font-bold text-primary font-['Outfit']">
                        <img src={logo} alt="EMS Logo" className="w-10 h-10 object-contain" />
                        <span>EMS</span>
                    </div>
                    <p className="text-text-muted max-w-xs">
                        Hệ thống quản lý giáo dục thông minh và hiện đại.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <h4 className="font-bold text-lg">Liên kết</h4>
                    <ul className="flex flex-col gap-2">
                        <li><a href="#" className="text-text-muted hover:text-primary transition-colors">Hỗ trợ</a></li>
                        <li><a href="#" className="text-text-muted hover:text-primary transition-colors">Chính sách</a></li>
                        <li><a href="#" className="text-text-muted hover:text-primary transition-colors">Liên hệ</a></li>
                    </ul>
                </div>

                <div className="col-span-1 md:col-span-2 border-t border-border pt-8 text-center text-text-muted text-sm">
                    <p>&copy; {currentYear} EMS Project. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
