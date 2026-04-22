import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useMemo, useRef, useState } from "react";
import MapView, { Callout, Marker, Polyline, type LatLng, type Region } from "react-native-maps";
import { LocateFixed, MapPinned, Route, X } from "lucide-react-native";
import * as Location from "expo-location";
import { useRouter } from "expo-router";

import { AppButton } from "@/components/AppButton";
import { AppCard } from "@/components/AppCard";
import { AppScreen } from "@/components/AppScreen";
import { Chip } from "@/components/Chip";
import { LoadingState } from "@/components/LoadingState";
import { MosqueCover } from "@/components/MosqueCover";
import { useMosqueData } from "@/contexts/MosqueDataContext";
import { formatDistance } from "@/lib/format";
import { openDirections } from "@/lib/maps";
import { colors, fonts, radii, spacing, typography } from "@/lib/theme";
import type { Mosque } from "@/types";

const filters = ["All", "Nearby", "Jummah", "Mosque", "Musallah", "Eidgah"] as const;

const defaultRegion: Region = {
  latitude: 12.9716,
  longitude: 77.5946,
  latitudeDelta: 0.16,
  longitudeDelta: 0.16,
};

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView | null>(null);
  const { ready, mosques } = useMosqueData();
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [routeCoords, setRouteCoords] = useState<LatLng[] | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingRoute, setLoadingRoute] = useState(false);

  const filteredMosques = useMemo(() => {
    return mosques.filter((mosque) => {
      switch (activeFilter) {
        case "Nearby":
          return (mosque.distance ?? 999) <= 3;
        case "Jummah":
          return mosque.features.jummah;
        case "Mosque":
          return mosque.type === "mosque";
        case "Musallah":
          return mosque.type === "musallah";
        case "Eidgah":
          return mosque.type === "eidgah";
        default:
          return true;
      }
    });
  }, [activeFilter, mosques]);

  if (!ready) {
    return <LoadingState label="Loading map..." />;
  }

  const locateUser = async () => {
    setLoadingLocation(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert("Location blocked", "Allow location permission to center the map around you.");
        return null;
      }

      const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const coords = { latitude: current.coords.latitude, longitude: current.coords.longitude };
      setCurrentLocation(coords);
      mapRef.current?.animateToRegion({ ...coords, latitudeDelta: 0.06, longitudeDelta: 0.06 }, 500);
      return coords;
    } catch {
      Alert.alert("Location unavailable", "We could not determine your location right now.");
      return null;
    } finally {
      setLoadingLocation(false);
    }
  };

  const showRoute = async (mosque: Mosque) => {
    const origin = currentLocation ?? (await locateUser());
    if (!origin) {
      return;
    }

    setLoadingRoute(true);
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${mosque.lng},${mosque.lat}?overview=full&geometries=geojson`,
      );
      const data = await response.json();
      const coordinates = data.routes?.[0]?.geometry?.coordinates?.map(
        ([longitude, latitude]: [number, number]) => ({ latitude, longitude }),
      ) as LatLng[] | undefined;

      if (coordinates?.length) {
        setRouteCoords(coordinates);
      } else {
        setRouteCoords([origin, { latitude: mosque.lat, longitude: mosque.lng }]);
      }
    } catch {
      setRouteCoords([origin, { latitude: mosque.lat, longitude: mosque.lng }]);
    } finally {
      setLoadingRoute(false);
    }
  };

  return (
    <AppScreen scroll={false} padded={false}>
      <View style={styles.container}>
        <MapView ref={mapRef} style={StyleSheet.absoluteFillObject} initialRegion={defaultRegion} showsUserLocation>
          {filteredMosques.map((mosque) => (
            <Marker
              key={mosque.id}
              coordinate={{ latitude: mosque.lat, longitude: mosque.lng }}
              onPress={() => setSelectedMosque(mosque)}
            >
              <Callout onPress={() => router.push(`/mosque/${mosque.id}`)}>
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>{mosque.name}</Text>
                  <Text style={styles.calloutText}>{mosque.address}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
          {routeCoords?.length ? <Polyline coordinates={routeCoords} strokeColor={colors.primaryDark} strokeWidth={4} /> : null}
        </MapView>

        <View style={styles.topOverlay}>
          <AppCard variant="glass" style={styles.titleCard}>
            <View style={styles.topRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>Mosque map</Text>
                <Text style={styles.subtitle}>Tap a pin to preview a mosque and route yourself there quickly.</Text>
              </View>
              <Pressable style={styles.iconButton} onPress={() => void locateUser()}>
                {loadingLocation ? <ActivityIndicator color={colors.primaryDark} /> : <LocateFixed color={colors.primaryDark} size={20} />}
              </Pressable>
            </View>
          </AppCard>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            {filters.map((filter) => (
              <Chip key={filter} label={filter} active={filter === activeFilter} onPress={() => setActiveFilter(filter)} />
            ))}
          </ScrollView>
        </View>

        {selectedMosque ? (
          <View style={styles.bottomOverlay}>
            <AppCard variant="image" padding={0}>
              <MosqueCover uri={selectedMosque.coverImageUri} height={162} overlay="strong">
                <View style={styles.selectedHeader}>
                  <View>
                    <Text style={styles.selectedEyebrow}>Selected mosque</Text>
                    <Text style={styles.selectedTitle}>{selectedMosque.name}</Text>
                    <Text style={styles.selectedText}>{formatDistance(selectedMosque.distance)}</Text>
                  </View>
                  <Pressable
                    style={styles.closeButton}
                    onPress={() => {
                      setSelectedMosque(null);
                      setRouteCoords(null);
                    }}
                  >
                    <X color={colors.white} size={20} />
                  </Pressable>
                </View>
              </MosqueCover>
              <View style={styles.selectedBody}>
                <Text style={styles.selectedAddress}>{selectedMosque.address}</Text>
                <View style={styles.actionRow}>
                  <AppButton
                    label={loadingRoute ? "Routing..." : "Show route"}
                    icon={<Route color={colors.white} size={16} />}
                    onPress={() => void showRoute(selectedMosque)}
                    loading={loadingRoute}
                  />
                  <AppButton
                    label="Directions"
                    variant="outline"
                    icon={<MapPinned color={colors.text} size={16} />}
                    onPress={() => void openDirections(selectedMosque)}
                  />
                </View>
                <AppButton label="Open details" variant="ghost" onPress={() => router.push(`/mosque/${selectedMosque.id}`)} />
              </View>
            </AppCard>
          </View>
        ) : null}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topOverlay: {
    position: "absolute",
    top: 14,
    left: 16,
    right: 16,
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  titleCard: {
    padding: spacing.md,
  },
  title: {
    ...typography.title2,
  },
  subtitle: {
    ...typography.body,
    fontSize: 13,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.92)",
  },
  filterRow: {
    gap: spacing.sm,
  },
  bottomOverlay: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 108,
  },
  selectedHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  selectedEyebrow: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: "rgba(255,255,255,0.72)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  selectedTitle: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.white,
    marginTop: 4,
  },
  selectedText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: "rgba(255,255,255,0.82)",
    marginTop: 4,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: radii.pill,
    backgroundColor: "rgba(12, 47, 61, 0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedBody: {
    padding: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.surface,
  },
  selectedAddress: {
    ...typography.body,
    fontSize: 13,
  },
  actionRow: {
    gap: spacing.sm,
  },
  callout: {
    width: 220,
    padding: spacing.sm,
  },
  calloutTitle: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.text,
  },
  calloutText: {
    marginTop: 4,
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.textMuted,
  },
});
