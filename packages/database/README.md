# Database Package

This package manages database migrations and schema for the job application system.

## Overview

The database uses **PostgreSQL 15+** with several extensions:
- `uuid-ossp` - UUID generation
- `pg_trgm` - Text similarity search
- `vector` - pgvector for semantic search (embeddings)
- `pgcrypto` - Cryptographic functions

## Migration System

Migrations are raw SQL files stored in `migrations/` directory.

### Running Migrations

**Local Development:**
```bash
# Set DATABASE_URL in .env.local first
npm run migrate --workspace=packages/database
```

**Production (Railway):**
```bash
# Use Railway DATABASE_URL
DATABASE_URL=<railway-connection-string> npm run migrate --workspace=packages/database
```

### Migration File Naming

Format: `NNN_description.sql` (e.g., `001_initial_schema.sql`)

- Use sequential numbering (001, 002, 003, etc.)
- Use descriptive names
- Include corresponding `.down.sql` for rollbacks

### Rollback Migrations

```bash
# Rollback specific migration
npm run migrate:down --workspace=packages/database -- 001
```

## Database Schema

The schema includes 5 core tables:

1. **user_profile** - User accounts and preferences
2. **application_projects** - Job search project configurations
3. **jobs** - Scraped job postings
4. **job_embeddings** - Vector embeddings for semantic search
5. **applications** - Application tracking

See [Database Schema Documentation](/docs/architecture/database-schema.md) for complete schema details.

## Important Notes

- **Never modify applied migrations** - Create new migrations for changes
- **Always test locally first** - Test on local database before Railway
- **Backup before migrations** - Railway has automated backups, verify they're enabled
- **Check migration order** - Migrations run alphabetically by filename
- **pgvector dimension** - 1536 for OpenAI text-embedding-3-small model

## Connection Details

Database credentials are stored in `.env.local`:
```bash
DATABASE_URL=postgresql://user:password@host:port/database
```

## Testing

After running migrations, verify with psql:

```bash
# Connect to database
psql $DATABASE_URL

# List tables
\dt

# List indexes
\di

# List extensions
\dx

# Describe table structure
\d table_name
```

---
