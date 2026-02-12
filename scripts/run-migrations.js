/**
 * Run all Supabase migrations in order against DATABASE_URL from .env.
 * Usage: node scripts/run-migrations.js
 * Requires: npm install pg dotenv (or run from project root with npx)
 */
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const migrationsDir = join(root, 'supabase', 'migrations');

// Parse .env
function loadEnv() {
  try {
    const envPath = join(root, '.env');
    const content = readFileSync(envPath, 'utf8');
    const vars = {};
    for (const line of content.split('\n')) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) vars[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
    }
    return vars;
  } catch (e) {
    console.error('No .env found. Set DATABASE_URL in .env');
    process.exit(1);
  }
}

const env = loadEnv();
const databaseUrl = env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL not set in .env');
  process.exit(1);
}

async function main() {
  let pg;
  try {
    pg = await import('pg');
  } catch {
    console.error('Install pg: npm install pg');
    process.exit(1);
  }
  const client = new pg.default.Client({ connectionString: databaseUrl });
  try {
    await client.connect();
  } catch (e) {
    console.error('Cannot connect to database:', e.message);
    process.exit(1);
  }

  const files = readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();
  console.log(`Running ${files.length} migrations on ${new URL(databaseUrl).hostname}...`);
  for (const file of files) {
    const path = join(migrationsDir, file);
    const sql = readFileSync(path, 'utf8');
    try {
      await client.query(sql);
      console.log('  OK', file);
    } catch (e) {
      console.error('  FAIL', file, e.message);
      await client.end();
      process.exit(1);
    }
  }
  await client.end();
  console.log('Done.');
}

main();
