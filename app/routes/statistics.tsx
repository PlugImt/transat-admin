import { useState, useEffect } from "react";
import type { Route } from "./+types/statistics";

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

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Statistics - Transat" },
    { name: "description", content: "View statistics for Transat services" },
  ];
}

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
    fetchStatistics();
    
    // Set up periodic status checks
    const statusCheckInterval = setInterval(() => {
      checkServerStatus();
    }, 30000); // Check every 30 seconds
    
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
    <div>
      <h1 className="section-title">API Statistics</h1>
      
      {/* Server Status */}
      <div className="card stats-card mb-8">
        <h2 className="card-title flex items-center">
          <span role="img" aria-label="Server status" className="mr-2">
            {serverStatus.status === "online" ? "🟢" : "🔴"}
          </span>
          Server Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-sm text-text-primary opacity-70 mb-1">Status</p>
            <p className="text-lg font-bold">
              {serverStatus.status === "online" ? "Online" : "Offline"}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-text-primary opacity-70 mb-1">Latency</p>
            <p className="text-lg font-bold">
              {serverStatus.latency}ms
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-text-primary opacity-70 mb-1">Last Checked</p>
            <p className="text-lg font-bold">
              {formatDate(serverStatus.timestamp)}
            </p>
          </div>
        </div>
        <div className="text-center mt-4">
          <button 
            className="btn-primary"
            onClick={handleRefresh}
            disabled={refreshing || loading}
          >
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>
      
      {/* Error display */}
      {error && (
        <div className="card stats-card bg-red-900 text-white mb-8">
          <h2 className="card-title">Error</h2>
          <p>{error}</p>
        </div>
      )}
      
      {/* Loading indicator */}
      {loading && (
        <div className="card stats-card mb-8">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
            <p className="mt-4">Loading statistics...</p>
          </div>
        </div>
      )}
      
      {/* Global Statistics */}
      {!loading && globalStats && (
        <div className="card stats-card mb-8">
          <h2 className="card-title">Global Statistics</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <p className="text-sm text-text-primary opacity-70 mb-1">Total Requests</p>
              <p className="text-2xl font-bold">{globalStats.total_request_count}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-text-primary opacity-70 mb-1">Success Rate</p>
              <p className="text-2xl font-bold">{globalStats.global_success_rate_percent.toFixed(1)}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-text-primary opacity-70 mb-1">Avg Response Time</p>
              <p className="text-2xl font-bold">{globalStats.global_avg_duration_ms.toFixed(1)}ms</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-text-primary opacity-70 mb-1">Max Response Time</p>
              <p className="text-2xl font-bold">{globalStats.global_max_duration_ms}ms</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-text-primary opacity-70 mb-1">Successful Requests</p>
              <p className="text-lg font-bold text-green-400">{globalStats.success_count}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-text-primary opacity-70 mb-1">Error Requests</p>
              <p className="text-lg font-bold text-red-400">{globalStats.error_count}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-text-primary opacity-70 mb-1">First Request</p>
              <p className="text-lg font-bold">{formatDate(globalStats.first_request)}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Endpoint Statistics */}
      {/*{!loading && endpointStats.length > 0 && (*/}
      {/*  <div className="card stats-card">*/}
      {/*    <h2 className="card-title">Endpoint Statistics</h2>*/}
      {/*    */}
      {/*    <div className="overflow-x-auto">*/}
      {/*      <table className="w-full text-left">*/}
      {/*        <thead>*/}
      {/*          <tr className="border-b border-accent-hover">*/}
      {/*            <th className="py-2 px-4">Endpoint</th>*/}
      {/*            <th className="py-2 px-4">Method</th>*/}
      {/*            <th className="py-2 px-4">Count</th>*/}
      {/*            <th className="py-2 px-4">Success Rate</th>*/}
      {/*            <th className="py-2 px-4">Avg Time</th>*/}
      {/*          </tr>*/}
      {/*        </thead>*/}
      {/*        <tbody>*/}
      {/*          {endpointStats.map((stat, index) => (*/}
      {/*            <tr key={`${stat.endpoint}-${stat.method}`} className={index % 2 === 0 ? 'bg-black' : ''}>*/}
      {/*              <td className="py-2 px-4 font-mono text-sm">{stat.endpoint}</td>*/}
      {/*              <td className="py-2 px-4">*/}
      {/*                <span className={`px-2 py-1 rounded text-xs font-bold*/}
      {/*                  ${stat.method === 'GET' ? 'bg-blue-900 text-blue-200' : ''}*/}
      {/*                  ${stat.method === 'POST' ? 'bg-green-900 text-green-200' : ''}*/}
      {/*                  ${stat.method === 'PUT' ? 'bg-yellow-900 text-yellow-200' : ''}*/}
      {/*                  ${stat.method === 'DELETE' ? 'bg-red-900 text-red-200' : ''}*/}
      {/*                `}>*/}
      {/*                  {stat.method}*/}
      {/*                </span>*/}
      {/*              </td>*/}
      {/*              <td className="py-2 px-4">{stat.request_count}</td>*/}
      {/*              <td className="py-2 px-4">*/}
      {/*                <div className="flex items-center">*/}
      {/*                  <div className="w-16 h-2 bg-black rounded-full mr-2">*/}
      {/*                    <div */}
      {/*                      className="h-full rounded-full bg-accent" */}
      {/*                      style={{ width: `${stat.success_rate_percent}%` }}*/}
      {/*                    ></div>*/}
      {/*                  </div>*/}
      {/*                  <span>{stat.success_rate_percent.toFixed(1)}%</span>*/}
      {/*                </div>*/}
      {/*              </td>*/}
      {/*              <td className="py-2 px-4">{stat.avg_duration_ms.toFixed(1)}ms</td>*/}
      {/*            </tr>*/}
      {/*          ))}*/}
      {/*        </tbody>*/}
      {/*      </table>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*)}*/}
      
      <div className="text-center text-sm text-text-primary opacity-70 mt-8">
        Statistics last loaded: {formatDate(initialLoadTime)}
      </div>
    </div>
  );
} 