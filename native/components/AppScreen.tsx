import { ScrollView, StyleSheet, View, type ScrollViewProps, type ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, screen } from "@/lib/theme";

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
  const staticContentStyle = padded ? styles.screenContent : styles.screenContentUnpadded;
  const scrollContentStyle = padded ? styles.scrollContent : styles.scrollContentUnpadded;

  if (!scroll) {
    return (
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={[staticContentStyle, style]}>{children}</View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[scrollContentStyle, contentContainerStyle]}
        refreshControl={refreshControl}
        showsVerticalScrollIndicator={false}
      >
        <View style={style}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  screenContent: {
    flex: 1,
    paddingHorizontal: screen.paddingHorizontal,
    paddingBottom: 32,
  },
  screenContentUnpadded: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: screen.paddingHorizontal,
    paddingBottom: 32,
  },
  scrollContentUnpadded: {
    flexGrow: 1,
    paddingBottom: 0,
  },
});
