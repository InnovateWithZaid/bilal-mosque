import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { Redirect, useRouter } from "expo-router";
import { Lock, LogIn } from "lucide-react-native";

import { AppButton } from "@/components/AppButton";
import { AppCard } from "@/components/AppCard";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { LoadingState } from "@/components/LoadingState";
import { TextField } from "@/components/TextField";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useMosqueData } from "@/contexts/MosqueDataContext";
import { colors, fonts, spacing, typography } from "@/lib/theme";

export default function MosqueAdminLoginScreen() {
  const router = useRouter();
  const { ready, isAuthenticated, role, loginMosqueAdmin } = useAdminAuth();
  const { mosques } = useMosqueData();
  const [selectedMosqueId, setSelectedMosqueId] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  if (!ready) {
    return <LoadingState label="Checking mosque admin session..." />;
  }

  if (isAuthenticated && role === "mosque_admin") {
    return <Redirect href="/mosque-admin/dashboard" />;
  }

  const handleLogin = async () => {
    if (!selectedMosqueId) {
      Alert.alert("Select a mosque", "Please choose the mosque you manage.");
      return;
    }

    if (!pin.trim()) {
      Alert.alert("PIN required", "Please enter the mosque admin PIN.");
      return;
    }

    setLoading(true);
    try {
      const ok = await loginMosqueAdmin(selectedMosqueId, pin);
      if (!ok) {
        Alert.alert("Invalid credentials", "Please check the mosque selection and PIN.");
        return;
      }

      router.replace("/mosque-admin/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen contentContainerStyle={styles.content}>
      <AppHeader title="Mosque admin login" subtitle="Manage one mosque from your device" showBack />
      <AppCard variant="glass" style={styles.hero}>
        <Lock color={colors.primaryDark} size={30} />
        <Text style={styles.heroTitle}>Select your mosque</Text>
        <Text style={styles.heroText}>This login is still local-demo based in the Expo app, but the management tools now match the main Bilal design system.</Text>
      </AppCard>
      <View style={styles.list}>
        {mosques
          .filter((mosque) => mosque.type === "mosque")
          .map((mosque) => (
            <Pressable key={mosque.id} onPress={() => setSelectedMosqueId(mosque.id)}>
              <AppCard variant={selectedMosqueId === mosque.id ? "glass" : "outlined"} style={styles.selectCard}>
                <Text style={styles.selectTitle}>{mosque.name}</Text>
                <Text style={styles.selectText}>{mosque.address}</Text>
              </AppCard>
            </Pressable>
          ))}
      </View>
      <TextField
        label="Admin PIN"
        value={pin}
        onChangeText={setPin}
        placeholder="Enter PIN"
        secureTextEntry
        keyboardType="number-pad"
      />
      <AppButton label="Login" icon={<LogIn color={colors.white} size={16} />} onPress={() => void handleLogin()} loading={loading} />
      <Text style={styles.helper}>Demo PIN: 1234</Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  hero: {
    alignItems: "center",
    gap: spacing.xs,
  },
  heroTitle: {
    ...typography.title2,
    textAlign: "center",
  },
  heroText: {
    ...typography.body,
    textAlign: "center",
  },
  list: {
    gap: spacing.sm,
  },
  selectCard: {
    gap: 4,
  },
  selectTitle: {
    ...typography.title3,
  },
  selectText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  helper: {
    textAlign: "center",
    color: colors.warning,
    fontFamily: fonts.semiBold,
    fontSize: 13,
  },
});
