import React from 'react';
import { Building2, MapPin, Clock, ChevronRight, Moon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mosque } from '@/types';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MosqueCardProps {
  mosque: Mosque;
  nextPrayer?: string;
  nextTime?: string;
  countdown?: string;
}

const getPlaceTypeIcon = (type: Mosque['type']) => {
  switch (type) {
    case 'mosque':
      return '🕌';
    case 'musallah':
      return '🧎';
    case 'eidgah':
      return '🌙';
    default:
      return '🕌';
  }
};

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

const getPlaceTypeVariant = (type: Mosque['type']) => {
  switch (type) {
    case 'mosque':
      return 'default';
    case 'musallah':
      return 'secondary';
    case 'eidgah':
      return 'outline';
    default:
      return 'default';
  }
};

export const MosqueCard: React.FC<MosqueCardProps> = ({ 
  mosque, 
  nextPrayer,
  nextTime,
  countdown
}) => {
  const { features } = mosque;

  return (
    <Link to={`/mosque/${mosque.id}`}>
      <Card variant="interactive" className="animate-fade-in">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl",
              mosque.type === 'mosque' 
                ? "bg-primary/10" 
                : mosque.type === 'eidgah'
                ? "bg-amber-500/10"
                : "bg-secondary/10"
            )}>
              {getPlaceTypeIcon(mosque.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {mosque.name}
                  </h3>
                  <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
                    <MapPin size={12} />
                    <p className="text-xs truncate">{mosque.distance} km</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-muted-foreground flex-shrink-0 mt-0.5" />
              </div>

              {/* Tags */}
              <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                <Badge 
                  variant={getPlaceTypeVariant(mosque.type) as any} 
                  className={cn(
                    "text-[10px] px-2 py-0.5",
                    mosque.type === 'eidgah' && "border-amber-500/30 text-amber-600"
                  )}
                >
                  {getPlaceTypeIcon(mosque.type)} {getPlaceTypeLabel(mosque.type)}
                </Badge>
                {features.jummah && (
                  <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-primary/30 text-primary">
                    Jummah
                  </Badge>
                )}
                {features.eidPrayer && mosque.type !== 'eidgah' && (
                  <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-secondary/30 text-secondary">
                    Eid
                  </Badge>
                )}
                {features.janazah && (
                  <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-muted-foreground/30 text-muted-foreground">
                    Janazah
                  </Badge>
                )}
              </div>


              {/* Next Prayer - Only show if dailyCongregation is true and not eidgah */}
              {features.dailyCongregation && mosque.type !== 'eidgah' && nextPrayer && nextTime && (
                <div className="flex items-center gap-1.5 mt-3 text-xs">
                  <Clock size={12} className="text-primary" />
                  <span className="text-muted-foreground">
                    {nextPrayer}:
                  </span>
                  <span className="font-semibold text-foreground">
                    {nextTime}
                  </span>
                  {countdown && (
                    <span className="text-primary font-medium ml-1">
                      · in {countdown}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
