# Epic 2: Job Discovery & Enrichment Pipeline

> **Phase**: 1 (MVP)
> **Estimated Time**: 3-4 weeks
> **Must Complete Before**: Epic 3 (Job Management Dashboard)
> **Depends On**: Epic 1 (Foundation & Core Infrastructure)
> **Status**: Not Started
> **Stories**: 10

---

## Overview

Build automated job scraping from all target platforms (Remote OK, We Work Remotely, Himalayas, Y Combinator Jobs, Wellfound), implement AI enrichment with OpenAI for metadata generation and semantic embeddings using pgvector, establish deduplication and storage workflows, create master orchestration workflow in n8n, implement job archival, and deploy job listings UI.

**Why This Matters**: This epic establishes the automated job discovery pipeline that feeds the entire system. Without reliable job ingestion and enrichment, no applications can be processed. The semantic embeddings enable intelligent matching in later epics.

---

## Epic Goal

Deploy a fully automated job discovery pipeline that scrapes 100-200+ jobs daily from 5 platforms, enriches them with AI-generated metadata, stores them with semantic embeddings for intelligent matching, and presents them in a browsable UI—all orchestrated by n8n workflows running on Railway.

---

## User Stories

### Story 2.1: Remote OK API Integration

**As a** system
**I want** to scrape jobs from Remote OK using their public API
**So that** I can discover remote job opportunities from one of the largest platforms

**Acceptance Criteria**:
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

**Technical Notes**:
- Remote OK provides public JSON API (no authentication required)
- API returns large array of jobs (200-300+)
- Implement pagination if API supports it
- Store raw response for debugging

**Estimated Time**: 4-6 hours

---

### Story 2.2: We Work Remotely HTML Scraper

**As a** system
**I want** to scrape jobs from We Work Remotely via HTML parsing
**So that** I can discover remote jobs from this curated platform

**Acceptance Criteria**:
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

**Technical Notes**:
- WWR does not provide API; requires HTML parsing
- Use `cheerio` or n8n HTML Extract node
- Respect robots.txt
- Monitor for HTML structure changes

**Estimated Time**: 6-8 hours

---

### Story 2.3: Himalayas Job Board Scraper

**As a** system
**I want** to scrape jobs from Himalayas using their job listings
**So that** I can discover remote opportunities from this growing platform

**Acceptance Criteria**:
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

**Technical Notes**:
- Himalayas may have undocumented API (inspect network tab)
- Fallback to HTML parsing if no API found
- Platform is newer; structure may change frequently

**Estimated Time**: 6-8 hours

---

### Story 2.4: Y Combinator Jobs Scraper

**As a** system
**I want** to scrape YC-funded company job postings from Work at a Startup
**So that** I can discover opportunities at YC portfolio companies

**Acceptance Criteria**:
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

**Technical Notes**:
- YC maintains curated job board for portfolio companies
- Jobs often high-quality but competitive
- May require JavaScript rendering (use headless browser if needed)

**Estimated Time**: 6-8 hours

---

### Story 2.5: Wellfound (AngelList) Headless Browser Scraper

**As a** system
**I want** to scrape jobs from Wellfound using headless browser automation
**So that** I can discover startup opportunities requiring JavaScript rendering

**Acceptance Criteria**:
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

**Technical Notes**:
- Wellfound requires JavaScript rendering (React app)
- Headless browser increases resource usage
- May need Railway worker service with sufficient memory (2GB+)
- Monitor for detection/blocking

**Estimated Time**: 8-10 hours

---

### Story 2.6: OpenAI Job Enrichment Workflow

**As a** system
**I want** to enrich scraped jobs with AI-generated metadata using OpenAI
**So that** jobs have consistent tags, seniority levels, and quality scores

**Acceptance Criteria**:
- [ ] n8n workflow created: "OpenAI Job Enrichment"
- [ ] Workflow triggered by new job insertion (webhook or polling)
- [ ] OpenAI API node configured:
  - Model: `gpt-4o-mini` (cost-effective for classification)
  - System prompt: classify job attributes
  - User prompt: job title + description (truncated to 2000 chars)
- [ ] Enrichment extracts:
  - Primary skills/technologies (array, max 10)
  - Seniority level (entry, mid, senior, staff, principal)
  - Job type (frontend, backend, fullstack, devops, data, etc.)
  - Industry/domain (fintech, healthtech, SaaS, etc.)
  - Remote policy (fully remote, hybrid, office)
  - Estimated match score (1-100) based on generic criteria
