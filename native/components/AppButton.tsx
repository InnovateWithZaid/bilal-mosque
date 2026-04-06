import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "@/lib/theme";

type Variant = "primary" | "outline" | "secondary" | "ghost" | "danger";

type AppButtonProps = {
  label: string;
  onPress?: () => void;
  icon?: React.ReactNode;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
};

export function AppButton({
  label,
  onPress,
  icon,
  variant = "primary",
  disabled,
  loading,
  fullWidth = true,
}: AppButtonProps) {
  const textStyle = [styles.text, variantStyles[variant].text];

  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant].container,
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        pressed && !disabled && !loading && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" || variant === "ghost" ? colors.primary : colors.white} />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text style={textStyle}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 50,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    borderWidth: 1,
  },
  fullWidth: {
    width: "100%",
  },
  pressed: {
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.55,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  text: {
    fontSize: 16,
    fontWeight: "700",
  },
});

const variantStyles = {
  primary: StyleSheet.create({
    container: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    text: {
      color: colors.white,
    },
  }),
  outline: StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    text: {
      color: colors.text,
    },
  }),
  secondary: StyleSheet.create({
    container: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.surfaceMuted,
    },
    text: {
      color: colors.secondary,
    },
  }),
  ghost: StyleSheet.create({
    container: {
      backgroundColor: "transparent",
      borderColor: "transparent",
    },
    text: {
      color: colors.primary,
    },
  }),
  danger: StyleSheet.create({
    container: {
      backgroundColor: "#FCE8E4",
      borderColor: "#F8C7B6",
    },
    text: {
      color: colors.danger,
    },
  }),
} as const;
