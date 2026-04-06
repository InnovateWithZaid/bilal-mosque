import { RefreshControl, StyleSheet, Text, View } from "react-native";
import { Heart } from "lucide-react-native";
import { useMemo, useState } from "react";
import { useRouter } from "expo-router";

import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";
import { MosqueCard } from "@/components/MosqueCard";
import { TextField } from "@/components/TextField";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useMosqueData } from "@/contexts/MosqueDataContext";
import { colors, spacing } from "@/lib/theme";
import { useBangaloreTime } from "@/hooks/useBangaloreTime";
import { useNextPrayer } from "@/hooks/useNextPrayer";
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

export default function FavoritesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { ready: favoritesReady, favorites } = useFavorites();
  const { ready, mosques, refresh } = useMosqueData();
  const { currentTime } = useBangaloreTime();

  const favoriteMosques = useMemo(() => mosques.filter((mosque) => favorites.includes(mosque.id)), [favorites, mosques]);
  const filteredMosques = useMemo(
    () =>
      favoriteMosques.filter(
        (mosque) =>
          mosque.name.toLowerCase().includes(search.toLowerCase()) ||
          mosque.address.toLowerCase().includes(search.toLowerCase()),
      ),
    [favoriteMosques, search],
  );

  if (!ready || !favoritesReady) {
    return <LoadingState label="Loading favorites..." />;
  }

  return (
    <AppScreen
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={false} onRefresh={() => void refresh()} tintColor={colors.primary} />}
    >
      <AppHeader title="Favorites" subtitle={`${favorites.length} saved mosque${favorites.length === 1 ? "" : "s"}`} />
      {favorites.length > 0 ? <TextField value={search} onChangeText={setSearch} placeholder="Search favorites" /> : null}
      {favorites.length === 0 ? (
        <EmptyState
          icon={<Heart color={colors.primary} size={34} />}
          title="No favorites yet"
          description="Follow a mosque to keep it one tap away on your phone."
          actionLabel="Browse mosques"
          onActionPress={() => router.push("/mosques")}
        />
      ) : filteredMosques.length === 0 ? (
        <View style={styles.emptyResults}>
          <Text style={styles.emptyResultsText}>No saved mosques match "{search}".</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {filteredMosques.map((mosque) => (
            <MosqueCardWithPrayer key={mosque.id} mosque={mosque} currentTime={currentTime} />
          ))}
        </View>
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  list: {
    gap: spacing.sm,
  },
  emptyResults: {
    paddingVertical: spacing.xl,
  },
  emptyResultsText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: "center",
  },
});
