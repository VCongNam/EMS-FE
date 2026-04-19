import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import ClassStaffModal from './components/ClassStaffModal';
import { classService } from '../../../api/classService';
import studentClassService from '../../../api/studentClassService';
import useAuthStore from '../../../../../store/authStore';
import { TAPermissionContext } from '../../../../dashboard/context/TAPermissionContext';
import { getApiUrl } from '../../../../../config/api';
import taService from '../../../../ta-management/api/taService';

const ClassDetailLayout = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuthStore();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);

    const isStudentPortal = location.pathname.startsWith('/student/classes');
    const isAssistantPortal = location.pathname.startsWith('/assisted-classes');
    const isTA = user?.role?.toUpperCase() === 'TA';

    const basePath = isStudentPortal
        ? '/student/classes'
        : isAssistantPortal
            ? '/assisted-classes'
            : '/teacher/classes';

    // ── TA Permissions ──────────────────────────────────────────────────────────
    const [taPermissions, setTaPermissions] = useState([]);
    const [taPermLoading, setTaPermLoading] = useState(isTA);

    useEffect(() => {
        if (!isTA || !user?.token || !classId) {
            setTaPermLoading(false);
            return;
        }
        // taId: the TA's own user/account ID
        const taId = user?.taId || user?.userId || user?.id;
        if (!taId) {
            setTaPermLoading(false);
            return;
        }

        const fetchTAPermissions = async () => {
            try {
                setTaPermLoading(true);

                // Step 1: Get the classTAId (the TA-class assignment row ID)
                // by fetching the list of classes assigned to this TA
                let classTAId = null;
                const classesRes = await taService.getAssignedClasses(taId, user.token);
                if (classesRes.ok) {
                    const json = await classesRes.json();
                    const rawData = json.data || (Array.isArray(json) ? json : []);
                    // Find the entry that matches the current class
                    // DEBUG: log toàn bộ response để tìm tên field đúng
                    console.log('[TA DEBUG] rawData[0] fields:', rawData[0] ? Object.keys(rawData[0]) : 'empty');
                    console.log('[TA DEBUG] full rawData:', JSON.stringify(rawData, null, 2));
                    const match = rawData.find(
                        item => item.classID === classId || item.classId === classId
                    );
                    console.log('[TA DEBUG] match for classId', classId, ':', match);
                    // Use the confirmed field name from backend
                    classTAId = match?.classTaId ?? null;
                    console.log('[TA Permissions] classTaId:', classTAId);
                }

                if (!classTAId) {
                    console.warn('[TA Permissions] Could not resolve classTAId for class:', classId);
                    setTaPermissions([]);
                    return;
                }

                // Step 2: Fetch permissions using classTAId
                const permRes = await fetch(getApiUrl(`/api/TeachingAssistants/${classTAId}/permission`), {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (permRes.ok) {
                    const text = await permRes.text();
                    // API returns: "Attendance, Grade, Report, Assignment"
                    const clean = text.replace(/^"|"$/g, '').trim();
                    const perms = clean.split(',').map(p => p.trim()).filter(Boolean);
                    setTaPermissions(perms);
                    console.log('[TA Permissions]', perms);
                } else {
                    console.warn('[TA Permissions] permission API error:', permRes.status);
                    setTaPermissions([]);
                }
            } catch (e) {
                console.error('[TA Permissions] fetch failed:', e);
                setTaPermissions([]);
            } finally {
                setTaPermLoading(false);
            }
        };

        fetchTAPermissions();
    }, [isTA, user?.token, user?.taId, user?.userId, user?.id, classId]);

    /** True if teacher, or TA with the specified permission key */
    const hasPermission = (key) => {
        if (!isTA) return true;
        return taPermissions.includes(key);
    };

    // ── Class Info ───────────────────────────────────────────────────────────────
    const [classInfo, setClassInfo] = useState({
        name: 'Đang tải...',
        code: '',
        teacherName: '',
        status: 'ongoing'
    });

    useEffect(() => {
        const fetchClassDetail = async () => {
            const token = user?.token;
            if (!token || !classId) return;

            try {
                let res;
                if (isStudentPortal) {
                    res = await studentClassService.getClassDetail(classId, token);
                } else {
                    res = await classService.getClassById(classId, token);
                }

                if (res.ok) {
                    const result = await res.json();
                    const data = result.data || result;
                    setClassInfo({
                        name: data.className || data.name || 'Chưa đặt tên lớp',
                        code: data.room || data.code || 'N/A',
                        teacherName: data.teacherName || '',
                        status: (data.status || data.enrollmentStatus || 'ongoing').toLowerCase()
                    });
                } else {
                    setClassInfo({ name: 'Không tìm thấy lớp học', code: '404', status: 'error' });
                }
            } catch (err) {
                console.error("Lỗi lấy thông tin lớp:", err);
                setClassInfo({ name: 'Lỗi tải dữ liệu', code: 'Error', status: 'error' });
            }
        };

        fetchClassDetail();
    }, [classId, isStudentPortal, user?.token]);

    // ── Tabs ─────────────────────────────────────────────────────────────────────
    // tab shape: { path, label, icon, disabled? }
    const tabs = [
        { path: 'stream',    label: 'Bảng tin',  icon: 'material-symbols:stream-rounded' },
        { path: 'materials', label: 'Tài liệu',  icon: 'material-symbols:folder-open-rounded' },
        { path: 'classwork', label: 'Bài tập',   icon: 'material-symbols:assignment-rounded' },
        { path: 'people',    label: 'Thành viên',icon: 'material-symbols:group-rounded' },
        { path: 'grades',    label: 'Điểm số',   icon: 'material-symbols:grading-rounded' },
        { path: 'schedule',  label: 'Lịch học',  icon: 'solar:calendar-bold-duotone' },
    ];

    if (!isStudentPortal) {
        tabs.push({ path: 'attendance', label: 'Điểm danh', icon: 'material-symbols:fact-check-rounded' });
    }

    // Reports tab: visible for teacher always; for TA always visible but disabled if no Report perm
    if (!isStudentPortal) {
        tabs.push({
            path: 'reports',
            label: 'Tiến độ học tập',
            icon: 'material-symbols:analytics-rounded',
            disabled: isAssistantPortal && !hasPermission('Report'),
        });
    }

    if (!isStudentPortal && !isAssistantPortal) {
        tabs.push({ path: 'assistants', label: 'Trợ giảng', icon: 'material-symbols:support-agent-rounded' });
    }

    if (isStudentPortal) {
        tabs.push({ path: 'tuition', label: 'Học phí', icon: 'material-symbols:payments-outline-rounded' });
    }

    const activeTab = tabs.find(tab => location.pathname.includes(`/${tab.path}`)) || tabs[0];

    const permCtxValue = {
        permissions: taPermissions,
        hasPermission,
        isTA,
        isLoading: taPermLoading,
    };

    // ── Tab render helpers ───────────────────────────────────────────────────────
    const renderDesktopTab = (tab) => {
        if (tab.disabled) {
            return (
                <div
                    key={tab.path}
                    title="Bạn không có quyền truy cập mục này"
                    className="flex items-center gap-2 !px-6 !py-4 text-sm font-bold border-b-2 border-transparent text-text-muted/40 cursor-not-allowed select-none whitespace-nowrap"
                >
                    <Icon icon={tab.icon} className="text-xl" />
                    {tab.label}
                    <Icon icon="material-symbols:lock-rounded" className="text-sm ml-1 opacity-60" />
                </div>
            );
        }
        return (
            <NavLink
                key={tab.path}
                to={`${basePath}/${classId}/${tab.path}`}
                className={({ isActive }) =>
                    `flex items-center gap-2 !px-6 !py-4 text-sm font-bold border-b-2 transition-all hover:bg-surface-hover whitespace-nowrap ${isActive
                        ? 'border-primary text-primary bg-primary/5'
                        : 'border-transparent text-text-muted hover:text-text-main'
                    }`
                }
            >
                <Icon icon={tab.icon} className="text-xl" />
                {tab.label}
            </NavLink>
        );
    };

    const renderMobileTab = (tab) => {
        const isActive = location.pathname.includes(`/${tab.path}`);
        if (tab.disabled) {
            return (
                <div
                    key={tab.path}
                    className="flex items-center gap-3 !px-4 !py-3 text-sm font-semibold text-text-muted/40 cursor-not-allowed select-none"
                >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-background opacity-50">
                        <Icon icon={tab.icon} className="text-lg" />
                    </div>
                    {tab.label}
                    <Icon icon="material-symbols:lock-rounded" className="text-sm ml-auto opacity-50" />
                </div>
            );
        }
        return (
            <button
                key={tab.path}
                onClick={() => {
                    navigate(`${basePath}/${classId}/${tab.path}`);
                    setDropdownOpen(false);
                }}
                className={`w-full flex items-center gap-3 !px-4 !py-3 text-sm font-semibold transition-colors ${isActive
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
    };

    return (
        <TAPermissionContext.Provider value={permCtxValue}>
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
                            <p className="text-blue-100 font-medium text-lg drop-shadow flex items-center gap-2">
                                {isStudentPortal ? (
                                    <>
                                        <Icon icon="solar:user-bold" className="text-blue-200" />
                                        Giảng viên: {classInfo.teacherName || 'Đang cập nhật...'}
                                    </>
                                ) : (
                                    <>Mã lớp: {classInfo.code}</>
                                )}
                            </p>
                        </div>
                        {/* TA permission loading indicator */}
                        {isTA && taPermLoading && (
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm !px-3 !py-2 rounded-xl text-white text-xs font-semibold">
                                <Icon icon="solar:spinner-linear" className="animate-spin" />
                                Đang tải quyền hạn...
                            </div>
                        )}
                    </div>
                </div>

                {/* Tab Navigation — Desktop */}
                <div className="hidden sm:block bg-surface rounded-2xl border border-border shadow-sm !mb-8">
                    <nav className="flex items-center flex-wrap">
                        {tabs.map(renderDesktopTab)}
                    </nav>
                </div>

                {/* Tab Navigation — Mobile Dropdown */}
                <div className="sm:hidden relative !mb-6">
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
                            {tabs.map(renderMobileTab)}
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
        </TAPermissionContext.Provider>
    );
};

export default ClassDetailLayout;