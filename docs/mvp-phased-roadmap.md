# MVP Phased Roadmap

> **Decision**: Option B - True MVP Approach
> **Last Updated**: 2025-10-18
> **MVP Timeline**: 6-8 weeks
> **Full Production Timeline**: 4-6 months (including all phases)

---

## Overview

This roadmap breaks the full 99-story project into **3 distinct phases** to deliver value incrementally and validate the product concept before investing in advanced features.

**Key Principle**: Each phase delivers **end-to-end user value** that can be tested and validated before proceeding to the next phase.

---

## Phase 1: Core MVP (6-8 weeks)

**Goal**: Deliver the minimum viable product that proves core value proposition

**Success Criteria**:
- User can discover remote jobs automatically
- User can review job matches in a dashboard
- User can generate customized resumes and cover letters
- User can track application status
- System scrapes 50+ jobs per day

**Epics Included**: 5 epics, 39 stories

### Epic 0: Pre-Development Setup (2-4 hours, USER)
**Status**: Not Started
**Stories**: 7
**Owner**: User (Manual)

**Deliverables**:
- OpenAI API access
- Telegram bot created (for Phase 2)
- Google Calendar API configured (for Phase 2)
- Gmail app password
- Railway.app account
- Complete `.env.local` file

---

### Epic 1: Foundation & Core Infrastructure (Week 1, 9 stories)
**Status**: Not Started

**Deliverables**:
- Monorepo with npm workspaces
- PostgreSQL 15 with pgvector extension
- PostgREST configured and running
- Next.js 14 app structure
- Basic component library (shadcn/ui)
- Development environment fully functional

**Stories**:
1. ✅ Initialize monorepo with npm workspaces
2. ✅ Initialize Git repository with .gitignore
3. ✅ Set up ESLint, Prettier, TypeScript configs
4. ✅ Set up PostgreSQL 15 with pgvector extension
5. ✅ Configure PostgREST 12.x
6. ✅ Create Next.js 14 app with App Router
7. ✅ Install Tailwind CSS and shadcn/ui
8. ✅ Set up Zustand store structure
9. ✅ Configure TanStack Query

**Validation**: Developer can run `npm run dev` and see Next.js app at localhost:3001

---

### Epic 2: Job Discovery & Enrichment Pipeline (Week 2, 10 stories)
**Status**: Not Started

**Deliverables**:
- Job scraping from Remote OK and We Work Remotely
- AI-powered job enrichment (tags, seniority)
- Vector embeddings for semantic search
- Match score calculation
- Automated daily scraping

**Stories**:
1. ✅ Create `jobs` table schema
2. ✅ Create `job_embeddings` table
3. ✅ Set up n8n workflow engine
4. ✅ Build Remote OK scraper workflow
5. ✅ Build We Work Remotely scraper
6. ✅ Implement job deduplication logic
7. ✅ Create OpenAI enrichment workflow
8. ✅ Generate embeddings via OpenAI
9. ✅ Implement match score calculation
10. ✅ Schedule scrapers (every 4-6 hours)

**Validation**: Database has 100+ jobs with embeddings and match scores

---

### Epic 3: Job Management Dashboard (Week 3, 8 stories)
**Status**: Not Started

**Deliverables**:
- Responsive job list with filters
- Semantic search functionality
- Job detail view
- Bookmark/archive capabilities
- Mobile-responsive UI

**Stories**:
1. ✅ Create job list page (`/jobs`)
2. ✅ Build job card component
3. ✅ Implement job filters (tags, seniority, match score)
4. ✅ Add semantic search input
5. ✅ Create job detail modal
6. ✅ Implement bookmark/archive actions
7. ✅ Add pagination and infinite scroll
8. ✅ Optimize for mobile (responsive design)

**Validation**: User can browse, search, filter, and bookmark jobs in browser

---

### Epic 4: Authentication & User Profile (Week 4, 6 stories)
**Status**: Not Started

**Deliverables**:
- Email/password authentication
- User profile creation
- Preference configuration
- Protected routes

**Stories**:
1. ✅ Create `user_profile` table
2. ✅ Set up NextAuth.js with credentials provider
3. ✅ Build login/signup pages
4. ✅ Create user profile page
5. ✅ Build preferences form (target roles, tags, seniority)
6. ✅ Implement protected route middleware

