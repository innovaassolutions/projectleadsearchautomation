-- Rollback Migration: 001 - Initial Database Schema
-- Created: 2025-10-23
-- Description: Drops all tables created by 001_initial_schema.sql

-- Drop tables in reverse order to respect foreign key dependencies

DROP TABLE IF EXISTS job_embeddings CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS application_projects CASCADE;
DROP TABLE IF EXISTS user_profile CASCADE;

-- Note: Extensions are NOT dropped as they may be used by other migrations
-- If you need to drop extensions, do it manually:
-- DROP EXTENSION IF EXISTS "vector";
-- DROP EXTENSION IF EXISTS "pgcrypto";
-- DROP EXTENSION IF EXISTS "pg_trgm";
-- DROP EXTENSION IF EXISTS "uuid-ossp";
