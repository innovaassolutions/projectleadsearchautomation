# Frontend Architecture

## Technology Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Framework | Next.js | 14.x | React framework with App Router |
| Language | TypeScript | 5.3+ | Type safety |
| UI Library | React | 18.x | Component framework |
| Styling | Tailwind CSS | 3.x | Utility-first CSS |
| Components | shadcn/ui | Latest | Accessible components |
| State Management | Zustand | 4.x | Lightweight global state |
| Data Fetching | TanStack Query | 5.x | Server state management |
| Forms | React Hook Form | 7.x | Form validation |
| Schema Validation | Zod | 3.x | Runtime type validation |

## Project Structure (Frontend)

```
apps/web/
├── app/                           # Next.js App Router
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx
│   │   ├── jobs/page.tsx
│   │   ├── applications/page.tsx
│   │   ├── interviews/page.tsx
│   │   ├── settings/page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── webhooks/n8n/route.ts
│   │   └── embeddings/route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── jobs/
│   ├── applications/
│   ├── interviews/
│   └── layout/
├── lib/
│   ├── api/
│   ├── hooks/
│   ├── stores/
│   ├── utils/
│   └── validations/
└── types/
```

## State Management Strategy

**Zustand for Client State**:

```typescript
// lib/stores/user-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStore {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  updatePreferences: (preferences: Partial<UserProfile>) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      updatePreferences: (preferences) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...preferences } : null,
        })),
    }),
    { name: 'user-store' }
  )
);
```

**TanStack Query for Server State**:

```typescript
// lib/hooks/use-jobs.ts
export function useJobs() {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      const { data, error } = await postgrest
        .from('jobs')
        .select('*')
        .eq('is_archived', false);

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
```

## Routing Strategy

**App Router Structure**:
- Route Groups: `(auth)` and `(dashboard)` for different layouts
- Dynamic Routes: `[id]` for detail pages
- Parallel Routes: `@modal` for modal overlays

## Component Architecture

```typescript
// components/jobs/job-card.tsx
import { FC } from 'react';
import type { Job } from '@repo/types';

interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
}

export const JobCard: FC<JobCardProps> = ({ job, onApply }) => {
  return (
    <article className="rounded-lg border p-4">
      <h3 className="text-lg font-semibold">{job.title}</h3>
      <p className="text-muted-foreground">{job.company}</p>
      {onApply && (
        <button onClick={() => onApply(job.id)}>Apply</button>
      )}
    </article>
  );
};
```

---
