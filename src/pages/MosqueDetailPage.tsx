import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Navigation, Heart, Flag, Clock, Calendar, Bell, Users, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PrayerTimesList } from '@/components/PrayerTimesList';
import { mockMosques, mockAnnouncements } from '@/data/mockData';
import { AnnouncementCard } from '@/components/AnnouncementCard';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const MosqueDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);

  const mosque = mockMosques.find((m) => m.id === id);
  const announcements = mockAnnouncements.filter((a) => a.mosqueId === id).slice(0, 2);

  if (!mosque) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Mosque not found</p>
      </div>
    );
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing 
        ? `You'll no longer receive updates from ${mosque.name}`
        : `You'll receive updates from ${mosque.name}`,
    });
  };

  return (
    <div className="min-h-screen bg-background safe-top pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-xl z-10 border-b border-border">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} />
          </Button>
          <div className="flex gap-2">
            <Button 
              variant={isFollowing ? "default" : "outline"} 
              size="icon"
              onClick={handleFollow}
            >
              <Heart size={18} className={cn(isFollowing && "fill-current")} />
            </Button>
            <Link to={`/mosque/${id}/report`}>
              <Button variant="outline" size="icon">
                <Flag size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="px-4 py-4 space-y-6">
        {/* Mosque Info */}
        <section className="animate-fade-in">
          <div className="flex items-start gap-4">
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0",
              mosque.type === 'mosque' ? "bg-primary/10" : "bg-secondary/10"
            )}>
              <span className="text-3xl font-arabic text-primary">🕌</span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-foreground">{mosque.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">{mosque.address}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge variant="secondary">
                  {mosque.type === 'mosque' ? 'Mosque' : 'Musallah'}
                </Badge>
                {mosque.eidAvailable && (
                  <Badge variant="outline" className="border-secondary/30 text-secondary">
                    Eid Available
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Navigate Button */}
          <a 
            href={`https://www.google.com/maps/dir/?api=1&destination=${mosque.lat},${mosque.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-4"
          >
            <Button variant="teal" className="w-full" size="lg">
              <Navigation size={18} />
              Navigate ({mosque.distance} km away)
              <ExternalLink size={14} />
            </Button>
          </a>
        </section>

        {/* Iqamah Times */}
        <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <Card variant="elevated">
            <CardContent className="p-5">
              <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock size={18} className="text-primary" />
                Iqamah Times
              </h2>
              <PrayerTimesList times={mosque.iqamahTimes} currentPrayer="asr" />
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Last updated: Today
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Jummah Times */}
        {mosque.jummahTimes.length > 0 && (
          <section className="animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <Card variant="gold">
              <CardContent className="p-5">
                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Calendar size={18} className="text-primary" />
                  Jummah Prayer
                </h2>
                <div className="flex flex-wrap gap-2">
                  {mosque.jummahTimes.map((time, index) => (
                    <div 
                      key={index}
                      className="bg-muted/50 rounded-lg px-4 py-2"
                    >
                      <p className="text-xs text-muted-foreground">Khutbah {index + 1}</p>
                      <p className="font-bold text-foreground">{time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Community Section */}
        <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Bell size={18} className="text-primary" />
              Community Updates
            </h2>
            <Link to={`/mosque/${id}/community`}>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
          
          {announcements.length > 0 ? (
            <div className="space-y-3">
              {announcements.map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))}
            </div>
          ) : (
            <Card variant="elevated">
              <CardContent className="p-6 text-center">
                <Users size={32} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  No announcements yet
                </p>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
};

export default MosqueDetailPage;
