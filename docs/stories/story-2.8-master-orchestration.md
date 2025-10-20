# Story 2.8: Master Orchestration Workflow

**Epic**: 2 - Job Discovery & Enrichment Pipeline
**Story ID**: 2.8
**Estimated Time**: 6-8 hours

---

## User Story

**As a** system
**I want** a master n8n workflow that orchestrates all scraping, enrichment, and embedding tasks
**So that** the entire pipeline runs reliably on a daily schedule

---

## Acceptance Criteria

- [ ] n8n workflow created: "Master Job Discovery Orchestration"
- [ ] Cron trigger: daily at 9:00 AM UTC
- [ ] Workflow executes in sequence:
  1. Trigger all 5 scraper workflows (parallel execution)
  2. Wait for all scrapers to complete (merge node)
  3. Count total new jobs scraped
  4. Trigger OpenAI enrichment workflow (batch of new jobs)
  5. Wait for enrichment to complete
  6. Trigger embedding generation workflow
  7. Wait for embeddings to complete
  8. Log final job count and execution time
- [ ] Error handling at each stage:
  - Individual scraper failures don't block entire pipeline
  - Failed jobs logged to error table
  - Telegram notification sent on critical failures
- [ ] Success metrics logged:
  - Total jobs scraped per platform
  - Enrichment success rate
  - Embedding generation success rate
  - Total execution time
- [ ] Workflow completion triggers Telegram notification (summary)
- [ ] Manual execution mode for testing and backfill
- [ ] Workflow exported to `/apps/n8n-workflows/master-orchestration.json`

---

## Technical Notes

- Use n8n's "Merge" node to wait for parallel workflows
- Set workflow timeout to 60 minutes (to handle large scrapes)
- Use n8n's error workflow feature for centralized error handling
- Consider exponential backoff for transient failures

---

## Dependencies

- All scraper workflows (Stories 2.1-2.5) completed
- OpenAI enrichment workflow (Story 2.6) completed
- Embedding generation workflow (Story 2.7) completed
- Telegram bot configured (optional for Epic 2, required in Epic 6)

---

## Definition of Done

- [ ] Master workflow runs daily without manual intervention
- [ ] All sub-workflows execute correctly
- [ ] Error handling prevents complete pipeline failure
- [ ] Success metrics logged and visible
- [ ] Telegram notifications sent (if configured)
- [ ] Pipeline completes in <2 hours
