import { supabase } from '@/lib/supabase';
import type { Disbursement, DonationSummary, PayForwardSummary } from '@/types';

interface DisbursementRow {
  id: string;
  beneficiary_id: string;
  amount_paise: number;
  paid_at: string | null;
  reference: string | null;
  created_at: string;
}

function transformDisbursement(row: DisbursementRow): Disbursement {
  return {
    id: row.id,
    beneficiaryId: row.beneficiary_id,
    amountPaise: row.amount_paise,
    paidAt: row.paid_at,
    reference: row.reference,
    createdAt: row.created_at,
  };
}

export async function getDonationSummary(): Promise<DonationSummary> {
  const { data, error } = await supabase.from('donations').select('amount_paise, status');

  if (error) {
    console.error('[donations] getDonationSummary error:', error);
    throw error;
  }

  const confirmed = ((data ?? []) as { amount_paise: number; status: string }[]).filter(
    (r) => r.status === 'confirmed'
  );

  return {
    totalDonatedPaise: confirmed.reduce((sum, r) => sum + r.amount_paise, 0),
    confirmedCount: confirmed.length,
  };
}

export async function getPayForwardSummary(): Promise<PayForwardSummary> {
  const { data: alloc, error: allocError } = await supabase
    .from('allocation_entries')
    .select('amount_paise, bucket');

  if (allocError) {
    console.error('[donations] getPayForwardSummary alloc error:', allocError);
    throw allocError;
  }

  const { data: disb, error: disbError } = await supabase
    .from('disbursements')
    .select('amount_paise');

  if (disbError) {
    console.error('[donations] getPayForwardSummary disb error:', disbError);
    throw disbError;
  }

  const totalPayForwardPaise = ((alloc ?? []) as { amount_paise: number; bucket: string }[])
    .filter((r) => r.bucket === 'pay_forward')
    .reduce((sum, r) => sum + r.amount_paise, 0);

  const totalDisbursedPaise = ((disb ?? []) as { amount_paise: number }[]).reduce(
    (sum, r) => sum + r.amount_paise,
    0
  );

  return {
    totalPayForwardPaise,
    totalDisbursedPaise,
    netAvailablePaise: totalPayForwardPaise - totalDisbursedPaise,
  };
}

export async function getDisbursements(): Promise<Disbursement[]> {
  const { data, error } = await supabase.from('disbursements').select('*');

  if (error) {
    console.error('[donations] getDisbursements error:', error);
    throw error;
  }
  return ((data ?? []) as DisbursementRow[]).map(transformDisbursement);
}
