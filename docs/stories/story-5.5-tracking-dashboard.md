# Story 5.5: Application Tracking Dashboard

**Epic**: 5 - Application Submission & Tracking
**Story ID**: 5.5
**Estimated Time**: 12-14 hours

---

## User Story

**As a** user
**I want** to view all my applications in a centralized dashboard
**So that** I can track progress and manage my job search pipeline

---

## Acceptance Criteria

- [ ] NextJS page created: `/app/applications/page.tsx`
- [ ] Dashboard header with key metrics:
  - Total applications (all time)
  - Applications this week
  - Applications this month
  - Interview requests (count and %)
  - Response rate (% of applications with response)
  - Average response time (days)
- [ ] Application list table:
  - Columns: Status, Job Title, Company, Applied Date, Last Updated, Actions
  - Status badges (color-coded):
    - Pending Review (yellow)
    - Submitted (blue)
    - No Response (gray)
    - Interview (green)
    - Rejection (red)
    - Offer (purple)
  - Sortable columns (click header to sort)
  - Clickable rows navigate to application detail page
- [ ] Filtering controls:
  - Status filter (multi-select dropdown)
  - Project filter (dropdown)
  - Source platform filter
  - Date range filter (applied date)
  - Search by job title or company
- [ ] Bulk actions:
  - Select multiple applications (checkboxes)
  - Bulk status update (dropdown)
  - Bulk delete (with confirmation)
  - Export selected as CSV
- [ ] Application actions:
  - "View Details" - navigate to application detail page
  - "Update Status" - dropdown to change status
  - "Add Note" - quick note modal
  - "Archive" - soft delete from active view
- [ ] Pipeline view (Kanban-style):
  - Toggle between table and Kanban view
  - Columns: Submitted, No Response, Interview, Rejected, Offer
  - Drag-and-drop to update status
  - Card shows: job title, company, applied date
- [ ] Pagination: 25 applications per page
- [ ] Empty state: "No applications yet" with CTA to review queue
- [ ] Loading states for all data fetches
- [ ] Responsive design (desktop + tablet, simplified mobile)

---

## Technical Notes

- Use Server Components for initial data fetch
- Use Client Component for interactive features (filtering, sorting)
- Implement optimistic UI for status updates
- Consider using React Query for data caching
- Store user preferences (view mode, filters) in localStorage

---

## Dependencies

- Database has applications with status data
- shadcn/ui components for table and cards
- Drag-and-drop library for Kanban view

---

## Definition of Done

- [ ] Dashboard displays all applications
- [ ] Key metrics calculated correctly
- [ ] Filtering and sorting work accurately
- [ ] Bulk actions functional
- [ ] Kanban view with drag-and-drop works
- [ ] Performance acceptable with 100+ applications
