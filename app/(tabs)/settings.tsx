import { Alert, StyleSheet, Text, View } from "react-native";
import { Bell, Heart, Info, LogIn, Shield, UserCog } from "lucide-react-native";
import { useRouter } from "expo-router";

import { AppCard } from "@/components/AppCard";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { SettingRow } from "@/components/SettingRow";
import { colors, fonts, spacing, typography } from "@/lib/theme";

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <AppScreen contentContainerStyle={styles.content}>
      <AppHeader title="Settings" subtitle="Bilal native preview" />

      <AppCard variant="glass" style={styles.hero}>
        <Text style={styles.heroEyebrow}>Bilal</Text>
        <Text style={styles.heroTitle}>A calmer way to find your next jama&apos;ah.</Text>
        <Text style={styles.heroBody}>This build keeps mosque discovery, favorites, local admin tools, and maps on-device while the broader platform evolves.</Text>
      </AppCard>

      <SettingRow
        icon={<Heart color={colors.primaryDark} size={20} />}
        title="Favorite mosques"
        description="Open your saved mosques and community updates."
        chevron
        onPress={() => router.push("/favorites")}
      />
      <SettingRow
        icon={<Bell color={colors.primaryDark} size={20} />}
        title="Notifications"
        description="This native build currently includes in-app updates only. Push alerts can be added later."
        onPress={() => Alert.alert("In-app updates", "Push notifications are not enabled yet in the Expo version.")}
      />
      <SettingRow
        icon={<UserCog color={colors.primaryDark} size={20} />}
        title="Mosque admin"
        description="Update your mosque's times and announcements."
        chevron
        onPress={() => router.push("/mosque-admin/login")}
      />
      <SettingRow
        icon={<LogIn color={colors.primaryDark} size={20} />}
        title="Core admin"
        description="Manage all mosque records in the local native app."
        chevron
        onPress={() => router.push("/admin/login")}
      />
      <SettingRow
        icon={<Info color={colors.primaryDark} size={20} />}
        title="About Bilal"
        description="Learn what the native Expo app includes today."
        chevron
        onPress={() => router.push("/about")}
      />
      <SettingRow
        icon={<Shield color={colors.primaryDark} size={20} />}
        title="Privacy policy"
        description="Read how location, favorites, and local admin data are handled."
        chevron
        onPress={() => router.push("/privacy")}
      />
      <SettingRow
        icon={<Info color={colors.primaryDark} size={20} />}
        title="Help & support"
        description="See support and troubleshooting details for the Expo app."
        chevron
        onPress={() => router.push("/support")}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.sm,
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
  heroBody: {
    ...typography.body,
  },
});
