import React from 'react';
import { Clock, Navigation, Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mosque, PrayerName } from '@/types';
import { Link } from 'react-router-dom';

interface NextJamaahCardProps {
  mosque: Mosque;
  prayer: PrayerName;
  countdown: string;
}

const prayerLabels: Record<PrayerName, string> = {
  fajr: 'Fajr',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

export const NextJamaahCard: React.FC<NextJamaahCardProps> = ({ 
  mosque, 
  prayer,
  countdown 
}) => {
  return (
    <Card variant="gold" className="overflow-hidden animate-fade-in">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-5 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">
                Upcoming Jama'ah (Preview)
              </p>
              <h3 className="text-2xl font-bold text-foreground">
                {prayerLabels[prayer]}
              </h3>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 text-primary">
                <Clock size={16} />
                <span className="text-sm font-semibold">
                  {mosque.iqamahTimes[prayer]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Countdown */}
        <div className="px-5 pb-4">
          <div className="bg-muted/50 rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground mb-1">Starts in</p>
            <p className="text-3xl font-bold text-gradient-gold font-arabic">
              {countdown}
            </p>
          </div>
        </div>

        {/* Mosque Info */}
        <div className="px-5 pb-4">
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
              <Building2 size={20} className="text-secondary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">{mosque.name}</p>
              <p className="text-xs text-muted-foreground">
                {mosque.distance} km away
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Link to="/map" className="flex-1">
            <Button variant="outline" className="w-full text-sm" size="default">
              <Navigation size={16} className="shrink-0" />
              <span className="truncate">View on Map</span>
            </Button>
          </Link>
          <Link to={`/mosque/${mosque.id}`} className="flex-1">
            <Button variant="gold" className="w-full text-sm" size="default">
              <Building2 size={16} className="shrink-0" />
              <span className="truncate">View Mosque</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
