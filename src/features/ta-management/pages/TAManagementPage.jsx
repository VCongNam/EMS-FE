import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ViewTAListPage from './ViewTAListPage';
import SetTAPermissionsPage from './SetTAPermissionsPage';
import TATaskManagementTab from './TATaskManagementTab';
import { Icon } from '@iconify/react';

const TAManagementPage = () => {
    const { classId } = useParams();
    const [activeTab, setActiveTab] = useState('list'); // 'list' | 'permissions' | 'tasks'

    return (
        <div className="w-full !space-y-6 animate-fade-in !pb-8 !p-6 bg-surface rounded-2xl shadow-sm border border-border mt-2">
            
            {/* Header */}
            <div className="flex items-center !gap-4 !mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner shrink-0">
                    <Icon icon="solar:users-group-rounded-bold-duotone" className="text-3xl" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-text-main font-['Outfit']">Quản lý trợ giảng</h1>
                    <p className="text-sm text-text-muted mt-0.5">Điều chỉnh danh sách, phân quyền cấu hình và giao việc cho trợ giảng</p>
                </div>
            </div>

            {/* Tabs Section */}
            <div className="flex flex-wrap !gap-2 border-b border-border/50">
                <button
                    onClick={() => setActiveTab('list')}
                    className={`!px-6 !py-3 font-semibold text-sm sm:text-base rounded-t-xl transition-colors relative ${activeTab === 'list'
                            ? 'text-primary'
                            : 'text-text-muted hover:text-text-main hover:bg-surface/50'
                        }`}
                >
                    Danh sách & Phân công
                    {activeTab === 'list' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('permissions')}
                    className={`!px-6 !py-3 font-semibold text-sm sm:text-base rounded-t-xl transition-colors relative ${activeTab === 'permissions'
                            ? 'text-primary'
                            : 'text-text-muted hover:text-text-main hover:bg-surface/50'
                        }`}
                >
                    Phân quyền cấu hình
                    {activeTab === 'permissions' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('tasks')}
                    className={`!px-6 !py-3 font-semibold text-sm sm:text-base rounded-t-xl transition-colors relative ${activeTab === 'tasks'
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
                {activeTab === 'list' && <ViewTAListPage classId={classId} />}
                {activeTab === 'permissions' && <SetTAPermissionsPage classId={classId} />}
                {activeTab === 'tasks' && <TATaskManagementTab classId={classId} />}
            </div>
        </div>
    );
};

export default TAManagementPage;
