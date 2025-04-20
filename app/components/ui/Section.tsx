import React from 'react';
import Container from './Container';
import Text from './Text';

export interface SectionProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
    id?: string;
    containerSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
    spacing?: 'sm' | 'md' | 'lg' | 'xl';
}

const Section: React.FC<SectionProps> = ({
                                             children,
                                             className = '',
                                             title,
                                             subtitle,
                                             id,
                                             containerSize = 'xl',
                                             spacing = 'lg',
                                         }) => {
    const spacingClasses = {
        sm: 'py-4',
        md: 'py-8',
        lg: 'py-12',
        xl: 'py-16',
    };

    return (
        <section id={id} className={`${spacingClasses[spacing]} ${className}`}>
            <Container maxWidth={containerSize}>
                {(title || subtitle) && (
                    <div className="mb-8 text-center">
                        {title && (
                            <Text as="h2" size="3xl" weight="bold" className="mb-2">
                                {title}
                            </Text>
                        )}
                        {subtitle && (
                            <Text size="lg" color="muted" className="max-w-3xl mx-auto">
                                {subtitle}
                            </Text>
                        )}
                    </div>
                )}
                {children}
            </Container>
        </section>
    );
};

export default Section; 