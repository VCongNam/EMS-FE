import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SideMenu = () => {
    const location = useLocation();

    const menuItems = [
        { name: 'Tổng quan', path: '/dashboard', icon: '📊' },
        { name: 'Quản lý Lớp học', path: '/classes', icon: '🏫' },
        { name: 'Quản lý Học sinh', path: '/students', icon: '👨‍🎓' },
        { name: 'Quản lý Giáo viên', path: '/teachers', icon: '👨‍🏫' },
        { name: 'Thời khóa biểu', path: '/schedule', icon: '📅' },
        { name: 'Cài đặt', path: '/settings', icon: '⚙️' },
    ];

    return (
        <aside className="w-72 bg-[#355872] text-white flex flex-col fixed inset-y-0 left-0 z-50 shadow-2xl">
            <div className="p-8 border-b border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                    <span className="text-2xl">🎓</span>
                </div>
                <span className="text-2xl font-bold font-['Outfit'] tracking-tight">EMS Admin</span>
            </div>

            <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 font-medium ${isActive
                                ? 'bg-white text-[#355872] shadow-lg'
                                : 'hover:bg-white/10 text-white/70 hover:text-white'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-white/10">
                <Link to="/login" className="flex items-center gap-3 p-4 rounded-2xl hover:bg-red-500/20 text-red-100 transition-all font-medium">
                    <span>🚪</span>
                    Đăng xuất
                </Link>
            </div>
        </aside>
    );
};

export default SideMenu;
