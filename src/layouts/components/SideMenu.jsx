import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useNotifications } from '../../contexts/NotificationContext';

import useAuthStore from '../../store/authStore';
import { usePWA } from '../../contexts/PWAContext';

const SideMenu = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
    const location = useLocation();
    const { user, logout } = useAuthStore();
    const role = user?.role || 'student';
    const { isInstallable, installApp } = usePWA();

    const { unreadCount } = useNotifications();
    const menuConfigs = {
        student: [
            { name: 'Bảng điều khiển', path: '/dashboard', icon: 'material-symbols:dashboard-rounded' },
            { name: 'Lớp học của tôi', path: '/student/classes', icon: 'material-symbols:school-rounded' },
            { name: 'Thời khóa biểu', path: '/schedule', icon: 'material-symbols:calendar-month-rounded' },
            { name: 'Thông báo', path: '/notifications', icon: 'material-symbols:circle-notifications-sharp', badge: unreadCount },
            { name: 'Học phí', path: '/tuition-payment', icon: 'solar:wallet-money-bold-duotone' },
            { name: 'Trang cá nhân', path: '/profile', icon: 'material-symbols:person-rounded' },
        ],
        teacher: [
            { name: 'Tổng quan', path: '/dashboard', icon: 'material-symbols:dashboard-rounded' },
            { name: 'Quản lý Lớp học', path: '/teacher/classes', icon: 'material-symbols:school-rounded' },
            { name: 'Quản lý Trợ giảng', path: '/assistants', icon: 'material-symbols:handshake-rounded' },
            { name: 'Quản lý Lịch học', path: '/schedule-management', icon: 'solar:calendar-add-bold-duotone' },
            { name: 'Quản lý Học phí', path: '/tuition', icon: 'solar:wallet-money-bold-duotone' },
            { name: 'Thông báo', path: '/notifications', icon: 'material-symbols:circle-notifications-sharp', badge: unreadCount },
            { name: 'Hỗ trợ & Góp ý', path: '/teacher/feedback', icon: 'material-symbols:feedback-rounded' },
            { name: 'Trang cá nhân', path: '/profile', icon: 'material-symbols:person-rounded' },
        ],
        TA: [
            { name: 'Tổng quan', path: '/dashboard', icon: 'material-symbols:dashboard-rounded' },
            { name: 'Nhiệm vụ của tôi', path: '/ta/tasks', icon: 'material-symbols:task-rounded' },
            { name: 'Lớp hỗ trợ', path: '/assisted-classes', icon: 'material-symbols:handshake-rounded' },
            { name: 'Thông báo', path: '/notifications', icon: 'material-symbols:circle-notifications-sharp', badge: unreadCount },
            { name: 'Trang cá nhân', path: '/profile', icon: 'material-symbols:person-rounded' },
        ],
        admin: [
            { name: 'Tổng quan Hệ thống', path: '/admin/dashboard', icon: 'material-symbols:dashboard-rounded' },
            { name: 'Quản lý Tài khoản', path: '/admin/accounts', icon: 'material-symbols:manage-accounts-rounded' },
            { name: 'Quản lý Phản hồi', path: '/admin/feedback', icon: 'material-symbols:feedback-rounded' },
            { name: 'Thông báo', path: '/notifications', icon: 'material-symbols:circle-notifications-sharp', badge: unreadCount }
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
                className={`bg-[#355872] text-white flex flex-col fixed inset-y-0 left-0 z-[70] shadow-2xl transition-all duration-300 transform 
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    ${isCollapsed ? 'lg:w-20' : 'lg:w-72 w-72'}`}
            >
                <div className={`!p-5 border-b border-white/10 flex items-center justify-between gap-3 ${isCollapsed ? 'lg:justify-center' : ''}`}>
                    <div className={`flex items-center gap-3 ${isCollapsed ? 'lg:hidden' : ''}`}>
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shrink-0">
                            <Icon icon="material-symbols:school" className="text-2xl text-white" />
                        </div>
                        <span className="text-2xl font-bold font-['Outfit'] tracking-tight truncate">
                            {role === 'student' ? 'EMS' : role === 'admin' ? 'EMS Admin' : 'EMS'}
                        </span>
                    </div>
                    
                    {/* Desktop Collapse Toggle */}
                    <button
                        onClick={onToggleCollapse}
                        className="hidden lg:flex w-8 h-8 items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/70 hover:text-white"
                        title={isCollapsed ? "Mở rộng" : "Thu gọn"}
                    >
                        <Icon 
                            icon={isCollapsed ? "material-symbols:keyboard-double-arrow-right-rounded" : "material-symbols:keyboard-double-arrow-left-rounded"} 
                            className="text-xl" 
                        />
                    </button>

                    <button
                        onClick={onClose}
                        className="lg:hidden text-white/50 hover:text-white transition-colors"
                    >
                        <Icon icon="material-symbols:close-rounded" className="text-2xl" />
                    </button>
                </div>

                <nav className={`flex-1 !p-3 space-y-2 overflow-y-auto custom-scrollbar ${isCollapsed ? 'lg:!p-3' : '!p-5'}`}>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(`${item.path}/`));
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                title={isCollapsed ? item.name : ""}
                                onClick={() => {
                                    if (window.innerWidth < 1024) onClose();
                                }}
                                className={`flex items-center rounded-2xl transition-all duration-300 font-medium ${isCollapsed ? 'lg:justify-center !p-3' : '!p-4 gap-3'} ${isActive
                                    ? 'bg-white !text-[#355872] shadow-lg'
                                    : 'hover:bg-white/10 text-white/70 hover:text-white'
                                    }`}
                            >
                                <div className="!relative flex-shrink-0">
                                    <Icon icon={item.icon} className="text-2xl" />
                                    {item.badge > 0 && (
                                        <span className={`!absolute !-top-1 !-right-1 !w-4 !h-4 !bg-red-500 !text-white !text-[9px] !font-black !flex !items-center !justify-center !rounded-full !border-2 !border-[#355872] group-hover:!border-white/10 !transition-all`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                                {!isCollapsed && <span className="truncate">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className={`!p-4 border-t border-white/10 flex flex-col gap-4 ${isCollapsed ? 'lg:items-center' : ''}`}>
                    <div className={`flex items-center gap-3 px-2 ${isCollapsed ? 'lg:px-0 lg:justify-center' : ''}`}>
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 shrink-0">
                            <Icon icon="material-symbols:person-rounded" className="text-2xl text-white" />
                        </div>
                        {!isCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white leading-none truncate">{user?.fullName || 'Người dùng'}</p>
                                <p className="text-xs text-white/70 mt-1 truncate">
                                    {role === 'student' ? 'Học sinh' : role === 'teacher' ? 'Giáo viên' : role === 'TA' ? 'Trợ giảng' : role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                                </p>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={installApp}
                        title={isCollapsed ? "Tải ứng dụng" : ""}
                        className={`w-full flex items-center rounded-2xl !bg-white/10 hover:bg-white/20 text-white transition-all font-medium cursor-pointer border border-white/20 shadow-lg ${isCollapsed ? 'lg:p-3 lg:justify-center' : 'p-4 gap-3'}`}
                    >
                        <Icon icon="material-symbols:download-for-offline-rounded" className="text-2xl flex-shrink-0" />
                        {!isCollapsed && <span className="truncate text-sm">Tải ứng dụng</span>}
                    </button>

                    <button
                        onClick={() => {
                            logout();
                            window.location.href = '/login';
                        }}
                        title={isCollapsed ? "Đăng xuất" : ""}
                        className={`w-full flex items-center rounded-2xl hover:bg-red-500/20 text-red-100 transition-all font-medium cursor-pointer ${isCollapsed ? 'lg:p-3 lg:justify-center' : 'p-4 gap-3'}`}
                    >
                        <Icon icon="material-symbols:logout-rounded" className="text-2xl flex-shrink-0" />
                        {!isCollapsed && <span className="truncate text-sm">Đăng xuất</span>}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default SideMenu;
