import React from 'react';

export interface GridProps {
    children: React.ReactNode;
    className?: string;
    cols?: number | { sm?: number; md?: number; lg?: number; xl?: number };
    gap?: 'none' | 'sm' | 'md' | 'lg';
}

const Grid: React.FC<GridProps> = ({
                                       children,
                                       className = '',
                                       cols = 1,
                                       gap = 'md',
                                   }) => {
    // Gap classes
    const gapClasses = {
        none: 'gap-0',
        sm: 'gap-2',
        md: 'gap-4',
        lg: 'gap-8',
    };

    // Handle different types of column props
    let colClasses = '';

    if (typeof cols === 'number') {
        colClasses = `grid-cols-1 sm:grid-cols-${Math.min(cols, 12)}`;
    } else {
        const {sm = 1, md, lg, xl} = cols;
        colClasses = `grid-cols-1 sm:grid-cols-${Math.min(sm, 12)}`;

        if (md) colClasses += ` md:grid-cols-${Math.min(md, 12)}`;
        if (lg) colClasses += ` lg:grid-cols-${Math.min(lg, 12)}`;
        if (xl) colClasses += ` xl:grid-cols-${Math.min(xl, 12)}`;
    }

    return (
        <div className={`grid ${colClasses} ${gapClasses[gap]} ${className}`}>
            {children}
        </div>
    );
};

export default Grid; 