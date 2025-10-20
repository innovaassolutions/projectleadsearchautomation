# Story 2.3: Himalayas Job Board Scraper

**Epic**: 2 - Job Discovery & Enrichment Pipeline
**Story ID**: 2.3
**Estimated Time**: 6-8 hours

---

## User Story

**As a** system
**I want** to scrape jobs from Himalayas using their job listings
**So that** I can discover remote opportunities from this growing platform

---

## Acceptance Criteria

- [ ] n8n workflow created: "Himalayas Scraper"
- [ ] HTTP Request node fetches Himalayas search results
  - URL: `https://himalayas.app/jobs`
  - Query params: remote filter, role filters
- [ ] HTML parsing or API detection (check for JSON endpoint)
- [ ] Extracted fields:
  - Job title, company, URL, description preview
  - Skills/tags, salary range, location
  - Posted date, application deadline
- [ ] Full job description fetched from detail page
- [ ] Rate limiting: 2-3 seconds between requests
- [ ] Deduplication by URL
- [ ] Error handling for rate limiting responses (429 status)
- [ ] Cron trigger: daily at 10:00 AM UTC
- [ ] Test execution scrapes minimum 10 jobs
- [ ] Workflow exported to `/apps/n8n-workflows/himalayas-scraper.json`

---

## Technical Notes

- Himalayas may have undocumented API (inspect network tab)
- Fallback to HTML parsing if no API found
- Platform is newer; structure may change frequently

---

## Dependencies

- Epic 1 completed
- Previous scrapers (2.1, 2.2) as reference patterns
- Database schema ready for additional fields

---

## Definition of Done

- [ ] Workflow scrapes jobs successfully
- [ ] All required fields captured
- [ ] Error handling prevents blocking/failures
- [ ] Jobs stored without duplicates
- [ ] Platform-specific fields (salary, deadline) captured
