# Automated Job Application System - Product Requirements Document (PRD)

> **Version:** 1.1
> **Created:** 2025-10-18
> **Last Updated:** 2025-10-18
> **Author:** John (Product Manager)
> **Status:** Phase 1 MVP (Epics 0-5), Deferred Phase 2-3
> **Development Approach:** Phased MVP (Option B)

---

## Goals and Background Context

### Goals

- Enable aggressive remote job search through automation (20-50 applications/week vs. 5-10 manual)
- Reduce time per application from 45 minutes to <5 minutes review time
- Achieve 10%+ interview rate from submitted applications
- Track 100% of applications with status and outcomes
- Provide AI-customized application materials that maintain quality at scale
- Create foundation for potential commercial SaaS product
- Daily discovery of 50+ relevant remote positions across multiple job boards
- Flexible automation control (full vs. semi-automatic modes) for quality assurance

### Background Context

The manual job application process is extremely time-consuming, requiring daily monitoring of multiple job boards, customization of resumes and cover letters for each position, tracking applications across platforms, and repetitive form-filling. This severely limits the number of quality applications that can be submitted, reducing chances of landing interviews and securing remote work opportunities.

An aggressive remote job search requires a scalable, automated approach that maintains application quality while dramatically increasing volume. This PRD defines an automated job application system that combines intelligent scraping of LinkedIn clone job boards (Remote OK, We Work Remotely, Himalayas, YC Jobs, Wellfound), AI-powered customization of application materials using LLMs, and flexible automation workflows with comprehensive tracking and analytics—all deployed on Railway.app using a modern stack (NextJS, PostgreSQL, PostgREST, n8n).

### Change Log

| Date       | Version | Description                        | Author        |
| ---------- | ------- | ---------------------------------- | ------------- |
| 2025-10-18 | 1.0     | Initial PRD creation from Project Brief | John (PM) |

---

## Requirements

### Functional Requirements

**FR1:** System shall scrape job postings daily from configured job boards (Remote OK, We Work Remotely, Himalayas, YC Jobs, Wellfound) using n8n workflows.

**FR2:** System shall enrich scraped job postings with AI-generated metadata including tags, seniority level, and match score using OpenAI API.

**FR3:** System shall deduplicate job postings by URL to prevent duplicate entries across platforms and time periods.

**FR4:** Users shall be able to create multiple "Application Projects" with configurable criteria including salary range, job titles, industries, and seniority levels.

**FR5:** Each Application Project shall support two automation modes: "Full Auto" (automatic submission with notification) and "Semi Auto" (review queue requiring user approval).

**FR6:** System shall automatically match scraped jobs against active Application Project criteria and queue or apply accordingly based on project automation mode.

**FR7:** Users shall be able to create and manage master resume templates and cover letter templates.

**FR8:** System shall generate customized resumes and cover letters for each job application using OpenAI API and the job description.

**FR9:** In Semi Auto mode, system shall present generated application materials in a review queue for user approval before submission.

**FR10:** In Full Auto mode, system shall automatically submit applications to matching jobs and send post-submission notifications to the user.

**FR11:** System shall track all applications with status workflow: Applied → No Response / Interview / Rejection.

**FR12:** System shall prevent duplicate applications by checking application history before processing a job.

**FR13:** Users shall be able to view a dashboard showing active projects, recent applications, and key metrics.

**FR14:** Users shall be able to view analytics including applications sent, response rate, breakdown by platform and industry.

**FR15:** System shall archive jobs older than 30 days to maintain database performance.

**FR16:** Application Project configuration shall support learning from previous settings and suggest reuse of successful criteria.

### Non-Functional Requirements

**NFR1:** System shall scrape and process 50+ job postings per day with 95%+ uptime.

**NFR2:** AI customization of resume and cover letter shall complete within 30 seconds per job application.

**NFR3:** System shall handle 100+ job listings scraped daily and track 1000+ applications without performance degradation.

**NFR4:** OpenAI API costs shall remain under $0.10 per application to maintain budget targets.

