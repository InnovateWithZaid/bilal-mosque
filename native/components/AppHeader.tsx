import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useRouter } from "expo-router";

import { colors, fonts, hitSlop, radii, spacing, typography } from "@/lib/theme";

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
};

export function AppHeader({ title, subtitle, showBack, rightAction }: AppHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {showBack ? (
          <Pressable hitSlop={hitSlop} onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft color={colors.primaryDark} size={22} />
          </Pressable>
        ) : null}
        <View style={styles.textBlock}>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
      {rightAction ? <View>{rightAction}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  left: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    gap: spacing.sm,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderWidth: 1,
    borderColor: colors.border,
  },
  textBlock: {
    flex: 1,
    gap: 4,
  },
  title: {
    ...typography.title1,
  },
  subtitle: {
    fontFamily: fonts.medium,
    fontSize: 13,
    letterSpacing: 0.2,
    color: colors.textMuted,
  },
});
