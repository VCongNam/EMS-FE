import React, { useState } from 'react';
import { Outlet, NavLink, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { mockClasses } from '../../../data/mockClasses';
import ClassStaffModal from './components/ClassStaffModal';

const ClassDetailLayout = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

    const basePath = location.pathname.startsWith('/assisted-classes') 
        ? '/assisted-classes' 
        : '/teacher/classes';

    const classInfo = mockClasses.find(c => c.id === classId) || {
        name: 'Lớp học không tồn tại',
        code: 'N/A',
        status: 'unknown'
    };

    const tabs = [
        { path: 'stream', label: 'Bảng tin', icon: 'material-symbols:stream-rounded' },
        { path: 'materials', label: 'Tài liệu', icon: 'material-symbols:folder-open-rounded' },
        { path: 'classwork', label: 'Bài tập', icon: 'material-symbols:assignment-rounded' },
        { path: 'people', label: 'Thành viên', icon: 'material-symbols:group-rounded' },
        { path: 'grades', label: 'Điểm số', icon: 'material-symbols:grading-rounded' },
        { path: 'schedule', label: 'Lịch học', icon: 'solar:calendar-bold-duotone' },
        { path: 'attendance', label: 'Điểm danh', icon: 'material-symbols:fact-check-rounded' },
    ];

    const activeTab = tabs.find(tab =>
        location.pathname.includes(`/${tab.path}`)
    ) || tabs[0];

    return (
        <div className="w-full mx-auto animate-fade-in">
            {/* Nav Back Breadcrumb */}
            <div className="!mb-4 flex items-center">
                <button
                    onClick={() => navigate(basePath)}
                    className="flex items-center !border gap-2 text-sm font-semibold text-text-muted hover:text-primary transition-colors bg-surface !px-4 !py-2 rounded-xl border border-border shadow-sm shadow-primary/5"
                >
                    <Icon icon="material-symbols:arrow-back-rounded" className="text-lg" />
                    Quay lại danh sách
                </button>
            </div>

            {/* Class Banner Cover */}
            <div className="relative h-48 md:h-64 w-full rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 shadow-xl shadow-primary/10 flex items-end !p-6 md:!p-10 !mb-6">
                <div className="absolute inset-0 rounded-3xl bg-black/20"></div>
                <div
                    className="absolute inset-0 rounded-3xl opacity-10"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '24px 24px'
                    }}
                ></div>
                <div className="relative z-10 w-full flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                    <div className="text-white">
                        <h1 className="text-3xl !text-white md:text-5xl font-bold font-['Outfit'] !mb-2 drop-shadow-md">
                            {classInfo.name}
                        </h1>
                        <p className="text-blue-100 font-mono text-lg drop-shadow">
                            Mã lớp: {classInfo.code}
                        </p>
                    </div>
                    <button 
                        onClick={() => setIsStaffModalOpen(true)}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white !px-4 !py-2 rounded-xl backdrop-blur-sm transition-colors border border-white/20 shadow-sm self-start md:self-auto"
                    >
                        <Icon icon="solar:users-group-two-rounded-bold-duotone" className="text-xl" />
                        <span className="font-semibold text-sm">Ban giảng huấn</span>
                    </button>
                </div>
            </div>

            {/* Tab Navigation — Desktop */}
            <div className="hidden sm:block bg-surface rounded-2xl border border-border shadow-sm !mb-8">
                <nav className="flex items-center">
                    {tabs.map((tab) => (
                        <NavLink
                            key={tab.path}
                            to={`${basePath}/${classId}/${tab.path}`}
                            className={({ isActive }) =>
                                `flex items-center gap-2 !px-6 !py-4 text-sm font-bold border-b-2 transition-all hover:bg-surface-hover whitespace-nowrap ${
                                    isActive
                                        ? 'border-primary text-primary bg-primary/5'
                                        : 'border-transparent text-text-muted hover:text-text-main'
                                }`
                            }
                        >
                            <Icon icon={tab.icon} className="text-xl" />
                            {tab.label}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Tab Navigation — Mobile Dropdown */}
            <div className="sm:hidden relative !mb-6" >
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full bg-surface border border-border rounded-2xl !px-4 !py-3 flex items-center justify-between shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Icon icon={activeTab.icon} className="text-primary text-lg" />
                        </div>
                        <span className="font-bold text-text-main">{activeTab.label}</span>
                    </div>
                    <Icon
                        icon="material-symbols:keyboard-arrow-down-rounded"
                        className={`text-2xl text-text-muted transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {dropdownOpen && (
                    <div className="absolute top-full left-0 right-0 !mt-2 bg-surface border border-border rounded-2xl shadow-xl z-30 overflow-hidden">
                        {tabs.map((tab) => {
                            const isActive = location.pathname.includes(`/${tab.path}`);
                            return (
                                <button
                                    key={tab.path}
                                    onClick={() => {
                                        navigate(`${basePath}/${classId}/${tab.path}`);
                                        setDropdownOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 !px-4 !py-3 text-sm font-semibold transition-colors ${
                                        isActive
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-text-muted hover:bg-surface-hover hover:text-text-main'
                                    }`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-primary/10' : 'bg-background'}`}>
                                        <Icon icon={tab.icon} className="text-lg" />
                                    </div>
                                    {tab.label}
                                   
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Tab Content Area */}
            <div className="mt-4">
                <Outlet />
            </div>

            <ClassStaffModal 
                isOpen={isStaffModalOpen}
                onClose={() => setIsStaffModalOpen(false)}
            />
        </div>
    );
};

export default ClassDetailLayout;