import React from 'react';
import { Building2, MapPin, Clock, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mosque } from '@/types';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MosqueCardProps {
  mosque: Mosque;
  nextPrayer?: string;
  nextTime?: string;
}

export const MosqueCard: React.FC<MosqueCardProps> = ({ 
  mosque, 
  nextPrayer,
  nextTime 
}) => {
  return (
    <Link to={`/mosque/${mosque.id}`}>
      <Card variant="interactive" className="animate-fade-in">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
              mosque.type === 'mosque' 
                ? "bg-primary/10" 
                : "bg-secondary/10"
            )}>
              <Building2 
                size={24} 
                className={mosque.type === 'mosque' ? "text-primary" : "text-secondary"} 
              />
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
                <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                  {mosque.type === 'mosque' ? 'Mosque' : 'Musallah'}
                </Badge>
                {mosque.jummahTimes.length > 0 && (
                  <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-primary/30 text-primary">
                    Jummah
                  </Badge>
                )}
                {mosque.eidAvailable && (
                  <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-secondary/30 text-secondary">
                    Eid
                  </Badge>
                )}
              </div>

              {/* Next Prayer */}
              {nextPrayer && nextTime && (
                <div className="flex items-center gap-1.5 mt-3 text-xs">
                  <Clock size={12} className="text-primary" />
                  <span className="text-muted-foreground">
                    {nextPrayer}:
                  </span>
                  <span className="font-semibold text-foreground">
                    {nextTime}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
