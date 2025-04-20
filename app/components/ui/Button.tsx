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
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-normal rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary';

    // Size classes
    const sizeClasses = {
        sm: 'text-sm px-3 py-1.5',
        md: 'text-md px-4 py-2',
        lg: 'text-lg px-6 py-3',
    };

    // Variant classes
    const variantClasses = {
        primary: 'bg-primary text-foreground hover:bg-primary-hover focus:ring-primary',
        secondary: 'bg-secondary text-foreground hover:bg-secondary-hover focus:ring-secondary',
        outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-foreground focus:ring-primary',
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