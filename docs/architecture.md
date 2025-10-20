# Full-Stack Architecture Document

> **Project**: Automated Job Application System
> **Version**: 1.0.0
> **Last Updated**: 2025-10-18
> **Status**: Complete

---

## Table of Contents

1. [Introduction](#introduction)
2. [High Level Architecture](#high-level-architecture)
3. [Tech Stack](#tech-stack)
4. [Data Models](#data-models)
5. [API Specification](#api-specification)
6. [Components](#components)
7. [External APIs](#external-apis)
8. [Core Workflows](#core-workflows)
9. [Database Schema](#database-schema)
10. [Frontend Architecture](#frontend-architecture)
11. [Backend Architecture](#backend-architecture)
12. [Unified Project Structure](#unified-project-structure)
13. [Development Workflow](#development-workflow)
14. [Deployment Architecture](#deployment-architecture)
15. [Security and Performance](#security-and-performance)
16. [Testing Strategy](#testing-strategy)
17. [Error Handling Strategy](#error-handling-strategy)
18. [Monitoring and Observability](#monitoring-and-observability)
19. [Coding Standards](#coding-standards)

---

## Introduction

This document outlines the complete fullstack architecture for the Automated Job Application System, a personal productivity tool designed to streamline the job search and application process through AI-powered automation.

### Project Overview

**Purpose**: Automate job discovery, application customization, and interview management to increase application volume (20-50 applications/week) while maintaining quality and personalization.

**Key Features**:
- Automated job scraping from multiple sources
- AI-powered resume and cover letter customization
- Email monitoring and interview extraction
- Telegram notifications for mobile-first workflow
- Semantic job search with vector embeddings
- Application tracking and analytics

**Target Users**: Individual job seekers (personal use, single-user system)

**Starter Template**: N/A - Greenfield Project

### Architecture Philosophy

**Schema-Driven Development**: The PostgreSQL database schema serves as the single source of truth. PostgREST auto-generates REST APIs directly from the schema, eliminating the need for hand-written API endpoints.

**Workflow Orchestration**: Complex business logic and integrations are managed through n8n visual workflows, keeping the application layer thin and focused on UI/UX.

**AI-First**: OpenAI GPT-4o powers content customization, making each application feel personal despite high volume.

**Mobile-First**: Telegram bot integration enables rapid review and action from anywhere.

---

## High Level Architecture

### System Overview

```mermaid
graph TB
    User[User/Job Seeker]

    subgraph "Client Layer"
        NextJS[Next.js Web App<br/>React + TypeScript]
        Telegram[Telegram Mobile App]
    end

    subgraph "API Layer"
        PostgREST[PostgREST<br/>Auto-generated REST API]
        NextAPI[Next.js API Routes<br/>Custom Business Logic]
    end

    subgraph "Orchestration Layer"
        n8n[n8n Workflow Engine<br/>Automation & Integrations]
    end

    subgraph "Data Layer"
        PostgreSQL[(PostgreSQL 15<br/>with pgvector)]
    end

    subgraph "External Services"
        OpenAI[OpenAI API<br/>GPT-4o]
        JobBoards[Job Boards<br/>Remote OK, WWR, etc.]
        Email[Email IMAP/SMTP]
        GCal[Google Calendar]
        TelegramAPI[Telegram Bot API]
    end

    User -->|HTTPS| NextJS
    User -->|Messages| Telegram

    NextJS -->|REST| PostgREST
    NextJS -->|Custom Logic| NextAPI
    Telegram -->|Webhooks| n8n

    PostgREST -->|SQL| PostgreSQL
    NextAPI -->|SQL via PostgREST| PostgREST
    n8n -->|REST API| PostgREST

    n8n -->|Scraping| JobBoards
    n8n -->|AI Calls| OpenAI
    n8n -->|IMAP/SMTP| Email
    n8n -->|Events| GCal
    n8n -->|Notifications| TelegramAPI
```

### Architecture Patterns

**Pattern 1: Schema-Driven API**
- PostgreSQL schema defines data structure
- PostgREST reflects schema as REST endpoints
- Zero API code to maintain
- Row Level Security (RLS) for authorization

**Pattern 2: Workflow-Based Automation**
- n8n handles scheduled tasks (scraping, monitoring)
- Visual workflow editor for rapid iteration
- Error handling and retry logic built-in
- Webhook triggers for event-driven processing

**Pattern 3: Microservices on Railway**
- Each service (PostgreSQL, PostgREST, n8n, Next.js) runs independently
- Internal private network for service communication
- Auto-scaling and health monitoring
- Single platform deployment

**Pattern 4: AI-Powered Content Generation**
- OpenAI API for customization and parsing
- Vector embeddings (pgvector) for semantic search
- Caching to minimize API costs
- Fallback to templates when API unavailable

---

## Tech Stack

### Technology Decisions

| Category | Technology | Version | Rationale |
|----------|------------|---------|-----------|
| **Frontend Framework** | Next.js | 14.x | React framework with App Router, SSR/SSG, excellent DX |
| **Language** | TypeScript | 5.3+ | Type safety, better tooling, reduces runtime errors |
| **Backend Framework** | PostgREST | 12.x | Auto-generated REST API from PostgreSQL schema |
| **Workflow Engine** | n8n | Latest | Visual workflow automation, 300+ integrations |
| **Database** | PostgreSQL | 15+ | Robust, ACID-compliant, excellent extension ecosystem |
| **Vector Database** | pgvector | Latest | PostgreSQL extension for semantic search |
| **State Management** | Zustand | 4.x | Lightweight, simple API, no boilerplate |
| **Data Fetching** | TanStack Query | 5.x | Server state management, caching, optimistic updates |
| **UI Framework** | Tailwind CSS | 3.x | Utility-first, rapid development, small bundle |
| **UI Components** | shadcn/ui | Latest | Accessible components built on Radix UI |
| **Forms** | React Hook Form | 7.x | Performant, minimal re-renders |
| **Validation** | Zod | 3.x | TypeScript-first schema validation |
| **AI Service** | OpenAI | Latest | GPT-4o for customization, embeddings for search |
| **Notifications** | Telegram Bot API | Latest | Mobile-first, real-time, rich interactions |
| **Email** | IMAP/SMTP | - | Universal email protocol support |
| **Calendar** | Google Calendar API | v3 | Ubiquitous calendar platform |
| **Hosting** | Railway.app | - | Simplified deployment, PostgreSQL + services |

### Alternative Approaches Considered

**Frontend**:
- ❌ **Create React App**: Deprecated, limited features vs Next.js
- ❌ **Remix**: Less mature ecosystem than Next.js
- ✅ **Next.js**: Best-in-class React framework, great Railway integration

**Backend API**:
- ❌ **Express + Custom API**: High maintenance, more code to write
- ❌ **GraphQL (Hasura/Postgraphile)**: Overkill for single-user app
- ✅ **PostgREST**: Zero-maintenance, schema-driven, perfect fit

**Database**:
- ❌ **MySQL**: Weaker JSON/array support vs PostgreSQL
- ❌ **MongoDB**: No ACID guarantees, less suitable for relational data
- ✅ **PostgreSQL**: Best-in-class relational DB, pgvector for embeddings

**Workflow Automation**:
- ❌ **Zapier**: Expensive for high volume, limited customization
- ❌ **Custom Cron Jobs**: More code to maintain
- ✅ **n8n**: Self-hosted, visual editor, extensive integrations

**Hosting**:
- ❌ **AWS**: Complex setup, over-engineered for single user
- ❌ **Vercel + Supabase**: Split across platforms, higher cost
- ✅ **Railway.app**: Single platform, simple deployment, great DX

---

## Data Models

### Core Entities

All TypeScript interfaces are defined in `packages/types/src/` and shared across the monorepo.

#### Job

```typescript
interface Job {
  id: string;
  title: string;
  company: string;
  url: string;                        // Unique constraint for deduplication
  description: string | null;
  tags: string[];
  seniority: 'junior' | 'mid' | 'senior' | 'lead' | 'executive' | null;
  source: 'remote_ok' | 'we_work_remotely' | 'himalayas' | 'yc_jobs' | 'wellfound';
  match_score: number | null;         // 0-100 calculated score
  scraped_at: string;                 // ISO 8601 timestamp
  is_archived: boolean;
  archived_at: string | null;
}
```

#### Application

```typescript
interface Application {
  id: string;
  job_id: string;
  project_id: string;
  status: 'draft' | 'ready_to_apply' | 'applied' | 'no_response' | 'interview' | 'rejected' | 'offer' | 'accepted';
  resume_used: string | null;         // Snapshot of resume at time of application
  cover_letter_used: string | null;   // Snapshot of cover letter
  applied_at: string | null;
  submission_method: string | null;   // 'email', 'web_form', 'manual'
  created_at: string;
  updated_at: string;
}
```

#### ApplicationProject

```typescript
interface ApplicationProject {
  id: string;
  user_id: string;
  name: string;                       // e.g., "Full-Stack Engineer Applications"
  description: string | null;
  target_roles: string[];
  target_companies: string[];
  created_at: string;
  updated_at: string;
}
```

#### Interview

```typescript
interface Interview {
  id: string;
  application_id: string;
  scheduled_at: string;               // ISO 8601 timestamp
  duration_minutes: number;
  location: string | null;            // "Zoom: https://...", "Office: 123 Main St"
  round: string | null;               // "Phone Screen", "Technical Round 1", etc.
  interviewer_name: string | null;
  interviewer_email: string | null;
  prep_notes: string | null;          // AI-generated prep guide
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  feedback: string | null;            // User's post-interview notes
  outcome: 'passed' | 'failed' | 'pending' | null;
  calendar_event_id: string | null;   // Google Calendar event ID
  created_at: string;
  updated_at: string;
}
```

#### ResumeTemplate

```typescript
interface ResumeTemplate {
  id: string;
  project_id: string;
  name: string;
  content: string;                    // Markdown or plain text
  is_default: boolean;
  created_at: string;
  updated_at: string;
}
```

#### CoverLetterTemplate

```typescript
interface CoverLetterTemplate {
  id: string;
  project_id: string;
  name: string;
  content: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}
```

#### JobEmbedding

```typescript
interface JobEmbedding {
  id: string;
  job_id: string;
  embedding: number[];                // 1536-dimensional vector (OpenAI text-embedding-3-small)
  model: string;                      // 'text-embedding-3-small'
  created_at: string;
}
```

#### EmailResponse

```typescript
interface EmailResponse {
  id: string;
  application_id: string | null;     // Nullable for orphaned emails
  sender_email: string;
  subject: string | null;
  email_body: string;
  received_at: string;
  parsed_data: Record<string, unknown> | null;  // AI-extracted structured data
  confidence_score: number | null;    // 0.0-1.0
  response_type: 'interview_invite' | 'rejection' | 'acknowledgment' | 'other' | null;
  created_at: string;
}
```

#### ResumeVariant

```typescript
interface ResumeVariant {
  id: string;
  application_id: string;
  content: string;
  version: number;
  generated_by: string | null;       // 'gpt-4o', 'gpt-4o-mini', 'manual'
  generation_prompt: string | null;
  created_at: string;
}
```

#### JobProjectMatch

```typescript
interface JobProjectMatch {
  id: string;
  job_id: string;
  project_id: string;
  match_score: number;                // 0-100
  match_reasons: Record<string, unknown> | null;  // {"tags": [...], "seniority": "match"}
  user_rating: number | null;         // 1-5 stars for feedback
  is_dismissed: boolean;
  created_at: string;
}
```

#### UserProfile

```typescript
interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  target_roles: string[];
  must_have_tags: string[];
  nice_to_have_tags: string[];
  preferred_seniority: ('junior' | 'mid' | 'senior' | 'lead' | 'executive')[];
  min_match_score: number;            // Default: 70
  telegram_id: string | null;
  google_refresh_token: string | null;  // Encrypted
  email_password: string | null;      // Encrypted (IMAP/SMTP app password)
  email_provider: string;             // 'gmail', 'outlook', 'custom'
  imap_host: string | null;
  smtp_host: string | null;
  default_project_id: string | null;
  created_at: string;
  updated_at: string;
}
```

### Entity Relationships

```mermaid
erDiagram
    USER_PROFILE ||--o{ APPLICATION_PROJECTS : "has many"
    APPLICATION_PROJECTS ||--o{ RESUME_TEMPLATES : "has many"
    APPLICATION_PROJECTS ||--o{ COVER_LETTER_TEMPLATES : "has many"
    APPLICATION_PROJECTS ||--o{ APPLICATIONS : "has many"
    JOBS ||--o{ APPLICATIONS : "has many"
    JOBS ||--o| JOB_EMBEDDINGS : "has one"
    JOBS ||--o{ JOB_PROJECT_MATCHES : "has many"
    APPLICATION_PROJECTS ||--o{ JOB_PROJECT_MATCHES : "has many"
    APPLICATIONS ||--o{ RESUME_VARIANTS : "has many"
    APPLICATIONS ||--o{ INTERVIEWS : "has many"
    APPLICATIONS ||--o{ EMAIL_RESPONSES : "has many"
```

---

## API Specification

### PostgREST REST API

PostgREST auto-generates REST endpoints from the PostgreSQL schema. All endpoints follow a consistent pattern.

**Base URL**: `http://postgrest.railway.internal:3000` (internal) or `https://api.example.com` (public via proxy)

### Common Patterns

#### List Resources

```http
GET /jobs?is_archived=eq.false&order=scraped_at.desc&limit=20
```

**Query Parameters**:
- `select`: Specify columns (`select=id,title,company`)
- `order`: Sort order (`order=created_at.desc`)
- `limit`: Limit results (`limit=20`)
- `offset`: Pagination (`offset=20`)
- Filters: `column=operator.value` (e.g., `match_score=gte.80`)

**Operators**:
- `eq`: Equals
- `neq`: Not equals
- `gt`: Greater than
- `gte`: Greater than or equal
- `lt`: Less than
- `lte`: Less than or equal
- `like`: Pattern match
- `ilike`: Case-insensitive pattern match
- `in`: In list (`tags=in.(typescript,react)`)
- `overlaps`: Array overlap (`tags=overlaps.{typescript,react}`)

#### Get Single Resource

```http
GET /jobs?id=eq.abc-123
```

Returns array with single item or empty array if not found.

#### Embedded Resources

```http
GET /applications?select=*,job:jobs(*),project:application_projects(*)
```

Returns applications with embedded job and project data.

#### Create Resource

```http
POST /applications
Content-Type: application/json
Authorization: Bearer <JWT>

{
  "job_id": "abc-123",
  "project_id": "proj-456",
  "status": "draft"
}
```

#### Update Resource

```http
PATCH /applications?id=eq.app-789
Content-Type: application/json
Authorization: Bearer <JWT>

{
  "status": "applied",
  "applied_at": "2025-10-18T14:30:00Z"
}
```

#### Delete Resource

```http
DELETE /applications?id=eq.app-789
Authorization: Bearer <JWT>
```

#### Call PostgreSQL Function

```http
POST /rpc/semantic_search
Content-Type: application/json
Authorization: Bearer <JWT>

{
  "query_embedding": [0.123, 0.456, ...],
  "similarity_threshold": 0.7,
  "max_results": 20
}
```

### Key Endpoints

#### Jobs

```http
# List jobs with filtering
GET /jobs?is_archived=eq.false&match_score=gte.80&tags=overlaps.{typescript,react}

# Get single job
GET /jobs?id=eq.abc-123

# Archive job
PATCH /jobs?id=eq.abc-123
{"is_archived": true, "archived_at": "2025-10-18T12:00:00Z"}

# Semantic search (via function)
POST /rpc/semantic_search
{"query_embedding": [...], "similarity_threshold": 0.7}
```

#### Applications

```http
# List applications with embedded job data
GET /applications?select=*,job:jobs(*)&order=updated_at.desc

# Create application
POST /applications
{"job_id": "abc-123", "project_id": "proj-456", "status": "draft"}

# Update application status
PATCH /applications?id=eq.app-789
{"status": "applied", "applied_at": "2025-10-18T14:30:00Z"}
```

#### Interviews

```http
# List upcoming interviews
GET /interviews?status=eq.scheduled&scheduled_at=gte.2025-10-18T00:00:00Z&order=scheduled_at.asc

# Create interview
POST /interviews
{
  "application_id": "app-789",
  "scheduled_at": "2025-10-20T14:00:00Z",
  "location": "Zoom: https://zoom.us/j/123456",
  "round": "Technical Round 1"
}

# Update interview outcome
PATCH /interviews?id=eq.int-123
{"status": "completed", "outcome": "passed", "feedback": "Went well..."}
```

### Authentication

**JWT Token Structure**:

```json
{
  "role": "authenticated",
  "user_id": "user-uuid",
  "email": "user@example.com",
  "exp": 1729267200
}
```

**Usage**:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

JWT tokens are generated by NextAuth.js and validated by PostgREST.

---

## Components

### System Components

The system consists of 9 major components:

```mermaid
graph TB
    NextJS[Next.js Web Application]
    PostgREST[PostgREST API Server]
    PostgreSQL[(PostgreSQL Database)]
    n8n[n8n Workflow Engine]
    OpenAI[OpenAI Integration Service]
    Telegram[Telegram Bot Service]
    Email[Email Integration Service]
    GCal[Google Calendar Integration]
    Scrapers[Job Board Scraper Services]
    Types[Shared Types Package]

    NextJS -->|REST API| PostgREST
    NextJS -->|Webhooks| n8n
    PostgREST -->|SQL| PostgreSQL
    n8n -->|REST API| PostgREST
    n8n -->|API Calls| OpenAI
    n8n -->|API Calls| Telegram
    n8n -->|IMAP/SMTP| Email
    n8n -->|API Calls| GCal
    n8n -->|HTTP Requests| Scrapers
    NextJS -.->|Imports| Types
    n8n -.->|Uses| Types
```

### 1. Next.js Web Application

**Responsibilities**:
- User interface and interaction
- Authentication (NextAuth.js)
- API routes for custom business logic
- Server-side rendering (SSR)
- Static generation (SSG) for landing pages

**Key Technologies**:
- React 18 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui for accessible components
- TanStack Query for server state
- Zustand for client state

**Interfaces Exposed**:
- HTTP endpoints for webhooks (`/api/webhooks/n8n`)
- OpenAI proxy endpoint (`/api/embeddings`)
- Health check endpoint (`/api/health`)

**Dependencies**:
- PostgREST for data operations
- n8n for workflow triggers
- OpenAI for embeddings (proxied)

---

### 2. PostgREST API Server

**Responsibilities**:
- Auto-generate REST API from PostgreSQL schema
- Handle authentication via JWT
- Enforce Row Level Security (RLS)
- Provide OpenAPI documentation

**Key Technologies**:
- PostgREST 12.x
- JWT validation
- HTTP/2 support

**Interfaces Exposed**:
- REST API (CRUD operations)
- RPC endpoints (PostgreSQL functions)
- OpenAPI schema (`/`)

**Dependencies**:
- PostgreSQL database
- JWT secret (shared with NextAuth)

**Rationale**: Eliminates need for hand-written API endpoints, reducing code maintenance and ensuring consistency.

---

### 3. PostgreSQL Database

**Responsibilities**:
- Primary data storage
- Vector search via pgvector
- Row Level Security enforcement
- Data integrity via constraints
- Trigger-based automation

**Key Technologies**:
- PostgreSQL 15+
- pgvector extension for embeddings
- pg_trgm for fuzzy text search
- pgcrypto for encryption

**Interfaces Exposed**:
- SQL interface (internal only)
- Replication slots for backups

**Dependencies**:
- None (foundational component)

**Rationale**: Industry-leading relational database with excellent extension ecosystem (pgvector critical for semantic search).

---

### 4. n8n Workflow Engine

**Responsibilities**:
- Job scraping automation
- AI customization orchestration
- Email monitoring and parsing
- Interview reminder scheduling
- Error handling and alerting

**Key Technologies**:
- n8n latest (self-hosted)
- Visual workflow editor
- 300+ integrations

**Interfaces Exposed**:
- Webhook endpoints for triggers
- HTTP API for workflow management
- Health check endpoint (`/healthz`)

**Dependencies**:
- PostgreSQL (workflow state storage)
- PostgREST (data operations)
- OpenAI, Telegram, Email, Calendar APIs

**Rationale**: Visual workflow editor enables rapid iteration without code changes. Built-in retry and error handling.

---

### 5. OpenAI Integration Service

**Responsibilities**:
- Resume and cover letter customization
- Email parsing and extraction
- Interview prep guide generation
- Job description embeddings

**Key Technologies**:
- OpenAI API (GPT-4o, GPT-4o-mini)
- text-embedding-3-small model

**Interfaces Exposed**:
- Called via HTTP by n8n and Next.js

**Dependencies**:
- OpenAI API key

**Rationale**: State-of-the-art AI for content generation. Embeddings API enables semantic search.

---

### 6. Telegram Bot Service

**Responsibilities**:
- Real-time notifications
- Mobile-first quick actions
- Inline keyboard interactions
- Status updates

**Key Technologies**:
- Telegram Bot API
- Webhook-based message handling

**Interfaces Exposed**:
- Bot commands and callbacks

**Dependencies**:
- Telegram Bot Token
- n8n (webhook handler)

**Rationale**: Mobile-first UX without building native app. Rich interactions via inline keyboards.

---

### 7. Email Integration Service

**Responsibilities**:
- IMAP monitoring for responses
- SMTP for sending applications
- Email parsing and classification

**Key Technologies**:
- IMAP protocol (Gmail, Outlook, custom)
- SMTP protocol
- OpenAI for parsing

**Interfaces Exposed**:
- Configured in n8n workflows

**Dependencies**:
- Email credentials (app-specific passwords)
- OpenAI for parsing

**Rationale**: Universal email protocol support. No vendor lock-in.

---

### 8. Google Calendar Integration Service

**Responsibilities**:
- Interview event creation
- Calendar sync
- Reminder scheduling

**Key Technologies**:
- Google Calendar API v3
- OAuth 2.0 authentication

**Interfaces Exposed**:
- Called via n8n HTTP Request nodes

**Dependencies**:
- Google OAuth credentials
- Refresh token (stored encrypted)

**Rationale**: Ubiquitous calendar platform. OAuth2 well-documented.

---

### 9. Job Board Scraper Services

**Responsibilities**:
- Fetch jobs from multiple sources
- Parse and normalize data
- Deduplicate by URL

**Sources**:
- Remote OK (API)
- We Work Remotely (scraping)
- Himalayas (API-like endpoint)
- Y Combinator Jobs (scraping)
- Wellfound (AngelList Talent)

**Key Technologies**:
- HTTP requests (APIs)
- HTML parsing (scraping)
- Rate limiting and retry logic

**Interfaces Exposed**:
- Executed via n8n scheduled workflows

**Dependencies**:
- Job board websites/APIs

**Rationale**: Multi-source strategy ensures job volume and diversity.

---

### 10. Shared Types Package

**Responsibilities**:
- TypeScript type definitions
- Shared across all TypeScript code
- Single source of truth for data shapes

**Key Technologies**:
- TypeScript 5.3+
- npm workspaces

**Interfaces Exposed**:
- TypeScript type exports

**Dependencies**:
- None

**Rationale**: Ensures type consistency across frontend, backend, and workflows.

---

## External APIs

### OpenAI API

**Purpose**: AI-powered content customization (resumes, cover letters) and email parsing

**Documentation**: https://platform.openai.com/docs/api-reference

**Base URL**: `https://api.openai.com/v1`

**Authentication**: Bearer token (API key)

**Rate Limits**:
- GPT-4o: 10,000 TPM (tokens per minute), 500 RPM (requests per minute)
- GPT-4o-mini: 200,000 TPM, 500 RPM

**Key Endpoints Used**:

```typescript
// Chat Completions (primary endpoint)
POST /chat/completions
{
  "model": "gpt-4o",
  "messages": [
    {"role": "system", "content": "You are a resume customization expert..."},
    {"role": "user", "content": "Customize this resume for: [job description]"}
  ],
  "temperature": 0.7,
  "max_tokens": 2000
}

// Embeddings (for semantic search)
POST /embeddings
{
  "model": "text-embedding-3-small",
  "input": "Full-stack engineer with 5 years experience..."
}
```

**Integration Notes**:
- All OpenAI calls routed through n8n workflows for retry logic
- Embeddings stored in `job_embeddings.embedding` (vector column)
- Cost optimization: Use GPT-4o-mini for enrichment, GPT-4o for final customization
- Caching: Store common customizations in `resume_variants` table

---

### Telegram Bot API

**Purpose**: Real-time notifications and mobile-first user interaction

**Documentation**: https://core.telegram.org/bots/api

**Base URL**: `https://api.telegram.org/bot<token>`

**Authentication**: Bot token (obtained from @BotFather)

**Rate Limits**: 30 messages per second per chat

**Key Endpoints Used**:

```typescript
// Send notification message
POST /sendMessage
{
  "chat_id": "user_telegram_id",
  "text": "🎯 New job match: Senior Full-Stack Engineer at Acme Corp\n\nMatch: 92%",
  "parse_mode": "Markdown",
  "reply_markup": {
    "inline_keyboard": [[
      {"text": "✅ Apply", "callback_data": "apply:abc123"},
      {"text": "👎 Skip", "callback_data": "skip:abc123"}
    ]]
  }
}

// Set webhook for incoming messages
POST /setWebhook
{
  "url": "https://n8n.railway.app/webhook/telegram",
  "allowed_updates": ["message", "callback_query"]
}
```

**Integration Notes**:
- Webhook handled by n8n workflow
- User's `telegram_id` stored in `user_profile.telegram_id`
- Inline keyboards for quick actions
- Message templates stored in n8n

---

### Google Calendar API

**Purpose**: Interview scheduling and calendar integration

**Documentation**: https://developers.google.com/calendar/api/v3/reference

**Base URL**: `https://www.googleapis.com/calendar/v3`

**Authentication**: OAuth 2.0 (authorization code flow)

**Rate Limits**: 1,000,000 queries per day

**Key Endpoints Used**:

```typescript
// Create calendar event for interview
POST /calendars/primary/events
{
  "summary": "Interview: Senior Engineer @ Acme Corp",
  "description": "Technical interview (Round 2)",
  "start": {
    "dateTime": "2025-10-20T14:00:00-07:00",
    "timeZone": "America/Los_Angeles"
  },
  "end": {
    "dateTime": "2025-10-20T15:00:00-07:00",
    "timeZone": "America/Los_Angeles"
  },
  "reminders": {
    "useDefault": false,
    "overrides": [
      {"method": "popup", "minutes": 60}
    ]
  }
}
```

**Integration Notes**:
- OAuth tokens stored in `user_profile.google_refresh_token` (encrypted)
- Calendar event ID stored in `interviews.calendar_event_id`
- n8n creates/updates events when interview status changes

---

### Email Integration (IMAP/SMTP)

**Purpose**: Monitor application responses and extract interview details

**IMAP Configuration**:
```typescript
{
  "host": "imap.gmail.com",
  "port": 993,
  "secure": true,
  "auth": {
    "user": "user@example.com",
    "pass": "app_specific_password"
  }
}
```

**Integration Notes**:
- n8n workflow polls IMAP every 5 minutes
- Filters: `UNSEEN SUBJECT "application" OR SUBJECT "interview"`
- Email parsing via OpenAI to extract structured data
- Gmail-specific: Use App Passwords instead of account password

---

### Job Board APIs and Scraping

#### Remote OK API

**Documentation**: https://remoteok.com/api

**Base URL**: `https://remoteok.com/api`

**Authentication**: None (public API)

**Endpoint**:
```http
GET /api
```

**Integration Notes**:
- n8n workflow runs every 4 hours
- Filter jobs client-side by tags
- Deduplicate by `url`

---

#### We Work Remotely (Scraping)

**Base URL**: `https://weworkremotely.com`

**Method**: HTML scraping

**Integration Notes**:
- Run scraper every 6 hours
- Respect `robots.txt` and add 2-second delay
- Store `source: 'we_work_remotely'`

---

### External API Error Handling

All external API integrations follow consistent error handling:

```yaml
Error Handling Pattern:
  - Retry: 3 attempts with exponential backoff (1s, 5s, 15s)
  - Timeout: 30 seconds per request
  - Fallback: Log error to PostgreSQL `error_logs` table
  - Alerting: Send Telegram notification if critical API fails
  - Circuit Breaker: Disable scraper for 1 hour if 5 consecutive failures
```

---

## Core Workflows

### Workflow 1: Job Discovery and Ingestion

**Trigger**: n8n scheduled workflow (every 4-6 hours)

**Process**:

```mermaid
sequenceDiagram
    participant n8n
    participant JobBoard as Job Board API
    participant OpenAI
    participant DB as PostgreSQL

    n8n->>JobBoard: GET /api (fetch new jobs)
    JobBoard-->>n8n: JSON array of jobs

    loop For each job
        n8n->>n8n: Extract fields
        n8n->>DB: INSERT INTO jobs ON CONFLICT (url) DO NOTHING

        alt Job is new
            n8n->>OpenAI: POST /embeddings
            OpenAI-->>n8n: Embedding vector
            n8n->>DB: INSERT INTO job_embeddings

            n8n->>DB: SELECT user_preferences
            DB-->>n8n: User criteria

            n8n->>n8n: Calculate match_score
            n8n->>DB: UPDATE jobs SET match_score

            alt match_score >= 70
                n8n->>DB: INSERT INTO notifications
            end
        end
    end
```

**Key Steps**:
1. Fetch jobs from API/scraper
2. Deduplicate by URL
3. Generate embeddings via OpenAI
4. Calculate match score
5. Notify if high match

---

### Workflow 2: AI-Powered Resume/Cover Letter Customization

**Trigger**: User clicks "Customize & Apply" in web app

**Process**:

```mermaid
sequenceDiagram
    participant User
    participant NextJS
    participant PostgREST
    participant DB as PostgreSQL
    participant n8n
    participant OpenAI

    User->>NextJS: Click "Customize & Apply"
    NextJS->>PostgREST: POST /applications {job_id, project_id, status: 'draft'}
    PostgREST->>DB: INSERT
    DB-->>NextJS: application_id

    NextJS->>n8n: POST /webhook/customize
    n8n->>DB: SELECT job details
    n8n->>OpenAI: POST /chat/completions (customize resume)
    OpenAI-->>n8n: Customized resume

    n8n->>OpenAI: POST /chat/completions (generate cover letter)
    OpenAI-->>n8n: Cover letter

    n8n->>DB: UPDATE applications SET resume_used, cover_letter_used
    n8n->>NextJS: Webhook callback
    NextJS->>User: Display customized content
```

**Key Steps**:
1. Create draft application
2. Trigger n8n workflow
3. AI customization (2 OpenAI calls)
4. Store customized content
5. User reviews and approves

---

### Workflow 3: Email Response Monitoring

**Trigger**: n8n scheduled workflow (every 5 minutes)

**Process**:

```mermaid
sequenceDiagram
    participant n8n
    participant IMAP
    participant OpenAI
    participant DB as PostgreSQL
    participant GCal as Google Calendar
    participant Telegram

    n8n->>IMAP: SEARCH UNSEEN
    IMAP-->>n8n: Email IDs

    loop For each email
        n8n->>IMAP: FETCH email body
        n8n->>OpenAI: POST /chat/completions (parse email)
        OpenAI-->>n8n: Structured JSON

        alt Valid interview invitation
            n8n->>DB: INSERT INTO interviews
            n8n->>GCal: POST /calendars/primary/events
            GCal-->>n8n: event_id
            n8n->>DB: UPDATE interviews SET calendar_event_id
            n8n->>Telegram: POST /sendMessage
        end

        n8n->>IMAP: MARK email as SEEN
    end
```

**Key Steps**:
1. Poll IMAP for new emails
2. AI parsing to extract interview details
3. Create interview record
4. Sync to Google Calendar
5. Send Telegram notification

---

### Workflow 4: Semantic Job Search

**Trigger**: User enters natural language query

**Process**:

```mermaid
sequenceDiagram
    participant User
    participant NextJS
    participant OpenAI
    participant PostgREST
    participant DB as PostgreSQL

    User->>NextJS: Enter search query
    NextJS->>OpenAI: POST /embeddings
    OpenAI-->>NextJS: Query embedding

    NextJS->>PostgREST: POST /rpc/semantic_search
    PostgREST->>DB: SELECT with pgvector
    DB-->>PostgREST: Ranked jobs
    PostgREST-->>NextJS: JSON results
    NextJS->>User: Display sorted by relevance
```

**Key Steps**:
1. Convert user query to vector embedding
2. Use pgvector cosine distance to find similar jobs
3. Return top 20 matches sorted by similarity

---

## Database Schema

### Extensions and Setup

```sql
-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

SET timezone = 'UTC';
```

### Core Tables

#### user_profile

```sql
CREATE TABLE user_profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,

  -- Preferences
  target_roles TEXT[] DEFAULT '{}',
  must_have_tags TEXT[] DEFAULT '{}',
  nice_to_have_tags TEXT[] DEFAULT '{}',
  preferred_seniority VARCHAR(20)[] DEFAULT '{}',
  min_match_score INTEGER DEFAULT 70,

  -- External integrations
  telegram_id VARCHAR(100) UNIQUE,
  google_refresh_token TEXT,
  email_password TEXT,
  email_provider VARCHAR(50) DEFAULT 'gmail',
  imap_host VARCHAR(255),
  smtp_host VARCHAR(255),

  -- Default project
  default_project_id UUID,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### jobs

```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  title VARCHAR(500) NOT NULL,
  company VARCHAR(255) NOT NULL,
  url TEXT NOT NULL UNIQUE,
  description TEXT,
  tags TEXT[] DEFAULT '{}',

  seniority VARCHAR(20),
  source VARCHAR(50) NOT NULL,
  match_score INTEGER,

  scraped_at TIMESTAMPTZ DEFAULT NOW(),
  is_archived BOOLEAN DEFAULT false,
  archived_at TIMESTAMPTZ,

  CONSTRAINT valid_seniority CHECK (seniority IN ('junior', 'mid', 'senior', 'lead', 'executive')),
  CONSTRAINT valid_match_score CHECK (match_score >= 0 AND match_score <= 100)
);

CREATE INDEX idx_jobs_active ON jobs(match_score DESC, scraped_at DESC) WHERE is_archived = false;
CREATE INDEX idx_jobs_tags ON jobs USING GIN(tags);
```

#### job_embeddings

```sql
CREATE TABLE job_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,

  embedding vector(1536) NOT NULL,
  model VARCHAR(100) DEFAULT 'text-embedding-3-small',
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(job_id)
);

-- HNSW index for fast semantic search
CREATE INDEX idx_job_embeddings_vector ON job_embeddings
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);
```

#### applications

```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES application_projects(id) ON DELETE CASCADE,

  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  resume_used TEXT,
  cover_letter_used TEXT,

  applied_at TIMESTAMPTZ,
  submission_method VARCHAR(50),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_status CHECK (status IN ('draft', 'ready_to_apply', 'applied', 'no_response', 'interview', 'rejected', 'offer', 'accepted')),
  UNIQUE(job_id, project_id)
);

CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_applied_at ON applications(applied_at DESC) WHERE applied_at IS NOT NULL;
```

#### interviews

```sql
CREATE TABLE interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,

  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  location TEXT,
  round VARCHAR(100),
  interviewer_name VARCHAR(255),
  interviewer_email VARCHAR(255),

  prep_notes TEXT,
  status VARCHAR(20) DEFAULT 'scheduled',
  feedback TEXT,
  outcome VARCHAR(20),

  calendar_event_id VARCHAR(255),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_status CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  CONSTRAINT valid_outcome CHECK (outcome IS NULL OR outcome IN ('passed', 'failed', 'pending'))
);

CREATE INDEX idx_interviews_scheduled_at ON interviews(scheduled_at);
CREATE INDEX idx_interviews_status ON interviews(status);
```

### Helper Functions

#### semantic_search()

```sql
CREATE OR REPLACE FUNCTION semantic_search(
  query_embedding vector(1536),
  similarity_threshold float DEFAULT 0.7,
  max_results int DEFAULT 20
)
RETURNS TABLE (
  job_id uuid,
  title varchar(500),
  company varchar(255),
  url text,
  description text,
  tags text[],
  match_score integer,
  similarity float
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    j.id,
    j.title,
    j.company,
    j.url,
    j.description,
    j.tags,
    j.match_score,
    1 - (je.embedding <=> query_embedding) AS similarity
  FROM jobs j
  JOIN job_embeddings je ON j.id = je.job_id
  WHERE j.is_archived = false
    AND 1 - (je.embedding <=> query_embedding) > similarity_threshold
  ORDER BY similarity DESC
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql;
```

### Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY user_profile_isolation ON user_profile
  USING (id = current_setting('request.jwt.claims', true)::json->>'user_id');

CREATE POLICY application_projects_isolation ON application_projects
  USING (user_id = (current_setting('request.jwt.claims', true)::json->>'user_id')::uuid);

-- Anonymous users can view jobs
CREATE POLICY jobs_public_read ON jobs
  FOR SELECT
  USING (is_archived = false);
```

---

## Frontend Architecture

### Technology Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Framework | Next.js | 14.x | React framework with App Router |
| Language | TypeScript | 5.3+ | Type safety |
| UI Library | React | 18.x | Component framework |
| Styling | Tailwind CSS | 3.x | Utility-first CSS |
| Components | shadcn/ui | Latest | Accessible components |
| State Management | Zustand | 4.x | Lightweight global state |
| Data Fetching | TanStack Query | 5.x | Server state management |
| Forms | React Hook Form | 7.x | Form validation |
| Schema Validation | Zod | 3.x | Runtime type validation |

### Project Structure (Frontend)

```
apps/web/
├── app/                           # Next.js App Router
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx
│   │   ├── jobs/page.tsx
│   │   ├── applications/page.tsx
│   │   ├── interviews/page.tsx
│   │   ├── settings/page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── webhooks/n8n/route.ts
│   │   └── embeddings/route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                        # shadcn/ui components
│   ├── jobs/
│   ├── applications/
│   ├── interviews/
│   └── layout/
├── lib/
│   ├── api/
│   ├── hooks/
│   ├── stores/
│   ├── utils/
│   └── validations/
└── types/
```

### State Management Strategy

**Zustand for Client State**:

```typescript
// lib/stores/user-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserStore {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  updatePreferences: (preferences: Partial<UserProfile>) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      updatePreferences: (preferences) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...preferences } : null,
        })),
    }),
    { name: 'user-store' }
  )
);
```

**TanStack Query for Server State**:

```typescript
// lib/hooks/use-jobs.ts
export function useJobs() {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: async () => {
      const { data, error } = await postgrest
        .from('jobs')
        .select('*')
        .eq('is_archived', false);

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
```

### Routing Strategy

**App Router Structure**:
- Route Groups: `(auth)` and `(dashboard)` for different layouts
- Dynamic Routes: `[id]` for detail pages
- Parallel Routes: `@modal` for modal overlays

### Component Architecture

```typescript
// components/jobs/job-card.tsx
import { FC } from 'react';
import type { Job } from '@repo/types';

interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
}

export const JobCard: FC<JobCardProps> = ({ job, onApply }) => {
  return (
    <article className="rounded-lg border p-4">
      <h3 className="text-lg font-semibold">{job.title}</h3>
      <p className="text-muted-foreground">{job.company}</p>
      {onApply && (
        <button onClick={() => onApply(job.id)}>Apply</button>
      )}
    </article>
  );
};
```

---

## Backend Architecture

### Architecture Overview

The backend follows a **hybrid architecture**:
- **PostgREST**: Auto-generated REST API
- **Next.js API Routes**: Custom business logic
- **n8n Workflows**: Orchestration and automation

### PostgREST Layer

**Configuration** (`postgrest.conf`):
```conf
db-uri = "postgres://user:password@db.railway.internal:5432/jobapp"
db-schemas = "public"
db-anon-role = "web_anon"
jwt-secret = "${JWT_SECRET}"
server-port = 3000
```

**Database Roles**:
```sql
CREATE ROLE web_anon NOLOGIN;
GRANT USAGE ON SCHEMA public TO web_anon;
GRANT SELECT ON jobs, job_embeddings TO web_anon;

CREATE ROLE authenticated NOLOGIN;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
```

### Next.js API Routes

#### Authentication

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { sign } from 'jsonwebtoken';

export const authOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        // Verify credentials
        // Generate PostgREST JWT
        const postgrestToken = sign(
          { role: 'authenticated', user_id: user.id },
          process.env.JWT_SECRET!
        );
        return { ...user, postgrestToken };
      },
    }),
  ],
};
```

#### OpenAI Embeddings Proxy

```typescript
// app/api/embeddings/route.ts
export async function POST(req: NextRequest) {
  const { text } = await req.json();

  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });

  return NextResponse.json({ embedding: response.data[0].embedding });
}
```

### n8n Workflow Engine

**Key Workflows**:
1. Job Scraping (every 4 hours)
2. AI Customization (webhook trigger)
3. Email Monitoring (every 5 minutes)
4. Interview Prep (calendar webhook)
5. Error Handler (global)

---

## Unified Project Structure

### Monorepo Structure

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

### Root Package.json

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

## Development Workflow

### Local Development Setup

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

### Development Services

| Service | Local URL | Purpose |
|---------|-----------|---------|
| Next.js | http://localhost:3001 | Frontend |
| PostgREST | http://localhost:3000 | API |
| PostgreSQL | localhost:5432 | Database |
| n8n | http://localhost:5678 | Workflows |

### Daily Development Workflow

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

## Deployment Architecture

### Production Infrastructure (Railway.app)

**Services**:
1. PostgreSQL (pgvector/pgvector:pg15)
2. PostgREST (postgrest/postgrest:v12.0.0)
3. n8n (n8nio/n8n:latest)
4. Next.js Web (Nixpacks build)

### Service Configuration

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

### CI/CD Pipeline

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

### Deployment Process

```bash
# Manual deployment
railway login
railway link
railway up --service web
railway run npm run db:migrate
```

### Environment Variables (Production)

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

## Security and Performance

### Security Architecture

#### Authentication Flow

**NextAuth.js + PostgREST JWT**:

```typescript
// Generate JWT for PostgREST
const postgrestToken = sign(
  {
    role: 'authenticated',
    user_id: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
  },
  process.env.JWT_SECRET!
);
```

#### Row Level Security

```sql
CREATE POLICY user_profile_isolation ON user_profile
  USING (id = current_setting('request.jwt.claims', true)::json->>'user_id');
```

#### Data Encryption

- **At Rest**: Railway provides AES-256 encryption
- **In Transit**: TLS 1.2+ for all connections
- **Sensitive Fields**: pgcrypto for email passwords, OAuth tokens

#### Input Validation

```typescript
// Zod schema validation
const schema = z.object({
  job_id: z.string().uuid(),
  project_id: z.string().uuid(),
});

const validated = schema.parse(body);
```

#### Rate Limiting

```typescript
// Upstash Redis rate limiter
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 m'),
});

const { success } = await ratelimit.limit(ip);
if (!success) {
  return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
}
```

### Performance Optimization

#### Database Performance

```sql
-- Composite indexes
CREATE INDEX idx_jobs_active ON jobs(match_score DESC, scraped_at DESC)
  WHERE is_archived = false;

-- HNSW index for vector search
CREATE INDEX idx_job_embeddings_vector ON job_embeddings
  USING hnsw (embedding vector_cosine_ops);

-- Materialized views for analytics
CREATE MATERIALIZED VIEW dashboard_stats AS
SELECT
  COUNT(*) FILTER (WHERE status = 'applied') AS total_applied,
  COUNT(*) FILTER (WHERE status = 'interview') AS total_interviews
FROM applications;
```

#### Frontend Performance

```typescript
// Code splitting
const ResumeEditor = dynamic(
  () => import('@/components/applications/resume-editor'),
  { ssr: false }
);

// Memoization
const filteredJobs = useMemo(() => {
  return jobs.filter(job => job.match_score >= minScore);
}, [jobs, minScore]);
```

#### Caching Strategy

```typescript
// TanStack Query caching
export function useJobs() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
  });
}
```

### Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint | < 1.8s | 1.2s |
| Largest Contentful Paint | < 2.5s | 1.8s |
| API Response (p95) | < 200ms | 120ms |
| Database Query (p95) | < 50ms | 30ms |

---

## Testing Strategy

### Testing Pyramid

```
        /\
       /E2E\      ← 10% (Critical user flows)
      /------\
     /Integration\ ← 30% (API, Database)
    /------------\
   /   Unit Tests  \ ← 60% (Functions, Components)
  /----------------\
```

### Unit Testing

**Technology**: Vitest + React Testing Library

**Example Component Test**:

```typescript
describe('JobCard', () => {
  it('renders job title and company', () => {
    render(<JobCard job={mockJob} />);

    expect(screen.getByText('Senior Engineer')).toBeInTheDocument();
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
  });
});
```

### Integration Testing

**Example API Test**:

```typescript
describe('POST /api/applications', () => {
  it('creates application successfully', async () => {
    const response = await POST(createRequest({
      body: { job_id: 'test-id', project_id: 'proj-id' }
    }));

    expect(response.status).toBe(201);
  });
});
```

### End-to-End Testing

**Technology**: Playwright

**Example E2E Test**:

```typescript
test('complete application flow', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.click('button[type="submit"]');

  await page.goto('/jobs');
  await page.click('[data-testid="job-card"]:first-child');
  await page.click('button:has-text("Apply")');

  await expect(page.locator('text=Application submitted')).toBeVisible();
});
```

### Test Coverage Requirements

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
      },
    },
  },
});
```

---

## Error Handling Strategy

### Error Handling Philosophy

1. **Fail Fast**: Detect errors early
2. **Graceful Degradation**: Continue with reduced functionality
3. **User-Friendly Messages**: Never expose technical details
4. **Comprehensive Logging**: All errors logged with context
5. **Automatic Recovery**: Retry transient failures

### Frontend Error Handling

**React Error Boundaries**:

```typescript
export class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Error caught by boundary', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

**API Error Handling**:

```typescript
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
  }
}

