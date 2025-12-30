import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { Mosque, PrayerName } from '@/types';
import { Link } from 'react-router-dom';
import mosqueHero from '@/assets/mosque-hero.jpg';

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
    <Link to={`/mosque/${mosque.id}`}>
      <div className="relative overflow-hidden rounded-3xl shadow-lg animate-fade-in group">
        {/* Background Image */}
        <div className="relative h-48">
          <img 
            src={mosqueHero} 
            alt="Mosque"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          
          {/* Content Overlay */}
          <div className="absolute inset-0 p-5 flex flex-col justify-between">
            {/* Top - Countdown as main focus */}
            <div>
              <p className="text-white/80 text-xs font-medium uppercase tracking-wider mb-1">
                {prayerLabels[prayer]} in
              </p>
              <p className="text-white text-5xl font-bold tracking-tight">
                {countdown}
              </p>
            </div>
            
            {/* Bottom - Prayer Time & Mosque */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock size={14} className="text-white" />
                <span className="text-white text-lg font-semibold">
                  {mosque.iqamahTimes[prayer]}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2">
                  <span className="text-white text-sm font-medium truncate max-w-[180px]">
                    {mosque.name}
                  </span>
                  <ChevronRight size={14} className="text-white/80 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};