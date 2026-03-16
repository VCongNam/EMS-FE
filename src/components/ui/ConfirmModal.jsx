import React from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import Button from './Button';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Xác nhận', cancelText = 'Hủy', type = 'danger' }) => {
    if (!isOpen) return null;

    const iconConfig = {
        danger: { 
            icon: 'material-symbols:warning-rounded', 
            color: 'text-red-500', 
            bg: 'bg-red-500/10', 
            btnClass: '!bg-red-500 hover:!bg-red-600 !text-white !border-transparent' 
        },
        warning: { 
            icon: 'material-symbols:info-rounded', 
            color: 'text-yellow-500', 
            bg: 'bg-yellow-500/10', 
            btnClass: '!bg-yellow-500 hover:!bg-yellow-600 !text-white !border-transparent' 
        },
        info: { 
            icon: 'material-symbols:help-rounded', 
            color: 'text-blue-500', 
            bg: 'bg-blue-500/10', 
            btnClass: '!bg-blue-500 hover:!bg-blue-600 !text-white !border-transparent' 
        }
    };

    const currentConfig = iconConfig[type] || iconConfig.info;

    return createPortal(
        <>
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] animate-fade-in" 
                onClick={onClose} 
            />
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
                <div className="bg-surface rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in-up pointer-events-auto p-6 text-center border border-border">
                    <div className={`w-16 h-16 rounded-full ${currentConfig.bg} flex items-center justify-center mx-auto mb-4`}>
                        <Icon icon={currentConfig.icon} className={`text-4xl ${currentConfig.color}`} />
                    </div>
                    <h3 className="text-xl !pb-2 font-bold text-text-main mb-2 font-['Outfit']">{title}</h3>
                    <p className="text-sm !p-3 text-text-muted mb-6">{message}</p>
                    <div className="flex gap-3 !p-2">
                        <Button variant="outline" className="flex-1 !py-2 w-full" onClick={onClose}>
                            {cancelText}
                        </Button>
                        <Button className={`flex-1 !py-2 w-full ${currentConfig.btnClass}`} onClick={onConfirm}>
                            {confirmText}
                        </Button>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
};

export default ConfirmModal;
