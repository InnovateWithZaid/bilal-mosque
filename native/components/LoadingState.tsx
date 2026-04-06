import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "@/lib/theme";

export function LoadingState({ label = "Loading Bilal..." }: { label?: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.primary} size="large" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    padding: spacing.xl,
  },
  label: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
