# Story 2.10: Job Listings UI

**Epic**: 2 - Job Discovery & Enrichment Pipeline
**Story ID**: 2.10
**Estimated Time**: 8-10 hours

---

## User Story

**As a** user
**I want** to view all discovered jobs in a paginated, filterable list
**So that** I can browse available opportunities and verify the scraping pipeline is working

---

## Acceptance Criteria

- [ ] NextJS page created: `/app/jobs/page.tsx`
- [ ] Job listings fetched from PostgREST API:
  - Endpoint: `GET /jobs?order=scraped_at.desc&archived_at=is.null`
  - Pagination: 50 jobs per page
  - Filters: source, tags, seniority, posted date range
- [ ] UI displays job cards with:
  - Job title (linked to detail page)
  - Company name
  - Source platform badge (Remote OK, WWR, etc.)
  - Tags/skills (up to 5 displayed, expandable)
  - Seniority level badge
  - Salary range (if available)
  - Posted date (relative time: "2 days ago")
  - "View Details" button
- [ ] Filtering sidebar:
  - Source platform (multi-select checkboxes)
  - Seniority level (dropdown)
  - Tags/skills (searchable multi-select)
  - Date range (past 7 days, 14 days, 30 days)
- [ ] Search bar for keyword search (title + description)
- [ ] Pagination controls (previous, next, page numbers)
- [ ] Empty state: "No jobs found" with suggested actions
- [ ] Loading state: skeleton loaders while fetching
- [ ] Responsive design (desktop + tablet)
- [ ] URL query params preserve filters/pagination (shareable URLs)
- [ ] Job count displayed: "Showing 1-50 of 237 jobs"

---

## Technical Notes

- Use Server Components for initial data fetch
- Use Client Component for interactive filters
- Implement query param state management (next/navigation)
- Use shadcn/ui Card, Badge, Button components
- Consider adding "bookmark" feature (future enhancement)

---

## Dependencies

- Epic 1 completed (NextJS app, shadcn/ui configured)
- All scraper workflows (Stories 2.1-2.5) generating jobs
- OpenAI enrichment (Story 2.6) providing metadata
- Database populated with jobs and enrichment data

---

## Definition of Done

- [ ] Job listings page accessible at `/jobs`
- [ ] All jobs displayed with enriched metadata
- [ ] Filtering and search work correctly
- [ ] Pagination handles large datasets
- [ ] UI is responsive (desktop + tablet)
- [ ] Performance: page loads in <2 seconds
- [ ] Empty and loading states handled gracefully
