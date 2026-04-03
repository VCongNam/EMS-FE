import React from 'react';
import { toast } from 'react-toastify';
import { Icon } from '@iconify/react';

const CustomToast = ({ title, message, type, icon, onAction, actionLabel }) => {
    const isTeacher = type === 'teacher';
    const isPromo = type === 'promo';

    return (
        <div className="!flex !items-start !gap-4 !p-4 !bg-white !rounded-2xl !shadow-none !border !border-border !relative !overflow-hidden">
            {/* Background Accent */}
            <div className={`!absolute !inset-y-0 !left-0 !w-1 ${isTeacher ? '!bg-primary' : isPromo ? '!bg-orange-500' : '!bg-emerald-500'}`} />
            
            <div className={`!w-12 !h-12 !rounded-xl !flex-shrink-0 !flex !items-center !justify-center ${isTeacher ? '!bg-primary/10 !text-primary' : '!bg-orange-50 !text-orange-500'}`}>
                <Icon icon={icon || (isTeacher ? 'solar:user-speak-bold-duotone' : 'solar:fire-bold-duotone')} className="!text-xl" />
            </div>

            <div className="!flex-1">
                <h4 className="!text-sm !font-black !text-text-main !mb-0.5">{title}</h4>
                <p className="!text-xs !font-medium !text-text-muted !line-clamp-2">{message}</p>
                {onAction && (
                    <button 
                        onClick={onAction}
                        className="!mt-3 !px-4 !py-1.5 !bg-primary !text-white !text-[10px] !font-black !rounded-lg hover:!bg-primary/90 !transition-all"
                    >
                        {actionLabel || 'Xem ngay'}
                    </button>
                )}
            </div>
        </div>
    );
};

export const showNotification = ({ title, message, type = 'system', icon, onAction, actionLabel }) => {
    toast(
        <CustomToast 
            title={title} 
            message={message} 
            type={type} 
            icon={icon} 
            onAction={onAction} 
            actionLabel={actionLabel} 
        />,
        {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            style: { padding: 0, background: 'transparent', boxShadow: 'none' }
        }
    );
};