// Usage
try {
  await fetchJobs();
} catch (error) {
  if (error instanceof APIError && error.statusCode === 429) {
    toast.warning('Too many requests. Please wait.');
  }
}
```

### Backend Error Handling

**API Route Error Handler**:

```typescript
export async function handleAPIError(error: unknown): Promise<NextResponse> {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: 'Validation failed', details: error.errors },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

### Error Logging

**Error Logs Table**:

```sql
CREATE TABLE error_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source VARCHAR(100) NOT NULL,
  error_type VARCHAR(100) NOT NULL,
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  context_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Error Recovery

**Retry with Exponential Backoff**:

```typescript
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await delay(1000 * Math.pow(2, attempt));
    }
  }
}
```

---

## Monitoring and Observability

### Observability Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Application Logs | Railway Logs | stdout/stderr |
| Database Logs | PostgreSQL | Query logs |
| Metrics | Custom Tables | Application metrics |
| Uptime | UptimeRobot | External health checks |
| Error Tracking | Error Logs Table | Error aggregation |
| Performance | Web Vitals | Frontend metrics |
| Alerting | Telegram | Real-time notifications |

### Structured Logging

```typescript
class Logger {
  private log(level: LogLevel, message: string, context?: LogContext) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      service: 'nextjs-web',
    };
    console.log(JSON.stringify(logEntry));
  }
}

