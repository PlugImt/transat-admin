import React from 'react';
import {Badge, Button, Card, CardContent, CardFooter, CardHeader, CardTitle, Text} from '../ui';
import {cn} from '../../lib';

export type MachineStatus = 'available' | 'in-use' | 'maintenance' | 'reserved';
export type MachineType = 'washer' | 'dryer';

export interface LaundryMachineProps {
    id: string | number;
    name: string;
    type: MachineType;
    status: MachineStatus;
    timeRemaining?: number; // in minutes
    onReserve?: (id: string | number) => void;
    className?: string;
    animate?: boolean;
    animationDelay?: number;
}

const LaundryMachine: React.FC<LaundryMachineProps> = ({
                                                           id,
                                                           name,
                                                           type,
                                                           status,
                                                           timeRemaining,
                                                           onReserve,
                                                           className = '',
                                                           animate = false,
                                                           animationDelay = 0,
                                                       }) => {
    const statusConfig = {
        'available': {
            color: 'success',
            label: 'Available',
            icon: '✓',
        },
        'in-use': {
            color: 'warning',
            label: 'In Use',
            icon: '⏱️',
        },
        'maintenance': {
            color: 'error',
            label: 'Maintenance',
            icon: '🔧',
        },
        'reserved': {
            color: 'secondary',
            label: 'Reserved',
            icon: '🔒',
        }
    };

    const typeIcon = type === 'washer' ? '🧼' : '☀️';
    const currentStatus = statusConfig[status];

    // Format remaining time as HH:MM
    const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    // Animation classes
    const animationClass = animate ? 'animate-fadeIn' : '';
    const animationStyle = animate ? {animationDelay: `${animationDelay}ms`} : {};

    return (
        <Card
            className={cn(
                'relative overflow-hidden w-64 transition-all duration-300 ease-in-out',
                animationClass,
                className
            )}
            style={animationStyle}
            bordered
            elevated
        >
            <Badge
                className={cn(
                    'absolute top-0 right-0 m-1 px-2 py-1 text-xs font-semibold',
                )}
                variant={currentStatus.color as any}
            >
                {status}
            </Badge>
            <CardHeader className="flex items-start justify-between">
                <div>
                    <CardTitle className="flex items-center">
                        <span className="mr-2">{typeIcon}</span> {name}
                    </CardTitle>
                    <Text size="sm" color="muted" className="mt-1">
                        ID: {id}
                    </Text>
                </div>
                <Badge variant={currentStatus.color as any}>
                    {currentStatus.icon} {currentStatus.label}
                </Badge>
            </CardHeader>

            <CardContent>
                {timeRemaining !== undefined && status === 'in-use' && (
                    <div className="mb-4">
                        <Text size="sm" color="muted" className="mb-1">Time Remaining</Text>
                        <Text size="xl" weight="bold">{formatTime(timeRemaining)}</Text>
                    </div>
                )}

                <div className="text-sm">
                    <div className="flex justify-between py-1">
                        <Text size="sm">Type:</Text>
                        <Text size="sm" color="muted" className="capitalize">{type}</Text>
                    </div>

                    <div className="flex justify-between py-1 border-t border-primary/10">
                        <Text size="sm">Location:</Text>
                        <Text size="sm" color="muted">Block {id.toString()[0]}</Text>
                    </div>
                </div>
            </CardContent>

            <CardFooter>
                <Button
                    variant={status === 'available' ? 'primary' : 'outline'}
                    fullWidth
                    disabled={status !== 'available' && status !== 'in-use'}
                    onClick={() => onReserve && onReserve(id)}
                >
                    {status === 'available' ? 'Reserve' : status === 'in-use' ? 'Notify When Done' : 'Not Available'}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default LaundryMachine; 