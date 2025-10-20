# Story 1.4: Deploy PostgREST API Server

> **Epic**: Epic 1 - Foundation & Core Infrastructure
> **Status**: Not Started
> **Estimated Time**: 3-4 hours

---

## User Story

**As a** developer
**I want** PostgREST deployed on Railway
**So that** I have an auto-generated REST API from the database schema

---

## Acceptance Criteria

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

---

## Technical Notes

- PostgREST auto-generates REST API from PostgreSQL schema
- No code required for CRUD operations
- Use Railway private networking for security

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] PostgREST deployed and running on Railway
- [ ] All API endpoints tested successfully
- [ ] CORS properly configured
- [ ] API accessible from NextJS application
