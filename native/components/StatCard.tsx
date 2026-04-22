import { StyleSheet, Text, View } from "react-native";

import { AppCard } from "@/components/AppCard";
import { colors, fonts, spacing, typography } from "@/lib/theme";

export function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <AppCard variant="glass" style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: "center",
    gap: spacing.xs,
  },
  value: {
    ...typography.number,
    fontFamily: fonts.extraBold,
    fontSize: 30,
    color: colors.primaryDark,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 12,
    letterSpacing: 0.5,
    color: colors.textMuted,
    textTransform: "uppercase",
  },
});
