import { StyleSheet, Text, View } from "react-native";
import { AlertTriangle, Bell, CalendarClock, Clock3, MessageSquare } from "lucide-react-native";
import { format } from "date-fns";

import { AppCard } from "@/components/AppCard";
import { colors, fonts, radii, spacing, typography } from "@/lib/theme";
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
    color: colors.primaryDark,
    background: "#DDEFF7",
  },
  salah_update: {
    icon: Clock3,
    label: "Salah Update",
    color: colors.secondary,
    background: "#E7F6FA",
  },
  janazah: {
    icon: AlertTriangle,
    label: "Janazah",
    color: colors.danger,
    background: "#FFF0EE",
  },
  notice: {
    icon: Bell,
    label: "Notice",
    color: colors.textMuted,
    background: "#F0F7FB",
  },
};

export function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const config = typeConfig[announcement.type];
  const Icon = config.icon;

  return (
    <AppCard variant="outlined">
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
          <Text style={styles.eventText}>{format(announcement.eventTime, "EEEE, MMM d 'at' h:mm a")}</Text>
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
    width: 46,
    height: 46,
    borderRadius: radii.lg,
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
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  pillText: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
  },
  date: {
    ...typography.meta,
    color: colors.textMuted,
  },
  title: {
    ...typography.title3,
  },
  description: {
    marginTop: spacing.sm,
    ...typography.body,
    color: colors.textMuted,
  },
  event: {
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radii.lg,
    backgroundColor: "#EBF7FB",
  },
  eventText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.text,
  },
});
