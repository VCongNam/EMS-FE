import React from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

const DashboardDeadlines = ({ title, icon, iconBgBase, iconColor, items, viewAllLink, viewAllLabel }) => {
    // Fallback for student DashboardDeadlines
    const DEFAULT_ITEMS = [
        { id: 1, title: 'Bài tập Giải tích 1', subtitle: 'Toán học', rightText: 'Hôm nay, 23:59', status: 'Urgent' },
        { id: 2, title: 'Báo cáo Thí nghiệm Lý', subtitle: 'Vật lý', rightText: 'Ngày mai, 12:00', status: 'Soon' },
        { id: 3, title: 'Tiểu luận Triết học', subtitle: 'Triết học', rightText: '15/10/2026', status: 'Normal' },
    ];

    const displayItems = items || DEFAULT_ITEMS;

    return (
        <div className="!bg-white !p-8 !rounded-[2.5rem] !border !border-border !shadow-sm !space-y-6">
            <div className="!flex !items-center !justify-between">
                <div className="!flex !items-center !gap-3">
                    <div className={`!w-10 !h-10 !rounded-xl !flex !items-center !justify-center ${iconBgBase || '!bg-red-50'} ${iconColor || '!text-red-500'}`}>
                        <Icon icon={icon || "solar:fire-bold-duotone"} className="!text-2xl" />
                    </div>
                    <h3 className="!text-lg !font-black !text-text-main !tracking-tight">{title || 'Hạn nộp bài tập'}</h3>
                </div>
                {viewAllLink && (
                    <Link to={viewAllLink} className="!text-xs !font-black !text-primary hover:!underline">
                        {viewAllLabel || 'Xem tất cả'}
                    </Link>
                )}
            </div>

            <div className="!space-y-4">
                {displayItems.map((item) => (
                    <div key={item.id} className="!group !flex !items-center !justify-between !p-4 !rounded-2xl !bg-background hover:!bg-primary/5 !border !border-transparent hover:!border-primary/20 !transition-all">
                        <div className="!flex !items-start !gap-4">
                            <div className={`!w-2 !h-12 !rounded-full ${
                                item.statusColor ? item.statusColor : (item.status === 'Urgent' ? '!bg-red-500' : item.status === 'Soon' ? '!bg-orange-500' : '!bg-emerald-500')
                            }`} />
                            <div>
                                <h4 className="!text-sm !font-black !text-text-main group-hover:!text-primary !transition-colors">{item.title}</h4>
                                <p className="!text-[11px] !font-bold !text-text-muted !mt-1">
                                    {item.subtitle} • {item.rightText}
                                </p>
                            </div>
                        </div>
                        {item.actionIcon && (
                            <button className="!p-2 !bg-white !rounded-xl !text-text-muted hover:!text-primary !shadow-sm !transition-all !opacity-0 group-hover:!opacity-100">
                                <Icon icon={item.actionIcon} />
                            </button>
                        )}
                        {!item.actionIcon && (
                            <button className="!p-2 !bg-white !rounded-xl !text-text-muted hover:!text-primary !shadow-sm !transition-all !opacity-0 group-hover:!opacity-100">
                                <Icon icon="solar:upload-bold-duotone" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardDeadlines;
