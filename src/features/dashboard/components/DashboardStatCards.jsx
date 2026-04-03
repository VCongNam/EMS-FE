import React from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

const DashboardStatCards = ({ nextClass, attendance, balance }) => {
    return (
        <div className="!grid !grid-cols-1 md:!grid-cols-3 !gap-6">
            {/* Next Class Card */}
            <div className="!bg-[#355872] !p-8 !rounded-[2.5rem] !text-white !relative !overflow-hidden !group !shadow-xl !shadow-[#355872]/20">
                <div className="!absolute !-right-10 !-top-10 !w-40 !h-40 !bg-white/10 !rounded-full !blur-3xl !group-hover:!bg-white/20 !transition-all" />
                <div className="!relative !z-10 !space-y-4">
                    <div className="!flex !items-center !gap-3 !opacity-80">
                        <Icon icon="solar:calendar-date-bold-duotone" className="!text-3xl" />
                        <span className="!text-xs !font-black !uppercase !tracking-widest">Tiết học tiếp theo</span>
                    </div>
                    <div>
                        <h2 className="!text-2xl !font-black !tracking-tight">{nextClass?.subject || 'Toán học 101'}</h2>
                        <p className="!text-sm !font-bold !opacity-60 !mt-1">
                            {nextClass?.time || '14:00 - 15:30'} | {nextClass?.room || 'Phòng 2.01'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Attendance Circular Card */}
            <div className="!bg-white !p-8 !rounded-[2.5rem] !border !border-border !shadow-sm !flex !items-center !justify-between !gap-4 !group hover:!border-primary/20 !transition-all">
                <div className="!space-y-2">
                    <span className="!text-[10px] !font-black !text-text-muted !uppercase !tracking-widest">Chuyên cần</span>
                    <h2 className="!text-3xl !font-black !text-text-main !tracking-tighter">{attendance || '95'}%</h2>
                    <p className="!text-xs !font-bold !text-emerald-500 !flex !items-center !gap-1">
                        <Icon icon="solar:arrow-up-bold-duotone" />
                        Tốt hơn tháng trước
                    </p>
                </div>
                <div className="!relative !w-20 !h-20 !flex !items-center !justify-center">
                    <svg className="!w-full !h-full !-rotate-90">
                        <circle cx="40" cy="40" r="35" className="!stroke-background !fill-none !stroke-[8px]" />
                        <circle 
                            cx="40" cy="40" r="35" 
                            className="!stroke-primary !fill-none !stroke-[8px] !transition-all !duration-1000"
                            style={{ strokeDasharray: '220', strokeDashoffset: 220 - (220 * (attendance || 95)) / 100 }}
                        />
                    </svg>
                    <Icon icon="solar:user-rounded-bold-duotone" className="!absolute !text-xl !text-primary" />
                </div>
            </div>

            {/* Financial Card */}
            <div className="!bg-orange-50 !p-8 !rounded-[2.5rem] !border !border-orange-100 !flex !flex-col !justify-center !gap-4 !relative !overflow-hidden">
                <div className="!flex !items-center !gap-4">
                    <div className="!w-12 !h-12 !rounded-2xl !bg-orange-500 !text-white !flex !items-center !justify-center !shadow-lg !shadow-orange-500/20">
                        <Icon icon="solar:wallet-money-bold-duotone" className="!text-2xl" />
                    </div>
                    <div>
                        <h4 className="!text-sm !font-black !text-orange-900">Dư nợ Học phí</h4>
                        <p className="!text-2xl !font-black !text-orange-600 !tracking-tighter">
                            {balance?.toLocaleString('vi-VN') || '150.000'} <span className="!text-sm">₫</span>
                        </p>
                    </div>
                </div>
                <Link 
                    to="/tuition-payment"
                    className="!w-full !px-4 !py-3 !bg-white !text-orange-600 !border !border-orange-200 !rounded-xl !text-sm !font-black !flex !items-center !justify-center !gap-2 hover:!bg-orange-100 !transition-all"
                >
                    Thanh toán nợ
                    <Icon icon="solar:arrow-right-bold" />
                </Link>
            </div>
        </div>
    );
};

export default DashboardStatCards;
