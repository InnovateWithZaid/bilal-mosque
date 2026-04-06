import { useMemo } from "react";

import { getNextPrayer, type NextPrayerResult } from "@/lib/time";
import type { IqamahTimes } from "@/types";

export const useNextPrayer = (
  iqamahTimes: IqamahTimes,
  currentTime: Date
): NextPrayerResult => {
  return useMemo(() => {
    return getNextPrayer(iqamahTimes, currentTime);
  }, [iqamahTimes, currentTime]);
};
