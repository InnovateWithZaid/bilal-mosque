import { useLocalSearchParams } from "expo-router";

import { AdminMosqueFormScreen } from "@/screens/AdminMosqueFormScreen";

export default function EditMosqueScreen() {
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const mosqueId = Array.isArray(params.id) ? params.id[0] : params.id;

  return <AdminMosqueFormScreen mosqueId={mosqueId} />;
}
