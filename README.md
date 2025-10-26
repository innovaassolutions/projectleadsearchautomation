# Job Application System

An AI-powered job application management system that discovers, enriches, and automates job applications using semantic matching and intelligent workflows.

## Overview

This system helps job seekers by:
- Automatically discovering job postings from multiple platforms (Remote OK, We Work Remotely, Himalayas, YC Jobs, Wellfound)
- Enriching job data with AI-powered metadata extraction and semantic embeddings
- Matching jobs to user preferences using semantic similarity
- Automating application generation and submission
- Tracking application status and interview schedules

## Tech Stack

- **Frontend**: Next.js 14+ with TypeScript, Tailwind CSS, shadcn/ui
- **Backend API**: PostgREST (auto-generated REST API from PostgreSQL)
- **Database**: PostgreSQL 15+ with pgvector extension
- **Workflow Engine**: n8n for automation and orchestration
- **AI**: OpenAI GPT-4o and embeddings
- **Hosting**: Railway.app (PostgreSQL, PostgREST, n8n, Next.js)

## Monorepo Structure

```
job-application-system/
├── packages/
│   ├── types/                     # Shared TypeScript types
│   ├── database/                  # Migrations and schema
│   └── config/                    # Shared config
├── apps/
│   ├── web/                       # Next.js frontend
│   └── n8n-workflows/             # n8n workflow definitions
├── infra/
│   ├── railway/                   # Railway deployment configs
│   ├── postgrest/                 # PostgREST configuration
│   └── docker/                    # Docker configurations
├── scripts/                       # Utility scripts
├── docs/                          # Documentation
│   ├── architecture/
│   ├── stories/
│   └── prd.md
├── package.json                   # Root workspace config
└── README.md
```

## Prerequisites

- **Node.js**: 20.0.0 or higher
- **npm**: 10.0.0 or higher
- **Docker Desktop**: Required for local development environment
- **Railway Account**: For production deployment (optional)

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

This will install dependencies for all workspace packages.

### 2. Start Docker Infrastructure

The project uses Docker Compose to run PostgreSQL, PostgREST, and n8n locally:

```bash
# Start all infrastructure services in background
npm run dev:infra

# Wait ~30 seconds for services to initialize

# Verify all services are healthy
npm run health
```

**Services started:**
- **PostgreSQL** (port 5434) - Database with pgvector extension
- **PostgREST** (port 3001) - Auto-generated REST API
- **n8n** (port 5678) - Workflow automation platform

**Service URLs:**
- PostgreSQL: `postgresql://postgres:localdev123@localhost:5434/jobapp`
- PostgREST API: http://localhost:3001
- n8n Web Interface: http://localhost:5678 (admin / localdev123)

**Note:** PostgreSQL uses port 5434 (not 5432) to avoid conflicts with local PostgreSQL installations. PostgREST uses port 3001 (not 3000) to avoid conflicts with Next.js development server.

### 3. Environment Configuration

The `.env.local` file is already configured for local Docker development. If you need to modify it:

```bash
# View current configuration
cat .env.local

# Or copy from example
cp .env.example .env.local
```

