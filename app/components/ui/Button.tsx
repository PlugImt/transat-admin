import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
                                           variant = 'primary',
                                           size = 'md',
                                           isLoading = false,
                                           leftIcon,
                                           rightIcon,
                                           fullWidth = false,
                                           className = '',
                                           children,
                                           disabled,
                                           ...props
                                       }) => {
    // Base classes
    const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary relative overflow-hidden';

    // Size classes
    const sizeClasses = {
        sm: 'text-sm px-4 py-2',
        md: 'text-md px-6 py-3',
        lg: 'text-lg px-8 py-4',
    };

    // Variant classes
    const variantClasses = {
        primary: 'bg-gradient-to-r from-primary to-primary-hover text-white hover:from-primary-hover hover:to-primary focus:ring-primary shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
        secondary: 'bg-gradient-to-r from-secondary to-secondary-hover text-white hover:from-secondary-hover hover:to-secondary focus:ring-secondary shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
        outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary hover:shadow-lg transform hover:-translate-y-0.5',
        ghost: 'bg-transparent text-primary hover:bg-primary/10 focus:ring-primary',
        link: 'bg-transparent text-primary underline hover:text-primary-hover p-0 focus:ring-0',
    };

    const fullWidthClass = fullWidth ? 'w-full' : '';
    const disabledClass = disabled || isLoading ? 'opacity-50 cursor-not-allowed' : '';

    return (
        <button
            className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${fullWidthClass} ${disabledClass} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {/* Shimmer effect for primary and secondary buttons */}
            {(variant === 'primary' || variant === 'secondary') && (
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000" />
            )}

            {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg"
                     fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                            strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}

            {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
        </button>
    );
};

export default Button; 