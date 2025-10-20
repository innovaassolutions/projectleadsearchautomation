# Story 3.2: Project Criteria Configuration with Autocomplete

**Epic**: 3 - Application Project Management & Matching
**Story ID**: 3.2
**Estimated Time**: 10-12 hours

---

## User Story

**As a** user
**I want** to configure detailed job matching criteria with autocomplete suggestions
**So that** I can precisely define what types of jobs I'm interested in

---

## Acceptance Criteria

- [ ] Criteria configuration form added to project creation/edit pages
- [ ] Salary range fields:
  - Minimum salary (number input, optional)
  - Maximum salary (number input, optional)
  - Currency selector (dropdown: USD, EUR, GBP, etc.)
- [ ] Job titles field:
  - Multi-select input with autocomplete
  - Suggestions from existing job data (aggregate distinct titles)
  - Free text entry allowed
  - Display as tags/chips
- [ ] Industries field:
  - Multi-select with autocomplete
  - Suggestions: fintech, healthtech, SaaS, e-commerce, AI/ML, etc.
  - Free text entry allowed
- [ ] Seniority levels:
  - Multi-select checkboxes
  - Options: Entry, Mid, Senior, Staff, Principal, Executive
- [ ] Job types:
  - Multi-select checkboxes
  - Options: Frontend, Backend, Fullstack, DevOps, Data, Mobile, etc.
- [ ] Required skills/technologies:
  - Multi-select with autocomplete
  - Suggestions from job tags (top 100 most common)
  - Free text entry allowed
- [ ] Nice-to-have skills (optional):
  - Same as required skills
- [ ] Remote policy preference:
  - Radio buttons: Fully Remote, Hybrid OK, Any
- [ ] Criteria saved as JSON in `application_projects.criteria_json`
- [ ] API call validates criteria structure before saving
- [ ] Form shows validation errors for invalid criteria

---

## Technical Notes

- Use shadcn/ui Command component for autocomplete
- Fetch autocomplete data from PostgREST: `GET /jobs?select=tags&limit=100`
- Aggregate unique values client-side or server-side
- Store criteria as structured JSON (not stringified)

---

## Dependencies

- Story 3.1 completed (project CRUD UI)
- Epic 2 completed (job data with tags and metadata)
- Database schema supports criteria_json column

---

## Definition of Done

- [ ] Criteria form captures all specified fields
- [ ] Autocomplete provides relevant suggestions
- [ ] Free text entry works when suggestions insufficient
- [ ] Criteria saved correctly as JSON
- [ ] Form validation prevents invalid criteria
