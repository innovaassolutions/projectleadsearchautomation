# Story 5.10: Manual Application Entry

**Epic**: 5 - Application Submission & Tracking
**Story ID**: 5.10
**Estimated Time**: 10-12 hours

---

## User Story

**As a** user
**I want** to manually log applications I submitted outside the automated system
**So that** I can track all my job applications in one place

---

## Acceptance Criteria

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

---

## Technical Notes

- Store manual flag: `is_manual_entry=true` column
- Allow more flexibility for manual entries (missing data OK)
- File storage for uploaded resumes/cover letters
- CSV parsing library (Papa Parse or similar)
- Consider importing from LinkedIn/email archives (future enhancement)

---

## Dependencies

- Story 5.5 completed (applications dashboard)
- Story 5.7 completed (duplicate detection)
- File storage configured
- Form validation library

---

## Definition of Done

- [ ] Manual entry form captures all data
- [ ] Duplicate detection warns on similar entries
- [ ] Applications saved and appear in dashboard
- [ ] Bulk CSV import functional
- [ ] Manual applications integrated with tracking
- [ ] Edit functionality works for manual entries
