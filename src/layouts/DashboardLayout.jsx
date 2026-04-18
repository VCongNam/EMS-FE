import React from 'react';
import { Outlet } from 'react-router-dom';
import { Icon } from '@iconify/react';
import SideMenu from './components/SideMenu';
import PushPermissionModal from '../features/notifications/components/PushPermissionModal';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

    return (
        <div className="flex min-h-screen bg-background">
            <PushPermissionModal />
            
            {/* Sidebar */}
            <SideMenu 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />

        

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'lg:!pl-20' : 'lg:!pl-72'}`}>
                {/* Mobile Dashboard Header (Hidden on Desktop) */}
                <header className="lg:hidden h-header px-4 sm:px-8 flex items-center bg-surface/50 backdrop-blur-md border-b border-border sticky top-0 z-40">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface border border-border text-text-main shadow-sm mr-4"
                    >
                        <Icon icon="material-symbols:menu-rounded" className="text-2xl" />
                    </button>
                    <h2 className="text-lg !pl-2 sm:text-xl font-bold text-text-main font-['Outfit'] tracking-tight truncate">
                        Trình quản lý EMS
                    </h2>
                </header>

                {/* Page Content */}
                <main className="!p-4 sm:p-8 animate-fade-in flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
