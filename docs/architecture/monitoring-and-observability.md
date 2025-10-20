# Monitoring and Observability

## Observability Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Application Logs | Railway Logs | stdout/stderr |
| Database Logs | PostgreSQL | Query logs |
| Metrics | Custom Tables | Application metrics |
| Uptime | UptimeRobot | External health checks |
| Error Tracking | Error Logs Table | Error aggregation |
| Performance | Web Vitals | Frontend metrics |
| Alerting | Telegram | Real-time notifications |

## Structured Logging

```typescript
class Logger {
  private log(level: LogLevel, message: string, context?: LogContext) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      service: 'nextjs-web',
    };
    console.log(JSON.stringify(logEntry));
  }
}

// Usage
logger.info('Application created', {
  userId: user.id,
  jobId: job.id,
});
```

## Metrics Collection

**Metrics Table**:

```sql
CREATE TABLE system_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_name VARCHAR(100) NOT NULL,
  metric_type VARCHAR(20) NOT NULL,  -- 'counter', 'gauge', 'histogram'
  metric_value NUMERIC NOT NULL,
  tags JSONB,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Metrics Tracking**:

```typescript
export class Metrics {
  static async track(name: string, value: number, type: string, tags?: object) {
    await fetch('/api/metrics', {
      method: 'POST',
      body: JSON.stringify({ metric_name: name, metric_value: value, tags }),
    });
  }
}

// Usage
await Metrics.timing('api.jobs.fetch', Date.now() - start);
```

## Health Checks

```typescript
// app/api/health/route.ts
export async function GET() {
  const services = {
    database: await checkDatabase(),
    openai: await checkOpenAI(),
  };

  const status = services.database === 'ok' ? 'healthy' : 'unhealthy';

  return NextResponse.json({
    status,
    services,
    timestamp: new Date().toISOString(),
  });
}
```

## Alerting

**Alert Rules Table**:

```sql
CREATE TABLE alert_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  condition VARCHAR(20) NOT NULL,    -- 'gt', 'lt', etc.
  threshold NUMERIC NOT NULL,
  severity VARCHAR(20) NOT NULL,     -- 'info', 'warning', 'critical'
  notification_channels TEXT[]
);
```

## Monitoring Dashboard

**System Overview Query**:

```sql
SELECT
  DATE_TRUNC('hour', recorded_at) as hour,
  AVG(metric_value) FILTER (WHERE metric_name = 'jobs_scraped') as jobs,
  AVG(metric_value) FILTER (WHERE metric_name = 'api_response_time') as latency
FROM system_metrics
WHERE recorded_at > NOW() - INTERVAL '24 hours'
GROUP BY hour
ORDER BY hour DESC;
```

---
