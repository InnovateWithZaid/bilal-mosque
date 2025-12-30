import { useMemo } from 'react';
import { parse, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { PrayerName, IqamahTimes } from '@/types';

const PRAYER_ORDER: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

interface NextPrayerResult {
  prayer: PrayerName;
  time: string;
  countdown: string;
  minutesUntil: number;
}

const parseTimeToDate = (timeStr: string, referenceDate: Date): Date => {
  // Parse time like "5:30 AM" or "1:15 PM"
  return parse(timeStr, 'h:mm a', referenceDate);
};

export const useNextPrayer = (
  iqamahTimes: IqamahTimes,
  currentTime: Date
): NextPrayerResult => {
  return useMemo(() => {
    const now = currentTime;
    
    // Find the next prayer
    for (const prayer of PRAYER_ORDER) {
      const prayerTime = parseTimeToDate(iqamahTimes[prayer], now);
      const diffMinutes = differenceInMinutes(prayerTime, now);
      const diffSeconds = differenceInSeconds(prayerTime, now);
      
      if (diffSeconds > 0) {
        // This prayer is upcoming
        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;
        
        let countdown: string;
        if (hours > 0) {
          countdown = `${hours}h ${minutes}m`;
        } else if (diffMinutes > 0) {
          countdown = `${diffMinutes} min`;
        } else {
          const secs = diffSeconds % 60;
          countdown = `${secs}s`;
        }
        
        return {
          prayer,
          time: iqamahTimes[prayer],
          countdown,
          minutesUntil: diffMinutes,
        };
      }
    }
    
    // All prayers passed, next is Fajr tomorrow
    const fajrTime = parseTimeToDate(iqamahTimes.fajr, now);
    const tomorrowFajr = new Date(fajrTime);
    tomorrowFajr.setDate(tomorrowFajr.getDate() + 1);
    
    const diffMinutes = differenceInMinutes(tomorrowFajr, now);
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    return {
      prayer: 'fajr' as PrayerName,
      time: iqamahTimes.fajr,
      countdown: `${hours}h ${minutes}m`,
      minutesUntil: diffMinutes,
    };
  }, [iqamahTimes, currentTime]);
};
