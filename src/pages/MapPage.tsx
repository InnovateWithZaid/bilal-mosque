import React from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { MapView } from '@/components/MapView';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MapPage: React.FC = () => {
  return (
    <MobileLayout>
      <div className="relative h-full">
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-10 safe-top">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-base font-semibold text-foreground bg-card/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-soft border border-border">
              Nearby Mosques
            </h1>
            <Button variant="outline" size="icon" className="bg-card/95 backdrop-blur-sm rounded-xl shadow-soft border-border hover:bg-muted">
              <Filter size={18} className="text-foreground" />
            </Button>
          </div>
        </header>

        {/* Map */}
        <MapView />
      </div>
    </MobileLayout>
  );
};

export default MapPage;