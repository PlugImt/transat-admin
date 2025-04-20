import React from 'react';

export interface CardProps {
    children: React.ReactNode;
    className?: string;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    bordered?: boolean;
    elevated?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    style?: React.CSSProperties;
    bgColor?: string;
}

const Card: React.FC<CardProps> = ({
                                       children,
                                       className = '',
                                       header,
                                       footer,
                                       bordered = false,
                                       elevated = false,
                                       padding = 'md',
                                       style,
                                        bgColor = 'bg-card',
                                   }) => {
    // Padding classes
    const paddingClasses = {
        none: 'p-0',
        sm: 'p-2',
        md: 'p-4',
        lg: 'p-6',
    };

    // Border and shadow classes
    const borderClass = bordered ? 'border border-primary/20 rounded-lg' : 'rounded-lg';
    const shadowClass = elevated ? 'shadow-md' : '';

    return (
        <div
            className={`${bgColor} ${borderClass} ${shadowClass} ${className}`}
            style={style}
        >
            {header && (
                <div className={`border-b border-primary/20 ${paddingClasses[padding]}`}>
                    {header}
                </div>
            )}

            <div className={paddingClasses[padding]}>
                {children}
            </div>

            {footer && (
                <div className={`border-t border-primary/20 ${paddingClasses[padding]}`}>
                    {footer}
                </div>
            )}
        </div>
    );
};

export const CardHeader: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({
          children,
          className = ''
      }) => {
    return (
        <div className={`mb-4 ${className}`}>
            {children}
        </div>
    );
};

export const CardTitle: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({
          children,
          className = ''
      }) => {
    return (
        <h3 className={`text-3xl font-bold text-foreground text-center ${className}`}>
            {children}
        </h3>
    );
};

export const CardDescription: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({
          children,
          className = ''
      }) => {
    return (
        <p className={`text-sm text-foreground/70 ${className}`}>
            {children}
        </p>
    );
};

export const CardContent: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({
          children,
          className = ''
      }) => {
    return (
        <div className={className}>
            {children}
        </div>
    );
};

export const CardFooter: React.FC<{
    children: React.ReactNode;
    className?: string;
}> = ({
          children,
          className = ''
      }) => {
    return (
        <div className={`mt-4 flex items-center ${className}`}>
            {children}
        </div>
    );
};

export default Card; 