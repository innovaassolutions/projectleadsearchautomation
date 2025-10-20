# Story 2.5: Wellfound (AngelList) Headless Browser Scraper

**Epic**: 2 - Job Discovery & Enrichment Pipeline
**Story ID**: 2.5
**Estimated Time**: 8-10 hours

---

## User Story

**As a** system
**I want** to scrape jobs from Wellfound using headless browser automation
**So that** I can discover startup opportunities requiring JavaScript rendering

---

## Acceptance Criteria

- [ ] n8n workflow created: "Wellfound Scraper"
- [ ] Puppeteer or Playwright node configured in n8n
- [ ] Headless browser navigates to Wellfound search
  - URL: `https://wellfound.com/jobs`
  - Filters: remote, role type (software engineer)
- [ ] JavaScript rendering waits for job cards to load
- [ ] Scraping extracts:
  - Job title, company name, company stage
  - Salary range, equity, location
  - Job description (via detail page navigation)
  - Application URL
- [ ] Pagination handled (scrape first 3-5 pages)
- [ ] Screenshots captured for debugging (first page only)
- [ ] Rate limiting: 5 seconds between pages
- [ ] Deduplication by URL
- [ ] Headless browser cleanup after execution
- [ ] Cron trigger: daily at 11:00 AM UTC
- [ ] Test execution scrapes minimum 15 jobs
- [ ] Workflow exported to `/apps/n8n-workflows/wellfound-scraper.json`

---

## Technical Notes

- Wellfound requires JavaScript rendering (React app)
- Headless browser increases resource usage
- May need Railway worker service with sufficient memory (2GB+)
- Monitor for detection/blocking

---

## Dependencies

- Epic 1 completed
- Railway worker service with 2GB+ RAM
- Puppeteer/Playwright installed in n8n environment
- Previous scrapers completed as reference

---

## Definition of Done

- [ ] Workflow successfully renders JavaScript and scrapes jobs
- [ ] Pagination works correctly
- [ ] Memory usage stays within Railway limits
- [ ] Browser cleanup prevents memory leaks
- [ ] Jobs with startup-specific data (equity, stage) captured
