import { Pressable, StyleSheet, Text } from "react-native";

import { colors, radii, spacing } from "@/lib/theme";

type ChipProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

export function Chip({ label, active, onPress }: ChipProps) {
  return (
    <Pressable onPress={onPress} style={[styles.base, active ? styles.active : styles.inactive]}>
      <Text style={[styles.text, active ? styles.activeText : styles.inactiveText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderWidth: 1,
  },
  active: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  inactive: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  text: {
    fontSize: 13,
    fontWeight: "700",
  },
  activeText: {
    color: colors.white,
  },
  inactiveText: {
    color: colors.textMuted,
  },
});
