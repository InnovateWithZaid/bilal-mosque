import { StyleSheet, Text, View } from "react-native";

import { AppCard } from "@/components/AppCard";
import { AppButton } from "@/components/AppButton";
import { colors, fonts, radii, spacing, typography } from "@/lib/theme";

type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function EmptyState({ icon, title, description, actionLabel, onActionPress }: EmptyStateProps) {
  return (
    <AppCard variant="glass" style={styles.card}>
      <View style={styles.icon}>{icon}</View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {actionLabel && onActionPress ? <AppButton label={actionLabel} onPress={onActionPress} /> : null}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.title2,
    textAlign: "center",
  },
  description: {
    ...typography.body,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    textAlign: "center",
  },
});
