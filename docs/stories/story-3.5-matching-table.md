# Story 3.5: Job-Project Matching Association Table

**Epic**: 3 - Application Project Management & Matching
**Story ID**: 3.5
**Estimated Time**: 4-6 hours

---

## User Story

**As a** developer
**I want** a dedicated table to track job-project match relationships
**So that** the system can efficiently query matched jobs and track match history

---

## Acceptance Criteria

- [ ] Database migration created: `003_job_project_matches.sql`
- [ ] Table created: `job_project_matches`
  - Columns:
    - `id` (UUID, primary key)
    - `job_id` (UUID, foreign key to jobs, indexed)
    - `project_id` (UUID, foreign key to application_projects, indexed)
    - `match_score` (integer, 0-100)
    - `match_type` (enum: 'keyword', 'semantic', 'hybrid')
    - `matched_at` (timestamp with time zone)
    - `reviewed` (boolean, default false)
    - `dismissed` (boolean, default false)
- [ ] Composite unique index: `(job_id, project_id)` (prevent duplicates)
- [ ] Index on `project_id, match_score DESC` (for sorted queries)
- [ ] Index on `match_type` (for filtering)
- [ ] Foreign key constraints with CASCADE on delete
- [ ] Default values set appropriately
- [ ] Migration applied to Railway database
- [ ] PostgREST endpoint verified: `GET /job_project_matches`
- [ ] Test queries:
  - Get all matches for a project, sorted by score
  - Get all projects matching a specific job
  - Count unreviewed matches per project

---

## Technical Notes

- Use composite index for efficient project-based queries
- Consider partitioning table if match volume is very high
- `reviewed` flag for Semi Auto mode review queue
- `dismissed` flag for user-rejected matches

---

## Dependencies

- Epic 1 completed (database schema foundation)
- `application_projects` table exists
- `jobs` table exists

---

## Definition of Done

- [ ] Table created with all specified columns and indexes
- [ ] Foreign key constraints working correctly
- [ ] PostgREST endpoints accessible
- [ ] Test queries return expected results
- [ ] Migration documented and version controlled
