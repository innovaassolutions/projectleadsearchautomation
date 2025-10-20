# Story 1.6: Set Up Local Development Environment

> **Epic**: Epic 1 - Foundation & Core Infrastructure
> **Status**: Not Started
> **Estimated Time**: 4-6 hours

---

## User Story

**As a** developer
**I want** Docker Compose for local PostgreSQL and PostgREST
**So that** I can develop without depending on Railway services

---

## Acceptance Criteria

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

---

## Technical Notes

- Use official PostgreSQL, PostgREST, n8n Docker images
- Mount `/database/migrations` for auto-initialization
- Ensure pgvector extension available in PostgreSQL image

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Docker Compose services start successfully
- [ ] All services health checks passing
- [ ] Local development environment fully functional
- [ ] Documentation complete and tested
