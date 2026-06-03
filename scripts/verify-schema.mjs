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

// AC3 — RLS: anon must NOT see draft rows (requires service role to seed a draft row)
console.log('\nAC3: RLS hides non-published rows from anon');
if (!admin) {
  warn('AC3 deep test skipped — add SUPABASE_SERVICE_ROLE_KEY to .env.local for full verification');
} else {
  const { data: draft, error: insertDraftErr } = await admin
    .from('content_items')
    .insert({
      practice_path: 'mind',
      product_pillar: 'word',
      content_type: 'quote',
      language_code: 'ta',
      verse_reference: 'Matthew 11:28',
      scripture_text: 'வருத்தப்பட்டவர்களே',
      review_status: 'draft',
    })
    .select('id')
    .single();

  if (insertDraftErr) {
    fail('AC3 seed draft row', insertDraftErr.message);
  } else {
    const { data: anonRows, error: anonErr } = await anon.from('content_items').select('id');
    if (anonErr) fail('AC3 anon SELECT', anonErr.message);
    else if (anonRows.length === 0) ok('AC3 — anon SELECT returns 0 rows for draft content (RLS active)');
    else fail('AC3', `Expected 0 rows but got ${anonRows.length} — RLS policy may be broken`);

    await admin.from('content_items').delete().eq('id', draft.id);
  }
}

// AC4 — theological_concerns: anon INSERT succeeds, anon SELECT returns 0 rows
console.log('\nAC4: theological_concerns anon INSERT/SELECT policy');
const { error: tcInsertErr } = await anon
  .from('theological_concerns')
  .insert({ description: 'Verification test concern (auto-deleted)' });

if (tcInsertErr) fail('AC4 INSERT', tcInsertErr.message);
else ok('AC4 — anon INSERT into theological_concerns succeeded');

const { data: tcRows, error: tcSelectErr } = await anon.from('theological_concerns').select('id');
if (tcSelectErr) fail('AC4 SELECT error', tcSelectErr.message);
else if (tcRows.length === 0) ok('AC4 — anon SELECT returns 0 rows (no SELECT policy for anon)');
else fail('AC4 SELECT', `Expected 0 rows but got ${tcRows.length} — anon SELECT policy too permissive`);

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
  console.warn('         Manually delete from theological_concerns and analytics_events if needed');
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