**Validation**: User can sign up, log in, and set job preferences

---

### Epic 5: Application Customization & Tracking (Week 5-6, 12 stories)
**Status**: Not Started

**Deliverables**:
- Application projects (resume/cover letter templates)
- AI-powered customization
- Application status tracking
- Application history

**Stories**:
1. ✅ Create `application_projects` table
2. ✅ Create `applications` table
3. ✅ Build project creation form (upload resume/cover letter)
4. ✅ Create customization workflow (n8n + OpenAI)
5. ✅ Build "Apply" flow UI
6. ✅ Implement AI resume customization
7. ✅ Implement AI cover letter generation
8. ✅ Create application status page
9. ✅ Build application detail view
10. ✅ Add status update functionality
11. ✅ Create application history/analytics
12. ✅ Implement PDF export for customized documents

**Validation**: User can generate customized resume/cover letter and track applications

---

### Phase 1 Acceptance Criteria

**Functional**:
- ✅ 50+ jobs scraped daily
- ✅ User can search semantically ("remote React jobs")
- ✅ User can customize resume/cover letter in <2 minutes
- ✅ User can track application status
- ✅ All core workflows functional

**Technical**:
- ✅ All tests passing (80% coverage minimum)
- ✅ TypeScript with no errors
- ✅ Responsive on mobile and desktop
- ✅ Can deploy to Railway.app

**User Experience**:
- ✅ Job application time reduced from 45 min to <5 min
- ✅ Mobile-first design works smoothly
- ✅ AI customization quality is high

**Deployment**:
- ✅ Deployed to Railway.app production
- ✅ PostgreSQL backups configured
- ✅ Environment variables secured

---

## Phase 2: Enhanced Features (4-6 weeks)

**Goal**: Add automation and mobile-first notifications

**Success Criteria**:
- User receives Telegram notifications for new matches
- System monitors email for interview invitations
- Interviews are automatically scheduled in calendar
- User can manage entire workflow from mobile

**Epics Included**: 3 epics, 30 stories

### Epic 6: Telegram Integration (Week 7, 10 stories)
**Status**: Deferred to Phase 2

**Deliverables**:
- Telegram bot notifications for new job matches
- Interactive job actions via Telegram
- Mobile-first workflow

**Key Features**:
- Push notifications for high-match jobs (>80%)
- Inline keyboard actions (Apply/Skip/Bookmark)
- Application status updates via Telegram

---

### Epic 7: Email Response Monitoring (Week 8, 10 stories)
**Status**: Deferred to Phase 2

**Deliverables**:
- IMAP monitoring for application responses
- AI-powered email parsing
- Automated interview detection

**Key Features**:
- Parse interview invitations from emails
- Extract date/time/location via OpenAI
- Create interview records automatically

---

### Epic 8: Interview Management (Week 9-10, 10 stories)
**Status**: Deferred to Phase 2

**Deliverables**:
- Interview scheduling and tracking
- Google Calendar integration
- Interview prep notes and feedback

**Key Features**:
- Calendar event creation
- Interview reminders
- Outcome tracking

---

## Phase 3: Optimization & Scale (2-3 weeks)

**Goal**: Improve system performance and add analytics

**Success Criteria**:
- User can track success metrics (interview rate, offer rate)
- System handles 100+ applications per month
- Performance optimized for scale

**Epics Included**: 2 epics, 20 stories

### Epic 9: Advanced Features & Analytics (Week 11, 10 stories)
**Status**: Deferred to Phase 3

**Deliverables**:
- Application success analytics
- Company research integration
- Resume variant testing

**Key Features**:
- Interview rate tracking
- Company insights (Glassdoor, etc.)
- A/B testing for resume variants

---

### Epic 10: System Monitoring & Optimization (Week 12, 10 stories)
**Status**: Deferred to Phase 3

**Deliverables**:
- Error logging and alerting
- Performance monitoring
- Cost optimization

**Key Features**:
- Error tracking (Sentry)
- Performance metrics (Vercel Analytics)
- OpenAI cost tracking and optimization

---

## Timeline Summary