**NFR5:** Job board scraping shall implement rate limiting and delays to respect Terms of Service and avoid detection/blocking.

**NFR6:** System shall use PostgreSQL full-text search (`pg_trgm`) for efficient job matching queries.

**NFR7:** Railway.app operational costs shall remain within $70-140/month budget (database + services + hosting).

**NFR8:** NextJS application shall support modern browsers (Chrome, Firefox, Safari, Edge - latest 2 versions).

**NFR9:** Database schema shall be optimized with appropriate indexes for common query patterns (jobs by date, by tags, applications by status).

**NFR10:** PostgREST API shall use connection pooling (10-20 connections) for efficient database access.

**NFR11:** System shall implement monitoring and alerts for scraper failures to avoid missing daily scrape windows.

**NFR12:** All API keys and credentials shall be stored as Railway environment variables, not in code.

**NFR13:** System shall respect robots.txt and implement human-like delays between scraping requests.

---

## User Interface Design Goals

### Overall UX Vision

The application should provide a clean, efficient dashboard-centric experience that emphasizes automation monitoring and quick decision-making. Users need to quickly assess system health (scraping status, pending applications), review queued materials in Semi Auto mode, and access analytics. The interface should feel like a "command center" for job search automation—minimal friction, maximum visibility into the automated pipeline, with clear CTAs for user intervention points (review queue, project configuration).

### Key Interaction Paradigms

- **Dashboard-First Navigation**: Primary screen shows at-a-glance metrics (applications today/week, pending reviews, active projects, recent matches)
- **Queue-Based Review**: Semi Auto mode presents a card-based review queue where users can quickly approve/reject/edit application materials
- **Project-Centric Configuration**: Application Projects are the primary organizational unit; users create/edit projects with clear form-based criteria entry
- **Real-Time Updates**: Use optimistic UI updates for user actions (approve application, update project) with background API sync
- **Minimal Clicks to Value**: Critical actions (approve application, view job details, check analytics) accessible within 1-2 clicks from dashboard

### Core Screens and Views

1. **Dashboard** - Overview of system activity, active projects, recent applications, pending review queue count
2. **Application Projects List** - View all projects with status indicators (active/inactive, automation mode, match count)
3. **Create/Edit Application Project** - Form-based configuration for criteria (salary, titles, industries, seniority, automation mode)
4. **Review Queue** (Semi Auto mode) - Card-based interface showing job details, generated resume/cover letter, approve/reject/edit actions
5. **Job Listings** - Browse all scraped jobs with filtering (source, tags, date, match score)
6. **Job Detail Page** - Full job description, company info, generated materials preview, application status
7. **Applications Tracking** - List view of all submitted applications with status, filtering, and search
8. **Analytics Dashboard** - Charts and metrics (applications over time, response rate by platform/industry, success metrics)
9. **Resume/Cover Letter Templates** - Manage master templates, create new, set defaults
10. **Settings** - System configuration (scraping schedule, OpenAI model selection, notification preferences)

### Accessibility: WCAG AA

Target WCAG AA compliance to ensure usability for users with disabilities. Key considerations:
- Keyboard navigation support for all interactive elements
- Sufficient color contrast ratios (4.5:1 for text)
- Screen reader compatibility with semantic HTML and ARIA labels
- Focus indicators for form inputs and buttons
- Alt text for any images or icons

### Branding

Minimalist, modern, productivity-focused aesthetic:
- Clean typography with clear hierarchy (shadcn/ui default styling)
- Neutral color palette with accent colors for status indicators (green for approved, yellow for pending, red for rejected)
- Consistent spacing and component styling via Tailwind CSS
- No corporate branding required (personal productivity tool)
- Icons from Lucide React for consistent iconography

### Target Device and Platforms: Web Responsive

**Primary**: Desktop browser (1920x1080, 1440x900 common resolutions)
**Secondary**: Tablet landscape mode (iPad, 1024x768+)
**Out of Scope**: Mobile phone optimization (review queue and analytics not practical on small screens)

