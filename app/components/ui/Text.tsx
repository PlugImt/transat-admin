import React from 'react';

export interface TextProps {
  children: React.ReactNode;
  className?: string;
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'light' | 'normal' | 'medium' | 'bold';
  color?: 'default' | 'muted' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  align?: 'left' | 'center' | 'right';
  truncate?: boolean;
}

const Text: React.FC<TextProps> = ({
  children,
  className = '',
  as: Component = 'p',
  size = 'md',
  weight = 'normal',
  color = 'default',
  align,
  truncate = false,
}) => {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-md',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  };
  
  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    bold: 'font-bold',
  };
  
  const colorClasses = {
    default: 'text-foreground',
    muted: 'text-foreground/70',
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
  };
  
  const alignClasses = align ? `text-${align}` : '';
  const truncateClasses = truncate ? 'truncate' : '';
  
  return (
    <Component
      className={`
        ${sizeClasses[size]}
        ${weightClasses[weight]}
        ${colorClasses[color]}
        ${alignClasses}
        ${truncateClasses}
        ${className}
      `}
    >
      {children}
    </Component>
  );
};

export default Text; 