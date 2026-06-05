// Arokia Design Tokens — Color System
// Reference: wellness app design (warm cream + golden yellow + coral + teal)
// Used by NativeWind via tailwind.config.js theme extension

export const colors = {
  // ─── Backgrounds ───────────────────────────────────────────────
  // Warm cream app background — the "canvas" behind all screens
  background: '#F5EFE6',
  // Pure white card surface
  surface: '#FFFFFF',
  // Soft cream secondary card (e.g. yellow program header, featured banners)
  surfaceWarm: '#FDF8EC',

  // ─── Brand / Primary ───────────────────────────────────────────
  // Golden yellow — The Word, CTA buttons, selected dates, progress rings
  primary: '#F0C040',
  primaryLight: '#F8E08A',
  primaryDark: '#C89A20',

  // ─── Secondary / Active ────────────────────────────────────────
  // Coral-salmon — active tab, heart/favourite, urgent states
  secondary: '#E07058',
  secondaryLight: '#ECA090',
  secondaryDark: '#B84A38',

  // ─── Tertiary / Practice ───────────────────────────────────────
  // Soft teal-sage — Soul practice path, mood circles, Lectio Divina
  tertiary: '#A8C8C4',
  tertiaryLight: '#C8E0DC',
  tertiaryDark: '#709898',

  // ─── Text ──────────────────────────────────────────────────────
  // Warm near-black — headings, primary body text
  textPrimary: '#1C1917',
  // Warm gray — secondary body text, labels
  textSecondary: '#57534E',
  // Muted warm gray — captions, placeholders, inactive tabs
  textMuted: '#A8A29E',
  // White — text on dark card images, on primary buttons
  textOnDark: '#FFFFFF',
  textOnPrimary: '#1C1917', // dark text on golden button (better contrast)

  // ─── UI Chrome ─────────────────────────────────────────────────
  // Tab bar and nav backgrounds
  navBackground: '#FFFFFF',
  // Dividers, subtle borders
  border: '#E8E0D8',
  borderLight: '#F0EAE2',
  // Inactive tab icon
  iconInactive: '#A8A29E',
  // Active tab icon — coral
  iconActive: '#E07058',

  // ─── Practice Path Colors (Mind / Body / Soul) ─────────────────
  // Used to tint path cards and navigation items
  pathMind: '#F0C040', // golden — intellect, clarity
  pathBody: '#E07058', // coral — movement, vitality
  pathSoul: '#A8C8C4', // teal — stillness, spirit

  // ─── Semantic ──────────────────────────────────────────────────
  success: '#6BAF7A',
  error: '#D05050',
  warning: '#E8A040',
  offline: '#A8A29E',

  // ─── Overlay / Shadow ──────────────────────────────────────────
  // Dark gradient overlay for card images (bottom portion)
  cardOverlay: 'rgba(28, 25, 23, 0.50)',
  cardOverlayLight: 'rgba(28, 25, 23, 0.25)',
} as const;

export type ColorKey = keyof typeof colors;
