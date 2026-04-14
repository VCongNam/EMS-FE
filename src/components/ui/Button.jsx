import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 gap-2 border border-transparent active:translate-y-0 hover:-translate-y-0.5';

    const variants = {
        primary: '!bg-primary !text-white shadow-[0_4px_14px_0_rgba(53,88,114,0.39)] hover:brightness-110 active:brightness-90',
        '!primary': '!bg-primary !text-white shadow-[0_4px_14px_0_rgba(53,88,114,0.39)] hover:brightness-110 active:brightness-90',
        secondary: '!bg-secondary !text-white hover:brightness-110 shadow-[0_4px_14px_0_rgba(122,170,206,0.2)]',
        outline: '!bg-transparent !border-primary !text-primary hover:!bg-primary/10',
        ghost: '!bg-transparent !text-text-muted hover:!bg-primary/10 hover:!text-primary',
    };

    const sizes = {
        sm: '!px-4 !py-2 !text-sm',
        md: '!px-6 !py-3 !text-base',
        lg: '!px-8 !py-4 !text-lg',
    };

    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
};

export default Button;

