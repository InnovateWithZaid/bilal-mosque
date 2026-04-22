import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, fonts, radii, spacing } from "@/lib/theme";

type Variant = "primary" | "outline" | "secondary" | "ghost" | "danger" | "soft";

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
        <ActivityIndicator color={variant === "outline" || variant === "ghost" || variant === "soft" ? colors.primaryDark : colors.white} />
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
    minHeight: 54,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
  },
  fullWidth: {
    width: "100%",
  },
  pressed: {
    opacity: 0.94,
    transform: [{ scale: 0.995 }],
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
    fontFamily: fonts.semiBold,
    fontSize: 15,
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
      backgroundColor: "rgba(255,255,255,0.85)",
      borderColor: colors.border,
    },
    text: {
      color: colors.text,
    },
  }),
  secondary: StyleSheet.create({
    container: {
      backgroundColor: colors.primaryDark,
      borderColor: colors.primaryDark,
    },
    text: {
      color: colors.white,
    },
  }),
  ghost: StyleSheet.create({
    container: {
      backgroundColor: "transparent",
      borderColor: "transparent",
    },
    text: {
      color: colors.primaryDark,
    },
  }),
  danger: StyleSheet.create({
    container: {
      backgroundColor: "#FFF0EE",
      borderColor: "#F3C1BC",
    },
    text: {
      color: colors.danger,
    },
  }),
  soft: StyleSheet.create({
    container: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.surfaceMuted,
    },
    text: {
      color: colors.primaryDark,
    },
  }),
} as const;
