#!/usr/bin/env node

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('❌ DATABASE_URL environment variable not set');
    console.error('   Set it in .env.local or pass it directly:');
    console.error('   DATABASE_URL=<url> npm run migrate --workspace=packages/database');
    process.exit(1);
  }

  console.log('🔌 Connecting to database...');
  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('✓ Connected to database\n');

    const migrationsDir = path.join(__dirname, '../migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql') && !f.endsWith('.down.sql'))
      .sort();

    if (files.length === 0) {
      console.log('⚠️  No migration files found in migrations/');
      return;
    }

    console.log(`Found ${files.length} migration(s):\n`);

    for (const file of files) {
      console.log(`📄 Running migration: ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

      try {
        await client.query(sql);
        console.log(`✓ ${file} applied successfully\n`);
      } catch (error) {
        console.error(`❌ Error applying ${file}:`);
        console.error(`   ${error.message}`);
        throw error;
      }
    }

    console.log('✨ All migrations completed successfully!');
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
