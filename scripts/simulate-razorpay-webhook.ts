import { createClient } from '@supabase/supabase-js';

interface Args {
  amountPaise: number;
  paymentId: string;
  execute: boolean;
}

function usage(): never {
  console.error(
    [
      'Usage:',
      '  node --env-file=.env.local --loader tsx scripts/simulate-razorpay-webhook.ts --payment-id pay_test_123 --amount-paise 10000 [--execute]',
      '',
      'Without --execute, this is a dry run and does not write to Supabase.',
    ].join('\n')
  );
  process.exit(2);
}

function parseArgs(): Args {
  const args = process.argv.slice(2);
  let amountPaise: number | null = null;
  let paymentId = '';
  let execute = false;

  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--amount-paise') {
      const value = Number(args[i + 1]);
      if (!Number.isInteger(value) || value <= 0) usage();
      amountPaise = value;
      i += 1;
    } else if (args[i] === '--payment-id') {
      paymentId = args[i + 1] ?? '';
      if (!paymentId) usage();
      i += 1;
    } else if (args[i] === '--execute') {
      execute = true;
    } else {
      usage();
    }
  }

  if (amountPaise === null || !paymentId) usage();
  return { amountPaise, paymentId, execute };
}

async function main() {
  const { amountPaise, paymentId, execute } = parseArgs();
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const payload = {
    amount_paise: amountPaise,
    status: 'confirmed',
    razorpay_payment_id: paymentId,
  };

  if (!execute) {
    console.log(JSON.stringify({ ok: true, mode: 'dry-run', payload }, null, 2));
    return;
  }

  if (!supabaseUrl || !serviceRoleKey) {
    console.error(
      JSON.stringify(
        {
          ok: false,
          error: 'MISSING_ENV',
          required: ['EXPO_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'],
        },
        null,
        2
      )
    );
    process.exit(1);
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await admin
    .from('donations')
    .insert(payload)
    .select('id,status')
    .single();

  if (error) {
    console.error(JSON.stringify({ ok: false, error: error.message, payload }, null, 2));
    process.exit(1);
  }

  console.log(JSON.stringify({ ok: true, mode: 'execute', donation: data }, null, 2));
}

main().catch((error: unknown) => {
  console.error(JSON.stringify({ ok: false, error: String(error) }, null, 2));
  process.exit(1);
});
