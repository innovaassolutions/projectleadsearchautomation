# Epic 1: Foundation & Core Infrastructure

> **Phase**: 1 (MVP)
> **Estimated Time**: 2-3 weeks
> **Must Complete Before**: Epic 2 (Job Discovery & Enrichment Pipeline)
> **Status**: Not Started
> **Stories**: 9

---

## Overview

Establish the complete project foundation including monorepo structure, Railway deployment for all core services (PostgreSQL with extensions, PostgREST API), initialize NextJS application with Tailwind CSS and shadcn/ui, set up development environment with Docker Compose, implement basic health monitoring, and deploy a simple "system operational" dashboard to validate the entire stack is working end-to-end.

**Why This Matters**: This epic creates the technical foundation upon which all other features will be built. A solid infrastructure setup prevents rework and enables rapid feature development in subsequent epics.

---

## Epic Goal

Deploy a minimal but complete end-to-end system that proves the tech stack works together: NextJS frontend → PostgREST API → PostgreSQL database → n8n workflows, all running on Railway with local Docker Compose development environment, validated by a working health dashboard showing "system operational."

---

## User Stories

### Story 1.1: Initialize Monorepo Structure

**As a** developer
**I want** a properly structured monorepo with workspaces
**So that** frontend, workflows, and shared code are organized and maintainable

**Acceptance Criteria**:
- [ ] Repository initialized with Git
- [ ] Monorepo structure created with workspaces:
  - `/apps/web` - NextJS application
  - `/apps/n8n-workflows` - n8n workflow exports
  - `/packages/shared` - Shared TypeScript types
  - `/database` - Schema and migrations
  - `/docker` - Docker configurations
- [ ] Root `package.json` configured with workspaces
- [ ] `.gitignore` includes node_modules, .env*, .next, build artifacts
- [ ] `README.md` created with project overview and setup instructions
- [ ] Conventional commits configured (optional)
- [ ] Package manager lock file committed (npm/pnpm)

**Technical Notes**:
- Use npm workspaces or pnpm workspaces
- Consider using Turborepo for monorepo tooling (optional)

**Estimated Time**: 2-4 hours

---

### Story 1.2: Deploy PostgreSQL with Extensions

**As a** developer
**I want** PostgreSQL deployed on Railway with required extensions
**So that** I can store application data with vector search capabilities

**Acceptance Criteria**:
- [ ] PostgreSQL 15+ service created on Railway
- [ ] Database extensions enabled:
  - `uuid-ossp` (UUID generation)
  - `pg_trgm` (full-text search)
  - `pgvector` (semantic embeddings)
- [ ] Database connection string retrieved from Railway
- [ ] Railway environment variable `DATABASE_URL` configured
- [ ] Connection pooling configured (10-20 connections)
- [ ] Remote database connection tested from local machine
- [ ] Automated daily backups verified active (Railway default)
- [ ] Database credentials secured (not in code)

**Technical Notes**:
- pgvector extension required for semantic job matching (Epic 2)
- Use Railway's PostgreSQL service for managed hosting
- Document connection string format for team reference

**Estimated Time**: 1-2 hours

---

### Story 1.3: Create Initial Database Schema

**As a** developer
**I want** initial database schema with core tables
**So that** I can start building features with proper data models

**Acceptance Criteria**:
- [ ] Migration system initialized (`/database/migrations/`)
- [ ] Migration `001_initial_schema.sql` created with core tables:
  - `users` (id, email, created_at, updated_at)
  - `jobs` (id, title, company, url, source, scraped_at, archived_at)
  - `application_projects` (id, user_id, name, automation_mode, criteria_json, active)
  - `applications` (id, user_id, job_id, project_id, status, applied_at)
  - `job_embeddings` (id, job_id, embedding vector(1536))
- [ ] Primary keys and foreign keys defined
- [ ] Indexes created for common queries:
  - `jobs.scraped_at` (time-range queries)
  - `jobs.source` (platform filtering)
  - `applications.status` (status filtering)
  - `application_projects.user_id` (user projects)
- [ ] UUID default generation configured
- [ ] Timestamps (created_at, updated_at) included on all tables
- [ ] Migration applied to Railway database
- [ ] Schema documented in `/database/README.md`

**Technical Notes**:
- Use `vector(1536)` for OpenAI embeddings (ada-002 dimension)
- Keep schema minimal for Epic 1, expand in later epics
- Use SQL migration files (not ORM migrations)

**Estimated Time**: 4-6 hours

---

### Story 1.4: Deploy PostgREST API Server

**As a** developer
**I want** PostgREST deployed on Railway
**So that** I have an auto-generated REST API from the database schema

**Acceptance Criteria**:
- [ ] PostgREST Docker image configured (`/docker/postgrest.Dockerfile`)
- [ ] PostgREST service created on Railway
- [ ] Environment variables configured:
  - `PGRST_DB_URI` (PostgreSQL connection string)
  - `PGRST_DB_SCHEMA` (public)
  - `PGRST_DB_ANON_ROLE` (postgres or custom role)
  - `PGRST_SERVER_PORT` (3000)
