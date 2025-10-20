# Story 1.7: Build System Health Dashboard

> **Epic**: Epic 1 - Foundation & Core Infrastructure
> **Status**: Not Started
> **Estimated Time**: 4-6 hours

---

## User Story

**As a** developer
**I want** a simple dashboard showing system health
**So that** I can verify the entire stack is working end-to-end

---

## Acceptance Criteria

- [ ] Health check API route created (`/app/api/health/route.ts`)
- [ ] Health check queries:
  - PostgreSQL connection status
  - PostgREST API reachability
  - Database migration version
  - Row counts for core tables (jobs, applications, etc.)
- [ ] Dashboard page created (`/app/dashboard/page.tsx`)
- [ ] Dashboard displays:
  - System status indicator (green/yellow/red)
  - Database connection status
  - API connection status
  - Last migration applied
  - Environment (development/production)
- [ ] Dashboard uses shadcn/ui Card components
- [ ] Real-time status updates (polling every 10 seconds)
- [ ] Error states handled gracefully
- [ ] Dashboard accessible at `/dashboard`
- [ ] Dashboard is responsive (desktop + tablet)

---

## Technical Notes

- Use Server Components for initial data fetch
- Use Client Component for real-time polling
- Display Railway vs local environment clearly

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Health check API functional
- [ ] Dashboard displays all system metrics
- [ ] Real-time updates working
- [ ] Responsive design verified
