import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ViewTAListPage from './ViewTAListPage';
import SetTAPermissionsPage from './SetTAPermissionsPage';
import TATaskManagementTab from './TATaskManagementTab';

const TAManagementPage = () => {
    const { classId } = useParams();
    const [activeTab, setActiveTab] = useState('list'); // 'list' | 'permissions' | 'tasks'

    return (
        <div className="w-full !space-y-6 animate-fade-in !pb-8 !p-6 bg-surface rounded-2xl shadow-sm border border-border mt-2">
            
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
