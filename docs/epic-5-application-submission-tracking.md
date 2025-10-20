# Epic 5: Application Submission & Tracking

> **Phase**: 1 (MVP)
> **Estimated Time**: 3-4 weeks
> **Must Complete Before**: Phase 2 Epics (Telegram, Email, Interview Management)
> **Depends On**: Epic 4 (AI-Powered Application Customization)
> **Status**: Not Started
> **Stories**: 10

---

## Overview

Build flexible automation workflows supporting both Semi Auto (review queue) and Full Auto (automatic submission) modes, implement application submission logic with form automation, establish comprehensive application tracking with status management, create review queue UI for user approval, implement duplicate prevention to avoid multiple applications to same job, build application history dashboard with filtering and search, create detailed application pages, implement status workflow automation with state transitions, build analytics dashboard for application performance metrics, and enable manual application entry for jobs applied to outside the system.

**Why This Matters**: Application submission and tracking is the culmination of all previous epics—this is where automation actually applies to jobs and tracks outcomes. Without robust tracking, users cannot measure success, optimize strategies, or manage their job search pipeline effectively. The dual-mode system (Semi Auto vs. Full Auto) gives users control over automation level based on confidence and risk tolerance.

---

## Epic Goal

Deploy a complete application submission and tracking system that supports both Semi Auto mode (user reviews and approves each application before submission) and Full Auto mode (automatic submission with post-notification), implements intelligent form automation for common application platforms, prevents duplicate applications, tracks all applications through status lifecycle (Applied → No Response / Interview / Rejection), provides comprehensive analytics on application performance, and enables manual entry for applications made outside the system—all with a clean, efficient UI that minimizes friction.

---

## User Stories

### Story 5.1: Semi Auto Review Queue UI

**As a** user
**I want** to review and approve matched jobs before submission in Semi Auto mode
**So that** I can maintain quality control while benefiting from automation

**Acceptance Criteria**:
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

**Technical Notes**:
- Query applications with status='pending_review' and project.automation_mode='semi_auto'
- Use optimistic UI updates for immediate feedback
- Implement keyboard shortcuts (A=approve, D=dismiss, E=edit)
- Store dismissal reasons for future learning

**Estimated Time**: 10-12 hours

---

### Story 5.2: Full Auto Submission Workflow

**As a** system
**I want** to automatically submit applications for matched jobs in Full Auto mode
**So that** users can achieve high-volume applications without manual intervention

**Acceptance Criteria**:
- [ ] n8n workflow created: "Full Auto Application Submission"
- [ ] Workflow triggered after job matching and customization completes
- [ ] Workflow checks automation mode:
  - If Semi Auto: add to review queue (Story 5.1)
  - If Full Auto: proceed with automatic submission
- [ ] Pre-submission checks:
  - Duplicate prevention: check if job already applied to
  - Quality threshold: check if quality scores meet minimum (configurable)
  - Daily limit: respect user-defined daily application cap
  - Blacklist check: skip companies on user blacklist
- [ ] If all checks pass:
  - Create application record with status='queued'
  - Trigger submission workflow (Story 5.3)
  - Log submission attempt
- [ ] If any check fails:
  - Flag application for manual review
  - Log failure reason
  - Send notification (if configured)
- [ ] Post-submission actions:
  - Update application status to 'submitted'
  - Record submission timestamp
  - Increment project application counter
  - Update job match as 'applied'
  - Trigger notification workflow (Telegram/email - Epic 6)
- [ ] Error handling:
  - Retry failed submissions (3 attempts with exponential backoff)
  - Log detailed error information
  - Flag for manual review after 3 failures
- [ ] Rate limiting:
  - Respect daily application cap (default: 10, max: 50)
  - Distribute submissions throughout day
  - Avoid suspicious patterns (10 applications in 1 minute)
- [ ] Workflow logs statistics:
  - Applications submitted per day/week
  - Success rate
  - Average submission time
  - Platforms used
- [ ] Workflow exported to `/apps/n8n-workflows/full-auto-submission.json`

**Technical Notes**:
- Implement submission queue to manage rate limiting
- Use database transactions for status updates
- Consider time-of-day optimization (submit during business hours)
- Log all submission attempts for auditing

**Estimated Time**: 12-14 hours

---

### Story 5.3: Application Form Automation