Web application accessible via modern browsers (Chrome, Firefox, Safari, Edge - latest 2 versions). Responsive design using Tailwind breakpoints to support desktop and tablet, but primary use case assumes desktop environment for reviewing application materials and analytics.

---

## Technical Assumptions

### Repository Structure: Monorepo

**Decision**: Use a monorepo structure to keep all related code, workflows, and configuration in a single repository.

**Rationale**:
- Simplifies deployment coordination between NextJS app, n8n workflows, and database migrations
- Shared TypeScript types between frontend and database schema
- Single CI/CD pipeline for the entire system
- Easier version control for related changes across services

**Structure**:
```
/apps/web              - NextJS application
/apps/n8n-workflows    - n8n workflow JSON exports
/packages/shared       - Shared TypeScript types & utilities
/packages/email        - Email parsing and tracking utilities
/database              - PostgreSQL schema and migrations
/docker                - Dockerfiles for PostgREST and n8n
```

### Service Architecture

**High-Level Architecture**: Schema-Driven Microservices with Workflow Orchestration + Email Integration

**Components**:

1. **PostgreSQL Database** (Railway-hosted)
   - Single source of truth for all application data
   - Extensions: `uuid-ossp`, `pg_trgm` (full-text search), `pgvector` (semantic job matching & resume optimization)
   - Row-level security (RLS) for data access control

2. **PostgREST API Server** (Railway-hosted)
   - Auto-generated REST API from PostgreSQL schema
   - Built-in filtering, sorting, pagination
   - Connection pooling (10-20 connections)

3. **n8n Workflow Engine** (Railway-hosted)
   - Job scraping orchestration (all supported platforms)
   - AI enrichment pipeline (OpenAI API integration)
   - Job matching and application submission workflows
   - Email monitoring and response tracking
   - Telegram notification delivery
   - Interview scheduling automation
   - A/B testing coordination

4. **NextJS Application** (Railway-hosted)
   - Server-side rendering + client-side React
   - API routes for complex operations beyond PostgREST
   - Consumes PostgREST API via REST calls
   - Real-time updates via polling (upgrade to WebSockets if needed)

5. **Email Integration** (IMAP/SMTP)
   - n8n IMAP node for monitoring inbox
   - Parse job board responses (interview requests, rejections)
   - Auto-update application status in database
   - Archive email threads per application

6. **Telegram Bot** (Telegram Bot API)
   - Real-time notifications for matched jobs, applications sent, responses received
   - Interactive approval for Semi Auto mode (approve/reject via Telegram)
   - Daily summary reports
   - Quick commands (/stats, /pending, /recent)

**Data Flow**:
```
1. n8n Cron → Scrape All Job Boards → OpenAI Enrichment → PostgREST Insert
2. n8n → Match Jobs (pgvector semantic similarity) → Queue/Apply → Telegram Notify
3. n8n IMAP → Monitor Email → Parse Responses → Update Status → Telegram Alert
4. NextJS ↔ PostgREST ↔ PostgreSQL (user-initiated CRUD)
5. Telegram Bot ↔ n8n Webhook → Approve Application → Submit
```

### Testing Requirements

**Testing Strategy**: Unit + Integration + Manual Testing + Monitoring

**Unit Testing**:
- React component tests (Jest + React Testing Library)
- Utility function tests (validation, parsing, formatting)
- Email parser tests (mock email responses)
- Coverage target: 70%+ for critical paths

**Integration Testing**:
- NextJS → PostgREST API interactions (real local database)
- n8n workflow validation (mock external APIs)
- Email parsing end-to-end (test emails → status updates)
- Telegram bot command handling
- Critical user journeys (scrape → match → apply → track → respond)

**Manual Testing**:
- UI/UX validation across all screens
- Job board scraper verification (live testing)
- AI quality assessment (resume/cover letter review)
- Email response handling edge cases

**Production Monitoring**:
- Scraper failure alerts (Telegram notifications)
- Daily scrape health checks (expected job count)
- OpenAI API cost tracking (budget alerts)
- Database performance monitoring (query times)
- Application response rate tracking

