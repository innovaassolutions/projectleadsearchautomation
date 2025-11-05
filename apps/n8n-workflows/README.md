# n8n Workflows

This directory contains n8n workflow definitions that can be deployed programmatically via the n8n API.

## Setup

### 1. Get n8n API Key

1. Start local n8n: `npm run dev:infra`
2. Open n8n UI: http://localhost:5678
3. Log in with credentials from `.env.local`
4. Go to **Settings** > **API** > **Create API Key**
5. Copy the generated API key

### 2. Add API Key to Environment

Add to your `.env.local`:

```bash
N8N_API_KEY=n8n_api_xxxxxxxxxxxxx
```

## Deploy Workflows

### Automated Deployment (GitHub Actions)

**Production workflows are automatically deployed to Railway n8n when pushed to main:**

1. Edit workflow JSON in `apps/n8n-workflows/`
2. Commit and push to `main` branch
3. GitHub Actions automatically deploys to Railway n8n
4. Manually activate workflow in n8n UI (if needed)

**GitHub Actions will trigger on:**
- Any changes to `apps/n8n-workflows/*.json`
- Push to `main` branch

### Manual Deployment (Local)

**Deploy Remote OK Scraper:**

```bash
npm run deploy:remote-ok
```

**Deploy Any Workflow:**

```bash
npm run deploy:workflow -- apps/n8n-workflows/your-workflow.json
```

**Dry-run mode (test without deploying):**

```bash
npm run deploy:n8n:dry-run
```

## Available Workflows

### remote-ok-scraper.json

**Purpose:** Scrapes jobs from Remote OK API daily and stores in PostgreSQL

**Schedule:** Daily at 9:00 AM UTC (cron: `0 9 * * *`)

**Features:**
- Fetches jobs from https://remoteok.com/api
- Transforms data to match database schema
- Deduplicates by URL
- Batch processing (10 jobs at a time)
- Error handling with 3x retry
- Logs statistics

**Database Requirements:**
- Table: `jobs`
- PostgreSQL credentials configured in n8n

**Manual Testing:**
1. Deploy workflow: `npm run deploy:remote-ok`
2. Open n8n UI: http://localhost:5678
3. Find "Remote OK Job Scraper" workflow
4. Click **Execute Workflow** (manual trigger)
5. Check execution results
6. Verify jobs in database:
   ```bash
   docker-compose exec postgres psql -U postgres -d jobapp
   SELECT COUNT(*) FROM jobs WHERE source = 'remote_ok';
   ```

**Activate Scheduled Runs:**
1. Open workflow in n8n UI
2. Toggle **Active** switch in top right
3. Workflow will run daily at 9:00 AM UTC

## PostgreSQL Credentials Setup

Before deploying workflows, configure PostgreSQL credentials in n8n:

1. Open n8n UI: http://localhost:5678
2. Go to **Credentials** > **New**
3. Select **Postgres**
4. Name: `Local PostgreSQL`
5. Configure:
   - Host: `postgres` (Docker network) or `localhost`
   - Database: `jobapp`
   - User: `postgres`
   - Password: `localdev123`
   - Port: `5432` (inside Docker) or `5434` (from host)
6. **Test Connection** and **Save**

## Troubleshooting

### API Key Issues

**Error:** `N8N_API_KEY environment variable not set`

**Fix:** Add `N8N_API_KEY` to `.env.local` or GitHub Secrets

**Error:** `Failed to fetch workflows: Unauthorized`

**Fix:** Regenerate API key in n8n UI (Settings > API) and update environment variable

### Connection Refused

**Error:** `Failed to connect to n8n`

**Fix:** Ensure n8n is running: `npm run dev:infra`

### Workflow Already Exists

The deployment script automatically updates existing workflows by name.

### Workflow Activation

**Warning:** `Could not auto-activate workflow (Method Not Allowed)`

**Fix:** Some n8n versions don't support API-based activation. Manually activate in n8n UI:
1. Open n8n UI
2. Navigate to deployed workflow
3. Toggle the **Active** switch in the top-right corner

### PostgreSQL Credentials

**Warning:** `Failed to configure PostgreSQL credential: Method Not Allowed`

**Fix:** Some n8n versions don't support API-based credential management. Manually configure in n8n UI:
1. Go to **Credentials** > **New**
2. Select **Postgres**
3. Name: `Railway PostgreSQL` (or update workflow JSON to match your credential name)
4. Configure connection details from Railway environment variables

## Development

### Create New Workflow

1. Build workflow visually in n8n UI
2. Export workflow JSON (Settings > Export)
3. Save to `apps/n8n-workflows/your-workflow.json`
4. Deploy via API: `npm run deploy:workflow -- apps/n8n-workflows/your-workflow.json`

### Workflow JSON Structure

All n8n workflows follow this structure:

```json
{
  "name": "Workflow Name",
  "nodes": [
    {
      "parameters": { /* node config */ },
      "type": "n8n-nodes-base.nodeName",
      "position": [x, y],
      "id": "unique-id",
      "name": "Node Name"
    }
  ],
  "connections": {
    "Node Name": {
      "main": [[{ "node": "Next Node", "type": "main", "index": 0 }]]
    }
  },
  "active": false,
  "settings": { "executionOrder": "v1" }
}
```

## Resources

- **n8n Docs:** https://docs.n8n.io/
- **n8n API Docs:** https://docs.n8n.io/api/
- **Remote OK API:** https://remoteok.com/api
