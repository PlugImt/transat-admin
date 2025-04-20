import React from 'react';
import {Badge, Card, CardContent, CardFooter, CardHeader, CardTitle, Text} from '../ui';

export interface MealCardProps {
    title: string;
    description: string;
    image?: string;
    price?: string | number;
    calories?: number;
    tags?: string[];
    className?: string;
    animate?: boolean;
    animationDelay?: number;
}

const MealCard: React.FC<MealCardProps> = ({
                                               title,
                                               description,
                                               image,
                                               price,
                                               calories,
                                               tags = [],
                                               className = '',
                                               animate = true,
                                               animationDelay = 0,
                                           }) => {
    return (
        <Card
            variant="interactive"
            className={`overflow-hidden h-full ${className}`}
            animate={animate}
            animationDelay={animationDelay}
        >
            {image && (
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-slow hover:scale-105"
                    />
                </div>
            )}

            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle>{title}</CardTitle>
                    {price && (
                        <Text as="span" size="lg" weight="bold" color="primary">
                            {typeof price === 'number' ? `€${price.toFixed(2)}` : price}
                        </Text>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                <Text color="muted">
                    {description}
                </Text>

                {calories && (
                    <Text size="sm" className="mt-2">
                        <span className="text-muted">Calories:</span> {calories}
                    </Text>
                )}
            </CardContent>

            {tags.length > 0 && (
                <CardFooter className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                        <Badge key={index} variant="primary" size="sm">
                            {tag}
                        </Badge>
                    ))}
                </CardFooter>
            )}
        </Card>
    );
};

export default MealCard; 