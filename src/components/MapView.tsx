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
import { cn } from '@/lib/utils';

export const MapView: React.FC = () => {
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-8rem)]">
      {/* Map Placeholder */}
      <div className="absolute inset-0 bg-muted/20 islamic-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background/90" />
        
        {/* Map markers */}
        <div className="relative w-full h-full">
          {mockMosques.map((mosque, index) => (
            <button
              key={mosque.id}
              onClick={() => setSelectedMosque(mosque)}
              className={cn(
                "absolute transform -translate-x-1/2 -translate-y-1/2",
                "w-10 h-10 rounded-full flex items-center justify-center",
                "transition-all duration-200 hover:scale-110",
                selectedMosque?.id === mosque.id
                  ? "bg-primary shadow-lg shadow-primary/30 scale-110"
                  : "bg-card border border-border shadow-md"
              )}
              style={{
                left: `${20 + index * 18}%`,
                top: `${25 + (index % 3) * 20}%`,
              }}
            >
              <Building2 
                size={18} 
                className={selectedMosque?.id === mosque.id ? "text-primary-foreground" : "text-foreground"} 
              />
            </button>
          ))}
        </div>

        {/* Center indicator */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 rounded-full bg-secondary border-2 border-foreground shadow-lg" />
          <div className="w-16 h-16 rounded-full border-2 border-secondary/50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
      </div>

      {/* Location info overlay */}
      <div className="absolute top-4 left-4 right-4">
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
            <div className="flex gap-3 pt-2">
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedMosque.lat},${selectedMosque.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="teal" className="w-full" size="lg">
                  <Navigation size={18} />
                  Navigate
                </Button>
              </a>
              <Link to={`/mosque/${selectedMosque.id}`} className="flex-1">
                <Button variant="gold" className="w-full" size="lg">
                  View Details
                  <ChevronRight size={18} />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
};
