#!/usr/bin/env node

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration002() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('❌ DATABASE_URL environment variable not set');
    process.exit(1);
  }

  console.log('🔌 Connecting to database...');
  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('✓ Connected to database\n');

    const migrationFile = path.join(__dirname, '../migrations/002_postgrest_roles.sql');
    const sql = fs.readFileSync(migrationFile, 'utf8');

    console.log('📄 Running migration: 002_postgrest_roles.sql');
    await client.query(sql);
    console.log('✓ Migration 002 applied successfully\n');

    // Verify roles were created
    const rolesResult = await client.query(`
      SELECT rolname, rolcanlogin
      FROM pg_roles
      WHERE rolname IN ('web_anon', 'authenticated')
      ORDER BY rolname;
    `);

    console.log('✅ Roles created:');
    rolesResult.rows.forEach(row => {
      console.log(`   - ${row.rolname} (can login: ${row.rolcanlogin})`);
    });

    // Verify RLS status
    const rlsResult = await client.query(`
      SELECT tablename, rowsecurity
      FROM pg_tables
      WHERE schemaname = 'public' AND rowsecurity = true
      ORDER BY tablename;
    `);

    console.log('\n✅ RLS enabled on tables:');
    rlsResult.rows.forEach(row => {
      console.log(`   - ${row.tablename}`);
    });

    console.log('\n✨ Migration 002 completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration002();