**As a** system
**I want** to automatically fill and submit application forms on job platforms
**So that** applications are submitted without manual data entry

**Acceptance Criteria**:
- [ ] Form automation system supporting multiple platforms:
  - Direct application URLs (external ATS)
  - Email applications (send to hiring email)
  - Platform-specific APIs (if available)
- [ ] User profile data structure created for form filling:
  - Personal info: name, email, phone, location
  - Work authorization status
  - LinkedIn URL, portfolio URL, GitHub URL
  - Years of experience
  - Current employment status
  - Salary expectations
  - Availability (immediate, 2 weeks, 1 month, etc.)
  - Willing to relocate (yes/no)
- [ ] Database migration: `011_user_profile.sql`
- [ ] Table created or updated: `user_profiles`
  - Columns: all personal data fields above
  - Store as JSONB for flexibility
- [ ] Email application automation:
  - Compose email with subject: "Application for [Job Title] at [Company]"
  - Body: cover letter text
  - Attachments: resume PDF (generated from customized JSON)
  - Send via SMTP (configured in Epic 0)
  - Track sent email in applications table
- [ ] External ATS form automation (Phase 2 enhancement):
  - Puppeteer/Playwright headless browser
  - Detect form fields (name, email, resume upload, etc.)
  - Fill fields with user profile data
  - Upload resume and cover letter files
  - Submit form programmatically
  - Capture confirmation page/message
- [ ] Resume/cover letter PDF generation:
  - Convert customized JSON/text to formatted PDF
  - Use template-based layout (consistent formatting)
  - Include all sections from customized content
  - Store generated PDFs in storage (Supabase or Railway volumes)
- [ ] Submission confirmation tracking:
  - Store confirmation message/screenshot
  - Verify submission success
  - Update application status accordingly
- [ ] Fallback for complex forms:
  - Generate pre-filled form link (if possible)
  - Notify user to complete manually
  - Mark as 'manual_completion_required'
- [ ] Supported submission methods priority:
  1. Email application (simplest, most reliable)
  2. Easy Apply / 1-click apply (if available)
  3. Direct ATS form (automated with Puppeteer)
  4. Manual completion link (fallback)

**Technical Notes**:
- Start with email applications for MVP (most reliable)
- Add headless browser automation in Phase 2
- Use Puppeteer with stealth plugin to avoid detection
- Store submission logs for troubleshooting
- Consider using proxy rotation for form submissions

**Estimated Time**: 14-16 hours

---

### Story 5.4: User Profile Management

**As a** user
**I want** to manage my profile information used for application forms
**So that** automated submissions have accurate personal data

**Acceptance Criteria**:
- [ ] NextJS page created: `/app/profile/page.tsx`
- [ ] Profile form displays all fields:
  - **Personal Information**:
    - Full name (required)
    - Email (required, validated)
    - Phone number (required, formatted)
    - Location (city, state/country)
  - **Professional Information**:
    - Current job title
    - Years of experience (slider: 0-30+)
    - Current employment status (employed, unemployed, open to offers)
    - LinkedIn URL
    - Portfolio website URL
    - GitHub URL (optional)
  - **Application Preferences**:
    - Work authorization (dropdown by country)
    - Visa sponsorship required (yes/no)
    - Willing to relocate (yes/no)
    - Remote work preference (fully remote, hybrid OK, any)
    - Salary expectations (range with currency)
    - Availability (immediate, 2 weeks, 1 month, negotiable)
  - **Diversity & Inclusion** (optional):
    - Gender (optional, for DEI programs)
    - Veteran status (yes/no/decline)
    - Disability status (yes/no/decline)
- [ ] Form validation:
  - Required fields enforced
  - Email format validation
  - Phone number formatting (international support)
  - URL validation for LinkedIn, portfolio, GitHub
- [ ] Save action:
  - API call: `PATCH /user_profiles?user_id=eq.{user_id}`
  - Optimistic UI update
  - Success toast: "Profile updated successfully"
  - Error handling with clear messages
- [ ] Profile completion indicator:
  - Progress bar showing % complete
  - Highlight missing required fields
  - Encourage 100% completion for best automation
- [ ] Resume file upload (optional):
  - Upload PDF resume (max 2MB)
  - Store in Supabase Storage or Railway volumes
  - Use as fallback if customization fails
  - Preview uploaded resume
