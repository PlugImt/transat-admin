import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Text } from '../ui';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: number;
  changeLabel?: string;
  className?: string;
  animate?: boolean;
  animationDelay?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  changeLabel,
  className = '',
  animate = true,
  animationDelay = 0,
}) => {
  const isPositiveChange = change && change > 0;
  const isNegativeChange = change && change < 0;
  
  const changeColorClass = isPositiveChange 
    ? 'text-success' 
    : isNegativeChange 
      ? 'text-error' 
      : 'text-muted';
  
  const changeSymbol = isPositiveChange 
    ? '↑' 
    : isNegativeChange 
      ? '↓' 
      : '';
  
  return (
    <Card 
      variant="default" 
      className={`h-full ${className}`} 
      animate={animate} 
      animationDelay={animationDelay}
    >
      <CardHeader className="flex items-start justify-between">
        <CardTitle>{title}</CardTitle>
        {icon && <div className="text-primary">{icon}</div>}
      </CardHeader>
      
      <CardContent>
        <Text as="div" size="3xl" weight="bold" className="mb-2">
          {value}
        </Text>
        
        {(change !== undefined || changeLabel) && (
          <div className="flex items-center">
            {change !== undefined && (
              <span className={`mr-1 ${changeColorClass}`}>
                {changeSymbol} {Math.abs(change)}%
              </span>
            )}
            
            {changeLabel && (
              <Text size="sm" color="muted">
                {changeLabel}
              </Text>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard; 