# PostgREST API Configuration

This directory contains configuration files for the PostgREST API server deployed on Railway.

## Overview

PostgREST automatically generates a RESTful API from our PostgreSQL database schema. It provides:
- Zero-boilerplate REST endpoints
- Automatic OpenAPI documentation
- Row Level Security (RLS) enforcement
- JWT-based authentication
- Direct SQL performance

## Railway Deployment

### Prerequisites

1. Railway account with PostgreSQL service already deployed (Story 1.2)
2. Railway CLI installed: `npm install -g @railway/cli`
3. Database roles created (web_anon, authenticated) - see Story 1.4 Task 2

### Deployment Steps

1. **Login to Railway:**
   ```bash
   railway login
   ```

2. **Link to Project:**
   ```bash
   railway link
   ```

3. **Create PostgREST Service:**
   - Go to Railway dashboard
   - Click "+ New Service"
   - Select "Docker Image"
   - Enter: `postgrest/postgrest:v12.0.2`
   - Name: "PostgREST API"

4. **Configure Environment Variables:**

   In Railway dashboard, add these variables to the PostgREST service:

   ```bash
   # Database Connection (use Railway internal network)
   PGRST_DB_URI=postgresql://postgres:[PASSWORD]@postgres.railway.internal:5432/railway

   # Schema Configuration
   PGRST_DB_SCHEMA=public
   PGRST_DB_ANON_ROLE=web_anon

   # JWT Secret (generate with: openssl rand -base64 32)
   PGRST_JWT_SECRET=[GENERATED_SECRET]

   # Server Configuration
   PGRST_SERVER_PORT=3000
   PGRST_DB_POOL=10
   PGRST_DB_POOL_TIMEOUT=10

   # CORS
   PGRST_SERVER_CORS_ALLOWED_ORIGINS=http://localhost:3001,https://your-production-domain.com

   # OpenAPI
   PGRST_OPENAPI_SERVER_PROXY_URI=https://[YOUR_POSTGREST_URL].railway.app
   ```

5. **Get PostgreSQL Password:**
   ```bash
   # From PostgreSQL service variables in Railway dashboard
   # Or from .env.local DATABASE_URL
   ```

6. **Deploy:**
   - Service deploys automatically after env vars are set
   - Check "Deployments" tab for status
   - Note the public URL (e.g., `postgrest-production.railway.app`)

## API Endpoints

Once deployed, PostgREST auto-generates endpoints for all database tables:

### Root Endpoint
```bash
GET /
# Returns OpenAPI schema
```

### Table Endpoints
```bash
# Jobs
GET /jobs                    # List all jobs
GET /jobs?id=eq.uuid         # Get specific job
POST /jobs                   # Create job (requires auth)
PATCH /jobs?id=eq.uuid       # Update job (requires auth)
DELETE /jobs?id=eq.uuid      # Delete job (requires auth)

# Application Projects
GET /application_projects    # List projects
POST /application_projects   # Create project (requires auth)

# Applications
GET /applications            # List applications
POST /applications           # Create application (requires auth)
```

### Query Parameters

**Filtering:**
```bash
GET /jobs?company=eq.Acme
GET /jobs?match_score=gte.80
GET /jobs?tags=cs.{typescript,react}
GET /jobs?is_archived=eq.false
```

**Ordering:**
```bash
GET /jobs?order=scraped_at.desc
GET /jobs?order=match_score.desc,title.asc
```

**Pagination:**
```bash
GET /jobs?limit=20&offset=0
GET /jobs?limit=20&offset=20
```

**Column Selection:**
```bash
GET /jobs?select=id,title,company
```

**Embedded Resources:**
```bash
GET /applications?select=*,job:jobs(title,company)
GET /applications?select=*,job:jobs(*)&job.match_score=gte.80
```

## Testing

### Test with cURL

```bash
# Get OpenAPI schema
curl https://your-postgrest-url.railway.app/

# List jobs (anonymous access)
curl https://your-postgrest-url.railway.app/jobs

# Filter jobs
curl "https://your-postgrest-url.railway.app/jobs?is_archived=eq.false&limit=10"

# Create job (requires authentication - will fail without JWT)
curl -X POST https://your-postgrest-url.railway.app/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Senior Developer",
    "company": "Acme Inc",
    "url": "https://example.com/job/1",
    "source": "remote_ok"
  }'
```

### Test with HTTPie

```bash
# Install: brew install httpie

http GET https://your-postgrest-url.railway.app/jobs
http GET https://your-postgrest-url.railway.app/jobs is_archived==false limit==10
```

## Authentication

PostgREST uses JWT tokens for authentication. The JWT must include:

```json
{
  "role": "authenticated",
  "user_id": "uuid-here",
  "email": "user@example.com",
  "exp": 1234567890
}
```

Include the token in requests:
```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Security

### Database Roles

- **web_anon**: Anonymous/unauthenticated access (read-only on jobs, job_embeddings)
- **authenticated**: Logged-in users (full CRUD with RLS policies)

### Row Level Security (RLS)

RLS policies enforce data isolation:
- Users can only access their own application_projects
- Users can only see their own applications
- Jobs are publicly readable (when not archived)
- User profiles are private

## Troubleshooting

### Connection Refused
- Check DATABASE_URL is correct
- Verify PostgreSQL service is running
- Check Railway internal network configuration

### 404 Not Found
- Table doesn't exist in database
- Schema name incorrect (should be 'public')
- Role doesn't have permissions on table

### 401 Unauthorized
- JWT secret mismatch
- JWT token expired
- Invalid token format

### Empty Response `[]`
- Normal if no data exists yet
- Check RLS policies if expecting data
- Verify role has SELECT permissions

### CORS Error
- Add origin to PGRST_SERVER_CORS_ALLOWED_ORIGINS
- Ensure protocol (http/https) matches
- Restart PostgREST service after env var changes

## Local Development

To connect to the Railway-hosted PostgREST from your Next.js app:

1. **Add to `.env.local`:**
   ```bash
   NEXT_PUBLIC_API_URL=https://your-postgrest-url.railway.app
   POSTGREST_JWT_SECRET=same-secret-as-railway
   ```

2. **Use in Next.js:**
   ```typescript
   const apiUrl = process.env.NEXT_PUBLIC_API_URL
   const response = await fetch(`${apiUrl}/jobs`)
   ```

## Resources

- [PostgREST Documentation](https://postgrest.org)
- [API Tutorial](https://postgrest.org/en/stable/tutorials/tut0.html)
- [API Reference](https://postgrest.org/en/stable/api.html)
- [Railway PostgreSQL Docs](https://docs.railway.app/databases/postgresql)
