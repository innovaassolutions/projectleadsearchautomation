# Story 3.6: Project Detail Page with Matched Jobs

**Epic**: 3 - Application Project Management & Matching
**Story ID**: 3.6
**Estimated Time**: 10-12 hours

---

## User Story

**As a** user
**I want** to view a project's details and all matched jobs in one place
**So that** I can see which opportunities the system has found for this project

---

## Acceptance Criteria

- [ ] NextJS page created: `/app/projects/[id]/page.tsx`
- [ ] Page displays project header:
  - Project name and description
  - Automation mode badge
  - Active/inactive status
  - Edit and Delete buttons
- [ ] Criteria summary section:
  - Salary range
  - Job titles (as tags)
  - Industries, seniority levels, job types
  - Required skills, nice-to-have skills
  - Remote policy
- [ ] Matched jobs section:
  - List of job cards sorted by match score (descending)
  - Each card shows:
    - Job title, company, source platform
    - Match score badge (0-100, color-coded)
    - Match type badge (keyword/semantic/hybrid)
    - Posted date
    - Tags/skills
    - "View Details" button → job detail page
    - "Dismiss" button (marks match as dismissed)
- [ ] Filtering controls:
  - Match type filter (keyword/semantic/hybrid/all)
  - Minimum match score slider (0-100)
  - Show/hide dismissed matches toggle
- [ ] Pagination: 20 matches per page
- [ ] Empty state: "No matches yet" with explanation
- [ ] API calls:
  - `GET /application_projects?id=eq.{id}` (project details)
  - `GET /job_project_matches?project_id=eq.{id}&order=match_score.desc&dismissed=eq.false`
  - `GET /jobs?id=in.({job_ids})` (fetch job details)
- [ ] Dismiss action:
  - `PATCH /job_project_matches?id=eq.{match_id}` set `dismissed=true`
  - Optimistic UI update (remove card immediately)
- [ ] Match count displayed: "127 jobs matched (12 dismissed)"
- [ ] Responsive design (desktop + tablet)

---

## Technical Notes

- Use Server Component for initial data fetch
- Use Client Component for interactive filtering
- Consider using React Query for efficient data caching
- Color-code match scores: 90-100 (green), 70-89 (yellow), 50-69 (orange)

---

## Dependencies

- Story 3.1 completed (project CRUD)
- Story 3.3 and 3.4 completed (matching engines)
- Story 3.5 completed (matching table)
- shadcn/ui components available

---

## Definition of Done

- [ ] Project detail page displays all information correctly
- [ ] Matched jobs shown with accurate scores and metadata
- [ ] Filtering and sorting work correctly
- [ ] Dismiss action updates database and UI
- [ ] Page is responsive and performant
