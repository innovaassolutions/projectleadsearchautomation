# Story 2.6: OpenAI Job Enrichment Workflow

**Epic**: 2 - Job Discovery & Enrichment Pipeline
**Story ID**: 2.6
**Estimated Time**: 6-8 hours

---

## User Story

**As a** system
**I want** to enrich scraped jobs with AI-generated metadata using OpenAI
**So that** jobs have consistent tags, seniority levels, and quality scores

---

## Acceptance Criteria

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

---

## Technical Notes

- Use OpenAI function calling for structured output
- Truncate job descriptions to stay under token limits
- Batch enrichment for efficiency (process 10 jobs at once)
- Monitor OpenAI costs closely (target <$0.05 per job)

---

## Dependencies

- Epic 1 completed (OpenAI API key configured)
- All scrapers (2.1-2.5) providing jobs
- Database schema includes enrichment columns
- OpenAI API key from Epic 0

---

## Definition of Done

- [ ] Workflow enriches jobs with accurate metadata
- [ ] Classification accuracy >90% on test set
- [ ] Cost per job <$0.05
- [ ] Error handling prevents workflow failures
- [ ] Enrichment data visible in database
