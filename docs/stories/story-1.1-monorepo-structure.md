# Story 1.1: Initialize Monorepo Structure

> **Epic**: Epic 1 - Foundation & Core Infrastructure
> **Story ID**: 1.1
> **Estimated Time**: 2-4 hours

---

## Status

Draft

---

## Story

**As a** developer
**I want** a properly structured monorepo with workspaces
**So that** frontend, workflows, and shared code are organized and maintainable

---

## Acceptance Criteria

1. Repository initialized with Git
2. Monorepo structure created with workspaces:
   - `/apps/web` - NextJS application
   - `/apps/n8n-workflows` - n8n workflow exports
   - `/packages/types` - Shared TypeScript types
   - `/packages/database` - Schema and migrations
   - `/packages/config` - Shared configuration
   - `/infra/docker` - Docker configurations
   - `/infra/railway` - Railway deployment configs
   - `/infra/postgrest` - PostgREST configurations
3. Root `package.json` configured with npm workspaces
4. `.gitignore` includes node_modules, .env*, .next, build artifacts
5. `README.md` created with project overview and setup instructions
6. Package manager lock file committed (package-lock.json)
7. Initial git commit made with message: "feat: initialize monorepo structure"

---

## Tasks / Subtasks

- [x] **Task 1: Initialize Git repository and create base directory structure** (AC: 1, 2)
  - [x] 1.1 Run `git init` if not already initialized
  - [x] 1.2 Create `/apps/web` directory
  - [x] 1.3 Create `/apps/n8n-workflows` directory
  - [x] 1.4 Create `/packages/types` directory
  - [x] 1.5 Create `/packages/database` directory
  - [x] 1.6 Create `/packages/config` directory
  - [x] 1.7 Create `/infra/docker` directory
  - [x] 1.8 Create `/infra/railway` directory
  - [x] 1.9 Create `/infra/postgrest` directory
  - [x] 1.10 Create `/scripts` directory
  - [x] 1.11 Create `/docs` directory (if not exists)

- [x] **Task 2: Configure root package.json with npm workspaces** (AC: 3)
  - [x] 2.1 Create root `package.json` with workspaces configuration
  - [x] 2.2 Add workspace paths: `"packages/*"`, `"apps/*"`
  - [x] 2.3 Configure npm scripts: `dev`, `build`, `db:migrate`
  - [x] 2.4 Set `"private": true` to prevent accidental publishing
  - [x] 2.5 Add project name: `"job-application-system"`

- [x] **Task 3: Create .gitignore file** (AC: 4)
  - [x] 3.1 Create `.gitignore` in root
  - [x] 3.2 Add `node_modules/` to ignore
  - [x] 3.3 Add `.env*` patterns to ignore (except `.env.example`)
  - [x] 3.4 Add `.next/` to ignore
  - [x] 3.5 Add `dist/`, `build/`, `out/` to ignore
  - [x] 3.6 Add `.DS_Store` and OS-specific files
  - [x] 3.7 Add IDE files (`.vscode/`, `.idea/`)
  - [x] 3.8 Add `*.log` files

- [x] **Task 4: Create README.md with project documentation** (AC: 5)
  - [x] 4.1 Create root `README.md`
  - [x] 4.2 Add project title and description
  - [x] 4.3 Document monorepo structure
  - [x] 4.4 Add prerequisites section (Node.js 20+, npm)
  - [x] 4.5 Add local setup instructions
  - [x] 4.6 Document available npm scripts
  - [x] 4.7 Add links to architecture and PRD docs

- [x] **Task 5: Create placeholder package.json files in workspaces** (AC: 2)
  - [x] 5.1 Create `apps/web/package.json` placeholder
  - [x] 5.2 Create `apps/n8n-workflows/package.json` placeholder
  - [x] 5.3 Create `packages/types/package.json` placeholder
  - [x] 5.4 Create `packages/database/package.json` placeholder
  - [x] 5.5 Create `packages/config/package.json` placeholder

