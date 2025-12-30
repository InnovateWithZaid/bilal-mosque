import React, { useState } from 'react';
import { ArrowLeft, MapPin, Search, Navigation, Clock, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const recentLocations = [
  { id: '1', name: 'Bangalore, Karnataka', subtext: 'Current location' },
  { id: '2', name: 'Indiranagar, Bangalore', subtext: 'Last visited' },
  { id: '3', name: 'Koramangala, Bangalore', subtext: '2 days ago' },
];

const popularAreas = [
  'Indiranagar',
  'Koramangala',
  'Shivajinagar',
  'Jayanagar',
  'Whitefield',
  'HSR Layout',
];

const LocationPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState('1');

  const handleSelectLocation = (id: string) => {
    setSelectedId(id);
    setTimeout(() => navigate('/'), 300);
  };

  return (
    <div className="min-h-screen bg-background safe-top">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-xl z-10 border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">
            Select Location
          </h1>
        </div>

        {/* Search */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for an area or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 bg-muted border-0"
            />
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Use Current Location */}
        <Card variant="interactive" className="animate-fade-in">
          <CardContent className="p-4">
            <button 
              className="flex items-center gap-3 w-full text-left"
              onClick={() => handleSelectLocation('current')}
            >
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                <Navigation size={20} className="text-secondary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Use current location</p>
                <p className="text-xs text-muted-foreground">Enable GPS to auto-detect</p>
              </div>
              <div className="w-5 h-5 rounded-full border border-primary flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>
            </button>
          </CardContent>
        </Card>

        {/* Recent Locations */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Clock size={14} className="text-muted-foreground" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Recent
            </h2>
          </div>
          <Card variant="elevated">
            <CardContent className="p-0 divide-y divide-border">
              {recentLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleSelectLocation(location.id)}
                  className={cn(
                    "flex items-center gap-3 w-full p-4 text-left transition-colors",
                    "hover:bg-muted/50 active:bg-muted"
                  )}
                >
                  <MapPin size={18} className="text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {location.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {location.subtext}
                    </p>
                  </div>
                  {selectedId === location.id && (
                    <Check size={18} className="text-primary" />
                  )}
                </button>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Popular Areas */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Popular Areas
          </h2>
          <div className="flex flex-wrap gap-2">
            {popularAreas.map((area) => (
              <Button
                key={area}
                variant="outline"
                size="sm"
                onClick={() => setSearch(area)}
                className="rounded-full"
              >
                {area}
              </Button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LocationPage;
