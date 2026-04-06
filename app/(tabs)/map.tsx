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
import { useMosqueData } from "@/contexts/MosqueDataContext";
import { formatDistance } from "@/lib/format";
import { openDirections } from "@/lib/maps";
import { colors, radii, spacing } from "@/lib/theme";
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
          <View style={styles.topRow}>
            <View style={styles.titleCard}>
              <Text style={styles.title}>Mosque map</Text>
              <Text style={styles.subtitle}>Native map with location-aware discovery.</Text>
            </View>
            <Pressable style={styles.iconButton} onPress={() => void locateUser()}>
              {loadingLocation ? <ActivityIndicator color={colors.primary} /> : <LocateFixed color={colors.primary} size={20} />}
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            {filters.map((filter) => (
              <Chip key={filter} label={filter} active={filter === activeFilter} onPress={() => setActiveFilter(filter)} />
            ))}
          </ScrollView>
        </View>

        {selectedMosque ? (
          <View style={styles.bottomOverlay}>
            <AppCard>
              <View style={styles.selectedHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.selectedTitle}>{selectedMosque.name}</Text>
                  <Text style={styles.selectedText}>{formatDistance(selectedMosque.distance)}</Text>
                </View>
                <Pressable onPress={() => { setSelectedMosque(null); setRouteCoords(null); }}>
                  <X color={colors.textMuted} size={20} />
                </Pressable>
              </View>
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
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.lg,
    backgroundColor: "rgba(255,255,255,0.96)",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.96)",
  },
  filterRow: {
    gap: spacing.sm,
  },
  bottomOverlay: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 20,
  },
  selectedHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  selectedTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.text,
  },
  selectedText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  selectedAddress: {
    marginTop: spacing.xs,
    fontSize: 13,
    color: colors.textMuted,
  },
  actionRow: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  callout: {
    width: 220,
    padding: spacing.sm,
  },
  calloutTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  calloutText: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textMuted,
  },
});
