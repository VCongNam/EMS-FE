import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

const getStatusConfig = (status) => {
    switch (status) {
        case 'ongoing':
            return { label: 'Đang diễn ra', color: 'text-green-600', bg: 'bg-green-100', dot: 'bg-green-500' };
        case 'upcoming':
            return { label: 'Sắp khai giảng', color: 'text-blue-600', bg: 'bg-blue-100', dot: 'bg-blue-500' };
        case 'completed':
            return { label: 'Đã kết thúc', color: 'text-gray-600', bg: 'bg-gray-100', dot: 'bg-gray-500' };
        default:
            return { label: 'Không xác định', color: 'text-gray-600', bg: 'bg-gray-100', dot: 'bg-gray-500' };
    }
};

const ClassCard = ({ classData, onEdit, onArchive, onUnarchive }) => {
    const navigate = useNavigate();
    const statusConfig = getStatusConfig(classData.status);
    const progressPercent = classData.progress?.totalSessions > 0 
        ? Math.round((classData.progress.currentSession / classData.progress.totalSessions) * 100) 
        : 0;
    
    const [showOptions, setShowOptions] = useState(false);
    const optionsRef = useRef(null);

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
        
        // Chuyển hướng tới chi tiết lớp (hiện tại thì click tạm chưa có route thật)
        console.log("Navigate to class details");
        // navigate(`/classes/${classData.id}`);
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
                    <div className="flex items-center text-sm text-text-muted gap-2">
                        <Icon icon="material-symbols:group-outline-rounded" className="text-primary text-base" />
                        <span>{classData.students?.count || 0} / {classData.students?.max || 0} học viên</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-background !p-4 rounded-xl border border-border/50">
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
            </div>
        </div>
    );
};

export default ClassCard;
