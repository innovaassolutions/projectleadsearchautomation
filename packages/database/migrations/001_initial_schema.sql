-- Migration: 001 - Initial Database Schema
-- Created: 2025-10-23
-- Description: Creates core tables for job application system
-- Tables: user_profile, application_projects, jobs, job_embeddings, applications

-- ==============================================================================
-- EXTENSIONS
-- ==============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable text similarity search
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enable vector similarity search (pgvector)
CREATE EXTENSION IF NOT EXISTS "vector";

-- Enable cryptographic functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set timezone to UTC
SET timezone = 'UTC';

-- ==============================================================================
-- TABLE: user_profile
-- ==============================================================================

CREATE TABLE user_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,

  -- Job search preferences
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

  -- Default project reference
  default_project_id UUID,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- TABLE: application_projects
-- ==============================================================================

CREATE TABLE application_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profile(id) ON DELETE CASCADE,

  name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Automation configuration
  automation_mode VARCHAR(20) NOT NULL DEFAULT 'semi_auto',
  is_active BOOLEAN DEFAULT true,

  -- Criteria (stored as JSONB for flexibility)
  criteria_json JSONB DEFAULT '{}',

  -- Template references
  default_resume_template_id UUID,
  default_cover_letter_template_id UUID,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_automation_mode CHECK (automation_mode IN ('full_auto', 'semi_auto'))
);

-- Indexes for application_projects
CREATE INDEX idx_application_projects_user_id ON application_projects(user_id);
CREATE INDEX idx_application_projects_active ON application_projects(is_active) WHERE is_active = true;

-- ==============================================================================
-- TABLE: jobs
-- ==============================================================================

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

  -- Constraints
  CONSTRAINT valid_seniority CHECK (seniority IN ('junior', 'mid', 'senior', 'lead', 'executive')),
  CONSTRAINT valid_match_score CHECK (match_score >= 0 AND match_score <= 100)
);

-- Indexes for jobs
CREATE INDEX idx_jobs_active ON jobs(match_score DESC, scraped_at DESC) WHERE is_archived = false;
CREATE INDEX idx_jobs_tags ON jobs USING GIN(tags);

-- ==============================================================================
-- TABLE: applications
-- ==============================================================================

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES application_projects(id) ON DELETE CASCADE,

  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  resume_used TEXT,
  cover_letter_used TEXT,

  applied_at TIMESTAMPTZ,
  submission_method VARCHAR(50),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('draft', 'ready_to_apply', 'applied', 'no_response', 'interview', 'rejected', 'offer', 'accepted')),
  UNIQUE(job_id, project_id)
);

-- Indexes for applications
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_applied_at ON applications(applied_at DESC) WHERE applied_at IS NOT NULL;

-- ==============================================================================
-- TABLE: job_embeddings
-- ==============================================================================

CREATE TABLE job_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,

  embedding vector(1536) NOT NULL,
  model VARCHAR(100) DEFAULT 'text-embedding-3-small',
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(job_id)
);

-- HNSW index for fast semantic search
-- Parameters: m=16 (connections per layer), ef_construction=64 (build quality)
CREATE INDEX idx_job_embeddings_vector ON job_embeddings
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- ==============================================================================
-- MIGRATION COMPLETE
-- ==============================================================================
