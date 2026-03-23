#!/usr/bin/env node
/**
 * upload-summary.js
 *
 * Uploads results/summary.json to Supabase Storage so the QA dashboard
 * can fetch it from a public URL without needing a separate API.
 *
 * Environment variables (set in CI secrets or qa/.env):
 *   SUPABASE_URL              — e.g. https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY — service role key (write access)
 *   QA_RESULTS_BUCKET         — bucket name (default: qa-results)
 *
 * Usage:
 *   node scripts/upload-summary.js
 */

const fs   = require('fs');
const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const SUMMARY_FILE = path.resolve(__dirname, '../results/summary.json');
const BUCKET       = process.env.QA_RESULTS_BUCKET ?? 'qa-results';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.warn('[upload] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set — skipping upload');
  process.exit(0);
}

if (!fs.existsSync(SUMMARY_FILE)) {
  console.error('[upload] summary.json not found — run aggregate-results.js first');
  process.exit(1);
}

const summaryData = fs.readFileSync(SUMMARY_FILE);

async function upload() {
  // Use Supabase Storage REST API directly (no SDK dep)
  const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/summary.json`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'x-upsert': 'true',
    },
    body: summaryData,
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`[upload] Failed: ${res.status} ${text}`);
    process.exit(1);
  }

  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/summary.json`;
  console.log(`[upload] ✓ summary.json uploaded`);
  console.log(`  Public URL: ${publicUrl}`);
  console.log(`  Set VITE_SUMMARY_URL=${publicUrl} in the QA dashboard deploy`);
}

upload().catch((e) => { console.error('[upload] Error:', e.message); process.exit(1); });
