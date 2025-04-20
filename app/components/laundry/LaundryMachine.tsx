import React, { useEffect, useRef } from 'react';
import { Card, CardTitle, Text } from '../ui';
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
    view?: 'list' | 'grid'; // Keeping for backward compatibility but will be ignored
    setRef?: (el: HTMLDivElement | null) => void;
}

const LaundryMachine: React.FC<LaundryMachineProps> = ({
    id,
    name,
    type,
    status,
    timeRemaining = 0,
    totalTime,
    className = '',
    animate = false,
    animationDelay = 0,
    view = 'list', // Ignored as we're always using list view
    setRef,
}) => {
    const progressBarRef = useRef<HTMLDivElement>(null);
    const isAvailable = status === 'available';
    const isWasher = type === 'washer';
    
    const typeIcon = isWasher ? '🧼' : '☀️';
    const statusLabel = isAvailable ? 'Available' : 'In Use';
    
    // Single cycle duration in seconds
    const WASHER_CYCLE_DURATION = 2400; // 40min for washer
    const DRYER_CYCLE_DURATION = 2400;  // 40min for dryer
    
    // Calculate total time based on machine type and time remaining
    // For dryers, if time remaining is more than one cycle, assume it's two cycles
    const calculatedTotalTime = totalTime || (isWasher ? 
        WASHER_CYCLE_DURATION : 
        (timeRemaining > DRYER_CYCLE_DURATION ? DRYER_CYCLE_DURATION * 2 : DRYER_CYCLE_DURATION)
    );
    
    // Calculate progress percentage for in-use machines
    const progressPercentage = !isAvailable && timeRemaining > 0 && calculatedTotalTime > 0
        ? Math.max(0, Math.min(100, ((calculatedTotalTime - timeRemaining) / calculatedTotalTime) * 100))
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

    // Update progress bar width smoothly
    useEffect(() => {
        if (progressBarRef.current && !isAvailable) {
            progressBarRef.current.style.width = `${progressPercentage}%`;
        }
    }, [progressPercentage, isAvailable]);

    return (
        <div ref={setRef}>
            <Card
                className={cn(
                    // Base card styles
                    'relative overflow-hidden transition-all duration-300',
                    // List view style
                    'flex flex-row items-center h-20 mb-3',
                    // Available vs in-use
                    isAvailable
                        ? 'border-l-4 hover:translate-x-1'
                        : 'hover:-translate-y-1',
                    // Machine type specific colors
                    isAvailable && (isWasher ? 'border-l-blue-500' : 'border-l-orange-500'),
                    // Animation
                    animate && 'animate-fadeIn',
                    className
                )}
                style={animate ? { animationDelay: `${animationDelay}ms` } : {}}
                bgColor="bg-[#ffffff0a]"
            >
                {/* Dynamic progress background for in-use machines */}
                {!isAvailable && (
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <div 
                            ref={progressBarRef}
                            className={cn(
                                "absolute inset-0 h-full transition-all duration-[1000ms] ease-linear",
                                "bg-gradient-to-r border-r-2",
                                isWasher 
                                    ? "from-blue-500/10 to-blue-600/20 border-blue-500" 
                                    : "from-orange-500/10 to-orange-600/20 border-orange-500"
                            )}
                            style={{ 
                                width: `${progressPercentage}%`,
                                height: '100%',
                                top: 0
                            }}
                        />
                        {/* Pulsing edge */}
                        <div 
                            className={cn(
                                "absolute animate-pulse duration-[2s] top-0 bottom-0 w-2",
                                isWasher ? "bg-blue-500/70" : "bg-orange-500/70"
                            )}
                            style={{ 
                                left: `calc(${progressPercentage}% - 2px)`,
                                opacity: progressPercentage > 0 ? 0.7 : 0
                            }}
                        />
                    </div>
                )}

                {/* Status badge */}
                <div className={cn(
                    "absolute px-2 py-1 rounded-md text-xs font-semibold z-10 top-2 right-2",
                    isAvailable 
                        ? isWasher ? "bg-blue-500/20 text-blue-400" : "bg-orange-500/20 text-orange-400"
                        : isWasher ? "bg-blue-500/30 text-blue-300" : "bg-orange-500/30 text-orange-300"
                )}>
                    {statusLabel}
                </div>

                {/* List view layout - Three column design */}
                <div className="relative z-10 flex w-full items-center px-4">
                    {/* 1. Left column - Machine icon and info */}
                    <div className="flex items-center w-1/3">
                        <div className={cn(
                            "flex items-center justify-center text-xl rounded-full w-12 h-12 mr-4 flex-shrink-0",
                            isWasher ? "bg-blue-500/10" : "bg-orange-500/10"
                        )}>
                            {typeIcon}
                        </div>

                        <div>
                            <CardTitle className="text-base font-bold mb-0.5 text-white">
                                {name}
                            </CardTitle>
                            <Text className="text-xs text-zinc-400">
                                ID: {id}
                            </Text>
                        </div>
                    </div>
                    
                    {/* 2. Center column - Time left */}
                    <div className="flex justify-center items-center w-1/3">
                        {!isAvailable && timeRemaining !== undefined && (
                            <div className="flex flex-col items-center">
                                <Text className="text-xs text-zinc-400 mb-0.5">
                                    Time Left:
                                </Text>
                                <Text
                                    className={cn(
                                        "font-mono text-xl font-bold tabular-nums tracking-tight",
                                        isWasher ? "text-blue-400" : "text-orange-400"
                                    )}
                                >
                                    {formatTime(timeRemaining)}
                                </Text>
                            </div>
                        )}
                    </div>
                    
                    {/* 3. Right column - Empty space */}
                    <div className="w-1/3"></div>
                </div>
            </Card>
        </div>
    );
};

export default LaundryMachine;