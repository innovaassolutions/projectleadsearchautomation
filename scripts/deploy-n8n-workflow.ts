#!/usr/bin/env node

/**
 * Deploy n8n workflows via API with PostgreSQL credential configuration
 *
 * Usage:
 *   npm run deploy:n8n                    # Deploy all workflows
 *   npm run deploy:n8n:dry-run            # Dry-run (no actual deployment)
 *   npm run deploy:workflow -- <file>     # Deploy single workflow
 *
 * Environment Variables:
 *   N8N_API_KEY                 - n8n API authentication key (required)
 *   RAILWAY_N8N_URL             - Railway n8n instance URL (required for production)
 *   N8N_URL                     - n8n URL (fallback for local development)
 *   RAILWAY_POSTGRES_HOST       - PostgreSQL hostname
 *   RAILWAY_POSTGRES_DB         - PostgreSQL database name
 *   RAILWAY_POSTGRES_USER       - PostgreSQL username
 *   RAILWAY_POSTGRES_PASSWORD   - PostgreSQL password
 */

import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: path.resolve(process.cwd(), '.env.local') });

interface N8nWorkflow {
  name: string;
  nodes: any[];
  connections: any;
  active: boolean;
  settings?: any;
  [key: string]: any;
}

interface N8nApiResponse {
  id?: string;
  name?: string;
  message?: string;
}

interface N8nCredential {
  id?: string;
  name: string;
  type: string;
  data?: any;
}

interface DeploymentResult {
  workflow: string;
  status: 'success' | 'failed';
  action: 'created' | 'updated' | 'skipped';
  id?: string;
  error?: string;
}

// Support both RAILWAY_N8N_URL (production) and N8N_URL (local)
const N8N_URL = process.env.RAILWAY_N8N_URL || process.env.N8N_URL || 'http://localhost:5678';
const N8N_API_KEY = process.env.N8N_API_KEY;

// PostgreSQL configuration for credential setup
const POSTGRES_CONFIG = {
  host: process.env.RAILWAY_POSTGRES_HOST || 'localhost',
  database: process.env.RAILWAY_POSTGRES_DB || 'jobapp',
  user: process.env.RAILWAY_POSTGRES_USER || 'postgres',
  password: process.env.RAILWAY_POSTGRES_PASSWORD || '',
};

// Parse CLI flags
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const nonFlagArgs = args.filter((arg) => !arg.startsWith('--'));
const DEPLOY_ALL = args.includes('--all') || nonFlagArgs.length === 0;

/**
 * Activate a workflow
 */
async function activateWorkflow(workflowId: string): Promise<void> {
  if (DRY_RUN) {
    console.log(`🔍 [DRY-RUN] Would activate workflow: ${workflowId}`);
    return;
  }

  const response = await fetch(`${N8N_URL}/api/v1/workflows/${workflowId}`, {
    method: 'PATCH',
    headers: {
      'X-N8N-API-KEY': N8N_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ active: true }),
  });

  if (!response.ok) {
    throw new Error(`Failed to activate workflow: ${response.statusText}`);
  }
}

/**
 * Deploy a single workflow file
 */
async function deployWorkflowFile(workflowPath: string): Promise<DeploymentResult> {
  const fileName = path.basename(workflowPath);

  try {
    const resolvedPath = path.resolve(process.cwd(), workflowPath);

    if (!fs.existsSync(resolvedPath)) {
      return {
        workflow: fileName,
        status: 'failed',
        action: 'skipped',
        error: 'File not found',
      };
    }

    const workflowData: N8nWorkflow = JSON.parse(
      fs.readFileSync(resolvedPath, 'utf-8')
    );

    console.log(`\n📝 Deploying: ${workflowData.name}`);

    if (DRY_RUN) {
      console.log(`🔍 [DRY-RUN] Would deploy workflow: ${workflowData.name}`);
      return {
        workflow: workflowData.name,
        status: 'success',
        action: 'skipped',
      };
    }

    // Check if workflow already exists by name
    const existingWorkflow = await findWorkflowByName(workflowData.name);

    let workflowId: string;
    let action: 'created' | 'updated';

    if (existingWorkflow && existingWorkflow.id) {
      console.log(`🔄 Updating existing workflow (ID: ${existingWorkflow.id})`);
      await updateWorkflow(existingWorkflow.id, workflowData);
      workflowId = existingWorkflow.id;
      action = 'updated';
    } else {
      console.log(`🆕 Creating new workflow`);
      const response = await createWorkflow(workflowData);
      workflowId = response.id!;
      action = 'created';
    }

    // Activate the workflow
    console.log(`⚡ Activating workflow...`);
    await activateWorkflow(workflowId);

    console.log(`✅ Workflow ${action} and activated successfully!`);
    console.log(`   ID: ${workflowId}`);

    return {
      workflow: workflowData.name,
      status: 'success',
      action,
      id: workflowId,
    };

  } catch (error: any) {
    console.error(`❌ Failed to deploy ${fileName}: ${error.message}`);
    return {
      workflow: fileName,
      status: 'failed',
      action: 'skipped',
      error: error.message,
    };
  }
}

