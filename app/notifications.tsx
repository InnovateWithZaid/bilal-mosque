import { StyleSheet, Text, View } from "react-native";
import { Bell, Heart } from "lucide-react-native";

import { AnnouncementCard } from "@/components/AnnouncementCard";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useMosqueData } from "@/contexts/MosqueDataContext";
import { colors, spacing } from "@/lib/theme";

export default function NotificationsScreen() {
  const { ready: favoritesReady, favorites } = useFavorites();
  const { ready, announcements, mosques } = useMosqueData();

  if (!ready || !favoritesReady) {
    return <LoadingState label="Loading updates..." />;
  }

  const favoriteAnnouncements = announcements
    .filter((announcement) => favorites.includes(announcement.mosqueId))
    .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime());

  const getMosqueName = (mosqueId: string) => mosques.find((mosque) => mosque.id === mosqueId)?.name ?? "Unknown mosque";

  return (
    <AppScreen contentContainerStyle={styles.content}>
      <AppHeader title="Notifications" subtitle="Updates from the mosques you follow." showBack />
      {favorites.length === 0 ? (
        <EmptyState
          icon={<Heart color={colors.primary} size={34} />}
          title="No favorites yet"
          description="Follow a mosque first, and its updates will show up here."
        />
      ) : favoriteAnnouncements.length === 0 ? (
        <EmptyState
          icon={<Bell color={colors.textMuted} size={34} />}
          title="No updates yet"
          description="Your followed mosques have not posted any new announcements."
        />
      ) : (
        <View style={styles.list}>
          {favoriteAnnouncements.map((announcement) => (
            <View key={announcement.id} style={styles.item}>
              <Text style={styles.label}>{getMosqueName(announcement.mosqueId)}</Text>
              <AnnouncementCard announcement={announcement} />
            </View>
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
    gap: spacing.md,
  },
  item: {
    gap: spacing.xs,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMuted,
    paddingHorizontal: spacing.xs,
  },
});
