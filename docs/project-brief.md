# Project Brief: Automated Job Application System

## Executive Summary

Building a personal productivity tool that automates the job application process for remote work positions. The system will scrape job boards (LinkedIn clones), use AI to customize application materials, and manage the entire application workflow with tracking and analytics.

---

## Problem Statement

**Current State**: Manual job applications are extremely time-consuming, requiring:
- Daily monitoring of multiple job boards
- Customizing resumes and cover letters for each position
- Tracking applications across platforms
- Repetitive form-filling and submission processes

**Impact**: This limits the number of applications that can be submitted, reducing the chances of landing interviews and ultimately securing remote work opportunities.

**Why Now**: The need for aggressive remote job searching requires a scalable, automated approach that maintains quality while dramatically increasing application volume.

---

## Proposed Solution

An automated job application system that:
1. **Discovers**: Daily scraping of remote job postings from LinkedIn clones
2. **Filters**: Smart matching based on configurable criteria per "application project"
3. **Customizes**: AI-powered resume and cover letter tailoring using LLM
4. **Applies**: Automated or semi-automated submission with human oversight options
5. **Tracks**: Complete application lifecycle management with analytics

**Key Differentiator**: Combines intelligent scraping, AI customization, and flexible automation levels in a single integrated platform.

---

## Target Users

### Primary User Segment: Active Remote Job Seekers

**Profile**: 
- Professionals aggressively seeking remote work opportunities
- Need to apply to high volumes of positions (20-50+ per week)
- Value quality applications but need scalability
- Willing to invest in setup for long-term efficiency gains

**Current Behaviors**:
- Manually check multiple job boards daily
- Spend 30-60 minutes per tailored application
- Struggle to track application status across platforms
- Miss opportunities due to time constraints

**Specific Needs**:
- Automated daily job discovery
- AI-assisted application material customization
- Control over automation level (full vs. semi-automatic)
- Comprehensive tracking and success metrics

**Goals**: 
- Maximize interview opportunities through volume
- Maintain application quality through AI customization
- Reduce time spent on repetitive tasks
- Make data-driven decisions about job search strategy

### Secondary User Segment: Future Commercial Users (Post-MVP)

**Consideration**: If the system proves effective and legally compliant, potential to commercialize as a SaaS product for other job seekers.

---

## Goals & Success Metrics

### Business Objectives
- **Primary**: Enable aggressive remote job search through automation
- **Secondary**: Create foundation for potential commercial product

### User Success Metrics
- Submit 20-50 quality applications per week (vs. 5-10 manual)
- Reduce time per application from 45 minutes to <5 minutes (review time)
- Achieve 10%+ interview rate from applications
- Track 100% of applications with status and outcomes

### Key Performance Indicators (KPIs)
- **Jobs Discovered**: Daily scrape yields 50+ relevant remote positions
- **Application Rate**: 20+ applications submitted per week
- **Quality Score**: AI-customized materials meet quality threshold (user rating)
- **System Uptime**: 95%+ availability for daily scraping
- **Response Rate**: Track interview requests per 100 applications

---

## MVP Scope

### Core Features (Must Have)

1. **Application Project Management**
   - Create multiple "application projects" with different criteria
   - Configure per project: salary range, job titles, industries, experience level
   - Learn from preferences and suggest reuse of previous settings

2. **Job Discovery Engine**
   - Daily automated scraping of LinkedIn clones (Remote OK, We Work Remotely, Himalayas, YC Jobs)
   - Filter jobs by project criteria
   - De-duplicate across platforms and previously seen postings

3. **AI Application Customization**
   - Store master resume and cover letter templates
   - LLM-powered tailoring per job description
   - Generate customized resume highlighting relevant experience
   - Generate personalized cover letter

4. **Flexible Application Workflow**
   - Per-project setting: Fully automatic or semi-automatic mode
   - **Semi-auto**: Present prepared materials for review/approval before submission
   - **Full-auto**: Auto-submit to matching jobs with post-submission notification

