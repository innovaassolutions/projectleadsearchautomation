# Story 5.7: Duplicate Application Prevention

**Epic**: 5 - Application Submission & Tracking
**Story ID**: 5.7
**Estimated Time**: 8-10 hours

---

## User Story

**As a** system
**I want** to prevent duplicate applications to the same job
**So that** users don't accidentally apply multiple times and damage credibility

---

## Acceptance Criteria

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

---

## Technical Notes

- Use PostgreSQL full-text search for title matching
- Use pgvector cosine similarity for description matching
- Set similarity threshold: >0.95 for job descriptions
- Consider time window (jobs reposted after 30 days OK)
- Log all duplicate detections for quality monitoring

---

## Dependencies

- Database has applications data
- pgvector extension for similarity matching
- Full-text search configured

---

## Definition of Done

- [ ] Duplicate detection prevents exact matches
- [ ] Fuzzy matching warns on similar jobs
- [ ] User can override warnings with confirmation
- [ ] Integration with workflows working
- [ ] Detection accuracy >98%