**Testing Convenience**:
- Database seeding scripts (realistic sample data)
- Mock OpenAI responses (cost-free testing)
- n8n dry-run mode (test workflows without submissions)
- Email simulator (test response parsing without real emails)

### Additional Technical Assumptions and Requests

**Languages & Frameworks**:
- **Frontend**: TypeScript + React 18+ (NextJS 14+)
- **Styling**: Tailwind CSS v3.x with shadcn/ui
- **State Management**: Zustand
- **Database Access**: Direct SQL + PostgREST (no ORM)

**External APIs & Services**:
- **LLM Provider**: OpenAI API (GPT-4o for high-quality customization, GPT-4o-mini for enrichment/classification)
- **Job Boards**: Remote OK (API), We Work Remotely (scraping), Himalayas (scraping), Y Combinator Jobs (scraping), Wellfound/AngelList (headless browser), additional boards as discovered
- **Email**: IMAP/SMTP access to personal email account
- **Messaging**: Telegram Bot API
- **Scraping**: Puppeteer for headless browser automation
- **Vector Search**: pgvector for semantic similarity matching

**Deployment & Infrastructure**:
- **Platform**: Railway.app for all services (PostgreSQL, PostgREST, n8n, NextJS)
- **CI/CD**: GitHub Actions (automated deployment on push to main)
- **Environment Variables**: Railway environment variables (all secrets)
- **Monitoring**: Railway logs + custom Telegram alerts
- **Backups**: Automated daily PostgreSQL backups via Railway

**Data Persistence**:
- **Database**: PostgreSQL 15+ (automated daily backups)
- **File Storage**: Supabase Storage or Railway volumes for future resume file uploads (if needed beyond text storage)

**Security**:
- **Authentication**: None required (single-user personal tool)
- **API Security**: PostgREST internal Railway networking only
- **Email Security**: OAuth2 for Gmail IMAP/SMTP (or app password)
- **Telegram Security**: Bot token stored securely, webhook secret validation
- **Secrets Management**: Railway environment variables exclusively

**Performance Targets**:
- Job scraping: 100-200+ jobs per day across all platforms
- AI processing: <30 seconds per job (enrichment + customization)
- Email monitoring: 15-minute polling interval (configurable)
- Database queries: <100ms for common operations
- UI responsiveness: <200ms for interactions
- Telegram notifications: <5 seconds delivery time

**Development Workflow**:
- **Local Development**: Docker Compose for PostgreSQL + PostgREST, local n8n instance, NextJS dev server
- **Version Control**: Git with conventional commits, feature branches
- **Database Migrations**: SQL scripts with version numbering
- **n8n Workflows**: Export to JSON in version control

**Third-Party Libraries**:
- **Icons**: Lucide React
- **Charts**: Recharts (analytics dashboard)
- **Date Handling**: date-fns
- **HTTP Client**: Fetch API (native)
- **Form Validation**: Zod
- **Email Parsing**: Mailparser (Node.js)
- **Vector Operations**: pgvector PostgreSQL extension
- **Calendar**: Google Calendar API client
- **Telegram**: node-telegram-bot-api or n8n Telegram nodes

---

## Epic List

> **📋 Development Phasing**: This project follows a **3-phase MVP approach** (Option B)
> - **Phase 1 (MVP)**: Epics 0-5 (6-8 weeks) - Core job discovery and application features
> - **Phase 2**: Epics 6-8 (4-6 weeks) - Automation and mobile workflow
> - **Phase 3**: Epics 9-10 (2-3 weeks) - Analytics and optimization
>
> **See**: [mvp-phased-roadmap.md](mvp-phased-roadmap.md) for detailed phasing strategy

---

### **PHASE 1: Core MVP (6-8 weeks)**

### Epic 0: Pre-Development Setup ⚙️ **[USER MANUAL SETUP]**
**Goal**: Acquire all external API access and configure environment variables before development begins.
**Owner**: User (Manual Tasks)
**Duration**: 2-4 hours
**Stories**: 7 (OpenAI, Telegram, Google Calendar, Gmail, Railway.app setup)
**See**: [epic-0-pre-dev-setup.md](epic-0-pre-dev-setup.md) for complete setup guide

