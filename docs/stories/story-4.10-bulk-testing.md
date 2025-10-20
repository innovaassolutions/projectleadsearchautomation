# Story 4.10: Bulk Testing and Quality Assurance Workflow

**Epic**: 4 - AI-Powered Application Customization
**Story ID**: 4.10
**Estimated Time**: 12-14 hours

---

## User Story

**As a** user
**I want** to test resume/cover letter generation on multiple jobs at once
**So that** I can validate quality before enabling automation

---

## Acceptance Criteria

- [ ] Bulk testing page created: `/app/templates/test/page.tsx`
- [ ] Test configuration form:
  - Select resume template to test
  - Select cover letter template to test
  - Select test job set:
    - Option 1: Random sample (size: 5, 10, 20)
    - Option 2: Specific jobs (multi-select from job list)
    - Option 3: Jobs from specific project
  - Enable/disable quality scoring
  - Run A/B test variants (optional)
- [ ] "Start Test" button triggers workflow:
  - Creates test batch record in database
  - Queues customization jobs for each test job
  - Shows progress indicator
- [ ] Database migration: `010_bulk_tests.sql`
- [ ] Table created: `bulk_test_batches`
  - Columns: `id`, `user_id`, `resume_template_id`, `cover_letter_template_id`, `test_job_count`, `status`, `started_at`, `completed_at`
- [ ] Table created: `bulk_test_results`
  - Columns: `id`, `batch_id`, `job_id`, `customized_resume_json`, `customized_cover_letter_text`, `resume_quality_score`, `cover_letter_quality_score`, `generation_time_ms`, `tokens_used`, `cost_usd`
- [ ] Test execution:
  - Process jobs in parallel (5 concurrent max)
  - Generate customized resume and cover letter for each
  - Calculate quality scores
  - Track generation time and cost
  - Store results in `bulk_test_results`
- [ ] Results dashboard:
  - Test summary:
    - Jobs tested
    - Average quality scores (resume and cover letter)
    - Total cost ($X.XX)
    - Total time (X minutes)
  - Results table:
    - Job title, company
    - Quality scores (color-coded)
    - "View Details" link → preview generated materials
  - Filtering: show only low-quality (score < 70)
  - Export results as CSV
- [ ] Test actions:
  - "Approve Template" - mark template as production-ready
  - "Revise Template" - identify issues and return to editor
  - "Run Again" - retry with different parameters
- [ ] Cost projection before test:
  - Estimate cost based on job count
  - Show confirmation: "This test will cost approximately $X.XX"

---

## Technical Notes

- Use n8n workflow or API endpoint for batch processing
- Implement rate limiting for OpenAI API
- Use database queue for job processing
- Calculate cost based on tokens used
- Consider caching to reduce redundant API calls
- Store test results for historical analysis

---

## Dependencies

- Story 4.3 and 4.4 completed (customization engines)
- Story 4.7 completed (quality scoring)
- n8n workflows operational
- Database tables for bulk testing created

---

## Definition of Done

- [ ] Users can configure and run bulk tests
- [ ] Tests execute in parallel efficiently
- [ ] Results dashboard shows all metrics
- [ ] Quality scores identify issues
- [ ] Cost projection helps users budget
- [ ] Test results can be exported for analysis