| Phase | Duration | Stories | Status |
|-------|----------|---------|--------|
| **Phase 0** | 2-4 hours | 7 | Not Started (USER) |
| **Phase 1 (MVP)** | 6-8 weeks | 39 | Not Started |
| **Phase 2** | 4-6 weeks | 30 | Deferred |
| **Phase 3** | 2-3 weeks | 20 | Deferred |
| **TOTAL** | 4-6 months | 96 | Planning |

---

## Delivery Milestones

### Milestone 1: "Hello World" (End of Week 1)
- ✅ Development environment running
- ✅ Basic Next.js app deployed
- ✅ Database schema created

### Milestone 2: "First Job Scraped" (End of Week 2)
- ✅ n8n workflows running
- ✅ Jobs appearing in database
- ✅ Embeddings generated

### Milestone 3: "First User Can Browse" (End of Week 3)
- ✅ Web UI functional
- ✅ User can see and filter jobs
- ✅ Semantic search working

### Milestone 4: "First Application Sent" (End of Week 6)
- ✅ **MVP COMPLETE**
- ✅ User can apply to jobs with AI-customized materials
- ✅ Application tracking functional
- ✅ Deployed to production

### Milestone 5: "Mobile Workflow Complete" (End of Week 10)
- ✅ Phase 2 complete
- ✅ Telegram bot notifications
- ✅ Email monitoring
- ✅ Interview management

### Milestone 6: "Production Ready" (End of Week 12)
- ✅ Phase 3 complete
- ✅ Analytics and monitoring
- ✅ Optimized for scale

---

## Resource Requirements

### Phase 1 (MVP)
- **Developer Time**: 6-8 weeks (1 full-time developer)
- **User Time**: 2-4 hours (Epic 0 setup)
- **Monthly Costs**:
  - OpenAI API: ~$20-50
  - Railway.app: ~$20 (Hobby plan)
  - **Total**: ~$40-70/month

### Phase 2 (Enhanced)
- **Developer Time**: 4-6 weeks
- **Monthly Costs**: +$0 (same services)

### Phase 3 (Optimization)
- **Developer Time**: 2-3 weeks
- **Monthly Costs**: +$10 (monitoring tools)

---

## Risk Mitigation

### Phase 1 Risks
- **Job scraper blocked**: Use multiple sources, respect robots.txt, add delays
- **OpenAI costs exceed budget**: Implement caching, use GPT-4o-mini for enrichment
- **Poor match quality**: Tune scoring algorithm based on user feedback

### Phase 2 Risks
- **Email parsing unreliable**: Fallback to manual interview entry
- **Telegram adoption low**: Keep web UI as primary interface

### Phase 3 Risks
- **Analytics complexity**: Start simple, iterate based on user needs

---

## Decision Points

### After Phase 1 MVP (Week 6)
**Evaluate**:
- User adoption (self-use vs broader)
- Time savings achieved
- Interview rate improvement
- Cost sustainability

**Decide**:
- ✅ **Proceed to Phase 2** if MVP validates core value
- ⏸️ **Pause and iterate** if user experience needs improvement
- ⏭️ **Pivot** if core assumptions proven wrong

### After Phase 2 (Week 10)
**Evaluate**:
- Mobile workflow usage
- Automation effectiveness
- User satisfaction

**Decide**:
- ✅ **Proceed to Phase 3** for scaling and optimization
- 🔄 **Circle back** to enhance Phase 1/2 features

---

## Success Metrics

### Phase 1 (MVP) Success
- ✅ Time per application reduced from 45 min → <5 min
- ✅ 50+ jobs discovered per day
- ✅ User applies to 10+ jobs per week
- ✅ AI customization quality rated 8+/10 by user

### Phase 2 Success
- ✅ 80% of workflow completed via mobile/Telegram
- ✅ 90% of interview invitations detected automatically
- ✅ Zero missed interview opportunities

### Phase 3 Success
- ✅ Interview rate >10% (industry benchmark: 2-5%)
- ✅ System handles 100+ applications/month
- ✅ Monthly costs <$100 for 100 applications

---

## Next Steps

1. **Complete Epic 0** (User, 2-4 hours)
2. **Begin Epic 1** (Developer, Week 1)
3. **Weekly check-ins** to track progress
4. **End of Phase 1 review** (Week 6) to decide on Phase 2
