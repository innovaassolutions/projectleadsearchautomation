
# 🛠️ Job Scraping & Automation Pipeline (v1) – n8n + Railway + PostgreSQL

## 🔍 Job Board Sources

### ✅ 1. Remote OK
- Public API: `https://remoteok.com/api`
- Remote-first tech jobs
- Easy to integrate with n8n `HTTP Request` node

### 🟡 2. We Work Remotely (WWR)
- No API, but clean HTML
- Structured job categories (e.g., programming, sales)
- Scrape via `HTML Extract` or external scraper

### 🟠 3. Himalayas.app
- Startup-focused remote jobs
- Well-structured HTML, no API
- Scrape using Puppeteer or Apify Actor

### 🔵 4. Y Combinator – Work at a Startup
- Public job board: https://www.workatastartup.com/jobs
- Easy to scrape

### 🟣 5. AngelList Talent (Wellfound)
- Login required
- Headless browser scraping only (e.g., Puppeteer, Browserless)

### 🟤 6. Toptal / Gun.io / Replit Bounties
- Project-based, freelance jobs
- Scrape or use RSS feeds (if offered)

---

## 🧱 System Architecture

```mermaid
graph TD
subgraph n8n (Scheduler)
    A1[Cron Trigger]
    A2[Remote OK API Pull]
    A3[WWR Scraper Node]
    A4[AngelList Scraper Webhook]
    A5[OpenAI Tagging + Scoring]
    A6[PostgreSQL Insert]
end

subgraph Railway PostgreSQL
    B1[jobs table]
    B2[pg_trgm, pgvector]
end

A1 --> A2 --> A5
A1 --> A3 --> A5
A1 --> A4 --> A5
A5 --> A6 --> B1
```

---

## 🧩 PostgreSQL Schema (sample v1)

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT,
    company TEXT,
    location TEXT,
    url TEXT UNIQUE,
    description TEXT,
    tags TEXT[],
    match_score INT,
    seniority TEXT,
    source TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🧠 GPT Enrichment Prompt (example)

```
You are a job-matching assistant. Given the job description below, return:
- A 1-sentence summary
- Up to 5 relevant tags (e.g. "Python", "Remote", "Mid-Level")
- Estimated seniority (e.g., "Junior", "Mid", "Senior", "Lead")
- A match_score from 1-10 for a backend engineer with 5+ years in Python/Golang

Job Description:
{{description}}
```

---

## ✅ Deliverables (optional)

Let me know if you want help generating:

- ✅ n8n `.json` workflow for Remote OK
- ✅ `schema.sql` file for Railway
- ✅ `job_tagger.md` enrichment prompt file
- ✅ Puppeteer job scraper starter

