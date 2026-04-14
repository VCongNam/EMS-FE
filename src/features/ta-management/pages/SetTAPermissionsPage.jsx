import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import useAuthStore from '../../../store/authStore';
import { taService } from '../api/taService';

const PERMISSION_MAP = {
    takeAttendance: 'Attendance',
    editScores: 'Grade',
    viewReports: 'Report',
    createAssignments: 'Assignment'
};

const SetTAPermissionsPage = ({ classId }) => {
    const { user } = useAuthStore();
    const [tas, setTas] = useState([]);
    const [selectedTA, setSelectedTA] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [permissions, setPermissions] = useState({
        takeAttendance: false,
        editScores: false,
        viewReports: false,
        createAssignments: false
    });

    const fetchAssistants = async () => {
        if (!classId || !user?.token) return;
        try {
            setIsLoading(true);
            const res = await taService.getTAListByClass(classId, user.token);
            if (res.ok) {
                const dataRaw = await res.json();
                const data = Array.isArray(dataRaw) ? dataRaw : (dataRaw?.data && Array.isArray(dataRaw.data) ? dataRaw.data : []);
                setTas(data);
                if (data.length > 0 && !selectedTA) {
                    setSelectedTA(data[0].taid);
                    parsePermissions(data[0].permission || '');
                } else if (selectedTA) {
                    const current = data.find(t => t.taid === selectedTA);
                    if (current) parsePermissions(current.permission || '');
                }
            } else {
                toast.error('Không thể tải danh sách trợ giảng');
            }
        } catch (error) {
            console.error(error);
            toast.error('Lỗi kết nối máy chủ');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAssistants();
    }, [classId, user?.token]);

    const parsePermissions = (permString) => {
        const str = permString.toLowerCase();
        setPermissions({
            takeAttendance: str.includes('attendance'),
            editScores: str.includes('grade'),
            viewReports: str.includes('report'),
            createAssignments: str.includes('assignment')
        });
    };

    const handleSelectTA = (taId) => {
        setSelectedTA(taId);
        const ta = tas.find(t => t.taid === taId);
        if (ta) parsePermissions(ta.permission || '');
    };

    const handleToggle = (key) => {
        setPermissions(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSave = async () => {
        if (!selectedTA) return;
        
        const activePerms = [];
        if (permissions.takeAttendance) activePerms.push('Attendance');
        if (permissions.editScores) activePerms.push('Grade');
        if (permissions.viewReports) activePerms.push('Report');
        if (permissions.createAssignments) activePerms.push('Assignment');
        
        const payload = {
            permission: activePerms.join(', ') || 'None'
        };

        try {
            setIsSaving(true);
            const res = await taService.setTAPermission(classId, selectedTA, payload, user?.token);
            if (res.ok) {
                toast.success('Đã cập nhật quyền cho Trợ giảng thành công!');
                const result = await res.json();
                // Update local state to reflect new permission
                setTas(tas.map(ta => ta.taid === selectedTA ? { ...ta, permission: payload.permission } : ta));
            } else {
                const error = await res.json();
                toast.error(error.message || 'Có lỗi xảy ra khi cập nhật quyền');
            }
        } catch (error) {
            console.error(error);
            toast.error('Lỗi kết nối đến máy chủ');
        } finally {
            setIsSaving(false);
        }
    };

    const permissionItems = [
        { key: 'takeAttendance', label: 'Điểm danh học sinh', desc: 'Cho phép TA thực hiện điểm danh trong lớp học do mình phụ trách.', icon: 'material-symbols:fact-check-rounded' },
        { key: 'editScores', label: 'Chấm điểm & Nhập điểm', desc: 'Cho phép TA nhập, sửa điểm các bài kiểm tra của học sinh.', icon: 'material-symbols:edit-note-rounded' },
        { key: 'viewReports', label: 'Xem Báo cáo học tập', desc: 'Xem biểu đồ thống kê, báo cáo học tập của lớp học.', icon: 'material-symbols:insert-chart-rounded' },
        { key: 'createAssignments', label: 'Tạo Bài tập & Assignment', desc: 'Đăng tải bài tập, quản lý tài liệu, thông báo lớp.', icon: 'material-symbols:assignment-rounded' },
    ];

    if (isLoading && tas.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-primary">
                <Icon icon="solar:spinner-linear" className="animate-spin text-4xl mb-4" />
                <p className="font-bold text-lg">Đang tải cấu hình...</p>
            </div>
        );
    }

    if (tas.length === 0) {
        return (
            <div className="bg-surface rounded-3xl border border-border !p-12 text-center animate-fade-in">
                <div className="flex flex-col items-center justify-center opacity-70">
                    <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center !mb-4 border border-border">
                        <Icon icon="solar:ghost-smile-bold-duotone" className="text-4xl text-text-muted" />
                    </div>
                    <h3 className="text-lg font-bold text-text-main !mb-1">Lớp chưa có trợ giảng nào</h3>
                    <p className="text-text-muted font-medium">Bổ sung trợ giảng vào lớp để cài đặt quyền.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full !mx-auto !space-y-6 animate-fade-in">


            <div className="grid grid-cols-1 lg:grid-cols-4 !gap-6">
                {/* Left side: Select TA */}
                <div className="lg:col-span-1 bg-surface !p-6 rounded-[2rem] border border-border shadow-sm !space-y-4">
                    <h3 className="text-lg font-semibold text-text-main border-b border-border !pb-2 flex items-center !gap-2">
                        <Icon icon="material-symbols:person-search-rounded" className="text-primary" />
                        Chọn Trợ giảng
                    </h3>
                    <div className="!space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
                        {tas.map(ta => (
                            <button
                                key={ta.taid}
                                onClick={() => handleSelectTA(ta.taid)}
                                className={`w-full text-left !px-4 !py-3 rounded-xl transition-all font-medium border ${
                                    selectedTA === ta.taid 
                                    ? '!bg-primary border-primary text-white shadow-md' 
                                    : '!bg-background border-border text-text-main hover:border-primary/50'
                                }`}
                            >
                                <div className="text-sm font-semibold truncate">{ta.fullName}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right side: Permissions List */}
                <div className="lg:col-span-3 bg-surface !p-6 lg:!p-8 rounded-[2rem] border border-border shadow-sm flex flex-col h-full">
                    <div className="flex items-center justify-between border-b border-border !pb-4 !mb-6">
                        <h3 className="text-lg font-semibold text-text-main flex items-center !gap-2">
                            <Icon icon="material-symbols:admin-panel-settings-rounded" className="text-primary" />
                            Quyền hạn cấu hình
                        </h3>
                        <span className="!px-3 !py-1 !bg-primary/10 text-primary rounded-lg text-sm font-bold">
                            {tas.find(t => t.taid === selectedTA)?.fullName}
                        </span>
                    </div>

                    <div className="!space-y-4 flex-1">
                        {permissionItems.map((item) => (
                            <div key={item.key} className="flex items-start sm:items-center justify-between !gap-4 !p-4 rounded-xl border border-border bg-background hover:border-primary/30 transition-colors">
                                <div className="flex items-start !gap-4">
                                    <div className={`!mt-0.5 w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${permissions[item.key] ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-surface text-text-muted'}`}>
                                        <Icon icon={item.icon} className="text-xl" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-text-main">{item.label}</h4>
                                        <p className="text-sm text-text-muted !mt-0.5 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                                
                                {/* Toggle Switch */}
                                <button 
                                    onClick={() => handleToggle(item.key)}
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                                        permissions[item.key] ? '!bg-primary' : '!bg-gray-200 dark:bg-gray-700'
                                    }`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                            permissions[item.key] ? 'translate-x-5' : 'translate-x-0'
                                        }`}
                                    />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="!mt-8 flex justify-end !gap-3 !pt-6 border-t border-border">
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className="!px-6 !py-2.5 rounded-xl !bg-primary text-white font-semibold flex items-center !gap-2 hover:bg-primary/90 shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? (
                                <Icon icon="solar:spinner-linear" className="animate-spin text-lg" />
                            ) : (
                                <Icon icon="material-symbols:save-rounded" className="text-lg" />
                            )}
                            Lưu cấu hình
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SetTAPermissionsPage;
