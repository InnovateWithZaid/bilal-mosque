import { Pressable, StyleSheet, Text, View } from "react-native";
import { useMemo } from "react";
import { ChevronLeft, Flag, Heart, MapPin, MessageSquare } from "lucide-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { AnnouncementCard } from "@/components/AnnouncementCard";
import { AppButton } from "@/components/AppButton";
import { AppCard } from "@/components/AppCard";
import { AppScreen } from "@/components/AppScreen";
import { LoadingState } from "@/components/LoadingState";
import { MosqueCover } from "@/components/MosqueCover";
import { PrayerTimesCard } from "@/components/PrayerTimesCard";
import { SectionHeader } from "@/components/SectionHeader";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useMosqueData } from "@/contexts/MosqueDataContext";
import { formatDistance, formatUpdatedAt, getParkingLabel, getPlaceTypeLabel } from "@/lib/format";
import { openDirections } from "@/lib/maps";
import { colors, fonts, hitSlop, radii, spacing, typography } from "@/lib/theme";

export default function MosqueDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const mosqueId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { ready, mosques, announcements } = useMosqueData();
  const { isFavorite, toggleFavorite } = useFavorites();

  const mosque = useMemo(() => mosques.find((item) => item.id === mosqueId), [mosques, mosqueId]);
  const mosqueAnnouncements = useMemo(
    () => announcements.filter((announcement) => announcement.mosqueId === mosqueId).slice(0, 3),
    [announcements, mosqueId],
  );

  if (!ready) {
    return <LoadingState label="Loading mosque..." />;
  }

  if (!mosque) {
    return <LoadingState label="Mosque not found." />;
  }

  const followed = isFavorite(mosque.id);
  const facilityItems = mosque.facilities
    ? [
        getParkingLabel(mosque.facilities.carParking),
        mosque.facilities.ablution ? "Ablution area" : null,
        mosque.facilities.womensArea ? "Women's prayer area" : null,
        mosque.facilities.accessibility ? "Accessibility support" : null,
        mosque.facilities.toilets ? "Toilets available" : null,
        mosque.facilities.iftaar ? "Iftaar support in Ramadan" : null,
      ].filter(Boolean)
    : [];

  return (
    <AppScreen padded={false} contentContainerStyle={styles.content}>
      <MosqueCover uri={mosque.coverImageUri} height={330} radius={0} overlay="strong">
        <View style={styles.heroTop}>
          <Pressable hitSlop={hitSlop} onPress={() => router.back()} style={styles.heroButton}>
            <ChevronLeft color={colors.white} size={22} />
          </Pressable>
          <View style={styles.heroActions}>
            <Pressable
              hitSlop={hitSlop}
              onPress={() => void toggleFavorite(mosque.id)}
              style={styles.heroButton}
            >
              <Heart color={followed ? "#F7B0A9" : colors.white} fill={followed ? colors.danger : "transparent"} size={18} />
            </Pressable>
            <Pressable hitSlop={hitSlop} onPress={() => router.push(`/mosque/${mosque.id}/report`)} style={styles.heroButton}>
              <Flag color={colors.white} size={18} />
            </Pressable>
          </View>
        </View>

        <View style={styles.heroBottom}>
          <View style={styles.heroMeta}>
            <View style={styles.typePill}>
              <Text style={styles.typePillText}>{getPlaceTypeLabel(mosque.type)}</Text>
            </View>
            <Text style={styles.heroDistance}>{formatDistance(mosque.distance)}</Text>
          </View>
          <Text style={styles.heroTitle}>{mosque.name}</Text>
          <View style={styles.addressRow}>
            <MapPin color="rgba(255,255,255,0.82)" size={14} />
            <Text style={styles.heroAddress}>{mosque.address}</Text>
          </View>
        </View>
      </MosqueCover>

      <View style={styles.body}>
        <AppCard variant="glass" style={styles.quickCard}>
          <Text style={styles.updatedText}>{formatUpdatedAt(mosque.lastUpdatedAt)}</Text>
          <View style={styles.ctaGroup}>
            <AppButton label="Directions" onPress={() => void openDirections(mosque)} />
            <AppButton label="Community" variant="outline" onPress={() => router.push(`/mosque/${mosque.id}/community`)} />
            <AppButton label="Report issue" variant="soft" onPress={() => router.push(`/mosque/${mosque.id}/report`)} />
          </View>
        </AppCard>

        {mosque.features.dailyCongregation ? <PrayerTimesCard athanTimes={mosque.athanTimes} iqamahTimes={mosque.iqamahTimes} /> : null}

        {mosque.features.jummah && mosque.jummahTimes.length > 0 ? (
          <AppCard variant="outlined">
            <SectionHeader title="Jummah Prayer" />
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
          <AppCard variant="outlined">
            <SectionHeader title="Eid Prayer" />
            <View style={styles.badgeRow}>
              {mosque.eidTimes.map((time) => (
                <View key={time} style={[styles.timeBadge, styles.eidBadge]}>
                  <Text style={[styles.timeBadgeText, styles.eidBadgeText]}>{time}</Text>
                </View>
              ))}
            </View>
          </AppCard>
        ) : null}

        {facilityItems.length > 0 ? (
          <AppCard variant="glass">
            <SectionHeader title="Facilities" />
            <View style={styles.facilityWrap}>
              {facilityItems.map((item) => (
                <View key={item} style={styles.facilityPill}>
                  <Text style={styles.facilityText}>{item}</Text>
                </View>
              ))}
            </View>
          </AppCard>
        ) : null}

        <View>
          <SectionHeader title="Community Updates" actionLabel="View all" onActionPress={() => router.push(`/mosque/${mosque.id}/community`)} />
          {mosqueAnnouncements.length > 0 ? (
            <View style={styles.list}>
              {mosqueAnnouncements.map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))}
            </View>
          ) : (
            <AppCard variant="outlined">
              <View style={styles.emptyCommunity}>
                <MessageSquare color={colors.textMuted} size={24} />
                <Text style={styles.emptyCommunityText}>No announcements yet.</Text>
              </View>
            </AppCard>
          )}
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heroActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  heroButton: {
    width: 42,
    height: 42,
    borderRadius: radii.pill,
    backgroundColor: "rgba(10, 35, 49, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroBottom: {
    gap: spacing.sm,
  },
  heroMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typePill: {
    borderRadius: radii.pill,
    backgroundColor: "rgba(255,255,255,0.88)",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  typePillText: {
    fontFamily: fonts.semiBold,
    fontSize: 12,
    color: colors.primaryDark,
  },
  heroDistance: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: "rgba(255,255,255,0.82)",
  },
  heroTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 28,
    lineHeight: 34,
    color: colors.white,
  },
  addressRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  heroAddress: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    color: "rgba(255,255,255,0.84)",
  },
  body: {
    gap: spacing.md,
    paddingHorizontal: spacing.md,
  },
  quickCard: {
    gap: spacing.sm,
  },
  updatedText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  ctaGroup: {
    gap: spacing.sm,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  timeBadge: {
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  timeBadgeText: {
    ...typography.number,
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.primaryDark,
  },
  eidBadge: {
    backgroundColor: "#FFF6E2",
  },
  eidBadgeText: {
    color: colors.warning,
  },
  facilityWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  facilityPill: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.84)",
    borderWidth: 1,
    borderColor: colors.border,
  },
  facilityText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.text,
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
    ...typography.bodyStrong,
  },
});
