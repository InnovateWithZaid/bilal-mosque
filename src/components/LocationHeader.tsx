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
      className="flex items-center gap-4 mx-4 px-5 py-4 bg-card hover:bg-muted/30 transition-all duration-200 rounded-2xl border border-border/50 shadow-sm active:scale-[0.98]"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <MapPin size={22} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-0.5">Your Location</p>
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-foreground truncate">
            {location}
          </span>
        </div>
      </div>
      <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center flex-shrink-0">
        <ChevronDown size={16} className="text-muted-foreground" />
      </div>
    </Link>
  );
};