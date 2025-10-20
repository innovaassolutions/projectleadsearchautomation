# High Level Architecture

## System Overview

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

## Architecture Patterns

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
