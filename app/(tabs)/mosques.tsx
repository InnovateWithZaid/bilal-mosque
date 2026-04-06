import { RefreshControl, StyleSheet, Text, View } from "react-native";
import { useMemo, useState } from "react";

import { AppScreen } from "@/components/AppScreen";
import { AppHeader } from "@/components/AppHeader";
import { Chip } from "@/components/Chip";
import { LoadingState } from "@/components/LoadingState";
import { MosqueCard } from "@/components/MosqueCard";
import { TextField } from "@/components/TextField";
import { useMosqueData } from "@/contexts/MosqueDataContext";
import { colors, spacing } from "@/lib/theme";
import { useBangaloreTime } from "@/hooks/useBangaloreTime";
import { useNextPrayer } from "@/hooks/useNextPrayer";
import type { Mosque, PrayerName } from "@/types";

const filters = ["All", "Mosque", "Musallah", "Eidgah", "Jummah", "Eid"] as const;

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

export default function MosquesScreen() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");
  const { ready, mosques, refresh } = useMosqueData();
  const { currentTime } = useBangaloreTime();

  const filteredMosques = useMemo(() => {
    return mosques.filter((mosque) => {
      const matchesSearch =
        mosque.name.toLowerCase().includes(search.toLowerCase()) || mosque.address.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Mosque" && mosque.type === "mosque") ||
        (activeFilter === "Musallah" && mosque.type === "musallah") ||
        (activeFilter === "Eidgah" && mosque.type === "eidgah") ||
        (activeFilter === "Jummah" && mosque.features.jummah) ||
        (activeFilter === "Eid" && mosque.features.eidPrayer);

      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, mosques, search]);

  if (!ready) {
    return <LoadingState label="Loading mosques..." />;
  }

  return (
    <AppScreen
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={false} onRefresh={() => void refresh()} tintColor={colors.primary} />}
    >
      <AppHeader title="Mosques" subtitle="Find your next jama'ah across Bangalore." />
      <TextField value={search} onChangeText={setSearch} placeholder="Search by name or area" />
      <View style={styles.chips}>
        {filters.map((filter) => (
          <Chip key={filter} label={filter} active={activeFilter === filter} onPress={() => setActiveFilter(filter)} />
        ))}
      </View>
      <Text style={styles.count}>{filteredMosques.length} results</Text>
      <View style={styles.list}>
        {filteredMosques.map((mosque) => (
          <MosqueCardWithPrayer key={mosque.id} mosque={mosque} currentTime={currentTime} />
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  count: {
    fontSize: 12,
    color: colors.textMuted,
  },
  list: {
    gap: spacing.sm,
  },
});
