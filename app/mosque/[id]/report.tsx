import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Clock3, Flag, HelpCircle, MapPin, Send, XCircle } from "lucide-react-native";

import { AppButton } from "@/components/AppButton";
import { AppCard } from "@/components/AppCard";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { TextField } from "@/components/TextField";
import { useMosqueData } from "@/contexts/MosqueDataContext";
import { colors, radii, spacing, typography } from "@/lib/theme";
import type { IssueType } from "@/types";

const issueTypes: Array<{ key: IssueType; label: string; description: string; icon: React.ReactNode }> = [
  { key: "wrong_times", label: "Wrong iqamah times", description: "Prayer times are incorrect or outdated.", icon: <Clock3 color={colors.primaryDark} size={20} /> },
  { key: "wrong_location", label: "Wrong location", description: "Address or map location is incorrect.", icon: <MapPin color={colors.primaryDark} size={20} /> },
  { key: "closed", label: "Mosque closed", description: "The mosque is temporarily or permanently closed.", icon: <XCircle color={colors.danger} size={20} /> },
  { key: "other", label: "Other issue", description: "Anything else not covered above.", icon: <HelpCircle color={colors.textMuted} size={20} /> },
];

export default function ReportScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const mosqueId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { addReport, getMosqueById } = useMosqueData();
  const [selectedType, setSelectedType] = useState<IssueType | null>(null);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const mosque = getMosqueById(mosqueId);

  const handleSubmit = async () => {
    if (!selectedType) {
      Alert.alert("Choose an issue", "Please select what is wrong before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      await addReport({
        mosqueId,
        issueType: selectedType,
        description: description.trim() || "No extra details provided.",
      });
      Alert.alert("Report submitted", "Thank you for helping improve Bilal.");
      router.back();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppScreen contentContainerStyle={styles.content}>
      <AppHeader title="Report issue" subtitle={mosque?.name ?? "Flag a problem"} showBack />
      <Text style={styles.lead}>Let the team know if a timing, address, or availability detail is inaccurate so the listing stays useful for everyone.</Text>
      <View style={styles.list}>
        {issueTypes.map((issue) => (
          <Pressable key={issue.key} onPress={() => setSelectedType(issue.key)}>
            <AppCard style={[styles.issueCard, selectedType === issue.key && styles.issueCardActive]} variant={selectedType === issue.key ? "glass" : "outlined"}>
              <View style={styles.issueRow}>
                <View style={styles.issueIcon}>{issue.icon}</View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.issueTitle}>{issue.label}</Text>
                  <Text style={styles.issueText}>{issue.description}</Text>
                </View>
                {selectedType === issue.key ? <Flag color={colors.primaryDark} size={18} /> : null}
              </View>
            </AppCard>
          </Pressable>
        ))}
      </View>
      <TextField
        label="Additional details"
        value={description}
        onChangeText={setDescription}
        placeholder="Anything else the team should know?"
        multiline
      />
      <AppButton label="Submit report" icon={<Send color={colors.white} size={16} />} onPress={() => void handleSubmit()} loading={submitting} />
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
  list: {
    gap: spacing.sm,
  },
  issueCard: {},
  issueCardActive: {
    borderColor: colors.primary,
  },
  issueRow: {
    flexDirection: "row",
    gap: spacing.sm,
    alignItems: "center",
  },
  issueIcon: {
    width: 42,
    height: 42,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  issueTitle: {
    ...typography.title3,
  },
  issueText: {
    ...typography.body,
    fontSize: 13,
  },
});
