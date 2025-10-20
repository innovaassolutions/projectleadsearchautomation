# Story 2.4: Y Combinator Jobs Scraper

**Epic**: 2 - Job Discovery & Enrichment Pipeline
**Story ID**: 2.4
**Estimated Time**: 6-8 hours

---

## User Story

**As a** system
**I want** to scrape YC-funded company job postings from Work at a Startup
**So that** I can discover opportunities at YC portfolio companies

---

## Acceptance Criteria

- [ ] n8n workflow created: "YC Jobs Scraper"
- [ ] HTTP Request node fetches YC Work at a Startup listings
  - URL: `https://www.workatastartup.com/jobs`
  - Filters: engineering, remote allowed
- [ ] Parsing strategy determined (HTML or API)
- [ ] Extracted fields:
  - Job title, company name, YC batch
  - Job description, location/remote status
  - Application URL, skills/experience required
- [ ] Company metadata captured (YC batch, funding stage)
- [ ] Rate limiting: 2-3 seconds between requests
- [ ] Deduplication by URL
- [ ] Special tag applied: "YC Portfolio"
- [ ] Cron trigger: daily at 10:30 AM UTC
- [ ] Test execution scrapes minimum 10 jobs
- [ ] Workflow exported to `/apps/n8n-workflows/yc-jobs-scraper.json`

---

## Technical Notes

- YC maintains curated job board for portfolio companies
- Jobs often high-quality but competitive
- May require JavaScript rendering (use headless browser if needed)

---

## Dependencies

- Epic 1 completed
- Previous scrapers as reference
- Database schema supports company metadata

---

## Definition of Done

- [ ] Workflow scrapes YC jobs successfully
- [ ] YC portfolio metadata captured (batch, funding)
- [ ] Special "YC Portfolio" tag applied automatically
- [ ] Jobs stored with high quality data
- [ ] Workflow handles JavaScript rendering if required
