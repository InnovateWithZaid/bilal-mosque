import { Pressable, StyleSheet, Text, View } from "react-native";
import { useMemo } from "react";
import { Flag, Heart, MapPin, MessageSquare } from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { AnnouncementCard } from "@/components/AnnouncementCard";
import { AppButton } from "@/components/AppButton";
import { AppCard } from "@/components/AppCard";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { LoadingState } from "@/components/LoadingState";
import { PrayerTimesCard } from "@/components/PrayerTimesCard";
import { SectionHeader } from "@/components/SectionHeader";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useMosqueData } from "@/contexts/MosqueDataContext";
import { formatDistance, getParkingLabel, getPlaceTypeLabel } from "@/lib/format";
import { openDirections } from "@/lib/maps";
import { colors, radii, spacing } from "@/lib/theme";

export default function MosqueDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const mosqueId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { ready, mosques, announcements } = useMosqueData();
  const { isFavorite, toggleFavorite } = useFavorites();

  const mosque = useMemo(() => mosques.find((item) => item.id === mosqueId), [mosques, mosqueId]);
  const mosqueAnnouncements = useMemo(
    () => announcements.filter((announcement) => announcement.mosqueId === mosqueId).slice(0, 2),
    [announcements, mosqueId],
  );

  if (!ready) {
    return <LoadingState label="Loading mosque..." />;
  }

  if (!mosque) {
    return (
      <AppScreen>
        <AppHeader title="Mosque not found" showBack />
      </AppScreen>
    );
  }

  const followed = isFavorite(mosque.id);

  return (
    <AppScreen contentContainerStyle={styles.content}>
      <AppHeader
        title={mosque.name}
        subtitle={mosque.address}
        showBack
        rightAction={
          <View style={styles.headerActions}>
            <Pressable style={styles.iconButton} onPress={() => void toggleFavorite(mosque.id)}>
              <Heart color={followed ? colors.primary : colors.textMuted} fill={followed ? colors.primary : "transparent"} size={18} />
            </Pressable>
            <Pressable style={styles.iconButton} onPress={() => router.push(`/mosque/${mosque.id}/report`)}>
              <Flag color={colors.textMuted} size={18} />
            </Pressable>
          </View>
        }
      />

      <AppCard>
        <View style={styles.heroRow}>
          <View style={styles.typePill}>
            <Text style={styles.typePillText}>{getPlaceTypeLabel(mosque.type)}</Text>
          </View>
          <Text style={styles.distance}>{formatDistance(mosque.distance)}</Text>
        </View>
        <Text style={styles.address}>{mosque.address}</Text>
        <View style={styles.ctaGroup}>
          <AppButton label="Navigate" onPress={() => void openDirections(mosque)} />
          <AppButton label="Community" variant="outline" onPress={() => router.push(`/mosque/${mosque.id}/community`)} />
        </View>
      </AppCard>

      {mosque.features.dailyCongregation ? (
        <PrayerTimesCard athanTimes={mosque.athanTimes} iqamahTimes={mosque.iqamahTimes} />
      ) : null}

      {mosque.features.jummah && mosque.jummahTimes.length > 0 ? (
        <AppCard>
          <SectionHeader title="Jummah prayer" />
          <View style={styles.badgeRow}>
            {mosque.jummahTimes.map((time) => (
              <View key={time} style={styles.timeBadge}>
                <Text style={styles.timeBadgeText}>{time}</Text>
              </View>
            ))}
          </View>
        </AppCard>
      ) : null}

      {mosque.features.eidPrayer && mosque.eidTimes?.length ? (
        <AppCard>
          <SectionHeader title="Eid prayer" />
          <View style={styles.badgeRow}>
            {mosque.eidTimes.map((time) => (
              <View key={time} style={[styles.timeBadge, styles.eidBadge]}>
                <Text style={[styles.timeBadgeText, styles.eidBadgeText]}>{time}</Text>
              </View>
            ))}
          </View>
        </AppCard>
      ) : null}

      {mosque.facilities ? (
        <AppCard>
          <SectionHeader title="Facilities" />
          <View style={styles.facilityList}>
            <Text style={styles.facilityText}>• {getParkingLabel(mosque.facilities.carParking)}</Text>
            {mosque.facilities.ablution ? <Text style={styles.facilityText}>• Ablution / wudhu area</Text> : null}
            {mosque.facilities.womensArea ? <Text style={styles.facilityText}>• Women's prayer area</Text> : null}
            {mosque.facilities.accessibility ? <Text style={styles.facilityText}>• Accessibility support</Text> : null}
            {mosque.facilities.toilets ? <Text style={styles.facilityText}>• Toilets available</Text> : null}
            {mosque.facilities.iftaar ? <Text style={styles.facilityText}>• Iftaar support in Ramadan</Text> : null}
          </View>
        </AppCard>
      ) : null}

      <View>
        <SectionHeader title="Community updates" actionLabel="View all" onActionPress={() => router.push(`/mosque/${mosque.id}/community`)} />
        {mosqueAnnouncements.length > 0 ? (
          <View style={styles.list}>
            {mosqueAnnouncements.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
          </View>
        ) : (
          <AppCard>
            <View style={styles.emptyCommunity}>
              <MessageSquare color={colors.textMuted} size={24} />
              <Text style={styles.emptyCommunityText}>No announcements yet.</Text>
            </View>
          </AppCard>
        )}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  headerActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  heroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typePill: {
    borderRadius: radii.pill,
    backgroundColor: "#D8F1F1",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  typePillText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  distance: {
    fontSize: 13,
    color: colors.textMuted,
  },
  address: {
    marginTop: spacing.sm,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
  },
  ctaGroup: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  timeBadge: {
    borderRadius: radii.md,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  timeBadgeText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  eidBadge: {
    backgroundColor: "#FFF4D8",
  },
  eidBadgeText: {
    color: colors.warning,
  },
  facilityList: {
    gap: spacing.xs,
  },
  facilityText: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 22,
  },
  list: {
    gap: spacing.sm,
  },
  emptyCommunity: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  emptyCommunityText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
