import { RefreshControl, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Bell, MapPin } from "lucide-react-native";
import { useMemo } from "react";
import { useRouter } from "expo-router";

import { AppCard } from "@/components/AppCard";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { LoadingState } from "@/components/LoadingState";
import { MosqueCard } from "@/components/MosqueCard";
import { NextJamaahHero } from "@/components/NextJamaahHero";
import { SectionHeader } from "@/components/SectionHeader";
import { useMosqueData } from "@/contexts/MosqueDataContext";
import { useBangaloreTime } from "@/hooks/useBangaloreTime";
import { useNextPrayer } from "@/hooks/useNextPrayer";
import { getNextPrayer } from "@/lib/time";
import { colors, fonts, radii, spacing, typography } from "@/lib/theme";
import type { Mosque, PrayerName } from "@/types";

const prayerLabels: Record<PrayerName, string> = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

function MosqueCardWithPrayer({ mosque, currentTime }: { mosque: Mosque; currentTime: Date }) {
  const nextPrayer = useNextPrayer(mosque.iqamahTimes, currentTime);

  return (
    <MosqueCard
      mosque={mosque}
      nextPrayer={prayerLabels[nextPrayer.prayer]}
      athanTime={mosque.athanTimes[nextPrayer.prayer]}
      iqamahTime={nextPrayer.time}
      countdown={nextPrayer.countdown}
      cardWidth={264}
    />
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { ready, mosques, refresh } = useMosqueData();
  const { currentTime, formattedDate, formattedTime } = useBangaloreTime();

  const sortedMosques = useMemo(
    () => [...mosques].sort((left, right) => (left.distance ?? Number.MAX_SAFE_INTEGER) - (right.distance ?? Number.MAX_SAFE_INTEGER)),
    [mosques],
  );
  const nearestMosque = sortedMosques[0];
  const nextPrayer = nearestMosque ? getNextPrayer(nearestMosque.iqamahTimes, currentTime) : null;

  if (!ready || !nearestMosque || !nextPrayer) {
    return <LoadingState />;
  }

  return (
    <AppScreen
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={false} onRefresh={() => void refresh()} tintColor={colors.primary} />}
    >
      <AppHeader
        title="Bilal"
        subtitle={`${formattedDate} / ${formattedTime}`}
        rightAction={
          <Pressable style={styles.iconButton} onPress={() => router.push("/notifications")}>
            <Bell color={colors.primaryDark} size={20} />
          </Pressable>
        }
      />

      <AppCard variant="glass" pressable onPress={() => router.push("/location")}>
        <View style={styles.locationRow}>
          <View style={styles.locationIcon}>
            <MapPin color={colors.primaryDark} size={18} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.locationLabel}>Current area</Text>
            <Text style={styles.locationValue}>Bangalore, Karnataka</Text>
          </View>
        </View>
      </AppCard>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.prayerTabs}>
        {(Object.keys(prayerLabels) as PrayerName[]).map((prayer) => {
          const active = prayer === nextPrayer.prayer;

          return (
            <View key={prayer} style={[styles.prayerTab, active && styles.prayerTabActive]}>
              <Text style={[styles.prayerTabLabel, active && styles.prayerTabLabelActive]}>{prayerLabels[prayer]}</Text>
            </View>
          );
        })}
      </ScrollView>

      <NextJamaahHero mosque={nearestMosque} prayer={nextPrayer.prayer} countdown={nextPrayer.countdown} />

      <View>
        <SectionHeader title="Featured Nearby" actionLabel="View all" onActionPress={() => router.push("/mosques")} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
          {sortedMosques.slice(0, 4).map((mosque) => (
            <MosqueCardWithPrayer key={mosque.id} mosque={mosque} currentTime={currentTime} />
          ))}
        </ScrollView>
      </View>

      <AppCard variant="outlined" style={styles.summaryCard}>
        <Text style={styles.summaryEyebrow}>Closest place right now</Text>
        <Text style={styles.summaryTitle}>{nearestMosque.name}</Text>
        <Text style={styles.summaryBody}>
          {prayerLabels[nextPrayer.prayer]} iqamah is at {nextPrayer.time}. We&apos;re showing the nearest congregation first so you can get to prayer faster.
        </Text>
      </AppCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: radii.pill,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  locationIcon: {
    width: 42,
    height: 42,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  locationLabel: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  locationValue: {
    ...typography.title3,
  },
  prayerTabs: {
    gap: spacing.xs,
  },
  prayerTab: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radii.pill,
    backgroundColor: "rgba(255,255,255,0.86)",
    borderWidth: 1,
    borderColor: colors.border,
  },
  prayerTabActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  prayerTabLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.primaryDark,
  },
  prayerTabLabelActive: {
    color: colors.white,
  },
  carousel: {
    gap: spacing.sm,
    paddingRight: spacing.xs,
  },
  summaryCard: {
    gap: spacing.xs,
  },
  summaryEyebrow: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textMuted,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  summaryTitle: {
    ...typography.title2,
  },
  summaryBody: {
    ...typography.body,
  },
});
