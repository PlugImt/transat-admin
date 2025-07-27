import React from 'react';
import {Link} from 'react-router';
import {Card, CardContent, Text} from '../ui';

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
            className={`h-full group modern-card ${animate ? 'animate-fadeIn' : ''} ${className}`}
            style={animate ? {animationDelay: `${animationDelay}ms`} : undefined}
        >
            <Link to={linkTo} className="block p-6">
                <CardContent>
                    <div className="flex items-center mb-6">
                        <div
                            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary group-hover:from-primary/30 group-hover:to-secondary/30 group-hover:scale-110 transition-all duration-300 backdrop-blur-sm">
                            {icon}
                        </div>
                        <Text as="h3" size="xl" weight="bold" className="ml-4 gradient-text">
                            {title}
                        </Text>
                    </div>

                    <Text color="muted" className="leading-relaxed">
                        {description}
                    </Text>

                    <div className="mt-8">
                        <span className="text-primary inline-flex items-center font-semibold group-hover:text-secondary transition-colors duration-300">
                            {linkText}
                            <svg
                                className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300"
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