import React from 'react';
import { Icon } from '@iconify/react';

const StepCard = ({ number, title, description, icon, isReversed = false }) => {
    // Number + Icon group
    const visualSide = (
        <div className={`hidden md:flex w-full md:w-1/2 items-center justify-center ${isReversed ? 'order-2' : 'order-2 md:order-1'
            }`}>
            <div className={`w-full max-w-sm px-6 flex flex-row items-center gap-6 ${isReversed ? 'justify-start' : 'justify-end'
                }`}>
                <span className={`text-7xl md:text-8xl font-bold text-[#2D3142] leading-none ${isReversed ? 'order-2 md:order-1' : ''
                    }`}>
                    {number}
                </span>
                <div className={`relative w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center shadow-sm ${isReversed ? 'order-1 md:order-2' : ''
                    }`}>
                    <Icon icon={icon} className="text-primary" width="48" height="48" />
                    <div className="absolute inset-0 bg-primary/20 blur-xl opacity-20 rounded-full" />
                </div>
            </div>
        </div>
    );

    // Text group — invisible card wrapper for centering
    const textSide = (
        <div className={`w-full md:w-1/2 flex items-center justify-center ${isReversed ? 'order-1' : 'order-1 md:order-2'
            }`}>
            <div className={`w-full max-w-sm px-6 text-center ${isReversed ? 'md:text-right' : 'md:text-left'}`}>
                <h3 className="text-2xl font-bold text-[#2D3142] mb-3 tracking-tight font-['Outfit']">
                    {title}
                </h3>
                <p className="text-lg text-text-muted leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row items-center w-full group relative min-h-[120px] !mb-10">
            {isReversed ? textSide : visualSide}

            {/* Center Dot */}
            <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary ring-4 ring-white shadow-md hidden md:block transition-all duration-300 group-hover:scale-150" />

            {isReversed ? visualSide : textSide}
        </div>
    );
};

export default StepCard;
