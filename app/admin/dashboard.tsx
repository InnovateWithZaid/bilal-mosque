import { Redirect, useRouter } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Building2, ClipboardList, LogOut } from "lucide-react-native";

import { AppButton } from "@/components/AppButton";
import { AppCard } from "@/components/AppCard";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { LoadingState } from "@/components/LoadingState";
import { MosqueCover } from "@/components/MosqueCover";
import { StatCard } from "@/components/StatCard";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useMosqueData } from "@/contexts/MosqueDataContext";
import { colors, fonts, radii, spacing, typography } from "@/lib/theme";

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
  const recentlyUpdated = [...mosques].sort((left, right) => right.lastUpdatedAt.getTime() - left.lastUpdatedAt.getTime()).slice(0, 4);

  return (
    <AppScreen contentContainerStyle={styles.content}>
      <AppHeader
        title="Admin dashboard"
        subtitle="Manage mosque records stored in the native app"
        rightAction={
          <Pressable
            style={styles.logoutButton}
            onPress={() => {
              void logout();
              router.replace("/admin/login");
            }}
          >
            <LogOut color={colors.primaryDark} size={18} />
          </Pressable>
        }
      />

      <AppCard variant="glass" style={styles.hero}>
        <Text style={styles.heroEyebrow}>Core admin</Text>
        <Text style={styles.heroTitle}>Oversee mosque records, timing quality, and local edits in one place.</Text>
      </AppCard>

      <View style={styles.statsRow}>
        <StatCard value={mosques.length} label="Locations" />
        <StatCard value={pendingReports.length} label="Open reports" />
      </View>

      <AppCard variant="outlined" style={styles.actionsCard}>
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

            const summary = pendingReports.map((report) => `${report.issueType} / ${report.mosqueId}`).join("\n");
            Alert.alert("Pending reports", summary);
          }}
        />
      </AppCard>

      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>Recently updated mosques</Text>
        <View style={styles.list}>
          {recentlyUpdated.map((mosque) => (
            <AppCard key={mosque.id} variant="image" padding={0}>
              <View style={styles.listRow}>
                <MosqueCover uri={mosque.coverImageUri} height={84} radius={radii.lg} style={styles.thumb} overlay="soft" />
                <View style={styles.listCopy}>
                  <Text style={styles.listTitle}>{mosque.name}</Text>
                  <Text style={styles.listMeta}>{mosque.lastUpdatedAt.toLocaleDateString()}</Text>
                </View>
              </View>
            </AppCard>
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
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.92)",
    borderWidth: 1,
    borderColor: colors.border,
  },
  hero: {
    gap: spacing.xs,
  },
  heroEyebrow: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  heroTitle: {
    ...typography.title1,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  actionsCard: {
    gap: spacing.sm,
  },
  listSection: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.title2,
  },
  list: {
    gap: spacing.sm,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.sm,
  },
  thumb: {
    width: 110,
  },
  listCopy: {
    flex: 1,
    gap: 4,
  },
  listTitle: {
    ...typography.title3,
  },
  listMeta: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textMuted,
  },
});
