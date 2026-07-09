import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// NON-NULL config message when the app was built without its backend keys. We do NOT throw at import
// here on purpose: a throw during module evaluation kills the JS bundle before any React error
// boundary can mount, which surfaces on a release build only as a silent "app keeps stopping" with
// no message. Instead we expose the problem as data, and app/_layout.tsx renders a visible
// "configuration missing" screen (the config gate) so the failure is legible on a real device.
export const supabaseConfigError: string | null =
  !supabaseUrl || !supabaseAnonKey
    ? 'Backend configuration is missing from this build (EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY were not set at build time).'
    : null;

// Fall back to harmless placeholders so createClient never throws at import. When config is missing,
// supabaseConfigError is set and the app shows the config screen instead of ever calling this.
export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.invalid',
  supabaseAnonKey ?? 'placeholder-anon-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
