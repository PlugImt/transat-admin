import React from 'react';

export interface StackProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'vertical' | 'horizontal';
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
}

const Stack: React.FC<StackProps> = ({
  children,
  className = '',
  direction = 'vertical',
  spacing = 'md',
  align = 'stretch',
  justify = 'start',
  wrap = false,
}) => {
  // Direction classes
  const directionClasses = {
    vertical: 'flex-col',
    horizontal: 'flex-row',
  };

  // Spacing classes
  const spacingClasses = {
    none: 'gap-0',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  // Alignment classes
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  // Justify classes
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };

  // Wrap class
  const wrapClass = wrap ? 'flex-wrap' : '';

  return (
    <div 
      className={`flex ${directionClasses[direction]} ${spacingClasses[spacing]} ${alignClasses[align]} ${justifyClasses[justify]} ${wrapClass} ${className}`}
    >
      {children}
    </div>
  );
};

export default Stack; 