5. **Application Tracking & Analytics**
   - Store all applications with job details, materials sent, timestamp
   - Track status: Applied → No Response / Interview / Rejection
   - Dashboard with key metrics: applications sent, response rate, by platform/industry
   - Prevent duplicate applications

6. **Web UI (NextJS)**
   - Dashboard showing active projects and recent applications
   - Project setup and configuration screens
   - Application review queue (for semi-auto mode)
   - Analytics and tracking views

### Out of Scope for MVP

- LinkedIn.com scraping (too difficult/risky for MVP)
- Mobile apps
- Multi-user support / user authentication
- Payment processing / commercial features
- Advanced AI features (interview prep, salary negotiation)
- Browser extensions
- Integration with email/calendar for interview scheduling
- Resume parsing from external sources

### MVP Success Criteria

- Successfully scrape 3+ job platforms daily
- Apply to 20+ jobs per week with AI-customized materials
- Track 100% of applications with status
- User can manage 2+ application projects simultaneously
- System runs reliably with minimal manual intervention

---

## Post-MVP Vision

### Phase 2 Features
- Email integration for tracking responses automatically
- Interview scheduling assistant
- A/B testing of resume/cover letter variations
- Advanced analytics (which keywords/skills get most responses)
- Calendar integration
- Additional job boards (Wellfound/AngelList, Toptal, Gun.io)

### Long-term Vision
- SaaS product for job seekers (if legal and viable)
- Marketplace for resume templates and strategies
- Community features (share success strategies)
- AI interview preparation assistant
- Salary negotiation advisor

### Expansion Opportunities
- Support for industry-specific job boards (tech, design, marketing)
- International job board support
- Recruiter relationship management
- Skills gap analysis and learning recommendations

---

## Technical Considerations

### Platform Requirements
- **Target Platform**: Web application (desktop browser primary)
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
- **Performance**: Handle 100+ job listings scraped daily, process AI customization within 30 seconds per job

### Technology Stack

**Frontend**:
- Framework: **NextJS** (latest stable - v14+)
- Styling: **Tailwind CSS** with **shadcn/ui** components
- State Management: React Context or Zustand (based on complexity)
- TypeScript for type safety

**Backend & API**:
- Database: **PostgreSQL** (Railway-hosted)
  - Extensions: `pg_trgm` (text search), `uuid-ossp` (UUID generation)
  - Optional: `pgvector` (for semantic job matching in Phase 2)
- API Layer: **PostgREST** (auto-generated REST API from PostgreSQL schema)
  - Zero boilerplate API code
  - Schema-driven development
  - Built-in filtering, sorting, pagination
  - Row-level security via PostgreSQL RLS

**Automation & Integration**:
- Workflow Engine: **n8n** (for scraping orchestration and job processing)
- LLM Integration: **OpenAI API** (GPT-4 for quality, GPT-3.5-turbo for cost optimization)
- Web Scraping: 
  - **API-based**: Remote OK (has public API)
  - **HTML scraping**: Puppeteer/Playwright for sites without APIs
  - **External services**: Apify Actors for complex scraping (if needed)

**Deployment & Hosting**:
- Platform: **Railway.app**
- Services deployed:
  - PostgreSQL database
  - PostgREST API server
  - n8n workflow engine
  - NextJS application
- Environment: Single Railway project with multiple services

### Job Board Sources (Priority Order)

1. **Remote OK** ✅ - Public API available (`https://remoteok.com/api`)
2. **We Work Remotely** 🟡 - Clean HTML, structured categories
3. **Himalayas.app** 🟠 - Startup-focused, structured HTML
4. **Y Combinator Work at a Startup** 🔵 - Public board, easy to scrape
5. **Wellfound (AngelList)** 🟣 - Requires headless browser (Phase 2)
6. **Toptal/Gun.io/Replit Bounties** 🟤 - Project-based (Phase 2)

### System Architecture