/**
 * Deploy all workflows in the n8n-workflows directory
 */
async function deployAllWorkflows(): Promise<void> {
  console.log('🚀 n8n Workflow Deployment');
  console.log('='.repeat(50));
  console.log(`🔗 n8n URL: ${N8N_URL}`);
  console.log(`📁 Workflows Directory: apps/n8n-workflows/`);

  if (DRY_RUN) {
    console.log(`🔍 DRY-RUN MODE: No actual changes will be made`);
  }

  console.log('='.repeat(50));

  if (!N8N_API_KEY) {
    console.error('\n❌ Error: N8N_API_KEY environment variable not set');
    console.error('   Set it in .env.local or GitHub Secrets');
    process.exit(1);
  }

  // Configure PostgreSQL credential first
  console.log('\n🗄️  Configuring PostgreSQL credential...');
  await configurePostgresCredential();

  // Find all workflow JSON files
  const workflowsDir = path.resolve(process.cwd(), 'apps/n8n-workflows');

  if (!fs.existsSync(workflowsDir)) {
    console.error(`\n❌ Error: Workflows directory not found: ${workflowsDir}`);
    process.exit(1);
  }

  const workflowFiles = fs
    .readdirSync(workflowsDir)
    .filter((file) => file.endsWith('.json') && file !== 'package.json')
    .map((file) => path.join(workflowsDir, file));

  if (workflowFiles.length === 0) {
    console.log('\n⚠️  No workflow files found to deploy');
    return;
  }

  console.log(`\n📦 Found ${workflowFiles.length} workflow(s) to deploy`);

  // Deploy each workflow
  const results: DeploymentResult[] = [];
  for (const workflowFile of workflowFiles) {
    const result = await deployWorkflowFile(workflowFile);
    results.push(result);
  }

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Deployment Summary');
  console.log('='.repeat(50));

  const successful = results.filter((r) => r.status === 'success');
  const failed = results.filter((r) => r.status === 'failed');

  console.log(`\n✅ Successful: ${successful.length}`);
  successful.forEach((r) => {
    console.log(`   - ${r.workflow} (${r.action})`);
  });

  if (failed.length > 0) {
    console.log(`\n❌ Failed: ${failed.length}`);
    failed.forEach((r) => {
      console.log(`   - ${r.workflow}: ${r.error}`);
    });
  }

  console.log(`\n🌐 Access n8n UI: ${N8N_URL}`);

  if (failed.length > 0) {
    process.exit(1);
  }
}

/**
 * Legacy single workflow deployment (for backward compatibility)
 */
async function deployWorkflow(workflowPath: string): Promise<void> {
  console.log('🚀 n8n Workflow Deployment');
  console.log('='.repeat(50));
  console.log(`🔗 n8n URL: ${N8N_URL}`);
  console.log('='.repeat(50));

  if (!N8N_API_KEY) {
    console.error('\n❌ Error: N8N_API_KEY environment variable not set');
    console.error('   Set it in .env.local: N8N_API_KEY=your-api-key');
    process.exit(1);
  }

  const result = await deployWorkflowFile(workflowPath);

  if (result.status === 'failed') {
    console.error(`\n❌ Deployment failed: ${result.error}`);
    process.exit(1);
  }

  console.log(`\n🌐 Access n8n UI: ${N8N_URL}`);
}

/**
 * Configure or update PostgreSQL credential in n8n
 */
