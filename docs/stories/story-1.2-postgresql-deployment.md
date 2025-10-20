# Story 1.2: Deploy PostgreSQL with Extensions

> **Epic**: Epic 1 - Foundation & Core Infrastructure
> **Status**: Not Started
> **Estimated Time**: 1-2 hours

---

## User Story

**As a** developer
**I want** PostgreSQL deployed on Railway with required extensions
**So that** I can store application data with vector search capabilities

---

## Acceptance Criteria

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

---

## Technical Notes

- pgvector extension required for semantic job matching (Epic 2)
- Use Railway's PostgreSQL service for managed hosting
- Document connection string format for team reference

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] PostgreSQL service running on Railway
- [ ] All required extensions installed and verified
- [ ] Connection tested successfully from local machine
- [ ] Credentials documented securely