```mermaid
graph TD
    subgraph Frontend
        A[NextJS App]
    end
    
    subgraph Railway.app
        B[PostgREST API]
        C[PostgreSQL DB]
        D[n8n Workflows]
    end
    
    subgraph External
        E[OpenAI API]
        F[Job Boards]
    end
    
    A -->|REST API calls| B
    B -->|SQL queries| C
    D -->|Daily scraping| F
    D -->|AI enrichment| E
    D -->|Insert jobs| B
    D -->|Trigger applications| B
    A -->|View/manage| B
```

### Data Flow

```
1. n8n Cron Trigger (daily at 6am)
2. → Scrape job boards (Remote OK API, WWR HTML, etc.)
3. → OpenAI enrichment (extract tags, score relevance, determine seniority)
4. → Insert to PostgreSQL via PostgREST (deduplicated by URL)
5. → Match against active application projects
6. → If match found:
   - Semi-auto: Queue for user review
   - Full-auto: Generate resume/cover letter → Submit → Log application
7. → Update analytics and tracking
```

### Database Schema

```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create roles for PostgREST (no auth needed for single-user MVP)
CREATE ROLE web_anon NOLOGIN;
CREATE ROLE authenticator NOINHERIT LOGIN PASSWORD 'secure-password-here';
GRANT web_anon TO authenticator;

-- Jobs table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    url TEXT UNIQUE NOT NULL,
    description TEXT,
    tags TEXT[],
    match_score INT CHECK (match_score BETWEEN 1 AND 10),
    seniority TEXT CHECK (seniority IN ('junior', 'mid', 'senior', 'lead', 'executive')),
    salary_min INT,
    salary_max INT,
    source TEXT NOT NULL,
    scraped_at TIMESTAMP DEFAULT NOW(),
    is_archived BOOLEAN DEFAULT FALSE
);

GRANT SELECT, INSERT, UPDATE ON jobs TO web_anon;

-- Application projects
CREATE TABLE application_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    automation_mode TEXT CHECK (automation_mode IN ('full', 'semi')) DEFAULT 'semi',
    salary_min INT,
    salary_max INT,
    job_titles TEXT[],
    industries TEXT[],
    seniority_levels TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

GRANT ALL ON application_projects TO web_anon;

-- Applications tracking
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    project_id UUID REFERENCES application_projects(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('applied', 'no_response', 'interview', 'rejected')) DEFAULT 'applied',
    resume_used TEXT,
    cover_letter_used TEXT,
    applied_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

GRANT ALL ON applications TO web_anon;

-- Master resume/cover letter storage
CREATE TABLE resume_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

GRANT ALL ON resume_templates TO web_anon;

CREATE TABLE cover_letter_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

GRANT ALL ON cover_letter_templates TO web_anon;

-- Indexes for performance
CREATE INDEX idx_jobs_scraped_at ON jobs(scraped_at DESC);
CREATE INDEX idx_jobs_tags ON jobs USING GIN(tags);
CREATE INDEX idx_jobs_title_trgm ON jobs USING GIN(title gin_trgm_ops);
CREATE INDEX idx_jobs_source ON jobs(source);
CREATE INDEX idx_jobs_archived ON jobs(is_archived) WHERE is_archived = FALSE;
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_applied_at ON applications(applied_at DESC);
```

### PostgREST Deployment on Railway

**Dockerfile.postgrest**:
```dockerfile
FROM postgrest/postgrest:latest
COPY postgrest.conf /etc/postgrest.conf
CMD ["postgrest", "/etc/postgrest.conf"]
```

**postgrest.conf**:
```conf
db-uri = "$(PGRST_DB_URI)"
db-schema = "public"
db-anon-role = "web_anon"
db-pool = 10
server-host = "0.0.0.0"
server-port = 3000
```

**Railway Environment Variables**:
```bash
PGRST_DB_URI=postgresql://postgres:password@postgres.railway.internal:5432/jobapp
PGRST_DB_SCHEMA=public
PGRST_DB_ANON_ROLE=web_anon
```

