import React, { useState, useCallback } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { MosqueCard } from '@/components/MosqueCard';
import { LocationHeader } from '@/components/LocationHeader';
import { PullToRefresh } from '@/components/PullToRefresh';
import { mockMosques } from '@/data/mockData';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBangaloreTime } from '@/hooks/useBangaloreTime';
import { useNextPrayer } from '@/hooks/useNextPrayer';
import { useToast } from '@/hooks/use-toast';
import { Mosque, PrayerName } from '@/types';

const filters = ['All', 'Mosque', 'Musallah', 'Eidgah', 'Jummah', 'Eid'];

const prayerLabels: Record<PrayerName, string> = {
  fajr: 'Fajr',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

// Wrapper component to use hook for each mosque
const MosqueCardWithPrayer: React.FC<{ mosque: Mosque; currentTime: Date }> = ({ mosque, currentTime }) => {
  const nextPrayer = useNextPrayer(mosque.iqamahTimes, currentTime);
  
  return (
    <MosqueCard
      mosque={mosque}
      nextPrayer={prayerLabels[nextPrayer.prayer]}
      athanTime={mosque.athanTimes[nextPrayer.prayer]}
      iqamahTime={nextPrayer.time}
      countdown={nextPrayer.countdown}
      minutesUntil={nextPrayer.minutesUntil}
    />
  );
};

const MosquesListPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const { currentTime } = useBangaloreTime();
  const { toast } = useToast();

  const handleRefresh = useCallback(async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      title: "Updated",
      description: "Mosque list refreshed",
    });
  }, [toast]);

  const filteredMosques = mockMosques.filter((mosque) => {
    const matchesSearch = mosque.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = 
      activeFilter === 'All' ||
      (activeFilter === 'Mosque' && mosque.type === 'mosque') ||
      (activeFilter === 'Musallah' && mosque.type === 'musallah') ||
      (activeFilter === 'Eidgah' && mosque.type === 'eidgah') ||
      (activeFilter === 'Jummah' && mosque.features.jummah) ||
      (activeFilter === 'Eid' && mosque.features.eidPrayer);
    return matchesSearch && matchesFilter;
  });

  return (
    <MobileLayout>
      <PullToRefresh onRefresh={handleRefresh} className="safe-top bg-surface min-h-screen h-full">
        {/* Header */}
        <header className="px-4 pt-5 pb-3">
          <h1 className="text-2xl font-bold text-foreground">Mosques</h1>
        </header>

        <div className="px-4 mb-3">
          <LocationHeader 
            location="Bangalore, Karnataka" 
            subtext="3 km radius"
          />
        </div>

        {/* Search and Filter */}
        <div className="px-4 py-3 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search mosques..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-card border border-border rounded-xl shadow-soft focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              className={`rounded-xl border-border shadow-soft transition-colors ${showFilters ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'hover:bg-muted'}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={18} className={showFilters ? 'text-primary-foreground' : 'text-foreground'} />
            </Button>
          </div>

          {/* Filter Pills - Toggle visibility */}
          {showFilters && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide animate-fade-in">
              {filters.map((filter) => (
                <Badge
                  key={filter}
                  variant={activeFilter === filter ? "default" : "outline"}
                  className={`cursor-pointer whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeFilter === filter 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Mosques List */}
        <div className="px-4 pb-4 space-y-6">
          <p className="text-xs text-muted-foreground">
            {filteredMosques.length} results
          </p>
          {filteredMosques.map((mosque) => (
            <MosqueCardWithPrayer
              key={mosque.id}
              mosque={mosque}
              currentTime={currentTime}
            />
          ))}
        </div>
      </PullToRefresh>
    </MobileLayout>
  );
};

export default MosquesListPage;