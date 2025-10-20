# Coding Standards

## General Principles

- **SOLID Principles**: Single responsibility, open/closed, etc.
- **DRY**: Don't repeat yourself
- **KISS**: Keep it simple

## TypeScript Standards

**Type Safety**:

```typescript
// ❌ Bad
function processData(data: any) {
  return data.value;
}

// ✅ Good
interface DataItem {
  value: string;
}

function processData(data: DataItem) {
  return data.value;
}
```

**Naming Conventions**:

```typescript
// Interfaces and Types - PascalCase
interface UserProfile {}
type JobStatus = 'active' | 'archived';

// Functions and Variables - camelCase
function calculateScore() {}
const matchScore = 85;

// Constants - UPPER_SNAKE_CASE
const MAX_RETRIES = 3;

// Boolean variables - is/has/should prefix
const isLoading = true;
const hasError = false;
```

## React/Next.js Standards

**Component Structure**:

```typescript
interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
}

export const JobCard: FC<JobCardProps> = ({ job, onApply }) => {
  const handleClick = () => {
    onApply?.(job.id);
  };

  return (
    <article className="rounded-lg border p-4">
      <h3>{job.title}</h3>
      {onApply && <button onClick={handleClick}>Apply</button>}
    </article>
  );
};
```

**Hooks Organization**:

```typescript
// Custom hook
export function useJobs(filters?: JobFilters) {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => fetchJobs(filters),
  });
}
```

## File Organization

```bash
# Components - kebab-case
components/jobs/job-card.tsx

# Pages - kebab-case
app/jobs/page.tsx

# Hooks - kebab-case with use- prefix
lib/hooks/use-jobs.ts

# Utilities - kebab-case
lib/utils/match-score.ts
```

## Code Comments

**When to Comment**:

```typescript
// ✅ Good - Explain WHY
// Weight semantic similarity higher because it catches
// similar roles with different terminology
const semanticWeight = 0.7;

// ❌ Bad - Comment duplicates code
// Set the user name
const userName = input.value;
```

**JSDoc for Public APIs**:

```typescript
/**
 * Calculates semantic similarity between job and preferences
 *
 * @param job - The job posting to evaluate
 * @param preferences - User's job search preferences
 * @returns Similarity score between 0 and 1
 */
export function calculateSimilarity(job: Job, preferences: Preferences): number {
  // Implementation
}
```

## Git Commit Standards

```bash
# Format: <type>(<scope>): <subject>

feat(jobs): add semantic search functionality
fix(applications): resolve duplicate submission issue
docs(readme): update deployment instructions
refactor(api): extract error handling to middleware
test(jobs): add unit tests for match score calculation
```

## Code Review Checklist

**Before Submitting PR**:
- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Added tests for new functionality
- [ ] Updated documentation
- [ ] No console.logs
- [ ] No sensitive data in commits

---
