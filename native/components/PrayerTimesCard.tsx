import { StyleSheet, Text, View } from "react-native";
import { Clock3 } from "lucide-react-native";

import { AppCard } from "@/components/AppCard";
import { colors, radii, spacing } from "@/lib/theme";
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
    <AppCard>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Clock3 color={colors.primary} size={18} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.table}>
        {orderedPrayers.map((prayer) => (
          <View key={prayer} style={styles.row}>
            <Text style={styles.prayer}>{prayerLabels[prayer]}</Text>
            <View style={styles.times}>
              <View style={styles.timeBox}>
                <Text style={styles.timeLabel}>Athan</Text>
                <Text style={styles.timeValue}>{athanTimes[prayer] || "—"}</Text>
              </View>
              <View style={[styles.timeBox, styles.highlight]}>
                <Text style={styles.timeLabel}>Iqamah</Text>
                <Text style={styles.timeValue}>{iqamahTimes[prayer] || "—"}</Text>
              </View>
            </View>
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
    borderRadius: radii.md,
    backgroundColor: "#D8F1F1",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  table: {
    gap: spacing.sm,
  },
  row: {
    gap: spacing.xs,
  },
  prayer: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  times: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  timeBox: {
    flex: 1,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  highlight: {
    backgroundColor: "#E3F4F4",
  },
  timeLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textMuted,
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
});