### Epic 1: Foundation & Core Infrastructure 🏗️
**Goal**: Establish project foundation with Railway deployment, database schema, PostgREST API, NextJS application, development environment with Docker Compose, basic health monitoring, and deploy a simple "system operational" dashboard to validate the entire stack is working end-to-end.
**Phase**: 1 (MVP)
**Stories**: 9

### Epic 2: Job Discovery & Enrichment Pipeline 🔍
**Goal**: Build automated job scraping from Remote OK and We Work Remotely, implement AI enrichment with semantic embeddings, and establish deduplication and storage workflows.
**Phase**: 1 (MVP)
**Stories**: 10

### Epic 3: Job Management Dashboard 📊
**Goal**: Enable users to browse, search, filter, and bookmark jobs with responsive mobile-first UI and semantic search capabilities.
**Phase**: 1 (MVP)
**Stories**: 8

### Epic 4: Authentication & User Profile 🔐
**Goal**: Implement email/password authentication, user profile management, and job preference configuration.
**Phase**: 1 (MVP)
**Stories**: 6

### Epic 5: Application Customization & Tracking 📝
**Goal**: Implement application projects, AI-powered resume/cover letter customization, application tracking, and status management.
**Phase**: 1 (MVP)
**Stories**: 12

**Phase 1 Total**: 45 stories (Epics 0-5)

---

### **PHASE 2: Enhanced Features (4-6 weeks)** 🚀

### Epic 6: Telegram Integration 📱 **[DEFERRED TO PHASE 2]**
**Goal**: Deploy Telegram bot for push notifications, implement interactive approval workflow via Telegram, create daily digest reports, and build command interface for quick stats and system health checks.
**Phase**: 2
**Stories**: 10

### Epic 7: Email Response Monitoring 📧 **[DEFERRED TO PHASE 2]**
**Goal**: Integrate IMAP monitoring for email responses, build intelligent email parsing to extract interview requests and rejections, automatically update application statuses, and archive email threads per application.
**Phase**: 2
**Stories**: 10

### Epic 8: Interview Management & Scheduling 📅 **[DEFERRED TO PHASE 2]**
**Goal**: Parse interview requests from emails, integrate Google Calendar API, automate scheduling proposals, send confirmation emails, and track interview outcomes.
**Phase**: 2
**Stories**: 10

**Phase 2 Total**: 30 stories (Epics 6-8)

---

### **PHASE 3: Optimization & Scale (2-3 weeks)** 📈

### Epic 9: Analytics Dashboard & Insights 📊 **[DEFERRED TO PHASE 3]**
**Goal**: Build comprehensive analytics dashboard with time-series charts, funnel analysis, platform performance metrics, keyword/skills analysis, A/B test results visualization, and data export capabilities.
**Phase**: 3
**Stories**: 10

### Epic 10: System Monitoring & Optimization ⚡ **[DEFERRED TO PHASE 3]**
**Goal**: Implement production monitoring with health checks, error alerting via Telegram, cost tracking for OpenAI API usage, performance optimization for database queries, and automated backup verification.
**Phase**: 3
**Stories**: 10

**Phase 3 Total**: 20 stories (Epics 9-10)

---

## Epic Details

### Epic Story Count Summary

- **Epic 1**: 9 stories (Foundation & Core Infrastructure)
- **Epic 2**: 10 stories (Job Discovery & Enrichment Pipeline)
- **Epic 3**: 10 stories (Application Project Management & Matching)
- **Epic 4**: 10 stories (AI-Powered Application Customization)
- **Epic 5**: 10 stories (Application Submission & Tracking)
- **Epic 6**: 10 stories (Email Integration & Response Tracking)
- **Epic 7**: 10 stories (Telegram Bot & Real-Time Notifications)
- **Epic 8**: 10 stories (Interview Management & Scheduling)
- **Epic 9**: 10 stories (Analytics Dashboard & Insights)
- **Epic 10**: 10 stories (System Monitoring & Optimization)

