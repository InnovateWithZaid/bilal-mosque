import React from 'react';
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
import { useFavorites } from '@/contexts/FavoritesContext';
import MosqueIcon from '@/components/icons/MosqueIcon';

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
  const { isFavorite, toggleFavorite } = useFavorites();

  const mosque = mockMosques.find((m) => m.id === id);
  const announcements = mockAnnouncements.filter((a) => a.mosqueId === id).slice(0, 2);

  if (!mosque) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-muted-foreground">Mosque not found</p>
      </div>
    );
  }

  const { features, facilities } = mosque;
  const isFollowing = isFavorite(mosque.id);

  const handleFollow = () => {
    toggleFavorite(mosque.id);
    toast({
      title: isFollowing ? "Removed from favorites" : "Added to favorites",
      description: isFollowing 
        ? `${mosque.name} removed from your favorites`
        : `${mosque.name} added to your favorites`,
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
    <div className="min-h-screen bg-surface safe-top pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-background/95 backdrop-blur-xl z-10 border-b border-border shadow-soft">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted" onClick={() => navigate(-1)}>
            <ArrowLeft size={22} className="text-foreground" />
          </Button>
          <div className="flex gap-2">
            <Button 
              variant={isFollowing ? "default" : "outline"} 
              size="icon"
              className="rounded-xl"
              onClick={handleFollow}
            >
              <Heart size={18} className={cn(isFollowing && "fill-current")} />
            </Button>
            <Link to={`/mosque/${id}/report`}>
              <Button variant="outline" size="icon" className="rounded-xl">
                <Flag size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="px-4 py-5 space-y-5">
        {/* Mosque Info */}
        <section className="animate-fade-in">
          <div className="flex items-start gap-4">
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-soft",
              mosque.type === 'mosque' ? "bg-primary/10" : 
              mosque.type === 'eidgah' ? "bg-amber-500/10" : "bg-secondary/10"
            )}>
              <MosqueIcon 
                size={32} 
                className={cn(
                  mosque.type === 'mosque' ? "text-primary" : 
                  mosque.type === 'eidgah' ? "text-amber-500" : "text-secondary-foreground"
                )} 
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-foreground">{mosque.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">{mosque.address}</p>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <Badge 
                  variant={mosque.type === 'mosque' ? 'default' : 'secondary'}
                  className={cn(
                    "rounded-full gap-1.5",
                    mosque.type === 'eidgah' && "border-amber-500/30 text-amber-600 bg-amber-500/10"
                  )}
                >
                  <MosqueIcon size={12} />
                  {getPlaceTypeLabel(mosque.type)}
                </Badge>
                {features.eidPrayer && (
                  <Badge variant="outline" className="rounded-full border-cyan/30 text-cyan bg-cyan/5">
                    Eid Available
                  </Badge>
                )}
                {features.janazah && (
                  <Badge variant="outline" className="rounded-full border-muted-foreground/30 text-muted-foreground">
                    Janazah
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
            className="block mt-5"
          >
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-md" size="lg">
              <Navigation size={18} />
              Navigate ({mosque.distance} km away)
              <ExternalLink size={14} />
            </Button>
          </a>
        </section>

        {/* Iqamah Times - Only show if dailyCongregation is true */}
        {features.dailyCongregation && (
          <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <Card className="bg-card border border-border rounded-3xl shadow-soft">
              <CardContent className="p-5">
                <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Clock size={16} className="text-primary" />
                  </div>
                  Prayer Times
                </h2>
                <PrayerTimesList 
                  athanTimes={mosque.athanTimes} 
                  iqamahTimes={mosque.iqamahTimes} 
                  currentPrayer="asr" 
                />
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
            <Card className="bg-card border border-primary/20 rounded-3xl shadow-soft">
              <CardContent className="p-5">
                <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar size={16} className="text-primary" />
                  </div>
                  Jummah Prayer
                </h2>
                <div className="flex flex-wrap gap-2">
                  {mosque.jummahTimes.map((time, index) => (
                    <div 
                      key={index}
                      className="bg-muted rounded-xl px-4 py-3"
                    >
                      <p className="text-xs text-muted-foreground">Khutbah {index + 1}</p>
                      <p className="font-bold text-foreground text-lg">{time}</p>
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
            <Card className="border-amber-500/20 bg-amber-50 rounded-3xl shadow-soft">
              <CardContent className="p-5">
                <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    🌙
                  </div>
                  Eid Prayer
                </h2>
                <div className="flex flex-wrap gap-2">
                  {mosque.eidTimes.map((time, index) => (
                    <div 
                      key={index}
                      className="bg-amber-500/10 rounded-xl px-4 py-3"
                    >
                      <p className="text-xs text-muted-foreground">Jama'ah {index + 1}</p>
                      <p className="font-bold text-foreground text-lg">{time}</p>
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
            <Card className="bg-card border border-border rounded-3xl shadow-soft">
              <CardContent className="p-5">
                <h2 className="text-base font-semibold text-foreground mb-4">
                  Facilities
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {facilities.ablution && (
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                      <Droplets size={18} className="text-primary" />
                      <span className="text-sm text-foreground">Ablution (Wudhu)</span>
                    </div>
                  )}
                  {facilities.carParking !== 'none' && (
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                      <Car size={18} className="text-primary" />
                      <span className="text-sm text-foreground">{getParkingLabel(facilities.carParking)}</span>
                    </div>
                  )}
                  {facilities.womensArea && (
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                      <Baby size={18} className="text-primary" />
                      <span className="text-sm text-foreground">Women's Area</span>
                    </div>
                  )}
                  {facilities.accessibility && (
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                      <Accessibility size={18} className="text-primary" />
                      <span className="text-sm text-foreground">Accessibility</span>
                    </div>
                  )}
                  {facilities.iftaar && (
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                      <UtensilsCrossed size={18} className="text-primary" />
                      <span className="text-sm text-foreground">Iftaar (Ramadan)</span>
                    </div>
                  )}
                  {features.janazah && (
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                      <span className="text-lg">🤲</span>
                      <span className="text-sm text-foreground">Janazah Conducted</span>
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
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Bell size={16} className="text-primary" />
                </div>
                Community Updates
              </h2>
              <Link to={`/mosque/${id}/community`}>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/5 rounded-xl">
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
              <Card className="bg-card border border-border rounded-3xl shadow-soft">
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