import React, { useState } from 'react';
import { Building2, Navigation, Clock, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BottomSheet } from '@/components/BottomSheet';
import { PrayerTimesList } from '@/components/PrayerTimesList';
import { Mosque } from '@/types';
import { mockMosques } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom mosque icon
const mosqueIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/5765/5765985.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const selectedMosqueIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/5765/5765985.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Component to handle map center changes
const MapController: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

export const MapView: React.FC = () => {
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);
  
  // Mumbai center coordinates
  const defaultCenter: [number, number] = [19.076, 72.8777];
  
  return (
    <div className="relative w-full h-full min-h-[calc(100vh-8rem)]">
      {/* Leaflet Map */}
      <div className="absolute inset-0">
        <MapContainer
          center={defaultCenter}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController center={selectedMosque ? [selectedMosque.lat, selectedMosque.lng] : defaultCenter} />
          
          {mockMosques.map((mosque) => (
            <Marker
              key={mosque.id}
              position={[mosque.lat, mosque.lng]}
              icon={selectedMosque?.id === mosque.id ? selectedMosqueIcon : mosqueIcon}
              eventHandlers={{
                click: () => setSelectedMosque(mosque),
              }}
            >
              <Popup>
                <div className="text-sm font-medium">{mosque.name}</div>
                <div className="text-xs text-gray-500">{mosque.distance} km away</div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Location info overlay */}
      <div className="absolute top-4 left-4 right-4 z-[1000]">
        <Card variant="glass" className="animate-scale-in">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <p className="text-sm text-muted-foreground">
                Showing {mockMosques.length} mosques nearby
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Sheet for Selected Mosque */}
      <BottomSheet
        isOpen={!!selectedMosque}
        onClose={() => setSelectedMosque(null)}
        title={selectedMosque?.name}
      >
        {selectedMosque && (
          <div className="space-y-4">
            {/* Address */}
            <div className="flex items-start gap-3">
              <Navigation size={18} className="text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-foreground">{selectedMosque.address}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedMosque.distance} km away
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary">
                {selectedMosque.type === 'mosque' ? 'Mosque' : 'Musallah'}
              </Badge>
              {selectedMosque.jummahTimes.length > 0 && (
                <Badge variant="outline" className="border-primary/30 text-primary">
                  Jummah: {selectedMosque.jummahTimes.join(', ')}
                </Badge>
              )}
              {selectedMosque.eidAvailable && (
                <Badge variant="outline" className="border-secondary/30 text-secondary">
                  Eid Available
                </Badge>
              )}
            </div>

            {/* Prayer Times */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock size={14} />
                Iqamah Times
              </h4>
              <PrayerTimesList times={selectedMosque.iqamahTimes} compact />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedMosque.lat},${selectedMosque.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="teal" className="w-full" size="default">
                  <Navigation size={16} />
                  Navigate
                </Button>
              </a>
              <Link to={`/mosque/${selectedMosque.id}`} className="flex-1">
                <Button variant="gold" className="w-full" size="default">
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
