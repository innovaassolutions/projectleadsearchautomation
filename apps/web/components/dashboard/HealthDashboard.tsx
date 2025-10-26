'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

/**
 * Health data structure matching the API response
 */
interface HealthData {
  status: 'healthy' | 'degraded' | 'down';
  timestamp: string;
  environment: string;
  deployment: string;
  services: {
    database: {
      status: string;
      name?: string;
      migrationVersion?: string;
      tableCounts?: Record<string, number>;
      error?: string;
    };
    api: {
      status: string;
      baseUrl: string;
      responseTime?: number;
      error?: string;
    };
  };
}

interface HealthDashboardProps {
  initialData: HealthData | null;
}

/**
 * Health Dashboard Client Component
 * Displays real-time system health status with auto-refresh polling
 */
export function HealthDashboard({ initialData }: HealthDashboardProps) {
  const [health, setHealth] = useState<HealthData | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch health data from API
   */
  const fetchHealth = async () => {
    try {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch('/api/health', {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }

      const data = await response.json();
      setHealth(data);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Failed to fetch health:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch health data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Set up polling interval when auto-refresh is enabled
   */
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchHealth, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  /**
   * Show error state if health data fetch failed
   */
  if (error && !health) {
    return (
      <Card className="border-red-500">
        <CardHeader>
          <CardTitle className="text-red-500">Error Loading Health Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-red-500">{error}</p>
          <Button onClick={fetchHealth} variant="outline">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  /**
   * Show loading state while fetching initial data
   */
  if (!health) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading System Health...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Fetching system health data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Determine status indicator color
  const statusColor = {
    healthy: 'bg-green-500',
    degraded: 'bg-yellow-500',
    down: 'bg-red-500',
  }[health.status];

  const statusTextColor = {
    healthy: 'text-green-500',
    degraded: 'text-yellow-500',
    down: 'text-red-500',
  }[health.status];

  return (
    <div className="space-y-6">
      {/* Overall Status Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4
                          md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${statusColor}`} />
              <CardTitle className={`capitalize ${statusTextColor}`}>
                {health.status}
              </CardTitle>
              {loading && (
                <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              )}
            </div>

            <div className="flex flex-col gap-2
                            xs:flex-row xs:items-center
                            sm:gap-3">
              <Badge variant="outline" className="w-fit">{health.environment}</Badge>
              <Badge variant="outline" className="w-fit">{health.deployment}</Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="w-fit">
                {autoRefresh ? 'Pause' : 'Resume'} Auto-Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchHealth}
                disabled={loading}
                className="w-fit">
                Refresh Now
              </Button>
            </div>
          </div>

          <CardDescription>
            Last updated: {lastUpdate.toLocaleTimeString()}
            {error && (
              <span className="text-red-500 ml-4">
                Error: {error}
              </span>
            )}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Services Grid */}
      <div className="grid gap-6
                      md:grid-cols-2
                      lg:grid-cols-3">
        {/* Database Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div
                className={`w-3 h-3 rounded-full ${
                  health.services.database.status === 'connected'
                    ? 'bg-green-500'
                    : 'bg-red-500'
                }`}
              />
              Database
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <span className="font-medium">Status:</span>{' '}
              <span className={health.services.database.status === 'connected' ? 'text-green-500' : 'text-red-500'}>
                {health.services.database.status}
              </span>
            </div>

            {health.services.database.name && (
              <div className="text-sm">
                <span className="font-medium">Name:</span> {health.services.database.name}
              </div>
            )}

            {health.services.database.migrationVersion && (
              <div className="text-sm">
                <span className="font-medium">Migration:</span>{' '}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">
                  {health.services.database.migrationVersion}
                </code>
              </div>
            )}

            {health.services.database.tableCounts && (
              <div className="mt-4 pt-3 border-t">
                <div className="text-sm font-medium mb-2">Table Counts:</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jobs:</span>
                    <span className="font-mono">{health.services.database.tableCounts.jobs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Applications:</span>
                    <span className="font-mono">{health.services.database.tableCounts.applications}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Projects:</span>
                    <span className="font-mono">{health.services.database.tableCounts.application_projects}</span>
                  </div>
                </div>
              </div>
            )}

            {health.services.database.error && (
              <div className="mt-3 p-2 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded">
                <div className="text-sm text-red-600 dark:text-red-400">
                  <span className="font-medium">Error:</span> {health.services.database.error}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* PostgREST API Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div
                className={`w-3 h-3 rounded-full ${
                  health.services.api.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              PostgREST API
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <span className="font-medium">Status:</span>{' '}
              <span className={health.services.api.status === 'online' ? 'text-green-500' : 'text-red-500'}>
                {health.services.api.status}
              </span>
            </div>

            <div className="text-sm">
              <span className="font-medium">Base URL:</span>{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded break-all">
                {health.services.api.baseUrl}
              </code>
            </div>

            {health.services.api.responseTime !== undefined && (
              <div className="text-sm">
                <span className="font-medium">Response Time:</span>{' '}
                <span className={`font-mono ${health.services.api.responseTime < 100 ? 'text-green-500' : health.services.api.responseTime < 500 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {health.services.api.responseTime}ms
                </span>
              </div>
            )}

            {health.services.api.error && (
              <div className="mt-3 p-2 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded">
                <div className="text-sm text-red-600 dark:text-red-400">
                  <span className="font-medium">Error:</span> {health.services.api.error}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Environment Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              Environment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <span className="font-medium">Type:</span>{' '}
              <Badge variant={health.environment === 'production' ? 'default' : 'secondary'}>
                {health.environment}
              </Badge>
            </div>

            <div className="text-sm">
              <span className="font-medium">Deployment:</span>{' '}
              <Badge variant={health.deployment === 'railway' ? 'default' : 'outline'}>
                {health.deployment}
              </Badge>
            </div>

            <div className="mt-4 pt-3 border-t">
              <div className="text-sm">
                <span className="font-medium">Auto-Refresh:</span>{' '}
                <span className={autoRefresh ? 'text-green-500' : 'text-gray-500'}>
                  {autoRefresh ? 'Enabled' : 'Paused'}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {autoRefresh ? 'Updates every 10 seconds' : 'Manual refresh only'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
