import React, { useState } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { MosqueCard } from '@/components/MosqueCard';
import { LocationHeader } from '@/components/LocationHeader';
import { mockMosques } from '@/data/mockData';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBangaloreTime } from '@/hooks/useBangaloreTime';
import { useNextPrayer } from '@/hooks/useNextPrayer';
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
      nextTime={nextPrayer.time}
      countdown={nextPrayer.countdown}
      minutesUntil={nextPrayer.minutesUntil}
    />
  );
};

const MosquesListPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const { currentTime } = useBangaloreTime();

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
      <div className="safe-top">
        {/* Header */}
        <header className="px-4 pt-4 pb-2">
          <h1 className="text-xl font-bold text-foreground">Mosques</h1>
        </header>

        <LocationHeader 
          location="Bangalore, Karnataka" 
          subtext="3 km radius"
        />

        {/* Search and Filter */}
        <div className="px-4 py-3 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search mosques..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-muted border-0"
              />
            </div>
            <Button variant="outline" size="icon">
              <SlidersHorizontal size={18} />
            </Button>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {filters.map((filter) => (
              <Badge
                key={filter}
                variant={activeFilter === filter ? "default" : "outline"}
                className="cursor-pointer whitespace-nowrap px-3 py-1.5"
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </Badge>
            ))}
          </div>
        </div>

        {/* Mosques List */}
        <div className="px-4 pb-4 space-y-3">
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
      </div>
    </MobileLayout>
  );
};

export default MosquesListPage;
