import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';

import useAuthStore from '../../store/authStore';

const SideMenu = ({ isOpen, onClose }) => {
    const location = useLocation();
    const { user, logout } = useAuthStore();
    const role = user?.role || 'student';

    const menuConfigs = {
        student: [
            { name: 'Tổng quan', path: '/dashboard', icon: 'material-symbols:dashboard-rounded' },
            { name: 'Lớp học của tôi', path: '/my-classes', icon: 'material-symbols:school-rounded' },
            { name: 'Thời khóa biểu', path: '/schedule', icon: 'material-symbols:calendar-month-rounded' },
            { name: 'Kết quả học tập', path: '/results', icon: 'material-symbols:trending-up-rounded' },
            { name: 'Trang cá nhân', path: '/profile', icon: 'material-symbols:person-rounded' },
        ],
        teacher: [
            { name: 'Tổng quan', path: '/dashboard', icon: 'material-symbols:dashboard-rounded' },
            { name: 'Quản lý Lớp học', path: '/classes', icon: 'material-symbols:school-rounded' },
            { name: 'Quản lý Học sinh', path: '/group-rounded', icon: 'material-symbols:group-rounded' },
            { name: 'Lịch dạy', path: '/schedule', icon: 'material-symbols:calendar-month-rounded' },
            { name: 'Trang cá nhân', path: '/profile', icon: 'material-symbols:person-rounded' },
        ],
        assistant: [
            { name: 'Tổng quan', path: '/dashboard', icon: 'material-symbols:dashboard-rounded' },
            { name: 'Lớp hỗ trợ', path: '/assisted-classes', icon: 'material-symbols:handshake-rounded' },
            { name: 'Danh sách học sinh', path: '/students', icon: 'material-symbols:group-rounded' },
            { name: 'Lịch trực', path: '/schedule', icon: 'material-symbols:calendar-month-rounded' },
            { name: 'Trang cá nhân', path: '/profile', icon: 'material-symbols:person-rounded' },
        ],
    };

    const menuItems = menuConfigs[role] || menuConfigs.student;

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            <aside
                className={`w-72 bg-[#355872] text-white flex flex-col fixed inset-y-0 left-0 z-[70] shadow-2xl transition-transform duration-300 transform 
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                <div className="!p-5 border-b border-white/10 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-15 h-15 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                            <Icon icon="material-symbols:school" className="text-3xl text-white" />
                        </div>
                        <span className="text-2xl font-bold font-['Outfit'] tracking-tight">
                            {role === 'student' ? 'EMS' : role === 'teacher' ? 'EMS' : 'EMS'}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="lg:hidden text-white/50 hover:text-white transition-colors"
                    >
                        <Icon icon="material-symbols:close-rounded" className="text-2xl" />
                    </button>
                </div>

                <nav className="flex-1 !p-5 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => {
                                    if (window.innerWidth < 1024) onClose();
                                }}
                                className={`flex items-center gap-3 !p-4 rounded-2xl transition-all duration-300 font-medium ${isActive
                                    ? 'bg-white !text-[#355872] shadow-lg'
                                    : 'hover:bg-white/10 text-white/70 hover:text-white'
                                    }`}
                            >
                                <Icon icon={item.icon} className="text-2xl" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="!p-5 border-t border-white/10">
                    <button
                        onClick={() => {
                            logout();
                            window.location.href = '/login';
                        }}
                        className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-red-500/20 text-red-100 transition-all font-medium cursor-pointer"
                    >
                        <Icon icon="material-symbols:logout-rounded" className="text-2xl" />
                        Đăng xuất
                    </button>
                </div>
            </aside>
        </>
    );
};

export default SideMenu;
