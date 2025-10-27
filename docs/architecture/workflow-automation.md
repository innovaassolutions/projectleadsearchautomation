# Workflow Automation with n8n

> **Last Updated**: 2025-10-27
> **Version**: 1.0

This document describes the n8n workflow automation architecture for the Job Application System.

---

## Overview

n8n is a visual workflow automation platform that orchestrates job scraping, AI enrichment, email monitoring, and application submissions in the Job Application System.

**Why n8n?**
- ✅ Self-hosted (no ongoing Zapier costs)
- ✅ 300+ integrations available
- ✅ Visual workflow builder (no code required)
- ✅ Powerful scheduling and webhook triggers
- ✅ PostgreSQL persistence (workflows survive restarts)

---

## Architecture

### Components

```
┌─────────────────────────────────────────────────────────┐
│                    n8n Workflow Engine                   │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Job         │  │ AI           │  │  Email       │  │
│  │  Scraping    │  │ Enrichment   │  │  Monitoring  │  │
│  │  (Scheduled) │  │ (Webhooks)   │  │  (Scheduled) │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                  │                  │         │
└─────────┼──────────────────┼──────────────────┼─────────┘
          │                  │                  │
          ▼                  ▼                  ▼
    ┌────────────────────────────────────────────────┐
    │           PostgreSQL Database                   │
    │   (Stores jobs, embeddings, applications)       │
    └────────────────────────────────────────────────┘
```

### Deployment Architecture

```
Local Development                  Railway Production
─────────────────                  ──────────────────
┌─────────────────┐                ┌─────────────────┐
│ n8n             │                │ n8n             │
│ localhost:5678  │                │ Railway URL     │
│ admin/localdev  │                │ admin/secure    │
└─────────────────┘                └─────────────────┘
        │                                  │
        ▼                                  ▼
┌─────────────────┐                ┌─────────────────┐
│ PostgreSQL      │                │ PostgreSQL      │
│ localhost:5434  │                │ Railway (pgvec) │
└─────────────────┘                └─────────────────┘
```

---

## Deployment Details

### Railway Production

**Access URL**: https://n8n-production-d194.up.railway.app

**Credentials**:
- Username: `admin`
- Password: Stored in Railway environment variables

**Environment Variables**:
```bash
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=<secure-password>
N8N_HOST=n8n-production-d194.up.railway.app
N8N_PORT=5678
N8N_PROTOCOL=https
WEBHOOK_URL=https://n8n-production-d194.up.railway.app/webhook
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=pgvector.railway.internal
DB_POSTGRESDB_PORT=5432
DB_POSTGRESDB_DATABASE=jobapp
DB_POSTGRESDB_USER=postgres
DB_POSTGRESDB_PASSWORD=<railway-password>
```

**Persistence**:
- Workflows stored in PostgreSQL (`n8n_workflow` table)
- Credentials encrypted in PostgreSQL (`n8n_credentials` table)
- Execution history in PostgreSQL (`n8n_execution` table)
- Survives service restarts automatically

### Local Development

**Access URL**: http://localhost:5678

**Credentials**:
- Username: `admin`
- Password: `localdev123`

**Started via**:
```bash
npm run dev:infra  # Starts n8n along with PostgreSQL and PostgREST
```

**Use Cases**:
- Develop workflows locally before deploying to production
- Test workflows with test data
- Debug workflow issues
- Work offline without affecting production

---

## Workflow Development Process

### 1. Build Locally

1. Start local n8n: `npm run dev:infra`
2. Access: http://localhost:5678
3. Login with `admin` / `localdev123`
4. Build and test workflow with test data

### 2. Export Workflow

1. Open workflow in n8n
2. Click "..." menu → "Download"
3. Save JSON to `/apps/n8n-workflows/<workflow-name>.json`
4. Use kebab-case naming (e.g., `job-scraper.json`)

### 3. Version Control

```bash
git add apps/n8n-workflows/<workflow-name>.json
git commit -m "feat(workflows): add job scraper workflow"
git push
```

### 4. Deploy to Production

1. Log into Railway n8n: https://n8n-production-d194.up.railway.app
2. Create new workflow or open existing
3. Click "..." menu → "Import from File"
4. Upload the JSON file from `/apps/n8n-workflows/`
5. Update production-specific settings:
   - API keys (use Railway credentials)
   - Webhook URLs (use Railway URLs)
   - Database connections (use Railway PostgreSQL)
6. Activate the workflow

---

## Webhook Configuration

### Webhook URL Structure

**Production**:
```
https://n8n-production-d194.up.railway.app/webhook/<workflow-path>
```

**Local**:
```
http://localhost:5678/webhook/<workflow-path>
```

### Security Considerations

**Public Webhooks** (no authentication):
- Use for testing only
- Anyone with the URL can trigger the workflow

**Secured Webhooks** (recommended for production):
1. Add "HTTP Request" node with header authentication
2. Check for custom header: `X-Webhook-Secret: <secret-value>`
3. Store secret in Railway environment variables
4. Return 401 Unauthorized if header missing/invalid

**Example Secure Webhook**:
```javascript
// In webhook workflow, add "IF" node after webhook trigger
// Expression: {{ $('Webhook').item.json.headers['x-webhook-secret'] === 'your-secret-here' }}
// True branch: Continue workflow
// False branch: Return 401 error
```

---

## Planned Workflows (Epic 2+)

### 1. Job Scraping Workflows

**Frequency**: Every 4 hours