- [ ] Response parsed as JSON (use function calling or JSON mode)
- [ ] Enrichment data written to `jobs` table (new columns)
- [ ] Error handling: fallback to null values on API failure
- [ ] Cost tracking: log tokens used per enrichment
- [ ] Rate limiting: max 10 concurrent API calls
- [ ] Test with 10 sample jobs, verify classification accuracy
- [ ] Workflow exported to `/apps/n8n-workflows/openai-enrichment.json`

**Technical Notes**:
- Use OpenAI function calling for structured output
- Truncate job descriptions to stay under token limits
- Batch enrichment for efficiency (process 10 jobs at once)
- Monitor OpenAI costs closely (target <$0.05 per job)

**Estimated Time**: 6-8 hours

---

### Story 2.7: Semantic Embeddings with pgvector

**As a** system
**I want** to generate semantic embeddings for job descriptions using OpenAI
**So that** I can enable semantic similarity matching for intelligent job recommendations

**Acceptance Criteria**:
- [ ] n8n workflow created: "Generate Job Embeddings"
- [ ] Workflow triggered after OpenAI enrichment completes
- [ ] OpenAI Embeddings API node configured:
  - Model: `text-embedding-ada-002` (1536 dimensions)
  - Input: job title + description + skills (concatenated)
  - Max input length: 8191 tokens
- [ ] Embedding vector (1536 floats) returned from API
- [ ] Vector inserted into `job_embeddings` table:
  - Columns: `id`, `job_id`, `embedding` (vector type)
  - Index created for vector similarity search
- [ ] Error handling: retry embeddings on API failure
- [ ] Cost tracking: log API usage (embeddings cheaper than completions)
- [ ] Batch processing: generate embeddings for 50 jobs per run
- [ ] pgvector similarity function tested:
  - Query: find jobs similar to a given job
  - Method: cosine similarity (`<=>` operator)
- [ ] Test query returns top 10 similar jobs with similarity scores
- [ ] Workflow exported to `/apps/n8n-workflows/generate-embeddings.json`

**Technical Notes**:
- pgvector extension must be enabled (from Epic 1)
- Use `vector(1536)` data type for ada-002 embeddings
- Create GiST or HNSW index for fast similarity search
- Embedding generation is relatively cheap (~$0.0001 per 1K tokens)

**Estimated Time**: 6-8 hours

---

### Story 2.8: Master Orchestration Workflow

**As a** system
**I want** a master n8n workflow that orchestrates all scraping, enrichment, and embedding tasks
**So that** the entire pipeline runs reliably on a daily schedule

**Acceptance Criteria**:
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

**Technical Notes**:
- Use n8n's "Merge" node to wait for parallel workflows
- Set workflow timeout to 60 minutes (to handle large scrapes)
- Use n8n's error workflow feature for centralized error handling
- Consider exponential backoff for transient failures

**Estimated Time**: 6-8 hours

---

### Story 2.9: Job Archival and Cleanup

**As a** system
**I want** to automatically archive jobs older than 30 days
**So that** the database stays performant and focuses on current opportunities

**Acceptance Criteria**:
- [ ] n8n workflow created: "Job Archival and Cleanup"
- [ ] Cron trigger: weekly on Sunday at 2:00 AM UTC
- [ ] Workflow identifies jobs to archive:
  - `scraped_at` > 30 days ago
  - `archived_at` IS NULL
- [ ] Archival updates `archived_at` timestamp (soft delete)
- [ ] Optional: move archived jobs to separate table (`jobs_archive`)
- [ ] Cleanup actions:
  - Remove embeddings for archived jobs (optional, to save storage)
  - Update job listing UI to exclude archived jobs by default
- [ ] Workflow logs archival statistics:
  - Number of jobs archived
  - Disk space reclaimed (if applicable)
- [ ] Manual "unarchive" function available via API (for user bookmarks)
- [ ] Telegram notification sent with archival summary
- [ ] Test with sample dataset of 100 jobs (50 old, 50 recent)
- [ ] Workflow exported to `/apps/n8n-workflows/job-archival.json`

**Technical Notes**:
- Use soft delete (archived_at) rather than hard delete
- Add database index on `archived_at` for performance
- Consider data retention policy (hard delete after 1 year?)
- Keep archived jobs accessible for analytics

**Estimated Time**: 4-6 hours

---

### Story 2.10: Job Listings UI

**As a** user
**I want** to view all discovered jobs in a paginated, filterable list
**So that** I can browse available opportunities and verify the scraping pipeline is working

**Acceptance Criteria**:
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

**Technical Notes**:
- Use Server Components for initial data fetch
- Use Client Component for interactive filters
- Implement query param state management (next/navigation)
- Use shadcn/ui Card, Badge, Button components
- Consider adding "bookmark" feature (future enhancement)

