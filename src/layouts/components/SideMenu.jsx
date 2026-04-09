import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';

import useAuthStore from '../../store/authStore';

const SideMenu = ({ isOpen, onClose }) => {
    const location = useLocation();
    const { user, logout } = useAuthStore();
    const role = user?.role || 'student';

    const menuConfigs = {
        student: [
            { name: 'Bảng điều khiển', path: '/dashboard', icon: 'material-symbols:dashboard-rounded' },
            { name: 'Lớp học của tôi', path: '/student/classes', icon: 'material-symbols:class-rounded' },
            { name: 'Thời khóa biểu', path: '/schedule', icon: 'material-symbols:calendar-month-rounded' },
            { name: 'Thông báo', path: '/notifications', icon: 'material-symbols:circle-notifications-sharp', badge: 3 },
            { name: 'Học phí', path: '/tuition-payment', icon: 'solar:wallet-money-bold-duotone' },
            { name: 'Trang cá nhân', path: '/profile', icon: 'material-symbols:person-rounded' },
        ],
        teacher: [
            { name: 'Tổng quan', path: '/dashboard', icon: 'material-symbols:dashboard-rounded' },
            { name: 'Quản lý Lớp học', path: '/teacher/classes', icon: 'material-symbols:school-rounded' },
            { name: 'Quản lý Học sinh', path: '/students', icon: 'material-symbols:group-rounded' },
            { name: 'Quản lý Trợ giảng', path: '/assistants', icon: 'material-symbols:handshake-rounded' },
            { name: 'Báo cáo tiến độ', path: '/reports', icon: 'material-symbols:analytics-rounded' },
            { name: 'Quản lý Lịch học', path: '/schedule-management', icon: 'solar:calendar-add-bold-duotone' },
            { name: 'Quản lý Học phí', path: '/tuition', icon: 'solar:wallet-money-bold-duotone' },
            { name: 'Trang cá nhân', path: '/profile', icon: 'material-symbols:person-rounded' },
        ],
        TA: [
            { name: 'Tổng quan', path: '/dashboard', icon: 'material-symbols:dashboard-rounded' },
            { name: 'Nhiệm vụ của tôi', path: '/ta/tasks', icon: 'material-symbols:task-rounded' },
            { name: 'Lớp hỗ trợ', path: '/assisted-classes', icon: 'material-symbols:handshake-rounded' },
            { name: 'Danh sách học sinh', path: '/students', icon: 'material-symbols:group-rounded' },
            { name: 'Báo cáo tiến độ', path: '/reports', icon: 'material-symbols:analytics-rounded' },
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
                                <div className="!relative">
                                    <Icon icon={item.icon} className="text-2xl" />
                                    {item.badge > 0 && (
                                        <span className="!absolute !-top-1 !-right-1 !w-4 !h-4 !bg-red-500 !text-white !text-[9px] !font-black !flex !items-center !justify-center !rounded-full !border-2 !border-[#355872] group-hover:!border-white/10 !transition-all">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="!p-5 border-t border-white/10 flex flex-col gap-4">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 shrink-0">
                            <Icon icon="material-symbols:person-rounded" className="text-2xl text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white leading-none truncate">{user?.fullName || 'Người dùng'}</p>
                            <p className="text-xs text-white/70 mt-1 truncate">
                                {role === 'student' ? 'Học sinh' : role === 'teacher' ? 'Giáo viên' : role === 'TA' ? 'Trợ giảng' : 'Thành viên'}
                            </p>
                        </div>
                    </div>

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
