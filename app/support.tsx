import { Alert, Linking, StyleSheet, Text } from "react-native";
import { Mail, Smartphone, Wrench } from "lucide-react-native";

import { AppCard } from "@/components/AppCard";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { SettingRow } from "@/components/SettingRow";
import { colors, spacing } from "@/lib/theme";

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
      <AppCard style={styles.hero}>
        <Text style={styles.heroTitle}>Need help with Bilal?</Text>
        <Text style={styles.heroText}>
          This build focuses on native navigation, local persistence, and mobile-first discovery. Use the options below
          to get support or report problems.
        </Text>
      </AppCard>
      <SettingRow
        icon={<Mail color={colors.primary} size={20} />}
        title="Email support"
        description={SUPPORT_EMAIL}
        onPress={() => void openEmail()}
        chevron
      />
      <SettingRow
        icon={<Smartphone color={colors.primary} size={20} />}
        title="App issue"
        description="Use the in-app report flow on a mosque page to flag bad times or location details."
      />
      <SettingRow
        icon={<Wrench color={colors.primary} size={20} />}
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
  heroTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  heroText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textMuted,
  },
});
