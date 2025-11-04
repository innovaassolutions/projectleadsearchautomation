# n8n Workflow Deployment Automation

This guide explains how to deploy n8n workflows automatically to Railway using GitHub Actions.

## Overview

The deployment system automatically:
- ✅ Deploys n8n workflow JSON files to Railway when pushed to `main` branch
- ✅ Configures PostgreSQL credentials automatically
- ✅ Activates workflows after deployment
- ✅ Provides dry-run testing capability

## Prerequisites

Before setting up automation, ensure you have:

1. **Railway n8n instance** running (deployed in Story 1.8)
2. **n8n API enabled** on Railway instance
3. **GitHub repository** access with admin permissions to add secrets
4. **Railway PostgreSQL** credentials available

---

## Setup Instructions

### Step 1: Enable n8n API on Railway

1. Access Railway n8n instance: https://n8n-production-d194.up.railway.app
2. Login with admin credentials
3. Navigate to: **Settings → API**
4. Toggle **"Enable API"** to ON
5. Click **"Generate API Key"**
6. **Copy the API key** (you'll need it in Step 2)

### Step 2: Configure GitHub Repository Secrets

Add the following secrets to your GitHub repository at:
`https://github.com/innovaassolutions/projectleadsearchautomation/settings/secrets/actions`

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `N8N_API_KEY` | `<generated-in-step-1>` | n8n API authentication key |
| `RAILWAY_N8N_URL` | `https://n8n-production-d194.up.railway.app` | Railway n8n instance URL |
| `RAILWAY_POSTGRES_HOST` | Get from Railway PostgreSQL service | PostgreSQL hostname |
| `RAILWAY_POSTGRES_DB` | `jobapp` | Database name |
| `RAILWAY_POSTGRES_USER` | `postgres` | Database username |
| `RAILWAY_POSTGRES_PASSWORD` | Get from Railway PostgreSQL service | Database password |

**To get Railway PostgreSQL credentials:**
1. Go to Railway dashboard → PostgreSQL service
2. Click "Variables" tab
3. Copy values for: `PGHOST`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`

### Step 3: Verify GitHub Actions Workflow

The GitHub Actions workflow is already created at:
`.github/workflows/deploy-n8n.yml`

It automatically triggers when:
- Files matching `apps/n8n-workflows/*.json` are modified
- Changes are pushed to the `main` branch

---

## Usage

### Deploying Workflows

#### Automatic Deployment (Production)

1. Create or modify workflow JSON in `apps/n8n-workflows/`
2. Commit and push to `main` branch:
   ```bash
   git add apps/n8n-workflows/my-workflow.json
   git commit -m "feat: add my-workflow n8n workflow"
   git push origin main
   ```
3. GitHub Actions automatically deploys to Railway
4. Verify in Railway n8n UI that workflow is active

#### Manual Deployment (Local Testing)

Test deployment locally before pushing:

```bash
# Dry-run (no actual deployment)
npm run deploy:n8n:dry-run

# Deploy all workflows to local/Railway n8n
npm run deploy:n8n

# Deploy single workflow
npm run deploy:workflow -- apps/n8n-workflows/my-workflow.json
```

**Environment Variables for Local Deployment:**

Create `.env.local` with:
```bash
N8N_API_KEY=your-api-key
RAILWAY_N8N_URL=https://n8n-production-d194.up.railway.app
RAILWAY_POSTGRES_HOST=your-postgres-host
RAILWAY_POSTGRES_DB=jobapp
RAILWAY_POSTGRES_USER=postgres
RAILWAY_POSTGRES_PASSWORD=your-postgres-password
```

---

## How It Works

### Deployment Flow

```
Developer → Git Push → GitHub Actions → Deployment Script → Railway n8n
   ↓
main branch
   ↓
apps/n8n-workflows/*.json changed
   ↓
.github/workflows/deploy-n8n.yml triggers
   ↓
scripts/deploy-n8n-workflow.ts runs
   ↓
1. Configure PostgreSQL credential in n8n
2. Read all workflow JSON files
3. For each workflow:
   - Check if exists (by name)
   - Create new or update existing
   - Activate workflow
4. Report deployment status
```

### Deployment Script Features

The `scripts/deploy-n8n-workflow.ts` script:
- ✅ Supports Railway (`RAILWAY_N8N_URL`) and local (`N8N_URL`) n8n instances
- ✅ Auto-configures PostgreSQL credentials (shared across workflows)
- ✅ Creates new workflows or updates existing ones (by name)
- ✅ Activates workflows after deployment
- ✅ Provides dry-run mode for testing
- ✅ Handles errors gracefully with rollback capability
- ✅ Reports deployment status for each workflow

---

## Troubleshooting

### Issue: GitHub Actions Workflow Doesn't Trigger

**Symptoms:**
- Push to main branch with workflow JSON changes
- No GitHub Actions run appears

**Solutions:**
1. Check `.github/workflows/deploy-n8n.yml` exists in repository
2. Verify file path filter matches: `apps/n8n-workflows/*.json`
3. Check GitHub Actions is enabled for repository:
   - Go to repository Settings → Actions → General
   - Ensure "Allow all actions and reusable workflows" is selected

### Issue: Deployment Fails with "401 Unauthorized"

**Symptoms:**
```
❌ Failed to fetch workflows: Unauthorized
```

**Solutions:**
1. Verify `N8N_API_KEY` is correctly set in GitHub Secrets
2. Re-generate API key in Railway n8n (Settings → API)
3. Update GitHub Secret with new API key
4. Verify n8n API is still enabled on Railway

### Issue: PostgreSQL Credential Not Configured

**Symptoms:**
```
⚠️  Failed to configure PostgreSQL credential: ...
   Workflows may need manual credential configuration
```

**Solutions:**
1. Verify all 4 PostgreSQL secrets are set in GitHub:
   - `RAILWAY_POSTGRES_HOST`
   - `RAILWAY_POSTGRES_DB`
   - `RAILWAY_POSTGRES_USER`
   - `RAILWAY_POSTGRES_PASSWORD`
2. Check credentials are correct (test connection from Railway console)
3. Manually create credential in n8n UI if automation fails:
   - Name: `Railway PostgreSQL`
   - Type: `Postgres`
   - Configure with Railway credentials

### Issue: Workflow Deployed But Not Active

**Symptoms:**
- Workflow appears in Railway n8n UI
- Status shows "Inactive"
- Cron trigger not scheduled

**Solutions:**
1. Check deployment logs for activation step:
   ```
   ⚡ Activating workflow...
   ✅ Workflow created and activated successfully!
   ```
2. Manually activate in Railway n8n UI if needed
3. Verify workflow has valid trigger configuration (not just manual trigger)

### Issue: Dry-Run Mode Still Deploys to Railway

**Symptoms:**
- Run `npm run deploy:n8n:dry-run`
- Changes appear in Railway n8n

**Solutions:**
1. Check command includes `--dry-run` flag
2. Verify script output shows: `🔍 DRY-RUN MODE: No actual changes will be made`
3. If still deploying, script may be ignoring flag - check script logic

### Issue: GitHub Actions Fails with Missing Dependencies

**Symptoms:**
```
Error: Cannot find module 'tsx'
```

**Solutions:**
1. Ensure `npm ci` step runs before deployment in workflow
2. Verify `tsx` is listed in `package.json` devDependencies
3. Check `package-lock.json` is committed to repository

---

## Advanced Configuration

### Deploying to Multiple Environments

To support staging and production environments:

1. Create separate GitHub workflows:
   - `.github/workflows/deploy-n8n-staging.yml` (triggers on `staging` branch)
   - `.github/workflows/deploy-n8n-production.yml` (triggers on `main` branch)

2. Add environment-specific secrets:
   - `N8N_API_KEY_STAGING`
   - `RAILWAY_N8N_URL_STAGING`
   - etc.

3. Update workflow to use correct secrets based on environment

### Workflow Versioning

To maintain workflow versions:

1. Add version field to workflow JSON metadata
2. Tag commits with workflow version: `git tag n8n/my-workflow/v1.0.0`
3. Store workflow history in Railway n8n (built-in versioning)

### Rollback Strategy

If deployment breaks an existing workflow:

1. **Automatic Rollback** (recommended):
   - Revert the commit that broke the workflow
   - Push to main - GitHub Actions will redeploy previous version

2. **Manual Rollback**:
   - Access Railway n8n UI
   - Open workflow
   - Click "Workflow History"
   - Restore previous version

---

## Security Considerations

### API Key Management

- ✅ **DO**: Store API keys in GitHub Secrets (encrypted)
- ❌ **DON'T**: Commit API keys to repository (`.env.local` is gitignored)
- ✅ **DO**: Rotate API keys regularly (quarterly recommended)
- ✅ **DO**: Use separate API keys for staging and production

### PostgreSQL Credentials

- ✅ **DO**: Use Railway environment variables (automatically managed)
- ❌ **DON'T**: Hardcode database passwords in workflow JSON
- ✅ **DO**: Use n8n credential system (passwords encrypted at rest)

---

## Monitoring and Alerts

### GitHub Actions Notifications

Enable GitHub notifications for workflow failures:
1. Go to repository Settings → Notifications
2. Enable "Actions" notifications
3. Choose notification method (email, Slack, etc.)

### Railway Logs

Monitor n8n logs in Railway:
```bash
# View recent logs
railway logs --service n8n

# Stream logs in real-time
railway logs --service n8n --follow
```

---

## Support

For issues or questions:
1. Check this troubleshooting guide first
2. Review GitHub Actions workflow logs
3. Check Railway n8n logs
4. Review Story 1.10 implementation details in `docs/stories/`

---

## Related Documentation

- **Story 1.10 Spec**: `docs/stories/story-1.10-n8n-deployment-automation.md`
- **Developer Handoff**: `docs/stories/DEVELOPER-HANDOFF-1.10.md`
- **n8n API Docs**: https://docs.n8n.io/api/
- **GitHub Actions Docs**: https://docs.github.com/en/actions
