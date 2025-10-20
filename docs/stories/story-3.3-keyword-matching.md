# Story 3.3: Keyword-Based Job Matching Engine

**Epic**: 3 - Application Project Management & Matching
**Story ID**: 3.3
**Estimated Time**: 10-12 hours

---

## User Story

**As a** system
**I want** to match jobs against project criteria using keyword filtering
**So that** jobs meeting explicit user requirements are automatically associated with projects

---

## Acceptance Criteria

- [ ] n8n workflow created: "Keyword Job Matching"
- [ ] Workflow triggered after job enrichment completes (Story 2.6)
- [ ] Workflow fetches all active application projects
- [ ] For each project, apply keyword filters:
  - Salary: job salary >= project min AND <= project max (if specified)
  - Job titles: job title contains any project title (case-insensitive)
  - Industries: job industry matches any project industry
  - Seniority: job seniority matches any project seniority level
  - Job types: job type matches any project job type
  - Required skills: job tags contain ALL required skills
  - Nice-to-have skills: job tags contain ANY nice-to-have (bonus points)
- [ ] Matching logic uses SQL WHERE clauses with PostgREST filtering
- [ ] Calculate match score (0-100):
  - Base: 50 points (all required criteria met)
  - +10 for each nice-to-have skill matched (max +30)
  - +10 for salary within ideal range (75-100% of max)
  - +10 for exact seniority match
- [ ] Matches stored in `job_project_matches` table:
  - Columns: `id`, `job_id`, `project_id`, `match_score`, `match_type` ('keyword'), `matched_at`
- [ ] Workflow logs matching statistics per project
- [ ] Duplicate matches prevented (check existing matches)
- [ ] Workflow exported to `/apps/n8n-workflows/keyword-matching.json`

---

## Technical Notes

- Use PostgreSQL array operators for skill matching (@>, &&)
- Use pg_trgm for fuzzy job title matching
- Optimize with database indexes on match criteria columns
- Consider batch processing (match 100 jobs at once)

---

## Dependencies

- Story 3.2 completed (criteria configuration)
- Story 3.5 completed (matching table schema)
- Epic 2 completed (enriched job data)
- n8n workflow engine operational

---

## Definition of Done

- [ ] Workflow matches jobs accurately based on criteria
- [ ] Match scores reflect criteria alignment
- [ ] Matches stored in database without duplicates
- [ ] Matching completes within 30 minutes per daily run
- [ ] Workflow handles edge cases (missing data, null values)
