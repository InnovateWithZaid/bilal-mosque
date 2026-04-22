import { Platform, type TextStyle, type ViewStyle } from "react-native";

export const colors = {
  background: "#F6FBFF",
  backgroundAccent: "#EDF7FC",
  surface: "#FFFFFF",
  surfaceMuted: "#ECF6FB",
  surfaceRaised: "#F9FCFF",
  primary: "#3AAED8",
  primaryDark: "#0E5A72",
  secondary: "#6EC4DD",
  accent: "#C8A45A",
  text: "#16313F",
  textMuted: "#6B8290",
  border: "#D9E7EF",
  success: "#1C8A63",
  warning: "#B5842F",
  danger: "#C6544F",
  overlay: "rgba(12, 47, 61, 0.08)",
  white: "#FFFFFF",
  black: "#000000",
} as const;

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 36,
} as const;

export const radii = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 32,
  pill: 999,
} as const;

export const fonts = {
  regular: "PlusJakartaSans_400Regular",
  medium: "PlusJakartaSans_500Medium",
  semiBold: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold",
  extraBold: "PlusJakartaSans_800ExtraBold",
} as const;

export const typography = {
  display: {
    fontFamily: fonts.extraBold,
    fontSize: 32,
    letterSpacing: -1,
    color: colors.text,
  } satisfies TextStyle,
  title1: {
    fontFamily: fonts.bold,
    fontSize: 24,
    letterSpacing: -0.6,
    color: colors.text,
  } satisfies TextStyle,
  title2: {
    fontFamily: fonts.bold,
    fontSize: 20,
    letterSpacing: -0.3,
    color: colors.text,
  } satisfies TextStyle,
  title3: {
    fontFamily: fonts.semiBold,
    fontSize: 17,
    color: colors.text,
  } satisfies TextStyle,
  body: {
    fontFamily: fonts.regular,
    fontSize: 15,
    lineHeight: 23,
    color: colors.textMuted,
  } satisfies TextStyle,
  bodyStrong: {
    fontFamily: fonts.medium,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  } satisfies TextStyle,
  label: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    letterSpacing: 0.4,
    color: colors.textMuted,
  } satisfies TextStyle,
  meta: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textMuted,
  } satisfies TextStyle,
  number: {
    fontFamily: fonts.bold,
    fontVariant: ["tabular-nums"],
    color: colors.text,
  } satisfies TextStyle,
};

export const shadows = {
  card: {
    boxShadow: "0px 20px 50px rgba(22, 49, 63, 0.08)",
  } satisfies ViewStyle,
  soft: {
    boxShadow: "0px 10px 24px rgba(25, 61, 78, 0.06)",
  } satisfies ViewStyle,
  floating: {
    boxShadow: "0px 24px 60px rgba(14, 90, 114, 0.14)",
  } satisfies ViewStyle,
  image: {
    boxShadow: "0px 18px 42px rgba(10, 53, 73, 0.18)",
  } satisfies ViewStyle,
};

export const gradients = {
  page: ["#F6FBFF", "#EEF7FC", "#F9FCFF"] as const,
  hero: ["rgba(255,255,255,0.02)", "rgba(9,52,69,0.54)"] as const,
  heroStrong: ["rgba(10,35,49,0.04)", "rgba(10,35,49,0.78)"] as const,
  sky: ["#DDF4FF", "#A7D7EF"] as const,
  prayer: ["#4DB6DF", "#1D89B1", "#0E5A72"] as const,
};

export const screen = {
  paddingHorizontal: 18,
  maxWidth: 620,
};

export const hitSlop = {
  top: 10,
  right: 10,
  bottom: 10,
  left: 10,
};

export const statusBarStyle = Platform.OS === "ios" ? "dark" : "auto";
