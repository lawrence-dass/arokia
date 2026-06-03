// Arokia design tokens — JS-side access.
// Keep in sync with tailwind.config.js (same keys, same values).
// tailwind.config.js is the Tailwind source; this file is for StyleSheet / inline style use.

import { colors } from './colors';

export const arokiaTheme = {
  colors: {
    background: colors.background,
    surface: colors.surface,
    'surface-warm': colors.surfaceWarm,

    primary: colors.primary,
    'primary-light': colors.primaryLight,
    'primary-dark': colors.primaryDark,

    secondary: colors.secondary,
    'secondary-light': colors.secondaryLight,
    'secondary-dark': colors.secondaryDark,

    tertiary: colors.tertiary,
    'tertiary-light': colors.tertiaryLight,
    'tertiary-dark': colors.tertiaryDark,

    'text-primary': colors.textPrimary,
    'text-secondary': colors.textSecondary,
    'text-muted': colors.textMuted,
    'text-on-dark': colors.textOnDark,
    'text-on-primary': colors.textOnPrimary,

    border: colors.border,
    'border-light': colors.borderLight,
    'icon-inactive': colors.iconInactive,
    'icon-active': colors.iconActive,
    'nav-background': colors.navBackground,

    'path-mind': colors.pathMind,
    'path-body': colors.pathBody,
    'path-soul': colors.pathSoul,

    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    offline: colors.offline,

    'card-overlay': colors.cardOverlay,
    'card-overlay-light': colors.cardOverlayLight,
  },
  borderRadius: {
    card: '20px',
    pill: '9999px',
    modal: '28px',
  },
  fontFamily: {
    // System Tamil font — NFR-I3: no custom Tamil font bundled
    // iOS: system Tamil (San Francisco fallback handles Latin)
    // Android: Noto Sans Tamil (pre-installed on Android 7+)
    sans: ['System', 'ui-sans-serif'],
  },
  spacing: {
    screen: '20px',
    card: '16px',
    'card-lg': '24px',
  },
} as const;
