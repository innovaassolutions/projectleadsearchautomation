# Story 2.1: Remote OK API Integration

**Epic**: 2 - Job Discovery & Enrichment Pipeline
**Story ID**: 2.1
**Estimated Time**: 4-6 hours

---

## User Story

**As a** system
**I want** to scrape jobs from Remote OK using their public API
**So that** I can discover remote job opportunities from one of the largest platforms

---

## Acceptance Criteria

- [ ] n8n workflow created: "Remote OK Job Scraper"
- [ ] HTTP Request node configured to call Remote OK API
  - Endpoint: `https://remoteok.com/api`
  - Method: GET
  - Headers: User-Agent specified
- [ ] Response parsing extracts required fields:
  - Job title, company name, URL, description
  - Tags/skills, salary (if available), posted date
  - Location, job type (full-time, contract, etc.)
- [ ] Rate limiting implemented (1 request per 60 seconds minimum)
- [ ] Error handling for API failures (retry 3x with exponential backoff)
- [ ] Deduplication by URL before storage
- [ ] Workflow logs job count scraped per execution
- [ ] Cron trigger set for daily execution (9:00 AM UTC)
- [ ] Test execution scrapes minimum 20 jobs successfully
- [ ] Workflow exported to `/apps/n8n-workflows/remote-ok-scraper.json`

---

## Technical Notes

- Remote OK provides public JSON API (no authentication required)
- API returns large array of jobs (200-300+)
- Implement pagination if API supports it
- Store raw response for debugging

---

## Dependencies

- Epic 1 completed (n8n workflow engine deployed)
- PostgreSQL `jobs` table schema ready
- PostgREST API accessible for data insertion

---

## Definition of Done

- [ ] Workflow executes successfully on schedule
- [ ] Jobs are stored in database without duplicates
- [ ] Error handling prevents workflow crashes
- [ ] Logs show scraping statistics (job count, execution time)
- [ ] Team can manually trigger workflow from n8n UI
