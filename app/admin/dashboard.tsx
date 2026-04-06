import { Redirect, useRouter } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Building2, ClipboardList, LogOut } from "lucide-react-native";

import { AppButton } from "@/components/AppButton";
import { AppCard } from "@/components/AppCard";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { LoadingState } from "@/components/LoadingState";
import { StatCard } from "@/components/StatCard";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useMosqueData } from "@/contexts/MosqueDataContext";
import { colors, spacing } from "@/lib/theme";

export default function AdminDashboardScreen() {
  const router = useRouter();
  const { ready, isAuthenticated, role, logout } = useAdminAuth();
  const { mosques, reports } = useMosqueData();

  if (!ready) {
    return <LoadingState label="Opening admin dashboard..." />;
  }

  if (!isAuthenticated || role !== "core_admin") {
    return <Redirect href="/admin/login" />;
  }

  const pendingReports = reports.filter((report) => report.status === "pending");

  return (
    <AppScreen contentContainerStyle={styles.content}>
      <AppHeader
        title="Admin dashboard"
        subtitle="Manage mosque records stored in the native app."
        rightAction={
          <Pressable
            style={styles.logoutButton}
            onPress={() => {
              void logout();
              router.replace("/admin/login");
            }}
          >
            <LogOut color={colors.textMuted} size={18} />
          </Pressable>
        }
      />

      <View style={styles.statsRow}>
        <StatCard value={mosques.length} label="Locations" />
        <StatCard value={pendingReports.length} label="Open reports" />
      </View>

      <AppCard style={styles.actionsCard}>
        <AppButton
          label="Manage all mosques"
          icon={<Building2 color={colors.white} size={16} />}
          onPress={() => router.push("/admin/mosques")}
        />
        <AppButton
          label="Review reports"
          variant="outline"
          icon={<ClipboardList color={colors.text} size={16} />}
          onPress={() => {
            if (pendingReports.length === 0) {
              Alert.alert("No pending reports", "There are no unresolved reports right now.");
              return;
            }

            const summary = pendingReports.map((report) => `${report.issueType} • ${report.mosqueId}`).join("\n");
            Alert.alert("Pending reports", summary);
          }}
        />
      </AppCard>

      <AppCard style={styles.section}>
        <Text style={styles.sectionTitle}>Recently updated mosques</Text>
        <View style={styles.list}>
          {[...mosques]
            .sort((left, right) => right.lastUpdatedAt.getTime() - left.lastUpdatedAt.getTime())
            .slice(0, 5)
            .map((mosque) => (
              <View key={mosque.id} style={styles.listRow}>
                <Text style={styles.listTitle}>{mosque.name}</Text>
                <Text style={styles.listMeta}>{mosque.lastUpdatedAt.toLocaleDateString()}</Text>
              </View>
            ))}
        </View>
      </AppCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  actionsCard: {
    gap: spacing.sm,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  list: {
    gap: spacing.sm,
  },
  listRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  listTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  listMeta: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
