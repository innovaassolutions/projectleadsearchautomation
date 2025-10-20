# Story 3.10: Project Activity Feed

**Epic**: 3 - Application Project Management & Matching
**Story ID**: 3.10
**Estimated Time**: 8-10 hours

---

## User Story

**As a** user
**I want** to see a timeline of activity for each project
**So that** I can track when matches were found and applications were sent

---

## Acceptance Criteria

- [ ] Activity feed section added to project detail page
- [ ] Activity events tracked:
  - Project created
  - Criteria updated
  - New job matched (batch summary: "15 new matches")
  - Application submitted (link to application detail)
  - Application status changed (interview, rejection, etc.)
  - Project activated/deactivated
- [ ] Database migration: `005_project_activity.sql`
- [ ] Table created: `project_activity`
  - Columns:
    - `id` (UUID, primary key)
    - `project_id` (UUID, foreign key)
    - `activity_type` (enum: created, updated, matched, applied, status_changed, toggled)
    - `description` (text, human-readable summary)
    - `metadata` (jsonb, structured event data)
    - `created_at` (timestamp)
- [ ] Activity feed UI displays:
  - Reverse chronological order (newest first)
  - Icon for each activity type
  - Timestamp (relative: "2 hours ago")
  - Description text
  - Link to related entity (job, application)
- [ ] Pagination: 20 activities per page
- [ ] "View All Activity" link to dedicated activity page
- [ ] Activity automatically created on relevant actions:
  - Project CRUD operations
  - Matching workflows (n8n triggers activity creation)
  - Application workflows
- [ ] Filter controls:
  - Activity type filter (dropdown)
  - Date range filter
- [ ] Empty state: "No activity yet"

---

## Technical Notes

- Use PostgREST for activity insertion and queries
- Consider using database triggers for automatic activity creation
- Use Lucide React icons for activity types
- Store metadata as JSONB for flexible event data

---

## Dependencies

- Story 3.6 completed (project detail page)
- Database migration system ready
- Matching workflows operational (Stories 3.3, 3.4)

---

## Definition of Done

- [ ] Activity feed displays all project events
- [ ] Events automatically logged from workflows and UI actions
- [ ] Filtering and pagination work correctly
- [ ] Activity links navigate to relevant entities
- [ ] UI is clean and easy to scan
