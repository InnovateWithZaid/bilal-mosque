import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Navigation, Clock3, MapPin, Check } from "lucide-react-native";
import { useState } from "react";

import { AppCard } from "@/components/AppCard";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { colors, fonts, radii, spacing, typography } from "@/lib/theme";

const recentLocations = [
  { id: "1", name: "Bangalore, Karnataka", subtext: "Current location" },
  { id: "2", name: "Indiranagar, Bangalore", subtext: "Last visited" },
  { id: "3", name: "Koramangala, Bangalore", subtext: "2 days ago" },
];

const popularAreas = ["Indiranagar", "Koramangala", "Shivajinagar", "Jayanagar", "Whitefield", "HSR Layout"];

export default function LocationScreen() {
  const [selectedId, setSelectedId] = useState("1");

  return (
    <AppScreen contentContainerStyle={styles.content}>
      <AppHeader title="Select location" subtitle="Location selection is currently stored in-app only." showBack />

      <AppCard variant="glass" pressable onPress={() => Alert.alert("Current location", "Live location selection can be wired into search next.")}>
        <View style={styles.actionRow}>
          <View style={styles.iconWrap}>
            <Navigation color={colors.primaryDark} size={20} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Use current location</Text>
            <Text style={styles.cardText}>Grant location access to center the experience around you.</Text>
          </View>
        </View>
      </AppCard>

      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <Clock3 color={colors.textMuted} size={14} />
          <Text style={styles.sectionTitle}>Recent</Text>
        </View>
        {recentLocations.map((location) => (
          <AppCard key={location.id} variant="outlined" pressable onPress={() => setSelectedId(location.id)}>
            <View style={styles.locationRow}>
              <MapPin color={colors.textMuted} size={18} />
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{location.name}</Text>
                <Text style={styles.cardText}>{location.subtext}</Text>
              </View>
              {selectedId === location.id ? <Check color={colors.primaryDark} size={18} /> : null}
            </View>
          </AppCard>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular areas</Text>
        <View style={styles.areaWrap}>
          {popularAreas.map((area) => (
            <Pressable key={area} style={styles.areaChip} onPress={() => Alert.alert(area, "Search-driven location switching can be connected here next.")}>
              <Text style={styles.areaText}>{area}</Text>
            </Pressable>
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
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionTitle: {
    fontFamily: fonts.medium,
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.7,
    color: colors.textMuted,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  cardTitle: {
    ...typography.title3,
  },
  cardText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  areaWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  areaChip: {
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  areaText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.primaryDark,
  },
});
