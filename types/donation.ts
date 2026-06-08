export interface Donation {
  id: string;
  amountPaise: number;
  status: 'pending' | 'confirmed' | 'failed' | 'refunded';
  donorEmail: string | null;
  razorpayPaymentId: string;
  receivedAt: string;
}

export interface AllocationEntry {
  id: string;
  donationId: string;
  bucket: 'operations' | 'pay_forward';
  amountPaise: number;
  createdAt: string;
}

export interface Disbursement {
  id: string;
  beneficiaryId: string;
  amountPaise: number;
  paidAt: string | null;
  reference: string | null;
  createdAt: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  quarter: string;
  active: boolean;
}

export interface DonationSummary {
  totalDonatedPaise: number;
  confirmedCount: number;
}

export interface PayForwardSummary {
  totalPayForwardPaise: number;
  totalDisbursedPaise: number;
  netAvailablePaise: number;
}
