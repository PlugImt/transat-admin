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
    const isAvailable = status === 'available';
    const isWasher = type === 'washer';
    
    const typeIcon = isWasher ? '🧼' : '☀️';
    const statusLabel = isAvailable ? 'Available' : 'In Use';
    
    // Colors based on machine type
    const machineColor = isWasher 
        ? 'bg-blue-500/10 border-blue-500 text-blue-500' 
        : 'bg-orange-500/10 border-orange-500 text-orange-500';
    
    const progressColor = isWasher 
        ? 'from-blue-500/5 to-blue-500/20 border-r-blue-500' 
        : 'from-orange-500/5 to-orange-500/20 border-r-orange-500';
    
    // Calculate progress percentage for in-use machines
    const progressPercentage = !isAvailable && timeRemaining > 0 && totalTime > 0
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
                    // List vs grid view
                    isListView 
                        ? 'flex flex-row items-center h-20 mb-3' 
                        : 'flex flex-col h-[220px] backdrop-blur-sm',
                    // Available vs in-use
                    isAvailable
                        ? 'border-l-4 hover:translate-x-1'
                        : 'hover:-translate-y-1',
                    // Machine type specific colors
                    isAvailable && (isWasher ? 'border-l-blue-500' : 'border-l-orange-500'),
                    // Animation
                    animate && 'animate-fadeIn',
                    // Enhanced styles for grid view
                    !isListView && 'shadow-lg rounded-xl border border-zinc-800',
                    !isListView && isWasher && 'bg-gradient-to-br from-blue-950/40 to-zinc-950',
                    !isListView && !isWasher && 'bg-gradient-to-br from-orange-950/40 to-zinc-950',
                    className
                )}
                style={animate ? { animationDelay: `${animationDelay}ms` } : {}}
                bgColor={isListView ? "bg-[#ffffff0a]" : undefined}
            >
                {/* Dynamic progress background for in-use machines */}
                {!isAvailable && (
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <div 
                            ref={progressBarRef}
                            className={cn(
                                "absolute inset-0 h-full transition-all duration-[1000ms] ease-linear",
                                isListView 
                                    ? "bg-gradient-to-r border-r-2" 
                                    : "bg-gradient-to-t border-t-2",
                                isWasher 
                                    ? "from-blue-500/10 to-blue-600/20 border-blue-500" 
                                    : "from-orange-500/10 to-orange-600/20 border-orange-500"
                            )}
                            style={{ 
                                width: isListView ? `${progressPercentage}%` : '100%',
                                height: isListView ? '100%' : `${progressPercentage}%`,
                                bottom: 0,
                                top: isListView ? 0 : 'auto'
                            }}
                        />
                        {/* Pulsing edge */}
                        <div 
                            className={cn(
                                "absolute animate-pulse duration-[2s]",
                                isListView ? "top-0 bottom-0 w-2" : "left-0 right-0 h-2",
                                isWasher ? "bg-blue-500/70" : "bg-orange-500/70"
                            )}
                            style={{ 
                                left: isListView ? `calc(${progressPercentage}% - 2px)` : 0,
                                bottom: !isListView ? `calc(${progressPercentage}% - 2px)` : 'auto',
                                opacity: progressPercentage > 0 ? 0.7 : 0
                            }}
                        />
                    </div>
                )}

                {/* Status badge */}
                <div className={cn(
                    "absolute px-2 py-1 rounded-md text-xs font-semibold z-10",
                    isListView ? "top-2 right-2" : "top-3 right-3",
                    isAvailable 
                        ? isWasher ? "bg-blue-500/20 text-blue-400" : "bg-orange-500/20 text-orange-400"
                        : isWasher ? "bg-blue-500/30 text-blue-300" : "bg-orange-500/30 text-orange-300"
                )}>
                    {statusLabel}
                </div>

                {/* Content */}
                {isListView ? (
                    // List view - Three column layout with fixed widths
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
                ) : (
                    // Grid view layout
                    <div className="relative z-10 flex flex-col p-5 h-full justify-between">
                        <div className="flex items-start mb-4 w-full">
                            {/* Machine icon */}
                            <div className={cn(
                                "flex items-center justify-center text-2xl rounded-full w-12 h-12 mr-3",
                                isWasher ? "bg-blue-500/10 text-blue-400" : "bg-orange-500/10 text-orange-400"
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

                        {/* Time remaining for grid view */}
                        {!isAvailable && timeRemaining !== undefined && (
                            <div className="w-full">
                                <div className="flex justify-between items-center mb-2">
                                    <Text className="text-xs text-zinc-400">
                                        Time Remaining:
                                    </Text>
                                    <Text className="text-xs text-zinc-500">
                                        {Math.round(progressPercentage)}% complete
                                    </Text>
                                </div>
                                
                                <Text
                                    className={cn(
                                        "font-mono text-2xl font-bold tabular-nums tracking-tight mb-2",
                                        isWasher ? "text-blue-400" : "text-orange-400"
                                    )}
                                >
                                    {formatTime(timeRemaining)}
                                </Text>

                                <div className="w-full h-2 bg-zinc-800/60 rounded-full overflow-hidden backdrop-blur-sm">
                                    <div
                                        className={cn(
                                            "h-full rounded-full",
                                            isWasher ? "bg-blue-500" : "bg-orange-500"
                                        )}
                                        style={{ width: `${progressPercentage}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default LaundryMachine;