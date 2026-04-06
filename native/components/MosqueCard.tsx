import { Pressable, StyleSheet, Text, View } from "react-native";
import { Heart, MapPin, Route } from "lucide-react-native";
import { useRouter } from "expo-router";

import { AppCard } from "@/components/AppCard";
import { colors, hitSlop, radii, spacing } from "@/lib/theme";
import { formatDistance, getPlaceTypeLabel } from "@/lib/format";
import { useFavorites } from "@/contexts/FavoritesContext";
import type { Mosque } from "@/types";

type MosqueCardProps = {
  mosque: Mosque;
  nextPrayer?: string;
  athanTime?: string;
  iqamahTime?: string;
  countdown?: string;
};

export function MosqueCard({ mosque, nextPrayer, athanTime, iqamahTime, countdown }: MosqueCardProps) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(mosque.id);

  return (
    <AppCard pressable onPress={() => router.push(`/mosque/${mosque.id}`)} style={styles.card}>
      <Pressable
        hitSlop={hitSlop}
        onPress={() => void toggleFavorite(mosque.id)}
        style={styles.favoriteButton}
      >
        <Heart color={favorite ? colors.primary : colors.textMuted} fill={favorite ? colors.primary : "transparent"} size={18} />
      </Pressable>
      <View style={styles.topRow}>
        <View style={styles.iconWrap}>
          <Route color={mosque.type === "eidgah" ? colors.accent : colors.primary} size={18} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{mosque.name}</Text>
          <View style={styles.addressRow}>
            <MapPin color={colors.textMuted} size={13} />
            <Text style={styles.distance}>{formatDistance(mosque.distance)}</Text>
          </View>
          <View style={styles.badges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{getPlaceTypeLabel(mosque.type)}</Text>
            </View>
            {mosque.features.jummah ? (
              <View style={[styles.badge, styles.subtleBadge]}>
                <Text style={[styles.badgeText, styles.subtleBadgeText]}>Jummah</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>
      {nextPrayer && iqamahTime ? (
        <View style={styles.footer}>
          <Text style={styles.footerLabel}>
            {nextPrayer}: {athanTime ? `${athanTime} → ` : ""}
          </Text>
          <Text style={styles.footerTime}>{iqamahTime}</Text>
          {countdown ? <Text style={styles.countdown}>{countdown}</Text> : null}
        </View>
      ) : null}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  favoriteButton: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    zIndex: 2,
  },
  topRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: radii.md,
    backgroundColor: "#DFF4F4",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    gap: 6,
    paddingRight: 28,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  distance: {
    fontSize: 13,
    color: colors.textMuted,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  badge: {
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#D8F1F1",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primaryDark,
  },
  subtleBadge: {
    backgroundColor: colors.surfaceMuted,
  },
  subtleBadgeText: {
    color: colors.textMuted,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderRadius: radii.md,
    backgroundColor: "#F0F6F6",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  footerLabel: {
    fontSize: 12,
    color: colors.textMuted,
    flexShrink: 1,
  },
  footerTime: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
  countdown: {
    marginLeft: "auto",
    fontSize: 12,
    fontWeight: "700",
    color: colors.primaryDark,
  },
});
