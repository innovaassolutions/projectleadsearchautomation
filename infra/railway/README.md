# Railway PostgreSQL with pgvector

This directory contains configuration for deploying PostgreSQL with pgvector extension to Railway.

## Deployment Instructions

### Option 1: Deploy Custom Docker Image (Recommended)

1. **Delete the existing PostgreSQL service** in Railway dashboard
   - Go to your Railway project
   - Click on the PostgreSQL service
   - Go to Settings → Delete Service
   - Confirm deletion

2. **Create new PostgreSQL service from Docker**
   - Click "+ New" in Railway
   - Select "Empty Service"
   - Go to Settings
   - Under "Source", click "Deploy from GitHub repo"
   - Connect this repository
   - Set Root Directory: `infra/railway`
   - Set Dockerfile Path: `Dockerfile.postgres`

3. **Configure environment variables**
   - Go to Variables tab
   - Railway will auto-generate `POSTGRES_PASSWORD`
   - Add these variables:
     ```
     POSTGRES_DB=railway
     POSTGRES_USER=postgres
     PGDATA=/var/lib/postgresql/data/pgdata
     ```

4. **Add volume for data persistence**
   - Go to Settings → Volumes
   - Click "Add Volume"
   - Mount Path: `/var/lib/postgresql/data`

5. **Get new connection string**
   - After deployment completes
   - Go to Variables tab
   - Copy the new `DATABASE_URL`
   - Update local `.env.local` file

### Option 2: Use Railway's pgvector Template (Easier)

1. **Delete existing PostgreSQL service** (see Option 1, step 1)

2. **Deploy from Railway template**
   - In Railway dashboard, click "+ New"
   - Search for "pgvector" in templates
   - Deploy "PostgreSQL + pgvector" template
   - Railway will handle the setup automatically

3. **Get connection string**
   - Go to Variables tab
   - Copy `DATABASE_URL`
   - Update `.env.local`

## Verify Extensions

After deployment, connect and verify extensions:

```bash
psql $DATABASE_URL -c "\dx"
```

Should show:
- `uuid-ossp` - UUID generation
- `pg_trgm` - Full-text search
- `vector` - Semantic embeddings

## Connection Details

- **Public URL**: For external connections (local development)
- **Private URL**: For Railway service-to-service communication

Update both in `.env.local`:
- `DATABASE_URL` - for Next.js app
- `PGRST_DB_URI` - for PostgREST
