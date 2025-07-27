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
        sm: 'p-4',
        md: 'p-6 w-full',
        lg: 'p-8',
    };

    // Border and shadow classes
    const borderClass = bordered ? 'border border-primary/20 rounded-xl' : 'rounded-xl';
    const shadowClass = elevated ? 'shadow-xl hover:shadow-2xl' : 'shadow-lg hover:shadow-xl';
    const glassClass = 'backdrop-blur-xl bg-white/5 border border-white/10';

    return (
        <div
            className={`${glassClass} ${borderClass} ${shadowClass} transition-all duration-300 hover:transform hover:-translate-y-1 ${className}`}
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
        <div className={`mb-6 ${className}`}>
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
        <h3 className={`text-3xl font-bold text-foreground text-center gradient-text ${className}`}>
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
        <div className={`mt-6 flex items-center ${className}`}>
            {children}
        </div>
    );
};

export default Card; 