**Total**: 99 user stories with comprehensive acceptance criteria

### Epic 1: Foundation & Core Infrastructure

**Expanded Goal**: Establish the complete project foundation including monorepo structure, Railway deployment for all core services (PostgreSQL with extensions, PostgREST API), initialize NextJS application with Tailwind CSS and shadcn/ui, set up development environment with Docker Compose, implement basic health monitoring, and deploy a simple "system operational" dashboard to validate the entire stack is working end-to-end.

**Stories**: 1.1 through 1.9 covering monorepo setup, database deployment, PostgREST API, NextJS initialization, schema migrations, Railway deployment, health dashboard, n8n setup, and shared TypeScript types.

### Epic 2: Job Discovery & Enrichment Pipeline

**Expanded Goal**: Build automated job scraping from all target platforms (Remote OK, WWR, Himalayas, YC Jobs, Wellfound), implement AI enrichment with semantic embeddings, and establish deduplication and storage workflows.

**Stories**: 2.1 through 2.10 covering Remote OK API scraper, We Work Remotely HTML scraper, Himalayas scraper, YC Jobs scraper, Wellfound headless browser scraper, OpenAI enrichment, semantic embeddings with pgvector, master orchestration workflow, job archival, and job listings UI.

### Epic 3: Application Project Management & Matching

**Expanded Goal**: Enable users to create and manage Application Projects with sophisticated configurable criteria, implement intelligent job matching engine using both keyword-based filtering and pgvector semantic similarity, create learning system that suggests criteria reuse, and build comprehensive project management UI.

**Stories**: 3.1 through 3.10 covering project CRUD UI, autocomplete, keyword matching, semantic matching, matching association table, project detail page, learning/suggestions, bulk actions, project templates, and activity feed.

### Epic 4: AI-Powered Application Customization

**Expanded Goal**: Implement comprehensive template management system, build OpenAI-powered customization engine, create A/B testing framework, implement quality control workflows, and build template editor UI.

**Stories**: 4.1 through 4.10 covering resume template management, cover letter templates, OpenAI resume customization, OpenAI cover letter customization, preview/regeneration UI, A/B testing framework, quality scoring, template library/import, version history, and bulk testing workflow.

### Epic 5: Application Submission & Tracking

**Expanded Goal**: Build flexible automation workflows, implement application submission logic, establish comprehensive tracking, create review queue UI, implement duplicate prevention, and build application history dashboard.

**Stories**: 5.1 through 5.10 covering review queue UI, full auto submission, form automation, user profile, tracking dashboard, application detail page, duplicate prevention, status workflow automation, analytics dashboard, and manual application entry.

### Epic 6: Email Integration & Response Tracking

**Expanded Goal**: Integrate IMAP monitoring, build intelligent email parsing using OpenAI, automatically update application statuses, archive email threads, implement spam filtering, and create email response UI.

**Stories**: 6.1 through 6.10 covering IMAP monitoring, OpenAI email parsing, automatic status updates, email archival, response viewer UI, spam filtering, whitelist management, email templates/quick replies, auto-matching algorithm, and dashboard widget.

### Epic 7: Telegram Bot & Real-Time Notifications

**Expanded Goal**: Deploy Telegram bot, implement interactive approval workflow, create rich notification templates, build daily/weekly digests, implement bot commands, support deep linking, and configure notification preferences.

**Stories**: 7.1 through 7.10 covering bot creation/deployment, notification system, job match notifications, application submission notifications, interactive approval, email response notifications, bot commands, daily/weekly digests, notification preferences, and deep linking.

### Epic 8: Interview Management & Scheduling

**Expanded Goal**: Parse interview request emails, integrate Google Calendar API, automate scheduling proposals, send confirmation emails, create interview preparation dashboard, track interview outcomes, implement reminders, and build interview analytics.

**Stories**: 8.1 through 8.10 covering interview database schema, email parsing, Google Calendar integration, availability checking, automated scheduling responses, calendar event creation, preparation dashboard, reminders, outcome tracking, and interview analytics.

