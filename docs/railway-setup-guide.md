# Railway.app Setup Guide

> **Status**: Account already created and connected to GitHub ✅
> **Project**: Job Application System
> **Services**: 4 (PostgreSQL, PostgREST, n8n, Next.js)

---

## Architecture Overview

Your Railway.app project will have **4 services**:

```
┌─────────────────────────────────────────────────────────┐
│                    Railway.app Project                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐    ┌──────────────┐                  │
│  │  PostgreSQL  │◄───┤  PostgREST   │                  │
│  │  (pgvector)  │    │   (API)      │                  │
│  └──────┬───────┘    └──────────────┘                  │
│         │                                                │
│         │            ┌──────────────┐                  │
│         └────────────┤     n8n      │                  │
│                      │ (Workflows)   │                  │
│                      └──────────────┘                  │
│                                                          │
│                      ┌──────────────┐                  │
│                      │   Next.js    │                  │
│                      │   (Web UI)   │                  │
│                      └──────────────┘                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Service Setup Order

### 1. PostgreSQL Database (FIRST)
**Service Type**: Database → PostgreSQL
**Version**: 15 (with pgvector support)
**Memory**: 2GB recommended

**Setup Steps**:
1. In Railway dashboard, click **"New"** → **"Database"** → **"PostgreSQL"**
2. Version: Select **PostgreSQL 15**
3. Name it: `jobapp-db`
4. Railway will auto-generate:
   - `DATABASE_URL` (internal)
   - `DATABASE_PUBLIC_URL` (external)
5. Copy `DATABASE_URL` → You'll use this in other services

**Environment Variables** (Railway auto-creates these):
```bash
DATABASE_URL=postgresql://postgres:PASSWORD@postgres.railway.internal:5432/railway
POSTGRES_PASSWORD=auto-generated
POSTGRES_USER=postgres
POSTGRES_DB=railway
```

**Extensions to Install** (in Epic 1):
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

---

### 2. PostgREST API (SECOND)
**Service Type**: Empty Service → Docker Image
**Image**: `postgrest/postgrest:v12.0.0`
**Memory**: 512MB

**Setup Steps**:
1. Click **"New"** → **"Empty Service"**
2. Name it: `postgrest-api`
3. Go to **Settings** → **Deploy**
4. Source: **Docker Image**
5. Image: `postgrest/postgrest:v12.0.0`

**Environment Variables to Add**:
```bash
PGRST_DB_URI=${{Postgres.DATABASE_URL}}
PGRST_DB_SCHEMA=public
PGRST_DB_ANON_ROLE=web_anon
PGRST_JWT_SECRET=2M1177ol14lLIsk96Zlo0J6SDIwXqkBdoCZiVLAeiqI=
PGRST_SERVER_HOST=0.0.0.0
PGRST_SERVER_PORT=3000
```

**Note**: `${{Postgres.DATABASE_URL}}` is Railway syntax to reference the PostgreSQL service

**Public Domain**: Railway will generate a public URL like:
`https://postgrest-api-production-xxxx.up.railway.app`

---

### 3. n8n Workflow Engine (THIRD)
**Service Type**: Empty Service → Docker Image
**Image**: `n8nio/n8n:latest`
**Memory**: 1GB

**Setup Steps**:
1. Click **"New"** → **"Empty Service"**
2. Name it: `n8n-workflows`
3. Go to **Settings** → **Deploy**
4. Source: **Docker Image**
5. Image: `n8nio/n8n:latest`

**Environment Variables to Add**:
```bash
# Database connection (n8n stores workflows in PostgreSQL)
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=postgres.railway.internal
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=railway
DB_POSTGRESDB_USER=${{Postgres.POSTGRES_USER}}
DB_POSTGRESDB_PASSWORD=${{Postgres.POSTGRES_PASSWORD}}

# n8n configuration
N8N_HOST=${{RAILWAY_PUBLIC_DOMAIN}}
N8N_PROTOCOL=https
N8N_PORT=5678
WEBHOOK_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}

# Security
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=CHANGE_THIS_PASSWORD

# Timezone
GENERIC_TIMEZONE=America/Los_Angeles

# Execution mode
EXECUTIONS_MODE=regular
N8N_METRICS=true
```

**Public Domain**: Railway will generate:
`https://n8n-workflows-production-xxxx.up.railway.app`

**Access n8n UI**:
- URL: Your Railway public domain
- Login: admin / [your password]
- Build workflows visually here

---

### 4. Next.js Web Application (FOURTH)
**Service Type**: GitHub Repo
**Build**: Nixpacks (auto-detected)
**Memory**: 1GB

