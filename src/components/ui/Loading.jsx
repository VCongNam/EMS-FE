import React from 'react';
import { Icon } from '@iconify/react';

/**
 * Reusable Loading component
 * @param {boolean} fullPage - If true, covers the entire screen with a backdrop
 * @param {boolean} overlay - If true, covers the parent container (parent must be relative)
 * @param {string} text - Optional text to display below the spinner
 * @param {string} size - size of the spinner (xs, sm, md, lg, xl)
 * @param {string} className - Additional CSS classes
 */
const Loading = ({ 
    fullPage = false, 
    overlay = false, 
    text = 'Đang tải dữ liệu...', 
    size = 'md',
    className = ''
}) => {
    
    const sizeMap = {
        xs: 'text-xl',
        sm: 'text-2xl',
        md: 'text-4xl',
        lg: 'text-5xl',
        xl: 'text-7xl'
    };

    const spinnerSize = sizeMap[size] || sizeMap.md;

    const content = (
        <div className={`flex flex-col items-center justify-center gap-4 ${className} animate-fade-in`}>
            <div className="relative">
                {/* Background pulse effect */}
                <div className={`absolute inset-0 bg-primary/20 rounded-full animate-ping scale-150 opacity-0`}></div>
                
                {/* Main Spinner */}
                <Icon 
                    icon="solar:spinner-linear" 
                    className={`animate-spin text-primary ${spinnerSize} relative z-10`} 
                />
            </div>
            
            {text && (
                <p className="text-text-muted font-bold text-sm tracking-wide animate-pulse uppercase">
                    {text}
                </p>
            )}
        </div>
    );

    if (fullPage) {
        return (
            <div className="fixed inset-0 z-[9999] bg-surface/80 backdrop-blur-md flex items-center justify-center p-6">
                {content}
            </div>
        );
    }

    if (overlay) {
        return (
            <div className="absolute inset-0 z-10 bg-surface/60 backdrop-blur-[2px] flex items-center justify-center p-4 rounded-inherit">
                {content}
            </div>
        );
    }

    return content;
};

export default Loading;
