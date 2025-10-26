-- Rollback Migration: 002 - PostgREST Database Roles
-- Created: 2025-10-24
-- Description: Removes PostgREST roles and RLS policies

-- =============================================================================
-- DROP RLS POLICIES
-- =============================================================================

-- Drop applications policies
DROP POLICY IF EXISTS applications_isolation ON applications;

-- Drop application_projects policies
DROP POLICY IF EXISTS application_projects_isolation ON application_projects;

-- Drop user_profile policies
DROP POLICY IF EXISTS user_profile_isolation ON user_profile;

-- Drop job_embeddings policies
DROP POLICY IF EXISTS job_embeddings_authenticated_all ON job_embeddings;
DROP POLICY IF EXISTS job_embeddings_public_read ON job_embeddings;

-- Drop jobs policies
DROP POLICY IF EXISTS jobs_authenticated_write ON jobs;
DROP POLICY IF EXISTS jobs_authenticated_read ON jobs;
DROP POLICY IF EXISTS jobs_public_read ON jobs;

-- =============================================================================
-- DISABLE RLS
-- =============================================================================

ALTER TABLE applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE application_projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profile DISABLE ROW LEVEL SECURITY;

-- =============================================================================
-- REVOKE PERMISSIONS
-- =============================================================================

-- Revoke from authenticated role
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM authenticated;
REVOKE USAGE ON SCHEMA public FROM authenticated;

-- Revoke from web_anon role
REVOKE SELECT ON job_embeddings FROM web_anon;
REVOKE SELECT ON jobs FROM web_anon;
REVOKE USAGE ON SCHEMA public FROM web_anon;

-- =============================================================================
-- DROP ROLES
-- =============================================================================

DROP ROLE IF EXISTS authenticated;
DROP ROLE IF EXISTS web_anon;
