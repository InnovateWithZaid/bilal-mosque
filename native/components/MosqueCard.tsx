import { Pressable, StyleSheet, Text, View, type ViewStyle } from "react-native";
import { Heart, MapPin, Route } from "lucide-react-native";
import { useRouter } from "expo-router";

import { AppCard } from "@/components/AppCard";
import { MosqueCover } from "@/components/MosqueCover";
import { useFavorites } from "@/contexts/FavoritesContext";
import { formatDistance, getPlaceTypeLabel } from "@/lib/format";
import { colors, fonts, hitSlop, radii, spacing, typography } from "@/lib/theme";
import type { Mosque } from "@/types";

type MosqueCardProps = {
  mosque: Mosque;
  nextPrayer?: string;
  athanTime?: string;
  iqamahTime?: string;
  countdown?: string;
  cardWidth?: number;
  style?: ViewStyle;
};

export function MosqueCard({ mosque, nextPrayer, athanTime, iqamahTime, countdown, cardWidth, style }: MosqueCardProps) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(mosque.id);

  return (
    <AppCard
      pressable
      onPress={() => router.push(`/mosque/${mosque.id}`)}
      variant="image"
      padding={0}
      style={[cardWidth ? { width: cardWidth } : null, style]}
    >
      <MosqueCover uri={mosque.coverImageUri} height={cardWidth ? 228 : 214} overlay="strong">
        <View style={styles.coverTop}>
          <View style={styles.typePill}>
            <Route color={mosque.type === "eidgah" ? colors.accent : colors.primaryDark} size={14} />
            <Text style={styles.typePillText}>{getPlaceTypeLabel(mosque.type)}</Text>
          </View>
          <Pressable
            hitSlop={hitSlop}
            onPress={(event) => {
              event.stopPropagation();
              void toggleFavorite(mosque.id);
            }}
            style={styles.favoriteButton}
          >
            <Heart color={favorite ? colors.danger : colors.white} fill={favorite ? colors.danger : "transparent"} size={18} />
          </Pressable>
        </View>
        <View style={styles.coverBottom}>
          <Text numberOfLines={2} style={styles.name}>
            {mosque.name}
          </Text>
          <View style={styles.addressRow}>
            <MapPin color="rgba(255,255,255,0.82)" size={13} />
            <Text style={styles.distance}>{formatDistance(mosque.distance)}</Text>
          </View>
          <View style={styles.badges}>
            {mosque.features.jummah ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Jummah</Text>
              </View>
            ) : null}
            {mosque.features.eidPrayer ? (
              <View style={[styles.badge, styles.goldBadge]}>
                <Text style={[styles.badgeText, styles.goldBadgeText]}>Eid</Text>
              </View>
            ) : null}
          </View>
        </View>
      </MosqueCover>
      {nextPrayer && iqamahTime ? (
        <View style={styles.footer}>
          <View style={styles.footerCopy}>
            <Text style={styles.footerLabel}>Next prayer</Text>
            <Text style={styles.footerPrayer}>
              {nextPrayer}
              {athanTime ? ` / ${athanTime}` : ""}
            </Text>
          </View>
          <View style={styles.timeBlock}>
            <Text style={styles.footerTime}>{iqamahTime}</Text>
            {countdown ? <Text style={styles.countdown}>{countdown}</Text> : null}
          </View>
        </View>
      ) : (
        <View style={styles.footer}>
          <View style={styles.footerCopy}>
            <Text style={styles.footerLabel}>Community-ready listing</Text>
            <Text style={styles.footerPrayer}>Prayer and mosque details available inside</Text>
          </View>
        </View>
      )}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  coverTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    backgroundColor: "rgba(22, 49, 63, 0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  typePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
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
  coverBottom: {
    gap: spacing.xs,
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 22,
    lineHeight: 28,
    color: colors.white,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  distance: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  badge: {
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  badgeText: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.white,
  },
  goldBadge: {
    backgroundColor: "rgba(200, 164, 90, 0.22)",
  },
  goldBadgeText: {
    color: "#FFF4D7",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  footerCopy: {
    flex: 1,
    gap: 3,
  },
  footerLabel: {
    fontSize: 12,
    fontFamily: fonts.medium,
    letterSpacing: 0.4,
    color: colors.textMuted,
    textTransform: "uppercase",
  },
  footerPrayer: {
    ...typography.bodyStrong,
    fontSize: 14,
  },
  timeBlock: {
    alignItems: "flex-end",
  },
  footerTime: {
    ...typography.number,
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.primaryDark,
  },
  countdown: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.primaryDark,
  },
});
