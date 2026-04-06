import { StyleSheet, Text, View } from "react-native";

import { AppCard } from "@/components/AppCard";
import { AppButton } from "@/components/AppButton";
import { colors, spacing } from "@/lib/theme";

type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function EmptyState({ icon, title, description, actionLabel, onActionPress }: EmptyStateProps) {
  return (
    <AppCard style={styles.card}>
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
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  description: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 20,
  },
});
