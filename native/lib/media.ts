import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";

const COVER_DIRECTORY = FileSystem.documentDirectory ? `${FileSystem.documentDirectory}mosque-covers/` : null;

function inferExtension(fileName?: string | null, mimeType?: string | null) {
  if (fileName?.includes(".")) {
    return fileName.split(".").pop()?.toLowerCase() ?? "jpg";
  }

  switch (mimeType) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "jpg";
  }
}

async function ensureCoverDirectoryAsync() {
  if (!COVER_DIRECTORY) {
    return null;
  }

  const info = await FileSystem.getInfoAsync(COVER_DIRECTORY);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(COVER_DIRECTORY, { intermediates: true });
  }

  return COVER_DIRECTORY;
}

export function isManagedMosqueCoverUri(uri?: string) {
  return Boolean(COVER_DIRECTORY && uri?.startsWith(COVER_DIRECTORY));
}

export async function deleteManagedMosqueCoverAsync(uri?: string) {
  if (!uri || !isManagedMosqueCoverUri(uri)) {
    return;
  }

  const info = await FileSystem.getInfoAsync(uri);
  if (info.exists) {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  }
}

export async function persistMosqueCoverAsync(sourceUri: string, fileName?: string | null, mimeType?: string | null) {
  if (!sourceUri || Platform.OS === "web") {
    return sourceUri;
  }

  const directory = await ensureCoverDirectoryAsync();
  if (!directory) {
    return sourceUri;
  }

  const extension = inferExtension(fileName, mimeType);
  const targetUri = `${directory}${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

  await FileSystem.copyAsync({
    from: sourceUri,
    to: targetUri,
  });

  return targetUri;
}

export async function pickMosqueCoverImageAsync() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (permission.status !== "granted") {
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [16, 10],
    quality: 0.88,
  });

  if (result.canceled || result.assets.length === 0) {
    return null;
  }

  const asset = result.assets[0];
  const uri = await persistMosqueCoverAsync(asset.uri, asset.fileName, asset.mimeType);

  return {
    uri,
    width: asset.width,
    height: asset.height,
  };
}
