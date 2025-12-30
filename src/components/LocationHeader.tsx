import React from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LocationHeaderProps {
  location: string;
  subtext?: string;
}

export const LocationHeader: React.FC<LocationHeaderProps> = ({ location, subtext }) => {
  return (
    <Link 
      to="/location"
      className="flex items-center gap-2 mx-4 px-3 py-2.5 bg-card hover:bg-muted/30 transition-colors rounded-xl border border-border/50 shadow-sm active:scale-[0.99]"
    >
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <MapPin size={16} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Your Location</p>
        <div className="flex items-center gap-1">
          <span className="text-sm font-semibold text-foreground truncate">
            {location}
          </span>
          <ChevronDown size={14} className="text-muted-foreground flex-shrink-0" />
        </div>
      </div>
    </Link>
  );
};