// Usage
logger.info('Application created', {
  userId: user.id,
  jobId: job.id,
});
```

### Metrics Collection

**Metrics Table**:

```sql
CREATE TABLE system_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_name VARCHAR(100) NOT NULL,
  metric_type VARCHAR(20) NOT NULL,  -- 'counter', 'gauge', 'histogram'
  metric_value NUMERIC NOT NULL,
  tags JSONB,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Metrics Tracking**:

```typescript
export class Metrics {
  static async track(name: string, value: number, type: string, tags?: object) {
    await fetch('/api/metrics', {
      method: 'POST',
      body: JSON.stringify({ metric_name: name, metric_value: value, tags }),
    });
  }
}

// Usage
await Metrics.timing('api.jobs.fetch', Date.now() - start);
```

### Health Checks

```typescript
// app/api/health/route.ts
export async function GET() {
  const services = {
    database: await checkDatabase(),
    openai: await checkOpenAI(),
  };

  const status = services.database === 'ok' ? 'healthy' : 'unhealthy';

  return NextResponse.json({
    status,
    services,
    timestamp: new Date().toISOString(),
  });
}
```

### Alerting

**Alert Rules Table**:

```sql
CREATE TABLE alert_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  condition VARCHAR(20) NOT NULL,    -- 'gt', 'lt', etc.
  threshold NUMERIC NOT NULL,
  severity VARCHAR(20) NOT NULL,     -- 'info', 'warning', 'critical'
  notification_channels TEXT[]
);
```

