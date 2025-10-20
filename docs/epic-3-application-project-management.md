# Epic 3: Application Project Management & Matching

> **Phase**: 1 (MVP)
> **Estimated Time**: 3-4 weeks
> **Must Complete Before**: Epic 4 (AI-Powered Application Customization)
> **Depends On**: Epic 2 (Job Discovery & Enrichment Pipeline)
> **Status**: Not Started
> **Stories**: 10

---

## Overview

Enable users to create and manage Application Projects with sophisticated configurable criteria (salary range, job titles, industries, seniority levels, automation mode), implement intelligent job matching engine using both keyword-based filtering and pgvector semantic similarity, create learning system that suggests criteria reuse based on previous successful projects, build comprehensive project management UI with bulk actions and templates, and establish matching association table to track job-project relationships.

**Why This Matters**: Application Projects are the core organizational unit that drives the entire automation system. Without proper project management and intelligent matching, users cannot effectively target specific job types, and the system cannot automate applications efficiently. The semantic matching ensures high-quality matches beyond simple keyword filtering.

---

## Epic Goal

Deploy a complete Application Project management system that allows users to define job search criteria across multiple dimensions, automatically match incoming jobs using hybrid keyword + semantic similarity algorithms, learn from successful application patterns, and manage multiple concurrent projects with different automation modes—all accessible through an intuitive UI.

---

## User Stories

### Story 3.1: Application Project CRUD UI

**As a** user
**I want** to create, view, edit, and delete Application Projects
**So that** I can organize my job search into focused campaigns with specific criteria

**Acceptance Criteria**:
- [ ] NextJS page created: `/app/projects/page.tsx`
- [ ] Project list displays all user projects with cards showing:
  - Project name and description
  - Automation mode badge (Full Auto / Semi Auto)
  - Active/inactive status toggle
  - Match count (jobs matching criteria)
  - Created date
  - Last matched date
  - Quick actions: Edit, Duplicate, Delete
- [ ] "Create New Project" button navigates to creation form
- [ ] Project creation form (`/app/projects/new/page.tsx`):
  - Name (required, max 100 chars)
  - Description (optional, max 500 chars)
  - Automation mode (radio: Full Auto / Semi Auto)
  - Active status (toggle, default: true)
- [ ] Form validation with inline error messages
- [ ] Create action calls PostgREST API: `POST /application_projects`
- [ ] Success message on creation, redirect to project detail page
- [ ] Edit form (`/app/projects/[id]/edit/page.tsx`) pre-populated
- [ ] Update action calls: `PATCH /application_projects?id=eq.{id}`
- [ ] Delete action with confirmation modal
  - Warning: "This will not delete existing applications"
  - Confirmation required: type project name
- [ ] Delete calls: `DELETE /application_projects?id=eq.{id}`
- [ ] Empty state: "No projects yet" with CTA to create first
- [ ] Loading states for all API calls
- [ ] Responsive design (desktop + tablet)

**Technical Notes**:
- Use shadcn/ui Form, Input, Textarea, Switch, RadioGroup components
- Implement optimistic UI updates for toggle actions
- Use Zod for form validation
- Store automation mode as enum in database

**Estimated Time**: 8-10 hours

---

### Story 3.2: Project Criteria Configuration with Autocomplete

**As a** user
**I want** to configure detailed job matching criteria with autocomplete suggestions
**So that** I can precisely define what types of jobs I'm interested in

**Acceptance Criteria**:
- [ ] Criteria configuration form added to project creation/edit pages
- [ ] Salary range fields:
  - Minimum salary (number input, optional)
  - Maximum salary (number input, optional)
  - Currency selector (dropdown: USD, EUR, GBP, etc.)
- [ ] Job titles field:
  - Multi-select input with autocomplete
  - Suggestions from existing job data (aggregate distinct titles)
  - Free text entry allowed
  - Display as tags/chips
- [ ] Industries field:
  - Multi-select with autocomplete
  - Suggestions: fintech, healthtech, SaaS, e-commerce, AI/ML, etc.
  - Free text entry allowed
- [ ] Seniority levels:
  - Multi-select checkboxes
  - Options: Entry, Mid, Senior, Staff, Principal, Executive
- [ ] Job types:
  - Multi-select checkboxes
  - Options: Frontend, Backend, Fullstack, DevOps, Data, Mobile, etc.
- [ ] Required skills/technologies:
  - Multi-select with autocomplete
  - Suggestions from job tags (top 100 most common)
  - Free text entry allowed
- [ ] Nice-to-have skills (optional):
  - Same as required skills
- [ ] Remote policy preference:
  - Radio buttons: Fully Remote, Hybrid OK, Any
