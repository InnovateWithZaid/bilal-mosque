import { StyleSheet, Text } from "react-native";

import { AppCard } from "@/components/AppCard";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { fonts, spacing, typography } from "@/lib/theme";

export default function PrivacyScreen() {
  return (
    <AppScreen contentContainerStyle={styles.content}>
      <AppHeader title="Privacy policy" subtitle="For this Expo preview build" showBack />
      <AppCard variant="glass" style={styles.block}>
        <Text style={styles.heading}>Location</Text>
        <Text style={styles.body}>
          Bilal requests foreground location only when you ask the app to center the map around you. The current Expo build does not upload location data to a remote server.
        </Text>
      </AppCard>
      <AppCard variant="outlined" style={styles.block}>
        <Text style={styles.heading}>Saved data</Text>
        <Text style={styles.body}>
          Favorites, demo admin sessions, local mosque edits, cover photo selections, and submitted reports are stored on-device so the app can remember them between launches.
        </Text>
      </AppCard>
      <AppCard variant="outlined" style={styles.block}>
        <Text style={styles.heading}>External services</Text>
        <Text style={styles.body}>
          The app can open external map applications for directions and may fetch routing data from online services when you request a route. Those services apply their own privacy practices.
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
    ...typography.title2,
  },
  body: {
    ...typography.body,
    fontFamily: fonts.regular,
  },
});
