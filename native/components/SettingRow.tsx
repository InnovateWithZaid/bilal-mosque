import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { ChevronRight } from "lucide-react-native";

import { AppCard } from "@/components/AppCard";
import { colors, fonts, radii, spacing, typography } from "@/lib/theme";

type SettingRowProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  onPress?: () => void;
  chevron?: boolean;
  switchValue?: boolean;
  onToggle?: (value: boolean) => void;
};

export function SettingRow({ icon, title, description, onPress, chevron, switchValue, onToggle }: SettingRowProps) {
  const content = (
    <View style={styles.row}>
      <View style={styles.iconWrap}>{icon}</View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      {typeof switchValue === "boolean" && onToggle ? (
        <Switch value={switchValue} onValueChange={onToggle} trackColor={{ true: colors.primary }} />
      ) : chevron ? (
        <ChevronRight color={colors.textMuted} size={18} />
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <AppCard pressable onPress={onPress} variant="outlined">
        {content}
      </AppCard>
    );
  }

  return <AppCard variant="outlined">{content}</AppCard>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  title: {
    ...typography.title3,
  },
  description: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 19,
  },
});
