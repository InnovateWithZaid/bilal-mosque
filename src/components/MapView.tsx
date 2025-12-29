import React, { useState } from 'react';
import { Building2, Navigation, Clock, ChevronRight, MapPin, Sparkles, Star } from 'lucide-react';
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
  const [hoveredMosque, setHoveredMosque] = useState<string | null>(null);
  
  // Mumbai center coordinates
  const centerLat = 19.076;
  const centerLng = 72.8777;

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-8rem)] overflow-hidden">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background/80 z-[5] pointer-events-none" />
      
      {/* OpenStreetMap Embed */}
      <div className="absolute inset-0">
        <iframe
          title="Map"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${centerLng - 0.03}%2C${centerLat - 0.02}%2C${centerLng + 0.03}%2C${centerLat + 0.02}&layer=mapnik&marker=${centerLat}%2C${centerLng}`}
          style={{ border: 0 }}
          className="opacity-95"
        />
        
        {/* Overlay for mosque markers */}
        <div className="absolute inset-0 pointer-events-none">
          {mockMosques.map((mosque, index) => (
            <button
              key={mosque.id}
              onClick={() => setSelectedMosque(mosque)}
              onMouseEnter={() => setHoveredMosque(mosque.id)}
              onMouseLeave={() => setHoveredMosque(null)}
              className={cn(
                "absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto",
                "w-12 h-12 rounded-2xl flex items-center justify-center",
                "transition-all duration-300 ease-out z-10",
                "backdrop-blur-sm border-2 animate-scale-in",
                selectedMosque?.id === mosque.id
                  ? "bg-primary shadow-xl shadow-primary/40 scale-110 border-primary-foreground/20"
                  : hoveredMosque === mosque.id
                  ? "bg-card/95 border-primary/50 shadow-lg scale-105 -translate-y-3"
                  : "bg-card/80 border-border/50 shadow-md hover:shadow-lg"
              )}
              style={{
                left: `${20 + index * 18}%`,
                top: `${30 + (index % 3) * 18}%`,
                animationDelay: `${index * 100}ms`,
              }}
            >
              <Building2 
                size={20} 
                className={cn(
                  "transition-all duration-300",
                  selectedMosque?.id === mosque.id 
                    ? "text-primary-foreground" 
                    : "text-foreground"
                )} 
              />
              
              {/* Pulse ring for selected */}
              {selectedMosque?.id === mosque.id && (
                <span className="absolute inset-0 rounded-2xl animate-ping bg-primary/30" />
              )}
              
              {/* Floating label on hover */}
              {hoveredMosque === mosque.id && selectedMosque?.id !== mosque.id && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap animate-fade-in">
                  <div className="bg-card/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-border/50">
                    <span className="text-xs font-medium text-foreground">{mosque.name}</span>
                  </div>
                  <div className="w-2 h-2 bg-card/95 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2 border-r border-b border-border/50" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Location info overlay */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <Card className="bg-card/80 backdrop-blur-xl border-border/50 shadow-xl animate-slide-up overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
                  <MapPin size={18} className="text-primary-foreground" />
                </div>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card animate-pulse" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Mumbai, Maharashtra</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles size={10} className="text-primary" />
                  {mockMosques.length} mosques nearby
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-xl bg-background/50 border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
              >
                <Navigation size={14} className="mr-1.5" />
                GPS
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick filter chips */}
      <div className="absolute bottom-28 left-4 right-4 z-20 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'Nearby', 'Jummah', 'Open Now'].map((filter, index) => (
          <Badge 
            key={filter}
            variant={index === 0 ? "default" : "secondary"}
            className={cn(
              "px-4 py-2 rounded-xl cursor-pointer transition-all duration-300 whitespace-nowrap animate-fade-in",
              "hover:scale-105 hover:shadow-md",
              index === 0 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                : "bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-primary/10 hover:border-primary/30"
            )}
            style={{ animationDelay: `${300 + index * 50}ms` }}
          >
            {filter}
          </Badge>
        ))}
      </div>

      {/* Bottom Sheet for Selected Mosque */}
      <BottomSheet
        isOpen={!!selectedMosque}
        onClose={() => setSelectedMosque(null)}
        title={selectedMosque?.name}
      >
        {selectedMosque && (
          <div className="space-y-4 animate-fade-in">
            {/* Header with rating */}
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
                <Building2 size={22} className="text-primary-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Navigation size={14} className="text-muted-foreground" />
                  <p className="text-sm text-foreground">{selectedMosque.address}</p>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="secondary" className="rounded-lg bg-green-500/10 text-green-600 border-0">
                    {selectedMosque.distance} km away
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
                {selectedMosque.type === 'mosque' ? 'Mosque' : 'Musallah'}
              </Badge>
              {selectedMosque.jummahTimes.length > 0 && (
                <Badge variant="outline" className="border-primary/30 text-primary rounded-lg transition-transform hover:scale-105">
                  Jummah: {selectedMosque.jummahTimes.join(', ')}
                </Badge>
              )}
              {selectedMosque.eidAvailable && (
                <Badge variant="outline" className="border-secondary/30 text-secondary rounded-lg transition-transform hover:scale-105">
                  Eid Available
                </Badge>
              )}
            </div>

            {/* Prayer Times */}
            <div className="bg-muted/30 rounded-2xl p-4 border border-border/30">
              <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock size={14} className="text-primary" />
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