- [ ] "Test Autofill" button:
  - Shows sample form with fields auto-filled
  - Validates profile data is complete
  - Identifies missing fields
- [ ] Data privacy notice:
  - Explain how data is used (application forms only)
  - No data shared with third parties
  - User can delete profile anytime
- [ ] Responsive design (desktop + tablet)

**Technical Notes**:
- Store profile as JSONB for flexibility
- Use libphonenumber for international phone formatting
- Implement field-level validation (client + server)
- Consider profile templates by industry/role

**Estimated Time**: 8-10 hours

---

### Story 5.5: Application Tracking Dashboard

**As a** user
**I want** to view all my applications in a centralized dashboard
**So that** I can track progress and manage my job search pipeline

**Acceptance Criteria**:
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

**Technical Notes**:
- Use Server Components for initial data fetch
- Use Client Component for interactive features (filtering, sorting)
- Implement optimistic UI for status updates
- Consider using React Query for data caching
- Store user preferences (view mode, filters) in localStorage

**Estimated Time**: 12-14 hours

---

### Story 5.6: Application Detail Page

**As a** user
**I want** to view detailed information about a specific application
**So that** I can review materials, track progress, and manage follow-ups

**Acceptance Criteria**:
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

**Technical Notes**:
- Use Server Component for initial data fetch
- Fetch related data: job, project, user profile
- Implement status transition validation
- Store activity events in `application_events` table
- Consider real-time updates (if multiple devices)

**Estimated Time**: 12-14 hours

---

### Story 5.7: Duplicate Application Prevention

**As a** system
**I want** to prevent duplicate applications to the same job
**So that** users don't accidentally apply multiple times and damage credibility

**Acceptance Criteria**:
- [ ] Duplicate detection algorithm:
  - Check by job URL (exact match)
  - Check by company + job title + posted date (fuzzy match)
  - Check by job description similarity (>90% match using embeddings)
- [ ] Pre-submission duplicate check:
  - Query existing applications: `SELECT * FROM applications WHERE job_id = ? OR (company = ? AND title = ? AND posted_date = ?)`
  - If exact match found: block submission
  - If fuzzy match found: flag for user review
  - If no match: proceed with submission
- [ ] Duplicate detection response:
  - **Exact match**: "You already applied to this job on [date]"
  - **Fuzzy match**: "Similar application detected: [details]. Apply anyway?"
  - **No match**: proceed automatically
- [ ] User override for fuzzy matches:
  - Show detected similar application
  - "Apply Anyway" button (requires confirmation)
  - Log override decision
  - Proceed with submission
- [ ] Database index for fast lookup:
  - Index on `job_id` (primary duplicate check)
  - Index on `company, title, posted_date` (fuzzy match)
  - Consider full-text search index for title matching
- [ ] Duplicate tracking table (optional):
  - Log all duplicate detections
  - Track false positives (user overrides)
  - Use for improving detection algorithm
- [ ] Integration points:
  - Full Auto workflow (Story 5.2): check before submission
  - Semi Auto review queue (Story 5.1): show warning in queue
  - Manual application entry (Story 5.10): validate before save
- [ ] Warning indicators in UI:
  - Badge: "Possible Duplicate" on job cards
  - Modal on approval: "Warning: similar application exists"
  - Confirmation required to proceed
- [ ] Test cases:
  - Same job URL: block
  - Same company + title + date: warn
  - Same job reposted (different date): allow
  - Different title, same company, similar description: warn

**Technical Notes**:
- Use PostgreSQL full-text search for title matching
- Use pgvector cosine similarity for description matching
- Set similarity threshold: >0.95 for job descriptions
- Consider time window (jobs reposted after 30 days OK)
- Log all duplicate detections for quality monitoring

**Estimated Time**: 8-10 hours

---

### Story 5.8: Application Status Workflow Automation

**As a** system
**I want** to automatically manage application status transitions and trigger workflows
**So that** status changes flow logically and trigger appropriate actions

**Acceptance Criteria**:
- [ ] Status state machine defined:
  - **Initial states**: pending_review (Semi Auto), queued (Full Auto)
  - **Active states**: submitted, no_response, interview_requested, interviewing
  - **Terminal states**: rejected, offer, accepted, declined, withdrawn
