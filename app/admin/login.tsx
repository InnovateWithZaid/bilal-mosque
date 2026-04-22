import { Alert, StyleSheet, Text } from "react-native";
import { useEffect, useState } from "react";
import { Redirect, useRouter } from "expo-router";
import { Lock, LogIn } from "lucide-react-native";

import { AppButton } from "@/components/AppButton";
import { AppCard } from "@/components/AppCard";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { LoadingState } from "@/components/LoadingState";
import { TextField } from "@/components/TextField";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { colors, fonts, spacing, typography } from "@/lib/theme";

export default function AdminLoginScreen() {
  const router = useRouter();
  const { ready, isAuthenticated, role, loginCoreAdmin } = useAdminAuth();
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && role === "core_admin") {
      router.replace("/admin/dashboard");
    }
  }, [isAuthenticated, role, router]);

  if (!ready) {
    return <LoadingState label="Checking admin session..." />;
  }

  if (isAuthenticated && role === "core_admin") {
    return <Redirect href="/admin/dashboard" />;
  }

  const handleLogin = async () => {
    if (!pin.trim()) {
      Alert.alert("PIN required", "Please enter the core admin PIN.");
      return;
    }

    setLoading(true);
    try {
      const ok = await loginCoreAdmin(pin);
      if (!ok) {
        Alert.alert("Invalid PIN", "Please check the PIN and try again.");
        return;
      }

      router.replace("/admin/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen contentContainerStyle={styles.content}>
      <AppHeader title="Core admin login" subtitle="Local native demo access for all mosques" showBack />
      <AppCard variant="glass" style={styles.card}>
        <Lock color={colors.primaryDark} size={30} />
        <Text style={styles.title}>Core administrators only</Text>
        <Text style={styles.description}>This Expo conversion keeps the original demo admin flow for now, but the UI now matches the main app experience.</Text>
      </AppCard>
      <TextField
        label="Admin PIN"
        value={pin}
        onChangeText={setPin}
        placeholder="Enter PIN"
        secureTextEntry
        keyboardType="number-pad"
      />
      <AppButton label="Login" icon={<LogIn color={colors.white} size={16} />} onPress={() => void handleLogin()} loading={loading} />
      <Text style={styles.helper}>Demo PIN: 0000</Text>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  card: {
    alignItems: "center",
    gap: spacing.xs,
  },
  title: {
    ...typography.title2,
    textAlign: "center",
  },
  description: {
    ...typography.body,
    textAlign: "center",
  },
  helper: {
    textAlign: "center",
    color: colors.warning,
    fontFamily: fonts.semiBold,
    fontSize: 13,
  },
});
