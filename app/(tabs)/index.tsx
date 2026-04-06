import { RefreshControl, Pressable, StyleSheet, Text, View } from "react-native";
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
import { colors, radii, spacing } from "@/lib/theme";
import { useBangaloreTime } from "@/hooks/useBangaloreTime";
import { useNextPrayer } from "@/hooks/useNextPrayer";
import { getNextPrayer } from "@/lib/time";
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
        subtitle={`${formattedDate} • ${formattedTime}`}
        rightAction={
          <Pressable style={styles.iconButton} onPress={() => router.push("/notifications")}>
            <Bell color={colors.primary} size={20} />
          </Pressable>
        }
      />

      <AppCard pressable onPress={() => router.push("/location")}>
        <View style={styles.locationRow}>
          <View style={styles.locationIcon}>
            <MapPin color={colors.primary} size={18} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.locationLabel}>Current area</Text>
            <Text style={styles.locationValue}>Bangalore, Karnataka</Text>
          </View>
        </View>
      </AppCard>

      <NextJamaahHero mosque={nearestMosque} prayer={nextPrayer.prayer} countdown={nextPrayer.countdown} />

      <View>
        <SectionHeader title="Nearby mosques" actionLabel="View all" onActionPress={() => router.push("/mosques")} />
        <View style={styles.list}>
          {sortedMosques.slice(0, 3).map((mosque) => (
            <MosqueCardWithPrayer key={mosque.id} mosque={mosque} currentTime={currentTime} />
          ))}
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
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
    borderRadius: radii.md,
    backgroundColor: "#D8F1F1",
    alignItems: "center",
    justifyContent: "center",
  },
  locationLabel: {
    fontSize: 12,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  locationValue: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  list: {
    gap: spacing.sm,
  },
});