- [ ] Valid status transitions:
  - pending_review → submitted (on approval)
  - queued → submitted (on successful submission)
  - submitted → no_response (after 14 days)
  - submitted → interview_requested (on email detection - Epic 6)
  - submitted → rejected (on rejection email - Epic 6)
  - interview_requested → interviewing (on interview scheduled - Epic 8)
  - interviewing → rejected (post-interview rejection)
  - interviewing → offer (offer received)
  - offer → accepted (user accepts)
  - offer → declined (user declines)
  - any active state → withdrawn (user withdraws)
- [ ] Automated status updates:
  - **No response timeout**: submitted → no_response after 14 days (configurable)
  - **Email parsing** (Epic 6): detect interview requests, rejections
  - **Interview outcomes** (Epic 8): update based on interview results
- [ ] Database migration: `012_application_status_transitions.sql`
- [ ] Table created: `application_status_history`
  - Columns: `id`, `application_id`, `from_status`, `to_status`, `transition_reason`, `transitioned_by` (user/system), `transitioned_at`
  - Track all status changes for auditing
- [ ] Status transition validation:
  - Check if transition is valid before updating
  - Return error message for invalid transitions
  - Log attempted invalid transitions
- [ ] Workflow triggers on status change:
  - **submitted**: send confirmation notification (Epic 6)
  - **interview_requested**: create interview record (Epic 8), notify user
  - **rejected**: update analytics, suggest similar jobs
  - **offer**: notify user (high priority), suggest negotiation resources
  - **no_response**: mark as closed, suggest follow-up
- [ ] n8n workflow created: "Application Status Automation"
  - Cron: daily at midnight
  - Find applications with submitted status > 14 days
  - Update to no_response
  - Log transitions
  - Send notification summary
- [ ] API endpoint: `POST /api/applications/{id}/transition`
  - Accepts: `to_status`, `reason`, `notes`
  - Validates transition
  - Updates status
  - Records history
  - Triggers workflows
  - Returns success/error
- [ ] Status change notifications:
  - Optional: email/Telegram on status change
  - User configurable per status type
  - Batch notifications (daily digest option)

**Technical Notes**:
- Use database enum for status values (enforce at DB level)
- Implement state machine pattern (clear transition rules)
- Consider using database triggers for history logging
- Store transition reasons for analytics
- Use event-driven architecture for workflow triggers

**Estimated Time**: 10-12 hours

---

### Story 5.9: Application Analytics Dashboard

**As a** user
**I want** to view analytics and insights about my application performance
**So that** I can optimize my job search strategy and identify successful patterns

**Acceptance Criteria**:
- [ ] NextJS page created: `/app/analytics/page.tsx`
- [ ] Key metrics cards (top of page):
  - Total applications (all time)
  - Interview rate (% of applications → interview)
  - Average response time (days from application to first response)
  - Active applications (not in terminal status)
  - Success rate (% interviews → offers)
  - Current month applications
- [ ] Time-series chart: "Applications Over Time"
  - Line chart showing applications per day/week/month
  - Toggle: daily, weekly, monthly view
  - Color-coded by status (submitted, interview, rejected, offer)
  - Hover tooltips with exact counts
- [ ] Funnel visualization: "Application Funnel"
  - Stages: Matched → Submitted → Response → Interview → Offer
  - Show drop-off at each stage
  - Conversion rates between stages
  - Click to view applications in each stage
- [ ] Platform performance table:
  - Rows: Remote OK, WWR, Himalayas, YC Jobs, Wellfound, Other
  - Columns: Applications, Response Rate, Interview Rate
  - Sortable by any column
  - Highlight best-performing platform
- [ ] Industry/job type breakdown:
  - Pie chart: applications by industry
  - Pie chart: applications by job type (frontend, backend, etc.)
  - Stacked bar: success rate by category
- [ ] Top companies chart:
  - Bar chart: most applications sent to which companies
  - Color-coded by outcome (pending, interview, rejected)
  - Click to view all applications to that company
- [ ] Skills analysis:
  - Word cloud or tag cloud: most common skills in applied jobs
  - Success rate by skill (which skills lead to interviews)
  - Recommended skills to add (based on successful applications)
- [ ] Date range filter:
  - Dropdown: Last 7 days, Last 30 days, Last 3 months, All time
  - Custom date range picker
  - All charts/metrics update based on filter
- [ ] Project comparison:
  - If multiple projects: compare performance side-by-side
  - Metrics: applications, interview rate, time to response
  - Identify most successful project
