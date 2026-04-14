import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify/react';
import Button from './Button';

const PromptModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Xác nhận', cancelText = 'Hủy', defaultValue = '', placeholder = '', icon = 'solar:pen-bold-duotone', iconColor = 'text-primary', iconBg = 'bg-primary/10' }) => {
    const [inputValue, setInputValue] = useState(defaultValue);

    useEffect(() => {
        if (isOpen) {
            setInputValue(defaultValue);
        }
    }, [isOpen, defaultValue]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        onConfirm(inputValue);
    };

    return createPortal(
        <>
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] animate-fade-in" 
                onClick={onClose} 
            />
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
                <div className="bg-surface rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in-up pointer-events-auto p-6 border border-border">
                    <div className={`w-16 h-16 rounded-full ${iconBg} flex items-center justify-center mx-auto mb-4`}>
                        <Icon icon={icon} className={`text-4xl ${iconColor}`} />
                    </div>
                    <h3 className="text-xl font-bold text-text-main mb-2 text-center font-['Outfit']">{title}</h3>
                    <p className="text-sm text-text-muted mb-6 text-center">{message}</p>
                    
                    <div className="mb-6">
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-background border border-border rounded-xl text-text-main font-medium focus:outline-none focus:border-primary text-center transition-all bg-white"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={placeholder}
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSubmit();
                            }}
                        />
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1 !py-2 w-full" onClick={onClose}>
                            {cancelText}
                        </Button>
                        <Button className="flex-1 !py-2 w-full !bg-primary hover:!bg-primary-hover !text-white !border-transparent" onClick={handleSubmit}>
                            {confirmText}
                        </Button>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
};

export default PromptModal;
