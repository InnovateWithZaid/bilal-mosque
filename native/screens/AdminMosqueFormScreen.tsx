import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { Camera, ChevronLeft, ImageMinus, MapPin } from "lucide-react-native";

import { AppButton } from "@/components/AppButton";
import { AppCard } from "@/components/AppCard";
import { AppScreen } from "@/components/AppScreen";
import { Chip } from "@/components/Chip";
import { LoadingState } from "@/components/LoadingState";
import { MosqueCover } from "@/components/MosqueCover";
import { SectionHeader } from "@/components/SectionHeader";
import { TextField } from "@/components/TextField";
import { useMosqueData } from "@/contexts/MosqueDataContext";
import { getBuiltInMosqueCoverKey } from "@/lib/covers";
import { deleteManagedMosqueCoverAsync, pickMosqueCoverImageAsync } from "@/lib/media";
import { colors, fonts, hitSlop, radii, spacing, typography } from "@/lib/theme";
import type { PlaceFacilities, PlaceFeatures, PlaceType, PrayerTimes } from "@/types";

const defaultFeatures: PlaceFeatures = {
  adhan: false,
  dailyCongregation: false,
  jummah: false,
  taraweeh: false,
  eidPrayer: false,
  eidAdhanOnly: false,
  janazah: false,
  khutbah: false,
};

const defaultFacilities: PlaceFacilities = {
  ablution: true,
  carParking: "none",
  womensArea: false,
  accessibility: false,
  toilets: true,
  iftaar: false,
};

const defaultPrayerTimes: PrayerTimes = {
  fajr: "",
  dhuhr: "",
  asr: "",
  maghrib: "",
  isha: "",
};

const prayerLabels = [
  { key: "fajr", label: "Fajr" },
  { key: "dhuhr", label: "Dhuhr" },
  { key: "asr", label: "Asr" },
  { key: "maghrib", label: "Maghrib" },
  { key: "isha", label: "Isha" },
] as const;

const scheduleTabs = ["Prayer", "Iqama", "Juma / Eid"] as const;

const featureLabels: Array<{ key: keyof PlaceFeatures; label: string }> = [
  { key: "adhan", label: "Adhan" },
  { key: "dailyCongregation", label: "Daily congregation" },
  { key: "jummah", label: "Jummah prayer" },
  { key: "taraweeh", label: "Taraweeh" },
  { key: "eidPrayer", label: "Eid prayer" },
  { key: "eidAdhanOnly", label: "Eid adhan only" },
  { key: "janazah", label: "Janazah" },
  { key: "khutbah", label: "Khutbah" },
];

const facilityLabels: Array<{ key: keyof PlaceFacilities; label: string }> = [
  { key: "ablution", label: "Ablution area" },
  { key: "womensArea", label: "Women's area" },
  { key: "accessibility", label: "Accessibility" },
  { key: "toilets", label: "Toilets" },
  { key: "iftaar", label: "Iftaar support" },
];

function listToCsv(items: string[]) {
  return items.join(", ");
}

