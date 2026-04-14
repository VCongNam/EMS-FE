import React from 'react';
import { Icon } from '@iconify/react';

const DAYS = [
    { label: 'T2', name: 'Thứ 2', date: '02' },
    { label: 'T3', name: 'Thứ 3', date: '03' },
    { label: 'T4', name: 'Thứ 4', date: '04' },
    { label: 'T5', name: 'Thứ 5', date: '05' },
    { label: 'T6', name: 'Thứ 6', date: '06' },
    { label: 'T7', name: 'Thứ 7', date: '07' },
    { label: 'CN', name: 'Chủ Nhật', date: '08' },
];

const DaySelector = ({ selectedDate, onSelect }) => {
    return (
        <div className="!grid !grid-cols-4 sm:!flex sm:!flex-wrap md:!flex-nowrap !items-center !gap-3 !px-2">
            {DAYS.map((day, idx) => {
                const isActive = selectedDate === day.date;
                return (
                    <button
                        key={idx}
                        onClick={() => onSelect(day.date)}
                        className={`!min-w-[70px] !p-4 !rounded-[2rem] !border !transition-all !duration-300 !flex !flex-col !items-center !gap-1.5 ${
                            isActive 
                            ? '!bg-primary !border-primary !text-white !shadow-xl !shadow-primary/30 !-translate-y-1' 
                            : '!bg-white !border-border !text-text-muted hover:!border-primary/30 hover:!bg-primary/5'
                        }`}
                    >
                        <span className={`!text-[10px] !font-black !uppercase !tracking-widest ${isActive ? '!text-white/70' : '!text-text-muted'}`}>
                            {day.label}
                        </span>
                        <span className="!text-xl !font-black !tracking-tighter">
                            {day.date}
                        </span>
                        {isActive && <div className="!w-1.5 !h-1.5 !rounded-full !bg-white !mt-0.5" />}
                    </button>
                );
            })}
        </div>
    );
};

export default DaySelector;
