# Story 5.6: Application Detail Page

**Epic**: 5 - Application Submission & Tracking
**Story ID**: 5.6
**Estimated Time**: 12-14 hours

---

## User Story

**As a** user
**I want** to view detailed information about a specific application
**So that** I can review materials, track progress, and manage follow-ups

---

## Acceptance Criteria

- [ ] NextJS page created: `/app/applications/[id]/page.tsx`
- [ ] Application header section:
  - Job title (large, prominent)
  - Company name with logo (if available)
  - Application status badge (large, color-coded)
  - Applied date and last updated timestamp
  - Source platform badge
  - Match score (from original matching)
  - Action buttons: Update Status, Add Note, Archive
- [ ] Job details section:
  - Full job description
  - Required skills (tags)
  - Salary range (if available)
  - Location and remote policy
  - "View Original Posting" link (opens in new tab)
- [ ] Application materials section:
  - Tabs: Resume, Cover Letter, Job Description
  - Resume tab: formatted view of customized resume
  - Cover Letter tab: formatted view of customized cover letter
  - Job Description tab: original job posting
  - Download buttons: PDF resume, PDF cover letter
  - Quality scores displayed
- [ ] Timeline/Activity section:
  - Reverse chronological list of events:
    - Application submitted (timestamp)
    - Status changes (with who/what updated)
    - Notes added
    - Emails received (if Epic 6 completed)
    - Interview scheduled (if Epic 8 completed)
  - "Add Event" button for manual updates
- [ ] Notes section:
  - List of user notes (reverse chronological)
  - Add note form (text area, 500 char limit)
  - Edit/delete existing notes
  - Notes auto-timestamped
- [ ] Related applications section:
  - "Other applications at [Company]" (if any)
  - "Similar jobs you applied to" (based on match similarity)
- [ ] Status update modal:
  - Current status displayed
  - Status dropdown (all valid transitions)
  - Optional date picker (for interview dates)
  - Optional notes (reason for status change)
  - "Update" button
  - Validates status transitions (e.g., can't go from Rejected to Interview)
- [ ] Quick actions toolbar:
  - "Copy Application Link" (shareable URL)
  - "Export Details" (PDF or JSON)
  - "Duplicate for Similar Job" (pre-fill new application)
  - "Report Issue" (flag problems with automation)
- [ ] Responsive design (desktop + tablet)

---

## Technical Notes

- Use Server Component for initial data fetch
- Fetch related data: job, project, user profile
- Implement status transition validation
- Store activity events in `application_events` table
- Consider real-time updates (if multiple devices)

---

## Dependencies

- Story 5.5 completed (dashboard navigation)
- Epic 4 completed (customized materials to display)
- Database schema includes all application data

---

## Definition of Done

- [ ] Detail page displays all application information
- [ ] Materials tabs show customized content
- [ ] Timeline/activity tracks all events
- [ ] Notes can be added and managed
- [ ] Status updates validate transitions
- [ ] Quick actions functional
