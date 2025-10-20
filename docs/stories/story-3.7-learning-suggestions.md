# Story 3.7: Project Learning and Criteria Suggestions

**Epic**: 3 - Application Project Management & Matching
**Story ID**: 3.7
**Estimated Time**: 8-10 hours

---

## User Story

**As a** user
**I want** the system to suggest criteria based on my previous successful projects
**So that** I can quickly create similar projects without re-entering all details

---

## Acceptance Criteria

- [ ] "Suggest Criteria" button added to project creation form
- [ ] Button click triggers analysis of existing projects:
  - Identify projects with highest application success rates
  - Extract common criteria patterns (frequent skills, industries, seniority)
- [ ] API endpoint created: `GET /api/projects/suggest-criteria`
  - Analyzes user's application history (from `applications` table)
  - Finds jobs with highest interview/success rates
  - Aggregates common attributes (tags, industries, seniority)
  - Returns suggested criteria as JSON
- [ ] Suggestions displayed in modal:
  - Top 5 most common skills
  - Top 3 industries
  - Most common seniority levels
  - Average successful salary range
  - "Apply Suggestions" button
- [ ] "Apply Suggestions" populates form fields
- [ ] User can edit suggestions before saving
- [ ] Empty state: "Not enough application data yet" (if <10 applications)
- [ ] Suggestion algorithm uses weighted scoring:
  - Interview received: +10 points
  - Job offer: +20 points
  - Application sent: +1 point
- [ ] Suggestions cached for 24 hours (avoid recalculating frequently)

---

## Technical Notes

- Use PostgreSQL aggregate functions (COUNT, AVG)
- Consider using OpenAI to generate project description from criteria
- Store suggestion cache in Redis or database table
- Require minimum 10 applications before showing suggestions

---

## Dependencies

- Story 3.2 completed (criteria configuration)
- Epic 5 partially completed (applications table exists)
- Database has sufficient application data for analysis

---

## Definition of Done

- [ ] Suggestion algorithm analyzes application history correctly
- [ ] Suggestions are relevant and actionable
- [ ] Empty state shown when insufficient data
- [ ] Applying suggestions populates form correctly
- [ ] Caching prevents excessive recalculation
