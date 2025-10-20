# Story 5.3: Application Form Automation

**Epic**: 5 - Application Submission & Tracking
**Story ID**: 5.3
**Estimated Time**: 14-16 hours

---

## User Story

**As a** system
**I want** to automatically fill and submit application forms on job platforms
**So that** applications are submitted without manual data entry

---

## Acceptance Criteria

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

---

## Technical Notes

- Start with email applications for MVP (most reliable)
- Add headless browser automation in Phase 2
- Use Puppeteer with stealth plugin to avoid detection
- Store submission logs for troubleshooting
- Consider using proxy rotation for form submissions

---

## Dependencies

- Story 5.4 completed (user profile data)
- SMTP configured (from Epic 0)
- PDF generation library installed
- File storage configured

---

## Definition of Done

- [ ] Email application automation working
- [ ] PDF generation produces formatted resumes/cover letters
- [ ] User profile data used for form filling
- [ ] Submission tracking captures confirmations
- [ ] Fallback for complex forms functional
