import { StyleSheet, Text, View } from "react-native";
import { CircleHelp, Compass, MapPinned } from "lucide-react-native";

import { AppCard } from "@/components/AppCard";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { colors, spacing } from "@/lib/theme";

export default function AboutScreen() {
  return (
    <AppScreen contentContainerStyle={styles.content}>
      <AppHeader title="About Bilal" subtitle="Native Expo edition" showBack />
      <AppCard style={styles.hero}>
        <Text style={styles.heroTitle}>Bilal helps you find your next jama'ah faster.</Text>
        <Text style={styles.heroText}>
          This React Native version keeps the mobile-first feel of the original app while using native navigation, maps,
          storage, and device interactions through Expo.
        </Text>
      </AppCard>
      <AppCard>
        <View style={styles.row}>
          <MapPinned color={colors.primary} size={20} />
          <View style={styles.copy}>
            <Text style={styles.itemTitle}>Native maps</Text>
            <Text style={styles.itemText}>Browse mosques on a real mobile map and open turn-by-turn directions.</Text>
          </View>
        </View>
      </AppCard>
      <AppCard>
        <View style={styles.row}>
          <Compass color={colors.primary} size={20} />
          <View style={styles.copy}>
            <Text style={styles.itemTitle}>Local-first experience</Text>
            <Text style={styles.itemText}>Favorites, reports, and admin demo sessions are stored directly on the device.</Text>
          </View>
        </View>
      </AppCard>
      <AppCard>
        <View style={styles.row}>
          <CircleHelp color={colors.primary} size={20} />
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
    gap: spacing.sm,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
  },
  heroText: {
    fontSize: 15,
    lineHeight: 23,
    color: colors.textMuted,
  },
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  itemText: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
  },
});