function csvToList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function AdminMosqueFormScreen({ mosqueId }: { mosqueId?: string }) {
  const router = useRouter();
  const { ready, getMosqueById, addMosque, updateMosque } = useMosqueData();
  const mosque = useMemo(() => (mosqueId ? getMosqueById(mosqueId) : undefined), [getMosqueById, mosqueId]);
  const isEditing = Boolean(mosqueId);
  const defaultCover = useMemo(() => mosque?.coverImageUri ?? getBuiltInMosqueCoverKey(0), [mosque]);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("12.9716");
  const [lng, setLng] = useState("77.5946");
  const [coverImageUri, setCoverImageUri] = useState(defaultCover);
  const [type, setType] = useState<PlaceType>("mosque");
  const [features, setFeatures] = useState<PlaceFeatures>(defaultFeatures);
  const [facilities, setFacilities] = useState<PlaceFacilities>(defaultFacilities);
  const [athanTimes, setAthanTimes] = useState<PrayerTimes>(defaultPrayerTimes);
  const [iqamahTimes, setIqamahTimes] = useState<PrayerTimes>(defaultPrayerTimes);
  const [jummahCsv, setJummahCsv] = useState("");
  const [eidCsv, setEidCsv] = useState("");
  const [saving, setSaving] = useState(false);
  const [scheduleTab, setScheduleTab] = useState<(typeof scheduleTabs)[number]>("Prayer");

  useEffect(() => {
    if (!mosque) {
      setCoverImageUri(getBuiltInMosqueCoverKey(0));
      return;
    }

    setName(mosque.name);
    setAddress(mosque.address);
    setLat(String(mosque.lat));
    setLng(String(mosque.lng));
    setCoverImageUri(mosque.coverImageUri ?? getBuiltInMosqueCoverKey(0));
    setType(mosque.type);
    setFeatures(mosque.features);
    setFacilities(mosque.facilities ?? defaultFacilities);
    setAthanTimes(mosque.athanTimes);
    setIqamahTimes(mosque.iqamahTimes);
    setJummahCsv(listToCsv(mosque.jummahTimes));
    setEidCsv(listToCsv(mosque.eidTimes ?? []));
  }, [mosque]);

  if (!ready) {
    return <LoadingState label="Preparing mosque editor..." />;
  }

  if (isEditing && !mosque) {
    return <LoadingState label="Mosque not found." />;
  }

  const cleanupTransientCover = async (nextUri?: string) => {
    if (coverImageUri && coverImageUri !== defaultCover && coverImageUri !== nextUri) {
      await deleteManagedMosqueCoverAsync(coverImageUri);
    }
  };

  const handlePickPhoto = async () => {
    const picked = await pickMosqueCoverImageAsync();
    if (!picked) {
      return;
    }

    await cleanupTransientCover(picked.uri);
    setCoverImageUri(picked.uri);
  };

  const handleRemovePhoto = async () => {
    const fallback = getBuiltInMosqueCoverKey(0);
    await cleanupTransientCover(fallback);
    setCoverImageUri(fallback);
  };

  const toggleFeature = (key: keyof PlaceFeatures, value: boolean) => {
    setFeatures((current) => ({ ...current, [key]: value }));
  };

  const toggleFacility = (key: keyof PlaceFacilities, value: boolean) => {
    setFacilities((current) => ({ ...current, [key]: value }));
  };

  const handleCancel = async () => {
    await cleanupTransientCover(defaultCover);
    router.back();
  };

  const handleSave = async () => {
    if (!name.trim() || !address.trim()) {
      Alert.alert("Missing details", "Please fill in the mosque name and address.");
      return;
    }

    setSaving(true);

    const payload = {
      name: name.trim(),
      address: address.trim(),
      lat: Number.parseFloat(lat) || 12.9716,
      lng: Number.parseFloat(lng) || 77.5946,
      coverImageUri,
      type,
      features,
      facilities: type === "mosque" ? facilities : undefined,
      athanTimes,
      iqamahTimes,
      jummahTimes: csvToList(jummahCsv),
      eidTimes: csvToList(eidCsv),
      adminUids: mosque?.adminUids ?? ["local-admin"],
    };

    try {
      if (mosqueId) {
        await updateMosque(mosqueId, payload);
      } else {
        await addMosque(payload);
      }

      router.replace("/admin/mosques");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppScreen scroll={false} padded={false}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <MosqueCover uri={coverImageUri} height={280} radius={0} overlay="soft">
          <View style={styles.heroTop}>
            <Pressable hitSlop={hitSlop} onPress={() => router.back()} style={styles.backButton}>
              <ChevronLeft color={colors.white} size={22} />
            </Pressable>
          </View>
          <View style={styles.heroBottom}>
            <Text style={styles.heroLabel}>{isEditing ? "Edit mosque" : "Add mosque"}</Text>
            <View style={styles.photoActions}>
              <Pressable onPress={() => void handlePickPhoto()} style={styles.photoButton}>
                <Camera color={colors.white} size={16} />
                <Text style={styles.photoButtonText}>Change Photo</Text>
              </Pressable>
              <Pressable onPress={() => void handleRemovePhoto()} style={styles.photoGhostButton}>
                <ImageMinus color={colors.white} size={16} />
                <Text style={styles.photoButtonText}>Remove Photo</Text>
              </Pressable>
            </View>
          </View>
        </MosqueCover>

        <View style={styles.body}>
          <AppCard variant="glass">
            <SectionHeader title="Basic info" />
            <View style={styles.group}>
              <TextField label="Masjid name" value={name} onChangeText={setName} placeholder="Jamia Masjid Shivajinagar" />
              <TextField
                label="Address"
                value={address}
                onChangeText={setAddress}
                placeholder="Shivajinagar, Bangalore"
                hint="You can refine the map behavior later; the UI stores address and coordinates locally."
              />
              <View style={styles.locationHint}>
                <MapPin color={colors.primaryDark} size={16} />
                <Text style={styles.locationHintText}>Coordinates control map placement and directions.</Text>
              </View>
              <View style={styles.inline}>
                <TextField label="Latitude" value={lat} onChangeText={setLat} keyboardType="decimal-pad" style={styles.field} />
                <TextField label="Longitude" value={lng} onChangeText={setLng} keyboardType="decimal-pad" style={styles.field} />
              </View>
              <View style={styles.chips}>
                {(["mosque", "musallah", "eidgah"] as PlaceType[]).map((value) => (
                  <Chip key={value} label={value} active={type === value} onPress={() => setType(value)} />
                ))}
              </View>
            </View>
          </AppCard>

          <AppCard variant="outlined">
            <SectionHeader title="Masjid prayer time" />
            <View style={styles.group}>
              <View style={styles.chips}>
                {scheduleTabs.map((tab) => (
                  <Chip key={tab} label={tab} active={scheduleTab === tab} onPress={() => setScheduleTab(tab)} />
                ))}
              </View>

              {scheduleTab === "Prayer"
                ? prayerLabels.map((prayer) => (
                    <TextField
                      key={`athan-${prayer.key}`}
                      label={`${prayer.label} prayer`}
                      value={athanTimes[prayer.key]}
                      onChangeText={(value) => setAthanTimes((current) => ({ ...current, [prayer.key]: value }))}
                      placeholder="5:15 AM"
                    />
                  ))
                : null}

              {scheduleTab === "Iqama"
                ? prayerLabels.map((prayer) => (
                    <TextField
                      key={`iqamah-${prayer.key}`}
                      label={`${prayer.label} iqama`}
                      value={iqamahTimes[prayer.key]}
                      onChangeText={(value) => setIqamahTimes((current) => ({ ...current, [prayer.key]: value }))}
                      placeholder="5:30 AM"
                    />
                  ))
                : null}

              {scheduleTab === "Juma / Eid" ? (
                <>
                  <TextField
                    label="Jummah times"
                    hint="Use comma-separated values such as 1:00 PM, 2:00 PM"
                    value={jummahCsv}
                    onChangeText={setJummahCsv}
                    placeholder="1:00 PM, 2:00 PM"
                  />
                  <TextField
                    label="Eid times"
                    hint="Use comma-separated values such as 7:30 AM, 9:00 AM"
                    value={eidCsv}
                    onChangeText={setEidCsv}
                    placeholder="7:30 AM, 9:00 AM"
                  />
                </>
              ) : null}
            </View>
          </AppCard>

          <AppCard variant="glass">
            <SectionHeader title="Services" />
            <View style={styles.group}>
              {featureLabels.map((feature) => (
                <View key={feature.key} style={styles.switchRow}>
                  <Text style={styles.switchLabel}>{feature.label}</Text>
                  <Switch value={features[feature.key]} onValueChange={(value) => toggleFeature(feature.key, value)} trackColor={{ true: colors.primary }} />
                </View>
              ))}
            </View>
          </AppCard>

          {type === "mosque" ? (
            <AppCard variant="outlined">
              <SectionHeader title="Facilities" />
              <View style={styles.group}>
                {facilityLabels.map((facility) => (
                  <View key={facility.key} style={styles.switchRow}>
                    <Text style={styles.switchLabel}>{facility.label}</Text>
                    <Switch
                      value={Boolean(facilities[facility.key])}
                      onValueChange={(value) => toggleFacility(facility.key, value)}
                      trackColor={{ true: colors.primary }}
                    />
                  </View>
                ))}
                <Text style={styles.parkingLabel}>Car parking</Text>
                <View style={styles.chips}>
                  {(["available", "limited", "none"] as const).map((value) => (
                    <Chip
                      key={value}
                      label={value}
                      active={facilities.carParking === value}
                      onPress={() => setFacilities((current) => ({ ...current, carParking: value }))}
                    />
                  ))}
                </View>
              </View>
            </AppCard>
          ) : null}

          <View style={styles.actions}>
            <AppButton label={isEditing ? "Save changes" : "Create mosque"} onPress={() => void handleSave()} loading={saving} />
            <AppButton label="Cancel" onPress={() => void handleCancel()} variant="outline" />
          </View>
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
    justifyContent: "flex-start",
  },
  backButton: {
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
  heroLabel: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: "rgba(255,255,255,0.78)",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  photoActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    borderRadius: radii.pill,
    backgroundColor: "rgba(12, 47, 61, 0.28)",
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  photoGhostButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    borderRadius: radii.pill,
    backgroundColor: "rgba(12, 47, 61, 0.16)",
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  photoButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.white,
  },
  body: {
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  group: {
    gap: spacing.sm,
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
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    borderRadius: radii.lg,
    backgroundColor: "rgba(255,255,255,0.8)",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  switchLabel: {
    flex: 1,
    ...typography.bodyStrong,
    fontSize: 14,
  },
  parkingLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.primaryDark,
  },
  locationHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  locationHintText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
});
