import React from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

const ClassReportCard = ({ classData }) => {
    const navigate = useNavigate();
    
    // Mock progress calculation for reports
    const reportProgress = classData.reportProgress || { generated: 0, total: classData.students?.max || 30 };
    const progressPercent = Math.round((reportProgress.generated / reportProgress.total) * 100);

    return (
        <div 
            onClick={() => navigate(`/reports/${classData.id}`)}
            className="!bg-white !rounded-3xl !border !border-border !p-6 !shadow-sm hover:!shadow-xl !transition-all !duration-500 !group !cursor-pointer !relative !overflow-hidden !flex !flex-col !h-full"
        >
            {/* Decoration Abstract */}
            <div className="!absolute !-right-4 !-top-4 !w-24 !h-24 !bg-primary/5 !rounded-full !group-hover:scale-150 !transition-transform !duration-700"></div>
            
            <div className="!flex !justify-between !items-start !mb-6 !relative !z-10">
                <div className="!w-14 !h-14 !bg-primary/10 !rounded-2xl !flex !items-center !justify-center !group-hover:bg-primary !group-hover:rotate-6 !transition-all !duration-500">
                    <Icon icon="material-symbols:school-outline-rounded" className="!text-primary !text-2xl !group-hover:text-white !transition-colors" />
                </div>
                <div className="!px-3 !py-1 !bg-background !rounded-full !border !border-border !text-[10px] !font-bold !text-text-muted !uppercase !tracking-widest">
                    {classData.code}
                </div>
            </div>

            <div className="!flex-1 !relative !z-10">
                <h3 className="!text-xl !font-black !text-text-main !mb-2 !group-hover:text-primary !transition-colors !line-clamp-2">
                    {classData.name}
                </h3>
                <div className="!flex !items-center !gap-2 !mb-6">
                    <div className="!w-1.5 !h-1.5 !rounded-full !bg-emerald-500"></div>
                    <span className="!text-xs !font-bold !text-text-muted">{classData.subjectName || 'Môn học cơ bản'}</span>
                </div>

                <div className="!space-y-3 !mb-8">
                    <div className="!flex !items-center !gap-3 !text-sm !text-text-muted">
                        <Icon icon="material-symbols:group-rounded" className="!text-primary !opacity-60" />
                        <span className="!font-medium">{classData.students?.count || 0} Học sinh</span>
                    </div>
                    <div className="!flex !items-center !gap-3 !text-sm !text-text-muted">
                        <Icon icon="material-symbols:update-rounded" className="!text-primary !opacity-60" />
                        <span className="!font-medium">Cập nhật: 2 giờ trước</span>
                    </div>
                </div>
            </div>

            {/* Progress Section */}
            <div className="!mt-auto !pt-6 !border-t !border-border/50 !relative !z-10">
                <div className="!flex !justify-between !items-end !mb-3">
                    <div>
                        <p className="!text-[10px] !font-black !text-text-muted !uppercase !tracking-widest !mb-1">Báo cáo tiến độ</p>
                        <p className="!text-sm !font-black !text-text-main">{reportProgress.generated} / {reportProgress.total} <span className="!text-xs !font-normal !text-text-muted">bản đã tạo</span></p>
                    </div>
                    <span className="!text-lg !font-black !text-primary">{progressPercent}%</span>
                </div>
                <div className="!h-2.5 !w-full !bg-background !rounded-full !overflow-hidden !border !border-border/50">
                    <div 
                        className="!h-full !bg-primary !rounded-full !transition-all !duration-1000 !ease-out"
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
            </div>
            
            {/* View Details Shortcut */}
            <div className="!absolute !bottom-4 !right-6 !opacity-0 !group-hover:opacity-100 !translate-x-4 !group-hover:translate-x-0 !transition-all !duration-500 !flex !items-center !gap-2 !text-primary !font-black !text-xs !uppercase !tracking-widest">
                Xem chi tiết
                <Icon icon="material-symbols:arrow-forward-rounded" />
            </div>
        </div>
    );
};

export default ClassReportCard;
