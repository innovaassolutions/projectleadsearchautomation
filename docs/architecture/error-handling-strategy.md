# Error Handling Strategy

## Error Handling Philosophy

1. **Fail Fast**: Detect errors early
2. **Graceful Degradation**: Continue with reduced functionality
3. **User-Friendly Messages**: Never expose technical details
4. **Comprehensive Logging**: All errors logged with context
5. **Automatic Recovery**: Retry transient failures

## Frontend Error Handling

**React Error Boundaries**:

```typescript
export class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Error caught by boundary', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

**API Error Handling**:

```typescript
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
  }
}

// Usage
try {
  await fetchJobs();
} catch (error) {
  if (error instanceof APIError && error.statusCode === 429) {
    toast.warning('Too many requests. Please wait.');
  }
}
```

## Backend Error Handling

**API Route Error Handler**:

```typescript
export async function handleAPIError(error: unknown): Promise<NextResponse> {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: 'Validation failed', details: error.errors },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

## Error Logging

**Error Logs Table**:

```sql
CREATE TABLE error_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source VARCHAR(100) NOT NULL,
  error_type VARCHAR(100) NOT NULL,
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  context_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Error Recovery

**Retry with Exponential Backoff**:

```typescript
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await delay(1000 * Math.pow(2, attempt));
    }
  }
}
```

---
