import { Alert, Linking, StyleSheet, Text } from "react-native";
import { Mail, Smartphone, Wrench } from "lucide-react-native";

import { AppCard } from "@/components/AppCard";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { SettingRow } from "@/components/SettingRow";
import { colors, fonts, spacing, typography } from "@/lib/theme";

const SUPPORT_EMAIL = "support@bilalmosque.app";

export default function SupportScreen() {
  const openEmail = async () => {
    const url = `mailto:${SUPPORT_EMAIL}`;
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      Alert.alert("Email unavailable", `Please contact ${SUPPORT_EMAIL} from your preferred mail app.`);
      return;
    }

    await Linking.openURL(url);
  };

  return (
    <AppScreen contentContainerStyle={styles.content}>
      <AppHeader title="Help & support" subtitle="Support details for the Expo native build" showBack />
      <AppCard variant="glass" style={styles.hero}>
        <Text style={styles.heroEyebrow}>Support</Text>
        <Text style={styles.heroTitle}>Need help with Bilal?</Text>
        <Text style={styles.heroText}>
          This build focuses on native navigation, local persistence, mosque cover photos, and mobile-first discovery. Use the options below to get support or report problems.
        </Text>
      </AppCard>
      <SettingRow
        icon={<Mail color={colors.primaryDark} size={20} />}
        title="Email support"
        description={SUPPORT_EMAIL}
        onPress={() => void openEmail()}
        chevron
      />
      <SettingRow
        icon={<Smartphone color={colors.primaryDark} size={20} />}
        title="App issue"
        description="Use the in-app report flow on a mosque page to flag bad times or location details."
      />
      <SettingRow
        icon={<Wrench color={colors.primaryDark} size={20} />}
        title="Troubleshooting"
        description="If maps or location do not work, confirm device permissions and internet access first."
      />
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
});