### Epic 9: Analytics Dashboard & Insights

**Expanded Goal**: Build comprehensive analytics dashboard with interactive visualizations, funnel analysis, platform performance comparison, keyword analysis, A/B test results, cohort analysis, predictive insights, and data export.

**Stories**: 9.1 through 9.10 covering dashboard layout, key metrics overview, time-series charts, funnel visualization, platform comparison, keyword/skills analysis, A/B test visualization, cohort analysis, predictive insights, and data export.

### Epic 10: System Monitoring & Optimization

**Expanded Goal**: Implement comprehensive production monitoring with health checks, create error alerting system, build cost tracking, implement performance optimization, establish automated backups, create admin dashboard, implement rate limiting, build audit logging, and create system documentation.

**Stories**: 10.1 through 10.10 covering service health monitoring, error alerting, OpenAI cost tracking, database query performance, backup verification, admin dashboard, rate limiting, audit logging, caching/optimization, and documentation/runbooks.

---

## Detailed Story Specifications

> **Note**: Full detailed specifications for all 99 user stories with comprehensive acceptance criteria are available in the product planning session documentation. Each story includes:
> - User story format (As a... I want... so that...)
> - 7-12 acceptance criteria per story
> - Technical implementation guidance
> - Dependencies and sequencing notes
>
> For implementation, developers should reference the complete story specifications maintained in the project management system or request specific epic details from the Product Manager.

---


## Checklist Results Report

### Executive Summary

- **Overall PRD Completeness**: 95%
- **Scope**: Full Production System (user-requested, not MVP)
- **Readiness for Architecture Phase**: **READY**
- **Critical Concerns**: Scope is extensive (99 stories, estimated 6-9 months development)

### Validation Results

| Category                         | Status | Notes                                                |
| -------------------------------- | ------ | ---------------------------------------------------- |
| 1. Problem Definition & Context  | PASS   | Well-defined from Project Brief                      |
| 2. MVP Scope Definition          | PASS   | User chose full production scope                     |
| 3. User Experience Requirements  | PASS   | Comprehensive UI goals, 10 screens defined           |
| 4. Functional Requirements       | PASS   | 16 FRs cover all functionality                       |
| 5. Non-Functional Requirements   | PASS   | Performance, budget, security specified              |
| 6. Epic & Story Structure        | PASS   | 10 epics, 99 stories, well-sequenced                 |
| 7. Technical Guidance            | PASS   | Complete tech stack and architecture                 |
| 8. Cross-Functional Requirements | PASS   | Data models, integrations, operations covered        |
| 9. Clarity & Communication       | PASS   | Clear, detailed, well-organized                      |

**Overall Assessment**: PRD is comprehensive and ready for architecture and development phases.

### Key Strengths

1. **Clear Problem Statement**: Manual job application process well-defined with quantified impact
2. **Comprehensive Technical Guidance**: Complete tech stack specified (NextJS, PostgreSQL, PostgREST, n8n, Railway, OpenAI, Telegram)
3. **Well-Structured Epics**: Logical sequencing with clear dependencies
4. **Detailed Acceptance Criteria**: Each story has 7-12 testable acceptance criteria
5. **Budget Awareness**: Cost tracking built into requirements (NFR4, NFR7, Epic 10)

### Recommendations

1. **Timeline Expectations**: Acknowledge 6-9 month full-scope timeline with architect
2. **Incremental Delivery**: Consider delivering epics incrementally (Epics 1-5 first, then 6-10)
3. **Performance SLAs**: Refine with architect during implementation (P50/P95/P99 latencies)
4. **Architecture Diagrams**: Architect should create system and data flow diagrams

---

## Next Steps

### UX Expert Prompt

You are a UX Expert tasked with designing the user experience for an Automated Job Application System. Please review the PRD at `@docs/prd.md` and the Project Brief at `@docs/project-brief.md`.

