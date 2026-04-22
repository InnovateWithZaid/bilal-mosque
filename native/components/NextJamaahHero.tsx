import { StyleSheet, Text, View } from "react-native";
import { Clock3, ChevronRight } from "lucide-react-native";
import { useRouter } from "expo-router";

import { AppCard } from "@/components/AppCard";
import { MosqueCover } from "@/components/MosqueCover";
import { colors, fonts, radii, spacing, typography } from "@/lib/theme";
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
    <AppCard pressable onPress={() => router.push(`/mosque/${mosque.id}`)} variant="image" padding={0}>
      <MosqueCover uri={mosque.coverImageUri} height={276} overlay="strong">
        <View style={styles.top}>
          <View style={styles.copy}>
            <Text style={styles.label}>Next prayer</Text>
            <Text style={styles.prayerName}>{prayerLabels[prayer]}</Text>
            <Text style={styles.countdown}>{countdown}</Text>
          </View>
          <View style={styles.clock}>
            <Clock3 color={colors.white} size={18} />
          </View>
        </View>
        <View style={styles.bottom}>
          <View style={styles.timeChip}>
            <Text style={styles.chipLabel}>Athan</Text>
            <Text style={styles.chipValue}>{mosque.athanTimes[prayer] || "--"}</Text>
          </View>
          <View style={[styles.timeChip, styles.iqamahChip]}>
            <Text style={styles.chipLabel}>Iqamah</Text>
            <Text style={styles.chipValue}>{mosque.iqamahTimes[prayer] || "--"}</Text>
          </View>
        </View>
        <View style={styles.mosqueRow}>
          <Text numberOfLines={1} style={styles.mosqueName}>
            {mosque.name}
          </Text>
          <ChevronRight color={colors.white} size={16} />
        </View>
      </MosqueCover>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  copy: {
    gap: 2,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: "rgba(255,255,255,0.78)",
  },
  prayerName: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
    color: colors.white,
  },
  countdown: {
    ...typography.number,
    fontFamily: fonts.extraBold,
    fontSize: 44,
    color: colors.white,
  },
  clock: {
    width: 38,
    height: 38,
    borderRadius: radii.pill,
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
    borderRadius: radii.lg,
    backgroundColor: "rgba(255,255,255,0.16)",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  iqamahChip: {
    backgroundColor: "rgba(200, 164, 90, 0.18)",
  },
  chipLabel: {
    fontFamily: fonts.medium,
    fontSize: 10,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.72)",
    marginBottom: 4,
  },
  chipValue: {
    ...typography.number,
    fontFamily: fonts.bold,
    fontSize: 17,
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
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.white,
  },
});
