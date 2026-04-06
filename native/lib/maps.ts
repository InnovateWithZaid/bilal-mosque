import { Alert, Linking, Platform } from "react-native";

import type { Mosque } from "@/types";

export async function openDirections(mosque: Mosque): Promise<void> {
  const label = encodeURIComponent(mosque.name);
  const androidUrl = `geo:0,0?q=${mosque.lat},${mosque.lng}(${label})`;
  const iosUrl = `http://maps.apple.com/?daddr=${mosque.lat},${mosque.lng}`;
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mosque.lat},${mosque.lng}`;

  const targetUrl = Platform.select({
    android: androidUrl,
    ios: iosUrl,
    default: googleMapsUrl,
  })!;

  try {
    const supported = await Linking.canOpenURL(targetUrl);
    await Linking.openURL(supported ? targetUrl : googleMapsUrl);
  } catch {
    Alert.alert("Navigation unavailable", "We could not open directions on this device.");
  }
}
