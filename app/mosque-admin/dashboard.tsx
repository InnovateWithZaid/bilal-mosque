import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { Redirect, useRouter } from "expo-router";
import { Bell, LogOut, Save } from "lucide-react-native";

import { AppButton } from "@/components/AppButton";
import { AppCard } from "@/components/AppCard";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { Chip } from "@/components/Chip";
import { LoadingState } from "@/components/LoadingState";
import { MosqueCover } from "@/components/MosqueCover";
import { TextField } from "@/components/TextField";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useMosqueData } from "@/contexts/MosqueDataContext";
import { colors, fonts, radii, spacing, typography } from "@/lib/theme";
import type { AnnouncementType, PrayerTimes } from "@/types";

const prayerLabels = [
  { key: "fajr", label: "Fajr" },
  { key: "dhuhr", label: "Dhuhr" },
  { key: "asr", label: "Asr" },
  { key: "maghrib", label: "Maghrib" },
  { key: "isha", label: "Isha" },
] as const;

const announcementTypes: AnnouncementType[] = ["notice", "talk", "salah_update", "janazah"];
const editorTabs = ["Prayer", "Iqama", "Juma / Eid"] as const;

export default function MosqueAdminDashboardScreen() {
  const router = useRouter();
  const { ready, isAuthenticated, role, assignedMosqueId, logout } = useAdminAuth();
  const { mosques, updateMosque, addAnnouncement, announcements } = useMosqueData();
  const mosque = useMemo(() => mosques.find((item) => item.id === assignedMosqueId), [assignedMosqueId, mosques]);
  const [athanTimes, setAthanTimes] = useState<PrayerTimes | null>(null);
  const [iqamahTimes, setIqamahTimes] = useState<PrayerTimes | null>(null);
  const [jummahTimes, setJummahTimes] = useState("");
  const [announcementType, setAnnouncementType] = useState<AnnouncementType>("notice");
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementBody, setAnnouncementBody] = useState("");
  const [scheduleTab, setScheduleTab] = useState<(typeof editorTabs)[number]>("Prayer");
  const [saving, setSaving] = useState(false);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (!mosque) {
      return;
    }

    setAthanTimes(mosque.athanTimes);
    setIqamahTimes(mosque.iqamahTimes);
    setJummahTimes(mosque.jummahTimes.join(", "));
  }, [mosque]);

  if (!ready) {
    return <LoadingState label="Opening mosque dashboard..." />;
  }

  if (!isAuthenticated || role !== "mosque_admin") {
    return <Redirect href="/mosque-admin/login" />;
  }

  if (!mosque || !athanTimes || !iqamahTimes) {
    return <LoadingState label="Loading mosque details..." />;
  }

  const ownAnnouncements = announcements.filter((announcement) => announcement.mosqueId === mosque.id).slice(0, 5);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateMosque(mosque.id, {
        athanTimes,
        iqamahTimes,
        jummahTimes: jummahTimes.split(",").map((value) => value.trim()).filter(Boolean),
      });
      Alert.alert("Saved", "Prayer times were updated in local storage.");
    } finally {
      setSaving(false);
    }
  };

  const handlePost = async () => {
    if (!announcementTitle.trim() || !announcementBody.trim()) {
      Alert.alert("Missing details", "Please enter both a title and description.");
      return;
    }

    setPosting(true);
    try {
      await addAnnouncement({
        mosqueId: mosque.id,
        type: announcementType,
        title: announcementTitle.trim(),
        description: announcementBody.trim(),
      });
      setAnnouncementTitle("");
      setAnnouncementBody("");
      Alert.alert("Posted", "The announcement is now visible inside the Expo app.");
    } finally {
      setPosting(false);
    }
  };

  return (
    <AppScreen scroll={false} padded={false}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <MosqueCover uri={mosque.coverImageUri} height={240} radius={0} overlay="strong">
          <View style={styles.heroTop}>
            <AppButton
              label="Logout"
              variant="outline"
              icon={<LogOut color={colors.text} size={16} />}
              onPress={() => {
                void logout();
                router.replace("/mosque-admin/login");
              }}
              fullWidth={false}
            />
          </View>
          <View style={styles.heroBottom}>
            <Text style={styles.heroEyebrow}>Mosque admin</Text>
            <Text style={styles.heroTitle}>{mosque.name}</Text>
            <Text style={styles.heroText}>Manage timings and post local community updates from your device.</Text>
          </View>
        </MosqueCover>

        <View style={styles.body}>
          <AppHeader title="Mosque dashboard" subtitle="Prayer schedule and local announcements" />

          <AppCard variant="glass" style={styles.section}>
            <Text style={styles.sectionTitle}>Prayer times</Text>
            <View style={styles.tabRow}>
              {editorTabs.map((tab) => (
                <Chip key={tab} label={tab} active={scheduleTab === tab} onPress={() => setScheduleTab(tab)} />
              ))}
            </View>
            {scheduleTab === "Prayer"
              ? prayerLabels.map((prayer) => (
                  <TextField
                    key={`athan-${prayer.key}`}
                    label={`${prayer.label} Athan`}
                    value={athanTimes[prayer.key]}
                    onChangeText={(value) => setAthanTimes((current) => (current ? { ...current, [prayer.key]: value } : current))}
                    placeholder="5:15 AM"
                  />
                ))
              : null}
            {scheduleTab === "Iqama"
              ? prayerLabels.map((prayer) => (
                  <TextField
                    key={`iqamah-${prayer.key}`}
                    label={`${prayer.label} Iqama`}
                    value={iqamahTimes[prayer.key]}
                    onChangeText={(value) => setIqamahTimes((current) => (current ? { ...current, [prayer.key]: value } : current))}
                    placeholder="5:30 AM"
                  />
                ))
              : null}
            {scheduleTab === "Juma / Eid" ? (
              <TextField
                label="Jummah times"
                hint="Comma-separated values"
                value={jummahTimes}
                onChangeText={setJummahTimes}
                placeholder="1:00 PM, 2:00 PM"
              />
            ) : null}
            <AppButton label="Save times" icon={<Save color={colors.white} size={16} />} onPress={() => void handleSave()} loading={saving} />
          </AppCard>

          <AppCard variant="outlined" style={styles.section}>
            <Text style={styles.sectionTitle}>Post announcement</Text>
            <View style={styles.tabRow}>
              {announcementTypes.map((type) => (
                <Chip key={type} label={type.replace("_", " ")} active={announcementType === type} onPress={() => setAnnouncementType(type)} />
              ))}
            </View>
            <TextField label="Title" value={announcementTitle} onChangeText={setAnnouncementTitle} placeholder="Announcement title" />
            <TextField
              label="Description"
              value={announcementBody}
              onChangeText={setAnnouncementBody}
              placeholder="Write the update for your community"
              multiline
            />
            <AppButton label="Post update" icon={<Bell color={colors.white} size={16} />} onPress={() => void handlePost()} loading={posting} />
          </AppCard>

          <AppCard variant="glass" style={styles.section}>
            <Text style={styles.sectionTitle}>Recent posts</Text>
            <View style={styles.list}>
              {ownAnnouncements.length > 0 ? (
                ownAnnouncements.map((announcement) => (
                  <View key={announcement.id} style={styles.announcementRow}>
                    <Text style={styles.announcementTitle}>{announcement.title}</Text>
                    <Text style={styles.announcementMeta}>{announcement.type.replace("_", " ")}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No announcements yet.</Text>
              )}
            </View>
          </AppCard>
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxl + 96,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  heroBottom: {
    gap: spacing.xs,
  },
  heroEyebrow: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: "rgba(255,255,255,0.76)",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  heroTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 28,
    color: colors.white,
  },
  heroText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    color: "rgba(255,255,255,0.84)",
  },
  body: {
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.title2,
  },
  tabRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  list: {
    gap: spacing.sm,
  },
  announcementRow: {
    gap: 4,
    paddingVertical: spacing.xs,
  },
  announcementTitle: {
    ...typography.title3,
  },
  announcementMeta: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
  emptyText: {
    ...typography.body,
    fontSize: 14,
  },
});