- [ ] Criteria saved as JSON in `application_projects.criteria_json`
- [ ] API call validates criteria structure before saving
- [ ] Form shows validation errors for invalid criteria

**Technical Notes**:
- Use shadcn/ui Command component for autocomplete
- Fetch autocomplete data from PostgREST: `GET /jobs?select=tags&limit=100`
- Aggregate unique values client-side or server-side
- Store criteria as structured JSON (not stringified)

**Estimated Time**: 10-12 hours

---

### Story 3.3: Keyword-Based Job Matching Engine

**As a** system
**I want** to match jobs against project criteria using keyword filtering
**So that** jobs meeting explicit user requirements are automatically associated with projects

**Acceptance Criteria**:
- [ ] n8n workflow created: "Keyword Job Matching"
- [ ] Workflow triggered after job enrichment completes (Story 2.6)
- [ ] Workflow fetches all active application projects
- [ ] For each project, apply keyword filters:
  - Salary: job salary >= project min AND <= project max (if specified)
  - Job titles: job title contains any project title (case-insensitive)
  - Industries: job industry matches any project industry
  - Seniority: job seniority matches any project seniority level
  - Job types: job type matches any project job type
  - Required skills: job tags contain ALL required skills
  - Nice-to-have skills: job tags contain ANY nice-to-have (bonus points)
- [ ] Matching logic uses SQL WHERE clauses with PostgREST filtering
- [ ] Calculate match score (0-100):
  - Base: 50 points (all required criteria met)
  - +10 for each nice-to-have skill matched (max +30)
  - +10 for salary within ideal range (75-100% of max)
  - +10 for exact seniority match
- [ ] Matches stored in `job_project_matches` table:
  - Columns: `id`, `job_id`, `project_id`, `match_score`, `match_type` ('keyword'), `matched_at`
- [ ] Workflow logs matching statistics per project
- [ ] Duplicate matches prevented (check existing matches)
- [ ] Workflow exported to `/apps/n8n-workflows/keyword-matching.json`

**Technical Notes**:
- Use PostgreSQL array operators for skill matching (@>, &&)
- Use pg_trgm for fuzzy job title matching
- Optimize with database indexes on match criteria columns
- Consider batch processing (match 100 jobs at once)

**Estimated Time**: 10-12 hours

---

### Story 3.4: Semantic Job Matching with pgvector

**As a** system
**I want** to match jobs using semantic similarity in addition to keywords
**So that** relevant jobs are discovered even when keyword criteria don't perfectly align

**Acceptance Criteria**:
- [ ] n8n workflow created: "Semantic Job Matching"
- [ ] Workflow triggered after keyword matching completes
- [ ] For each active project, generate "ideal job embedding":
  - Concatenate: project description + job titles + required skills
  - Call OpenAI Embeddings API (text-embedding-ada-002)
  - Store embedding in `application_projects` table (new column: `ideal_job_embedding vector(1536)`)
- [ ] Query pgvector for semantically similar jobs:
  - SQL: `SELECT * FROM jobs WHERE embedding <=> project_embedding < 0.3 ORDER BY embedding <=> project_embedding LIMIT 50`
  - Cosine similarity threshold: 0.3 (adjustable)
- [ ] Calculate semantic match score:
  - Convert cosine distance to similarity: (1 - distance) * 100
  - Example: distance 0.2 = 80% similarity
- [ ] Store semantic matches in `job_project_matches`:
  - `match_type`: 'semantic'
  - `match_score`: semantic similarity percentage
- [ ] Combine with keyword matches:
  - If job has both keyword + semantic match, use higher score
  - Add bonus: +10 points for hybrid match
- [ ] Update match score in database
- [ ] Workflow logs semantic matching statistics
- [ ] Test semantic matching finds relevant jobs missed by keywords
- [ ] Workflow exported to `/apps/n8n-workflows/semantic-matching.json`

**Technical Notes**:
- pgvector extension required (from Epic 1)
- Use HNSW index for fast approximate similarity search
- Tune similarity threshold based on precision/recall tradeoff
- Cache project embeddings (regenerate only on criteria change)

**Estimated Time**: 10-12 hours

---

### Story 3.5: Job-Project Matching Association Table

**As a** developer
**I want** a dedicated table to track job-project match relationships
**So that** the system can efficiently query matched jobs and track match history

