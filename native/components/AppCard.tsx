import { Pressable, StyleSheet, View, type PressableProps, type ViewProps } from "react-native";

import { colors, radii, shadows, spacing } from "@/lib/theme";

type AppCardProps = {
  children: React.ReactNode;
  pressable?: boolean;
  variant?: "default" | "muted" | "outlined" | "image" | "glass";
  padding?: number;
} & Pick<PressableProps, "onPress"> &
  ViewProps;

export function AppCard({ children, pressable, onPress, style, variant = "default", padding = spacing.md }: AppCardProps) {
  const cardStyle = [styles.card, variantStyles[variant], { padding }, style];

  if (pressable) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [cardStyle, pressed && styles.pressed]}>
        {children}
      </Pressable>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: "rgba(217, 231, 239, 0.95)",
    ...shadows.card,
  },
  pressed: {
    opacity: 0.96,
    transform: [{ scale: 0.995 }],
  },
});

const variantStyles = StyleSheet.create({
  default: {
    backgroundColor: colors.surface,
  },
  muted: {
    backgroundColor: colors.surfaceMuted,
    ...shadows.soft,
  },
  outlined: {
    backgroundColor: "rgba(255,255,255,0.74)",
    borderColor: colors.border,
  },
  image: {
    backgroundColor: colors.surface,
    overflow: "hidden",
    ...shadows.image,
  },
  glass: {
    backgroundColor: "rgba(255,255,255,0.82)",
    borderColor: "rgba(255,255,255,0.65)",
    ...shadows.floating,
  },
});
