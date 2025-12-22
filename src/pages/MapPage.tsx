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
            <h1 className="text-lg font-semibold text-foreground bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              Nearby Mosques
            </h1>
            <Button variant="secondary" size="icon" className="bg-card/80 backdrop-blur-sm">
              <Filter size={18} />
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