- [ ] **Task 6: Install dependencies and commit initial structure** (AC: 6, 7)
  - [ ] 6.1 Run `npm install` to generate package-lock.json
  - [ ] 6.2 Verify all workspace packages are recognized
  - [ ] 6.3 Stage all files: `git add .`
  - [ ] 6.4 Create initial commit: `git commit -m "feat: initialize monorepo structure"`
  - [ ] 6.5 Verify git log shows the commit

---

## Dev Notes

### Monorepo Structure Overview

This story implements the monorepo structure defined in `/docs/architecture/unified-project-structure.md`. The structure follows npm workspaces pattern for managing multiple packages within a single repository.

**Source Tree (Target State After This Story):**

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
├── .gitignore
├── package.json                   # Root workspace config
├── package-lock.json
└── README.md
```

### Package Manager Decision

**Using npm workspaces** (not pnpm or Yarn) per tech stack specification. npm workspaces provide:
- Native Node.js support (no additional tool installation)
- Symlinked local dependencies
- Shared `node_modules` hoisting
- Simple `npm install` for entire monorepo

### Workspace Configuration

The root `package.json` should include:

```json
{
  "name": "job-application-system",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "packages/*",
    "apps/*"
  ],
  "scripts": {
    "dev": "npm run dev --workspace=apps/web",
    "build": "npm run build --workspaces",
    "db:migrate": "npm run migrate --workspace=packages/database"
  },
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  }
}
```

### Placeholder Package.json Files

Each workspace needs a minimal `package.json` for npm to recognize it. Example for `/packages/types/package.json`:

```json
{
  "name": "@job-app/types",
  "version": "1.0.0",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc"
  }
}
```

### .gitignore Requirements

Must include:
- `node_modules/` - All package dependencies
- `.env*` - Environment variables (except `.env.example`)
- `.next/` - Next.js build output
- `dist/`, `build/`, `out/` - Build artifacts
- `*.log` - Log files
- `.DS_Store` - macOS system files
- IDE folders (`.vscode/`, `.idea/`)

### README.md Contents

The README should include:
1. Project title: "Job Application System"
2. Brief description from PRD
3. Monorepo structure diagram
4. Prerequisites: Node.js 20+, npm 10+
5. Setup instructions: `npm install`
6. Development commands: `npm run dev`
7. Links to documentation in `/docs/`

### Important Notes

- **Do NOT install any packages yet** - This story only sets up structure
- **Do NOT initialize Next.js yet** - That's Story 1.5
- **Do NOT create database migrations yet** - That's Story 1.3
- Keep package.json files minimal (placeholder only)
- Verify workspaces with: `npm ls --workspaces`

### Testing

#### Manual Verification Steps:
1. Verify directory structure matches source tree diagram
2. Run `npm install` successfully
3. Run `npm ls --workspaces` shows all 5 workspaces
4. Verify `.gitignore` excludes `node_modules/` and `.env*`
5. Verify `git log` shows initial commit
6. Verify `package-lock.json` exists and is committed

#### Expected Workspace Output:
```bash
$ npm ls --workspaces
job-application-system@1.0.0
├── apps/web@1.0.0 -> ./apps/web
├── apps/n8n-workflows@1.0.0 -> ./apps/n8n-workflows
├── @job-app/types@1.0.0 -> ./packages/types
├── @job-app/database@1.0.0 -> ./packages/database
└── @job-app/config@1.0.0 -> ./packages/config
```

#### Test Standards:
- No automated tests required for this story (infrastructure setup)
- Validation is manual verification of file structure
- Future stories will add Jest/Vitest for automated testing

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-20 | 1.0 | Initial story creation | James (Dev Agent) |

---

## Dev Agent Record

### Agent Model Used

_To be populated during implementation_

### Debug Log References

_To be populated during implementation_

### Completion Notes List

_To be populated during implementation_

### File List

_To be populated during implementation_

---

## QA Results

_To be populated by QA Agent after implementation_

---