- [ ] Export options:
  - "Export Report" button → PDF or CSV
  - Includes all charts and metrics
  - Timestamped for record-keeping
- [ ] Insights section:
  - Auto-generated insights:
    - "Your interview rate is 12%, above average (8%)"
    - "Most interviews from [platform]"
    - "Best response rate on [days of week]"
    - "[Skill] appears in 80% of your interviews"
- [ ] Responsive design (desktop focused, tablet support)

**Technical Notes**:
- Use Recharts for data visualization
- Implement efficient aggregation queries (PostgreSQL)
- Consider caching analytics data (refresh hourly)
- Use Server Components for initial data load
- Client Components for interactive filtering
- Store generated insights (don't recalculate every page load)

**Estimated Time**: 14-16 hours

---

### Story 5.10: Manual Application Entry

**As a** user
**I want** to manually log applications I submitted outside the automated system
**So that** I can track all my job applications in one place

**Acceptance Criteria**:
- [ ] "Add Manual Application" button on applications dashboard
- [ ] Manual entry form (`/app/applications/manual/new/page.tsx`):
  - **Job Information** (required):
    - Job title (text input, max 200 chars)
    - Company name (text input with autocomplete from existing companies)
    - Job URL (optional, URL validation)
    - Job description (text area, optional, 5000 char limit)
    - Source platform (dropdown: LinkedIn, Company Website, Referral, Other)
  - **Application Details** (required):
    - Date applied (date picker, defaults to today)
    - Application method (dropdown: Email, Company website, LinkedIn, Referral, Other)
    - Status (dropdown: Submitted, Interview Requested, Interviewing, etc.)
  - **Application Materials** (optional):
    - Resume used (dropdown: select from user's resume templates)
    - Cover letter used (dropdown: select from cover letter templates)
    - Upload resume file (if different from template)
    - Upload cover letter file
  - **Additional Information** (optional):
    - Contact person (hiring manager name)
    - Contact email
    - Referral source (if referred)
    - Notes (text area, 1000 char limit)
- [ ] Form validation:
  - Required fields enforced
  - URL format validation
  - Date validation (not in future)
  - File upload validation (PDF/DOCX, max 5MB)
- [ ] Duplicate detection on manual entry:
  - Check by job URL (if provided)
  - Check by company + job title (fuzzy match)
  - Show warning if potential duplicate found
  - Allow user to proceed or cancel
- [ ] Save action:
  - API call: `POST /applications` with `source=manual` flag
  - Create application record with manual flag
  - Store uploaded files in storage
  - Redirect to application detail page
  - Success toast: "Manual application added"
- [ ] Bulk import option:
  - "Import from CSV" button
  - Upload CSV file with columns: title, company, url, applied_date, status
  - Validate CSV format
  - Preview imported records before saving
  - Bulk create applications
  - Show import summary (X created, Y skipped as duplicates)
- [ ] Quick add mode:
  - Simplified form with only essential fields:
    - Job title, company, date applied, status
  - "Add Another" button (stays on form after save)
  - Useful for quick logging of multiple applications
- [ ] Integration with tracking:
  - Manual applications appear in dashboard with "Manual" badge
  - Included in all analytics and reports
  - Can update status, add notes same as automated applications
  - Can associate with application project (optional)
- [ ] Edit manual application:
  - All fields editable (unlike automated applications)
  - Update endpoint: `PATCH /applications/{id}`
  - Maintain edit history

**Technical Notes**:
- Store manual flag: `is_manual_entry=true` column
- Allow more flexibility for manual entries (missing data OK)
- File storage for uploaded resumes/cover letters
- CSV parsing library (Papa Parse or similar)
- Consider importing from LinkedIn/email archives (future enhancement)

**Estimated Time**: 10-12 hours

---

## Epic Summary

**Total Stories**: 10
**Total Estimated Time**: 3-4 weeks (developer time)
**Blocking**: No - This completes Phase 1 MVP

**Completion Checklist**:
- [ ] Story 5.1: Semi Auto review queue UI
- [ ] Story 5.2: Full Auto submission workflow
- [ ] Story 5.3: Application form automation
- [ ] Story 5.4: User profile management
- [ ] Story 5.5: Application tracking dashboard
- [ ] Story 5.6: Application detail page
- [ ] Story 5.7: Duplicate prevention system
- [ ] Story 5.8: Status workflow automation
- [ ] Story 5.9: Application analytics dashboard
- [ ] Story 5.10: Manual application entry

**Ready to Proceed When**:
- All 10 stories completed
- Both Semi Auto and Full Auto modes working
- Applications tracked through full lifecycle
- Duplicate prevention prevents errors
- Analytics provide actionable insights
- Manual entry allows comprehensive tracking

---

## Definition of Done

This epic is complete when:

1. **Dual-Mode Automation Works**: Semi Auto (review queue) and Full Auto (automatic submission) both functional
2. **Form Automation Deployed**: Email applications working reliably; external form automation planned for Phase 2
3. **Comprehensive Tracking**: All applications tracked from submission through terminal status
4. **Analytics Functional**: Dashboard provides insights on application performance and success patterns
5. **Duplicate Prevention**: System prevents accidental duplicate applications
6. **Status Management**: Automated status transitions and workflow triggers operational
7. **User Profile Complete**: Profile data enables accurate form filling
8. **Manual Entry Available**: Users can log external applications for complete tracking
9. **Quality Validated**: 90%+ of applications successfully tracked without errors
10. **User Satisfaction**: Users report improved job search management and insights

---

## Technical Dependencies

**Epic 4 Completion**:
- Customized resumes and cover letters available
- Quality scoring system operational
- Template management working

**Database Schema**:
- `applications` table with all status and tracking columns
- `user_profiles` table for form automation data
- `application_status_history` table for audit trail
- Additional columns for manual entries and submission tracking

**External Services**:
- SMTP configured for email applications (from Epic 0)
- Storage for uploaded resumes/cover letters (Supabase or Railway)
- PDF generation library for resume/cover letter export

**Infrastructure**:
- n8n workflows for automation
- Rate limiting system for submissions
- File storage with appropriate access controls

---

## Risk Mitigation

**Risk**: Email applications marked as spam by recipients
- **Mitigation**: Use reputable email provider; implement SPF/DKIM/DMARC; warm up email sending; respect daily limits
- **Fallback**: Manual submission links; notify user to submit manually

**Risk**: Form automation detected and blocked (bot detection)
- **Mitigation**: Use Puppeteer stealth plugin; implement human-like delays; rotate proxies if needed
- **Fallback**: Generate pre-filled form links; manual completion

**Risk**: Duplicate detection has false positives (blocks valid applications)
- **Mitigation**: Use multiple detection methods; allow user override; tune similarity thresholds
- **Fallback**: Always provide "Apply Anyway" option with confirmation

**Risk**: Status automation updates status incorrectly
- **Mitigation**: Implement strict state machine validation; require manual confirmation for critical transitions; maintain full audit trail
- **Fallback**: Allow manual status override; log all automated updates for review

**Risk**: Daily application limits hit during peak matching
- **Mitigation**: Distribute submissions throughout day; prioritize by match score; respect user-defined caps
- **Fallback**: Queue excess applications for next day; notify user of queue

---

## Success Metrics

- ✅ Semi Auto approval rate: >70% of queued applications approved
- ✅ Full Auto submission success rate: >95% successfully submitted
- ✅ Duplicate prevention accuracy: >98% (minimal false positives/negatives)
- ✅ Application tracking completeness: 100% of applications have status data
- ✅ Status automation accuracy: >90% of automated status updates correct
- ✅ Analytics usage: >60% of users view analytics at least weekly
- ✅ Manual entry usage: >30% of users log external applications
- ✅ User satisfaction: >80% report improved job search organization

---

## Next Steps

After completing Epic 5, **Phase 1 MVP is complete!** The system can:
- Scrape jobs from 5 platforms daily
- Enrich jobs with AI metadata and semantic embeddings
- Match jobs to user-defined application projects
- Generate customized resumes and cover letters
- Submit applications (email method) with user control
- Track applications through full lifecycle
- Provide analytics and insights

**Phase 2 Enhancement Epics** (Optional):
- Epic 6: Telegram Integration (push notifications, interactive approval)
- Epic 7: Email Response Monitoring (automated status updates from emails)
- Epic 8: Interview Management & Scheduling (Google Calendar integration)
- Epic 9: Analytics Dashboard & Insights (advanced visualizations)
- Epic 10: System Monitoring & Optimization (production monitoring, cost tracking)

Congratulations on completing Phase 1 MVP planning! 🎉
