import { useState, useEffect } from "react";
import type { Route } from "../+types/root";
import { 
  Badge,
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter,
  Container, 
  Grid, 
  Section, 
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

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Statistics - Transat" },
    { name: "description", content: "View statistics for Transat services" },
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
    setLoading(true);
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
    fetchStatistics().then(r => r);
    
    // Set up periodic status checks
    const statusCheckInterval = setInterval(() => {
      checkServerStatus().then(r => r);
    }, 5000); // Check every 5 seconds
    
    return () => {
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
    <Container>
      <Section 
        title="API Statistics" 
        spacing="lg"
      >
       {/* Server Status */}
        <Card
          className="mb-8 stats-card animate-fadeIn"
          elevated
        >
          <CardHeader className="border-b border-primary/20">
            <Stack direction="horizontal" align="center" className="animate-fadeInLeft">
              <div className={`mr-2 ${serverStatus.status === "online" ? "animate-pulseGlow" : ""}`} role="img" aria-label="Server status">
                {serverStatus.status === "online" ? "🟢" : "🔴"}
              </div>
              <CardTitle>Server Status</CardTitle>
              <Badge
                className="ml-auto"
                variant={serverStatus.status === "online" ? "success" : "error"}
              >
                {serverStatus.status === "online" ? "Online" : "Offline"}
              </Badge>
            </Stack>
          </CardHeader>

          <CardContent>
            <Grid cols={{ sm: 1, md: 3 }} gap="md" className="mb-4">
              <div className="text-center p-4 rounded bg-card hover:bg-cardHover transition-all animate-fadeInUp animate-delay-100">
                <Text size="sm" color="muted" className="mb-2">Latency</Text>
                <Text size="xl" weight="bold" color="primary">
                  {serverStatus.latency} <span className="text-foreground text-sm">ms</span>
                </Text>
              </div>

              <div className="text-center p-4 rounded bg-card hover:bg-cardHover transition-all animate-fadeInUp animate-delay-200">
                <Text size="sm" color="muted" className="mb-2">Last Checked</Text>
                <Text size="lg" weight="bold">
                  {formatDate(serverStatus.timestamp)}
                </Text>
              </div>

              <div className="text-center p-4 rounded bg-card hover:bg-cardHover transition-all animate-fadeInUp animate-delay-300">
                <Text size="sm" color="muted" className="mb-2">Initial Load</Text>
                <Text size="lg" weight="bold">
                  {formatDate(initialLoadTime)}
                </Text>
              </div>
            </Grid>
          </CardContent>

          <CardFooter className="justify-center border-t border-primary/20 pt-4">
            <Button
              variant="primary"
              onClick={handleRefresh}
              disabled={refreshing || loading}
              isLoading={refreshing}
              className="px-6 animate-fadeInUp animate-delay-400"
            >
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </Button>
          </CardFooter>
        </Card>

        {/* Error display */}
        {error && (
          <Card className="mb-8 border-l-4 border-error animate-fadeIn">
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

        {/* Loading indicator */}
        {loading && (
          <Card className="mb-8 animate-fadeIn">
            <CardContent className="py-12 flex flex-col items-center justify-center">
              <Spinner size="lg" color="primary" className="mb-4" />
              <Text color="muted">Loading statistics...</Text>
            </CardContent>
          </Card>
        )}

        {/* Global Statistics */}
        {!loading && globalStats && (
          <Card className="mb-8 stats-card animate-fadeIn animate-delay-300">
            <CardHeader className="border-b border-primary/20">
              <Stack direction="horizontal" align="center">
                <div className="mr-2 text-primary" role="img" aria-label="Statistics">📊</div>
                <CardTitle>Global Statistics</CardTitle>
                <Badge
                  className="ml-auto"
                  variant={globalStats.global_success_rate_percent > 95 ? "success" :
                         globalStats.global_success_rate_percent > 80 ? "warning" : "error"}
                >
                  {globalStats.global_success_rate_percent.toFixed(1)}% Success Rate
                </Badge>
              </Stack>
            </CardHeader>

            <CardContent>
              {/* Key metrics row */}
              <Grid cols={{ sm: 2, md: 4 }} gap="md" className="mb-6">
                <div className="text-center p-4 rounded bg-card hover:bg-cardHover transition-all animate-fadeInUp animate-delay-100">
                  <Text size="sm" color="muted" className="mb-2">Total Requests</Text>
                  <Text size="2xl" weight="bold" color="primary">{globalStats.total_request_count.toLocaleString()}</Text>
                </div>

                <div className="text-center p-4 rounded bg-card hover:bg-cardHover transition-all animate-fadeInUp animate-delay-200">
                  <Text size="sm" color="muted" className="mb-2">Success / Error</Text>
                  <Stack direction="horizontal" className="justify-center gap-2">
                    <Text size="lg" weight="bold" color="success">{globalStats.success_count.toLocaleString()}</Text>
                    <Text size="lg" weight="bold" color="foreground">/</Text>
                    <Text size="lg" weight="bold" color="error">{globalStats.error_count.toLocaleString()}</Text>
                  </Stack>
                </div>

                <div className="text-center p-4 rounded bg-card hover:bg-cardHover transition-all animate-fadeInUp animate-delay-300">
                  <Text size="sm" color="muted" className="mb-2">Avg Response</Text>
                  <Text size="2xl" weight="bold" color={globalStats.global_avg_duration_ms < 100 ? "success" : "warning"}>
                    {globalStats.global_avg_duration_ms.toFixed(1)}<span className="text-sm text-foreground">ms</span>
                  </Text>
                </div>

                <div className="text-center p-4 rounded bg-card hover:bg-cardHover transition-all animate-fadeInUp animate-delay-400">
                  <Text size="sm" color="muted" className="mb-2">Max Response</Text>
                  <Text size="2xl" weight="bold" color={globalStats.global_max_duration_ms < 500 ? "warning" : "error"}>
                    {globalStats.global_max_duration_ms.toFixed(0)}<span className="text-sm text-foreground">ms</span>
                  </Text>
                </div>
              </Grid>

              {/* Timeline information */}
              <div className="border-t border-primary/10 pt-4 mt-2">
                <Text size="md" weight="medium" color="primary" className="mb-3">Request Timeline</Text>
                <Grid cols={{ sm: 1, md: 2 }} gap="md" className="animate-fadeInUp animate-delay-500">
                  <div className="p-3 rounded bg-card hover:bg-cardHover transition-all">
                    <Text size="sm" color="muted" className="mb-1">First Request</Text>
                    <Text weight="medium">{formatDate(globalStats.first_request)}</Text>
                  </div>

                  <div className="p-3 rounded bg-card hover:bg-cardHover transition-all">
                    <Text size="sm" color="muted" className="mb-1">Last Request</Text>
                    <Text weight="medium">{formatDate(globalStats.last_request)}</Text>
                  </div>
                </Grid>
              </div>

              {/* Performance metrics */}
              <div className="border-t border-primary/10 pt-4 mt-4">
                <Text size="md" weight="medium" color="primary" className="mb-3">Performance Details</Text>
                <Grid cols={{ sm: 2, md: 3 }} gap="md" className="animate-fadeInUp animate-delay-600">
                  <div className="p-3 rounded bg-card hover:bg-cardHover transition-all">
                    <Text size="sm" color="muted" className="mb-1">Min Response Time</Text>
                    <Text weight="bold">{globalStats.global_min_duration_ms.toFixed(2)}ms</Text>
                  </div>

                  <div className="p-3 rounded bg-card hover:bg-cardHover transition-all">
                    <Text size="sm" color="muted" className="mb-1">Avg Response Time</Text>
                    <Text weight="bold">{globalStats.global_avg_duration_ms.toFixed(2)}ms</Text>
                  </div>

                  <div className="p-3 rounded bg-card hover:bg-cardHover transition-all">
                    <Text size="sm" color="muted" className="mb-1">Max Response Time</Text>
                    <Text weight="bold">{globalStats.global_max_duration_ms.toFixed(2)}ms</Text>
                  </div>
                </Grid>
              </div>
            </CardContent>
          </Card>
        )}
        

      </Section>
    </Container>
  );
} 