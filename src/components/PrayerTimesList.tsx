import React from 'react';
import { IqamahTimes, AthanTimes, PrayerName } from '@/types';
import { cn } from '@/lib/utils';

interface PrayerTimesListProps {
  athanTimes: AthanTimes;
  iqamahTimes: IqamahTimes;
  currentPrayer?: PrayerName;
  compact?: boolean;
}

const prayers: { key: PrayerName; label: string; arabicLabel: string }[] = [
  { key: 'fajr', label: 'Fajr', arabicLabel: 'الفجر' },
  { key: 'dhuhr', label: 'Dhuhr', arabicLabel: 'الظهر' },
  { key: 'asr', label: 'Asr', arabicLabel: 'العصر' },
  { key: 'maghrib', label: 'Maghrib', arabicLabel: 'المغرب' },
  { key: 'isha', label: 'Isha', arabicLabel: 'العشاء' },
];

export const PrayerTimesList: React.FC<PrayerTimesListProps> = ({ 
  athanTimes,
  iqamahTimes, 
  currentPrayer,
  compact = false 
}) => {
  return (
    <div className={cn("space-y-2", compact && "space-y-1.5")}>
      {/* Header Row */}
      <div className="flex items-center justify-between px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <span>Prayer</span>
        <div className="flex items-center gap-6">
          <span className="w-16 text-center">Athan</span>
          <span className="w-16 text-center">Iqamah</span>
        </div>
      </div>
      
      {prayers.map(({ key, label, arabicLabel }) => {
        const isActive = currentPrayer === key;
        const hasAthan = athanTimes[key] !== '';
        const hasIqamah = iqamahTimes[key] !== '';
        
        if (!hasAthan && !hasIqamah) return null;
        
        return (
          <div
            key={key}
            className={cn(
              "flex items-center justify-between p-3 rounded-xl transition-all duration-200",
              isActive 
                ? "bg-primary/10 border border-primary/30" 
                : "bg-muted/30 hover:bg-muted/50",
              compact && "p-2.5"
            )}
          >
            <div className="flex items-center gap-3">
              <div 
                className={cn(
                  "w-2 h-2 rounded-full",
                  isActive ? "bg-primary animate-pulse-soft" : "bg-muted-foreground/30"
                )}
              />
              <div>
                <p className={cn(
                  "font-semibold text-foreground",
                  compact && "text-sm"
                )}>
                  {label}
                </p>
                <p className="text-xs text-muted-foreground font-arabic">
                  {arabicLabel}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <p className={cn(
                "w-16 text-center tabular-nums text-muted-foreground",
                compact ? "text-sm" : "text-base"
              )}>
                {hasAthan ? athanTimes[key] : '—'}
              </p>
              <p className={cn(
                "w-16 text-center font-bold tabular-nums",
                isActive ? "text-primary" : "text-foreground",
                compact ? "text-sm" : "text-base"
              )}>
                {hasIqamah ? iqamahTimes[key] : '—'}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
