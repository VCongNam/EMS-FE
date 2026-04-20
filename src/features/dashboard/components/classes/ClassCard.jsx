import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

const getStatusConfig = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
        case 'ongoing':
        case 'active':
            return { label: 'Đang diễn ra', color: 'text-green-600', bg: 'bg-green-100', dot: 'bg-green-500' };
        case 'scheduled':
        case 'upcoming':
            return { label: 'Đã lên lịch', color: 'text-blue-600', bg: 'bg-blue-100', dot: 'bg-blue-500' };
        case 'completed':
            return { label: 'Đã kết thúc', color: 'text-gray-600', bg: 'bg-gray-100', dot: 'bg-gray-500' };
        case 'archived':
            return { label: 'Lưu trữ', color: 'text-orange-600', bg: 'bg-orange-50', dot: 'bg-orange-400' };
        default:
            return { label: 'Không xác định', color: 'text-gray-600', bg: 'bg-gray-100', dot: 'bg-gray-500' };
    }
};

const ClassCard = ({ 
    classData, 
    onEdit, 
    onArchive, 
    onUnarchive, 
    onViewDetails, 
    basePath = '/teacher/classes',
    showProgress = true,
    showStudentCount = true,
    salary = null,
    permission = null
}) => {
    const navigate = useNavigate();
    const statusConfig = getStatusConfig(classData.status);
    const progressPercent = classData.progress?.totalSessions > 0 
        ? Math.round((classData.progress.currentSession / classData.progress.totalSessions) * 100) 
        : 0;
    
    const [showOptions, setShowOptions] = useState(false);
    const optionsRef = useRef(null);
    const hasOptions = Boolean(onEdit || onArchive || onUnarchive || onViewDetails);

    // Xử lý click ra ngoài để đóng menu
    useEffect(() => {
        function handleClickOutside(event) {
            if (optionsRef.current && !optionsRef.current.contains(event.target)) {
                setShowOptions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCardClick = (e) => {
        // Không navigate nếu click vào dropdown options
        if (optionsRef.current && optionsRef.current.contains(e.target)) return;
        
        // Chuyển hướng tới tab Bảng tin của chi tiết lớp
        navigate(`${basePath}/${classData.id}/stream`);
    };

    const getPermissionLabel = (permString) => {
        if (!permString) return '';
        
        const mapping = {
            'attendance': 'Điểm danh',
            'grades': 'Điểm số',
            'posts': 'Bài đăng',
            'materials': 'Tài liệu',
            'sessions': 'Buổi học',
            'students': 'Học viên',
            'tasks': 'Nhiệm vụ',
            'feedback': 'Nhận xét',
            'reports': 'Báo cáo'
        };

        return permString.split(',')
            .map(p => p.trim().toLowerCase())
            .map(p => mapping[p] || p)
            .join(', ');
    };

    return (
        <div 
            onClick={handleCardClick}
            className="bg-surface rounded-2xl border border-border !p-5 shadow-sm hover:shadow-lg transition-all duration-300 group relative overflow-hidden flex flex-col h-full cursor-pointer"
        >
            {/* Status Badge & Options */}
            <div className="flex justify-between items-start !mb-4">
                <div className={`!px-3 !py-1 rounded-full flex items-center gap-1.5 ${statusConfig.bg}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}></div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${statusConfig.color}`}>
                        {statusConfig.label}
                    </span>
                </div>
                {hasOptions && (
                    <div className="relative" ref={optionsRef}>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowOptions(!showOptions);
                            }}
                            className="text-text-muted hover:text-primary transition-colors !p-1 rounded-full hover:bg-surface/50"
                        >
                            <Icon icon="material-symbols:more-vert" className="text-xl" />
                        </button>
                        
                        {/* Options Dropdown */}
                        {showOptions && (
                            <div className="absolute right-0 top-full !mt-1 w-36 bg-surface border border-border rounded-xl shadow-xl z-20 overflow-hidden !py-1 animate-fade-in-up">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowOptions(false);
                                        if(onViewDetails) onViewDetails();
                                    }}
                                    className="w-full text-left !px-4 !py-2 text-sm text-text-main hover:bg-primary/5 hover:text-primary transition-colors flex items-center gap-2"
                                >
                                    <Icon icon="material-symbols:visibility-rounded" /> Xem chi tiết
                                </button>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowOptions(false);
                                        if(onEdit) onEdit();
                                    }}
                                    className="w-full text-left !px-4 !py-2 text-sm text-text-main hover:bg-primary/5 hover:text-primary transition-colors flex items-center gap-2"
                                >
                                    <Icon icon="material-symbols:edit-rounded" /> Chỉnh sửa
                                </button>
                                {classData.status !== 'archived' ? (
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowOptions(false);
                                            if (onArchive) onArchive();
                                        }}
                                        className="w-full text-left !px-4 !py-2 text-sm text-orange-600 hover:bg-orange-50 transition-colors flex items-center gap-2"
                                    >
                                        <Icon icon="material-symbols:archive-rounded" /> Lưu trữ
                                    </button>
                                ) : (
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowOptions(false);
                                            if (onUnarchive) onUnarchive();
                                        }}
                                        className="w-full text-left !px-4 !py-2 text-sm text-green-600 hover:bg-green-50 transition-colors flex items-center gap-2"
                                    >
                                        <Icon icon="material-symbols:unarchive-rounded" /> Bỏ lưu trữ
                                    </button>
                                )}
                                <button className="w-full text-left !px-4 !py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 border-t border-border !mt-1 !pt-2">
                                    <Icon icon="material-symbols:delete-rounded" /> Xóa
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Class Info */}
            <div className="!mb-5 flex-grow">
                <h3 className="text-lg font-bold text-text-main font-['Outfit'] !mb-1 group-hover:text-primary transition-colors line-clamp-2">
                    {classData.name}
                </h3>
                <p className="font-mono text-sm text-text-muted bg-background inline-block !px-2 !py-0.5 rounded border border-border/50 !mb-3">
                    {classData.code}
                </p>

                <div className="space-y-2 !mt-2">
                    <div className="flex items-center text-sm text-text-muted gap-2">
                        <Icon icon="material-symbols:calendar-today-rounded" className="text-primary text-base" />
                        <span>{classData.createdAt}</span>
                    </div>
                    {classData.schedule && (
                        <div className="flex items-center text-sm text-text-muted gap-2">
                            <Icon icon="material-symbols:schedule-rounded" className="text-primary text-base" />
                            <span>{classData.schedule}</span>
                        </div>
                    )}
                    {showStudentCount && (
                        <div className="flex items-center text-sm text-text-muted gap-2">
                            <Icon icon="material-symbols:group-outline-rounded" className="text-primary text-base" />
                            <span>{classData.students?.count || classData.studentCount || 0} / {classData.students?.max || '--'} học viên</span>
                        </div>
                    )}
                </div>

                {/* Additional Info for TAs */}
                {(salary || permission) && (
                    <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                        {permission && (
                            <div className="flex items-center gap-2">
                                <Icon icon="solar:shield-keyhole-linear" className="text-amber-500 text-base" />
                                <span className="text-xs font-semibold text-text-main">Quyền: </span>
                                <span className="text-xs text-text-muted truncate">{getPermissionLabel(permission)}</span>
                            </div>
                        )}
                        {salary && (
                            <div className="flex items-center gap-2">
                                <Icon icon="solar:wad-of-money-linear" className="text-emerald-500 text-base" />
                                <span className="text-xs font-semibold text-text-main">Phụ cấp: </span>
                                <span className="text-xs font-bold text-emerald-600">
                                    {typeof salary === 'number' ? salary.toLocaleString('vi-VN') + ' đ' : salary}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Progress Bar */}
            {showProgress && classData.progress && (
                <>
                <div className="flex justify-between items-end !mb-3">
                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Tiến độ</span>
                    <span className="text-sm font-bold text-primary">{classData.progress.currentSession}/{classData.progress.totalSessions} buổi</span>
                </div>
                <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                    <div 
                        className={`h-full rounded-full transition-all duration-500 ease-out ${classData.status === 'completed' ? 'bg-gray-400' : 'bg-primary'}`}
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
                </>
            )}
        </div>
    );
};

export default ClassCard;
