import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const BANGALORE_TIMEZONE = 'Asia/Kolkata';

export const useBangaloreTime = () => {
  const [currentTime, setCurrentTime] = useState(() => {
    return toZonedTime(new Date(), BANGALORE_TIMEZONE);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(toZonedTime(new Date(), BANGALORE_TIMEZONE));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedTime = format(currentTime, 'h:mm a');
  const formattedDate = format(currentTime, 'EEEE, d MMMM');

  return {
    currentTime,
    formattedTime,
    formattedDate,
    timezone: BANGALORE_TIMEZONE,
  };
};
