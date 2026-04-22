import { Pressable, StyleSheet, Text } from "react-native";

import { colors, fonts, radii, spacing } from "@/lib/theme";

type ChipProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

export function Chip({ label, active, onPress }: ChipProps) {
  return (
    <Pressable onPress={onPress} style={[styles.base, active ? styles.active : styles.inactive]}>
      <Text style={[styles.text, active ? styles.activeText : styles.inactiveText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
  },
  active: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  inactive: {
    backgroundColor: "rgba(255,255,255,0.88)",
    borderColor: colors.border,
  },
  text: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
  },
  activeText: {
    color: colors.white,
  },
  inactiveText: {
    color: colors.primaryDark,
  },
});