### n8n Workflow Integration

**Sample n8n HTTP Request to PostgREST (Insert Job)**:
```json
{
  "method": "POST",
  "url": "https://postgrest.railway.app/jobs",
  "headers": {
    "Content-Type": "application/json",
    "Prefer": "return=representation,resolution=merge-duplicates"
  },
  "body": {
    "title": "{{$json.title}}",
    "company": "{{$json.company}}",
    "url": "{{$json.url}}",
    "description": "{{$json.description}}",
    "source": "remote_ok",
    "tags": "{{$json.tags}}",
    "match_score": "{{$json.match_score}}",
    "seniority": "{{$json.seniority}}"
  }
}
```

### OpenAI Enrichment Prompt (n8n)

```
You are a job-matching assistant. Analyze the job description below and return a JSON object with:

{
  "summary": "1-sentence job summary",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "seniority": "junior|mid|senior|lead|executive",
  "match_score": 1-10 (for backend engineer, 5+ years Python/Go/TypeScript)
}

Job Description:
{{$json.description}}

Return ONLY valid JSON, no explanations.
```

---

## Technical Architecture Considerations

### Repository Structure
- **Monorepo preferred**:
  - `/apps/web` - NextJS application
  - `/apps/n8n-workflows` - n8n workflow JSON exports
  - `/packages/shared` - Shared TypeScript types
  - `/database` - PostgreSQL schema and migrations
  - `/docker` - Dockerfiles for PostgREST and n8n

### Service Architecture
- **PostgREST**: Auto-generated REST API (schema-driven)
- **n8n**: Orchestrates scraping, enrichment, application workflows
- **PostgreSQL**: Single source of truth for data
- **NextJS**: UI + server-side rendering + API route fallbacks (if needed)

### Integration Points
- n8n → PostgREST: HTTP requests for CRUD operations
- NextJS → PostgREST: REST API calls from frontend
- n8n → OpenAI: API calls for enrichment and customization
- n8n → Job Boards: API calls or web scraping

### Security & Compliance
- No user authentication needed for MVP (single-user)
- API keys stored as Railway environment variables
- Rate limiting per job board (avoid detection/blocking)
- Respect robots.txt and implement delays between requests
- PostgreSQL connection secured via Railway internal networking

### Performance Considerations
- Database indexing for fast job queries
- PostgREST connection pooling (10 connections)
- n8n workflow execution limits (handle gracefully)
- Batch processing for bulk job inserts
- Archive old jobs after 30 days (optional)

---

## Constraints & Assumptions

### Constraints

**Budget**:
- Railway.app: $10-20/month (PostgreSQL + PostgREST + n8n)
- OpenAI API: $20-50/month (enrichment + customization)
- Domain (optional): $12/year
- **Total**: ~$30-70/month operational cost

**Timeline**: 
- MVP development in 6-8 weeks (part-time development)

**Resources**: 
- Solo developer initially
- No dedicated QA or design resources

**Technical**: 
- Railway.app resource limits (scale as needed)
- Job board rate limits (implement delays, respect ToS)
- OpenAI API rate limits (tier-dependent)

### Key Assumptions

- Remote OK API remains free and accessible
- OpenAI API costs stay within budget (<$0.10 per application)
- n8n can orchestrate multi-source scraping reliably
- PostgreSQL full-text search sufficient for job matching (no vector search needed for MVP)
- PostgREST schema-driven approach works for single-user MVP
- Job boards allow scraping or provide APIs
- LLM can generate quality customized materials with proper prompting
- Semi-automatic mode provides sufficient quality control

---

## Risks & Open Questions

### Key Risks

**Legal Risk**: Job board Terms of Service may prohibit automated applications
- *Mitigation*: Focus on platforms with APIs, implement rate limiting, add human-like delays, use semi-automatic mode for oversight

