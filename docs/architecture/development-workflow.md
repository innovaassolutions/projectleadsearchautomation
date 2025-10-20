# Development Workflow

## Local Development Setup

**Prerequisites**:
- Node.js 20.x LTS
- PostgreSQL 15+
- Docker (optional)

**Initial Setup**:

```bash
# Clone repository
git clone https://github.com/yourusername/job-application-system.git
cd job-application-system

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start services (Docker)
docker-compose up -d

# Run migrations
npm run db:migrate

# Start dev server
npm run dev
```

## Development Services

| Service | Local URL | Purpose |
|---------|-----------|---------|
| Next.js | http://localhost:3001 | Frontend |
| PostgREST | http://localhost:3000 | API |
| PostgreSQL | localhost:5432 | Database |
| n8n | http://localhost:5678 | Workflows |

## Daily Development Workflow

```bash
# Start work
git pull origin main
npm install
docker-compose up -d
npm run dev

# Make changes
# Edit files...

# Type check
npm run typecheck

# Lint
npm run lint

# Test
npm run test
```

---
