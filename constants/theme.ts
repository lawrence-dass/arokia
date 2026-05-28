// Arokia NativeWind Theme Extension
// Merge into tailwind.config.js → theme.extend after scaffold:
//
//   const { arokiaTheme } = require('./constants/theme');
//   module.exports = { theme: { extend: arokiaTheme }, ... };

import { colors } from './colors';

export const arokiaTheme = {
  colors: {
    // Semantic aliases — use these in className, not raw hex
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

    'path-mind': colors.pathMind,
    'path-body': colors.pathBody,
    'path-soul': colors.pathSoul,

    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    offline: colors.offline,
  },
  borderRadius: {
    // Card rounding — matches the reference design's generous curves
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
    // Consistent screen padding from the reference layout
    screen: '20px',
    card: '16px',
    cardLg: '24px',
  },
} as const;
