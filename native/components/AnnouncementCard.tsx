import { StyleSheet, Text, View } from "react-native";
import { AlertTriangle, Bell, CalendarClock, Clock3, MessageSquare } from "lucide-react-native";
import { format } from "date-fns";

import { AppCard } from "@/components/AppCard";
import { colors, radii, spacing } from "@/lib/theme";
import type { Announcement, AnnouncementType } from "@/types";

type IconConfig = {
  icon: React.ComponentType<{ color?: string; size?: number }>;
  label: string;
  color: string;
  background: string;
};

const typeConfig: Record<AnnouncementType, IconConfig> = {
  talk: {
    icon: MessageSquare,
    label: "Islamic Talk",
    color: colors.primary,
    background: "#D8F1F1",
  },
  salah_update: {
    icon: Clock3,
    label: "Salah Update",
    color: colors.secondary,
    background: "#D7ECEC",
  },
  janazah: {
    icon: AlertTriangle,
    label: "Janazah",
    color: colors.danger,
    background: "#FDE7DE",
  },
  notice: {
    icon: Bell,
    label: "Notice",
    color: colors.textMuted,
    background: colors.surfaceMuted,
  },
};

export function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const config = typeConfig[announcement.type];
  const Icon = config.icon;

  return (
    <AppCard>
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: config.background }]}>
          <Icon color={config.color} size={20} />
        </View>
        <View style={styles.titleWrap}>
          <View style={styles.row}>
            <View style={[styles.pill, { backgroundColor: config.background }]}>
              <Text style={[styles.pillText, { color: config.color }]}>{config.label}</Text>
            </View>
            <Text style={styles.date}>{format(announcement.createdAt, "MMM d, h:mm a")}</Text>
          </View>
          <Text style={styles.title}>{announcement.title}</Text>
        </View>
      </View>
      <Text style={styles.description}>{announcement.description}</Text>
      {announcement.eventTime ? (
        <View style={styles.event}>
          <CalendarClock color={colors.primary} size={16} />
          <Text style={styles.eventText}>{format(announcement.eventTime, "EEEE, MMM d • h:mm a")}</Text>
        </View>
      ) : null}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
  },
  titleWrap: {
    flex: 1,
    gap: spacing.xs,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing.xs,
  },
  pill: {
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pillText: {
    fontSize: 11,
    fontWeight: "700",
  },
  date: {
    fontSize: 12,
    color: colors.textMuted,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  description: {
    marginTop: spacing.sm,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
  },
  event: {
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: "#E8F6F6",
  },
  eventText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },
});