**Acceptance Criteria**:
- [ ] Database migration created: `003_job_project_matches.sql`
- [ ] Table created: `job_project_matches`
  - Columns:
    - `id` (UUID, primary key)
    - `job_id` (UUID, foreign key to jobs, indexed)
    - `project_id` (UUID, foreign key to application_projects, indexed)
    - `match_score` (integer, 0-100)
    - `match_type` (enum: 'keyword', 'semantic', 'hybrid')
    - `matched_at` (timestamp with time zone)
    - `reviewed` (boolean, default false)
    - `dismissed` (boolean, default false)
- [ ] Composite unique index: `(job_id, project_id)` (prevent duplicates)
- [ ] Index on `project_id, match_score DESC` (for sorted queries)
- [ ] Index on `match_type` (for filtering)
- [ ] Foreign key constraints with CASCADE on delete
- [ ] Default values set appropriately
- [ ] Migration applied to Railway database
- [ ] PostgREST endpoint verified: `GET /job_project_matches`
- [ ] Test queries:
  - Get all matches for a project, sorted by score
  - Get all projects matching a specific job
  - Count unreviewed matches per project

**Technical Notes**:
- Use composite index for efficient project-based queries
- Consider partitioning table if match volume is very high
- `reviewed` flag for Semi Auto mode review queue
- `dismissed` flag for user-rejected matches

**Estimated Time**: 4-6 hours

---

### Story 3.6: Project Detail Page with Matched Jobs

**As a** user
**I want** to view a project's details and all matched jobs in one place
**So that** I can see which opportunities the system has found for this project

**Acceptance Criteria**:
- [ ] NextJS page created: `/app/projects/[id]/page.tsx`
- [ ] Page displays project header:
  - Project name and description
  - Automation mode badge
  - Active/inactive status
  - Edit and Delete buttons
- [ ] Criteria summary section:
  - Salary range
  - Job titles (as tags)
  - Industries, seniority levels, job types
  - Required skills, nice-to-have skills
  - Remote policy
- [ ] Matched jobs section:
  - List of job cards sorted by match score (descending)
  - Each card shows:
    - Job title, company, source platform
    - Match score badge (0-100, color-coded)
    - Match type badge (keyword/semantic/hybrid)
    - Posted date
    - Tags/skills
    - "View Details" button → job detail page
    - "Dismiss" button (marks match as dismissed)
- [ ] Filtering controls:
  - Match type filter (keyword/semantic/hybrid/all)
  - Minimum match score slider (0-100)
  - Show/hide dismissed matches toggle
- [ ] Pagination: 20 matches per page
- [ ] Empty state: "No matches yet" with explanation
- [ ] API calls:
  - `GET /application_projects?id=eq.{id}` (project details)
  - `GET /job_project_matches?project_id=eq.{id}&order=match_score.desc&dismissed=eq.false`
  - `GET /jobs?id=in.({job_ids})` (fetch job details)
- [ ] Dismiss action:
  - `PATCH /job_project_matches?id=eq.{match_id}` set `dismissed=true`
  - Optimistic UI update (remove card immediately)
- [ ] Match count displayed: "127 jobs matched (12 dismissed)"
- [ ] Responsive design (desktop + tablet)

**Technical Notes**:
- Use Server Component for initial data fetch
- Use Client Component for interactive filtering
- Consider using React Query for efficient data caching
- Color-code match scores: 90-100 (green), 70-89 (yellow), 50-69 (orange)

**Estimated Time**: 10-12 hours

---

### Story 3.7: Project Learning and Criteria Suggestions

**As a** user
**I want** the system to suggest criteria based on my previous successful projects
**So that** I can quickly create similar projects without re-entering all details

**Acceptance Criteria**:
- [ ] "Suggest Criteria" button added to project creation form
- [ ] Button click triggers analysis of existing projects:
  - Identify projects with highest application success rates
  - Extract common criteria patterns (frequent skills, industries, seniority)
- [ ] API endpoint created: `GET /api/projects/suggest-criteria`
  - Analyzes user's application history (from `applications` table)
  - Finds jobs with highest interview/success rates
  - Aggregates common attributes (tags, industries, seniority)
  - Returns suggested criteria as JSON
- [ ] Suggestions displayed in modal:
  - Top 5 most common skills
  - Top 3 industries
  - Most common seniority levels
  - Average successful salary range
  - "Apply Suggestions" button
- [ ] "Apply Suggestions" populates form fields
- [ ] User can edit suggestions before saving
- [ ] Empty state: "Not enough application data yet" (if <10 applications)
- [ ] Suggestion algorithm uses weighted scoring:
  - Interview received: +10 points
  - Job offer: +20 points
  - Application sent: +1 point
- [ ] Suggestions cached for 24 hours (avoid recalculating frequently)

**Technical Notes**:
- Use PostgreSQL aggregate functions (COUNT, AVG)
- Consider using OpenAI to generate project description from criteria
- Store suggestion cache in Redis or database table
- Require minimum 10 applications before showing suggestions

