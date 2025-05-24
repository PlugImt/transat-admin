import React from 'react';
import {Button, Container, Text} from './ui';

export interface HeroProps {
    title: string;
    subtitle?: string;
    bgImage?: string;
    ctaText?: string;
    ctaLink?: string;
    ctaSecondaryText?: string;
    ctaSecondaryLink?: string;
    className?: string;
    overlayOpacity?: number;
}

const Hero: React.FC<HeroProps> = ({
                                       title,
                                       subtitle,
                                       bgImage,
                                       ctaText,
                                       ctaLink = '#',
                                       ctaSecondaryText,
                                       ctaSecondaryLink = '#',
                                       className = '',
                                       overlayOpacity = 0.6,
                                   }) => {
    // Style for the background image
    const bgStyle = bgImage
        ? {backgroundImage: `url(${bgImage})`}
        : undefined;

    // Calculate overlay opacity style
    const overlayStyle = {
        backgroundColor: `rgba(7, 4, 2, ${overlayOpacity})`
    };

    return (
        <div
            className={`relative py-20 min-h-[30vh] flex items-center bg-cover bg-center bg-no-repeat ${className}`}
            style={bgStyle}
        >
            {/* Background overlay */}
            {bgImage && (
                <div
                    className="absolute inset-0 z-0"
                    style={overlayStyle}
                ></div>
            )}

            {/* Content */}
            <Container className="relative z-10">
                <div className="text-center max-w-4xl mx-auto">
                    <div className="animate-fadeIn" style={{animationDelay: '200ms'}}>
                        <Text
                            as="h1"
                            size="3xl"
                            weight="bold"
                            className="mb-4"
                        >
                            {title}
                        </Text>
                    </div>

                    {subtitle && (
                        <div className="animate-fadeIn" style={{animationDelay: '400ms'}}>
                            <Text
                                size="xl"
                                color="muted"
                                className="mb-8 max-w-2xl mx-auto"
                            >
                                {subtitle}
                            </Text>
                        </div>
                    )}

                    {(ctaText || ctaSecondaryText) && (
                        <div
                            className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-fadeIn"
                            style={{animationDelay: '600ms'}}
                        >
                            {ctaText && (
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="bg-orange-400 hover:bg-orange-900 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition-colors"
                                    onClick={() => {
                                        if (ctaLink.startsWith('#')) {
                                            const element = document.querySelector(ctaLink);
                                            element?.scrollIntoView({behavior: 'smooth'});
                                        } else {
                                            window.location.href = ctaLink;
                                        }
                                    }}
                                >
                                    {ctaText}
                                </Button>
                            )}

                            {ctaSecondaryText && (
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => {
                                        if (ctaSecondaryLink.startsWith('#')) {
                                            const element = document.querySelector(ctaSecondaryLink);
                                            element?.scrollIntoView({behavior: 'smooth'});
                                        } else {
                                            window.location.href = ctaSecondaryLink;
                                        }
                                    }}
                                >
                                    {ctaSecondaryText}
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
};

export default Hero; 