async function configurePostgresCredential(): Promise<string | null> {
  if (DRY_RUN) {
    console.log('🔍 [DRY-RUN] Would configure PostgreSQL credential: Railway PostgreSQL');
    return 'dry-run-credential-id';
  }

  try {
    // Check if credential already exists
    const existingCred = await findCredentialByName('Railway PostgreSQL');

    const credentialData = {
      name: 'Railway PostgreSQL',
      type: 'postgres',
      data: {
        host: POSTGRES_CONFIG.host,
        database: POSTGRES_CONFIG.database,
        user: POSTGRES_CONFIG.user,
        password: POSTGRES_CONFIG.password,
        port: 5432,
        ssl: false,
      },
    };

    if (existingCred && existingCred.id) {
      console.log(`🔄 Updating existing PostgreSQL credential (ID: ${existingCred.id})`);
      await updateCredential(existingCred.id, credentialData);
      return existingCred.id;
    } else {
      console.log('🆕 Creating new PostgreSQL credential');
      const response = await createCredential(credentialData);
      return response.id || null;
    }
  } catch (error: any) {
    console.warn(`⚠️  Failed to configure PostgreSQL credential: ${error.message}`);
    console.warn('   Workflows may need manual credential configuration');
    return null;
  }
}

async function findCredentialByName(name: string): Promise<N8nCredential | null> {
  const response = await fetch(`${N8N_URL}/api/v1/credentials`, {
    method: 'GET',
    headers: {
      'X-N8N-API-KEY': N8N_API_KEY!,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch credentials: ${response.statusText}`);
  }

  const credentials = await response.json() as { data: N8nCredential[] };
  return credentials.data.find((c) => c.name === name) || null;
}

async function createCredential(credential: Omit<N8nCredential, 'id'>): Promise<N8nCredential> {
  const response = await fetch(`${N8N_URL}/api/v1/credentials`, {
    method: 'POST',
    headers: {
      'X-N8N-API-KEY': N8N_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credential),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create credential: ${response.statusText} - ${JSON.stringify(errorData)}`);
  }

  return await response.json() as N8nCredential;
}

async function updateCredential(credentialId: string, credential: Omit<N8nCredential, 'id'>): Promise<N8nCredential> {
  const response = await fetch(`${N8N_URL}/api/v1/credentials/${credentialId}`, {
    method: 'PATCH',
    headers: {
      'X-N8N-API-KEY': N8N_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credential),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to update credential: ${response.statusText} - ${JSON.stringify(errorData)}`);
  }

  return await response.json() as N8nCredential;
}

async function findWorkflowByName(name: string): Promise<N8nApiResponse | null> {
  const response = await fetch(`${N8N_URL}/api/v1/workflows`, {
    method: 'GET',
    headers: {
      'X-N8N-API-KEY': N8N_API_KEY!,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch workflows: ${response.statusText}`);
  }

  const workflows = await response.json() as { data: N8nApiResponse[] };

  return workflows.data.find((w) => w.name === name) || null;
}

async function createWorkflow(workflow: N8nWorkflow): Promise<N8nApiResponse> {
  // Remove read-only fields that can't be set via API
  const { id, versionId, meta, tags, active, ...workflowData } = workflow;

  const response = await fetch(`${N8N_URL}/api/v1/workflows`, {
    method: 'POST',
    headers: {
      'X-N8N-API-KEY': N8N_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workflowData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to create workflow: ${response.statusText} - ${JSON.stringify(errorData)}`);
  }

  return await response.json() as N8nApiResponse;
}

async function updateWorkflow(
  workflowId: string,
  workflow: N8nWorkflow
): Promise<N8nApiResponse> {
  // Remove read-only fields that can't be set via API
  const { id, versionId, meta, tags, active, ...workflowData } = workflow;

  const response = await fetch(`${N8N_URL}/api/v1/workflows/${workflowId}`, {
    method: 'PUT',
    headers: {
      'X-N8N-API-KEY': N8N_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workflowData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to update workflow: ${response.statusText} - ${JSON.stringify(errorData)}`);
  }

  return await response.json() as N8nApiResponse;
}

// Main execution
if (DEPLOY_ALL) {
  // Deploy all workflows in directory
  deployAllWorkflows();
} else {
  // Deploy single workflow (backward compatibility)
  const workflowFile = args.find((arg) => !arg.startsWith('--'));

  if (!workflowFile) {
    console.error('❌ Error: No workflow file specified');
    console.error('\nUsage:');
    console.error('  npm run deploy:n8n                    # Deploy all workflows');
    console.error('  npm run deploy:n8n:dry-run            # Dry-run mode');
    console.error('  npm run deploy:workflow -- <file>     # Deploy single workflow');
    console.error('\nExample:');
    console.error('  npm run deploy:workflow -- apps/n8n-workflows/remote-ok-scraper.json');
    process.exit(1);
  }

  deployWorkflow(workflowFile);
}
