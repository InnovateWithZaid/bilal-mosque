import { StyleSheet, Text, View } from "react-native";
import { useMemo, useState } from "react";
import { useLocalSearchParams } from "expo-router";

import { AnnouncementCard } from "@/components/AnnouncementCard";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { Chip } from "@/components/Chip";
import { EmptyState } from "@/components/EmptyState";
import { LoadingState } from "@/components/LoadingState";
import { useMosqueData } from "@/contexts/MosqueDataContext";
import { colors, spacing, typography } from "@/lib/theme";
import type { AnnouncementType } from "@/types";

const filterTypes: Array<AnnouncementType | "all"> = ["all", "talk", "salah_update", "janazah", "notice"];

export default function CommunityScreen() {
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const mosqueId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { ready, announcements, mosques } = useMosqueData();
  const [activeFilter, setActiveFilter] = useState<AnnouncementType | "all">("all");

  const mosque = useMemo(() => mosques.find((item) => item.id === mosqueId), [mosques, mosqueId]);
  const filteredAnnouncements = useMemo(
    () =>
      announcements.filter(
        (announcement) => announcement.mosqueId === mosqueId && (activeFilter === "all" || announcement.type === activeFilter),
      ),
    [activeFilter, announcements, mosqueId],
  );

  if (!ready) {
    return <LoadingState label="Loading community..." />;
  }

  return (
    <AppScreen contentContainerStyle={styles.content}>
      <AppHeader title="Community" subtitle={mosque?.name ?? "Mosque updates"} showBack />
      <Text style={styles.lead}>Local schedule updates, talks, notices, and janazah information posted from the mosque dashboard.</Text>
      <View style={styles.chips}>
        {filterTypes.map((filter) => (
          <Chip key={filter} label={filter === "all" ? "All" : filter.replace("_", " ")} active={activeFilter === filter} onPress={() => setActiveFilter(filter)} />
        ))}
      </View>
      {filteredAnnouncements.length > 0 ? (
        <View style={styles.list}>
          {filteredAnnouncements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </View>
      ) : (
        <EmptyState title="No announcements" description="This mosque has not posted anything for the selected filter yet." />
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  lead: {
    ...typography.body,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  list: {
    gap: spacing.sm,
  },
});