- [ ] PostgREST service connected to PostgreSQL on Railway private network
- [ ] API endpoints tested:
  - `GET /jobs` returns empty array
  - `GET /application_projects` returns empty array
  - `POST /jobs` creates a test job
- [ ] CORS configured for NextJS app domain
- [ ] Connection pooling verified working
- [ ] PostgREST accessible only via Railway internal network (not public)
- [ ] API documentation generated from schema

**Technical Notes**:
- PostgREST auto-generates REST API from PostgreSQL schema
- No code required for CRUD operations
- Use Railway private networking for security

**Estimated Time**: 3-4 hours

---

### Story 1.5: Initialize NextJS Application

**As a** developer
**I want** NextJS 14+ app initialized with Tailwind and shadcn/ui
**So that** I can build the frontend interface

**Acceptance Criteria**:
- [ ] NextJS 14+ initialized in `/apps/web`
- [ ] TypeScript configured
- [ ] Tailwind CSS v3.x installed and configured
- [ ] shadcn/ui initialized with default theme
- [ ] Base components installed from shadcn/ui:
  - Button, Card, Input, Label, Badge, Separator
- [ ] Font configuration (Google Fonts via Next.js optimization)
- [ ] App router configured (`/app` directory)
- [ ] Basic layout created with navigation structure
- [ ] Home page (`/app/page.tsx`) created with "System Operational" placeholder
- [ ] Development server runs successfully (`npm run dev`)
- [ ] Hot reload verified working
- [ ] Environment variables loaded from `.env.local`
- [ ] Responsive design verified (desktop + tablet)

**Technical Notes**:
- Use Next.js App Router (not Pages Router)
- Configure Tailwind with shadcn/ui defaults
- Install Lucide React for icons

**Estimated Time**: 3-4 hours

---

### Story 1.6: Set Up Local Development Environment

**As a** developer
**I want** Docker Compose for local PostgreSQL and PostgREST
**So that** I can develop without depending on Railway services

**Acceptance Criteria**:
- [ ] `docker-compose.yml` created in project root
- [ ] PostgreSQL service defined:
  - Port 5432 mapped to host
  - Volume for persistent data
  - Extensions auto-loaded (uuid-ossp, pg_trgm, pgvector)
  - Initialization script runs migrations
- [ ] PostgREST service defined:
  - Port 3000 mapped to host
  - Connected to PostgreSQL service
  - Environment variables configured
- [ ] n8n service defined (basic setup):
  - Port 5678 mapped to host
  - Volume for workflow persistence
  - Connected to PostgreSQL for n8n data
- [ ] `npm run dev:infra` script starts all services
- [ ] Health check script verifies all services running
- [ ] Local `.env.local` configured for local services
- [ ] Documentation added to README for local setup

**Technical Notes**:
- Use official PostgreSQL, PostgREST, n8n Docker images
- Mount `/database/migrations` for auto-initialization
- Ensure pgvector extension available in PostgreSQL image

**Estimated Time**: 4-6 hours

---

### Story 1.7: Build System Health Dashboard

**As a** developer
**I want** a simple dashboard showing system health
**So that** I can verify the entire stack is working end-to-end

**Acceptance Criteria**:
- [ ] Health check API route created (`/app/api/health/route.ts`)
- [ ] Health check queries:
  - PostgreSQL connection status
  - PostgREST API reachability
  - Database migration version
  - Row counts for core tables (jobs, applications, etc.)
- [ ] Dashboard page created (`/app/dashboard/page.tsx`)
- [ ] Dashboard displays:
  - System status indicator (green/yellow/red)
  - Database connection status
  - API connection status
  - Last migration applied
  - Environment (development/production)
- [ ] Dashboard uses shadcn/ui Card components
- [ ] Real-time status updates (polling every 10 seconds)
- [ ] Error states handled gracefully
- [ ] Dashboard accessible at `/dashboard`
- [ ] Dashboard is responsive (desktop + tablet)

**Technical Notes**:
- Use Server Components for initial data fetch
- Use Client Component for real-time polling
- Display Railway vs local environment clearly

**Estimated Time**: 4-6 hours

---

### Story 1.8: Configure n8n Workflow Engine

**As a** developer
**I want** n8n deployed on Railway and configured
**So that** I can build workflow automations in later epics

**Acceptance Criteria**:
- [ ] n8n Docker image configured
- [ ] n8n service created on Railway
- [ ] Environment variables configured:
  - `N8N_BASIC_AUTH_ACTIVE=true`
  - `N8N_BASIC_AUTH_USER` (set secure username)
  - `N8N_BASIC_AUTH_PASSWORD` (set secure password)
  - `N8N_HOST` (Railway public URL)
  - `WEBHOOK_URL` (Railway public URL + /webhook)
  - Database connection for n8n persistence
