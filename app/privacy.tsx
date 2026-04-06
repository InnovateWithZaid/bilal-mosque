import { StyleSheet, Text } from "react-native";

import { AppCard } from "@/components/AppCard";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { colors, spacing } from "@/lib/theme";

export default function PrivacyScreen() {
  return (
    <AppScreen contentContainerStyle={styles.content}>
      <AppHeader title="Privacy policy" subtitle="For this Expo preview build" showBack />
      <AppCard style={styles.block}>
        <Text style={styles.heading}>Location</Text>
        <Text style={styles.body}>
          Bilal requests foreground location only when you ask the app to center the map around you. The current Expo
          build does not upload location data to a remote server.
        </Text>
      </AppCard>
      <AppCard style={styles.block}>
        <Text style={styles.heading}>Saved data</Text>
        <Text style={styles.body}>
          Favorites, demo admin sessions, local mosque edits, and submitted reports are stored on-device using native
          storage so the app can remember them between launches.
        </Text>
      </AppCard>
      <AppCard style={styles.block}>
        <Text style={styles.heading}>External services</Text>
        <Text style={styles.body}>
          The app can open external map applications for directions and may fetch routing data from online services when
          you request a route. Those services apply their own privacy practices.
        </Text>
      </AppCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  block: {
    gap: spacing.xs,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textMuted,
  },
});
