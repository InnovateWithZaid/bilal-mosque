import { StyleSheet, Text, View } from "react-native";
import { CircleHelp, Compass, MapPinned } from "lucide-react-native";

import { AppCard } from "@/components/AppCard";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { colors, fonts, radii, spacing, typography } from "@/lib/theme";

export default function AboutScreen() {
  return (
    <AppScreen contentContainerStyle={styles.content}>
      <AppHeader title="About Bilal" subtitle="Native Expo edition" showBack />
      <AppCard variant="glass" style={styles.hero}>
        <Text style={styles.heroEyebrow}>Bilal</Text>
        <Text style={styles.heroTitle}>Helping Muslims find the next jama&apos;ah faster.</Text>
        <Text style={styles.heroText}>
          This React Native version keeps the mobile-first feel of the original app while using native navigation, maps, storage, and device interactions through Expo.
        </Text>
      </AppCard>
      <AppCard variant="outlined">
        <View style={styles.row}>
          <View style={styles.iconWrap}>
            <MapPinned color={colors.primaryDark} size={20} />
          </View>
          <View style={styles.copy}>
            <Text style={styles.itemTitle}>Native maps</Text>
            <Text style={styles.itemText}>Browse mosques on a real mobile map and open turn-by-turn directions.</Text>
          </View>
        </View>
      </AppCard>
      <AppCard variant="outlined">
        <View style={styles.row}>
          <View style={styles.iconWrap}>
            <Compass color={colors.primaryDark} size={20} />
          </View>
          <View style={styles.copy}>
            <Text style={styles.itemTitle}>Local-first experience</Text>
            <Text style={styles.itemText}>Favorites, reports, and admin demo sessions are stored directly on the device.</Text>
          </View>
        </View>
      </AppCard>
      <AppCard variant="outlined">
        <View style={styles.row}>
          <View style={styles.iconWrap}>
            <CircleHelp color={colors.primaryDark} size={20} />
          </View>
          <View style={styles.copy}>
            <Text style={styles.itemTitle}>Built for future upgrades</Text>
            <Text style={styles.itemText}>The Expo foundation is ready for push notifications, backend sync, and app store delivery.</Text>
          </View>
        </View>
      </AppCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  hero: {
    gap: spacing.xs,
  },
  heroEyebrow: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  heroTitle: {
    ...typography.title1,
  },
  heroText: {
    ...typography.body,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  itemTitle: {
    ...typography.title3,
  },
  itemText: {
    ...typography.body,
    fontSize: 14,
  },
});