**Estimated Time**: 8-10 hours

---

### Story 3.8: Bulk Actions on Matched Jobs

**As a** user
**I want** to perform bulk actions on multiple matched jobs at once
**So that** I can efficiently manage large numbers of matches

**Acceptance Criteria**:
- [ ] Checkbox selection added to job cards in project detail page
- [ ] "Select All" checkbox in table header (selects all on current page)
- [ ] Selection counter: "5 jobs selected"
- [ ] Bulk action dropdown menu:
  - "Dismiss Selected" - marks matches as dismissed
  - "Bookmark Selected" - adds jobs to bookmarks (if bookmark feature exists)
  - "Apply to All" - queues applications (Semi Auto) or submits (Full Auto)
  - "Export Selected" - downloads job data as CSV
- [ ] Bulk dismiss action:
  - Confirmation modal: "Dismiss 5 matches?"
  - API call: `PATCH /job_project_matches?id=in.({ids})` set `dismissed=true`
  - Optimistic UI update (remove cards)
  - Success toast: "5 matches dismissed"
- [ ] Bulk apply action:
  - Confirmation modal with summary
  - Triggers application workflow (Epic 5)
  - Progress indicator for batch processing
  - Success toast with count: "5 applications queued"
- [ ] Bulk export action:
  - Generates CSV with columns: title, company, url, match_score, tags
  - Downloads file: `project-{name}-matches-{date}.csv`
- [ ] Selection cleared after action completes
- [ ] Error handling: partial failures reported clearly

**Technical Notes**:
- Use shadcn/ui Checkbox component
- Implement client-side selection state (Zustand or React state)
- Use PostgREST `in` filter for bulk operations
- Consider rate limiting for large bulk operations

**Estimated Time**: 8-10 hours

---

### Story 3.9: Project Templates and Duplication

**As a** user
**I want** to save projects as templates and duplicate existing projects
**So that** I can quickly create similar projects with pre-configured criteria

**Acceptance Criteria**:
- [ ] "Save as Template" button added to project detail page
- [ ] Save template action:
  - Opens modal: "Template Name" input
  - Saves project criteria to `project_templates` table:
    - Columns: `id`, `user_id`, `name`, `description`, `criteria_json`, `created_at`
  - Success toast: "Template saved"
- [ ] "Use Template" button on project creation page
- [ ] Template selection modal:
  - List of user's saved templates
  - Each shows: name, description, created date
  - "Use This Template" button
- [ ] Using template pre-fills project creation form with criteria
- [ ] User can modify criteria before saving
- [ ] "Duplicate Project" action in project list:
  - Opens creation form pre-filled with all project data
  - Appends " (Copy)" to project name
  - Creates new project with same criteria
- [ ] Database migration: `004_project_templates.sql`
- [ ] PostgREST endpoints:
  - `GET /project_templates?user_id=eq.{user_id}`
  - `POST /project_templates`
  - `DELETE /project_templates?id=eq.{id}`
- [ ] Template count limit: 10 per user (prevent abuse)
- [ ] Validation: template names must be unique per user

