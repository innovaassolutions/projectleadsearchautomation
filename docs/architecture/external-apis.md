# External APIs

## OpenAI API

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

## Telegram Bot API

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

## Google Calendar API

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

## Email Integration (IMAP/SMTP)

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

## Job Board APIs and Scraping

### Remote OK API

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

### We Work Remotely (Scraping)

**Base URL**: `https://weworkremotely.com`

**Method**: HTML scraping

**Integration Notes**:
- Run scraper every 6 hours
- Respect `robots.txt` and add 2-second delay
- Store `source: 'we_work_remotely'`

---

## External API Error Handling

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
