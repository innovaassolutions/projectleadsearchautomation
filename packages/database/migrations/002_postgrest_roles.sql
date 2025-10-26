-- Migration: 002 - PostgREST Database Roles
-- Created: 2025-10-24
-- Description: Creates database roles for PostgREST API access control
-- Roles: web_anon (anonymous), authenticated (logged-in users)

-- =============================================================================
-- ANONYMOUS ROLE (Public Access)
-- =============================================================================

-- Create anonymous role for public access (no login capability)
CREATE ROLE web_anon NOLOGIN;

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO web_anon;

-- Grant read-only access to public tables
GRANT SELECT ON jobs TO web_anon;
GRANT SELECT ON job_embeddings TO web_anon;

-- =============================================================================
-- AUTHENTICATED ROLE (Logged-in Users)
-- =============================================================================

-- Create authenticated role for logged-in users (no login capability)
CREATE ROLE authenticated NOLOGIN;

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant full CRUD access to all tables
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Ensure future tables inherit permissions automatically
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON SEQUENCES TO authenticated;

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on user-specific tables
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Jobs: Public read access for non-archived jobs
CREATE POLICY jobs_public_read ON jobs
  FOR SELECT
  TO web_anon
  USING (is_archived = false);

-- Jobs: Authenticated users can read all jobs
CREATE POLICY jobs_authenticated_read ON jobs
  FOR SELECT
  TO authenticated
  USING (true);

-- Jobs: Authenticated users can insert/update/delete
CREATE POLICY jobs_authenticated_write ON jobs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Job Embeddings: Public read access
CREATE POLICY job_embeddings_public_read ON job_embeddings
  FOR SELECT
  TO web_anon
  USING (true);

-- Job Embeddings: Authenticated full access
CREATE POLICY job_embeddings_authenticated_all ON job_embeddings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- User Profile: Users can only access their own profile
CREATE POLICY user_profile_isolation ON user_profile
  FOR ALL
  TO authenticated
  USING (id = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid)
  WITH CHECK (id = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid);

-- Application Projects: Users can only access their own projects
CREATE POLICY application_projects_isolation ON application_projects
  FOR ALL
  TO authenticated
  USING (user_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid)
  WITH CHECK (user_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid);

-- Applications: Users can only access applications from their projects
CREATE POLICY applications_isolation ON applications
  FOR ALL
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM application_projects
      WHERE user_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid
    )
  )
  WITH CHECK (
    project_id IN (
      SELECT id FROM application_projects
      WHERE user_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid
    )
  );

-- =============================================================================
-- VERIFICATION
-- =============================================================================

-- Display created roles
SELECT rolname, rolcanlogin FROM pg_roles WHERE rolname IN ('web_anon', 'authenticated');

-- Display RLS status on tables
SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
