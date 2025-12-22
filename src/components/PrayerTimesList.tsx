import React from 'react';
import { IqamahTimes, PrayerName } from '@/types';
import { cn } from '@/lib/utils';

interface PrayerTimesListProps {
  times: IqamahTimes;
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
  times, 
  currentPrayer,
  compact = false 
}) => {
  return (
    <div className={cn("space-y-2", compact && "space-y-1.5")}>
      {prayers.map(({ key, label, arabicLabel }) => {
        const isActive = currentPrayer === key;
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
            <p className={cn(
              "font-bold tabular-nums",
              isActive ? "text-primary" : "text-foreground",
              compact ? "text-sm" : "text-base"
            )}>
              {times[key]}
            </p>
          </div>
        );
      })}
    </div>
  );
};
