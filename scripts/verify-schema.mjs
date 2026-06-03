/**
 * Story 1.2 schema verification script.
 * Run: node --env-file=.env.local scripts/verify-schema.mjs
 *
 * AC3 deep RLS test requires SUPABASE_SERVICE_ROLE_KEY in .env.local.
 * Without it, AC3 logs a warning and skips. All other ACs run with the anon key.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('FAIL: Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const clientOpts = { auth: { persistSession: false, autoRefreshToken: false } };
const anon = createClient(supabaseUrl, supabaseAnonKey, clientOpts);
const admin = serviceRoleKey ? createClient(supabaseUrl, serviceRoleKey, clientOpts) : null;

let passed = 0;
let failed = 0;

function ok(label) { console.log(`  ✅ PASS  ${label}`); passed++; }
function fail(label, detail) { console.error(`  ❌ FAIL  ${label}: ${detail}`); failed++; }
function warn(label) { console.warn(`  ⚠️  SKIP  ${label}`); }

console.log('\n🔍 Story 1.2 — Schema Verification\n');

// AC5 — Connection test
console.log('AC5: Connection from lib/supabase.ts credentials');
const { error: connError } = await anon.from('content_items').select('id').limit(1);
if (connError) fail('AC5 connection', connError.message);
else ok('AC5 — connection successful, content_items reachable');

// AC3 — RLS: anon must NOT see draft rows, MUST see published rows
// Tests both negative and positive cases using targeted ID queries so pre-existing
// rows in the DB cannot cause false failures or false passes.
console.log('\nAC3: RLS hides non-published rows / shows published rows to anon');
if (!admin) {
  warn('AC3 deep test skipped — add SUPABASE_SERVICE_ROLE_KEY to .env.local for full verification');
} else {
  const baseItem = {
    practice_path: 'mind',
    product_pillar: 'word',
    content_type: 'quote',
    language_code: 'ta',
    verse_reference: 'Matthew 11:28',
    scripture_text: 'வருத்தப்பட்டவர்களே',
  };

  const { data: draftRow, error: draftInsertErr } = await admin
    .from('content_items')
    .insert({ ...baseItem, review_status: 'draft' })
    .select('id')
    .single();

  const { data: pubRow, error: pubInsertErr } = await admin
    .from('content_items')
    .insert({ ...baseItem, review_status: 'published', published_at: new Date().toISOString() })
    .select('id')
    .single();

  if (draftInsertErr) fail('AC3 seed draft row', draftInsertErr.message);
  if (pubInsertErr) fail('AC3 seed published row', pubInsertErr.message);

  if (!draftInsertErr && !pubInsertErr) {
    // Negative case: draft row must NOT be visible to anon
    const { data: draftCheck, error: draftCheckErr } = await anon
      .from('content_items').select('id').eq('id', draftRow.id).maybeSingle();
    if (draftCheckErr) fail('AC3 draft visibility', draftCheckErr.message);
    else if (draftCheck === null) ok('AC3 — draft row hidden from anon client (RLS active)');
    else fail('AC3', 'Draft row is visible to anon — review_status filter not enforced');

    // Positive case: published row MUST be visible to anon
    const { data: pubCheck, error: pubCheckErr } = await anon
      .from('content_items').select('id').eq('id', pubRow.id).maybeSingle();
    if (pubCheckErr) fail('AC3 published visibility', pubCheckErr.message);
    else if (pubCheck !== null) ok('AC3 — published row visible to anon client (positive case confirmed)');
    else fail('AC3', 'Published row NOT visible to anon — RLS policy may be too restrictive');
  }

  // Cleanup seeded rows by ID (best-effort)
  if (draftRow) await admin.from('content_items').delete().eq('id', draftRow.id);
  if (pubRow) await admin.from('content_items').delete().eq('id', pubRow.id);
}

// AC4 — theological_concerns: anon INSERT succeeds, anon SELECT returns 0 rows
console.log('\nAC4: theological_concerns anon INSERT/SELECT policy');
const { error: tcInsertErr } = await anon
  .from('theological_concerns')
  .insert({ description: 'Verification test concern (auto-deleted)' });

if (tcInsertErr) fail('AC4 INSERT', tcInsertErr.message);
else ok('AC4 — anon INSERT into theological_concerns succeeded');

const { data: tcRows, error: tcSelectErr } = await anon.from('theological_concerns').select('id').limit(1);
if (tcSelectErr) fail('AC4 SELECT error', tcSelectErr.message);
else if (tcRows.length === 0) ok('AC4 — anon SELECT returns 0 rows (no SELECT policy for anon)');
else fail('AC4 SELECT', `Expected 0 rows visible to anon but got ${tcRows.length}+ — SELECT policy too permissive`);

// analytics_events — anon INSERT should succeed
console.log('\nAC4b: analytics_events anon INSERT policy');
const { error: analyticsErr } = await anon
  .from('analytics_events')
  .insert({ install_id: 'verify-script-test', event_type: 'vow_completed' });

if (analyticsErr) fail('analytics_events INSERT', analyticsErr.message);
else ok('analytics_events — anon INSERT succeeded');

// AC6 — cleanup test data (requires service role)
console.log('\nCleanup: removing test rows');
if (!admin) {
  warn('Cleanup skipped — add SUPABASE_SERVICE_ROLE_KEY to .env.local to auto-delete test rows');
  console.warn('  Run in Supabase SQL Editor to clean up manually:');
  console.warn("    DELETE FROM theological_concerns WHERE description = 'Verification test concern (auto-deleted)';");
  console.warn("    DELETE FROM analytics_events WHERE install_id = 'verify-script-test';");
} else {
  const { error: tcCleanErr } = await admin
    .from('theological_concerns')
    .delete()
    .eq('description', 'Verification test concern (auto-deleted)');
  if (tcCleanErr) fail('cleanup theological_concerns', tcCleanErr.message);
  else ok('cleanup — theological_concerns test row deleted');

  const { error: aeCleanErr } = await admin
    .from('analytics_events')
    .delete()
    .eq('install_id', 'verify-script-test');
  if (aeCleanErr) fail('cleanup analytics_events', aeCleanErr.message);
  else ok('cleanup — analytics_events test row deleted');
}

console.log(`\n─────────────────────────────────────────`);
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
