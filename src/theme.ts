export const theme = {
  colors: {
    // Primary brand: Fresh Emerald & Mint
    primary: "#0F4C3A",
    primaryLight: "#16644F",
    primaryMuted: "#E7F4EE",
    primarySoft: "#F0F8F4",
    accent: "#10B981",
    accentGlow: "rgba(16, 185, 129, 0.15)",
    
    // Warm & functional accents
    orange: "#F97316",
    orangeLight: "#FFF7ED",
    blue: "#3B82F6",
    blueLight: "#EFF6FF",
    purple: "#8B5CF6",
    purpleLight: "#F5F3FF",
    red: "#EF4444",
    redLight: "#FEF2F2",
    gold: "#F59E0B",
    goldLight: "#FEFCE8",

    // Surfaces & backgrounds
    background: "#F4F6F4",
    appBackground: "#EAEEEA", // desktop outer background
    card: "#FFFFFF",
    cardElevated: "#FFFFFF",
    overlay: "rgba(15, 23, 42, 0.55)",

    // Typography
    textPrimary: "#0F241D",
    textSecondary: "#4A6156",
    textMuted: "#879C92",
    textInverse: "#FFFFFF",

    // Borders & dividers
    border: "#E2E9E4",
    borderLight: "#EEF3EF",
    borderFocus: "#10B981",
  },
  shadows: {
    sm: {
      shadowColor: "#0F241D",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: "#0F241D",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 4,
    },
    lg: {
      shadowColor: "#0F241D",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
      elevation: 8,
    },
    glow: {
      shadowColor: "#10B981",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 5,
    },
  },
  radius: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 22,
    xl: 28,
    full: 9999,
  },
};
