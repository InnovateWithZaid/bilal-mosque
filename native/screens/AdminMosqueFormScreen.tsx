import { Alert, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "expo-router";

import { AppButton } from "@/components/AppButton";
import { AppCard } from "@/components/AppCard";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { Chip } from "@/components/Chip";
import { LoadingState } from "@/components/LoadingState";
import { SectionHeader } from "@/components/SectionHeader";
import { TextField } from "@/components/TextField";
import { useMosqueData } from "@/contexts/MosqueDataContext";
import { colors, radii, spacing } from "@/lib/theme";
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

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("12.9716");
  const [lng, setLng] = useState("77.5946");
  const [type, setType] = useState<PlaceType>("mosque");
  const [features, setFeatures] = useState<PlaceFeatures>(defaultFeatures);
  const [facilities, setFacilities] = useState<PlaceFacilities>(defaultFacilities);
  const [athanTimes, setAthanTimes] = useState<PrayerTimes>(defaultPrayerTimes);
  const [iqamahTimes, setIqamahTimes] = useState<PrayerTimes>(defaultPrayerTimes);
  const [jummahCsv, setJummahCsv] = useState("");
  const [eidCsv, setEidCsv] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!mosque) {
      return;
    }

    setName(mosque.name);
    setAddress(mosque.address);
    setLat(String(mosque.lat));
    setLng(String(mosque.lng));
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
    return (
      <AppScreen>
        <AppHeader title="Mosque not found" showBack />
      </AppScreen>
    );
  }

  const toggleFeature = (key: keyof PlaceFeatures, value: boolean) => {
    setFeatures((current) => ({ ...current, [key]: value }));
  };

  const toggleFacility = (key: keyof PlaceFacilities, value: boolean) => {
    setFacilities((current) => ({ ...current, [key]: value }));
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
    <AppScreen scroll={false}>
      <AppHeader title={isEditing ? "Edit Mosque" : "Add Mosque"} subtitle="Manage a location used by the native app." showBack />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppCard>
          <SectionHeader title="Basic info" />
          <View style={styles.group}>
            <TextField label="Name" value={name} onChangeText={setName} placeholder="Jamia Masjid Shivajinagar" />
            <TextField label="Address" value={address} onChangeText={setAddress} placeholder="Shivajinagar, Bangalore" />
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

        <AppCard>
          <SectionHeader title="Prayer times" />
          <View style={styles.group}>
            {prayerLabels.map((prayer) => (
              <View key={`athan-${prayer.key}`} style={styles.inline}>
                <TextField
                  label={`${prayer.label} Athan`}
                  value={athanTimes[prayer.key]}
                  onChangeText={(value) => setAthanTimes((current) => ({ ...current, [prayer.key]: value }))}
                  placeholder="5:15 AM"
                  style={styles.field}
                />
                <TextField
                  label={`${prayer.label} Iqamah`}
                  value={iqamahTimes[prayer.key]}
                  onChangeText={(value) => setIqamahTimes((current) => ({ ...current, [prayer.key]: value }))}
                  placeholder="5:30 AM"
                  style={styles.field}
                />
              </View>
            ))}
            <TextField
              label="Jummah times"
              hint="Use comma-separated values such as 1:00 PM, 2:00 PM"
              value={jummahCsv}
              onChangeText={setJummahCsv}
            />
            <TextField
              label="Eid times"
              hint="Use comma-separated values such as 7:30 AM, 9:00 AM"
              value={eidCsv}
              onChangeText={setEidCsv}
            />
          </View>
        </AppCard>

        <AppCard>
          <SectionHeader title="Services" />
          <View style={styles.group}>
            {featureLabels.map((feature) => (
              <View key={feature.key} style={styles.switchRow}>
                <Text style={styles.switchLabel}>{feature.label}</Text>
                <Switch value={features[feature.key]} onValueChange={(value) => toggleFeature(feature.key, value)} />
              </View>
            ))}
          </View>
        </AppCard>

        {type === "mosque" ? (
          <AppCard>
            <SectionHeader title="Facilities" />
            <View style={styles.group}>
              {facilityLabels.map((facility) => (
                <View key={facility.key} style={styles.switchRow}>
                  <Text style={styles.switchLabel}>{facility.label}</Text>
                  <Switch
                    value={Boolean(facilities[facility.key])}
                    onValueChange={(value) => toggleFacility(facility.key, value)}
                  />
                </View>
              ))}
              <Text style={styles.switchLabel}>Car parking</Text>
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
          <AppButton label="Cancel" onPress={() => router.back()} variant="outline" />
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    paddingBottom: spacing.xxl,
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
    borderRadius: radii.md,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  switchLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});
