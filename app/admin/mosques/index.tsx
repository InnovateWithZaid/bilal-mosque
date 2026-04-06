import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { PencilLine, Plus, Trash2 } from "lucide-react-native";

import { AppButton } from "@/components/AppButton";
import { AppCard } from "@/components/AppCard";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { LoadingState } from "@/components/LoadingState";
import { StatCard } from "@/components/StatCard";
import { TextField } from "@/components/TextField";
import { useMosqueData } from "@/contexts/MosqueDataContext";
import { getPlaceTypeLabel } from "@/lib/format";
import { colors, spacing } from "@/lib/theme";

export default function AdminMosquesScreen() {
  const router = useRouter();
  const { ready, mosques, deleteMosque } = useMosqueData();
  const [search, setSearch] = useState("");

  const filteredMosques = useMemo(
    () =>
      mosques.filter(
        (mosque) =>
          mosque.name.toLowerCase().includes(search.toLowerCase()) ||
          mosque.address.toLowerCase().includes(search.toLowerCase()),
      ),
    [mosques, search],
  );

  if (!ready) {
    return <LoadingState label="Loading mosque records..." />;
  }

  return (
    <AppScreen contentContainerStyle={styles.content}>
      <AppHeader title="Manage mosques" subtitle="Create, edit, and delete locations." showBack />
      <AppButton label="Add mosque" icon={<Plus color={colors.white} size={16} />} onPress={() => router.push("/admin/mosques/add")} />
      <TextField value={search} onChangeText={setSearch} placeholder="Search mosques" />
      <View style={styles.statsRow}>
        <StatCard value={mosques.filter((item) => item.type === "mosque").length} label="Mosques" />
        <StatCard value={mosques.filter((item) => item.type === "musallah").length} label="Musallahs" />
        <StatCard value={mosques.filter((item) => item.type === "eidgah").length} label="Eidgahs" />
      </View>
      <View style={styles.list}>
        {filteredMosques.map((mosque) => (
          <AppCard key={mosque.id}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{mosque.name}</Text>
                <Text style={styles.meta}>
                  {getPlaceTypeLabel(mosque.type)} • {mosque.address}
                </Text>
              </View>
              <View style={styles.actions}>
                <Pressable style={styles.iconButton} onPress={() => router.push(`/admin/mosques/${mosque.id}`)}>
                  <PencilLine color={colors.primary} size={18} />
                </Pressable>
                <Pressable
                  style={styles.iconButton}
                  onPress={() =>
                    Alert.alert("Delete mosque", `Remove ${mosque.name} from the native app?`, [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: () => {
                          void deleteMosque(mosque.id);
                        },
                      },
                    ])
                  }
                >
                  <Trash2 color={colors.danger} size={18} />
                </Pressable>
              </View>
            </View>
          </AppCard>
        ))}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  list: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  name: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
  },
  meta: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textMuted,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
});
