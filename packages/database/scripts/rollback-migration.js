#!/usr/bin/env node

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function rollbackMigration(migrationNumber) {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('❌ DATABASE_URL environment variable not set');
    console.error('   Set it in .env.local or pass it directly:');
    console.error('   DATABASE_URL=<url> npm run migrate:down --workspace=packages/database -- 001');
    process.exit(1);
  }

  console.log('🔌 Connecting to database...');
  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('✓ Connected to database\n');

    const migrationsDir = path.join(__dirname, '../migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.startsWith(migrationNumber) && f.endsWith('.down.sql'))
      .sort();

    if (files.length === 0) {
      console.error(`❌ No rollback file found for migration ${migrationNumber}`);
      console.error(`   Expected: ${migrationNumber}_*.down.sql`);
      process.exit(1);
    }

    const file = files[0];
    console.log(`🔄 Rolling back migration: ${file}`);
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

    await client.query(sql);
    console.log('✓ Rollback completed successfully');
  } catch (error) {
    console.error('\n❌ Rollback failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

const migrationNumber = process.argv[2] || '001';
rollbackMigration(migrationNumber);