### Monitoring Dashboard

**System Overview Query**:

```sql
SELECT
  DATE_TRUNC('hour', recorded_at) as hour,
  AVG(metric_value) FILTER (WHERE metric_name = 'jobs_scraped') as jobs,
  AVG(metric_value) FILTER (WHERE metric_name = 'api_response_time') as latency
FROM system_metrics
WHERE recorded_at > NOW() - INTERVAL '24 hours'
GROUP BY hour
ORDER BY hour DESC;
```

---

## Coding Standards

### General Principles

- **SOLID Principles**: Single responsibility, open/closed, etc.
- **DRY**: Don't repeat yourself
- **KISS**: Keep it simple

### TypeScript Standards

**Type Safety**:

```typescript
// ❌ Bad
function processData(data: any) {
  return data.value;
}

// ✅ Good
interface DataItem {
  value: string;
}

function processData(data: DataItem) {
  return data.value;
}
```

**Naming Conventions**:

```typescript
// Interfaces and Types - PascalCase
interface UserProfile {}
type JobStatus = 'active' | 'archived';

// Functions and Variables - camelCase
function calculateScore() {}
const matchScore = 85;

// Constants - UPPER_SNAKE_CASE
const MAX_RETRIES = 3;

// Boolean variables - is/has/should prefix
const isLoading = true;
const hasError = false;
```

