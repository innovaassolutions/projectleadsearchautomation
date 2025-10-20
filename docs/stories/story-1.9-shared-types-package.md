# Story 1.9: Create Shared TypeScript Types Package

> **Epic**: Epic 1 - Foundation & Core Infrastructure
> **Status**: Not Started
> **Estimated Time**: 3-4 hours

---

## User Story

**As a** developer
**I want** shared TypeScript types in `/packages/shared`
**So that** frontend and workflows use consistent data models

---

## Acceptance Criteria

- [ ] Package created at `/packages/shared`
- [ ] `package.json` configured with proper exports
- [ ] TypeScript types defined for core entities:
  - `User` (matches database schema)
  - `Job` (matches database schema)
  - `ApplicationProject` (matches database schema)
  - `Application` (matches database schema)
  - `JobEmbedding` (matches database schema)
- [ ] Enum types defined:
  - `JobSource` (remoteok, weworkremotely, himalayas, ycjobs, wellfound)
  - `AutomationMode` (full_auto, semi_auto)
  - `ApplicationStatus` (applied, no_response, interview, rejection)
- [ ] API response types defined:
  - `HealthCheckResponse`
  - `JobListResponse`
  - `ApplicationListResponse`
- [ ] Package imported successfully in `/apps/web`
- [ ] Types exported from index.ts
- [ ] Build script configured (`tsc`)
- [ ] Type validation working in IDE

---

## Technical Notes

- Sync types with database schema strictly
- Use Zod for runtime validation (optional enhancement)
- Export utility types for API contracts

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Shared types package created and configured
- [ ] All core types defined and match database schema
- [ ] Package successfully imported in NextJS app
- [ ] Type checking working across monorepo
