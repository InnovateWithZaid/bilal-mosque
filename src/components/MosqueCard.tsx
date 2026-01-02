import React from 'react';
import { MapPin, Clock, ChevronRight, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mosque } from '@/types';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useToast } from '@/hooks/use-toast';
import MosqueIcon from '@/components/icons/MosqueIcon';

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
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  const favorited = isFavorite(mosque.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(mosque.id);
    toast({
      title: favorited ? "Removed from favorites" : "Added to favorites",
      description: favorited 
        ? `${mosque.name} removed from your favorites`
        : `${mosque.name} added to your favorites`,
    });
  };

  return (
    <Link to={`/mosque/${mosque.id}`}>
      <div className="bg-card rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden animate-fade-in border border-border/50 relative">
        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={handleFavoriteClick}
        >
          <Heart 
            size={16} 
            className={cn(
              "transition-all duration-200",
              favorited 
                ? "fill-primary text-primary scale-110" 
                : "text-muted-foreground hover:text-primary"
            )} 
          />
        </Button>

        <div className="p-4 pr-12">
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
              <MosqueIcon 
                size={22} 
                className={cn(
                  mosque.type === 'mosque' 
                    ? "text-primary" 
                    : mosque.type === 'eidgah'
                    ? "text-amber-500"
                    : "text-primary/70"
                )} 
              />
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
            </div>
          </div>
        </div>

        {/* Next Prayer - Full width ribbon */}
        {features.dailyCongregation && mosque.type !== 'eidgah' && nextPrayer && iqamahTime && (
          <div className={cn(
            "flex items-center gap-3 text-xs rounded-xl px-4 py-2.5 mx-3 mb-3",
            isUrgent ? "bg-amber-500/10" : "bg-muted/50"
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
                "font-medium ml-auto",
                isUrgent 
                  ? "text-amber-500 font-bold animate-pulse" 
                  : "text-primary"
              )}>
                {countdown}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};