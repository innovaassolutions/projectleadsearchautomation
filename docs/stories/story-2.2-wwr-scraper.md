# Story 2.2: We Work Remotely HTML Scraper

**Epic**: 2 - Job Discovery & Enrichment Pipeline
**Story ID**: 2.2
**Estimated Time**: 6-8 hours

---

## User Story

**As a** system
**I want** to scrape jobs from We Work Remotely via HTML parsing
**So that** I can discover remote jobs from this curated platform

---

## Acceptance Criteria

- [ ] n8n workflow created: "We Work Remotely Scraper"
- [ ] HTTP Request node fetches HTML from target categories:
  - `https://weworkremotely.com/remote-jobs/search?term=software`
  - Additional categories as configured
- [ ] HTML parsing extracts job cards with CSS selectors
- [ ] Extracted fields:
  - Job title (`.title` selector)
  - Company name (`.company` selector)
  - Job URL (absolute URL constructed)
  - Posted date (relative time parsed)
  - Category/tags
- [ ] Individual job detail pages fetched for full description
- [ ] Rate limiting: 2-3 seconds between requests
- [ ] User-Agent rotation (3-5 realistic user agents)
- [ ] Error handling for HTML structure changes
- [ ] Deduplication by URL
- [ ] Cron trigger: daily at 9:30 AM UTC
- [ ] Test execution scrapes minimum 15 jobs
- [ ] Workflow exported to `/apps/n8n-workflows/wwr-scraper.json`

---

## Technical Notes

- WWR does not provide API; requires HTML parsing
- Use `cheerio` or n8n HTML Extract node
- Respect robots.txt
- Monitor for HTML structure changes

---

## Dependencies

- Epic 1 completed (n8n workflow engine deployed)
- PostgreSQL `jobs` table ready
- Remote OK scraper (Story 2.1) completed as reference

---

## Definition of Done

- [ ] Workflow executes successfully on daily schedule
- [ ] Jobs scraped and stored without duplicates
- [ ] HTML parsing handles structure variations gracefully
- [ ] Full job descriptions captured
- [ ] Workflow does not violate ToS or get blocked
