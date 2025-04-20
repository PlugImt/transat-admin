import {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FiRefreshCw} from 'react-icons/fi';
import {GiClothes, GiWashingMachine} from 'react-icons/gi';
import confetti from 'canvas-confetti';

import type {Route} from "../+types/root";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Container,
  Grid,
  LaundryMachine,
  Section,
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
const colors = {
    background: "#0D0505",
    foreground: "#ffe6cc",
    card: "#181010",
    primary: "#ec7f32",
    secondary: "#0049a8",
    muted: "#494949",
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
    const [error, setError] = useState('');
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const countdownInterval = useRef<NodeJS.Timeout | null>(null);
    const [showConfetti, setShowConfetti] = useState<number | null>(null);
    const [finishedMachines, setFinishedMachines] = useState<number[]>([]);
    const machineRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
    const [activeTab, setActiveTab] = useState<'all' | 'washers' | 'dryers'>('all');

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
                colors: [colors.primary, colors.secondary, colors.foreground],
            });
        }

        setTimeout(() => setShowConfetti(null), 3000);
    };

    const fetchLaundryData = async () => {
        setLoading(true);
        setError('');

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

    // Get machine status
    const getMachineStatus = (machine: Machine): 'available' | 'in-use' | 'maintenance' | 'reserved' => {
        if (machine.available) return 'available';
        if (machine.time_left <= 0) return 'maintenance';
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
                maintenance: washers.filter(m => !m.available && m.time_left <= 0).length,
            },
            dryers: {
                total: dryers.length,
                available: dryers.filter(m => m.available).length,
                inUse: dryers.filter(m => !m.available && m.time_left > 0).length,
                maintenance: dryers.filter(m => !m.available && m.time_left <= 0).length,
            }
        };
    };

    const stats = getStatistics();

    // Fix the ref callbacks by properly handling type
    const setMachineRef = (machineNumber: number) => (el: HTMLDivElement | null) => {
        machineRefs.current[machineNumber] = el;
    };

    return (
        <Container>
            <Section
                title="Laundry Status"
                subtitle="Real-time status of washing machines and dryers"
                spacing="lg"
            >
                {/* Header image */}
                <div className="flex justify-center mb-6">
                    <GiWashingMachine className="text-primary w-16 h-16"/>
                </div>

                {/* Last updated and refresh button */}
                <Card className="mb-6">
                    <CardContent>
                        <Stack direction="horizontal" justify="between" align="center">
                            <Text color="muted" size="sm">
                                Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : '-'}
                            </Text>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={fetchLaundryData}
                                isLoading={loading}
                                leftIcon={<FiRefreshCw className={loading ? '' : 'animate-spin'}/>}
                            >
                                Refresh
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>

                {/* Error state */}
                {error && (
                    <Card className="mb-6 bg-error/20">
                        <CardHeader>
                            <CardTitle>Error</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Text color="error">{error}</Text>
                        </CardContent>
                    </Card>
                )}

                {/* Loading state */}
                {loading && !localData && (
                    <Card className="py-16">
                        <CardContent className="flex flex-col items-center justify-center">
                            <Spinner size="lg" color="primary" className="mb-4"/>
                            <Text>Loading laundry status...</Text>
                        </CardContent>
                    </Card>
                )}

                {/* Stats cards */}
                {stats && (
                    <Grid cols={{sm: 1, md: 2}} gap="md" className="mb-6">
                        {/* Washers stats */}
                        <Card bordered elevated>
                            <CardHeader>
                                <Stack direction="horizontal" align="center">
                                    <GiWashingMachine className="text-primary mr-2"/>
                                    <CardTitle>Washing Machines</CardTitle>
                                </Stack>
                            </CardHeader>
                            <CardContent>
                                <Grid cols={2} gap="sm">
                                    <div>
                                        <Text size="sm" color="muted" className="mb-1">Available</Text>
                                        <Text size="xl" weight="bold"
                                              color={stats.washers.available > 0 ? 'success' : 'muted'}>
                                            {stats.washers.available} / {stats.washers.total}
                                        </Text>
                                    </div>
                                    <div>
                                        <Text size="sm" color="muted" className="mb-1">In Use</Text>
                                        <Text size="xl" weight="bold">{stats.washers.inUse}</Text>
                                    </div>
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* Dryers stats */}
                        <Card bordered elevated>
                            <CardHeader>
                                <Stack direction="horizontal" align="center">
                                    <GiClothes className="text-primary mr-2"/>
                                    <CardTitle>Dryers</CardTitle>
                                </Stack>
                            </CardHeader>
                            <CardContent>
                                <Grid cols={2} gap="sm">
                                    <div>
                                        <Text size="sm" color="muted" className="mb-1">Available</Text>
                                        <Text size="xl" weight="bold"
                                              color={stats.dryers.available > 0 ? 'success' : 'muted'}>
                                            {stats.dryers.available} / {stats.dryers.total}
                                        </Text>
                                    </div>
                                    <div>
                                        <Text size="sm" color="muted" className="mb-1">In Use</Text>
                                        <Text size="xl" weight="bold">{stats.dryers.inUse}</Text>
                                    </div>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                )}

                {/* Machine type tabs */}
                <div className="mb-6">
                    <Stack direction="horizontal" spacing="sm" justify="center">
                        <Button
                            variant={activeTab === 'all' ? 'primary' : 'outline'}
                            onClick={() => setActiveTab('all')}
                        >
                            All Machines
                        </Button>
                        <Button
                            variant={activeTab === 'washers' ? 'primary' : 'outline'}
                            onClick={() => setActiveTab('washers')}
                            leftIcon={<GiWashingMachine/>}
                        >
                            Washers
                        </Button>
                        <Button
                            variant={activeTab === 'dryers' ? 'primary' : 'outline'}
                            onClick={() => setActiveTab('dryers')}
                            leftIcon={<GiClothes/>}
                        >
                            Dryers
                        </Button>
                    </Stack>
                </div>

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

                {/* Notes/disclaimer */}
                <Card className="mt-8">
                    <CardContent>
                        <Stack spacing="md">
                            <Text weight="bold">Notes:</Text>
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
                        </Stack>
                    </CardContent>
                </Card>
            </Section>
        </Container>
    );
} 