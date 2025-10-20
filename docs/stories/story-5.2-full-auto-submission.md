# Story 5.2: Full Auto Submission Workflow

**Epic**: 5 - Application Submission & Tracking
**Story ID**: 5.2
**Estimated Time**: 12-14 hours

---

## User Story

**As a** system
**I want** to automatically submit applications for matched jobs in Full Auto mode
**So that** users can achieve high-volume applications without manual intervention

---

## Acceptance Criteria

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

---

## Technical Notes

- Implement submission queue to manage rate limiting
- Use database transactions for status updates
- Consider time-of-day optimization (submit during business hours)
- Log all submission attempts for auditing

---

## Dependencies

- Story 5.1 completed (Semi Auto mode as reference)
- Story 5.7 completed (duplicate prevention)
- Epic 4 completed (customized materials ready)
- n8n workflow engine operational

---

## Definition of Done

- [ ] Full Auto workflow submits applications automatically
- [ ] Pre-submission checks prevent errors
- [ ] Rate limiting prevents suspicious patterns
- [ ] Error handling manages failures gracefully
- [ ] Statistics tracked accurately
