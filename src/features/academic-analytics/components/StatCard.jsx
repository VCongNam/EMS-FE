import React from 'react';
import { Icon } from '@iconify/react';

const StatCard = ({ 
    icon, 
    title, 
    value, 
    subValue, 
    progress, 
    type = 'default', // 'default', 'growth', 'attendance', 'quality'
    iconColor = 'text-blue-600',
    iconBg = '!bg-blue-50',
    warning = false
}) => {
    return (
        <div className="!bg-white rounded-[var(--radius-xl)] !p-6 shadow-[var(--shadow-premium)] border border-[var(--color-border)] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-fade-in group">
            <div>
                <div className="flex items-center gap-3 !mb-2">
                    <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                        <Icon icon={icon} className={`text-2xl ${iconColor}`} />
                    </div>
                    <span className="text-[#64748B] font-semibold text-sm uppercase tracking-wider">{title}</span>
                </div>
                <div className="!mt-4 flex items-baseline gap-2">
                    <span className={`text-3xl font-black tracking-tight ${warning ? 'text-[#F59E0B]' : 'text-[#1E293B]'}`}>
                        {value}
                    </span>
                </div>
            </div>

            <div className="!mt-5">
                {progress !== undefined && (
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-[#64748B]">
                            <span>{subValue}</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full !bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-50">
                            <div 
                                className={`${iconBg.replace('bg-', 'bg-').replace('-50', '-500')} h-full rounded-full transition-all duration-1000 ease-out`} 
                                style={{ width: `${Math.min(progress, 100)}%`, backgroundColor: progress > 0 ? null : '#E2E8F0' }}
                            ></div>
                        </div>
                    </div>
                )}
                
                {progress === undefined && subValue && (
                    <div className="flex items-center gap-2">
                        {subValue}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
