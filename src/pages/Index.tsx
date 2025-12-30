import React from 'react';
import { Clock } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { LocationHeader } from '@/components/LocationHeader';
import { NextJamaahCard } from '@/components/NextJamaahCard';
import { MosqueCard } from '@/components/MosqueCard';
import { mockMosques } from '@/data/mockData';
import { useBangaloreTime } from '@/hooks/useBangaloreTime';

const Index: React.FC = () => {
  const nearestMosque = mockMosques[0];
  const { formattedTime, formattedDate } = useBangaloreTime();

  return (
    <MobileLayout>
      <div className="safe-top">
        {/* Header */}
        <header className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-xl font-bold text-foreground">
                بِلَال
              </h1>
              <p className="text-xs text-muted-foreground font-arabic">
                Find your next jama'ah
              </p>
              <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                Preview version · Bangalore demo data only
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-primary">
                <Clock size={14} />
                <span className="text-sm font-semibold">{formattedTime}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
        </header>

        {/* Location Selector */}
        <LocationHeader 
          location="Bangalore, Karnataka" 
          subtext="Tap to change location"
        />

        {/* Main Content */}
        <div className="px-4 pt-4 space-y-6">
          {/* Next Jama'ah Card */}
          <section>
            <NextJamaahCard
              mosque={nearestMosque}
              prayer="asr"
              countdown="12 minutes"
            />
            <p className="text-xs text-muted-foreground text-center mt-2">
              Please confirm timings with the local mosque.
            </p>
          </section>

          {/* Nearby Mosques */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-foreground">
                Nearby Mosques
              </h2>
              <span className="text-xs text-muted-foreground">
                {mockMosques.length} found
              </span>
            </div>
            <div className="space-y-3">
              {mockMosques.slice(0, 3).map((mosque) => (
                <MosqueCard
                  key={mosque.id}
                  mosque={mosque}
                  nextPrayer="Asr"
                  nextTime={mosque.iqamahTimes.asr}
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
