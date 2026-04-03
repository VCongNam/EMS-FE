import React from 'react';
import { Icon } from '@iconify/react';

const NextClassCard = ({ nextClass }) => {
    if (!nextClass) return null;

    return (
        <div className="!bg-primary/5 !p-6 sm:!p-8 !rounded-[2.5rem] !border !border-primary/20 !relative !overflow-hidden !group !animate-fade-in-up">
            {/* Background Decoration */}
            <div className="!absolute !-right-10 !-top-10 !w-48 !h-48 !bg-primary/10 !rounded-full !blur-3xl !group-hover:!bg-primary/20 !transition-all !duration-500" />
            
            <div className="!relative !z-10 !flex !flex-col md:!flex-row !items-start md:!items-center !justify-between !gap-6">
                <div className="!flex !items-center !gap-6">
                    <div className="!w-16 !h-16 !bg-white !rounded-3xl !shadow-sm !flex !items-center !justify-center !text-primary">
                        <Icon icon="solar:videocamera-record-bold-duotone" className="!text-3xl !animate-pulse" />
                    </div>
                    <div>
                        <div className="!flex !items-center !gap-2 !mb-1">
                            <span className="!px-2 !py-0.5 !bg-primary !text-white !text-[10px] !font-black !rounded-lg !uppercase !tracking-widest">Đang diễn ra</span>
                            <span className="!text-xs !font-bold !text-primary">Kết thúc sau 45 phút</span>
                        </div>
                        <h2 className="!text-xl sm:!text-2xl !font-black !text-text-main !tracking-tight">
                            {nextClass.subject} ({nextClass.code})
                        </h2>
                        <div className="!flex !items-center !gap-4 !mt-2 !text-sm !font-bold !text-text-muted">
                            <div className="!flex !items-center !gap-1.5">
                                <Icon icon="solar:map-point-bold-duotone" className="!text-primary" />
                                Phòng: {nextClass.room}
                            </div>
                            <div className="!w-1 !h-1 !rounded-full !bg-border" />
                            <div className="!flex !items-center !gap-1.5">
                                <Icon icon="solar:user-bold-duotone" className="!text-primary" />
                                GV: {nextClass.teacher}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="!flex !items-center !gap-3 !w-full md:!w-auto">
                    <button className="!flex-1 md:!flex-none !px-6 !py-3.5 !bg-primary !text-white !rounded-2xl !font-black !text-sm !shadow-lg !shadow-primary/20 hover:!bg-primary/90 !transition-all !flex !items-center !justify-center !gap-2">
                        <Icon icon="solar:play-bold" className="!text-lg" />
                        Vào lớp học
                    </button>
                    <button className="!p-3.5 !bg-white !border !border-border !rounded-2xl !text-text-muted hover:!text-primary hover:!border-primary/30 !transition-all">
                        <Icon icon="solar:document-text-bold-duotone" className="!text-2xl" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NextClassCard;
