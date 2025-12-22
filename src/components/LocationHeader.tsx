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
      className="flex items-center gap-2 px-4 py-3 hover:bg-muted/50 transition-colors rounded-xl active:scale-[0.98]"
    >
      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
        <MapPin size={18} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-sm font-semibold text-foreground truncate">
            {location}
          </span>
          <ChevronDown size={16} className="text-muted-foreground flex-shrink-0" />
        </div>
        {subtext && (
          <p className="text-xs text-muted-foreground truncate">{subtext}</p>
        )}
      </div>
    </Link>
  );
};
