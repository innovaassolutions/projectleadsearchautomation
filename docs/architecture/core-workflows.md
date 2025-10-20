# Core Workflows

## Workflow 1: Job Discovery and Ingestion

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

## Workflow 2: AI-Powered Resume/Cover Letter Customization

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

## Workflow 3: Email Response Monitoring

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

## Workflow 4: Semantic Job Search

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
