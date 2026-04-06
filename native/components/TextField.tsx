import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";

import { colors, radii, spacing } from "@/lib/theme";

type TextFieldProps = {
  label?: string;
  hint?: string;
} & TextInputProps;

export function TextField({ label, hint, style, multiline, ...props }: TextFieldProps) {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[styles.input, multiline && styles.multiline, style]}
        multiline={multiline}
        {...props}
      />
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  hint: {
    fontSize: 12,
    color: colors.textMuted,
  },
  input: {
    minHeight: 50,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    color: colors.text,
    fontSize: 15,
  },
  multiline: {
    minHeight: 110,
    textAlignVertical: "top",
  },
});
