import { Platform, type ViewStyle } from "react-native";

export const colors = {
  background: "#F4F7F7",
  surface: "#FFFFFF",
  surfaceMuted: "#ECF2F2",
  primary: "#0F9D9F",
  primaryDark: "#0B7B7D",
  secondary: "#16686A",
  accent: "#D3A84B",
  text: "#17212B",
  textMuted: "#667480",
  border: "#D7E2E2",
  success: "#15803D",
  warning: "#B7791F",
  danger: "#C2410C",
  overlay: "rgba(23, 33, 43, 0.08)",
  white: "#FFFFFF",
  black: "#000000",
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const radii = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
};

export const shadows = {
  card: {
    shadowColor: "#0A2230",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  } satisfies ViewStyle,
  strong: {
    shadowColor: "#0A2230",
    shadowOpacity: 0.14,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  } satisfies ViewStyle,
};

export const screen = {
  paddingHorizontal: spacing.md,
  maxWidth: 560,
};

export const hitSlop = {
  top: 10,
  right: 10,
  bottom: 10,
  left: 10,
};

export const statusBarStyle = Platform.OS === "ios" ? "dark" : "auto";
