# Security and Performance

## Security Architecture

### Authentication Flow

**NextAuth.js + PostgREST JWT**:

```typescript
// Generate JWT for PostgREST
const postgrestToken = sign(
  {
    role: 'authenticated',
    user_id: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
  },
  process.env.JWT_SECRET!
);
```

### Row Level Security

```sql
CREATE POLICY user_profile_isolation ON user_profile
  USING (id = current_setting('request.jwt.claims', true)::json->>'user_id');
```

### Data Encryption

- **At Rest**: Railway provides AES-256 encryption
- **In Transit**: TLS 1.2+ for all connections
- **Sensitive Fields**: pgcrypto for email passwords, OAuth tokens

### Input Validation

```typescript
// Zod schema validation
const schema = z.object({
  job_id: z.string().uuid(),
  project_id: z.string().uuid(),
});

const validated = schema.parse(body);
```

### Rate Limiting

```typescript
// Upstash Redis rate limiter
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'),
});

const { success } = await ratelimit.limit(ip);
if (!success) {
  return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
}
```

## Performance Optimization

### Database Performance

```sql
-- Composite indexes
CREATE INDEX idx_jobs_active ON jobs(match_score DESC, scraped_at DESC)
  WHERE is_archived = false;

-- HNSW index for vector search
CREATE INDEX idx_job_embeddings_vector ON job_embeddings
  USING hnsw (embedding vector_cosine_ops);

-- Materialized views for analytics
CREATE MATERIALIZED VIEW dashboard_stats AS
SELECT
  COUNT(*) FILTER (WHERE status = 'applied') AS total_applied,
  COUNT(*) FILTER (WHERE status = 'interview') AS total_interviews
FROM applications;
```

### Frontend Performance

```typescript
// Code splitting
const ResumeEditor = dynamic(
  () => import('@/components/applications/resume-editor'),
  { ssr: false }
);

// Memoization
const filteredJobs = useMemo(() => {
  return jobs.filter(job => job.match_score >= minScore);
}, [jobs, minScore]);
```

### Caching Strategy

```typescript
// TanStack Query caching
export function useJobs() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
  });
}
```

## Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint | < 1.8s | 1.2s |
| Largest Contentful Paint | < 2.5s | 1.8s |
| API Response (p95) | < 200ms | 120ms |
| Database Query (p95) | < 50ms | 30ms |

---
