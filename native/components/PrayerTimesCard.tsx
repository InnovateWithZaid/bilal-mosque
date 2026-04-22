import { StyleSheet, Text, View } from "react-native";
import { Clock3 } from "lucide-react-native";

import { AppCard } from "@/components/AppCard";
import { colors, fonts, radii, spacing, typography } from "@/lib/theme";
import type { AthanTimes, IqamahTimes, PrayerName } from "@/types";

const prayerLabels: Record<PrayerName, string> = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

const orderedPrayers = Object.keys(prayerLabels) as PrayerName[];

export function PrayerTimesCard({
  athanTimes,
  iqamahTimes,
  title = "Prayer Times",
}: {
  athanTimes: AthanTimes;
  iqamahTimes: IqamahTimes;
  title?: string;
}) {
  return (
    <AppCard variant="glass">
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Clock3 color={colors.primaryDark} size={18} />
        </View>
        <View style={styles.headerCopy}>
          <Text style={styles.kicker}>Prayer schedule</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
      <View style={styles.columnHeader}>
        <Text style={styles.columnLabel}>Prayer</Text>
        <Text style={styles.columnLabel}>Athan</Text>
        <Text style={styles.columnLabel}>Iqamah</Text>
      </View>
      <View style={styles.table}>
        {orderedPrayers.map((prayer) => (
          <View key={prayer} style={styles.row}>
            <Text style={styles.prayer}>{prayerLabels[prayer]}</Text>
            <Text style={styles.timeValue}>{athanTimes[prayer] || "--"}</Text>
            <Text style={[styles.timeValue, styles.highlightValue]}>{iqamahTimes[prayer] || "--"}</Text>
          </View>
        ))}
      </View>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: radii.lg,
    backgroundColor: "#DDF0F8",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCopy: {
    gap: 2,
  },
  kicker: {
    fontFamily: fonts.medium,
    fontSize: 11,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: colors.textMuted,
  },
  title: {
    ...typography.title2,
  },
  columnHeader: {
    flexDirection: "row",
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },
  columnLabel: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  table: {
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radii.lg,
    backgroundColor: "rgba(255,255,255,0.72)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 14,
  },
  prayer: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.text,
  },
  timeValue: {
    flex: 1,
    textAlign: "center",
    ...typography.number,
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.text,
  },
  highlightValue: {
    color: colors.primaryDark,
  },
});