**Key environment variables:**
- `DATABASE_URL` - PostgreSQL connection (already set for Docker)
- `NEXT_PUBLIC_API_URL` - PostgREST endpoint (already set for Docker)
- `OPENAI_API_KEY` - OpenAI API key (required - get from https://platform.openai.com)
- `N8N_URL` - n8n endpoint (already set for Docker)

### 4. Start Next.js Development Server

```bash
# In a new terminal window
npm run dev
```

The Next.js app will be available at: http://localhost:3002

### 5. Verify Everything Works

```bash
# Check Docker services health
npm run health

# Check database tables exist
docker-compose exec postgres psql -U postgres -d jobapp -c '\dt'

# Test PostgREST API
curl http://localhost:3000/jobs
```

### 6. System Health Dashboard

Once the development server is running, you can access the System Health Dashboard to monitor all services:

**URL:** http://localhost:3002/dashboard

The dashboard provides real-time monitoring of:
- **PostgreSQL Database**: Connection status, table counts, migration version
- **PostgREST API**: Online/offline status, response time
- **Environment**: Development/Production, Railway/Local deployment

**Features:**
- Auto-refresh every 10 seconds (can be paused)
- Manual refresh button
- Color-coded status indicators (green/yellow/red)
- Responsive design for mobile/tablet/desktop
- Dark mode support

**Status Indicators:**
- 🟢 **Healthy**: All services operational
- 🟡 **Degraded**: Some services down but system partially functional
- 🔴 **Down**: Critical services unavailable

**Troubleshooting with the Dashboard:**

If the dashboard shows a red or yellow status:

1. **Database Disconnected**: Check if PostgreSQL container is running
   ```bash
   docker ps | grep postgres
   docker-compose up -d postgres
   ```

2. **API Offline**: Check if PostgREST container is running
   ```bash
   docker ps | grep postgrest
   docker-compose up -d postgrest
   ```

3. **Degraded Status**: Some services may be starting up - wait 30 seconds and refresh

The dashboard automatically detects your environment (Railway vs Local) and updates in real-time, making it easy to verify your stack is healthy before starting development.

## Available Scripts

### Infrastructure Management

- `npm run dev:infra` - Start Docker services (PostgreSQL, PostgREST, n8n)
- `npm run dev:infra:down` - Stop Docker services (keeps data)
- `npm run dev:infra:logs` - View logs from all services
- `npm run dev:infra:restart` - Restart all services
- `npm run dev:infra:clean` - Stop services and remove all data volumes
- `npm run health` - Check health of all Docker services

### Development

- `npm run dev` - Start Next.js development server
- `npm run build` - Build all workspace packages
- `npm run db:migrate` - Run database migrations

## Docker Infrastructure Details

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Network                        │
│                    (app-network)                         │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ PostgreSQL   │  │  PostgREST   │  │     n8n      │  │
│  │   :5432      │◄─┤    :3000     │  │   :5678      │  │
│  │  pgvector    │  └──────────────┘  └──────────────┘  │
│  └──────────────┘          │                  │         │
│         │                  │                  │         │
└─────────┼──────────────────┼──────────────────┼─────────┘
          │                  │                  │
    localhost:5432     localhost:3000    localhost:5678
          │                  │                  │
          └──────────────────┴──────────────────┘
                          │
                    Next.js App
               (runs outside Docker)
```

### Data Persistence

Docker volumes persist data between container restarts:
- `postgres-data` - Database tables and indexes
- `n8n-data` - n8n workflows and execution history

To completely reset your local environment:

```bash
npm run dev:infra:clean  # Removes all data
npm run dev:infra        # Fresh start
```

### Switching Between Local and Railway

The `.env.local` file is configured for local development by default. To use Railway services instead:

1. Comment out local Docker URLs
2. Uncomment Railway production URLs
3. Restart Next.js dev server

```bash
# In .env.local:

# Local Docker (active)
DATABASE_URL=postgresql://postgres:localdev123@localhost:5432/jobapp
NEXT_PUBLIC_API_URL=http://localhost:3000

# Railway Production (commented out)
# DATABASE_URL=your_railway_postgres_url
# NEXT_PUBLIC_API_URL=https://your-postgrest.up.railway.app
```

## Troubleshooting

### Docker services won't start

```bash
# Check if ports are already in use
lsof -i :5432  # PostgreSQL
lsof -i :3000  # PostgREST
lsof -i :5678  # n8n

# If ports are occupied, either:
# 1. Stop the conflicting process
# 2. Change ports in docker-compose.yml
```

### Migrations didn't run

Migrations only run on first container startup. To force re-run:

```bash
npm run dev:infra:clean  # Remove volumes
npm run dev:infra        # Recreate with fresh database
```

### PostgreSQL connection refused

```bash
# Check if container is running
docker-compose ps

# View PostgreSQL logs
npm run dev:infra:logs postgres

# Verify healthcheck passed
docker-compose exec postgres pg_isready -U postgres
```

### PostgREST can't connect to PostgreSQL

```bash
# PostgREST waits for PostgreSQL healthcheck
# If it fails to start, restart it:
docker-compose restart postgrest

# View PostgREST logs
npm run dev:infra:logs postgrest
```

### pgvector extension not available

```bash
# Verify correct image is being used
docker-compose exec postgres psql -U postgres -d jobapp -c '\dx'

# Should show: pgvector | 0.8.1 or higher
# If not, ensure docker-compose.yml uses: pgvector/pgvector:pg17
```

### Can't access n8n web interface

```bash
# Check n8n is running
docker-compose ps n8n

# View n8n logs
npm run dev:infra:logs n8n

# Default credentials:
# Username: admin
# Password: localdev123
```

## Documentation

- [Product Requirements Document](docs/prd.md)
- [Architecture Documentation](docs/architecture.md)
- [Epic 1: Foundation & Core Infrastructure](docs/epic-1-foundation-infrastructure.md)
- [User Stories](docs/stories/)

## Development Workflow

This project follows an epic-based development workflow:

1. **Epic Planning** - Large features broken into epics
2. **Story Creation** - Epics divided into user stories
3. **Implementation** - Stories implemented with test-driven development
4. **QA** - Stories validated against acceptance criteria
5. **Deployment** - Features deployed to Railway

## License

Private project - All rights reserved

---

Built with ❤️ using AI-assisted development