**Detection Risk**: Automated applications may be flagged/blocked
- *Mitigation*: Semi-automatic review mode, rate limiting, vary application patterns, use legitimate APIs

**Quality Risk**: AI-generated materials may not meet quality standards
- *Mitigation*: Semi-automatic review mode, iterate on prompts, collect user feedback, refine over time

**Scraping Fragility**: Website changes break scrapers frequently
- *Mitigation*: Modular scraper design, monitoring/alerts, use APIs where available, prioritize stable sources

**API Cost Risk**: OpenAI usage could exceed budget
- *Mitigation*: Use GPT-3.5-turbo for enrichment, GPT-4 only for final customization, set monthly spending limits

### Open Questions

- **Cost per application**: What's the actual OpenAI cost for enrichment + customization? (Target: <$0.10/job)
- **Scraping frequency**: Is daily scraping sufficient, or do time-sensitive postings need real-time monitoring?
- **Match scoring**: Pure keyword matching vs. semantic similarity (pgvector)? Start simple, add later?
- **Application submission**: Can n8n automate form filling, or need custom Puppeteer scripts per platform?
- **Error handling**: How to handle scraper failures without losing daily scrape window? Retry logic? Alerts?
- **Schema evolution**: How to handle PostgREST schema changes without breaking NextJS app? (Not critical for MVP)

### Areas Needing Further Research

- Legal landscape for automated job applications by jurisdiction
- Job board API documentation and rate limits (Remote OK, WWR)
- Best practices for ethical web scraping (delays, user-agents, robots.txt)
- LLM prompt engineering for high-quality resume/cover letter generation
- n8n capabilities for complex multi-step workflows and error handling
- PostgREST performance at scale (100+ jobs/day, 1000+ applications tracked)

---

## Next Steps

### Immediate Actions

1. ✅ **Project Brief Complete** - Save as `docs/project-brief.md`
2. **Proceed to PRD Creation** - Product Manager agent will create detailed requirements
3. **Research Job Board APIs** - Validate Remote OK, WWR, Himalayas accessibility
4. **Prototype LLM Customization** - Test OpenAI prompts for resume/cover letter quality
5. **Railway Setup** - Create Railway project and PostgreSQL database

### Development Roadmap

**Week 1-2**: Foundation
- Set up Railway project with PostgreSQL
- Deploy PostgREST and test basic CRUD
- Create database schema and seed with test data
- Set up NextJS project with Tailwind and shadcn/ui

**Week 3-4**: Job Discovery
- Build n8n workflow for Remote OK API scraping
- Implement OpenAI enrichment (tags, scoring, seniority)
- Create job listing UI in NextJS
- Test deduplication and filtering logic

**Week 5-6**: Application Automation
- Build application project management UI
- Implement job matching logic
- Create LLM prompts for resume/cover letter customization
- Build semi-automatic review queue

**Week 7-8**: Tracking & Polish
- Implement application tracking and status updates
- Build analytics dashboard
- Add error handling and monitoring
- User testing and refinement

---

## PM Handoff

This Project Brief provides the full context for the **Automated Job Application System**. 

**Key Priorities for PRD**:
1. Define detailed functional requirements for each MVP feature
2. Create epics and user stories for the 6-8 week timeline
3. Specify acceptance criteria for job matching logic
4. Detail LLM integration requirements (prompts, error handling)
5. Define analytics and reporting requirements

**Technical Considerations for PRD**:
- PostgREST schema-driven development (database schema = API contract)
- n8n workflow orchestration (scraping, enrichment, application)
- Single-user MVP (no authentication needed)
- Focus on 3-4 job boards for MVP (Remote OK, WWR, Himalayas, YC Jobs)

Please start in **PRD Generation Mode**, review this brief thoroughly, and work with the user to create the PRD section by section as the template indicates.

---

**Document Version**: 1.0  
**Created**: 2025-10-18  
**Author**: Business Analyst (Mary)  
**Status**: Ready for PM Review