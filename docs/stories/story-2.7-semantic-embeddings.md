# Story 2.7: Semantic Embeddings with pgvector

**Epic**: 2 - Job Discovery & Enrichment Pipeline
**Story ID**: 2.7
**Estimated Time**: 6-8 hours

---

## User Story

**As a** system
**I want** to generate semantic embeddings for job descriptions using OpenAI
**So that** I can enable semantic similarity matching for intelligent job recommendations

---

## Acceptance Criteria

- [ ] n8n workflow created: "Generate Job Embeddings"
- [ ] Workflow triggered after OpenAI enrichment completes
- [ ] OpenAI Embeddings API node configured:
  - Model: `text-embedding-ada-002` (1536 dimensions)
  - Input: job title + description + skills (concatenated)
  - Max input length: 8191 tokens
- [ ] Embedding vector (1536 floats) returned from API
- [ ] Vector inserted into `job_embeddings` table:
  - Columns: `id`, `job_id`, `embedding` (vector type)
  - Index created for vector similarity search
- [ ] Error handling: retry embeddings on API failure
- [ ] Cost tracking: log API usage (embeddings cheaper than completions)
- [ ] Batch processing: generate embeddings for 50 jobs per run
- [ ] pgvector similarity function tested:
  - Query: find jobs similar to a given job
  - Method: cosine similarity (`<=>` operator)
- [ ] Test query returns top 10 similar jobs with similarity scores
- [ ] Workflow exported to `/apps/n8n-workflows/generate-embeddings.json`

---

## Technical Notes

- pgvector extension must be enabled (from Epic 1)
- Use `vector(1536)` data type for ada-002 embeddings
- Create GiST or HNSW index for fast similarity search
- Embedding generation is relatively cheap (~$0.0001 per 1K tokens)

---

## Dependencies

- Epic 1 completed (pgvector extension enabled)
- OpenAI enrichment workflow (Story 2.6) completed
- `job_embeddings` table created in database schema
- OpenAI API key configured

---

## Definition of Done

- [ ] Embeddings generated for all enriched jobs
- [ ] pgvector similarity queries return relevant results
- [ ] HNSW or GiST index created for performance
- [ ] Cost per embedding <$0.001
- [ ] Batch processing completes within 1 hour
