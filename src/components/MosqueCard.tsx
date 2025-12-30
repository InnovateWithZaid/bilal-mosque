import React from 'react';
import { MapPin, Clock, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Mosque } from '@/types';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MosqueCardProps {
  mosque: Mosque;
  nextPrayer?: string;
  athanTime?: string;
  iqamahTime?: string;
  countdown?: string;
  minutesUntil?: number;
}

const getPlaceTypeLabel = (type: Mosque['type']) => {
  switch (type) {
    case 'mosque':
      return 'Mosque';
    case 'musallah':
      return 'Musallah';
    case 'eidgah':
      return 'Eidgah';
    default:
      return 'Mosque';
  }
};

export const MosqueCard: React.FC<MosqueCardProps> = ({ 
  mosque, 
  nextPrayer,
  athanTime,
  iqamahTime,
  countdown,
  minutesUntil
}) => {
  const { features } = mosque;
  const isUrgent = minutesUntil !== undefined && minutesUntil <= 5 && minutesUntil >= 0;

  return (
    <Link to={`/mosque/${mosque.id}`}>
      <div className="bg-card rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden animate-fade-in border border-border/50">
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0",
              mosque.type === 'mosque' 
                ? "bg-primary/10" 
                : mosque.type === 'eidgah'
                ? "bg-amber-500/10"
                : "bg-primary/5"
            )}>
              <span className="text-xl">🕌</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground text-sm truncate">
                    {mosque.name}
                  </h3>
                  <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
                    <MapPin size={11} />
                    <p className="text-xs">{mosque.distance} km away</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-muted-foreground/50 flex-shrink-0 mt-0.5" />
              </div>

              {/* Tags */}
              <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                <Badge 
                  variant="secondary"
                  className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary border-0 font-medium"
                >
                  {getPlaceTypeLabel(mosque.type)}
                </Badge>
                {features.jummah && (
                  <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-muted text-muted-foreground border-0">
                    Jummah
                  </Badge>
                )}
                {features.eidPrayer && mosque.type !== 'eidgah' && (
                  <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-muted text-muted-foreground border-0">
                    Eid
                  </Badge>
                )}
              </div>

              {/* Next Prayer - Only show if dailyCongregation is true and not eidgah */}
              {features.dailyCongregation && mosque.type !== 'eidgah' && nextPrayer && iqamahTime && (
                <div className={cn(
                  "flex items-center gap-2 mt-3 text-xs bg-muted/50 rounded-lg px-2.5 py-2 w-fit",
                  isUrgent && "bg-amber-500/10"
                )}>
                  <Clock size={12} className={cn("text-primary", isUrgent && "text-amber-500")} />
                  <span className="text-muted-foreground font-medium">
                    {nextPrayer}:
                  </span>
                  {athanTime && (
                    <span className="text-muted-foreground">
                      {athanTime}
                    </span>
                  )}
                  {athanTime && iqamahTime && (
                    <span className="text-muted-foreground/50">→</span>
                  )}
                  <span className="font-bold text-foreground">
                    {iqamahTime}
                  </span>
                  {countdown && (
                    <span className={cn(
                      "font-medium ml-1",
                      isUrgent 
                        ? "text-amber-500 font-bold animate-pulse" 
                        : "text-primary"
                    )}>
                      · {countdown}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};