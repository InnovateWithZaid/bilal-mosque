import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Navigation, Heart, Flag, Clock, Calendar, Bell, Users, ExternalLink, Car, Droplets, Accessibility, Baby, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PrayerTimesList } from '@/components/PrayerTimesList';
import { mockMosques, mockAnnouncements } from '@/data/mockData';
import { AnnouncementCard } from '@/components/AnnouncementCard';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const getPlaceTypeIcon = (type: string) => {
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

const getPlaceTypeLabel = (type: string) => {
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

  const { features, facilities } = mosque;

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({
      title: isFollowing ? "Unfollowed" : "Following",
      description: isFollowing 
        ? `You'll no longer receive updates from ${mosque.name}`
        : `You'll receive updates from ${mosque.name}`,
    });
  };

  const getParkingLabel = (parking: string) => {
    switch (parking) {
      case 'available':
        return 'Car Parking Available';
      case 'limited':
        return 'Limited Parking';
      case 'none':
        return 'No Parking';
      default:
        return '';
    }
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
              "w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 text-3xl",
              mosque.type === 'mosque' ? "bg-primary/10" : 
              mosque.type === 'eidgah' ? "bg-amber-500/10" : "bg-secondary/10"
            )}>
              {getPlaceTypeIcon(mosque.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-foreground">{mosque.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">{mosque.address}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge 
                  variant={mosque.type === 'mosque' ? 'default' : 'secondary'}
                  className={cn(
                    mosque.type === 'eidgah' && "border-amber-500/30 text-amber-600 bg-amber-500/10"
                  )}
                >
                  {getPlaceTypeIcon(mosque.type)} {getPlaceTypeLabel(mosque.type)}
                </Badge>
                {features.eidPrayer && (
                  <Badge variant="outline" className="border-secondary/30 text-secondary">
                    Eid Available
                  </Badge>
                )}
                {features.janazah && (
                  <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">
                    Janazah
                  </Badge>
                )}
              </div>
              
              {/* Musallah helper text */}
              {mosque.type === 'musallah' && (
                <p className="text-xs text-muted-foreground mt-2 italic">
                  Congregation availability varies
                </p>
              )}
              
              {/* Eidgah helper text */}
              {mosque.type === 'eidgah' && (
                <p className="text-xs text-muted-foreground mt-2 italic">
                  Eid adhan only · Khutbah included
                </p>
              )}
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

        {/* Iqamah Times - Only show if dailyCongregation is true */}
        {features.dailyCongregation && (
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
        )}

        {/* Jummah Times - Only show if jummah is true */}
        {features.jummah && mosque.jummahTimes.length > 0 && (
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

        {/* Eid Times - Only show if eidPrayer is true */}
        {features.eidPrayer && mosque.eidTimes && mosque.eidTimes.length > 0 && (
          <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardContent className="p-5">
                <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  🌙 Eid Prayer
                </h2>
                <div className="flex flex-wrap gap-2">
                  {mosque.eidTimes.map((time, index) => (
                    <div 
                      key={index}
                      className="bg-amber-500/10 rounded-lg px-4 py-2"
                    >
                      <p className="text-xs text-muted-foreground">Jama'ah {index + 1}</p>
                      <p className="font-bold text-foreground">{time}</p>
                    </div>
                  ))}
                </div>
                {features.eidAdhanOnly && (
                  <p className="text-xs text-muted-foreground mt-3 italic">
                    Eid adhan only · Khutbah included
                  </p>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {/* Facilities - Only show for Mosques */}
        {mosque.type === 'mosque' && facilities && (
          <section className="animate-fade-in" style={{ animationDelay: '0.25s' }}>
            <Card variant="elevated">
              <CardContent className="p-5">
                <h2 className="text-base font-semibold text-foreground mb-4">
                  Facilities
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {facilities.ablution && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Droplets size={16} className="text-primary" />
                      <span>Ablution (Wudhu)</span>
                    </div>
                  )}
                  {facilities.carParking !== 'none' && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Car size={16} className="text-primary" />
                      <span>{getParkingLabel(facilities.carParking)}</span>
                    </div>
                  )}
                  {facilities.womensArea && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Baby size={16} className="text-primary" />
                      <span>Women's Area</span>
                    </div>
                  )}
                  {facilities.accessibility && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Accessibility size={16} className="text-primary" />
                      <span>Accessibility</span>
                    </div>
                  )}
                  {facilities.iftaar && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <UtensilsCrossed size={16} className="text-primary" />
                      <span>Iftaar (Ramadan)</span>
                    </div>
                  )}
                  {features.janazah && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="text-base">🤲</span>
                      <span>Janazah Conducted</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Community Section - Only show for mosques */}
        {mosque.type === 'mosque' && (
          <section className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
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
        )}
      </div>
    </div>
  );
};

export default MosqueDetailPage;
