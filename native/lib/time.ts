import { differenceInMinutes, differenceInSeconds, parse } from "date-fns";

import type { IqamahTimes, PrayerName } from "@/types";

const PRAYER_ORDER: PrayerName[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

export type NextPrayerResult = {
  prayer: PrayerName;
  time: string;
  countdown: string;
  minutesUntil: number;
};

function parseTimeToDate(time: string, referenceDate: Date): Date | null {
  if (!time.trim()) {
    return null;
  }

  try {
    return parse(time, "h:mm a", referenceDate);
  } catch {
    return null;
  }
}

export function getNextPrayer(iqamahTimes: IqamahTimes, currentTime: Date): NextPrayerResult {
  for (const prayer of PRAYER_ORDER) {
    const parsed = parseTimeToDate(iqamahTimes[prayer], currentTime);
    if (!parsed) {
      continue;
    }

    const diffMinutes = differenceInMinutes(parsed, currentTime);
    const diffSeconds = differenceInSeconds(parsed, currentTime);

    if (diffSeconds > 0) {
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      const countdown =
        hours > 0 ? `${hours}h ${minutes}m` : diffMinutes > 0 ? `${diffMinutes} min` : `${diffSeconds % 60}s`;

      return {
        prayer,
        time: iqamahTimes[prayer],
        countdown,
        minutesUntil: diffMinutes,
      };
    }
  }

  const fallbackPrayer = PRAYER_ORDER.find((prayer) => iqamahTimes[prayer]) ?? "fajr";
  const fallbackTime = iqamahTimes[fallbackPrayer] || "5:30 AM";
  const fallbackParsed = parseTimeToDate(fallbackTime, currentTime) ?? new Date(currentTime);
  fallbackParsed.setDate(fallbackParsed.getDate() + 1);
  const diffMinutes = Math.max(differenceInMinutes(fallbackParsed, currentTime), 0);

  return {
    prayer: fallbackPrayer,
    time: fallbackTime,
    countdown: `${Math.floor(diffMinutes / 60)}h ${diffMinutes % 60}m`,
    minutesUntil: diffMinutes,
  };
}
