import {useEffect, useState} from "react";
import type {Route} from "../+types/root";
import {
    Button,
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    Container,
    Spinner,
    Stack,
    Text
} from "../components";

// Types for the statistics data
interface EndpointStatistic {
    endpoint: string;
    method: string;
    request_count: number;
    avg_duration_ms: number;
    min_duration_ms: number;
    max_duration_ms: number;
    success_rate_percent: number;
    first_request: string;
    last_request: string;
    success_count: number;
    error_count: number;
}

interface GlobalStatistic {
    total_request_count: number;
    global_avg_duration_ms: number;
    global_min_duration_ms: number;
    global_max_duration_ms: number;
    global_success_rate_percent: number;
    first_request: string;
    last_request: string;
    success_count: number;
    error_count: number;
}

interface ServerStatus {
    status: "online" | "offline";
    latency: number;
    timestamp: string;
}

// Define API base URL
const API_BASE_URL = "https://transat.destimt.fr";

// Brand colors
const BRAND_COLORS = {
    primary: "#ec7f32",
    secondary: "#0049a8",
};

export const meta: Route.MetaFunction = () => {
    return [
        {title: "Statistics - Transat"},
        {name: "description", content: "View statistics for Transat services"},
    ];
};

export default function Statistics() {
    const [initialLoadTime] = useState(new Date().toISOString());
    const [globalStats, setGlobalStats] = useState<GlobalStatistic | null>(null);
    const [endpointStats, setEndpointStats] = useState<EndpointStatistic[]>([]);
    const [serverStatus, setServerStatus] = useState<ServerStatus>({
        status: "offline",
        latency: 0,
        timestamp: new Date().toISOString(),
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [statsLastLoaded, setStatsLastLoaded] = useState<string>(new Date().toISOString());

    // Function to fetch server status
    const checkServerStatus = async () => {
        const startTime = Date.now();
        try {
            const response = await fetch(`${API_BASE_URL}/status`, {
                method: "GET",
                mode: "cors",
                headers: {
                    "Accept": "application/json"
                }
            });
            const endTime = Date.now();
            const latency = endTime - startTime;

            setServerStatus({
                status: response.ok ? "online" : "offline",
                latency,
                timestamp: new Date().toISOString(),
            });

            return response.ok;
        } catch (err) {
            setServerStatus({
                status: "offline",
                latency: 0,
                timestamp: new Date().toISOString(),
            });
            return false;
        }
    };

    // Function to fetch statistics
    const fetchStatistics = async () => {
        setLoading(prev => prev === true);
        setError(null);

        try {
            // Check server status first
            const isServerOnline = await checkServerStatus();

            if (!isServerOnline) {
                setLoading(false);
                setError("Server is offline. Cannot fetch statistics.");
                return;
            }

            // Fetch global statistics
            const globalResponse = await fetch(`${API_BASE_URL}/api/statistics/global`, {
                method: "GET",
                mode: "cors",
                headers: {
                    "Accept": "application/json"
                }
            });

            if (!globalResponse.ok) {
                throw new Error(`Failed to fetch global statistics: ${globalResponse.status}`);
            }

            const globalData = await globalResponse.json();
            setGlobalStats(globalData.statistics);

            // Fetch endpoint statistics
            const endpointResponse = await fetch(`${API_BASE_URL}/api/statistics/endpoints`, {
                method: "GET",
                mode: "cors",
                headers: {
                    "Accept": "application/json"
                }
            });

            if (!endpointResponse.ok) {
                throw new Error(`Failed to fetch endpoint statistics: ${endpointResponse.status}`);
            }

            const endpointData = await endpointResponse.json();
            setEndpointStats(endpointData.statistics);

            setStatsLastLoaded(new Date().toISOString());
            setLoading(false);
        } catch (err) {
            setLoading(false);
            setError(`Failed to fetch statistics: ${err instanceof Error ? err.message : String(err)}`);
        }
    };

    // Refresh data
    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchStatistics();
        setRefreshing(false);
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchStatistics();

        // Set up periodic refresh intervals
        const statsRefreshInterval = setInterval(() => {
            fetchStatistics();
        }, 5000); // Refresh stats every 5 seconds

        // Set up periodic status checks
        const statusCheckInterval = setInterval(() => {
            checkServerStatus();
        }, 5000); // Check every 5 seconds

        return () => {
            clearInterval(statsRefreshInterval);
            clearInterval(statusCheckInterval);
        };
    }, []);

    // Format date
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <Container className="max-w-5xl py-8">
            <div className="flex flex-col gap-8">
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

                {/* Server Status Card */}
                <Card
                    className="bg-zinc-900  animate-fadeIn max-w-[1000px] mx-auto"
                    style={{boxShadow: "0 4px 12px rgba(0,0,0,0.2)"}}
                >
                    <CardHeader className="pb-3">
                        <div className="flex items-center w-full justify-between">
                            <div className="flex-1">
            <span className="inline-flex items-center justify-center relative">
                <div
                    className="text-2xl relative"
                    role="img" aria-label="Server status">
                    {serverStatus.status === "online" ? "🟢" : "🔴"}
                </div>
                {serverStatus.status === "online" && (
                    <span className="absolute inset-0 rounded-full bg-green-500/20 blur-md animate-pulse"
                          style={{width: '32px', height: '32px', margin: '-4px', zIndex: -1}}></span>
                )}
            </span>
                            </div>
                            <CardTitle className="text-[#ffe6cc] flex-grow text-center">
                                Server <span className="text-[#ec7f32]">Status</span>
                            </CardTitle>
                            <div className="flex-1"></div>
                        </div>
                    </CardHeader>
                    <CardContent className="py-6">
                        <div className="flex flex-row flex-wrap gap-4 justify-center">
                            <div className="flex flex-col items-center p-4 flex-1 min-w-[180px]">
                                <Text size="sm" color="muted" className="mb-2">Status</Text>
                                <Text size="3xl" weight="bold"
                                      color={serverStatus.status === "online" ? "primary" : "error"}
                                      className="text-[#0049a8]">
                                    {serverStatus.status === "online" ? "Online" : "Offline"}
                                </Text>
                            </div>

                            <div className="flex flex-col items-center p-4 flex-1 min-w-[180px]">
                                <Text size="sm" color="muted" className="mb-2">Latency</Text>
                                <Text size="3xl" weight="bold" color="primary" className="text-[#0049a8]">
                                    {serverStatus.latency}<span className="text-sm text-zinc-400">ms</span>
                                </Text>
                            </div>

                            <div className="flex flex-col items-center p-4 flex-1 min-w-[180px]">
                                <Text size="sm" color="muted" className="mb-2">Last Checked</Text>
                                <Text size="xl" weight="bold" className="text-center">
                                    {formatDate(serverStatus.timestamp)}
                                </Text>
                            </div>
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
                {loading && (
                    <Card className="bg-zinc-900 animate-fadeIn max-w-[1000px] mx-auto">
                        <CardContent className="py-12 flex flex-col items-center justify-center">
                            <Spinner size="lg" color="primary" className="mb-4"/>
                            <Text color="muted">Loading statistics...</Text>
                        </CardContent>
                    </Card>
                )}


                {/* Global Statistics Card */}
                {!loading && globalStats && (
                    <Card
                        className="bg-zinc-900 animate-fadeIn max-w-[1000px] mx-auto"
                        style={{boxShadow: "0 4px 12px rgba(0,0,0,0.2)"}}
                    >
                        <CardHeader className="pb-3">
                            <CardTitle className="text-2xl font-bold">Global <span className="text-[#ec7f32]">Statistics</span></CardTitle>
                        </CardHeader>

                        <CardContent className="py-6">
                            {/* Key metrics row */}
                            <div className="flex flex-row flex-wrap gap-4 justify-center mb-8">
                                <div className="flex flex-col items-center p-4 flex-1 min-w-[180px]">
                                    <Text size="sm" color="muted" className="mb-2">Total Requests</Text>
                                    <Text size="3xl" weight="bold" color="primary" className="text-[#0049a8]">
                                        {globalStats.total_request_count}
                                    </Text>
                                </div>

                                <div className="flex flex-col items-center p-4 flex-1 min-w-[180px]">
                                    <Text size="sm" color="muted" className="mb-2">Success Rate</Text>
                                    <Text size="3xl" weight="bold"
                                          color={globalStats.global_success_rate_percent > 95 ? "success" :
                                              globalStats.global_success_rate_percent > 80 ? "warning" : "error"}>
                                        {globalStats.global_success_rate_percent.toFixed(1)}%
                                    </Text>
                                </div>

                                <div className="flex flex-col items-center p-4 flex-1 min-w-[180px]">
                                    <Text size="sm" color="muted" className="mb-2">Avg Response Time</Text>
                                    <Text size="3xl" weight="bold" color="primary" className="text-[#0049a8]">
                                        {globalStats.global_avg_duration_ms.toFixed(1)}<span
                                        className="text-sm text-zinc-400">ms</span>
                                    </Text>
                                </div>

                                <div className="flex flex-col items-center p-4 flex-1 min-w-[180px]">
                                    <Text size="sm" color="muted" className="mb-2">Max Response Time</Text>
                                    <Text size="3xl" weight="bold"
                                          color={globalStats.global_max_duration_ms < 500 ? "warning" : "error"}>
                                        {globalStats.global_max_duration_ms}<span
                                        className="text-sm text-zinc-400">ms</span>
                                    </Text>
                                </div>
                            </div>

                            {/* Success/Error Count */}
                            <div className="flex flex-row flex-wrap gap-4 justify-center mb-6">
                                <div
                                    className="flex flex-col items-center p-4 bg-zinc-800/30 rounded-lg flex-1 min-w-[250px]">
                                    <Text size="sm" color="muted" className="mb-2">Successful Requests</Text>
                                    <Text size="3xl" weight="bold" color="success">
                                        {globalStats.success_count}
                                    </Text>
                                </div>

                                <div
                                    className="flex flex-col items-center p-4 bg-zinc-800/30 rounded-lg flex-1 min-w-[250px]">
                                    <Text size="sm" color="muted" className="mb-2">Error Requests</Text>
                                    <Text size="3xl" weight="bold" color="error">
                                        {globalStats.error_count}
                                    </Text>
                                </div>
                            </div>

                            {/* First Request */}
                            <div className="flex flex-col items-center mt-6 text-center">
                                <Text size="sm" color="muted" className="mb-2">First Request</Text>
                                <Text size="lg" weight="medium">
                                    {formatDate(globalStats.first_request)}
                                </Text>
                            </div>
                        </CardContent>

                        <CardFooter
                            className="justify-center border-t border-zinc-800 pt-4 text-center text-zinc-500 text-sm">
                            Statistics last loaded: {formatDate(statsLastLoaded)}
                        </CardFooter>
                    </Card>
                )}
            </div>
        </Container>
    );
} 