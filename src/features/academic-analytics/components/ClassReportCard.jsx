import React from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

const ClassReportCard = ({ classData, month, year }) => {
    const navigate = useNavigate();
    
    // API Mapping
    const id = classData.classId;
    const name = classData.className;
    const room = classData.room || 'No Room';
    const totalStudents = classData.totalStudents || 0;
    const generated = classData.createdReports || 0;
    const completionRate = classData.completionRate || 0;
    const deadline = classData.deadline;
    const isNearDeadline = classData.isNearDeadline;

    // Logic for styling
    const getProgressColor = (rate) => {
        if (rate === 100) return '!bg-emerald-500';
        if (rate >= 50) return '!bg-blue-600';
        return '!bg-red-500';
    };

    const isUrgent = deadline ? (new Date(deadline) - new Date()) / (1000 * 60 * 60) < 48 : false;

    const periodLabel = `Tháng ${month.toString().padStart(2, '0')}/${year}`;

    return (
        <div 
            onClick={() => navigate(`/reports/${id}?month=${month}&year=${year}`)}
            className="!bg-white !rounded-3xl !border !border-border !p-6 !shadow-sm hover:!shadow-xl hover:-translate-y-1 !transition-all !duration-500 !group !cursor-pointer !relative !overflow-hidden !flex !flex-col !h-full"
        >
            {/* Decoration Abstract */}
            <div className="!absolute !-right-4 !-top-4 !w-24 !h-24 !bg-primary/5 !rounded-full !group-hover:scale-150 !transition-transform !duration-700"></div>
            
            <div className="!flex !justify-between !items-start !mb-6 !relative !z-10">
                <div className="!w-14 !h-14 !bg-primary/10 !rounded-2xl !flex !items-center !justify-center !group-hover:bg-primary !group-hover:rotate-6 !transition-all !duration-500">
                    <Icon icon="material-symbols:school-outline-rounded" className="!text-primary !text-2xl !group-hover:text-white !transition-colors" />
                </div>
                <div className="!px-3 !py-1 !bg-background !rounded-full !border !border-border !text-[10px] !font-bold !text-text-muted !uppercase !tracking-widest">
                    {room}
                </div>
            </div>

            <div className="!flex-1 !relative !z-10">
                <h3 className="!text-xl !font-black !text-text-main !mb-2 !group-hover:text-primary !transition-colors !line-clamp-2">
                    {name}
                </h3>
                <div className="!flex !items-center !gap-2 !mb-6">
                    <div className="!w-1.5 !h-1.5 !rounded-full !bg-emerald-500"></div>
                    <span className="!text-xs !font-bold !text-text-muted">Tiến độ {periodLabel}</span>
                </div>

                <div className="!space-y-3 !mb-8">
                    <div className="!flex !items-center !gap-3 !text-sm !text-text-muted">
                        <Icon icon="material-symbols:group-rounded" className="!text-primary !opacity-60" />
                        <span className="!font-medium">{totalStudents} Học sinh</span>
                    </div>
                    {deadline && (
                        <div className={`!flex !items-center !gap-3 !text-sm !font-black ${isUrgent || isNearDeadline ? 'text-red-500' : 'text-text-muted'}`}>
                            <Icon icon="material-symbols:alarm-on-rounded" className="!opacity-60" />
                            <span>Hạn nộp: {new Date(deadline).toLocaleDateString('vi-VN')}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Progress Section */}
            <div className="!mt-auto !pt-6 !border-t !border-border/50 !relative !z-10">
                <div className="!flex !justify-between !items-end !mb-3">
                    <div>
                        <p className="!text-[10px] !font-black !text-text-muted !uppercase !tracking-widest !mb-1">Báo cáo hoàn thành</p>
                        <p className={`!text-sm !font-black ${completionRate === 100 ? 'text-emerald-600' : 'text-text-main'}`}>
                            {completionRate === 100 ? 'Đã hoàn thành' : `${generated} / ${totalStudents} bản`}
                        </p>
                    </div>
                    <span className={`!text-lg !font-black ${completionRate === 100 ? 'text-emerald-500' : (completionRate >= 50 ? 'text-blue-600' : 'text-red-500')}`}>
                        {completionRate}%
                    </span>
                </div>
                <div className="!h-3 !w-full !bg-background !rounded-full !overflow-hidden !border !border-border/50">
                    <div 
                        className={`!h-full !rounded-full !transition-all !duration-1000 !ease-out ${getProgressColor(completionRate)}`}
                        style={{ width: `${completionRate}%` }}
                    ></div>
                </div>
            </div>
            
            {/* View Details Shortcut */}
            <div className="!absolute !bottom-4 !right-6 !opacity-0 !group-hover:opacity-100 !translate-x-4 !group-hover:translate-x-0 !transition-all !duration-500 !flex !items-center !gap-2 !text-primary !font-black !text-xs !uppercase !tracking-widest">
                Mở báo cáo
                <Icon icon="material-symbols:arrow-forward-rounded" />
            </div>
        </div>
    );
};

export default ClassReportCard;
