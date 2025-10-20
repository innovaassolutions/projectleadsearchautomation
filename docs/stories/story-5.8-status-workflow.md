# Story 5.8: Application Status Workflow Automation

**Epic**: 5 - Application Submission & Tracking
**Story ID**: 5.8
**Estimated Time**: 10-12 hours

---

## User Story

**As a** system
**I want** to automatically manage application status transitions and trigger workflows
**So that** status changes flow logically and trigger appropriate actions

---

## Acceptance Criteria

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

---

## Technical Notes

- Use database enum for status values (enforce at DB level)
- Implement state machine pattern (clear transition rules)
- Consider using database triggers for history logging
- Store transition reasons for analytics
- Use event-driven architecture for workflow triggers

---

## Dependencies

- Database schema includes applications table
- n8n workflow engine operational
- Status history table created

---

## Definition of Done

- [ ] State machine enforces valid transitions
- [ ] Automated timeout updates status correctly
- [ ] Status history tracks all changes
- [ ] Workflow triggers fire on status changes
- [ ] API endpoint validates and updates status
