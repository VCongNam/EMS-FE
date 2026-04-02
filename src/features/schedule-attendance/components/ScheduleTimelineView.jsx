import React from 'react';
import { Icon } from '@iconify/react';

const STATUS_CONFIG = {
    Present: { label: 'Có mặt', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: 'solar:check-read-bold' },
    Absent: { label: 'Vắng mặt', color: 'text-red-500', bg: 'bg-red-50', icon: 'solar:close-circle-bold' },
    Scheduled: { label: 'Chưa diễn ra', color: 'text-amber-600', bg: 'bg-amber-50', icon: 'solar:clock-circle-bold' },
};

const ScheduleTimelineView = ({ scheduleData }) => {
    return (
        <div className="!space-y-6 !pl-4 !relative !animate-fade-in-up">
            {/* Timeline Vertical Line */}
            <div className="!absolute !left-0 !top-0 !bottom-0 !w-0.5 !bg-border !dashed !border-l-2 !border-dashed !border-primary/20" />

            {scheduleData.length === 0 ? (
                <div className="!py-20 !text-center !opacity-40">
                    <Icon icon="solar:calendar-block-bold-duotone" className="!text-5xl !mx-auto !mb-3" />
                    <p className="!font-bold">Không có lịch học trong ngày này</p>
                </div>
            ) : (
                scheduleData.map((item, idx) => {
                    const status = STATUS_CONFIG[item.status || 'Scheduled'];
                    return (
                        <div key={idx} className="!relative !pl-10 !group">
                            {/* Timeline Node */}
                            <div className="!absolute !left-[-5px] !top-1 !w-[10px] !h-[10px] !bg-primary !rounded-full !ring-4 !ring-primary/10 !z-10 !group-hover:!scale-125 !transition-all" />
                            
                            <div className="!flex !flex-col sm:!flex-row !gap-6 !p-6 !bg-white !rounded-[2rem] !border !border-border !shadow-sm hover:!shadow-lg hover:!border-primary/20 !transition-all">
                                {/* Time Column */}
                                <div className="!min-w-[120px] !space-y-1">
                                    <h4 className="!text-lg !font-black !text-text-main !tracking-tight">{item.startTime}</h4>
                                    <p className="!text-xs !font-bold !text-text-muted">{item.endTime}</p>
                                    <div className={`!mt-3 !inline-flex !items-center !gap-1.5 !px-3 !py-1 !rounded-full !text-[10px] !font-black !uppercase !tracking-wider ${status.bg} ${status.color}`}>
                                        <Icon icon={status.icon} />
                                        {status.label}
                                    </div>
                                </div>

                                {/* Subject Details */}
                                <div className="!flex-1">
                                    <div className="!flex !items-center !gap-2 !mb-2">
                                        <h3 className="!text-lg !font-black !text-text-main !tracking-tight">{item.subject}</h3>
                                        <span className="!px-2 !py-0.5 !bg-background !border !border-border !text-[9px] !font-black !uppercase !tracking-widest !rounded-lg !text-text-muted">
                                            {item.code}
                                        </span>
                                    </div>

                                    <div className="!grid !grid-cols-2 !gap-4 !mt-4">
                                        <div className="!flex !items-center !gap-2 !text-sm !font-bold !text-text-muted">
                                            <div className="!w-8 !h-8 !rounded-lg !bg-orange-50 !flex !items-center !justify-center !text-orange-500">
                                                <Icon icon="solar:map-point-bold-duotone" />
                                            </div>
                                            Phòng: {item.room}
                                        </div>
                                        <div className="!flex !items-center !gap-2 !text-sm !font-bold !text-text-muted">
                                            <div className="!w-8 !h-8 !rounded-lg !bg-blue-50 !flex !items-center !justify-center !text-blue-500">
                                                <Icon icon="solar:users-group-rounded-bold-duotone" />
                                            </div>
                                            GV: {item.teacher}
                                        </div>
                                    </div>

                                    {item.homework && (
                                        <div className="!mt-5 !flex !items-center !gap-3 !p-3 !bg-background !rounded-xl !border !border-border !border-dashed">
                                            <Icon icon="solar:notes-bold-duotone" className="!text-primary !text-xl" />
                                            <p className="!text-xs !font-bold !text-text-main !line-clamp-1">{item.homework}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default ScheduleTimelineView;
