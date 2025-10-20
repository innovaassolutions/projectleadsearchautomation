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
- **Docker**: For local development environment
- **Railway Account**: For production deployment

## Local Setup

### 1. Install Dependencies

```bash
npm install
```

This will install dependencies for all workspace packages.

### 2. Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env.local
```

Configure the following environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `POSTGREST_URL` - PostgREST API endpoint
- `OPENAI_API_KEY` - OpenAI API key
- `N8N_WEBHOOK_URL` - n8n webhook endpoint

### 3. Start Local Development

```bash
# Start the Next.js development server
npm run dev

# Build all workspaces
npm run build

# Run database migrations
npm run db:migrate
```

## Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run build` - Build all workspace packages
- `npm run db:migrate` - Run database migrations

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