**Sources**:
- Remote OK
- We Work Remotely
- Himalayas
- YC Jobs
- Wellfound

**Process**:
1. HTTP Request to scrape job board API
2. Transform data to standard format
3. Insert new jobs into PostgreSQL
4. Trigger AI enrichment for new jobs

### 2. AI Enrichment Workflow

**Trigger**: Webhook from job scraper or frontend

**Process**:
1. Receive job ID via webhook
2. Fetch job details from PostgreSQL
3. Call OpenAI API for:
   - Metadata extraction
   - Semantic embedding generation
4. Update job record with AI data

### 3. Email Monitoring Workflow

**Frequency**: Every 5 minutes

**Process**:
1. Connect to IMAP (Gmail)
2. Fetch new emails
3. Parse application responses
4. Update application status in PostgreSQL
5. Send Telegram notification if important

### 4. Interview Preparation Workflow

**Trigger**: Google Calendar webhook (interview scheduled)

**Process**:
1. Receive calendar event
2. Fetch job and company details
3. Generate interview prep materials with AI
4. Send via Telegram

### 5. Global Error Handler

**Trigger**: Webhook from any failed workflow

**Process**:
1. Log error to PostgreSQL
2. Format error message
3. Send Telegram alert
4. Optionally retry failed workflow

---

## Testing Workflows

### Manual Testing

**In n8n UI**:
1. Click "Test Workflow" button
2. Workflow waits for trigger
3. Call webhook or trigger event
4. View execution results in real-time
5. Inspect node outputs in right panel

**View Execution History**:
1. Click "Executions" in left sidebar
2. View list of all workflow runs
3. Click execution to see detailed logs
4. Debug failed executions

### Automated Testing

**Webhook Testing**:
```bash
# Test production webhook
curl https://n8n-production-d194.up.railway.app/webhook/<path>

# Test local webhook
curl http://localhost:5678/webhook/<path>
```

**Expected Response**:
- 200 OK with JSON response
- Verify data in execution history
- Check database for created/updated records

---

## Workflow Examples

### Hello World Workflow

**File**: `/apps/n8n-workflows/hello-world.json`

**Purpose**: Test deployment and webhook functionality

**Nodes**:
1. **Webhook Trigger** (GET `/test-webhook`)
2. **HTTP Request** (fetch GitHub Zen quote)
3. **Respond to Webhook** (return JSON)

**Response**:
```json
{
  "message": "Hello World",
  "github_zen": "Design for failure.",
  "timestamp": "2025-10-27T00:00:00.000Z"
}
```

**Test**:
```bash
curl https://n8n-production-d194.up.railway.app/webhook/35717a52-bdbb-4f82-bb4d-a4f46f3360c4
```

---

## Monitoring and Debugging

### Check Workflow Status

**In n8n Dashboard**:
- Green toggle = Active
- Grey toggle = Inactive
- Error icon = Last execution failed

### View Logs

**Railway Logs**:
```bash
# In Railway dashboard:
# 1. Click on n8n service
# 2. Go to "Deployments" tab
# 3. Click "View Logs"
```

**Local Logs**:
```bash
npm run dev:infra:logs n8n
```

### Common Issues

**Workflow not triggering**:
- Check workflow is activated (toggle ON)
- Verify webhook URL is correct
- Check execution history for errors

**Database connection errors**:
- Verify PostgreSQL environment variables
- Check PostgreSQL service is running
- Test connection from n8n logs

**Webhook returns 404**:
- Workflow must be active for production webhooks
- Check webhook path in URL
- Verify "Respond" parameter set correctly

---

## Performance Considerations

**Resource Requirements**:
- n8n requires ~512MB RAM minimum
- PostgreSQL connection pooling handled automatically
- Workflow execution history stored for 7 days (configurable)

**Webhook Response Times**:
- Simple workflows: <500ms
- AI enrichment: 2-5 seconds (OpenAI API call)
- Job scraping: 10-30 seconds (external API calls)

**Scaling**:
- n8n can handle 100+ concurrent workflow executions
- For higher loads, consider:
  - Increasing Railway service resources
  - Using workflow queuing
  - Splitting workflows into smaller chunks

---

## Backup and Recovery

### Backup Workflows

**Automatic** (Git):
- All workflows exported to `/apps/n8n-workflows/`
- Committed to version control
- Can be restored by importing JSON files

**Manual** (Database):
- PostgreSQL `n8n_workflow` table contains all workflows
- Railway provides automatic daily database backups
- Retain backups for 7 days on free tier

### Restore Workflows

**From Git**:
1. Navigate to `/apps/n8n-workflows/`
2. Find workflow JSON file
3. Import into n8n via "Import from File"

**From Database Backup**:
1. Restore PostgreSQL from Railway backup
2. Restart n8n service
3. Workflows automatically loaded from database

---

## Security Best Practices

- ✅ Use strong passwords for n8n basic auth
- ✅ Store all secrets in Railway environment variables
- ✅ Never commit credentials to git
- ✅ Use webhook authentication for production workflows
- ✅ Regularly rotate API keys and passwords
- ✅ Monitor execution logs for suspicious activity
- ✅ Limit n8n access to authorized team members only

---

## Additional Resources

- **n8n Documentation**: https://docs.n8n.io
- **n8n Community**: https://community.n8n.io
- **Workflow Templates**: https://n8n.io/workflows
- **Railway n8n Guide**: https://docs.railway.app/guides/n8n

---