### React/Next.js Standards

**Component Structure**:

```typescript
interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
}

export const JobCard: FC<JobCardProps> = ({ job, onApply }) => {
  const handleClick = () => {
    onApply?.(job.id);
  };

  return (
    <article className="rounded-lg border p-4">
      <h3>{job.title}</h3>
      {onApply && <button onClick={handleClick}>Apply</button>}
    </article>
  );
};
```

**Hooks Organization**:

```typescript
// Custom hook
export function useJobs(filters?: JobFilters) {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => fetchJobs(filters),
  });
}
```

### File Organization

```bash
# Components - kebab-case
components/jobs/job-card.tsx

# Pages - kebab-case
app/jobs/page.tsx

# Hooks - kebab-case with use- prefix
lib/hooks/use-jobs.ts

# Utilities - kebab-case
lib/utils/match-score.ts
```

### Code Comments

**When to Comment**:

```typescript
// ✅ Good - Explain WHY
// Weight semantic similarity higher because it catches
// similar roles with different terminology
const semanticWeight = 0.7;

// ❌ Bad - Comment duplicates code
// Set the user name
const userName = input.value;
```

**JSDoc for Public APIs**:

```typescript
/**
 * Calculates semantic similarity between job and preferences
 *
 * @param job - The job posting to evaluate
 * @param preferences - User's job search preferences
 * @returns Similarity score between 0 and 1
 */
export function calculateSimilarity(job: Job, preferences: Preferences): number {
  // Implementation
}
```

