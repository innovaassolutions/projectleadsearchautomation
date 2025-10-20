# Story 3.4: Semantic Job Matching with pgvector

**Epic**: 3 - Application Project Management & Matching
**Story ID**: 3.4
**Estimated Time**: 10-12 hours

---

## User Story

**As a** system
**I want** to match jobs using semantic similarity in addition to keywords
**So that** relevant jobs are discovered even when keyword criteria don't perfectly align

---

## Acceptance Criteria

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

---

## Technical Notes

- pgvector extension required (from Epic 1)
- Use HNSW index for fast approximate similarity search
- Tune similarity threshold based on precision/recall tradeoff
- Cache project embeddings (regenerate only on criteria change)

---

## Dependencies

- Story 3.3 completed (keyword matching baseline)
- Story 3.5 completed (matching table schema)
- Epic 2 Story 2.7 completed (job embeddings)
- OpenAI API key configured

---

## Definition of Done

- [ ] Project embeddings generated successfully
- [ ] Semantic similarity queries return relevant jobs
- [ ] Hybrid matches (keyword + semantic) scored correctly
- [ ] Performance acceptable with HNSW index
- [ ] Semantic matching discovers jobs missed by keywords
