import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import ViewTAListPage from './ViewTAListPage';
import SetTAPermissionsPage from './SetTAPermissionsPage';
import TATaskManagementTab from './TATaskManagementTab';

const TAManagementPage = () => {
    const [activeTab, setActiveTab] = useState('list'); // 'list' | 'permissions'

    return (
        <div className="w-full !mx-auto !space-y-6 animate-fade-in !pb-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center !gap-6 bg-surface !p-6 rounded-[2rem] border border-border shadow-sm">
                <div className="flex items-center !gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
                        <Icon icon="material-symbols:badge-rounded" className="text-3xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-text-main">Quản lý Trợ giảng</h1>
                        <p className="text-text-muted !mt-1 text-sm sm:text-base">Quản lý danh sách, phân công và cấp quyền cho trợ giảng</p>
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <div className="flex !gap-2 border-b border-border/50">
                <button
                    onClick={() => setActiveTab('list')}
                    className={`!px-6 !py-3 font-semibold text-base rounded-t-xl transition-colors relative ${activeTab === 'list'
                            ? 'text-primary'
                            : 'text-text-muted hover:text-text-main hover:bg-surface/50'
                        }`}
                >
                    Danh sách & Xếp lớp
                    {activeTab === 'list' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('permissions')}
                    className={`!px-6 !py-3 font-semibold text-base rounded-t-xl transition-colors relative ${activeTab === 'permissions'
                            ? 'text-primary'
                            : 'text-text-muted hover:text-text-main hover:bg-surface/50'
                        }`}
                >
                    Phân quyền hệ thống
                    {activeTab === 'permissions' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('tasks')}
                    className={`!px-6 !py-3 font-semibold text-base rounded-t-xl transition-colors relative ${activeTab === 'tasks'
                            ? 'text-primary'
                            : 'text-text-muted hover:text-text-main hover:bg-surface/50'
                        }`}
                >
                    Giao việc & Theo dõi
                    {activeTab === 'tasks' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>
                    )}
                </button>
            </div>

            {/* Tab Content */}
            <div className="!mt-4">
                {activeTab === 'list' && <ViewTAListPage />}
                {activeTab === 'permissions' && <SetTAPermissionsPage />}
                {activeTab === 'tasks' && <TATaskManagementTab />}
            </div>
        </div>
    );
};

export default TAManagementPage;
