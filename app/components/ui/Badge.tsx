import React from 'react';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
    children: React.ReactNode;
    className?: string;
    variant?: BadgeVariant;
    size?: BadgeSize;
    rounded?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
                                         children,
                                         className = '',
                                         variant = 'default',
                                         size = 'md',
                                         rounded = false,
                                     }) => {
    const variantClasses = {
        default: 'bg-muted text-foreground',
        primary: 'bg-primary/20 text-primary',
        secondary: 'bg-secondary/20 text-secondary',
        success: 'bg-success/20 text-success',
        warning: 'bg-warning/20 text-warning',
        error: 'bg-error/20 text-error',
    };

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-sm',
        lg: 'px-3 py-1 text-md',
    };

    const roundedClass = rounded ? 'rounded-full' : 'rounded-md';

    return (
        <span
            className={`
        inline-flex items-center font-medium
        ${roundedClass}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
        >
      {children}
    </span>
    );
};

export default Badge; 