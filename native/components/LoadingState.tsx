import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { colors, fonts, spacing, typography } from "@/lib/theme";

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
    backgroundColor: colors.background,
  },
  label: {
    ...typography.bodyStrong,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
});
