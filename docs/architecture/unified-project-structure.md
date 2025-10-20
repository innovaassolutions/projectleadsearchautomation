# Unified Project Structure

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
├── docs/
│   ├── prd.md
│   └── architecture.md
├── scripts/
│   ├── setup-database.sh
│   └── deploy-railway.sh
└── infra/
    ├── railway/
    ├── postgrest/
    └── docker/
```

## Root Package.json

```json
{
  "name": "job-application-system",
  "private": true,
  "workspaces": [
    "packages/*",
    "apps/*"
  ],
  "scripts": {
    "dev": "npm run dev --workspace=apps/web",
    "build": "npm run build --workspaces",
    "db:migrate": "cd packages/database && npm run migrate"
  }
}
```

---
