import React, { useEffect, useRef } from 'react';
import { Badge, Card, CardContent, CardHeader, CardTitle, Text } from '../ui';
import { cn } from '../../lib';

export type MachineStatus = 'available' | 'in-use';
export type MachineType = 'washer' | 'dryer';

export interface LaundryMachineProps {
    id: string | number;
    name: string;
    type: MachineType;
    status: MachineStatus;
    timeRemaining?: number; // in seconds
    totalTime?: number; // in seconds
    onReserve?: (id: string | number) => void;
    className?: string;
    animate?: boolean;
    animationDelay?: number;
    view?: 'list' | 'grid';
    setRef?: (el: HTMLDivElement | null) => void;
}

const LaundryMachine: React.FC<LaundryMachineProps> = ({
                                                           id,
                                                           name,
                                                           type,
                                                           status,
                                                           timeRemaining = 0,
                                                           totalTime = type === 'washer' ? 2400 : 7200, // 40min for washer, 120min max for dryer
                                                           className = '',
                                                           animate = false,
                                                           animationDelay = 0,
                                                           view = 'list',
                                                           setRef,
                                                       }) => {
    const progressBarRef = useRef<HTMLDivElement>(null);
    const isListView = view === 'list';

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
        }
    };

    const typeIcon = type === 'washer' ? '🧼' : '☀️';
    const currentStatus = statusConfig[status];

    // Calculate progress percentage for in-use machines
    const progressPercentage = status === 'in-use' && timeRemaining > 0 && totalTime > 0
        ? Math.max(0, Math.min(100, ((totalTime - timeRemaining) / totalTime) * 100))
        : 0;

    // Format remaining time as HH:MM:SS
    const formatTime = (seconds: number) => {
        if (seconds <= 0) return '00:00';
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Animation styles
    const animationStyle = animate ? {
        animationDelay: `${animationDelay}ms`,
        animationDuration: '0.5s',
    } : {};

    // Update progress bar width smoothly
    useEffect(() => {
        if (progressBarRef.current && status === 'in-use') {
            progressBarRef.current.style.width = `${progressPercentage}%`;
        }
    }, [progressPercentage, status]);

    return (
        <Card
            className={cn(
                'laundry-machine-card',
                status === 'available' ? 'machine-available' : 'machine-in-use',
                isListView ? 'machine-list-view' : 'machine-grid-view',
                animate ? 'animate-fadeIn' : '',
                className
            )}
            style={animationStyle}
        >
            {/* Progress bar background for in-use machines */}
            {status === 'in-use' && (
                <div className="progress-container">
                    <div
                        ref={progressBarRef}
                        className={cn(
                            'machine-progress',
                            type === 'washer' ? 'washer-progress' : 'dryer-progress'
                        )}
                        style={{ width: `${progressPercentage}%` }}
                    />
                    <div
                        className={cn(
                            'progress-indicator',
                            type === 'washer' ? 'washer-progress-indicator' : 'dryer-progress-indicator'
                        )}
                    />
                </div>
            )}

            {/* Status badge */}
            <div className={cn(
                'status-badge',
                status === 'available' ? 'status-available' : 'status-in-use'
            )}>
                {currentStatus.label}
            </div>

            <div className={cn(
                'flex relative z-10',
                isListView ? 'flex-row items-center w-full' : 'flex-col p-4'
            )}>
                {/* Machine icon and info */}
                <div className={cn(
                    'machine-icon',
                    type === 'washer' ? 'text-blue-500' : 'text-orange-500'
                )}>
                    {typeIcon}
                </div>

                <div className="machine-info">
                    <CardTitle className="text-lg mb-1">
                        {name}
                    </CardTitle>
                    <Text size="xs" color="muted">
                        ID: {id}
                    </Text>
                </div>

                {/* Time remaining and progress info */}
                {status === 'in-use' && timeRemaining !== undefined && (
                    <div className={cn(
                        isListView ? 'ml-auto flex items-center' : 'mt-auto pt-3'
                    )}>
                        <div className="flex flex-col items-end">
                            <Text size="sm" color="muted">Time Remaining:</Text>
                            <Text
                                size="lg"
                                weight="bold"
                                className={cn(
                                    'time-remaining',
                                    type === 'washer' ? 'text-blue-500' : 'text-orange-500'
                                )}
                            >
                                {formatTime(timeRemaining)}
                            </Text>

                            {isListView && (
                                <Text size="xs" color="muted" className="mt-1">
                                    {Math.round(progressPercentage)}% complete
                                </Text>
                            )}
                        </div>

                        {!isListView && (
                            <div className="machine-progress-bar mt-2">
                                <div
                                    className={cn(
                                        'machine-progress-fill',
                                        type === 'washer' ? 'washer-progress-indicator' : 'dryer-progress-indicator'
                                    )}
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
};

export default LaundryMachine;