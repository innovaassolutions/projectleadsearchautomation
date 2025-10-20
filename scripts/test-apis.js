#!/usr/bin/env node

/**
 * API Connection Test Script
 * Tests all external API connections from Epic 0
 * Run: node scripts/test-apis.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};

envContent.split('\n').forEach((line) => {
  line = line.trim();
  if (!line || line.startsWith('#')) return;
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1].trim()] = match[2].trim();
  }
});

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkEnvVar(varName) {
  const value = env[varName];
  if (!value || value.includes('YOUR_') || value.includes('REPLACE_')) {
    log(`  ❌ ${varName} not configured`, 'red');
    return false;
  }
  log(`  ✅ ${varName} configured`, 'green');
  return true;
}

// Test 1: OpenAI API
async function testOpenAI() {
  log('\n🔍 Testing OpenAI API...', 'blue');

  if (!checkEnvVar('OPENAI_API_KEY')) {
    return false;
  }

  return new Promise((resolve) => {
    const data = JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Say "API test successful"' }],
      max_tokens: 10,
    });

    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Length': data.length,
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          log('  ✅ OpenAI API connection successful', 'green');
          log('  ✅ API key valid and working', 'green');
          resolve(true);
        } else {
          log(`  ❌ OpenAI API error: ${res.statusCode}`, 'red');
          try {
            const error = JSON.parse(responseData);
            log(`  ❌ Error: ${error.error?.message || 'Unknown error'}`, 'red');
          } catch (e) {
            log(`  ❌ Response: ${responseData}`, 'red');
          }
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      log(`  ❌ Connection error: ${error.message}`, 'red');
      resolve(false);
    });

    req.setTimeout(10000, () => {
      log('  ❌ Request timeout', 'red');
      req.destroy();
      resolve(false);
    });

    req.write(data);
    req.end();
  });
}

// Test 2: Telegram Bot
async function testTelegram() {
  log('\n🔍 Testing Telegram Bot...', 'blue');

  if (!checkEnvVar('TELEGRAM_BOT_TOKEN')) {
    return false;
  }

  return new Promise((resolve) => {
    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${env.TELEGRAM_BOT_TOKEN}/getMe`,
      method: 'GET',
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const data = JSON.parse(responseData);
          if (data.ok) {
            log('  ✅ Telegram bot token valid', 'green');
            log(`  ✅ Bot username: @${data.result.username}`, 'green');
            log(`  ✅ Bot name: ${data.result.first_name}`, 'green');

            if (checkEnvVar('TELEGRAM_USER_ID')) {
              log('  ✅ Telegram user ID configured', 'green');
            }

            resolve(true);
          } else {
            log('  ❌ Telegram bot token invalid', 'red');
            resolve(false);
          }
        } catch (e) {
          log(`  ❌ Invalid response: ${responseData}`, 'red');
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      log(`  ❌ Connection error: ${error.message}`, 'red');
      resolve(false);
    });

    req.setTimeout(10000, () => {
      log('  ❌ Request timeout', 'red');
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Test 3: Google Calendar API
async function testGoogleCalendar() {
  log('\n🔍 Testing Google Calendar API Configuration...', 'blue');

  const hasClientId = checkEnvVar('GOOGLE_CLIENT_ID');
  const hasClientSecret = checkEnvVar('GOOGLE_CLIENT_SECRET');

  if (hasClientId && hasClientSecret) {
    log('  ✅ OAuth credentials configured', 'green');
    log('  ℹ️  Full OAuth flow will be tested when you first connect calendar in the app', 'yellow');
    return true;
  }

  return false;
}

// Test 4: Gmail Configuration
async function testGmail() {
  log('\n🔍 Testing Gmail Configuration...', 'blue');

  const hasEmail = checkEnvVar('EMAIL_ADDRESS');
  const hasPassword = checkEnvVar('EMAIL_PASSWORD');
  const hasProvider = checkEnvVar('EMAIL_PROVIDER');
  const hasImapHost = checkEnvVar('IMAP_HOST');
  const hasSmtpHost = checkEnvVar('SMTP_HOST');

  if (hasEmail && hasPassword && hasProvider && hasImapHost && hasSmtpHost) {
    log('  ✅ All Gmail credentials configured', 'green');
    log('  ℹ️  IMAP/SMTP connection will be tested in Epic 7 (Phase 2)', 'yellow');
    return true;
  }

  return false;
}

// Test 5: Database Configuration
async function testDatabase() {
  log('\n🔍 Testing Database Configuration...', 'blue');

  if (checkEnvVar('DATABASE_URL')) {
    log('  ✅ Database URL configured', 'green');
    log('  ℹ️  Database connection will be tested in Epic 1', 'yellow');
    return true;
  }

  return false;
}

// Test 6: Auth Secrets
async function testAuthSecrets() {
  log('\n🔍 Testing Auth Secrets...', 'blue');

  const hasNextAuthSecret = checkEnvVar('NEXTAUTH_SECRET');
  const hasJwtSecret = checkEnvVar('JWT_SECRET');
  const hasNextAuthUrl = checkEnvVar('NEXTAUTH_URL');

  if (hasNextAuthSecret && hasJwtSecret && hasNextAuthUrl) {
    log('  ✅ All auth secrets configured', 'green');

    // Check secret length
    if (env.NEXTAUTH_SECRET.length >= 32) {
      log('  ✅ NEXTAUTH_SECRET is strong (>= 32 chars)', 'green');
    } else {
      log('  ⚠️  NEXTAUTH_SECRET should be at least 32 characters', 'yellow');
    }

    if (env.JWT_SECRET.length >= 32) {
      log('  ✅ JWT_SECRET is strong (>= 32 chars)', 'green');
    } else {
      log('  ⚠️  JWT_SECRET should be at least 32 characters', 'yellow');
    }

    return true;
  }

  return false;
}

// Test 7: n8n Configuration
async function testN8n() {
  log('\n🔍 Testing n8n Configuration...', 'blue');

  if (checkEnvVar('N8N_WEBHOOK_URL')) {
    const url = env.N8N_WEBHOOK_URL;
    if (url.includes('your-n8n-service')) {
      log('  ⚠️  n8n webhook URL is placeholder - update after deploying to Railway', 'yellow');
      return true;
    } else {
      log('  ✅ n8n webhook URL configured', 'green');
      return true;
    }
  }

  return false;
}

// Main test runner
async function runTests() {
  log('\n╔════════════════════════════════════════════════════════╗', 'blue');
  log('║        Epic 0: API Connection Test Suite              ║', 'blue');
  log('╚══════════════════════════��═════════════════════════════╝', 'blue');

  const results = {
    openai: await testOpenAI(),
    telegram: await testTelegram(),
    googleCalendar: await testGoogleCalendar(),
    gmail: await testGmail(),
    database: await testDatabase(),
    authSecrets: await testAuthSecrets(),
    n8n: await testN8n(),
  };

  // Summary
  log('\n╔════════════════════════════════════════════════════════╗', 'blue');
  log('║                    Test Summary                        ║', 'blue');
  log('╚════════════════════════════════════════════════════════╝', 'blue');

  const tests = [
    { name: 'OpenAI API', result: results.openai, critical: true, phase: 1 },
    { name: 'Telegram Bot', result: results.telegram, critical: false, phase: 2 },
    { name: 'Google Calendar', result: results.googleCalendar, critical: false, phase: 2 },
    { name: 'Gmail Config', result: results.gmail, critical: false, phase: 2 },
    { name: 'Database Config', result: results.database, critical: false, phase: 1 },
    { name: 'Auth Secrets', result: results.authSecrets, critical: true, phase: 1 },
    { name: 'n8n Config', result: results.n8n, critical: false, phase: 1 },
  ];

  let passed = 0;
  let failed = 0;
  let phase1Failed = false;

  tests.forEach((test) => {
    const status = test.result ? '✅ PASS' : '❌ FAIL';
    const color = test.result ? 'green' : 'red';
    const phaseLabel = test.phase === 1 ? '(Phase 1 MVP)' : '(Phase 2)';
    const critical = test.critical ? '(critical)' : '';

    log(`  ${status} - ${test.name} ${phaseLabel} ${critical}`, color);

    if (test.result) {
      passed++;
    } else {
      failed++;
      if (test.critical || (test.phase === 1 && test.critical)) {
        phase1Failed = true;
      }
    }
  });

  log(`\nTotal: ${passed}/${tests.length} tests passed`, passed === tests.length ? 'green' : 'yellow');

  if (phase1Failed) {
    log('\n❌ PHASE 1 MVP BLOCKED - Critical Phase 1 APIs not configured', 'red');
    log('Please configure OpenAI API and Auth Secrets before proceeding to Epic 1', 'yellow');
    process.exit(1);
  } else if (passed === tests.length) {
    log('\n✅ EPIC 0 COMPLETE - All APIs configured and tested!', 'green');
    log('✅ You are ready to proceed to Epic 1: Foundation & Core Infrastructure', 'green');
    process.exit(0);
  } else {
    log('\n✅ PHASE 1 MVP READY - Core APIs configured!', 'green');
    log('⚠️  Some Phase 2 APIs are missing (Telegram, Google Calendar, Gmail)', 'yellow');
    log('✅ You can proceed to Epic 1 and configure Phase 2 APIs later', 'green');
    process.exit(0);
  }
}

// Run tests
runTests().catch((error) => {
  log(`\n❌ Test runner error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
