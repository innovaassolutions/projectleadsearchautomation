# Story 1.3: Create Initial Database Schema

> **Epic**: Epic 1 - Foundation & Core Infrastructure
> **Status**: Not Started
> **Estimated Time**: 4-6 hours

---

## User Story

**As a** developer
**I want** initial database schema with core tables
**So that** I can start building features with proper data models

---

## Acceptance Criteria

- [ ] Migration system initialized (`/database/migrations/`)
- [ ] Migration `001_initial_schema.sql` created with core tables:
  - `users` (id, email, created_at, updated_at)
  - `jobs` (id, title, company, url, source, scraped_at, archived_at)
  - `application_projects` (id, user_id, name, automation_mode, criteria_json, active)
  - `applications` (id, user_id, job_id, project_id, status, applied_at)
  - `job_embeddings` (id, job_id, embedding vector(1536))
- [ ] Primary keys and foreign keys defined
- [ ] Indexes created for common queries:
  - `jobs.scraped_at` (time-range queries)
  - `jobs.source` (platform filtering)
  - `applications.status` (status filtering)
  - `application_projects.user_id` (user projects)
- [ ] UUID default generation configured
- [ ] Timestamps (created_at, updated_at) included on all tables
- [ ] Migration applied to Railway database
- [ ] Schema documented in `/database/README.md`

---

## Technical Notes

- Use `vector(1536)` for OpenAI embeddings (ada-002 dimension)
- Keep schema minimal for Epic 1, expand in later epics
- Use SQL migration files (not ORM migrations)

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Migration successfully applied to Railway database
- [ ] All tables created with proper constraints
- [ ] Indexes verified and tested
- [ ] Schema documentation complete
