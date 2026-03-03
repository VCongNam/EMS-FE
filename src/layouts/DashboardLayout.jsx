import React from 'react';
import { Outlet } from 'react-router-dom';
import SideMenu from './components/SideMenu';

const DashboardLayout = () => {
    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar */}
            <SideMenu />

            {/* Main Content Area */}
            <div className="flex-1 ml-72 flex flex-col">
                {/* Dashboard Top Header */}
                <header className="h-20 px-8 flex justify-between items-center bg-surface/50 backdrop-blur-md border-b border-border sticky top-0 z-40">
                    <div>
                        <h2 className="text-xl font-bold text-text-main font-['Outfit'] tracking-tight">Trình quản lý EMS</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-text-main leading-none">Admin User</p>
                            <p className="text-xs text-text-muted mt-1">Hệ thống Quản trị</p>
                        </div>
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                            <span className="text-xl">👤</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8 animate-fade-in flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