**Estimated Time**: 8-10 hours

---

## Epic Summary

**Total Stories**: 10
**Total Estimated Time**: 3-4 weeks (developer time)
**Blocking**: Yes - Must complete before Epic 3

**Completion Checklist**:
- [ ] Story 2.1: Remote OK API integration working
- [ ] Story 2.2: We Work Remotely HTML scraper deployed
- [ ] Story 2.3: Himalayas scraper functional
- [ ] Story 2.4: Y Combinator jobs scraper operational
- [ ] Story 2.5: Wellfound headless browser scraper deployed
- [ ] Story 2.6: OpenAI enrichment workflow generating metadata
- [ ] Story 2.7: pgvector embeddings created for semantic search
- [ ] Story 2.8: Master orchestration workflow running daily
- [ ] Story 2.9: Job archival workflow cleaning up old jobs
- [ ] Story 2.10: Job listings UI deployed and functional

**Ready to Proceed When**:
- All 10 stories completed
- Daily scraping consistently delivers 100-200+ jobs
- Enrichment pipeline processes all jobs within 1 hour
- Semantic embeddings enable similarity queries
- Job listings UI displays current opportunities
- Master orchestration runs without manual intervention

---

## Definition of Done

This epic is complete when:

1. **Scraping Pipeline Live**: All 5 job boards scraped daily (Remote OK, WWR, Himalayas, YC, Wellfound)
2. **AI Enrichment Working**: Jobs tagged with skills, seniority, type, industry, match score
3. **Semantic Search Ready**: pgvector embeddings enable similarity-based job discovery
4. **Master Orchestration Deployed**: n8n workflow runs full pipeline automatically
5. **Job Listings Accessible**: Users can browse, search, filter discovered jobs
6. **Data Quality Validated**: 100-200+ jobs/day with <5% errors, accurate metadata
7. **Archival Working**: Old jobs automatically archived, database stays performant

---

## Technical Dependencies

**Epic 1 Completion**:
- PostgreSQL with pgvector extension enabled
- PostgREST API server deployed
- n8n workflow engine configured on Railway
- Database schema with `jobs`, `job_embeddings` tables

**External Services**:
- OpenAI API key for enrichment and embeddings (from Epic 0)
- Job board access (no authentication required for most)
- Puppeteer/Playwright for headless browser (Wellfound)

**Infrastructure**:
- Railway worker service with 2GB+ RAM (for headless browser)
- n8n workflow persistence (database-backed)
- Telegram bot for notifications (optional for Epic 2, required in Epic 6)

---

## Risk Mitigation

**Risk**: Job board HTML structures change, breaking scrapers
- **Mitigation**: Implement error detection and Telegram alerts; maintain scraper library with fallback strategies
- **Fallback**: Prioritize API-based sources (Remote OK); use backup scraping services if needed

**Risk**: OpenAI API costs exceed budget ($0.10/job target)
- **Mitigation**: Use gpt-4o-mini for enrichment ($0.01-0.03/job); monitor token usage closely
- **Fallback**: Reduce enrichment frequency; use cheaper models or local LLMs

**Risk**: Rate limiting or blocking by job boards
- **Mitigation**: Implement respectful delays (2-5 seconds), rotate user agents, respect robots.txt
- **Fallback**: Use proxy services; reduce scraping frequency; focus on API sources

**Risk**: pgvector performance issues with large embedding datasets
- **Mitigation**: Create HNSW index for fast approximate similarity search
- **Fallback**: Implement pre-filtering (by tags) before vector search

**Risk**: Headless browser (Wellfound) consumes excessive Railway resources
- **Mitigation**: Run scraper less frequently (every 2-3 days); optimize Puppeteer settings
- **Fallback**: Use simpler scraping methods; deprioritize Wellfound if costs are too high

---

## Success Metrics

- ✅ 100-200+ jobs scraped daily across 5 platforms
- ✅ Enrichment success rate >95%
- ✅ Embedding generation completes within 1 hour of scraping
- ✅ Master orchestration completes in <2 hours per daily run
- ✅ Job listings UI loads in <2 seconds
- ✅ Zero manual intervention required for daily pipeline
- ✅ OpenAI costs remain under $5/day for enrichment + embeddings

---

## Next Steps

After completing Epic 2, proceed to **Epic 3: Job Management Dashboard** where you will:
- Build job browsing with advanced filtering and search
- Implement semantic similarity "More Like This" feature
- Create job bookmarking and save functionality
- Design mobile-responsive job cards
- Implement infinite scroll or advanced pagination

Epic 3 will leverage the enriched job data and semantic embeddings from Epic 2 to create an excellent job discovery experience.
