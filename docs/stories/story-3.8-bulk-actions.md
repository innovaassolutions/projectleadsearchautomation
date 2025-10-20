# Story 3.8: Bulk Actions on Matched Jobs

**Epic**: 3 - Application Project Management & Matching
**Story ID**: 3.8
**Estimated Time**: 8-10 hours

---

## User Story

**As a** user
**I want** to perform bulk actions on multiple matched jobs at once
**So that** I can efficiently manage large numbers of matches

---

## Acceptance Criteria

- [ ] Checkbox selection added to job cards in project detail page
- [ ] "Select All" checkbox in table header (selects all on current page)
- [ ] Selection counter: "5 jobs selected"
- [ ] Bulk action dropdown menu:
  - "Dismiss Selected" - marks matches as dismissed
  - "Bookmark Selected" - adds jobs to bookmarks (if bookmark feature exists)
  - "Apply to All" - queues applications (Semi Auto) or submits (Full Auto)
  - "Export Selected" - downloads job data as CSV
- [ ] Bulk dismiss action:
  - Confirmation modal: "Dismiss 5 matches?"
  - API call: `PATCH /job_project_matches?id=in.({ids})` set `dismissed=true`
  - Optimistic UI update (remove cards)
  - Success toast: "5 matches dismissed"
- [ ] Bulk apply action:
  - Confirmation modal with summary
  - Triggers application workflow (Epic 5)
  - Progress indicator for batch processing
  - Success toast with count: "5 applications queued"
- [ ] Bulk export action:
  - Generates CSV with columns: title, company, url, match_score, tags
  - Downloads file: `project-{name}-matches-{date}.csv`
- [ ] Selection cleared after action completes
- [ ] Error handling: partial failures reported clearly

---

## Technical Notes

- Use shadcn/ui Checkbox component
- Implement client-side selection state (Zustand or React state)
- Use PostgREST `in` filter for bulk operations
- Consider rate limiting for large bulk operations

---

## Dependencies

- Story 3.6 completed (project detail page)
- Story 3.5 completed (matching table)
- shadcn/ui components installed

---

## Definition of Done

- [ ] Users can select multiple jobs with checkboxes
- [ ] Bulk dismiss action works correctly
- [ ] Bulk export generates accurate CSV
- [ ] Bulk apply triggers application workflow (Epic 5)
- [ ] Error handling manages partial failures gracefully
