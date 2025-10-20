# Testing Strategy

## Testing Pyramid

```
        /\
       /E2E\      ← 10% (Critical user flows)
      /------\
     /Integration\ ← 30% (API, Database)
    /------------\
   /   Unit Tests  \ ← 60% (Functions, Components)
  /----------------\
```

## Unit Testing

**Technology**: Vitest + React Testing Library

**Example Component Test**:

```typescript
describe('JobCard', () => {
  it('renders job title and company', () => {
    render(<JobCard job={mockJob} />);

    expect(screen.getByText('Senior Engineer')).toBeInTheDocument();
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
  });
});
```

## Integration Testing

**Example API Test**:

```typescript
describe('POST /api/applications', () => {
  it('creates application successfully', async () => {
    const response = await POST(createRequest({
      body: { job_id: 'test-id', project_id: 'proj-id' }
    }));

    expect(response.status).toBe(201);
  });
});
```

## End-to-End Testing

**Technology**: Playwright

**Example E2E Test**:

```typescript
test('complete application flow', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.click('button[type="submit"]');

  await page.goto('/jobs');
  await page.click('[data-testid="job-card"]:first-child');
  await page.click('button:has-text("Apply")');

  await expect(page.locator('text=Application submitted')).toBeVisible();
});
```

## Test Coverage Requirements

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
      },
    },
  },
});
```

---
