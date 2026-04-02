import React from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

const DashboardActionHub = () => {
    const ACTIONS = [
        { 
            id: 'pay', 
            label: 'Thanh toán Học phí', 
            icon: 'solar:wallet-money-bold-duotone', 
            path: '/tuition-payment', 
            color: 'text-blue-600', 
            bg: 'bg-blue-50', 
            shadow: 'shadow-blue-500/10' 
        },
        { 
            id: 'submit', 
            label: 'Nộp bài tập về nhà', 
            icon: 'solar:document-add-bold-duotone', 
            path: '/student/classes', 
            color: 'text-emerald-600', 
            bg: 'bg-emerald-50', 
            shadow: 'shadow-emerald-500/10' 
        },
    ];

    return (
        <div className="!space-y-4">
            <div className="!flex !items-center !gap-4 !px-2">
                <h3 className="!text-xl !font-black !text-text-main !tracking-tight">Thao tác nhanh</h3>
                <div className="!flex-1 !h-px !bg-border !dashed !border-t-2 !border-dashed !border-primary/10" />
            </div>

            <div className="!grid !grid-cols-1 sm:!grid-cols-2 !gap-6">
                {ACTIONS.map((action) => (
                    <Link
                        key={action.id}
                        to={action.path}
                        className={`!group !relative !p-8 !rounded-[2.5rem] !border !border-border !bg-white !shadow-sm hover:!shadow-xl hover:!border-primary/20 ${action.shadow} !transition-all !duration-300 !flex !flex-col !items-center !text-center !gap-4`}
                    >
                        <div className={`!w-16 !h-16 !rounded-2xl !flex !items-center !justify-center ${action.bg} ${action.color} !group-hover:!scale-110 !transition-transform`}>
                            <Icon icon={action.icon} className="!text-3xl" />
                        </div>
                        <span className="!text-sm !font-black !text-text-main !tracking-tight !group-hover:!text-primary !transition-colors">
                            {action.label}
                        </span>
                        
                        {/* Hover Decorative Element */}
                        <div className="!absolute !bottom-4 !right-4 !opacity-0 !group-hover:!opacity-100 !group-hover:!translate-x-1 !transition-all">
                            <Icon icon="solar:round-alt-arrow-right-bold-duotone" className={`!text-2xl ${action.color}`} />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default DashboardActionHub;
