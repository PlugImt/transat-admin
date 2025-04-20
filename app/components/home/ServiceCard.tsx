import React from 'react';
import { Link } from 'react-router';
import { Card, CardContent, Text } from '../ui';

export interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  linkTo: string;
  linkText: string;
  className?: string;
  animate?: boolean;
  animationDelay?: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon,
  linkTo,
  linkText,
  className = '',
  animate = true,
  animationDelay = 0,
}) => {
  return (
    <Card 
      variant="interactive" 
      className={`h-full group ${className}`}
      animate={animate}
      animationDelay={animationDelay}
    >
      <Link to={linkTo} className="block p-1">
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-foreground transition-all">
              {icon}
            </div>
            <Text as="h3" size="xl" weight="bold" className="ml-4">
              {title}
            </Text>
          </div>
          
          <Text color="muted">
            {description}
          </Text>
          
          <div className="mt-6">
            <span className="text-primary inline-flex items-center font-medium">
              {linkText}
              <svg 
                className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M14 5l7 7m0 0l-7 7m7-7H3" 
                />
              </svg>
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ServiceCard; 