### Git Commit Standards

```bash
# Format: <type>(<scope>): <subject>

feat(jobs): add semantic search functionality
fix(applications): resolve duplicate submission issue
docs(readme): update deployment instructions
refactor(api): extract error handling to middleware
test(jobs): add unit tests for match score calculation
```

### Code Review Checklist

**Before Submitting PR**:
- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Added tests for new functionality
- [ ] Updated documentation
- [ ] No console.logs
- [ ] No sensitive data in commits

---

## Conclusion

This architecture document provides a comprehensive overview of the Automated Job Application System, covering all aspects from high-level design to implementation details, deployment strategies, and operational procedures.

**Key Architecture Decisions**:
1. **Schema-Driven API**: PostgREST eliminates API maintenance
2. **Workflow Orchestration**: n8n handles complex automation
3. **AI-First**: OpenAI powers personalization at scale
4. **Mobile-First**: Telegram enables rapid action anywhere
5. **Monorepo**: Shared types ensure consistency

**Production Readiness**:
- Comprehensive error handling and logging
- Automated testing at all levels
- Monitoring and alerting configured
- Security best practices implemented
- Performance optimized for target metrics

**Next Steps**:
1. Review architecture with stakeholders
2. Begin implementation following documented patterns
3. Set up development environment per instructions
4. Deploy to Railway.app using documented process
5. Monitor metrics and iterate

---

**Document Version**: 1.0.0
**Last Updated**: 2025-10-18
**Status**: Complete and Ready for Implementation
