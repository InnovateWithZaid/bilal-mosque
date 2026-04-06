import { Pressable, StyleSheet, View, type PressableProps, type ViewProps } from "react-native";

import { colors, radii, shadows, spacing } from "@/lib/theme";

type AppCardProps = {
  children: React.ReactNode;
  pressable?: boolean;
} & Pick<PressableProps, "onPress"> &
  ViewProps;

export function AppCard({ children, pressable, onPress, style }: AppCardProps) {
  if (pressable) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed, style]}>
        {children}
      </Pressable>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  pressed: {
    opacity: 0.94,
  },
});
