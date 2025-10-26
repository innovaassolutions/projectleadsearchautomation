// app/api/health/route.ts
import { NextResponse } from 'next/server';

// Disable caching for health checks to get real-time status
export const dynamic = 'force-dynamic';

/**
 * Health check response interface
 * Defines the structure of system health status data
 */
interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'down';
  timestamp: string;
  environment: 'development' | 'production';
  deployment: 'railway' | 'local';
  services: {
    database: {
      status: 'connected' | 'disconnected';
      name?: string;
      migrationVersion?: string;
      tableCounts?: {
        jobs: number;
        applications: number;
        application_projects: number;
        user_profile: number;
      };
      error?: string;
    };
    api: {
      status: 'online' | 'offline';
      baseUrl: string;
      responseTime?: number;
      error?: string;
    };
  };
}

/**
 * Health check API endpoint
 * Checks status of PostgreSQL database and PostgREST API
 * Returns comprehensive health status including table counts
 */
export async function GET() {
  const startTime = Date.now();

  try {
    // Initialize health response with default values
    const health: HealthCheckResponse = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
      deployment: process.env.DATABASE_URL?.includes('railway') ? 'railway' : 'local',
      services: {
        database: {
          status: 'disconnected',
        },
        api: {
          status: 'offline',
          baseUrl: process.env.POSTGREST_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
        },
      },
    };

    const postgrestUrl = process.env.POSTGREST_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    // Check PostgreSQL connection via PostgREST
    // We use PostgREST to query the database since we don't have direct pg client
    try {
      // First, check if PostgREST API itself is responsive
      const apiStart = Date.now();
      const apiHealthResponse = await fetch(`${postgrestUrl}/`, {
        method: 'GET',
        headers: { 'Accept': 'application/openapi+json' },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      const apiResponseTime = Date.now() - apiStart;

      if (apiHealthResponse.ok) {
        health.services.api.status = 'online';
        health.services.api.responseTime = apiResponseTime;
      } else {
        health.services.api.error = `HTTP ${apiHealthResponse.status}`;
        health.status = 'degraded';
      }
    } catch (error) {
      health.services.api.error = error instanceof Error ? error.message : 'Unknown error';
      health.status = 'down';
    }

    // Check database connection and query table counts via PostgREST
    try {
      // Test database connectivity by querying a table
      const dbTestResponse = await fetch(`${postgrestUrl}/jobs?select=count&limit=1`, {
        headers: { 'Accept': 'application/json', 'Prefer': 'count=exact' },
        signal: AbortSignal.timeout(5000),
      });

      if (dbTestResponse.ok) {
        health.services.database.status = 'connected';
        health.services.database.name = 'jobapp';

        // Get table row counts
        // PostgREST returns count in Content-Range header when Prefer: count=exact is set
        const tableCounts = {
          jobs: 0,
          applications: 0,
          application_projects: 0,
          user_profile: 0,
        };

        // Query each table for counts
        const tables = ['jobs', 'applications', 'application_projects'];

        for (const table of tables) {
          try {
            const response = await fetch(`${postgrestUrl}/${table}?select=count`, {
              headers: {
                'Accept': 'application/json',
                'Prefer': 'count=exact',
              },
              signal: AbortSignal.timeout(3000),
            });

            if (response.ok) {
              const contentRange = response.headers.get('content-range');
              if (contentRange) {
                // Content-Range format: "0-24/25" or "*/0" if empty
                const match = contentRange.match(/\/(\d+)$/);
                if (match) {
                  tableCounts[table as keyof typeof tableCounts] = parseInt(match[1], 10);
                }
              }
            }
          } catch (error) {
            // Individual table query failures don't affect overall status
            console.error(`Failed to query ${table}:`, error);
          }
        }

        health.services.database.tableCounts = tableCounts;

        // Try to get migration version (if schema_migrations table exists)
        try {
          const migrationResponse = await fetch(`${postgrestUrl}/schema_migrations?select=version&order=version.desc&limit=1`, {
            headers: { 'Accept': 'application/json' },
            signal: AbortSignal.timeout(3000),
          });

          if (migrationResponse.ok) {
            const migrations = await migrationResponse.json();
            if (migrations && migrations.length > 0) {
              health.services.database.migrationVersion = migrations[0].version;
            }
          }
        } catch (error) {
          // Migration version is optional, don't fail on this
          console.log('Could not fetch migration version:', error);
        }
      } else {
        health.services.database.error = `HTTP ${dbTestResponse.status}`;
        health.status = health.status === 'down' ? 'down' : 'degraded';
      }
    } catch (error) {
      health.services.database.error = error instanceof Error ? error.message : 'Unknown error';
      // If database is down but API is up, status is degraded
      // If both are down, status remains down
      if (health.services.api.status === 'online') {
        health.status = 'degraded';
      } else {
        health.status = 'down';
      }
    }

    return NextResponse.json(health);
  } catch (error) {
    // Catastrophic failure - return error response
    return NextResponse.json(
      {
        status: 'down',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
