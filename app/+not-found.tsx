import { useRouter } from "expo-router";
import { CircleAlert } from "lucide-react-native";

import { AppButton } from "@/components/AppButton";
import { AppHeader } from "@/components/AppHeader";
import { AppScreen } from "@/components/AppScreen";
import { EmptyState } from "@/components/EmptyState";
import { colors } from "@/lib/theme";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <AppScreen>
      <AppHeader title="Page not found" showBack />
      <EmptyState
        icon={<CircleAlert color={colors.danger} size={36} />}
        title="This screen does not exist"
        description="The route you opened is not part of the Expo app."
      />
      <AppButton label="Go home" onPress={() => router.replace("/")} />
    </AppScreen>
  );
}
