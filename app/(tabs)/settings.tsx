import { Alert, StyleSheet, Text } from "react-native";
import { Bell, Heart, Info, LogIn, Shield, UserCog } from "lucide-react-native";
import { useRouter } from "expo-router";

import { AppCard } from "@/components/AppCard";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { SettingRow } from "@/components/SettingRow";
import { colors, spacing } from "@/lib/theme";

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <AppScreen contentContainerStyle={styles.content}>
      <AppHeader title="Settings" subtitle="Native Expo build of Bilal." />

      <SettingRow
        icon={<Heart color={colors.primary} size={20} />}
        title="Favorite mosques"
        description="Open your saved mosques and community updates."
        chevron
        onPress={() => router.push("/favorites")}
      />
      <SettingRow
        icon={<Bell color={colors.primary} size={20} />}
        title="Notifications"
        description="This native build currently includes in-app updates only. Push alerts can be added later."
        onPress={() => Alert.alert("In-app updates", "Push notifications are not enabled yet in the Expo version.")}
      />
      <SettingRow
        icon={<UserCog color={colors.primary} size={20} />}
        title="Mosque admin"
        description="Update your mosque's times and announcements."
        chevron
        onPress={() => router.push("/mosque-admin/login")}
      />
      <SettingRow
        icon={<LogIn color={colors.primary} size={20} />}
        title="Core admin"
        description="Manage all mosque records in the local native app."
        chevron
        onPress={() => router.push("/admin/login")}
      />
      <SettingRow
        icon={<Info color={colors.primary} size={20} />}
        title="About Bilal"
        description="Learn what the native Expo app includes today."
        chevron
        onPress={() => router.push("/about")}
      />
      <SettingRow
        icon={<Shield color={colors.primary} size={20} />}
        title="Privacy policy"
        description="Read how location, favorites, and local admin data are handled."
        chevron
        onPress={() => router.push("/privacy")}
      />
      <SettingRow
        icon={<Info color={colors.primary} size={20} />}
        title="Help & support"
        description="See support and troubleshooting details for the Expo app."
        chevron
        onPress={() => router.push("/support")}
      />

      <AppCard style={styles.footerCard}>
        <Text style={styles.footerArabic}>Bilal</Text>
        <Text style={styles.footerTitle}>Helping Muslims find the next jama'ah.</Text>
        <Text style={styles.footerText}>Version 1.0.0 • Expo native preview</Text>
      </AppCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.sm,
  },
  footerCard: {
    marginTop: spacing.sm,
    alignItems: "center",
    gap: spacing.xs,
  },
  footerArabic: {
    fontSize: 30,
    fontWeight: "700",
    color: colors.primary,
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },
  footerText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
  },
});
