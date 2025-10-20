# Tech Stack

## Technology Decisions

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

## Alternative Approaches Considered

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
