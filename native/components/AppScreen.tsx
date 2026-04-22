import { ScrollView, StyleSheet, View, type ScrollViewProps, type ViewProps } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, screen, spacing } from "@/lib/theme";

type AppScreenProps = {
  scroll?: boolean;
  padded?: boolean;
  children: React.ReactNode;
} & Pick<ScrollViewProps, "contentContainerStyle" | "refreshControl"> &
  ViewProps;

export function AppScreen({
  children,
  scroll = true,
  padded = true,
  contentContainerStyle,
  refreshControl,
  style,
}: AppScreenProps) {
  const insets = useSafeAreaInsets();
  const contentPadding = padded
    ? {
        paddingHorizontal: screen.paddingHorizontal,
        paddingTop: spacing.sm,
        paddingBottom: spacing.xxl + insets.bottom,
      }
    : {
        paddingBottom: spacing.xl + insets.bottom,
      };

  if (!scroll) {
    return (
      <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
        <View pointerEvents="none" style={styles.glowTop} />
        <View pointerEvents="none" style={styles.glowRight} />
        <View style={[styles.staticContent, contentPadding]}>
          <View style={[styles.frame, style]}>{children}</View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <View pointerEvents="none" style={styles.glowTop} />
      <View pointerEvents="none" style={styles.glowRight} />
      <ScrollView
        style={styles.scroll}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[styles.scrollContent, contentPadding, contentContainerStyle]}
        refreshControl={refreshControl}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.frame, style]}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  glowTop: {
    position: "absolute",
    top: -40,
    left: -10,
    width: 220,
    height: 220,
    borderRadius: 220,
    backgroundColor: "rgba(58, 174, 216, 0.08)",
  },
  glowRight: {
    position: "absolute",
    top: 100,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 220,
    backgroundColor: "rgba(200, 164, 90, 0.08)",
  },
  scroll: {
    flex: 1,
  },
  staticContent: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  frame: {
    width: "100%",
    maxWidth: screen.maxWidth,
    alignSelf: "center",
  },
});
