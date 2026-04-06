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
import { TextField } from "@/components/TextField";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useMosqueData } from "@/contexts/MosqueDataContext";
import { colors, spacing } from "@/lib/theme";
import type { AnnouncementType, PrayerTimes } from "@/types";

const prayerLabels = [
  { key: "fajr", label: "Fajr" },
  { key: "dhuhr", label: "Dhuhr" },
  { key: "asr", label: "Asr" },
  { key: "maghrib", label: "Maghrib" },
  { key: "isha", label: "Isha" },
] as const;

const announcementTypes: AnnouncementType[] = ["notice", "talk", "salah_update", "janazah"];

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
    <AppScreen scroll={false}>
      <AppHeader
        title="Mosque dashboard"
        subtitle={mosque.name}
        rightAction={
          <AppButton
            label="Logout"
            variant="ghost"
            icon={<LogOut color={colors.primary} size={16} />}
            onPress={() => {
              void logout();
              router.replace("/mosque-admin/login");
            }}
            fullWidth={false}
          />
        }
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppCard style={styles.section}>
          <Text style={styles.sectionTitle}>Prayer times</Text>
          {prayerLabels.map((prayer) => (
            <View key={prayer.key} style={styles.inline}>
              <TextField
                label={`${prayer.label} Athan`}
                value={athanTimes[prayer.key]}
                onChangeText={(value) => setAthanTimes((current) => (current ? { ...current, [prayer.key]: value } : current))}
                style={styles.field}
              />
              <TextField
                label={`${prayer.label} Iqamah`}
                value={iqamahTimes[prayer.key]}
                onChangeText={(value) => setIqamahTimes((current) => (current ? { ...current, [prayer.key]: value } : current))}
                style={styles.field}
              />
            </View>
          ))}
          <TextField
            label="Jummah times"
            hint="Comma-separated values"
            value={jummahTimes}
            onChangeText={setJummahTimes}
          />
          <AppButton label="Save times" icon={<Save color={colors.white} size={16} />} onPress={() => void handleSave()} loading={saving} />
        </AppCard>

        <AppCard style={styles.section}>
          <Text style={styles.sectionTitle}>Post announcement</Text>
          <View style={styles.chips}>
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

        <AppCard style={styles.section}>
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
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  inline: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  field: {
    flex: 1,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  list: {
    gap: spacing.sm,
  },
  announcementRow: {
    gap: 4,
  },
  announcementTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  announcementMeta: {
    fontSize: 12,
    color: colors.textMuted,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
