import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Clock3, ChevronRight } from "lucide-react-native";
import { useRouter } from "expo-router";

import { AppCard } from "@/components/AppCard";
import { colors, radii, spacing } from "@/lib/theme";
import type { Mosque, PrayerName } from "@/types";

const prayerLabels: Record<PrayerName, string> = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

export function NextJamaahHero({
  mosque,
  prayer,
  countdown,
}: {
  mosque: Mosque;
  prayer: PrayerName;
  countdown: string;
}) {
  const router = useRouter();

  return (
    <AppCard pressable onPress={() => router.push(`/mosque/${mosque.id}`)} style={styles.card}>
      <LinearGradient colors={["#0F9D9F", "#0A7A7C"]} style={styles.gradient}>
        <View style={styles.top}>
          <View>
            <Text style={styles.label}>{prayerLabels[prayer]} in</Text>
            <Text style={styles.countdown}>{countdown}</Text>
          </View>
          <View style={styles.clock}>
            <Clock3 color={colors.white} size={18} />
          </View>
        </View>
        <View style={styles.bottom}>
          <View style={styles.timeChip}>
            <Text style={styles.chipLabel}>Athan</Text>
            <Text style={styles.chipValue}>{mosque.athanTimes[prayer] || "—"}</Text>
          </View>
          <View style={styles.timeChip}>
            <Text style={styles.chipLabel}>Iqamah</Text>
            <Text style={styles.chipValue}>{mosque.iqamahTimes[prayer] || "—"}</Text>
          </View>
        </View>
        <View style={styles.mosqueRow}>
          <Text numberOfLines={1} style={styles.mosqueName}>
            {mosque.name}
          </Text>
          <ChevronRight color={colors.white} size={16} />
        </View>
      </LinearGradient>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: "hidden",
  },
  gradient: {
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.lg,
  },
  top: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "rgba(255,255,255,0.78)",
    fontWeight: "700",
  },
  countdown: {
    fontSize: 42,
    fontWeight: "800",
    color: colors.white,
    marginTop: spacing.xs,
  },
  clock: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  bottom: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  timeChip: {
    flex: 1,
    borderRadius: radii.md,
    backgroundColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  chipLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.72)",
    marginBottom: 4,
  },
  chipValue: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.white,
  },
  mosqueRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mosqueName: {
    flex: 1,
    marginRight: spacing.sm,
    fontSize: 16,
    fontWeight: "700",
    color: colors.white,
  },
});
