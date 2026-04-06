import { StyleSheet, Text, View } from "react-native";

import { AppCard } from "@/components/AppCard";
import { colors, spacing } from "@/lib/theme";

export function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <AppCard style={styles.card}>
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
    fontSize: 24,
    fontWeight: "800",
    color: colors.primaryDark,
  },
  label: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
