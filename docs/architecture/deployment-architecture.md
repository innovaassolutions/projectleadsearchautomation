# Deployment Architecture

## Production Infrastructure (Railway.app)

**Services**:
1. PostgreSQL (pgvector/pgvector:pg15)
2. PostgREST (postgrest/postgrest:v12.0.0)
3. n8n (n8nio/n8n:latest)
4. Next.js Web (Nixpacks build)

## Service Configuration

**PostgreSQL**:
```yaml
Image: pgvector/pgvector:pg15
Resources:
  Memory: 2GB
  Storage: 10GB
Backup: Daily at 2:00 AM UTC
```

**PostgREST**:
```yaml
Image: postgrest/postgrest:v12.0.0
Environment:
  PGRST_DB_URI: postgres://...@postgres.railway.internal:5432/jobapp
  PGRST_JWT_SECRET: ${JWT_SECRET}
Resources:
  Memory: 512MB
```

**n8n**:
```yaml
Image: n8nio/n8n:latest
Environment:
  N8N_HOST: ${RAILWAY_PUBLIC_DOMAIN}
  DB_TYPE: postgresdb
Resources:
  Memory: 1GB
```

**Next.js**:
```yaml
Build: Nixpacks
Environment:
  DATABASE_URL: postgres://...
  NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
  OPENAI_API_KEY: ${OPENAI_API_KEY}
Resources:
  Memory: 1GB
```

## CI/CD Pipeline

**GitHub Actions** (`.github/workflows/deploy.yml`):

```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install -g @railway/cli
      - run: railway up --service web
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

## Deployment Process

```bash
# Manual deployment
railway login
railway link
railway up --service web
railway run npm run db:migrate
```

## Environment Variables (Production)

```bash
# Database
POSTGRES_USER=jobapp_prod_user
POSTGRES_PASSWORD=<secure-random>

# Auth
JWT_SECRET=<min-32-char-random>
NEXTAUTH_SECRET=<min-32-char-random>

# OpenAI
OPENAI_API_KEY=sk-proj-...

# Telegram
TELEGRAM_BOT_TOKEN=123456:ABC...
```

---
