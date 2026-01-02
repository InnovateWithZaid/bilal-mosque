import React, { useState, useCallback } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { LocationHeader } from '@/components/LocationHeader';
import { MosqueCard } from '@/components/MosqueCard';
import { PullToRefresh } from '@/components/PullToRefresh';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Heart, Building2 } from 'lucide-react';
import { useFavorites } from '@/contexts/FavoritesContext';
import { mockMosques } from '@/data/mockData';
import { useBangaloreTime } from '@/hooks/useBangaloreTime';
import { useNextPrayer } from '@/hooks/useNextPrayer';
import { useToast } from '@/hooks/use-toast';
import { Mosque, PrayerName } from '@/types';
import { Link } from 'react-router-dom';

const prayerLabels: Record<PrayerName, string> = {
  fajr: 'Fajr',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

const MosqueCardWithPrayer: React.FC<{ mosque: Mosque }> = ({ mosque }) => {
  const { currentTime } = useBangaloreTime();
  const nextPrayer = useNextPrayer(mosque.iqamahTimes, currentTime);

  return (
    <MosqueCard 
      mosque={mosque}
      nextPrayer={nextPrayer.prayer ? prayerLabels[nextPrayer.prayer] : undefined}
      athanTime={nextPrayer.prayer ? mosque.athanTimes[nextPrayer.prayer] : undefined}
      iqamahTime={nextPrayer.time}
      countdown={nextPrayer.countdown}
      minutesUntil={nextPrayer.minutesUntil}
    />
  );
};

const FavoritesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const { favorites } = useFavorites();
  const { toast } = useToast();

  const handleRefresh = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: "Favorites refreshed",
      description: "Your favorites list is up to date",
    });
  }, [toast]);

  const favoriteMosques = mockMosques.filter(mosque => favorites.includes(mosque.id));
  
  const filteredMosques = favoriteMosques.filter(mosque =>
    mosque.name.toLowerCase().includes(search.toLowerCase()) ||
    mosque.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MobileLayout>
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="safe-top pb-8 bg-surface min-h-screen">
          <LocationHeader location="Bangalore, Karnataka" />

          {/* Header */}
          <header className="px-4 pt-2 pb-4">
            <div className="flex items-center gap-2">
              <Heart size={24} className="text-primary fill-primary" />
              <h1 className="text-xl font-bold text-foreground">Favorites</h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {favorites.length} {favorites.length === 1 ? 'mosque' : 'mosques'} saved
            </p>
          </header>

          <div className="px-4 space-y-4">
            {/* Search */}
            {favorites.length > 0 && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type="text"
                  placeholder="Search favorites..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 rounded-xl bg-card border-border h-12"
                />
              </div>
            )}

            {/* Empty State */}
            {favorites.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
                  <Heart size={40} className="text-muted-foreground" />
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  No favorites yet
                </h2>
                <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                  Tap the heart on any mosque to add it here for quick access
                </p>
                <Link to="/mosques">
                  <Button className="rounded-xl gap-2">
                    <Building2 size={18} />
                    Browse Mosques
                  </Button>
                </Link>
              </div>
            )}

            {/* No Search Results */}
            {favorites.length > 0 && filteredMosques.length === 0 && search && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">
                  No favorites match "{search}"
                </p>
              </div>
            )}

            {/* Mosque List */}
            {filteredMosques.length > 0 && (
              <div className="space-y-3">
                {filteredMosques.map((mosque) => (
                  <MosqueCardWithPrayer key={mosque.id} mosque={mosque} />
                ))}
              </div>
            )}
          </div>
        </div>
      </PullToRefresh>
    </MobileLayout>
  );
};

export default FavoritesPage;
