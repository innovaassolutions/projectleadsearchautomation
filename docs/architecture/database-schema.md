# Database Schema

## Extensions and Setup

```sql
-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

SET timezone = 'UTC';
```

## Core Tables

### user_profile

```sql
CREATE TABLE user_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,

  -- Preferences
  target_roles TEXT[] DEFAULT '{}',
  must_have_tags TEXT[] DEFAULT '{}',
  nice_to_have_tags TEXT[] DEFAULT '{}',
  preferred_seniority VARCHAR(20)[] DEFAULT '{}',
  min_match_score INTEGER DEFAULT 70,

  -- External integrations
  telegram_id VARCHAR(100) UNIQUE,
  google_refresh_token TEXT,
  email_password TEXT,
  email_provider VARCHAR(50) DEFAULT 'gmail',
  imap_host VARCHAR(255),
  smtp_host VARCHAR(255),

  -- Default project
  default_project_id UUID,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### jobs

```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  title VARCHAR(500) NOT NULL,
  company VARCHAR(255) NOT NULL,
  url TEXT NOT NULL UNIQUE,
  description TEXT,
  tags TEXT[] DEFAULT '{}',

  seniority VARCHAR(20),
  source VARCHAR(50) NOT NULL,
  match_score INTEGER,

  scraped_at TIMESTAMPTZ DEFAULT NOW(),
  is_archived BOOLEAN DEFAULT false,
  archived_at TIMESTAMPTZ,

  CONSTRAINT valid_seniority CHECK (seniority IN ('junior', 'mid', 'senior', 'lead', 'executive')),
  CONSTRAINT valid_match_score CHECK (match_score >= 0 AND match_score <= 100)
);

CREATE INDEX idx_jobs_active ON jobs(match_score DESC, scraped_at DESC) WHERE is_archived = false;
CREATE INDEX idx_jobs_tags ON jobs USING GIN(tags);
```

### job_embeddings

```sql
CREATE TABLE job_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,

  embedding vector(1536) NOT NULL,
  model VARCHAR(100) DEFAULT 'text-embedding-3-small',
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(job_id)
);

-- HNSW index for fast semantic search
CREATE INDEX idx_job_embeddings_vector ON job_embeddings
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);
```

### applications

```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES application_projects(id) ON DELETE CASCADE,

  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  resume_used TEXT,
  cover_letter_used TEXT,

  applied_at TIMESTAMPTZ,
  submission_method VARCHAR(50),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_status CHECK (status IN ('draft', 'ready_to_apply', 'applied', 'no_response', 'interview', 'rejected', 'offer', 'accepted')),
  UNIQUE(job_id, project_id)
);

CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_applied_at ON applications(applied_at DESC) WHERE applied_at IS NOT NULL;
```

### interviews

```sql
CREATE TABLE interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,

  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  location TEXT,
  round VARCHAR(100),
  interviewer_name VARCHAR(255),
  interviewer_email VARCHAR(255),

  prep_notes TEXT,
  status VARCHAR(20) DEFAULT 'scheduled',
  feedback TEXT,
  outcome VARCHAR(20),

  calendar_event_id VARCHAR(255),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_status CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  CONSTRAINT valid_outcome CHECK (outcome IS NULL OR outcome IN ('passed', 'failed', 'pending'))
);

CREATE INDEX idx_interviews_scheduled_at ON interviews(scheduled_at);
CREATE INDEX idx_interviews_status ON interviews(status);
```

## Helper Functions

### semantic_search()

```sql
CREATE OR REPLACE FUNCTION semantic_search(
  query_embedding vector(1536),
  similarity_threshold float DEFAULT 0.7,
  max_results int DEFAULT 20
)
RETURNS TABLE (
  job_id uuid,
  title varchar(500),
  company varchar(255),
  url text,
  description text,
  tags text[],
  match_score integer,
  similarity float
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    j.id,
    j.title,
    j.company,
    j.url,
    j.description,
    j.tags,
    j.match_score,
    1 - (je.embedding <=> query_embedding) AS similarity
  FROM jobs j
  JOIN job_embeddings je ON j.id = je.job_id
  WHERE j.is_archived = false
    AND 1 - (je.embedding <=> query_embedding) > similarity_threshold
  ORDER BY similarity DESC
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql;
```

## Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY user_profile_isolation ON user_profile
  USING (id = current_setting('request.jwt.claims', true)::json->>'user_id');

CREATE POLICY application_projects_isolation ON application_projects
  USING (user_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid);

-- Anonymous users can view jobs
CREATE POLICY jobs_public_read ON jobs
  FOR SELECT
  USING (is_archived = false);
```

---
