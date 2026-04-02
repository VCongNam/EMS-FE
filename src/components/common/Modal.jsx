import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'md' }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const maxWidthClass = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
    }[maxWidth] || 'max-w-md';

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center !p-0 sm:!p-4">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" 
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`
                relative bg-white w-full ${maxWidthClass} 
                max-h-[95dvh] sm:max-h-[90vh] 
                overflow-hidden flex flex-col 
                rounded-t-[2.5rem] sm:rounded-[2.5rem] 
                shadow-2xl animate-fade-in-up
            `}>
                {/* Header */}
                <div className="flex items-center justify-between !p-6 border-b border-border shrink-0">
                    <h3 className="text-xl font-black text-text-main tracking-tight">{title}</h3>
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-text-muted hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
                    >
                        <Icon icon="material-symbols:close-rounded" className="text-2xl" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
