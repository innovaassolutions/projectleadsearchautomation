# Story 1.8: Configure n8n Workflow Engine

> **Epic**: Epic 1 - Foundation & Core Infrastructure
> **Status**: Not Started
> **Estimated Time**: 3-4 hours

---

## User Story

**As a** developer
**I want** n8n deployed on Railway and configured
**So that** I can build workflow automations in later epics

---

## Acceptance Criteria

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

---

## Technical Notes

- n8n will be used for job scraping, AI enrichment, and automation (Epic 2+)
- Use Railway's built-in PostgreSQL for n8n data storage
- Enable webhook functionality for external triggers

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] n8n deployed and accessible on Railway
- [ ] Authentication working properly
- [ ] Test workflow functional
- [ ] Webhook endpoints verified
- [ ] Persistence confirmed