**Setup Steps**:
1. Click **"New"** → **GitHub Repo**
2. Select your repo: `toddabraham/linkedin` (or your fork)
3. Name it: `web-ui`
4. Railway will auto-detect Next.js and build

**Environment Variables to Add**:
```bash
# App
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}

# Database (from PostgreSQL service)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Auth secrets (use the ones from .env.local)
NEXTAUTH_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
NEXTAUTH_SECRET=qOAc2igG+2igag/PsXLMKzrKZ5C9X4WzeGXvPL5/N+w=
JWT_SECRET=2M1177ol14lLIsk96Zlo0J6SDIwXqkBdoCZiVLAeiqI=

# OpenAI API (from your .env.local)
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE

# Telegram (from your setup)
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN
TELEGRAM_USER_ID=YOUR_USER_ID

# Google Calendar (from your setup)
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET

# Email (from your setup)
EMAIL_ADDRESS=your.email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_PROVIDER=gmail
IMAP_HOST=imap.gmail.com
IMAP_PORT=993
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# PostgREST API (internal Railway URL)
NEXT_PUBLIC_API_URL=https://${{PostgREST.RAILWAY_PUBLIC_DOMAIN}}

# n8n Webhooks (internal Railway URL)
N8N_WEBHOOK_URL=https://${{N8N.RAILWAY_PUBLIC_DOMAIN}}/webhook
```

**Build Configuration** (Railway auto-detects):
- Build Command: `npm run build`
- Start Command: `npm start`
- Root Directory: `/`
- Node Version: 20.x

---

## Service Communication

Railway services can communicate via:

### Internal Network (Recommended)
```bash
# PostgreSQL internal address
postgres.railway.internal:5432

# Services reference each other
${{Postgres.DATABASE_URL}}
${{PostgREST.RAILWAY_PUBLIC_DOMAIN}}
```

### Public URLs (For external access)
```bash
# Each service gets a public URL
https://service-name-production-xxxx.up.railway.app
```

---

## Cost Estimate

Railway.app pricing (as of 2025):

**Hobby Plan** ($5/month credit):
- PostgreSQL: ~$5-10/month (2GB RAM)
- PostgREST: ~$2-5/month (512MB RAM)
- n8n: ~$5-10/month (1GB RAM)
- Next.js: ~$5-10/month (1GB RAM)

**Estimated Total**: $20-35/month

**Pro Plan** ($20/month + usage):
- Better for production
- More resources
- Better support

---

## Deployment Workflow

### Initial Setup (Epic 1)
1. Create all 4 services on Railway
2. Configure environment variables
3. Deploy PostgreSQL extensions
4. Test PostgREST API
5. Access n8n UI and create first workflow
6. Deploy Next.js app

### Ongoing Development
```bash
# Railway automatically deploys on git push to main
git add .
git commit -m "feat: add new feature"
git push origin main

# Railway triggers deployment
# Check deployment in Railway dashboard
```

### Manual Deployment (if needed)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Deploy specific service
railway up --service web-ui

# View logs
railway logs
```

---

## Environment Variable Updates

When you add API keys from Epic 0:

### Update `.env.local` (Local Development)
- Add all keys to your local file
- Test locally first

### Update Railway Environment Variables
1. Go to Railway dashboard
2. Select service (e.g., "web-ui")
3. Click **"Variables"** tab
4. Add/update variables
5. Service auto-redeploys

**Important**: Keep the same values in both places!

---

## Next Steps

After completing Epic 0 (acquiring all API keys):

1. **Update Railway environment variables** with:
   - OpenAI API key
   - Telegram bot token
   - Google Calendar credentials
   - Gmail app password

2. **Update `.env.local`** with n8n webhook URL:
   ```bash
   N8N_WEBHOOK_URL=https://[your-n8n-railway-url]/webhook
   ```

3. **Test all services** are running on Railway

4. **Begin Epic 1** - Database schema and migrations

---

## Troubleshooting

### Service Won't Start
- Check Railway logs: Click service → **"Deployments"** → View logs
- Verify environment variables are set correctly
- Check service dependencies (PostgreSQL must be running first)

### Can't Connect to Database
- Use **internal URL** (`postgres.railway.internal`) for service-to-service
- Use **public URL** for external connections (e.g., database GUI tools)

### n8n Workflows Not Triggering
- Verify n8n service is running
- Check webhook URL is accessible
- Review n8n execution logs in n8n UI

---

## Useful Railway Commands

```bash
# View service status
railway status

# View logs for a service
railway logs --service web-ui

# Open service in browser
railway open

# Shell into service (for debugging)
railway shell

# Run database migrations
railway run npm run db:migrate
```

---

**✅ Railway Account Setup Complete**

Your Railway account is connected to GitHub. You're ready to create services in Epic 1!
