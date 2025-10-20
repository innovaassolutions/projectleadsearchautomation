# Story 5.1: Semi Auto Review Queue UI

**Epic**: 5 - Application Submission & Tracking
**Story ID**: 5.1
**Estimated Time**: 10-12 hours

---

## User Story

**As a** user
**I want** to review and approve matched jobs before submission in Semi Auto mode
**So that** I can maintain quality control while benefiting from automation

---

## Acceptance Criteria

- [ ] NextJS page created: `/app/review-queue/page.tsx`
- [ ] Review queue displays pending applications:
  - Filter by project (dropdown)
  - Sort by: match score, date matched, company
  - View toggle: List view or Card view
- [ ] Each queue item shows:
  - Job title, company, source platform
  - Match score badge (color-coded)
  - Date matched (relative time)
  - Application project badge
  - Preview buttons: Resume, Cover Letter, Job Description
  - Action buttons: Approve, Dismiss, Edit
- [ ] Approve action:
  - Confirmation modal with summary
  - Shows: job details, customized materials preview
  - "Confirm Application" button
  - API call: `POST /api/applications/{id}/approve`
  - Moves to submission queue
  - Success toast: "Application approved and queued for submission"
- [ ] Dismiss action:
  - Reason selector (dropdown): Not interested, Already applied, Poor match, Other
  - Optional notes (text input)
  - Updates match record: `dismissed=true`
  - Removes from queue
- [ ] Edit action:
  - Opens preview/edit page (Story 4.5)
  - Allows manual customization before approval
  - Returns to queue after save
- [ ] Bulk actions:
  - Select multiple items (checkboxes)
  - Bulk approve (confirmation required)
  - Bulk dismiss
  - "Select All" option
- [ ] Queue statistics header:
  - "X applications pending review"
  - "Y approved today"
  - "Z dismissed this week"
- [ ] Empty state: "No applications to review"
- [ ] Pagination: 20 items per page
- [ ] Responsive design (desktop + tablet)

---

## Technical Notes

- Query applications with status='pending_review' and project.automation_mode='semi_auto'
- Use optimistic UI updates for immediate feedback
- Implement keyboard shortcuts (A=approve, D=dismiss, E=edit)
- Store dismissal reasons for future learning

---

## Dependencies

- Epic 3 completed (matched jobs available)
- Epic 4 completed (customized materials)
- Database schema includes applications table
- shadcn/ui components installed

---

## Definition of Done

- [ ] Review queue displays all pending applications
- [ ] Approve/dismiss/edit actions work correctly
- [ ] Bulk actions functional
- [ ] Queue statistics accurate
- [ ] UI is intuitive and responsive
