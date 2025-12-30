import React from 'react';
import { MessageSquare, Clock, AlertTriangle, Bell, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Announcement, AnnouncementType } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface AnnouncementCardProps {
  announcement: Announcement;
}

const typeConfig: Record<AnnouncementType, { 
  label: string; 
  icon: React.ElementType;
  color: string;
  bgColor: string;
}> = {
  talk: { 
    label: 'Islamic Talk', 
    icon: MessageSquare,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  salah_update: { 
    label: 'Salah Update', 
    icon: Clock,
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
  },
  janazah: { 
    label: 'Janazah', 
    icon: AlertTriangle,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
  notice: { 
    label: 'Notice', 
    icon: Bell,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
  },
};

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement }) => {
  const config = typeConfig[announcement.type];
  const Icon = config.icon;

  return (
    <Card variant="elevated" className="animate-fade-in">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
            config.bgColor
          )}>
            <Icon size={20} className={config.color} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-[10px] px-2 py-0.5",
                  config.color,
                  config.bgColor
                )}
              >
                {config.label}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {format(announcement.createdAt, 'MMM d, h:mm a')}
              </span>
            </div>
            <h3 className="font-semibold text-foreground mt-2">
              {announcement.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
          {announcement.description}
        </p>

        {/* Event Time */}
        {announcement.eventTime && (
          <div className="flex items-center gap-2 mt-3 p-2.5 bg-muted/30 rounded-lg">
            <Calendar size={14} className="text-primary" />
            <span className="text-xs font-medium text-foreground">
              {format(announcement.eventTime, 'EEEE, MMMM d • h:mm a')}
            </span>
          </div>
        )}

        {/* Janazah disclaimer */}
        {announcement.type === 'janazah' && (
          <p className="text-[10px] text-muted-foreground/70 mt-3 text-center">
            Please confirm details with the mosque.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
