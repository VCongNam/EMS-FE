import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

const MainLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 pt-[var(--header-height)]">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