**Your Tasks:**
1. Create wireframes for the 10 core screens defined in the "Core Screens and Views" section
2. Design the dashboard-first navigation structure emphasizing automation monitoring
3. Create the card-based review queue UI for Semi Auto mode
4. Design the analytics dashboard with interactive charts (time-series, funnel, platform comparison)
5. Ensure WCAG AA accessibility compliance throughout
6. Apply the minimalist, productivity-focused aesthetic specified in the Branding section
7. Use shadcn/ui components with Tailwind CSS responsive design
8. Focus on minimal clicks to value (1-2 clicks to critical actions)

**Deliverables:**
- Wireframes for all 10 core screens
- Interactive prototype (Figma, Adobe XD, or similar)
- Component library aligned with shadcn/ui
- Accessibility audit checklist
- Design system documentation

**Key Priorities:**
- Dashboard shows at-a-glance system health and pending actions
- Review queue enables quick approve/reject decisions
- Analytics provide actionable insights (not just data visualization)
- Mobile-responsive but desktop-first design

---

### Architect Prompt

You are a Software Architect tasked with designing the technical architecture for an Automated Job Application System. Please review the PRD at `@docs/prd.md` and the Project Brief at `@docs/project-brief.md`.

**Your Tasks:**
1. **System Architecture**: Design the complete system architecture using the specified tech stack (NextJS, PostgreSQL, PostgREST, n8n, Railway, OpenAI, Telegram, Google Calendar)
2. **Database Schema**: Create detailed database schema with all tables, relationships, indexes, and migrations (expand on the schema outlined in the Project Brief)
3. **API Design**: Define PostgREST API endpoints and contracts
4. **n8n Workflows**: Architect the workflow orchestration for scraping, enrichment, matching, customization, and notifications
5. **Data Flow**: Document data flow through all system components
6. **Integration Architecture**: Design integrations with external services (OpenAI, Telegram, Google Calendar, IMAP/SMTP, job boards)
7. **Performance Architecture**: Plan for pgvector semantic search, query optimization, caching strategy
8. **Security Architecture**: Design authentication (none for MVP), API security, secrets management
9. **Deployment Architecture**: Railway service configuration, environment variables, CI/CD pipeline
10. **Monitoring & Observability**: Design health checks, logging, alerting, cost tracking

**Key Deliverables:**
- System architecture diagram (C4 model or equivalent)
- Complete database schema with DDL scripts
- API documentation (endpoints, request/response formats)
- n8n workflow diagrams and specifications
- Data flow diagrams
- Infrastructure as Code (Railway configuration, Docker Compose)
- Technical risk assessment and mitigation strategies
- Performance benchmarks and scalability plan

**Critical Design Decisions:**
- **PostgREST Schema-Driven Approach**: Database schema = API contract (zero boilerplate backend code)
- **n8n Workflow Orchestration**: Visual workflows for scraping, enrichment, matching, email monitoring
- **pgvector Semantic Search**: Optimize for semantic job matching and resume optimization
- **Cost Management**: Design for <$140/month operational costs (Railway + OpenAI)
- **Rate Limiting**: Respect job board ToS and API limits
- **Email Integration**: IMAP monitoring, OpenAI parsing, status automation
- **Telegram Bot**: Real-time notifications and interactive approval workflow

**Technical Constraints:**
- Single-user personal tool (no multi-tenancy)
- Railway.app deployment (all services on one platform)
- Budget: $70-140/month operational costs
- Performance: <30s AI customization, <100ms database queries, 95%+ uptime
- Data: Handle 100-200 jobs/day, 1000+ applications tracked

**Start Here:**
1. Review Epic 1 stories for foundation requirements
2. Design database schema covering all entities (jobs, projects, applications, templates, interviews, emails, embeddings)
3. Create system architecture diagram showing all components and integrations
4. Document n8n workflow orchestration patterns
5. Plan for Epic 2 (scraping 5 job boards with different approaches: API, HTML, headless browser)

---

**End of PRD v1.0**

*Generated by Product Manager (John) on 2025-10-18*
*Ready for UX Design and Architecture Phases*
