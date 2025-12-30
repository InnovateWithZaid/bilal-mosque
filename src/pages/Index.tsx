import React from 'react';
import { Clock, User } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { LocationHeader } from '@/components/LocationHeader';
import { NextJamaahCard } from '@/components/NextJamaahCard';
import { MosqueCard } from '@/components/MosqueCard';
import { mockMosques } from '@/data/mockData';
import { useBangaloreTime } from '@/hooks/useBangaloreTime';
import { useNextPrayer } from '@/hooks/useNextPrayer';
import { Mosque, PrayerName } from '@/types';
import { Link } from 'react-router-dom';

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

const Index: React.FC = () => {
  const nearestMosque = mockMosques[0];
  const { currentTime, formattedTime, formattedDate } = useBangaloreTime();
  const nextPrayer = useNextPrayer(nearestMosque.iqamahTimes, currentTime);

  return (
    <MobileLayout>
      <div className="safe-top">
        {/* Header */}
        <header className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <LocationHeader 
              location="Bangalore, Karnataka" 
            />
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <User size={18} className="text-primary" />
            </div>
          </div>
        </header>


        {/* Main Content */}
        <div className="px-4 space-y-6">
          {/* Next Jama'ah Card */}
          <section>
            <NextJamaahCard
              mosque={nearestMosque}
              prayer={nextPrayer.prayer}
              countdown={nextPrayer.countdown}
            />
          </section>

          {/* Nearby Mosques */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-foreground">
                Mosques
              </h2>
              <Link to="/mosques" className="text-xs text-primary font-medium">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {mockMosques.slice(0, 3).map((mosque) => (
                <MosqueCardWithPrayer
                  key={mosque.id}
                  mosque={mosque}
                  currentTime={currentTime}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Index;