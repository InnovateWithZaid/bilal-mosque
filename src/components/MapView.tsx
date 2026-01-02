import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Building2, Navigation, Clock, ChevronRight, MapPin, Sparkles, Star, Loader2, Filter, X, Route } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BottomSheet } from '@/components/BottomSheet';
import { PrayerTimesList } from '@/components/PrayerTimesList';
import { Mosque } from '@/types';
import { mockMosques } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Supercluster from 'supercluster';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom mosque marker icon
const createMosqueIcon = (isSelected: boolean, type: string) => {
  const color = isSelected ? '#16a34a' : type === 'eidgah' ? '#eab308' : type === 'musallah' ? '#8b5cf6' : '#0d9488';
  const size = isSelected ? 44 : 36;
  
  return L.divIcon({
    className: 'custom-mosque-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px ${color}40;
        border: 2px solid white;
        transition: all 0.2s ease;
        ${isSelected ? 'transform: scale(1.1);' : ''}
      ">
        <svg width="${isSelected ? 22 : 18}" height="${isSelected ? 22 : 18}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 21h18"/>
          <path d="M9 21v-4a3 3 0 0 1 6 0v4"/>
          <path d="M12 7c1.66 0 3-1.34 3-3V2h-6v2c0 1.66 1.34 3 3 3z"/>
          <path d="M12 7v2"/>
          <path d="M5 21V9.7c0-.27.11-.52.3-.71l6-6a1 1 0 0 1 1.4 0l6 6c.19.19.3.44.3.71V21"/>
        </svg>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Cluster icon
const createClusterIcon = (count: number) => {
  const size = Math.min(60, 40 + count * 2);
  return L.divIcon({
    className: 'custom-cluster-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(135deg, #0d9488, #14b8a6);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 16px rgba(13, 148, 136, 0.4);
        border: 3px solid white;
        font-weight: 700;
        font-size: ${size > 50 ? 16 : 14}px;
        color: white;
      ">
        ${count}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// User location icon
const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div style="
      width: 24px;
      height: 24px;
      background: #3b82f6;
      border-radius: 50%;
      border: 4px solid white;
      box-shadow: 0 0 0 2px #3b82f6, 0 4px 12px rgba(59, 130, 246, 0.5);
    ">
      <div style="
        width: 100%;
        height: 100%;
        background: #3b82f6;
        border-radius: 50%;
        animation: pulse 2s infinite;
      "></div>
    </div>
    <style>
      @keyframes pulse {
        0% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(1.5); }
        100% { opacity: 1; transform: scale(1); }
      }
    </style>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

type FilterType = 'All' | 'Nearby' | 'Jummah' | 'Open Now' | 'Mosque' | 'Musallah' | 'Eidgah';

// Map event handler component - uses refs to prevent infinite loops
const MapEventHandler: React.FC<{
  onBoundsChange: (bounds: L.LatLngBounds, zoom: number) => void;
}> = ({ onBoundsChange }) => {
  const map = useMap();
  const callbackRef = useRef(onBoundsChange);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initializedRef = useRef(false);
  
  // Keep callback ref updated
  callbackRef.current = onBoundsChange;
  
  useEffect(() => {
    const handleMove = () => {
      // Debounce updates to prevent rapid state changes
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(map.getBounds(), map.getZoom());
      }, 100);
    };
    
    map.on('moveend', handleMove);
    map.on('zoomend', handleMove);
    
    // Initial call only once
    if (!initializedRef.current) {
      initializedRef.current = true;
      callbackRef.current(map.getBounds(), map.getZoom());
    }
    
    return () => {
      map.off('moveend', handleMove);
      map.off('zoomend', handleMove);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [map]);
  
  return null;
};

// Fly to location component - clears position after flying
const FlyToLocation: React.FC<{ 
  position: [number, number] | null; 
  zoom?: number;
  onComplete?: () => void;
}> = ({ position, zoom = 14, onComplete }) => {
  const map = useMap();
  const lastPositionRef = useRef<string | null>(null);
  
  useEffect(() => {
    if (position) {
      const posKey = `${position[0]},${position[1]}`;
      // Only fly if position changed
      if (lastPositionRef.current !== posKey) {
        lastPositionRef.current = posKey;
        map.flyTo(position, zoom, { duration: 1.5 });
        // Clear after animation
        if (onComplete) {
          setTimeout(onComplete, 1600);
        }
      }
    }
  }, [map, position, zoom, onComplete]);
  
  return null;
};

export const MapView: React.FC = () => {
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
  const [mapZoom, setMapZoom] = useState(13);
  const [flyToPosition, setFlyToPosition] = useState<[number, number] | null>(null);
  const [routeCoords, setRouteCoords] = useState<[number, number][] | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  
  // Bangalore center coordinates
  const defaultCenter: [number, number] = [12.9716, 77.5946];
  
  // Get user location
  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation: [number, number] = [position.coords.latitude, position.coords.longitude];
        setUserLocation(newLocation);
        setFlyToPosition(newLocation);
        setIsLocating(false);
        
        // Update distances based on user location
        mockMosques.forEach(mosque => {
          mosque.distance = calculateDistance(
            newLocation[0], newLocation[1],
            mosque.lat, mosque.lng
          );
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        setIsLocating(false);
        alert('Unable to get your location. Please enable location services.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);
  
  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };
  
  // Filter mosques based on active filter
  const filteredMosques = useMemo(() => {
    let filtered = [...mockMosques];
    
    switch (activeFilter) {
      case 'Nearby':
        if (userLocation) {
          filtered = filtered
            .map(m => ({
              ...m,
              distance: calculateDistance(userLocation[0], userLocation[1], m.lat, m.lng)
            }))
            .filter(m => m.distance <= 3)
            .sort((a, b) => a.distance - b.distance);
        }
        break;
      case 'Jummah':
        filtered = filtered.filter(m => m.features.jummah && m.jummahTimes && m.jummahTimes.length > 0);
        break;
      case 'Open Now':
        // Simple check - in real app would compare current time with prayer times
        filtered = filtered.filter(m => m.features.dailyCongregation);
        break;
      case 'Mosque':
        filtered = filtered.filter(m => m.type === 'mosque');
        break;
      case 'Musallah':
        filtered = filtered.filter(m => m.type === 'musallah');
        break;
      case 'Eidgah':
        filtered = filtered.filter(m => m.type === 'eidgah');
        break;
    }
    
    return filtered;
  }, [activeFilter, userLocation]);
  
  // Supercluster for marker clustering
  const supercluster = useMemo(() => {
    const cluster = new Supercluster({
      radius: 60,
      maxZoom: 17,
    });
    
    const points = filteredMosques.map(mosque => ({
      type: 'Feature' as const,
      properties: { mosque },
      geometry: {
        type: 'Point' as const,
        coordinates: [mosque.lng, mosque.lat],
      },
    }));
    
    cluster.load(points);
    return cluster;
  }, [filteredMosques]);
  
  // Get clusters for current bounds
  const clusters = useMemo(() => {
    if (!mapBounds) return [];
    
    const bounds: [number, number, number, number] = [
      mapBounds.getWest(),
      mapBounds.getSouth(),
      mapBounds.getEast(),
      mapBounds.getNorth(),
    ];
    
    return supercluster.getClusters(bounds, Math.floor(mapZoom));
  }, [supercluster, mapBounds, mapZoom]);
  
  // Handle bounds change
  const handleBoundsChange = useCallback((bounds: L.LatLngBounds, zoom: number) => {
    setMapBounds(bounds);
    setMapZoom(zoom);
  }, []);
  
  // Get route using OSRM (free routing service)
  const getRoute = useCallback(async (mosque: Mosque) => {
    if (!userLocation) {
      handleGetLocation();
      return;
    }
    
    setIsLoadingRoute(true);
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${userLocation[1]},${userLocation[0]};${mosque.lng},${mosque.lat}?overview=full&geometries=geojson`
      );
      const data = await response.json();
      
      if (data.routes && data.routes[0]) {
        const coords = data.routes[0].geometry.coordinates.map(
          (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
        );
        setRouteCoords(coords);
        setSelectedMosque(mosque);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
      // Fallback to straight line
      setRouteCoords([[userLocation[0], userLocation[1]], [mosque.lat, mosque.lng]]);
    } finally {
      setIsLoadingRoute(false);
    }
  }, [userLocation, handleGetLocation]);
  
  // Clear route
  const clearRoute = useCallback(() => {
    setRouteCoords(null);
  }, []);

  // Clear fly position after animation completes
  const clearFlyToPosition = useCallback(() => {
    setFlyToPosition(null);
  }, []);

  const filters: FilterType[] = ['All', 'Nearby', 'Jummah', 'Open Now', 'Mosque', 'Musallah', 'Eidgah'];

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden">
      {/* Leaflet Map */}
      <MapContainer
        center={defaultCenter}
        zoom={13}
        className="absolute inset-0 z-0"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        <MapEventHandler onBoundsChange={handleBoundsChange} />
        <FlyToLocation position={flyToPosition} onComplete={clearFlyToPosition} />
        
        {/* User location marker */}
        {userLocation && (
          <>
            <Marker position={userLocation} icon={userLocationIcon} />
            <Circle
              center={userLocation}
              radius={200}
              pathOptions={{
                color: '#3b82f6',
                fillColor: '#3b82f6',
                fillOpacity: 0.1,
                weight: 2,
              }}
            />
          </>
        )}
        
        {/* Route polyline */}
        {routeCoords && (
          <Polyline
            positions={routeCoords}
            pathOptions={{
              color: '#0d9488',
              weight: 5,
              opacity: 0.8,
              dashArray: '10, 10',
            }}
          />
        )}
        
        {/* Mosque markers / clusters */}
        {clusters.map((cluster, index) => {
          const [lng, lat] = cluster.geometry.coordinates;
          const isCluster = cluster.properties.cluster;
          
          if (isCluster) {
            const count = cluster.properties.point_count;
            return (
              <Marker
                key={`cluster-${cluster.id}`}
                position={[lat, lng]}
                icon={createClusterIcon(count)}
                eventHandlers={{
                  click: () => {
                    const expansionZoom = Math.min(
                      supercluster.getClusterExpansionZoom(cluster.id as number),
                      17
                    );
                    setFlyToPosition([lat, lng]);
                    setMapZoom(expansionZoom);
                  },
                }}
              />
            );
          }
          
          const mosque = cluster.properties.mosque as Mosque;
          const isSelected = selectedMosque?.id === mosque.id;
          
          return (
            <Marker
              key={mosque.id}
              position={[mosque.lat, mosque.lng]}
              icon={createMosqueIcon(isSelected, mosque.type)}
              eventHandlers={{
                click: () => {
                  setSelectedMosque(mosque);
                  clearRoute();
                },
              }}
            >
              <Popup className="mosque-popup">
                <div className="font-medium text-sm">{mosque.name}</div>
                <div className="text-xs text-muted-foreground">{mosque.distance} km away</div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Location info overlay */}
      <div className="absolute top-4 left-4 right-4 z-[1000]">
        <Card className="bg-card/90 backdrop-blur-xl border-border/50 shadow-xl animate-slide-up overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
                  <MapPin size={18} className="text-primary-foreground" />
                </div>
                {userLocation && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card animate-pulse" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {userLocation ? 'Your Location' : 'Bangalore, Karnataka'}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles size={10} className="text-primary" />
                  {filteredMosques.length} mosques {activeFilter !== 'All' ? `(${activeFilter})` : 'nearby'}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl bg-background/50 border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
                onClick={handleGetLocation}
                disabled={isLocating}
              >
                {isLocating ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <>
                    <Navigation size={14} className="mr-1.5" />
                    GPS
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Route info banner */}
      {routeCoords && (
        <div className="absolute top-24 left-4 right-4 z-[1000]">
          <Card className="bg-primary/90 backdrop-blur-xl border-0 shadow-xl">
            <CardContent className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary-foreground">
                <Route size={16} />
                <span className="text-sm font-medium">Route to {selectedMosque?.name}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={clearRoute}
              >
                <X size={16} />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick filter chips - positioned above bottom nav */}
      <div className="absolute bottom-4 left-0 right-0 z-[1000] px-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter) => (
            <Badge 
              key={filter}
              variant={activeFilter === filter ? "default" : "secondary"}
              className={cn(
                "px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-300 whitespace-nowrap text-sm font-medium",
                "hover:scale-105",
                activeFilter === filter 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                  : "bg-card text-foreground border border-border shadow-md hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-lg hover:shadow-primary/25"
              )}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </Badge>
          ))}
        </div>
      </div>

      {/* Bottom Sheet for Selected Mosque */}
      <BottomSheet
        isOpen={!!selectedMosque}
        onClose={() => {
          setSelectedMosque(null);
          clearRoute();
        }}
        title={selectedMosque?.name}
      >
        {selectedMosque && (
          <div className="space-y-4 animate-fade-in">
            {/* Header with rating */}
            <div className="flex items-start gap-3">
              <div className={cn(
                "p-3 rounded-2xl shadow-lg",
                selectedMosque.type === 'eidgah' 
                  ? "bg-gradient-to-br from-yellow-500 to-yellow-600" 
                  : selectedMosque.type === 'musallah'
                  ? "bg-gradient-to-br from-violet-500 to-violet-600"
                  : "bg-gradient-to-br from-primary to-primary/80 shadow-primary/25"
              )}>
                <Building2 size={22} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Navigation size={14} className="text-muted-foreground" />
                  <p className="text-sm text-foreground">{selectedMosque.address}</p>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="secondary" className="rounded-lg bg-green-500/10 text-green-600 border-0">
                    {userLocation 
                      ? `${calculateDistance(userLocation[0], userLocation[1], selectedMosque.lat, selectedMosque.lng)} km away`
                      : `${selectedMosque.distance} km away`
                    }
                  </Badge>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star size={14} fill="currentColor" />
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="rounded-lg transition-transform hover:scale-105">
                {selectedMosque.type === 'mosque' ? '🕌 Mosque' : selectedMosque.type === 'eidgah' ? '🌙 Eidgah' : '🧎 Musallah'}
              </Badge>
              {selectedMosque.features.jummah && selectedMosque.jummahTimes && selectedMosque.jummahTimes.length > 0 && (
                <Badge variant="outline" className="border-primary/30 text-primary rounded-lg transition-transform hover:scale-105">
                  Jummah: {selectedMosque.jummahTimes.join(', ')}
                </Badge>
              )}
              {selectedMosque.features.eidPrayer && (
                <Badge variant="outline" className="border-secondary/30 text-secondary rounded-lg transition-transform hover:scale-105">
                  Eid Available
                </Badge>
              )}
            </div>
            
            {/* Musallah helper text */}
            {selectedMosque.type === 'musallah' && (
              <p className="text-xs text-muted-foreground italic">
                Congregation availability varies
              </p>
            )}
            
            {/* Eidgah helper text */}
            {selectedMosque.type === 'eidgah' && (
              <p className="text-xs text-muted-foreground italic">
                Eid adhan only · Khutbah included
              </p>
            )}

            {/* Prayer Times - Only show if dailyCongregation is true */}
            {selectedMosque.features.dailyCongregation && (
              <div className="bg-muted/30 rounded-2xl p-4 border border-border/30">
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Clock size={14} className="text-primary" />
                  Prayer Times
                </h4>
                <PrayerTimesList 
                  athanTimes={selectedMosque.athanTimes} 
                  iqamahTimes={selectedMosque.iqamahTimes} 
                  compact 
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
              <Button 
                variant="outline" 
                className="flex-1 rounded-xl h-12 transition-all duration-300 hover:shadow-lg"
                onClick={() => getRoute(selectedMosque)}
                disabled={isLoadingRoute}
              >
                {isLoadingRoute ? (
                  <Loader2 size={16} className="animate-spin mr-2" />
                ) : (
                  <Route size={16} className="mr-2" />
                )}
                Show Route
              </Button>
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedMosque.lat},${selectedMosque.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="teal" className="w-full rounded-xl h-12 transition-all duration-300 hover:shadow-lg" size="default">
                  <Navigation size={16} />
                  Navigate
                </Button>
              </a>
              <Link to={`/mosque/${selectedMosque.id}`} className="flex-1">
                <Button variant="gold" className="w-full rounded-xl h-12 transition-all duration-300 hover:shadow-lg shadow-primary/20" size="default">
                  View Details
                  <ChevronRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
};
