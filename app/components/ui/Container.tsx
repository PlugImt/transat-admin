import React from 'react';

export interface ContainerProps {
    children: React.ReactNode;
    className?: string;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
    padding?: boolean;
    centered?: boolean;
}

const Container: React.FC<ContainerProps> = ({
                                                 children,
                                                 className = '',
                                                 maxWidth = 'xl',
                                                 padding = true,
                                                 centered = true,
                                             }) => {
    const maxWidthClasses = {
        xs: 'max-w-screen-sm',
        sm: 'max-w-screen-md',
        md: 'max-w-screen-lg',
        lg: 'max-w-screen-xl',
        xl: 'max-w-screen-xl',
        full: 'max-w-full',
    };

    const paddingClasses = padding ? 'px-4' : '';
    const centeredClasses = centered ? 'mx-auto' : '';

    return (
        <div className={`w-full ${maxWidthClasses[maxWidth]} ${paddingClasses} ${centeredClasses} ${className}`}>
            {children}
        </div>
    );
};

export default Container; 