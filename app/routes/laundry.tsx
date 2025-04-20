import {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {GiClothes, GiWashingMachine} from 'react-icons/gi';
import confetti from 'canvas-confetti';

import type {Route} from "../+types/root";
import {
    Button,
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    Container,
    Grid,
    LaundryMachine,
    Spinner,
    Stack,
    Text
} from "../components";

// Machine type
interface Machine {
    number: number;
    available: boolean;
    time_left: number;
}

// API response data type
interface LaundryData {
    washing_machine: Machine[];
    dryer: Machine[];
}

// Brand colors
const BRAND_COLORS = {
    primary: "#ec7f32",
    secondary: "#0049a8",
};

export const meta: Route.MetaFunction = () => {
    return [
        {title: "Transat - Laundry"},
        {name: "description", content: "Check the availability of washing machines and dryers"},
    ];
};

export default function Laundry() {
    const {t} = useTranslation();
    const [laundryData, setLaundryData] = useState<LaundryData | null>(null);
    const [localData, setLocalData] = useState<LaundryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const countdownInterval = useRef<NodeJS.Timeout | null>(null);
    const [showConfetti, setShowConfetti] = useState<number | null>(null);
    const [finishedMachines, setFinishedMachines] = useState<number[]>([]);
    const machineRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
    const [activeTab, setActiveTab] = useState<'all' | 'washers' | 'dryers'>('all');
    const [refreshing, setRefreshing] = useState(false);

    const triggerConfetti = (machineNumber: number) => {
        setShowConfetti(machineNumber);

        const element = machineRefs.current[machineNumber];
        if (element) {
            const rect = element.getBoundingClientRect();
            const x = (rect.left + rect.width / 2) / window.innerWidth;
            const y = (rect.top + rect.height / 2) / window.innerHeight;

            confetti({
                particleCount: 100,
                spread: 70,
                origin: {x, y: y - 0.1},
                colors: [BRAND_COLORS.primary, BRAND_COLORS.secondary, "#ffe6cc"],
            });
        }

        setTimeout(() => setShowConfetti(null), 3000);
    };

    const fetchLaundryData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('https://transat.destimt.fr/api/washingmachines');

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setLaundryData(data.data);
                setLocalData(JSON.parse(JSON.stringify(data.data))); // Deep copy for local countdown
                setLastUpdated(new Date());
            } else {
                throw new Error('Failed to fetch laundry data');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Refresh data
    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchLaundryData();
        setRefreshing(false);
    };

    // Start countdown timer
    useEffect(() => {
        // Clear existing interval if any
        if (countdownInterval.current) {
            clearInterval(countdownInterval.current);
        }

        if (localData) {
            // Track currently in-use machines to detect when they finish
            const inUseMachines: number[] = [];

            [...localData.washing_machine, ...localData.dryer]
                .filter(m => !m.available && m.time_left > 0)
                .forEach(m => inUseMachines.push(m.number));

            countdownInterval.current = setInterval(() => {
                setLocalData(prevData => {
                    if (!prevData) return null;

                    const newData: LaundryData = JSON.parse(JSON.stringify(prevData));
                    const justFinished: number[] = [];

                    // Update washing machines
                    newData.washing_machine = newData.washing_machine.map(machine => {
                        if (!machine.available && machine.time_left > 0) {
                            const newTimeLeft = machine.time_left - 1;
                            // Check if machine just finished
                            if (newTimeLeft === 0 && !finishedMachines.includes(machine.number)) {
                                justFinished.push(machine.number);
                            }
                            return {...machine, time_left: newTimeLeft};
                        }
                        return machine;
                    });

                    // Update dryers
                    newData.dryer = newData.dryer.map(machine => {
                        if (!machine.available && machine.time_left > 0) {
                            const newTimeLeft = machine.time_left - 1;
                            // Check if machine just finished
                            if (newTimeLeft === 0 && !finishedMachines.includes(machine.number)) {
                                justFinished.push(machine.number);
                            }
                            return {...machine, time_left: newTimeLeft};
                        }
                        return machine;
                    });

                    // Trigger confetti for machines that just finished
                    if (justFinished.length > 0) {
                        // Add to finished machines list
                        setFinishedMachines(prev => [...prev, ...justFinished]);
                        // Trigger confetti for the first one
                        setTimeout(() => triggerConfetti(justFinished[0]), 500);
                    }

                    return newData;
                });
            }, 1000);
        }

        return () => {
            if (countdownInterval.current) {
                clearInterval(countdownInterval.current);
            }
        };
    }, [laundryData, finishedMachines]);

    useEffect(() => {
        fetchLaundryData();

        // Auto-refresh every 5 minutes
        const interval = setInterval(fetchLaundryData, 300000);

        return () => clearInterval(interval);
    }, []);

    // Format time for display
    const formatTimeLeft = (seconds: number) => {
        if (seconds <= 0) return '-';

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }

        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Format date
    const formatDate = (dateString: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        return dateString.toLocaleDateString(undefined, options);
    };

    // Get machine status
    const getMachineStatus = (machine: Machine): 'available' | 'in-use' => {
        if (machine.available) return 'available';
        return 'in-use';
    };

    // Calculate statistics
    const getStatistics = () => {
        if (!localData) return null;

        const washers = localData.washing_machine || [];
        const dryers = localData.dryer || [];

        return {
            washers: {
                total: washers.length,
                available: washers.filter(m => m.available).length,
                inUse: washers.filter(m => !m.available && m.time_left > 0).length,
            },
            dryers: {
                total: dryers.length,
                available: dryers.filter(m => m.available).length,
                inUse: dryers.filter(m => !m.available && m.time_left > 0).length,
            }
        };
    };

    const stats = getStatistics();

    // Fix the ref callbacks by properly handling type
    const setMachineRef = (machineNumber: number) => (el: HTMLDivElement | null) => {
        machineRefs.current[machineNumber] = el;
    };

    return (
        <Container className="max-w-5xl py-8">
            <div className="flex flex-col gap-8 max-w-[800px] mx-auto">
                {/* Error display */}
                {error && (
                    <Card className="border-l-4 border-error animate-fadeIn">
                        <CardHeader className="pb-2">
                            <Stack direction="horizontal" align="center">
                                <div className="mr-2" role="img" aria-label="Error">⚠️</div>
                                <CardTitle>Error</CardTitle>
                            </Stack>
                        </CardHeader>
                        <CardContent>
                            <Text color="error">{error}</Text>
                        </CardContent>
                    </Card>
                )}

                {/* Laundry Status Card */}
                <Card
                    className="bg-zinc-900 animate-fadeIn w-full mx-auto"
                    style={{boxShadow: "0 4px 12px rgba(0,0,0,0.2)"}}
                >
                    <CardHeader className="pb-3">
                        <div className="flex items-center w-full justify-between">
                            <div className="flex-1">
                                <span className="inline-flex items-center justify-center relative">
                                    <div
                                        className="text-2xl relative"
                                        role="img" aria-label="Server status">
                                        🟢
                                    </div>
                                      <span
                                          className="absolute inset-0 rounded-full bg-green-500/20 blur-md animate-pulse"
                                          style={{width: '32px', height: '32px', margin: '-4px', zIndex: -1}}></span>
                                </span>
                            </div>
                            <CardTitle className="text-[#ffe6cc] flex-grow text-center">
                                Laundry <span className="text-[#ec7f32]">Status</span>
                            </CardTitle>
                            <div className="flex-1"></div>
                        </div>
                    </CardHeader>

                    <CardContent className="py-6">
                        <div className="flex flex-row flex-wrap gap-4 justify-center">
                            {stats && (
                                <>
                                    <div className="flex flex-col items-center p-4 flex-1 min-w-[180px]">
                                        <Text size="sm" color="muted" className="mb-2">Available Washers</Text>
                                        <Text size="3xl" weight="bold"
                                              color={stats.washers.available > 0 ? "success" : "error"}
                                              className="text-[#0049a8]">
                                            {stats.washers.available} <span
                                            className="text-sm text-zinc-400">/ {stats.washers.total}</span>
                                        </Text>
                                    </div>

                                    <div className="flex flex-col items-center p-4 flex-1 min-w-[180px]">
                                        <Text size="sm" color="muted" className="mb-2">Available Dryers</Text>
                                        <Text size="3xl" weight="bold"
                                              color={stats.dryers.available > 0 ? "success" : "error"}
                                              className="text-[#0049a8]">
                                            {stats.dryers.available} <span
                                            className="text-sm text-zinc-400">/ {stats.dryers.total}</span>
                                        </Text>
                                    </div>

                                    <div className="flex flex-col items-center p-4 flex-1 min-w-[180px]">
                                        <Text size="sm" color="muted" className="mb-2">Last Updated</Text>
                                        <Text size="xl" weight="bold" className="text-center">
                                            {lastUpdated ? formatDate(lastUpdated) : '-'}
                                        </Text>
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>

                    <CardFooter className="justify-center pt-4 border-t border-zinc-800">
                        <Button
                            variant="primary"
                            onClick={handleRefresh}
                            disabled={refreshing || loading}
                            isLoading={refreshing}
                            className="px-6 bg-[#0049a8] hover:bg-[#0062e1]"
                        >
                            {refreshing ? 'Refreshing...' : 'Refresh Data'}
                        </Button>
                    </CardFooter>
                </Card>

                {/* Loading indicator */}
                {loading && !localData && (
                    <Card className="bg-zinc-900 animate-fadeIn w-full mx-auto">
                        <CardContent className="py-12 flex flex-col items-center justify-center">
                            <Spinner size="lg" color="primary" className="mb-4"/>
                            <Text color="muted">Loading laundry status...</Text>
                        </CardContent>
                    </Card>
                )}

                {/* Machine type tabs */}
                <Card
                    className="bg-zinc-900 animate-fadeIn w-full mx-auto"
                    style={{boxShadow: "0 4px 12px rgba(0,0,0,0.2)"}}
                >
                    <CardHeader className="pb-3">
                        <CardTitle className="text-2xl font-bold">Laundry <span
                            className="text-[#ec7f32]">Machines</span></CardTitle>
                    </CardHeader>
                    <CardContent className="py-4">
                        <Stack direction="horizontal" spacing="sm" justify="center" className="mb-6">
                            <Button
                                variant={activeTab === 'all' ? 'primary' : 'outline'}
                                onClick={() => setActiveTab('all')}
                                className={activeTab === 'all' ? 'bg-[#0049a8] hover:bg-[#0062e1]' : ''}
                            >
                                All Machines
                            </Button>
                            <Button
                                variant={activeTab === 'washers' ? 'primary' : 'outline'}
                                onClick={() => setActiveTab('washers')}
                                leftIcon={<GiWashingMachine/>}
                                className={activeTab === 'washers' ? 'bg-[#0049a8] hover:bg-[#0062e1]' : ''}
                            >
                                Washers
                            </Button>
                            <Button
                                variant={activeTab === 'dryers' ? 'primary' : 'outline'}
                                onClick={() => setActiveTab('dryers')}
                                leftIcon={<GiClothes/>}
                                className={activeTab === 'dryers' ? 'bg-[#0049a8] hover:bg-[#0062e1]' : ''}
                            >
                                Dryers
                            </Button>
                        </Stack>

                        {/* Machines grid */}
                        {localData && (
                            <Grid cols={{sm: 1, md: 2, lg: 3}} gap="md">
                                {/* Washing machines */}
                                {(activeTab === 'all' || activeTab === 'washers') &&
                                    localData.washing_machine.map(machine => (
                                        <div
                                            key={`washer-${machine.number}`}
                                            ref={setMachineRef(machine.number)}
                                        >
                                            <LaundryMachine
                                                id={machine.number}
                                                name={`Washer ${machine.number}`}
                                                type="washer"
                                                status={getMachineStatus(machine)}
                                                timeRemaining={machine.time_left}
                                                animate
                                                animationDelay={machine.number * 100}
                                            />
                                        </div>
                                    ))
                                }

                                {/* Dryers */}
                                {(activeTab === 'all' || activeTab === 'dryers') &&
                                    localData.dryer.map(machine => (
                                        <div
                                            key={`dryer-${machine.number}`}
                                            ref={setMachineRef(machine.number)}
                                        >
                                            <LaundryMachine
                                                id={machine.number}
                                                name={`Dryer ${machine.number}`}
                                                type="dryer"
                                                status={getMachineStatus(machine)}
                                                timeRemaining={machine.time_left}
                                                animate
                                                animationDelay={machine.number * 100}
                                            />
                                        </div>
                                    ))
                                }
                            </Grid>
                        )}
                    </CardContent>
                </Card>

                {/* Notes/disclaimer */}
                <Card
                    className="bg-zinc-900 animate-fadeIn w-full mx-auto"
                    style={{boxShadow: "0 4px 12px rgba(0,0,0,0.2)"}}
                >
                    <CardHeader className="pb-3">
                        <CardTitle>Notes & Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>
                                <Text size="sm">
                                    Time remaining is an estimate and may vary.
                                </Text>
                            </li>
                            <li>
                                <Text size="sm">
                                    Data refreshes automatically every 5 minutes.
                                </Text>
                            </li>
                            <li>
                                <Text size="sm">
                                    Machines showing "Available" may be in use if someone just started a cycle.
                                </Text>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </Container>
    );
} 