**Technical Notes**:
- Store templates per-user (multi-user support in future)
- Consider sharing templates between users (public template library)
- Use same criteria validation as projects
- Templates are read-only references (editing template doesn't affect projects)

**Estimated Time**: 8-10 hours

---

### Story 3.10: Project Activity Feed

**As a** user
**I want** to see a timeline of activity for each project
**So that** I can track when matches were found and applications were sent

**Acceptance Criteria**:
- [ ] Activity feed section added to project detail page
- [ ] Activity events tracked:
  - Project created
  - Criteria updated
  - New job matched (batch summary: "15 new matches")
  - Application submitted (link to application detail)
  - Application status changed (interview, rejection, etc.)
  - Project activated/deactivated
- [ ] Database migration: `005_project_activity.sql`
- [ ] Table created: `project_activity`
  - Columns:
    - `id` (UUID, primary key)
    - `project_id` (UUID, foreign key)
    - `activity_type` (enum: created, updated, matched, applied, status_changed, toggled)
    - `description` (text, human-readable summary)
    - `metadata` (jsonb, structured event data)
    - `created_at` (timestamp)
- [ ] Activity feed UI displays:
  - Reverse chronological order (newest first)
  - Icon for each activity type
  - Timestamp (relative: "2 hours ago")
  - Description text
  - Link to related entity (job, application)
- [ ] Pagination: 20 activities per page
- [ ] "View All Activity" link to dedicated activity page
- [ ] Activity automatically created on relevant actions:
  - Project CRUD operations
  - Matching workflows (n8n triggers activity creation)
  - Application workflows
- [ ] Filter controls:
  - Activity type filter (dropdown)
  - Date range filter
- [ ] Empty state: "No activity yet"

**Technical Notes**:
- Use PostgREST for activity insertion and queries
- Consider using database triggers for automatic activity creation
- Use Lucide React icons for activity types
- Store metadata as JSONB for flexible event data

**Estimated Time**: 8-10 hours

---

## Epic Summary

**Total Stories**: 10
**Total Estimated Time**: 3-4 weeks (developer time)
**Blocking**: Yes - Must complete before Epic 4

**Completion Checklist**:
- [ ] Story 3.1: Project CRUD UI functional
- [ ] Story 3.2: Criteria configuration with autocomplete working
- [ ] Story 3.3: Keyword matching engine deployed
- [ ] Story 3.4: Semantic matching with pgvector operational
- [ ] Story 3.5: Matching association table created
- [ ] Story 3.6: Project detail page with matched jobs
- [ ] Story 3.7: Learning system suggesting criteria
- [ ] Story 3.8: Bulk actions on matched jobs
- [ ] Story 3.9: Templates and duplication features
- [ ] Story 3.10: Activity feed tracking project events

**Ready to Proceed When**:
- All 10 stories completed
- Users can create and manage multiple projects
- Matching engine finds relevant jobs using hybrid approach
- Project detail pages show matched jobs with scores
- Bulk actions enable efficient match management
- Learning system improves over time

---

## Definition of Done

This epic is complete when:

1. **Project Management Works**: Users can create, edit, delete, and manage multiple Application Projects
2. **Criteria Configuration Complete**: Sophisticated multi-dimensional criteria with autocomplete
3. **Matching Engine Deployed**: Hybrid keyword + semantic matching finds relevant jobs
4. **Match Quality Validated**: Matching accuracy >80% based on user feedback
5. **UI Functional**: Project detail pages display matched jobs with filtering and sorting
6. **Bulk Operations**: Users can efficiently manage large numbers of matches
7. **Learning System Active**: Criteria suggestions based on application success patterns
8. **Activity Tracking**: All project events logged and visible in activity feed

---

## Technical Dependencies

**Epic 2 Completion**:
- Jobs scraped and enriched with metadata
- Semantic embeddings created with pgvector
- Database populated with job data

**Database Schema**:
- `application_projects` table with criteria_json column
- `job_project_matches` association table
- `project_templates` table
- `project_activity` table

**External Services**:
- OpenAI API for project embedding generation
- pgvector for semantic similarity queries

---

## Risk Mitigation

**Risk**: Matching engine generates too many false positives (low-quality matches)
- **Mitigation**: Tune match score thresholds; implement user feedback loop to adjust criteria
- **Fallback**: Allow users to adjust match sensitivity per project

**Risk**: Semantic matching performance degrades with large datasets
- **Mitigation**: Use HNSW index; pre-filter by keywords before semantic search
- **Fallback**: Make semantic matching optional; rely primarily on keyword matching

**Risk**: Criteria autocomplete suggestions are not helpful
- **Mitigation**: Aggregate from existing job data; weight by frequency and recency
- **Fallback**: Allow free-text entry without autocomplete

**Risk**: Learning system suggests irrelevant criteria (not enough data)
- **Mitigation**: Require minimum 10 applications before showing suggestions
- **Fallback**: Allow manual criteria entry; disable suggestions if data insufficient

**Risk**: Bulk operations timeout on large selections (100+ jobs)
- **Mitigation**: Implement batch processing with progress indicators; limit to 50 jobs per action
- **Fallback**: Process in background; notify user when complete

---

## Success Metrics

- ✅ Users create average 2-3 active projects
- ✅ Matching engine finds 20-50 relevant jobs per project per day
- ✅ Match score accuracy: 80%+ of high-scoring matches (>80) are relevant
- ✅ False positive rate: <20% of matches dismissed by users
- ✅ Criteria suggestions accepted: >50% of suggestions used by users
- ✅ Bulk action usage: >30% of users use bulk actions for efficiency
- ✅ Template creation: >20% of users save templates for reuse

---

## Next Steps

After completing Epic 3, proceed to **Epic 4: AI-Powered Application Customization** where you will:
- Build resume and cover letter template management
- Implement OpenAI-powered customization for each job
- Create A/B testing framework for different resume versions
- Build quality scoring system for generated materials
- Implement preview and regeneration UI
- Establish version history and rollback capabilities

Epic 4 will use the matched jobs from Epic 3 to generate customized application materials for each opportunity.
