# Story 3.1: Application Project CRUD UI

**Epic**: 3 - Application Project Management & Matching
**Story ID**: 3.1
**Estimated Time**: 8-10 hours

---

## User Story

**As a** user
**I want** to create, view, edit, and delete Application Projects
**So that** I can organize my job search into focused campaigns with specific criteria

---

## Acceptance Criteria

- [ ] NextJS page created: `/app/projects/page.tsx`
- [ ] Project list displays all user projects with cards showing:
  - Project name and description
  - Automation mode badge (Full Auto / Semi Auto)
  - Active/inactive status toggle
  - Match count (jobs matching criteria)
  - Created date
  - Last matched date
  - Quick actions: Edit, Duplicate, Delete
- [ ] "Create New Project" button navigates to creation form
- [ ] Project creation form (`/app/projects/new/page.tsx`):
  - Name (required, max 100 chars)
  - Description (optional, max 500 chars)
  - Automation mode (radio: Full Auto / Semi Auto)
  - Active status (toggle, default: true)
- [ ] Form validation with inline error messages
- [ ] Create action calls PostgREST API: `POST /application_projects`
- [ ] Success message on creation, redirect to project detail page
- [ ] Edit form (`/app/projects/[id]/edit/page.tsx`) pre-populated
- [ ] Update action calls: `PATCH /application_projects?id=eq.{id}`
- [ ] Delete action with confirmation modal
  - Warning: "This will not delete existing applications"
  - Confirmation required: type project name
- [ ] Delete calls: `DELETE /application_projects?id=eq.{id}`
- [ ] Empty state: "No projects yet" with CTA to create first
- [ ] Loading states for all API calls
- [ ] Responsive design (desktop + tablet)

---

## Technical Notes

- Use shadcn/ui Form, Input, Textarea, Switch, RadioGroup components
- Implement optimistic UI updates for toggle actions
- Use Zod for form validation
- Store automation mode as enum in database

---

## Dependencies

- Epic 1 completed (NextJS app, shadcn/ui configured)
- Epic 2 completed (job data available for match counting)
- Database schema includes `application_projects` table

---

## Definition of Done

- [ ] Users can create projects with all required fields
- [ ] Projects displayed in list with accurate metadata
- [ ] Edit and delete operations work correctly
- [ ] Form validation prevents invalid submissions
- [ ] Responsive UI works on desktop and tablet