- [ ] n8n accessible via Railway URL
- [ ] n8n login verified with basic auth
- [ ] Test workflow created: "Hello World HTTP Request"
- [ ] Webhook endpoint tested and reachable
- [ ] n8n workflows persistence verified (survives restart)
- [ ] n8n credentials secured (not in code)
- [ ] Workflow export/import tested

**Technical Notes**:
- n8n will be used for job scraping, AI enrichment, and automation (Epic 2+)
- Use Railway's built-in PostgreSQL for n8n data storage
- Enable webhook functionality for external triggers

**Estimated Time**: 3-4 hours

---

### Story 1.9: Create Shared TypeScript Types Package

**As a** developer
**I want** shared TypeScript types in `/packages/shared`
**So that** frontend and workflows use consistent data models

**Acceptance Criteria**:
- [ ] Package created at `/packages/shared`
- [ ] `package.json` configured with proper exports
- [ ] TypeScript types defined for core entities:
  - `User` (matches database schema)
  - `Job` (matches database schema)
  - `ApplicationProject` (matches database schema)
  - `Application` (matches database schema)
  - `JobEmbedding` (matches database schema)
- [ ] Enum types defined:
  - `JobSource` (remoteok, weworkremotely, himalayas, ycjobs, wellfound)
  - `AutomationMode` (full_auto, semi_auto)
  - `ApplicationStatus` (applied, no_response, interview, rejection)
- [ ] API response types defined:
  - `HealthCheckResponse`
  - `JobListResponse`
  - `ApplicationListResponse`
- [ ] Package imported successfully in `/apps/web`
- [ ] Types exported from index.ts
- [ ] Build script configured (`tsc`)
- [ ] Type validation working in IDE

**Technical Notes**:
- Sync types with database schema strictly
- Use Zod for runtime validation (optional enhancement)
- Export utility types for API contracts

**Estimated Time**: 3-4 hours

---

## Epic Summary

**Total Stories**: 9
**Total Estimated Time**: 2-3 weeks (developer time)
**Blocking**: Yes - Must complete before Epic 2

**Completion Checklist**:
- [ ] Story 1.1: Monorepo structure initialized
- [ ] Story 1.2: PostgreSQL deployed on Railway with extensions
- [ ] Story 1.3: Initial database schema created and migrated
- [ ] Story 1.4: PostgREST API server deployed on Railway
- [ ] Story 1.5: NextJS application initialized with Tailwind and shadcn/ui
- [ ] Story 1.6: Docker Compose local development environment working
- [ ] Story 1.7: System health dashboard deployed and operational
- [ ] Story 1.8: n8n workflow engine configured on Railway
- [ ] Story 1.9: Shared TypeScript types package created

**Ready to Proceed When**:
- All 9 stories completed
- Health dashboard shows green status
- Local development environment runs successfully
- Railway services deployed and accessible
- Team can run `npm run dev` and see operational dashboard

---

## Definition of Done

This epic is complete when:

1. **Infrastructure Deployed**: PostgreSQL, PostgREST, n8n all running on Railway
2. **Local Development Works**: Docker Compose environment fully functional
3. **Dashboard Live**: Health dashboard accessible and showing system status
4. **End-to-End Validation**: Can query PostgREST API from NextJS app successfully
5. **Types Shared**: Frontend uses types from shared package
6. **Documentation Complete**: README includes setup instructions
7. **Team Onboarding Ready**: New developer can clone repo and run locally in <30 minutes

---

## Technical Dependencies

**External Services**:
- Railway.app account (from Epic 0)
- Docker installed locally
- Node.js 20+ LTS installed

**Epic 0 Completion**:
- `.env.local` file with all credentials
- Railway.app project created
- All API access configured

---

## Risk Mitigation

**Risk**: pgvector extension not available in Railway PostgreSQL
- **Mitigation**: Verify pgvector support before deploying; use Railway's PostgreSQL plugin system
- **Fallback**: Deploy custom PostgreSQL Docker image with pgvector

**Risk**: PostgREST performance issues with large datasets
- **Mitigation**: Implement connection pooling and query optimization early
- **Fallback**: Add caching layer (Redis) if needed in Epic 10

**Risk**: Docker Compose too resource-intensive for local development
- **Mitigation**: Configure resource limits in docker-compose.yml
- **Fallback**: Use cloud services for heavy workloads (scraping, AI)

---

## Success Metrics

- ✅ Health dashboard shows all services green
- ✅ Local development environment starts in <2 minutes
- ✅ API response time <100ms for simple queries
- ✅ Zero deployment errors to Railway
- ✅ Team successfully completes local setup independently

---

## Next Steps

After completing Epic 1, proceed to **Epic 2: Job Discovery & Enrichment Pipeline** where you will:
- Build job scrapers for 5 platforms (Remote OK, WWR, Himalayas, YC Jobs, Wellfound)
- Implement OpenAI enrichment with metadata generation
- Create semantic embeddings with pgvector
- Build master orchestration workflow in n8n
- Deploy job listings UI

Epic 2 will validate that the infrastructure from Epic 1 can handle real-world data ingestion and processing at scale.
