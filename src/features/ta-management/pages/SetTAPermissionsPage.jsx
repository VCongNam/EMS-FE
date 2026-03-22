import React, { useState } from 'react';
import { Icon } from '@iconify/react';

const SetTAPermissionsPage = () => {
    const [selectedTA, setSelectedTA] = useState('TA001');

    const tas = [
        { id: 'TA001', name: 'Lê Thảo Nhi' },
        { id: 'TA002', name: 'Nguyễn Quang Vinh' },
    ];

    const [permissions, setPermissions] = useState({
        takeAttendance: true,
        editScores: false,
        viewReports: true,
        manageStudents: false,
        createAssignments: false
    });

    const handleToggle = (key) => {
        setPermissions(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSave = () => {
        alert('Đã cập nhật quyền cho Trợ giảng thành công!');
    };

    const permissionItems = [
        { key: 'takeAttendance', label: 'Điểm danh học sinh', desc: 'Cho phép TA thực hiện điểm danh trong lớp học do mình phụ trách.', icon: 'material-symbols:fact-check-rounded' },
        { key: 'editScores', label: 'Chấm điểm & Nhập điểm', desc: 'Cho phép TA nhập, sửa điểm các bài kiểm tra của học sinh.', icon: 'material-symbols:edit-note-rounded' },
        { key: 'viewReports', label: 'Xem Báo cáo học tập', desc: 'Xem biểu đồ thống kê, báo cáo học tập của lớp học.', icon: 'material-symbols:insert-chart-rounded' },
        { key: 'manageStudents', label: 'Quản lý học sinh vào/ra lớp', desc: 'Thêm, xóa học sinh khỏi danh sách lớp được phân công.', icon: 'material-symbols:group-add-rounded' },
        { key: 'createAssignments', label: 'Tạo Bài tập & Assignment', desc: 'Đăng tải bài tập, quản lý tài liệu, thông báo lớp.', icon: 'material-symbols:assignment-rounded' },
    ];

    return (
        <div className="w-full !mx-auto !space-y-6 animate-fade-in">


            <div className="grid grid-cols-1 lg:grid-cols-4 !gap-6">
                {/* Left side: Select TA */}
                <div className="lg:col-span-1 bg-surface !p-6 rounded-[2rem] border border-border shadow-sm !space-y-4">
                    <h3 className="text-lg font-semibold text-text-main border-b border-border !pb-2 flex items-center !gap-2">
                        <Icon icon="material-symbols:person-search-rounded" className="text-primary" />
                        Chọn Trợ giảng
                    </h3>
                    <div className="!space-y-2">
                        {tas.map(ta => (
                            <button
                                key={ta.id}
                                onClick={() => setSelectedTA(ta.id)}
                                className={`w-full text-left !px-4 !py-3 rounded-xl transition-all font-medium border ${
                                    selectedTA === ta.id 
                                    ? '!bg-primary border-primary text-white shadow-md' 
                                    : '!bg-background border-border text-text-main hover:border-primary/50'
                                }`}
                            >
                                <div className="text-sm">{ta.name}</div>
                                <div className={`text-xs !mt-0.5 ${selectedTA === ta.id ? 'text-white/80' : 'text-text-muted'}`}>{ta.id}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right side: Permissions List */}
                <div className="lg:col-span-3 bg-surface !p-6 lg:!p-8 rounded-[2rem] border border-border shadow-sm">
                    <div className="flex items-center justify-between border-b border-border !pb-4 !mb-6">
                        <h3 className="text-lg font-semibold text-text-main flex items-center !gap-2">
                            <Icon icon="material-symbols:admin-panel-settings-rounded" className="text-primary" />
                            Quyền hạn hiện tại
                        </h3>
                        <span className="!px-3 !py-1 !bg-primary/10 text-primary rounded-lg text-sm font-bold">
                            {tas.find(t => t.id === selectedTA)?.name}
                        </span>
                    </div>

                    <div className="!space-y-4">
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
                        <button className="!px-6 !py-2.5 rounded-xl border border-border text-text-main font-semibold hover:bg-background transition-colors">
                            Khôi phục mặc định
                        </button>
                        <button 
                            onClick={handleSave}
                            className="!px-6 !py-2.5 rounded-xl !bg-primary text-white font-semibold flex items-center !gap-2 hover:bg-primary/90 shadow-lg hover:shadow-primary/30 transition-all"
                        >
                            <Icon icon="material-symbols:save-rounded" className="text-lg" />
                            Lưu cấu hình
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SetTAPermissionsPage;
