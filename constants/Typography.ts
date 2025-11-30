import { Platform, TextStyle } from 'react-native';

// Uber Move typography configuration
// Using the official Uber Move font family

export const Typography = {
  // Font families - Uber Move font
  // Font families - Using System fonts as fallback since custom fonts are disabled
  fontFamily: {
    regular: Platform.OS === 'ios' ? 'System' : 'Roboto',
    medium: Platform.OS === 'ios' ? 'System' : 'Roboto',
    bold: Platform.OS === 'ios' ? 'System' : 'Roboto',
    light: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },

  // Default font family (fallback to system if fonts not loaded)
  fontFamilyDefault: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),

  // Font weights
  weights: {
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semibold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
  },

  // Letter spacing (Uber uses tight spacing)
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },

  // Text styles matching Uber's design system
  styles: {
    // Large display text
    display: {
      fontSize: 48,
      fontFamily: 'UberMove-Bold',
      letterSpacing: -0.5,
      lineHeight: 56,
    },
    // Headings
    h1: {
      fontSize: 32,
      fontFamily: 'UberMove-Bold',
      letterSpacing: -0.3,
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontFamily: 'UberMove-Bold',
      letterSpacing: -0.2,
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontFamily: 'UberMove-Regular', // Using Regular until Medium is available
      fontWeight: '600' as TextStyle['fontWeight'],
      letterSpacing: -0.1,
      lineHeight: 28,
    },
    h4: {
      fontSize: 18,
      fontFamily: 'UberMove-Regular', // Using Regular until Medium is available
      fontWeight: '600' as TextStyle['fontWeight'],
      letterSpacing: 0,
      lineHeight: 24,
    },
    // Body text
    body: {
      fontSize: 16,
      fontFamily: 'UberMove-Regular',
      letterSpacing: 0,
      lineHeight: 24,
    },
    bodyMedium: {
      fontSize: 16,
      fontFamily: 'UberMove-Regular', // Using Regular until Medium is available
      fontWeight: '500' as TextStyle['fontWeight'],
      letterSpacing: 0,
      lineHeight: 24,
    },
    bodySemibold: {
      fontSize: 16,
      fontFamily: 'UberMove-Bold', // Using Bold for semibold
      letterSpacing: 0.2,
      lineHeight: 24,
    },
    // Small text
    small: {
      fontSize: 14,
      fontFamily: 'UberMove-Regular',
      letterSpacing: 0.1,
      lineHeight: 20,
    },
    smallMedium: {
      fontSize: 14,
      fontFamily: 'UberMove-Regular', // Using Regular until Medium is available
      fontWeight: '500' as TextStyle['fontWeight'],
      letterSpacing: 0.2,
      lineHeight: 20,
    },
    // Caption text
    caption: {
      fontSize: 12,
      fontFamily: 'UberMove-Regular',
      letterSpacing: 0.2,
      lineHeight: 16,
    },
    captionMedium: {
      fontSize: 12,
      fontFamily: 'UberMove-Regular', // Using Regular until Medium is available
      fontWeight: '500' as TextStyle['fontWeight'],
      letterSpacing: 0.3,
      lineHeight: 16,
    },
    // Tab labels
    tabLabel: {
      fontSize: 11,
      fontFamily: 'UberMove-Regular', // Using Regular until Medium is available
      fontWeight: '500' as TextStyle['fontWeight'],
      letterSpacing: 0.2,
      lineHeight: 14,
    },
    tabLabelActive: {
      fontSize: 11,
      fontFamily: 'UberMove-Regular', // Using Regular until Medium is available
      fontWeight: '600' as TextStyle['fontWeight'],
      letterSpacing: 0.3,
      lineHeight: 14,
    },
  },
};

export default Typography;

