import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";

import { colors, fonts, radii, spacing, typography } from "@/lib/theme";

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
    gap: 8,
  },
  label: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    letterSpacing: 0.3,
    color: colors.primaryDark,
  },
  hint: {
    ...typography.meta,
    color: colors.textMuted,
  },
  input: {
    minHeight: 56,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: spacing.md,
    paddingVertical: 16,
    color: colors.text,
    fontFamily: fonts.medium,
    fontSize: 15,
  },
  multiline: {
    minHeight: 126,
    textAlignVertical: "top",
  },
});
