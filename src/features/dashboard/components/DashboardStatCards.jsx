import React from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

const DashboardStatCards = ({ card1, card2, card3, card4 }) => {
    return (
        <div className={`!grid !grid-cols-1 ${card4 ? 'md:!grid-cols-2 lg:!grid-cols-4' : 'md:!grid-cols-3'} !gap-6`}>
            {/* Dark themed card (Next Class / Next Schedule) */}
            <div className="!bg-primary !p-8 !rounded-[2.5rem] !text-white !relative !overflow-hidden !group !shadow-xl !shadow-[#355872]/20">
                <div className="!absolute !-right-10 !-top-10 !w-40 !h-40 !bg-white/10 !rounded-full !blur-3xl !group-hover:!bg-white/20 !transition-all" />
                <div className="!relative !z-10 !space-y-4">
                    <div className="!flex !items-center !gap-3 !opacity-80">
                        <Icon icon={card1?.icon || "solar:calendar-date-bold-duotone"} className="!text-3xl" />
                        <span className="!text-xs !font-black !uppercase !tracking-widest">{card1?.title || 'Tiết học tiếp theo'}</span>
                    </div>
                    <div>
                        <h2 className="!text-2xl !text-white !tracking-tight">{card1?.subject || 'Toán học 101'}</h2>
                        <p className="!text-sm !font-bold !opacity-60 !mt-1">
                            {card1?.time || '14:00 - 15:30'} 
                        </p>
                    </div>
                </div>
            </div>

            {/* Circular Progress / Chart */}
            <div className="!bg-white !p-8 !rounded-[2.5rem] !border !border-border !shadow-sm !flex !items-center !justify-between !gap-4 !group hover:!border-primary/20 !transition-all">
                <div className="!space-y-2">
                    <span className="!text-[10px] !font-black !text-text-muted !uppercase !tracking-widest">{card2?.title || 'Chuyên cần'}</span>
                    <h2 className="!text-3xl !font-black !text-text-main !tracking-tighter">{card2?.value || '95'}%</h2>
                    <p className={`!text-xs !font-bold !flex !items-center !gap-1 ${card2?.trendColor || '!text-emerald-500'}`}>
                        {card2?.trendIcon && <Icon icon={card2?.trendIcon} />}
                        {card2?.trendText || 'Tốt hơn tháng trước'}
                    </p>
                </div>
                <div className="!relative !w-20 !h-20 !flex !items-center !justify-center">
                    <svg className="!w-full !h-full !-rotate-90">
                        <circle cx="40" cy="40" r="35" className="!stroke-background !fill-none !stroke-[8px]" />
                        <circle 
                            cx="40" cy="40" r="35" 
                            className="!stroke-primary !fill-none !stroke-[8px] !transition-all !duration-1000"
                            style={{ strokeDasharray: '220', strokeDashoffset: 220 - (220 * (card2?.value || 95)) / 100 }}
                        />
                    </svg>
                    <Icon icon={card2?.icon || "solar:user-rounded-bold-duotone"} className="!absolute !text-xl !text-primary" />
                </div>
            </div>

            {/* Actionable / Highlight Card */}
            <div className={`!p-8 !rounded-[2.5rem] !border !flex !flex-col !justify-center !gap-4 !relative !overflow-hidden ${card3?.bgClass || '!bg-orange-50 !border-orange-100'}`}>
                <div className="!flex !items-center !gap-4">
                    <div className={`!w-12 !h-12 !rounded-2xl !text-white !flex !items-center !justify-center !shadow-lg ${card3?.iconBgClass || '!bg-orange-500 !shadow-orange-500/20'}`}>
                        <Icon icon={card3?.icon || "solar:wallet-money-bold-duotone"} className="!text-2xl" />
                    </div>
                    <div>
                        <h4 className={`!text-sm !font-black ${card3?.titleClass || '!text-orange-900'}`}>{card3?.title || 'Dư nợ Học phí'}</h4>
                        <p className={`!text-2xl !font-black !tracking-tighter ${card3?.valueClass || '!text-orange-600'}`}>
                            {card3?.value?.toLocaleString('vi-VN') || '150.000'} <span className="!text-sm">{card3?.unit || '₫'}</span>
                        </p>
                    </div>
                </div>
                {card3?.button && (
                    <Link 
                        to={card3?.button.path || "/"}
                        className={`!w-full !px-4 !py-3 !bg-white !border !rounded-xl !text-sm !font-black !flex !items-center !justify-center !gap-2 !transition-all ${card3?.button.className || '!text-orange-600 !border-orange-200 hover:!bg-orange-100'}`}
                    >
                        {card3?.button.label || 'Xem chi tiết'}
                        <Icon icon="solar:arrow-right-bold" />
                    </Link>
                )}
            </div>

            {/* Card 4 (Optional Actionable) */}
            {card4 && (
                <div className={`!p-8 !rounded-[2.5rem] !border !flex !flex-col !justify-center !gap-4 !relative !overflow-hidden ${card4?.bgClass || '!bg-emerald-50 !border-emerald-100'}`}>
                    <div className="!flex !items-center !gap-4">
                        <div className={`!w-12 !h-12 !rounded-2xl !text-white !flex !items-center !justify-center !shadow-lg ${card4?.iconBgClass || '!bg-emerald-500 !shadow-emerald-500/20'}`}>
                            <Icon icon={card4?.icon || "solar:bill-check-bold-duotone"} className="!text-2xl" />
                        </div>
                        <div>
                            <h4 className={`!text-sm !font-black ${card4?.titleClass || '!text-emerald-900'}`}>{card4?.title}</h4>
                            <p className={`!text-2xl !font-black !tracking-tighter ${card4?.valueClass || '!text-emerald-600'}`}>
                                {card4?.value} <span className="!text-sm">{card4?.unit}</span>
                            </p>
                        </div>
                    </div>
                    {card4?.button && (
                        <Link 
                            to={card4?.button.path || "/"}
                            className={`!w-full !px-4 !py-3 !bg-white !border !rounded-xl !text-sm !font-black !flex !items-center !justify-center !gap-2 !transition-all ${card4?.button.className || '!text-emerald-600 !border-emerald-200 hover:!bg-emerald-100'}`}
                        >
                            {card4?.button.label}
                            <Icon icon="solar:arrow-right-bold" />
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};

export default DashboardStatCards;
