import React from 'react';
import { Icon } from '@iconify/react';

const SUBJECT_COLORS = {
    Math: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    Physics: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
    Chemistry: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
    English: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
    Default: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' }
};

const ScheduleGridView = ({ weeklyData }) => {
    // Days of the week header
    const DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];

    return (
        <div className="!space-y-4 !animate-fade-in">
            {/* ── Desktop Grid (md+) ─────────────────────────── */}
            <div className="!hidden md:!block !bg-white !rounded-[2.5rem] !border !border-border !shadow-sm !overflow-hidden">
                <div className="!grid !grid-cols-7 !border-b !border-border">
                    {DAYS.map((day, idx) => (
                        <div key={idx} className="!p-4 !text-center !border-r !border-border !last:!border-r-0 !bg-background/30">
                            <span className="!text-[10px] !font-black !text-text-muted !uppercase !tracking-widest">{day}</span>
                        </div>
                    ))}
                </div>

                <div className="!grid !grid-cols-7 !min-h-[500px]">
                    {DAYS.map((day, dIdx) => (
                        <div key={dIdx} className="!border-r !border-border !last:!border-r-0 !p-2 !space-y-3 !bg-white/50">
                            {weeklyData[day]?.map((item, iIdx) => {
                                const theme = SUBJECT_COLORS[item.type] || SUBJECT_COLORS.Default;
                                return (
                                    <div 
                                        key={iIdx} 
                                        className={`!p-4 !rounded-2xl !border !shadow-sm !transition-all hover:!shadow-md hover:!-translate-y-1 !cursor-pointer !group ${theme.bg} ${theme.border}`}
                                    >
                                        <div className="!space-y-3">
                                            <div className="!flex !flex-col">
                                                <span className={`!text-[9px] !font-black !uppercase !tracking-tighter !mb-1 ${theme.text}`}>
                                                    {item.startTime} - {item.endTime}
                                                </span>
                                                <h4 className={`!text-xs !font-black !leading-tight !line-clamp-2 ${theme.text}`}>
                                                    {item.subject}
                                                </h4>
                                            </div>
                                            <div className="!flex !items-center !gap-1.5 !text-[9px] !font-bold !text-text-muted">
                                                <Icon icon="solar:map-point-bold-duotone" className={theme.text} />
                                                {item.room}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Mobile Stack (below md) ─────────────────── */}
            <div className="md:!hidden !space-y-6">
                {DAYS.map((day, dIdx) => (
                    <div key={dIdx} className="!bg-white !p-6 !rounded-[2rem] !border !border-border !shadow-sm !space-y-4">
                        <div className="!flex !items-center !gap-3 !border-b !border-border !pb-3">
                            <div className="!w-2 !h-8 !bg-primary !rounded-full" />
                            <h3 className="!text-lg !font-black !text-text-main !tracking-tight">{day}</h3>
                        </div>
                        
                        <div className="!space-y-3">
                            {(!weeklyData[day] || weeklyData[day].length === 0) ? (
                                <p className="!text-sm !font-medium !text-text-muted !italic !pl-5">Chưa có lịch dạy/học</p>
                            ) : (
                                weeklyData[day].map((item, iIdx) => {
                                    const theme = SUBJECT_COLORS[item.type] || SUBJECT_COLORS.Default;
                                    return (
                                        <div key={iIdx} className={`!p-4 !rounded-2xl !border !flex !items-center !justify-between !gap-4 ${theme.bg} ${theme.border}`}>
                                            <div className="!flex-1">
                                                <div className="!flex !items-center !gap-2 !mb-1">
                                                    <span className={`!text-[10px] !font-black !uppercase !tracking-widest ${theme.text}`}>
                                                        {item.startTime} - {item.endTime}
                                                    </span>
                                                </div>
                                                <h4 className="!text-sm !font-black !text-text-main">{item.subject}</h4>
                                                <div className="!flex !items-center !gap-1.5 !text-xs !font-bold !text-text-muted !mt-1">
                                                    <Icon icon="solar:map-point-bold-duotone" className={theme.text} />
                                                    {item.room}
                                                </div>
                                            </div>
                                            <div className="!px-3 !py-1 !bg-white/50 !backdrop-blur-sm !border !border-white/10 !rounded-lg !text-[10px] !font-black !text-text-muted !uppercase">
                                                {item.code}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScheduleGridView;
