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
          className="mb-8"
          bordered
          elevated
        >
          <CardHeader>
            <Stack direction="horizontal" align="center">
              <div className="mr-2" role="img" aria-label="Server status">
                {serverStatus.status === "online" ? "🟢" : "🔴"}
              </div>
              <CardTitle>Server Status</CardTitle>
            </Stack>
          </CardHeader>
          
          <CardContent>
            <Grid cols={{ sm: 1, md: 3 }} gap="md" className="mb-4">
              <div className="text-center">
                <Text size="sm" color="muted" className="mb-1">Status</Text>
                <Text size="lg" weight="bold">
                  {serverStatus.status === "online" ? "Online" : "Offline"}
                </Text>
              </div>
              
              <div className="text-center">
                <Text size="sm" color="muted" className="mb-1">Latency</Text>
                <Text size="lg" weight="bold">
                  {serverStatus.latency}ms
                </Text>
              </div>
              
              <div className="text-center">
                <Text size="sm" color="muted" className="mb-1">Last Checked</Text>
                <Text size="lg" weight="bold">
                  {formatDate(serverStatus.timestamp)}
                </Text>
              </div>
            </Grid>
          </CardContent>
          
          <CardFooter className="justify-center">
            <Button 
              variant="primary"
              onClick={handleRefresh}
              disabled={refreshing || loading}
              isLoading={refreshing}
            >
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Error display */}
        {error && (
          <Card className="mb-8 bg-error/20">
            <CardHeader>
              <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
              <Text color="error">{error}</Text>
            </CardContent>
          </Card>
        )}
        
        {/* Loading indicator */}
        {loading && (
          <Card className="mb-8">
            <CardContent className="py-8 flex flex-col items-center justify-center">
              <Spinner size="lg" color="primary" className="mb-4" />
              <Text>Loading statistics...</Text>
            </CardContent>
          </Card>
        )}
        
        {/* Global Statistics */}
        {!loading && globalStats && (
          <Card className="mb-8" bordered>
            <CardHeader>
              <CardTitle>Global Statistics</CardTitle>
            </CardHeader>
            
            <CardContent>
              <Grid cols={{ sm: 2, md: 4 }} gap="md" className="mb-6">
                <div className="text-center">
                  <Text size="sm" color="muted" className="mb-1">Total Requests</Text>
                  <Text size="2xl" weight="bold">{globalStats.total_request_count}</Text>
                </div>
                
                <div className="text-center">
                  <Text size="sm" color="muted" className="mb-1">Success Rate</Text>
                  <Text 
                    size="2xl" 
                    weight="bold" 
                    color={globalStats.global_success_rate_percent > 90 ? 'success' : 'warning'}
                  >
                    {globalStats.global_success_rate_percent.toFixed(1)}%
                  </Text>
                </div>
                
                <div className="text-center">
                  <Text size="sm" color="muted" className="mb-1">Avg Response Time</Text>
                  <Text size="2xl" weight="bold">{globalStats.global_avg_duration_ms.toFixed(2)}ms</Text>
                </div>
                
                <div className="text-center">
                  <Text size="sm" color="muted" className="mb-1">Max Response Time</Text>
                  <Text size="2xl" weight="bold">{globalStats.global_max_duration_ms.toFixed(2)}ms</Text>
                </div>
              </Grid>
              
              <Grid cols={{ sm: 1, md: 2 }} gap="md">
                <div>
                  <Text size="sm" color="muted" className="mb-1">First Request</Text>
                  <Text>{formatDate(globalStats.first_request)}</Text>
                </div>
                
                <div>
                  <Text size="sm" color="muted" className="mb-1">Last Request</Text>
                  <Text>{formatDate(globalStats.last_request)}</Text>
                </div>
                
                <div>
                  <Text size="sm" color="muted" className="mb-1">Success Count</Text>
                  <Text color="success">{globalStats.success_count}</Text>
                </div>
                
                <div>
                  <Text size="sm" color="muted" className="mb-1">Error Count</Text>
                  <Text color="error">{globalStats.error_count}</Text>
                </div>
              </Grid>
            </CardContent>
          </Card>
        )}
        
        {/* Endpoint Statistics */}
        {!loading && endpointStats.length > 0 && (
          <Card bordered>
            <CardHeader>
              <CardTitle>Endpoint Statistics</CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-6">
                {endpointStats.map((stat, index) => (
                  <Card 
                    key={`${stat.endpoint}-${stat.method}`}
                    className="overflow-hidden"
                    bordered
                    padding="sm"
                  >
                    <CardHeader className="bg-card/10 px-4 py-2 flex justify-between items-center">
                      <div>
                        <Badge 
                          variant={
                            stat.method === 'GET' ? 'primary' : 
                            stat.method === 'POST' ? 'success' : 
                            stat.method === 'PUT' ? 'warning' : 
                            stat.method === 'DELETE' ? 'error' : 'default'
                          }
                          size="sm"
                          className="mr-2"
                        >
                          {stat.method}
                        </Badge>
                        <Text as="span" weight="medium" className="break-all">{stat.endpoint}</Text>
                      </div>
                      <Badge 
                        variant={stat.success_rate_percent > 90 ? 'success' : 'warning'} 
                        size="sm"
                      >
                        {stat.success_rate_percent.toFixed(1)}% Success
                      </Badge>
                    </CardHeader>
                    
                    <CardContent>
                      <Grid cols={{ sm: 1, md: 2, lg: 4 }} gap="sm" className="mb-2">
                        <div>
                          <Text size="sm" color="muted" className="mb-1">Requests</Text>
                          <Text weight="bold">{stat.request_count}</Text>
                        </div>
                        
                        <div>
                          <Text size="sm" color="muted" className="mb-1">Avg Response</Text>
                          <Text weight="bold">{stat.avg_duration_ms.toFixed(2)}ms</Text>
                        </div>
                        
                        <div>
                          <Text size="sm" color="muted" className="mb-1">Min Response</Text>
                          <Text weight="bold">{stat.min_duration_ms.toFixed(2)}ms</Text>
                        </div>
                        
                        <div>
                          <Text size="sm" color="muted" className="mb-1">Max Response</Text>
                          <Text weight="bold">{stat.max_duration_ms.toFixed(2)}ms</Text>
                        </div>
                      </Grid>
                      
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <Text size="xs" color="muted">First: {formatDate(stat.first_request)}</Text>
                        </div>
                        <div>
                          <Text size="xs" color="muted">Last: {formatDate(stat.last_request)}</Text>
                        </div>
                        <div>
                          <Text size="xs" color="success">Success: {stat.success_count}</Text>
                        </div>
                        <div>
                          <Text size="xs" color="error">Errors: {stat.error_count}</Text>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </Section>
    </Container>
  );
} 