import React from 'react';
import { Outlet } from 'react-router-dom';
import { Icon } from '@iconify/react';
import SideMenu from './components/SideMenu';
import useAuthStore from '../store/authStore';
import DevRoleSwitcher from '../components/dev/DevRoleSwitcher';

const DashboardLayout = () => {
    const { user } = useAuthStore();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const roleLabels = {
        student: 'Học sinh',
        teacher: 'Giáo viên',
        assistant: 'Trợ giảng'
    };

    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar */}
            <SideMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Dev Only Switcher*/}
            <DevRoleSwitcher /> 

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'lg:ml-72' : 'lg:ml-72'}`}>
                {/* Dashboard Top Header */}
                <header className="h-header px-4 sm:px-8 flex justify-between items-center bg-surface/50 backdrop-blur-md border-b border-border sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-surface border border-border text-text-main shadow-sm"
                        >
                            <Icon icon="material-symbols:menu-rounded" className="text-2xl" />
                        </button>
                        <h2 className="text-lg sm:text-xl font-bold text-text-main font-['Outfit'] tracking-tight truncate">
                            Trình quản lý EMS
                        </h2>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-text-main leading-none">{user?.fullName || 'Người dùng'}</p>
                            <p className="text-xs text-text-muted mt-1">{roleLabels[user?.role] || 'Thành viên'}</p>
                        </div>
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                            <Icon icon="material-symbols:person-rounded" className="text-2xl text-primary" />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 sm:p-8 animate-fade-in flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
